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
  if (-not $mainDom.Contains('Level 1 / 40') -or -not $mainDom.Contains('Level Editor · v0.35.0')) {
    throw 'The complete game did not initialize with the current verification and level-data scripts.'
  }
  Write-Host 'Complete game initialization: 1/1 passed' -ForegroundColor Green

  $sql = Get-Content -LiteralPath (Join-Path $repoRoot 'supabase-setup.sql') -Raw
  $game = Get-Content -LiteralPath (Join-Path $repoRoot 'game.js') -Raw
  $levelData = Get-Content -LiteralPath (Join-Path $repoRoot 'level-data.js') -Raw
  $index = Get-Content -LiteralPath (Join-Path $repoRoot 'index.html') -Raw
  $account = Get-Content -LiteralPath (Join-Path $repoRoot 'account.js') -Raw
  $validator = Get-Content -LiteralPath (Join-Path $repoRoot 'supabase\functions\_shared\replay-validator.js') -Raw
  $edgeVerifier = Get-Content -LiteralPath (Join-Path $repoRoot 'supabase\functions\verify-custom-run\index.ts') -Raw
  $supabaseConfig = Get-Content -LiteralPath (Join-Path $repoRoot 'supabase\config.toml') -Raw
  $trustedSql = $sql.Substring($sql.IndexOf('-- v0.35.0:'))
  $contracts = [ordered]@{}
  $contracts['SQL accepts exactly three level types'] = $sql.Contains("level_type in ('exit', 'exit-stars', 'survival')")
  $contracts['SQL creates monotonically increasing immutable versions'] = $sql.Contains('coalesce(max(history.version), 0) + 1')
  $contracts['SQL creates fresh publication status rows'] = $sql.Contains('insert into public.published_custom_level_status')
  $contracts['SQL binds tickets to exact versions'] = $trustedSql.Contains('ticket.level_id <> p_level_id or ticket.level_version <> p_level_version')
  $contracts['SQL rejects reused tickets'] = $trustedSql.Contains('ticket.used_at is not null')
  $contracts['SQL binds tickets to account sessions'] = $trustedSql.Contains('ticket.user_id is distinct from current_user_id')
  $contracts['Trusted verifier derives exit completion'] = $validator.Contains('terminal.kind === "exit"') -and $validator.Contains('Replay did not legitimately reach the exit')
  $contracts['SQL rechecks Required Stars from trusted results'] = $trustedSql.Contains("run.level_type = 'exit-stars' and derived_stars < status_row.required_stars")
  $contracts['SQL refuses trusted Fly and cheat results'] = $trustedSql.Contains('or derived_fly or derived_cheat')
  $contracts['SQL orders Survival longest-first'] = $sql.Contains("run.level_type = 'survival' then run.seconds end desc")
  $contracts['SQL ranks only valid and restored runs'] = $sql.Contains("case when ordered.ranking_status in ('valid', 'restored') then ordered.valid_position else null end")
  $contracts['SQL keeps review threshold at three votes'] = $sql.Contains('invalid_votes + valid_votes < 3')
  $contracts['SQL uses a two-thirds review majority'] = $sql.Contains('invalid_votes * 3 >= (invalid_votes + valid_votes) * 2') -and $sql.Contains('valid_votes * 3 >= (invalid_votes + valid_votes) * 2')
  $contracts['SQL preserves restoration history'] = $sql.Contains('report.ever_invalidated or report.decision_status')
  $contracts['Client keeps Fly use sticky'] = $game.Contains('if (enabled) markPublishedCheatUsed(true)')
  $contracts['Client keeps developer-cheat use sticky'] = $game.Contains('markPublishedCheatUsed(false, "collision")') -and $game.Contains('markPublishedCheatUsed(false, "invincibility")')
  $contracts['Level validation uses shared level-type rules'] = $levelData.Contains('verificationRules.resolveLevelType')
  $contracts['Verification rules load before level data'] = $index.IndexOf('verification-rules.js') -lt $index.IndexOf('level-data.js')
  $contracts['Public intake accepts evidence instead of claimed results'] = $trustedSql.Contains('create function public.enqueue_custom_level_run') -and -not $account.Contains('p_seconds:') -and -not $account.Contains('p_reached_exit:')
  $contracts['Public intake can only create pending rows'] = $trustedSql.Contains("'invalidated', 'Pending trusted replay verification', 'pending'")
  $contracts['Old client-trusted decision RPC is removed'] = $trustedSql.Contains('drop function if exists public.submit_custom_level_run') -and -not $trustedSql.Contains('grant execute on function public.submit_custom_level_run')
  $contracts['Trusted finalizer is service-role only'] = $trustedSql.Contains('grant execute on function public.finalize_custom_level_run_verification(uuid, jsonb) to service_role') -and $trustedSql.Contains('revoke all on function public.finalize_custom_level_run_verification(uuid, jsonb) from public')
  $contracts['Trusted verifier claims immutable replay context'] = $trustedSql.Contains("'levelData', snapshot, 'replayData', run.replay_data")
  $contracts['Only trusted runs receive ranks'] = $trustedSql.Contains("run.validation_state = 'trusted' and run.ranking_status in ('valid', 'restored')")
  $contracts['Historical runs remain explicitly legacy'] = $trustedSql.Contains("validation_state text not null default 'legacy'")
  $contracts['Legacy clears cannot appear as trusted profile highlights'] = $trustedSql.Contains("trusted_run.id = clear.verified_run_id and trusted_run.validation_state = 'trusted'")
  $contracts['Verifier derives time and stars from evidence'] = $validator.Contains('seconds: Math.round(terminal.atMs) / 1000') -and $validator.Contains('stars: collected.size')
  $contracts['Verifier binds exact level digest and version'] = $validator.Contains('levelDigest(levelData) !== evidence.levelDigest') -and $validator.Contains('Number(evidence.levelVersion) !== Number(levelVersion)')
  $contracts['Verifier rejects integrity events'] = $validator.Contains('if (flyEver || cheatEver) return fail')
  $contracts['Replay storage and streams are bounded'] = $validator.Contains('MAX_BYTES = 1500000') -and $validator.Contains('MAX_INPUT_EVENTS = 20000')
  $contracts['Edge verifier holds the service-role boundary'] = $edgeVerifier.Contains('SUPABASE_SERVICE_ROLE_KEY') -and $edgeVerifier.Contains('finalize_custom_level_run_verification')
  $contracts['Public Edge trigger validates the publishable key itself'] = $supabaseConfig.Contains('verify_jwt = false') -and $edgeVerifier.Contains('acceptsPublishableKey(request)')
  $contracts['Client requests trusted verification after enqueue'] = $account.Contains('functions.invoke("verify-custom-run"')
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
