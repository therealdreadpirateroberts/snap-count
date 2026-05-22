# Read mockData.ts
$mockDataPath = "c:\Users\loubr\.gemini\antigravity\scratch\snap-count\src\store\mockData.ts"
$mockDataContent = Get-Content -Path $mockDataPath -Raw

# Read scratch_players_code.txt
$playersCodePath = "C:\Users\loubr\.gemini\antigravity\scratch\snap-count\scratch_players_code.txt"
$playersCode = Get-Content -Path $playersCodePath -Raw

# Construct the new generateMockRankings function
$newFunction = "export const generateMockRankings = (): Player[] => {`r`n  return [`r`n" + $playersCode + "`r`n  ];`r`n};`r`n`r`n"

# Locate boundaries
$targetStart = "export const generateMockRankings = (): Player[] => {"
$targetEnd = "export const MOCK_NEWS"

$startIndex = $mockDataContent.IndexOf($targetStart)
$endIndex = $mockDataContent.IndexOf($targetEnd)

if ($startIndex -lt 0) {
    Write-Error "Could not find start boundary in mockData.ts"
    exit 1
}

if ($endIndex -lt 0) {
    Write-Error "Could not find end boundary in mockData.ts"
    exit 1
}

$before = $mockDataContent.Substring(0, $startIndex)
$after = $mockDataContent.Substring($endIndex)

$finalContent = $before + $newFunction + $after

# Write back to mockData.ts
[System.IO.File]::WriteAllText($mockDataPath, $finalContent, [System.Text.Encoding]::UTF8)

Write-Host "Successfully updated mockData.ts with the new top 250 ECR static consensus rankings and correct headshot IDs!"
