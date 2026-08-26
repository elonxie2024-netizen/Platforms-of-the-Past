$ErrorActionPreference = 'Stop'

$testRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $testRoot
$testPage = Join-Path $testRoot 'browser-tests.html'
$chromeCandidates = @(
  (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe'),
  (Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe')
)
$browser = $chromeCandidates | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -First 1
if (-not $browser) { throw 'Chrome or Edge is required to run the browser regression tests.' }

$profile = Join-Path ([IO.Path]::GetTempPath()) ("potp-regression-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $profile | Out-Null
try {
  $testUri = 'file:///' + (($testPage -replace '\\', '/') -replace ' ', '%20')
  $stdoutPath = Join-Path $profile 'browser-stdout.txt'
  $stderrPath = Join-Path $profile 'browser-stderr.txt'
  $browserArguments = @(
    '--headless=new', '--disable-gpu', '--no-first-run', '--disable-default-apps',
    '--allow-file-access-from-files', "--user-data-dir=$profile", '--virtual-time-budget=5000',
    '--dump-dom', $testUri
  )
  $process = Start-Process -FilePath $browser -ArgumentList $browserArguments -Wait -PassThru `
    -WindowStyle Hidden -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath
  if ($process.ExitCode -ne 0) { throw "The headless browser exited with code $($process.ExitCode)." }
  $dom = Get-Content -LiteralPath $stdoutPath -Raw
  $match = [regex]::Match($dom, '<pre id="results">(?<json>.*?)</pre>', 'Singleline')
  if (-not $match.Success) { throw 'The browser test result could not be read.' }
  $json = [Net.WebUtility]::HtmlDecode($match.Groups['json'].Value)
  $result = $json | ConvertFrom-Json
  foreach ($failure in $result.failures) { Write-Host "FAIL: $($failure.name) - $($failure.error)" -ForegroundColor Red }
  if ($result.failed -gt 0) { throw "$($result.failed) of $($result.total) browser regression tests failed." }
  Write-Host "Browser rules and serialization: $($result.passed)/$($result.total) passed" -ForegroundColor Green

  $mainPage = Join-Path $repoRoot 'index.html'
  $mainUri = 'file:///' + (($mainPage -replace '\\', '/') -replace ' ', '%20')
  $mainStdoutPath = Join-Path $profile 'game-stdout.txt'
  $mainStderrPath = Join-Path $profile 'game-stderr.txt'
  $mainArguments = @(
    '--headless=new', '--disable-gpu', '--no-first-run', '--disable-default-apps',
    '--allow-file-access-from-files', "--user-data-dir=$profile", '--virtual-time-budget=2500',
    '--dump-dom', $mainUri
  )
  $mainProcess = Start-Process -FilePath $browser -ArgumentList $mainArguments -Wait -PassThru `
    -WindowStyle Hidden -RedirectStandardOutput $mainStdoutPath -RedirectStandardError $mainStderrPath
  if ($mainProcess.ExitCode -ne 0) { throw "The game smoke test exited with code $($mainProcess.ExitCode)." }
  $mainDom = Get-Content -LiteralPath $mainStdoutPath -Raw
  if (-not $mainDom.Contains('Level 1 / 40') -or -not $mainDom.Contains('Level Editor · v0.34.2')) {
    throw 'The complete game did not initialize with the current verification and level-data scripts.'
  }
  Write-Host 'Complete game initialization: 1/1 passed' -ForegroundColor Green

  $sql = Get-Content -LiteralPath (Join-Path $repoRoot 'supabase-setup.sql') -Raw
  $game = Get-Content -LiteralPath (Join-Path $repoRoot 'game.js') -Raw
  $levelData = Get-Content -LiteralPath (Join-Path $repoRoot 'level-data.js') -Raw
  $index = Get-Content -LiteralPath (Join-Path $repoRoot 'index.html') -Raw
  $contracts = [ordered]@{}
  $contracts['SQL accepts exactly three level types'] = $sql.Contains("level_type in ('exit', 'exit-stars', 'survival')")
  $contracts['SQL creates monotonically increasing immutable versions'] = $sql.Contains('coalesce(max(history.version), 0) + 1')
  $contracts['SQL creates fresh publication status rows'] = $sql.Contains('insert into public.published_custom_level_status')
  $contracts['SQL binds tickets to exact versions'] = $sql.Contains('ticket.level_id <> p_level_id or ticket.level_version <> p_level_version')
  $contracts['SQL rejects reused tickets'] = $sql.Contains('ticket.used_at is not null')
  $contracts['SQL binds tickets to account sessions'] = $sql.Contains('ticket.user_id is distinct from current_user_id')
  $contracts['SQL requires exits for completion levels'] = $sql.Contains("if not coalesce(p_reached_exit, false) then return 'The exit was not reached'")
  $contracts['SQL enforces Required Stars'] = $sql.Contains("status_row.level_type <> 'exit-stars' or coalesce(p_stars, 0) >= status_row.required_stars")
  $contracts['SQL permanently rejects Fly and cheat use'] = $sql.Contains('not coalesce(p_fly_ever, false) and not coalesce(p_cheat_ever, false)')
  $contracts['SQL orders Survival longest-first'] = $sql.Contains("run.level_type = 'survival' then run.seconds end desc")
  $contracts['SQL ranks only valid and restored runs'] = $sql.Contains("case when ordered.ranking_status in ('valid', 'restored') then ordered.valid_position else null end")
  $contracts['SQL keeps review threshold at three votes'] = $sql.Contains('invalid_votes + valid_votes < 3')
  $contracts['SQL uses a two-thirds review majority'] = $sql.Contains('invalid_votes * 3 >= (invalid_votes + valid_votes) * 2') -and $sql.Contains('valid_votes * 3 >= (invalid_votes + valid_votes) * 2')
  $contracts['SQL preserves restoration history'] = $sql.Contains('report.ever_invalidated or report.decision_status')
  $contracts['Client keeps Fly use sticky'] = $game.Contains('if (enabled) markPublishedCheatUsed(true)')
  $contracts['Client keeps developer-cheat use sticky'] = ([regex]::Matches($game, 'if \(enabled\) markPublishedCheatUsed\(\)').Count -ge 2)
  $contracts['Level validation uses shared level-type rules'] = $levelData.Contains('verificationRules.resolveLevelType')
  $contracts['Verification rules load before level data'] = $index.IndexOf('verification-rules.js') -lt $index.IndexOf('level-data.js')
  $contractFailures = @($contracts.GetEnumerator() | Where-Object { -not $_.Value })
  foreach ($failure in $contractFailures) { Write-Host "FAIL: source contract - $($failure.Key)" -ForegroundColor Red }
  if ($contractFailures.Count -gt 0) { throw "$($contractFailures.Count) database/source contracts failed." }
  Write-Host "Database and source contracts: $($contracts.Count)/$($contracts.Count) passed" -ForegroundColor Green
  Write-Host "Total: $($result.passed + $contracts.Count + 1) checks passed" -ForegroundColor Green
} finally {
  if (Test-Path -LiteralPath $profile) {
    $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
    $resolvedProfile = [IO.Path]::GetFullPath($profile)
    if (-not $resolvedProfile.StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase)) {
      throw 'Refusing to remove a browser profile outside the temporary directory.'
    }
    Remove-Item -LiteralPath $resolvedProfile -Recurse -Force
  }
}
