$jsonStr = Get-Content -Path "C:\Users\loubr\.gemini\antigravity\scratch\snap-count\scratch_ecr.json" -Raw
$parsed = ConvertFrom-Json $jsonStr

Write-Host "Total players in parsed JSON: $($parsed.players.Count)"

$top250 = $parsed.players | Sort-Object {[int]$_.rank_ecr} | Select-Object -First 250

$playersCode = @()

$positionCounts = @{
    "QB" = 0
    "RB" = 0
    "WR" = 0
    "TE" = 0
    "K" = 0
    "DST" = 0
}

# Mapping of teams to match our logo CDN and abbreviations
$teamMapping = @{
    "ari" = "ARI"; "atl" = "ATL"; "bal" = "BAL"; "buf" = "BUF"; "car" = "CAR"; "chi" = "CHI"
    "cin" = "CIN"; "cle" = "CLE"; "dal" = "DAL"; "den" = "DEN"; "gb"  = "GB";  "hou" = "HOU"
    "ind" = "IND"; "jax" = "JAX"; "jac" = "JAX"; "kc"  = "KC";  "lac" = "LAC"; "lar" = "LAR"
    "lv"  = "LV";  "mia" = "MIA"; "min" = "MIN"; "ne"  = "NE";  "no"  = "NO";  "nyg" = "NYG"
    "nyj" = "NYJ"; "phi" = "PHI"; "pit" = "PIT"; "sea" = "SEA"; "sf"  = "SF";  "tb"  = "TB"
    "ten" = "TEN"; "was" = "WAS"; "fa"  = "FA"
}

# Let's read the existing ESPN_ID_MAPPING from src/store/mockData.ts
$mockDataContent = Get-Content -Path "c:\Users\loubr\.gemini\antigravity\scratch\snap-count\src\store\mockData.ts" -Raw
$espnIds = @{
    # In case there are rookies, we'll map their ESPN IDs:
    "ashtonjeanty" = 4697920
    "omarionhampton" = 4683050
    "tetaroamcmillan" = 4686159
    "colstonloveland" = 4685387
    "lutherburdeniii" = 4683062
    "emekaegbuka" = 4431588
}

# Extract the mapping using regex from mockData.ts
$mappingMatches = [regex]::Matches($mockDataContent, "'([^']+)':\s*([0-9]+)")
foreach ($m in $mappingMatches) {
    $rawKey = $m.Groups[1].Value.ToLower()
    $normalizedKey = $rawKey.Replace("\'", "").Replace("'", "").Replace(".", "").Replace("-", "").Replace(" ", "")
    $espnIds[$normalizedKey] = $m.Groups[2].Value
}

Write-Host "Loaded $($espnIds.Count) ESPN player IDs from mockData.ts"

