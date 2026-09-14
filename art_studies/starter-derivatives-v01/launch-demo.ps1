param([int]$Port = 8789, [string]$Python = 'python')
$studyRoot = $PSScriptRoot
$repoRoot = (Resolve-Path -LiteralPath (Join-Path $studyRoot '../..')).Path
Write-Host "Open http://127.0.0.1:$Port/art_studies/starter-derivatives-v01/demo/"
Write-Host 'Stop this local preview with Ctrl+C.'
& $Python -m http.server $Port --bind 127.0.0.1 --directory $repoRoot
