$ErrorActionPreference = 'Stop'

$releases = [ordered]@{
  'v0.23.2' = '8bcf5f8'
  'v0.23.1' = '3530a03'
  'v0.23.0' = '71759a0'
  'v0.22.2' = 'e06179c'
  'v0.22.1' = '9ad7b44'
  'v0.22.0' = 'bd03ab2'
  'v0.21.5' = '890f062'
  'v0.21.4' = '9cfee2a'
  'v0.21.3' = 'ddde822'
  'v0.21.2' = '0b2ead2'
  'v0.21.1' = '5893c80'
  'v0.21.0' = '79e576a'
  'v0.20.1' = '2683bab'
  'v0.20.0' = '75b010d'
  'v0.19.7' = '57422a8'
  'v0.19.6' = '89876b1'
  'v0.19.5' = 'd34fea2'
  'v0.19.4' = '0ffbf35'
  'v0.19.3' = '0a6ae8b'
  'v0.19.2' = '7ad0af8'
  'v0.19.1' = '17f8a92'
  'v0.19.0' = '64b80e7'
  'v0.18.0' = 'd92b36f'
  'v0.17.0' = '77874ee'
  'v0.16.1' = '26479de'
  'v0.16.0' = '361a241'
  'v0.15.3' = '1a8162d'
  'v0.15.2' = 'd122a2d'
  'v0.15.1' = 'b4947b9'
  'v0.15.0' = 'dbae81f'
  'v0.14.5' = '885eec3'
  'v0.14.4' = '18d5ff4'
  'v0.14.3' = '6cc5ee9'
  'v0.14.2' = '94579fd'
  'v0.14.1' = 'e1a2416'
  'v0.14.0' = 'a734baa'
  'v0.13.2' = '50845fc'
  'v0.13.1' = '82f51b6'
  'v0.13.0' = 'cff2f5f'
  'v0.12.0' = '3f7b4fa'
  'v0.11.7' = 'f498e91'
  'v0.11.6' = 'f47ded0'
  'v0.11.5' = '3b2a7b1'
  'v0.11.4' = 'd5c7b63'
  'v0.11.3' = 'eb25612'
  'v0.11.2' = '336de3b'
  'v0.11.1' = '52986ee'
  'v0.11.0' = '686139c'
  'v0.10.4' = '70f5c5e'
  'v0.10.3' = '538a1af'
  'v0.10.2' = '893aa50'
  'v0.10.1' = '843c4d1'
  'v0.10.0' = 'b03ea23'
  'v0.9.2'  = '5ce8f93'
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
$archiveAssetRoot = Join-Path $archiveRoot 'assets'
New-Item -ItemType Directory -Force -Path $archiveRoot | Out-Null
New-Item -ItemType Directory -Force -Path $archiveAssetRoot | Out-Null

$sourceAssetRoot = Join-Path $repoRoot 'assets'
if (-not (Test-Path -LiteralPath $sourceAssetRoot)) { throw "Missing shared game assets: $sourceAssetRoot" }
Get-ChildItem -LiteralPath $sourceAssetRoot -File | Copy-Item -Destination $archiveAssetRoot -Force

foreach ($release in $releases.GetEnumerator()) {
  $releaseRoot = Join-Path $archiveRoot $release.Key
  New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
  $releaseFiles = @('index.html', 'styles.css', 'game.js')
  $accountFile = & git -C $repoRoot ls-tree --name-only $release.Value -- account.js
  if ($accountFile -eq 'account.js') { $releaseFiles += 'account.js' }
  foreach ($file in $releaseFiles) {
    $content = (& git -C $repoRoot show "$($release.Value):$file") -join "`n"
    if ($LASTEXITCODE -ne 0) { throw "Could not read $file from $($release.Value)." }
    if ($file -eq 'game.js') {
      # Archived versions sit beside one another, not beneath another `versions` directory.
      $content = $content.Replace('./versions/${version}/index.html', '../${version}/index.html')
      $content = $content.Replace('versions/${version}/', '../${version}/index.html')
    }
    # Every archive uses its own code and styles, plus one shared asset directory under /versions.
    $content = $content.Replace('"assets/', '"../assets/').Replace("'assets/", "'../assets/").Replace('`assets/', '`../assets/')
    $content = $content.Replace('url(assets/', 'url(../assets/')
    if ($file -eq 'index.html') {
      $content = $content.Replace('href="styles.css"', 'href="./styles.css"')
      $content = $content.Replace('src="account.js', 'src="./account.js')
      $content = $content.Replace('src="game.js', 'src="./game.js')
    }
    [IO.File]::WriteAllText((Join-Path $releaseRoot $file), $content + "`n", [Text.UTF8Encoding]::new($false))
  }

  $generatedGame = Get-Content -LiteralPath (Join-Path $releaseRoot 'game.js') -Raw
  $generatedIndex = Get-Content -LiteralPath (Join-Path $releaseRoot 'index.html') -Raw
  if ($generatedGame.Contains('versions/${version}/')) {
    throw "Broken nested version link remained in $($release.Key)."
  }
  if (-not $generatedIndex.Contains('href="./styles.css"')) {
    throw "Archived stylesheet path is invalid in $($release.Key)."
  }
  if (-not $generatedIndex.Contains('src="./game.js')) {
    throw "Archived script path is invalid in $($release.Key)."
  }
  if ($generatedIndex.Contains('account.js') -and -not (Test-Path -LiteralPath (Join-Path $releaseRoot 'account.js'))) {
    throw "Archived account script is missing in $($release.Key)."
  }
  if ($generatedGame.Contains('`assets/')) {
    throw "Archived template-literal asset path is invalid in $($release.Key)."
  }
}

Write-Host "Built $($releases.Count) playable release archives with shared assets in $archiveRoot"
