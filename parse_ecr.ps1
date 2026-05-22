$content = Get-Content -Path "C:\Users\loubr\.gemini\antigravity\brain\7ea47e44-7141-4ffc-98cd-d646c27149b8\.system_generated\steps\661\content.md" -Raw

# Find the start of the ecrData JSON object
$startIndex = $content.IndexOf("ecrData = ")
if ($startIndex -ge 0) {
    $startIndex += 10 # Move past "ecrData = "
    
    # We want to find the matching closing bracket for the object.
    # Since it's a massive JSON, let's find the closing tag before accessed or similar.
    $endIndex = $content.IndexOf("accessed`":`"2026-05-20", $startIndex)
    if ($endIndex -ge 0) {
        # Find the next closing curly bracket + semicolon or closing curly bracket
        $endIndex = $content.IndexOf("};", $endIndex) + 1
        $jsonLength = $endIndex - $startIndex
        $jsonStr = $content.Substring($startIndex, $jsonLength).Trim()
        if ($jsonStr.EndsWith(";")) {
            $jsonStr = $jsonStr.Substring(0, $jsonStr.Length - 1).Trim()
        }
        
        $jsonStr | Out-File -FilePath "C:\Users\loubr\.gemini\antigravity\scratch\snap-count\scratch_ecr.json" -Encoding utf8
        Write-Host "Raw JSON extracted and written to scratch_ecr.json!"
        
        # Try parsing JSON to search for Tyreek
        try {
            $parsed = ConvertFrom-Json $jsonStr
            Write-Host "JSON parsed successfully!"
            $matches = $parsed.players | Where-Object { $_.player_name -match "Tyreek" }
            if ($matches) {
                $matches | ForEach-Object {
                    Write-Host "Found: $($_.rank_ecr): $($_.player_name) ($($_.player_position_id) - $($_.player_team_id))"
                }
            } else {
                Write-Host "Tyreek Hill not found in ECR list!"
            }
        } catch {
            Write-Error $_
        }
    } else {
        Write-Host "Could not find accessed timestamp"
    }
} else {
    Write-Host "Could not find 'ecrData = '"
}
