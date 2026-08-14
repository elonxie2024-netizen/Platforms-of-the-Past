$ErrorActionPreference = 'Stop'

$releases = [ordered]@{
  'v0.9.1'  = '4a7e227'
  'v0.9.0'  = 'a8c2f76'
  'v0.8.3'  = '40cf24c'
  'v0.8.1'  = 'edc97dd'
  'v0.8.0'  = 'fdaba75'
  'v0.7.6'  = '9cc5fc1'
  'v0.7.5'  = '6447b71'
  'v0.7.4'  = '4a8de6e'
  'v0.7.2'  = '8bcce68'
  'v0.7.1'  = '1aaa466'
  'v0.7.0'  = '232ee51'
  'v0.6.2'  = '094b908'
  'v0.6.1'  = 'acfadd2'
  'v0.6.0'  = '8f4c9a0'
  'v0.5.2'  = '0ab1735'
  'v0.5.1'  = 'd5edda3'
  'v0.5.0'  = 'ce40cef'
  'v0.4.6'  = 'ccf56e7'
  'v0.4.5'  = 'cf4936d'
  'v0.4.4'  = '753c74a'
  'v0.4.3'  = '270a3f4'
  'v0.4.2'  = '0bfb27c'
  'v0.4.1'  = 'e2c2041'
  'v0.4.0'  = 'fd83beb'
  'v0.3.2'  = '6756a1a'
  'v0.3.1'  = 'ee5ba4d'
  'v0.3.0'  = '5854624'
  'v0.2.4'  = 'c53fa4b'
  'v0.2.3'  = 'dbd5ffc'
  'v0.2.2'  = '6c9e210'
  'v0.2.1'  = '86cd4dd'
  'v0.2.0'  = 'bd5df68'
  'v0.1.4'  = 'ab1bee1'
  'v0.1.3'  = '5425772'
  'v0.1.2'  = '292ed94'
  'v0.1.1'  = '67286c2'
  'v0.1.0'  = '38f5931'
  'v0.0.13' = '09d767c'
  'v0.0.12' = '84da34a'
  'v0.0.11' = 'ef9755b'
  'v0.0.10' = '8864938'
  'v0.0.5'  = '07afbba'
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$archiveRoot = Join-Path $repoRoot 'versions'
New-Item -ItemType Directory -Force -Path $archiveRoot | Out-Null

foreach ($release in $releases.GetEnumerator()) {
  $releaseRoot = Join-Path $archiveRoot $release.Key
  New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
  foreach ($file in @('index.html', 'styles.css', 'game.js')) {
    $content = (& git -C $repoRoot show "$($release.Value):$file") -join "`n"
    if ($LASTEXITCODE -ne 0) { throw "Could not read $file from $($release.Value)." }
    if ($file -eq 'game.js') {
      $content = $content.Replace('"assets/', '"../../assets/').Replace("'assets/", "'../../assets/")
    }
    [IO.File]::WriteAllText((Join-Path $releaseRoot $file), $content + "`n", [Text.UTF8Encoding]::new($false))
  }
}

Write-Host "Built $($releases.Count) playable release archives in $archiveRoot"