foreach ($p in $top250) {
    $rawName = $p.player_name.Trim()
    # Normalize name to lookup in ESPN mapping (stripping suffixes like Jr., III, II)
    $nameForLookup = $rawName.ToLower().Trim()
    $nameForLookup = $nameForLookup -replace '\s+(jr\.|sr\.|iii|ii|iv|v|v\.|ii\.|iii\.|jr|sr)$', ''
    $nameForLookup = $nameForLookup -replace "['`\-\.\s]", ""
    
    $espnId = "null"
    if ($espnIds.ContainsKey($nameForLookup)) {
        $espnId = $espnIds[$nameForLookup]
    }
    
    $pos = $p.player_position_id
    if ($pos -eq "DST" -or $pos -eq "DEF") {
        $pos = "DST"
    }
    
    $teamRaw = $p.player_team_id.ToLower()
    $team = "FA"
    if ($teamMapping.ContainsKey($teamRaw)) {
        $team = $teamMapping[$teamRaw]
    } else {
        $team = $p.player_team_id.ToUpper()
    }
    
    $bye = 0
    if ($p.player_bye_week -and $p.player_bye_week -ne "null") {
        $bye = [int]$p.player_bye_week
    }
    
    $positionCounts[$pos]++
    $posRank = "$pos$($positionCounts[$pos])"
    
    $halfPprRank = [int]$p.rank_ecr
    
    # Generate stable pseudo-random variance for ADP based on player name hash
    $nameHash = 0
    foreach ($char in $rawName.ToCharArray()) {
        $nameHash += [int]$char
    }
    $variance = ($nameHash % 9) - 4 # range -4 to +4
    # Scaled variance based on rank (more variance later in the draft)
    $rankFactor = [Math]::Min(3.0, ($halfPprRank / 50.0))
    $scaledVariance = [Math]::Round($variance * $rankFactor, 1)
    $adp = [Math]::Max(1.0, $halfPprRank + $scaledVariance)
    # PPR and Dynasty adjustments
    $pprShift = 0
    if ($pos -eq "WR") { $pprShift = -2 }
    elseif ($pos -eq "RB") { $pprShift = 2 }
    
    $pprRank = [Math]::Max(1, [Math]::Min(250, $halfPprRank + $pprShift))
    
    # Dynasty shift: boost young players, drop veterans
    $dynastyShift = 0
    $youthList = @('Caleb Williams', 'Jayden Daniels', 'Drake Maye', 'Bijan Robinson', 'Jahmyr Gibbs',
                  'Marvin Harrison Jr.', 'Malik Nabers', 'Rome Odunze', 'Jonathon Brooks', 'Trey Benson',
                  'Blake Corum', 'Ladd McConkey', 'Brian Thomas Jr.', 'Keon Coleman', 'Xavier Worthy',
                  'Sam LaPorta', 'Trey McBride', 'Dalton Kincaid', 'Brock Bowers', 'Ashton Jeanty', 'Omarion Hampton', 'Tetairoa McMillan', 'Colston Loveland', 'Luther Burden III', 'Emeka Egbuka')
                  
    $vetList = @('Aaron Rodgers', 'Kirk Cousins', 'Matthew Stafford', 'Derrick Henry', 'Ezekiel Elliott',
                'Davante Adams', 'Keenan Allen', 'Stefon Diggs', 'Tyler Lockett', 'DeAndre Hopkins',
                'Travis Kelce', 'Tyreek Hill')
                
    if ($youthList -contains $rawName) {
        $dynastyShift = -25
    } elseif ($vetList -contains $rawName) {
        $dynastyShift = 45
    }
    
    $dynastyRank = [Math]::Max(1, [Math]::Min(250, $halfPprRank + $dynastyShift))
    
    # Baseline projected points
    $qbBonus = 0
    if ($pos -eq "QB") { $qbBonus = 65 }
    $projectedPoints = [Math]::Round(330 - ($halfPprRank * 1.1) + $qbBonus)
    if ($projectedPoints -lt 20) { $projectedPoints = 20 }
    
    # Build expert ranks
    $expertRanksCode = "{"
    $experts = @('Andy', 'Mike', 'Jason')
    foreach ($exp in $experts) {
        $expBias = 0
        if ($exp -eq "Andy" -and $pos -eq "WR") { $expBias = -2 }
        if ($exp -eq "Mike" -and $rawName -eq "De'Von Achane") { $expBias = -5 }
        if ($exp -eq "Jason" -and $rawName -eq "Trey McBride") { $expBias = -6 }
        
        $expPpr = [Math]::Max(1, [Math]::Min(250, $pprRank + $expBias))
        $expHalfPpr = [Math]::Max(1, [Math]::Min(250, $halfPprRank + $expBias))
        $expDynasty = [Math]::Max(1, [Math]::Min(250, $dynastyRank + $expBias))
        
        $expertRanksCode += "`r`n      $exp` : { halfPpr: $expHalfPpr, ppr: $expPpr, dynasty: $expDynasty },"
    }
    $expertRanksCode += "`r`n    }"
    
    $playerObj = "  {`r`n    rank: $halfPprRank,`r`n    espnId: $espnId,`r`n    name: `"$rawName`",`r`n    position: `"$pos`",`r`n    team: `"$team`",`r`n    bye: $bye,`r`n    adp: $adp,`r`n    posRank: `"$posRank`",`r`n    projectedPoints: $projectedPoints,`r`n    draftedBy: null,`r`n    ranks: {`r`n      halfPpr: $halfPprRank,`r`n      ppr: $pprRank,`r`n      dynasty: $dynastyRank`r`n    },`r`n    expertRanks: $expertRanksCode`r`n  }"
    $playersCode += $playerObj
}

$playersJoined = [string]::Join(",`r`n", $playersCode)

# Output to a scratch file
$playersJoined | Out-File -FilePath "C:\Users\loubr\.gemini\antigravity\scratch\snap-count\scratch_players_code.txt" -Encoding utf8
Write-Host "Typescript player code successfully exported to scratch_players_code.txt!"
