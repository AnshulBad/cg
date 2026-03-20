$path = Join-Path $PSScriptRoot 'game.js'
$lines = [System.IO.File]::ReadAllLines($path)

$header = @(
  '// SCENARIOS are loaded from scenarios.js (included before this file)'
  'if (typeof SCENARIOS === "undefined") {'
  '  console.error("SCENARIOS not found! Make sure scenarios.js is loaded before game.js");'
  '}'
  ''
)

# Lines 0..5 = first 6 lines (comment header)
# Lines 190+ = const NPC_NAMES onward (0-indexed line 190 = file line 191)
$newContent = $lines[0..5] + $header + $lines[190..($lines.Length - 1)]
[System.IO.File]::WriteAllLines($path, $newContent)

Write-Host "Done. New file has $($newContent.Length) lines."
