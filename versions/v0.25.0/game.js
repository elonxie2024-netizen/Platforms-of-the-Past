"use strict";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const levelLabel = document.querySelector("#levelLabel");
const timerLabel = document.querySelector("#timerLabel");
const levelTimerLabel = document.querySelector("#levelTimerLabel");
const starLabel = document.querySelector("#starLabel");
const message = document.querySelector("#message");
const scoreSummary = document.querySelector("#scoreSummary");
const gameShell = document.querySelector(".game-shell");
const fullscreenButton = document.querySelector("#fullscreenButton");
const pauseButton = document.querySelector("#pauseButton");
const restartButton = document.querySelector("#restartButton");
const restartRunButton = document.querySelector("#restartRunButton");
const quitButton = document.querySelector("#quitButton");
const victoryQuitButton = document.querySelector("#victoryQuitButton");
const continueButton = document.querySelector("#continueButton");
const introGauntletButton = document.querySelector("#introGauntletButton");
const introMasteryStatus = document.querySelector("#introMasteryStatus");
const introSplitSummary = document.querySelector("#message .split-summary");
const introPublishRun = document.querySelector("#message .publish-run");
const chapterCompleteMessage = document.querySelector("#chapterCompleteMessage");
const rewindTutorialSummary = document.querySelector("#rewindTutorialSummary");
const finalContinueButton = document.querySelector("#finalContinueButton");
const combinedGauntletButton = document.querySelector("#combinedGauntletButton");
const combinedMasteryStatus = document.querySelector("#combinedMasteryStatus");
const replayRewindButton = document.querySelector("#replayRewindButton");
const rewindMenuButton = document.querySelector("#rewindMenuButton");
const echoChapterMessage = document.querySelector("#echoChapterMessage");
const echoChapterSummary = document.querySelector("#echoChapterSummary");
const echoContinueButton = document.querySelector("#echoContinueButton");
const rewindGauntletButton = document.querySelector("#rewindGauntletButton");
const rewindMasteryStatus = document.querySelector("#rewindMasteryStatus");
const echoMenuButton = document.querySelector("#echoMenuButton");
const convergenceChapterMessage = document.querySelector("#convergenceChapterMessage");
const convergenceChapterSummary = document.querySelector("#convergenceChapterSummary");
const convergenceContinueButton = document.querySelector("#convergenceContinueButton");
const echoGauntletButton = document.querySelector("#echoGauntletButton");
const echoMasteryStatus = document.querySelector("#echoMasteryStatus");
const convergenceMenuButton = document.querySelector("#convergenceMenuButton");
const gauntletCompleteMessage = document.querySelector("#gauntletCompleteMessage");
const gauntletCompleteTitle = document.querySelector("#gauntletCompleteTitle");
const gauntletCompleteSummary = document.querySelector("#gauntletCompleteSummary");
const replayGauntletButton = document.querySelector("#replayGauntletButton");
const gauntletRoadmapButton = document.querySelector("#gauntletRoadmapButton");
const gauntletMenuButton = document.querySelector("#gauntletMenuButton");
const mainMenu = document.querySelector("#mainMenu");
const playButton = document.querySelector("#playButton");
const playChoiceMenu = document.querySelector("#playChoiceMenu");
const customRunButton = document.querySelector("#customRunButton");
const roadmapChoiceButton = document.querySelector("#roadmapChoiceButton");
const closePlayChoiceButton = document.querySelector("#closePlayChoiceButton");
const settingsButton = document.querySelector("#settingsButton");
const settingsPanel = document.querySelector("#settingsPanel");
const volumeInput = document.querySelector("#volumeInput");
const volumeValue = document.querySelector("#volumeValue");
const menuStage = document.querySelector(".menu-stage");
const menuSlime = document.querySelector(".menu-slime");
const menuPlatforms = [...document.querySelectorAll(".menu-platform")];
const menuPlatformCanvases = menuPlatforms.map(platform => platform.querySelector("canvas"));
const menuClouds = [...document.querySelectorAll(".menu-cloud")];
const menuCustomization = document.querySelector("#menuCustomization");
const menuAnimationButtons = [...document.querySelectorAll("[data-menu-animation]")];
const menuTextureButtons = [...document.querySelectorAll("[data-menu-texture]")];
const menuBackdropButtons = [...document.querySelectorAll("[data-menu-backdrop]")];
const mainLeaderboardButton = document.querySelector("#mainLeaderboardButton");
const pauseMenu = document.querySelector("#pauseMenu");
const resumeButton = document.querySelector("#resumeButton");
const pauseRestartLevelButton = document.querySelector("#pauseRestartLevelButton");
const pauseRestartRunButton = document.querySelector("#pauseRestartRunButton");
const pauseLeaderboardButton = document.querySelector("#pauseLeaderboardButton");
const pauseQuitButton = document.querySelector("#pauseQuitButton");
const leaderboardMenu = document.querySelector("#leaderboardMenu");
const leaderboardList = document.querySelector("#leaderboardList");
const leaderboardVersion = document.querySelector("#leaderboardVersion");
const leaderboardNote = document.querySelector("#leaderboardNote");
const leaderboardMetricButtons = [...document.querySelectorAll("[data-leaderboard-metric]")];
const closeLeaderboardButton = document.querySelector("#closeLeaderboardButton");
const runNameInput = document.querySelector("#runNameInput");
const publishRunButton = document.querySelector("#publishRunButton");
const publishStatus = document.querySelector("#publishStatus");
const splitList = document.querySelector("#splitList");
const mainChangelogButton = document.querySelector("#mainChangelogButton");
const restartSessionButton = document.querySelector("#restartSessionButton");
const pauseChangelogButton = document.querySelector("#pauseChangelogButton");
const changelogMenu = document.querySelector("#changelogMenu");
const changelogList = document.querySelector("#changelogList");
const closeChangelogButton = document.querySelector("#closeChangelogButton");
const roadmapMenu = document.querySelector("#roadmapMenu");
const levelRoadmap = document.querySelector("#levelRoadmap");
const closeRoadmapButton = document.querySelector("#closeRoadmapButton");
const previousRoadmapChapterButton = document.querySelector("#previousRoadmapChapterButton");
const nextRoadmapChapterButton = document.querySelector("#nextRoadmapChapterButton");
const roadmapChapterLabel = document.querySelector("#roadmapChapterLabel");
const roadmapChapterRange = document.querySelector("#roadmapChapterRange");
const versionsButton = document.querySelector("#versionsButton");
const versionsMenu = document.querySelector("#versionsMenu");
const versionsList = document.querySelector("#versionsList");
const closeVersionsButton = document.querySelector("#closeVersionsButton");
const runSetupMenu = document.querySelector("#runSetupMenu");
const runSetupForm = document.querySelector("#runSetupForm");
const specificLevelChoices = document.querySelector("#specificLevelChoices");
const runSetupSummary = document.querySelector("#runSetupSummary");
const closeRunSetupButton = document.querySelector("#closeRunSetupButton");
const leaderboardRunType = document.querySelector("#leaderboardRunType");
const developerPanel = document.querySelector("#developerPanel");
const closeDeveloperPanelButton = document.querySelector("#closeDeveloperPanelButton");
const flightToggleButton = document.querySelector("#flightToggleButton");
const accountArea = document.querySelector("#accountArea");
const accountIdentity = document.querySelector("#accountIdentity");
const accountNotice = document.querySelector("#accountNotice");
const signedOutAccountActions = document.querySelector("#signedOutAccountActions");
const signedInAccountActions = document.querySelector("#signedInAccountActions");
const signUpButton = document.querySelector("#signUpButton");
const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");
const editProfileButton = document.querySelector("#editProfileButton");
const accountMenu = document.querySelector("#accountMenu");
const accountMenuTitle = document.querySelector("#accountMenuTitle");
const accountFormStatus = document.querySelector("#accountFormStatus");
const closeAccountButton = document.querySelector("#closeAccountButton");
const signInForm = document.querySelector("#signInForm");
const signUpForm = document.querySelector("#signUpForm");
const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
const newPasswordForm = document.querySelector("#newPasswordForm");
const profileForm = document.querySelector("#profileForm");
const forgotPasswordButton = document.querySelector("#forgotPasswordButton");
const backToSignInButton = document.querySelector("#backToSignInButton");
const signInEmail = document.querySelector("#signInEmail");
const signUpDisplayName = document.querySelector("#signUpDisplayName");
const resetEmail = document.querySelector("#resetEmail");
const profileDisplayName = document.querySelector("#profileDisplayName");

const CHANGELOG_ENTRIES = [
  { version: "v0.25.0", commit: "Pending commit", date: "2026-08-21", message: "Add serialized level-data foundation", description: "Added a versioned, JSON-serializable level schema with strict validation, stable object IDs, safe ID-based links, import/export and independent-clone utilities, and a generic adapter into the existing runtime engine. Migrated Dirtbound Trail, Crateyard Climb, Switchback Summit, and Shared History as representative proofs covering static terrain, hazards, stars, crate physics, switches, controlled platforms, Rewind motion history, Rewind fields, and Echo capability. Invalid, unknown, or non-data input now fails with useful errors instead of entering gameplay." },
  { version: "v0.24.2", commit: "5f5f46d", date: "2026-08-21", message: "Polish account controls", description: "Restyled the main-menu account area and authentication forms with spacious pill buttons, clear player identity, stronger game-matched colors, and responsive hover feedback. The account card now matches the rounded, layered visual language of the surrounding game menu and stacks cleanly on narrow screens." },
  { version: "v0.24.1", commit: "1e74e26", date: "2026-08-21", message: "Fix crate-side jump collision", description: "Fixed rising beside a pushed crate being mistaken for an underside collision, which could force the slime through the floor and reset Crateyard Climb without playing the normal death animation. Side contact now remains horizontal while genuine landings and underside impacts continue to resolve normally." },
  { version: "v0.24.0", commit: "37ddc7d", date: "2026-08-21", message: "Add optional Supabase player accounts", description: "Added optional email-and-password accounts with persistent Supabase Auth sessions, email verification messaging, password recovery, private account data, and editable public display names. Guest play remains fully available offline, while signed-in players safely merge guest, cached, and cloud roadmap progress without ever reducing unlocks, completed chapters, or gauntlets. New signed-in leaderboard submissions are tied to the account ID and use its public display name without exposing email addresses." },
  { version: "v0.23.2", commit: "8bcf5f8", date: "2026-08-21", message: "Add complete moving-platform crate collision", description: "Made moving platforms collide physically with crates from every direction instead of phasing through them. Platforms now carry crates resting on top, push crates and stable stacks from the sides, lift them from below, and stop when a crate cannot move because solid geometry blocks it. The same collision rules apply to automatic, switch-controlled, pressure-controlled, and rewinding platforms." },
  { version: "v0.23.1", commit: "3530a03", date: "2026-08-21", message: "Close the History Forge cargo-gate shortcut", description: "Attached a moving spike strip to the top of History Forge's vertical cargo gate. The spikes follow the gate as it rises and prevent using it as a stepping stone, so the crate pressure plate can no longer be bypassed." },
  { version: "v0.23.0", commit: "71759a0", date: "2026-08-21", message: "Add crate gravity", description: "Made pushable crates obey heavy gravity, fall from unsupported ledges, settle on solid geometry and other crates, and ride moving platforms. Crates are now lost when they enter hazards or fall below the map without automatically respawning. Rewind levels record their complete falls and lost state so crates visibly retrace their history back to safety, while non-Rewind crate losses require a level restart. Kept Echo pushing and pressure plates compatible, and raised only Fractured Schedule's short crate channel to preserve its intended break-and-push solution." },
  { version: "v0.22.2", commit: "e06179c", date: "2026-08-21", message: "Repair chapter puzzles and gameplay state", description: "Repaired six closed collision gates across Chapter 4, moved Convergence's blocked star onto a reachable route, and unlocked later chapters as soon as their finales are completed. Hardened restart, death, rewind, Echo carrying, pointer cleanup, and modal input state. Standalone roadmap gauntlets now use their own results flow while chapter-launched gauntlets still return to the chapter choice screen." },
  { version: "v0.22.1", commit: "9ad7b44", date: "2026-08-21", message: "Change chapter screens", description: "Changed every chapter-completion screen to present two equal side-by-side next steps: Continue the Story follows the existing campaign transition, while Master This Chapter launches that chapter's gauntlet immediately. Completing a chapter-launched gauntlet returns to its chapter-completion screen with both choices still available while preserving the story run and timer handoff. Gauntlets remain playable from their roadmap branches." },
  { version: "v0.22.0", commit: "bd03ab2", date: "2026-08-20", message: "Add optional chapter gauntlets", description: "Added four optional gauntlets outside the forty-level campaign: Foundry Circuit combines every introductory mechanic, History Forge demands deliberately created rewind history, Echo Works focuses on long-form loop planning, and Paradox Engine combines echo and rewind with moving blades and state-dependent replay. Each gauntlet unlocks when its chapter is completed, appears as a distinct G1 through G4 branch on that chapter's roadmap, records session completion, and runs with clean standalone run and level timing without changing campaign progression." },
  { version: "v0.21.5", commit: "890f062", date: "2026-08-20", message: "Add the game favicon", description: "Added a compact browser icon that combines the existing green slime artwork with a simple golden rewind arrow trailing behind it. Connected the SVG favicon to the game page and preserved it through the playable version archive system." },
  { version: "v0.21.4", commit: "9cfee2a", date: "2026-08-20", message: "Fix zero-delay pressure platforms", description: "Corrected pressure-controlled moving platforms so they continue moving whenever their linked plate is actively held, even when configured with no release delay. A zero delay now makes the platform stop immediately after the plate is released instead of preventing movement entirely, restoring level 34's final bridge." },
  { version: "v0.21.3", commit: "ddde822", date: "2026-08-20", message: "Move the Cargo Countermove gate star", description: "Moved level 34's first star out of the raised cargo gate and onto the platform immediately beyond it, keeping the collectible clearly visible and safely reachable after opening the gate." },
  { version: "v0.21.2", commit: "0b2ead2", date: "2026-08-20", message: "Restore the Cargo Countermove gate collision", description: "Made level 34's lowered cargo gate solid before its crate pressure plate is activated. The player must now push the crate onto the plate to raise the gate instead of walking through it while inactive." },
  { version: "v0.21.1", commit: "5893c80", date: "2026-08-20", message: "Fix the Blade Recall corridor", description: "Moved the blade's fully rewound position farther from the lower corridor entrance, leaving a safe and forgiving gap for the player to enter. The low ceiling still prevents jumping over the blade, so rewinding it remains required." },
  { version: "v0.21.0", commit: "79e576a", date: "2026-08-20", message: "Add the combined Rewind and Echo chapter", description: "Added Chapter 4 and levels 31 through 40, combining echoes with dynamic rewind history across moving platforms, crates, fragile blocks, enemies, switches, pressure plates, hazards, and rewind fields. Introduced a visually distinct moving blade obstacle whose complete motion path can be rewound, then reused it as one ingredient across increasingly systemic puzzles and the multi-section Convergence final exam. Added the Echo Chapter completion handoff, a fourth roadmap page, consistent progression into the new chapter, and a final combined-chapter results screen." },
  { version: "v0.20.1", commit: "2683bab", date: "2026-08-20", message: "Add fragile block damage assets", description: "Moved both visible damage stages for fragile blocks out of the canvas drawing code and into reusable SVG overlays. Cracked grass, stone, and crate blocks retain their original material textures while sharing consistent scalable fracture artwork." },
  { version: "v0.20.0", commit: "75b010d", date: "2026-08-20", message: "Move game characters and mechanics into assets", description: "Moved the player, echo, enemy, pressure-plate, jump-pad, and switch artwork out of the canvas drawing code and into reusable SVG files. Gameplay now loads those assets while retaining slime squash, plate depression, pad pulsing, switch states, cutscene animation, rewind previews, and menu animation. Expanded version archiving to include every shared asset file." },
  { version: "v0.19.7", commit: "57422a8", date: "2026-08-20", message: "Fix the Rewind Final Exam crossing", description: "Corrected the final section of level 20 so its moving platform remains reachable by the rewind field after the crate sends it across the lava. Projected the field toward the gap and increased its range enough to select the platform from the ledge while leaving the pressure-plate crate outside the field." },
  { version: "v0.19.6", commit: "89876b1", date: "2026-08-20", message: "Preserve direct chapter-transition runs", description: "Fixed level-10 starts so choosing Continue preserves their timer into level 11 instead of requiring completed splits from every introductory level. The transition now works for normal finishes and developer-flight finishes while still pausing during the cutscene." },
  { version: "v0.19.5", commit: "d34fea2", date: "2026-08-20", message: "Continue timers across story chapters", description: "Made a run started from level 1 retain its elapsed time when Continue carries it into the Rewind and Echo chapters. The run timer pauses throughout both story cutscenes, resumes when the next chapter becomes playable, and continues contributing to the final run time without resetting the original run start." },
  { version: "v0.19.4", commit: "0ffbf35", date: "2026-08-19", message: "Clarify chapter roadmap paths", description: "Rearranged each roadmap chapter into two left-to-right rows. The route now travels from levels 1 through 5 across the upper row, connects diagonally to level 6, and continues through level 10 across the lower row." },
  { version: "v0.19.3", commit: "0a6ae8b", date: "2026-08-19", message: "Add roadmap chapter pages", description: "Split the thirty-level adventure roadmap into Introduction, Rewind, and Echo chapter pages so long level names have enough room to remain readable. Added on-screen chapter arrows and Left/Right Arrow keyboard navigation while preserving level locks and progress." },
  { version: "v0.19.2", commit: "7ad0af8", date: "2026-08-19", message: "Close Echo Chapter shortcuts", description: "Attached moving spike strips to the tops of level 24 and 25's vertical gates so they cannot be used as unintended stepping stones. Rebuilt level 26 as a longer four-platform plate-controlled crossing with minimal release grace, requiring the echo to keep the pressure plate active for the full route." },
  { version: "v0.19.1", commit: "17f8a92", date: "2026-08-18", message: "Preview echo recordings", description: "Split echo creation into recording, route preview, and creation stages. After recording stops, the world holds at the endpoint while a golden outline marks the echo's starting position and animated directional arrows trace its actual recorded path; pressing C again creates the echo." },
  { version: "v0.19.0", commit: "64b80e7", date: "2026-08-18", message: "Complete the Echo Chapter", description: "Added a Rewind Chapter completion screen and echo-unlock time-machine cinematic between levels 20 and 21. Added Cargo Loop, Safe Interval, Echo Assembly, and Echo Final Exam as levels 27 through 30, combining echoes with stable crate pushing, enemy timing, switches, pressure plates, moving platforms, hazards, and multi-section synthesis puzzles." },
  { version: "v0.18.0", commit: "d92b36f", date: "2026-08-18", message: "Expand the Echo Chapter", description: "Added five Echo Chapter levels from Next Time Around through Echo Rhythm. The new puzzles teach repeated loop timing, recorded momentary switch pulses, sequential moving weight across three plates, crossing echo schedules, and forgiving coordination across moving platforms." },
  { version: "v0.17.0", commit: "77874ee", date: "2026-08-18", message: "Begin the Echo Chapter", description: "Added First Echo as level 21 and introduced deterministic action echoes. C records the slime's movement, jumps, and interactions, then spawns a looping cyan echo that obeys current platforms, walls, pressure plates, and switches; V removes it. The first puzzle uses an echo and the player on separate pressure plates to raise the final gate." },
  { version: "v0.16.1", commit: "26479de", date: "2026-08-17", message: "Fix roadmap rewind timing", description: "Made standalone rewind-section runs launched from the roadmap start both the run timer and level timer on the player's first input. The run clock now persists through the remaining rewind levels and stops at the current endpoint." },
  { version: "v0.16.0", commit: "361a241", date: "2026-08-17", message: "Turn rewind into a consistent world system", description: "Made every pushable crate, breakable block, and enemy maintain dynamic movement and state history throughout rewind levels. Optional crate movement can now be undone, destroyed blocks consistently return, and defeated enemies rewind back to life while collected rewards remain owned. The rewind field now persists after its introduction and targets eligible objects dynamically." },
  { version: "v0.15.3", commit: "1a8162d", date: "2026-08-17", message: "Fix the Level 18 freeze", description: "Initialized rewind playback state for cracked blocks so Second Chance and the final exam continue updating normally as soon as they load. Added a defensive playback check for rewindable state objects." },
  { version: "v0.15.2", commit: "d122a2d", date: "2026-08-17", message: "Make rewind selection hold its position", description: "Changed timeline adjustment so releasing G keeps the chosen rewind point fixed instead of immediately drifting backward again. Paused golden path markers now remain visually still until the selection moves or the rewind is committed." },
  { version: "v0.15.1", commit: "b4947b9", date: "2026-08-17", message: "Fix the rewind final exam", description: "Made restored breakable blocks remain stable after rewind, raised the final exam's middle wall so restoring its cracked block is required, and made the finish require all three placed exam stars rather than allowing an enemy's bonus star to replace one." },
  { version: "v0.15.0", commit: "dbae81f", date: "2026-08-17", message: "Complete the rewind chapter", description: "Added four focused rewind levels. Patrol Recall makes a red slime's recorded patrol activate a pressure plate, Second Chance restores a broken block's earlier state, Crossed Signals makes a plate-controlled platform resume its present instruction after retracing its path, and Rewind Final Exam combines those established rules into one longer challenge." },
  { version: "v0.14.5", commit: "885eec3", date: "2026-08-17", message: "Add dangerous rewind level", description: "Added Last Second as level 16. A platform sinks toward lava while carrying the slime past a required star, forcing the player to use its descent and rewind it back to safety before it reaches the hazard." },
  { version: "v0.14.4", commit: "18d5ff4", date: "2026-08-17", message: "Add play mode selection", description: "Changed Play to open a dedicated mode choice. Custom run leads to the challenge builder, Roadmap leads directly to level selection, and each screen's Back button returns to the mode choice." },
  { version: "v0.14.3", commit: "6cc5ee9", date: "2026-08-17", message: "Clarify the temporary ending", description: "Replaced the temporary rewind ending's fantasy-style wording with a direct completion message that clearly says all currently available rewind levels are finished." },
  { version: "v0.14.2", commit: "94579fd", date: "2026-08-17", message: "Correct moving-platform arrows", description: "Changed platform markers to describe their real motion path. Horizontal platforms show left and right arrows, vertical platforms show up and down arrows, and paths that change on both axes display all four directions." },
  { version: "v0.14.1", commit: "e1a2416", date: "2026-08-17", message: "Add rewind fields", description: "Added Field Selection as level 15. Holding rewind now creates a visible field anchored at the slime's position and previews every recorded object inside it at once, while leaving objects beyond its edge untouched. The level requires placing the field to restore two missing bridge sections without rewinding the useful third platform." },
  { version: "v0.14.0", commit: "a734baa", date: "2026-08-17", message: "Expand the rewind chapter", description: "Added three focused rewind levels. Echo Descent teaches riding a platform back up its recorded path, Crate Recall makes a pushed crate retrace its movement to solve a pressure-plate route, and Halfway Home requires ending a rewind partway through a multi-position journey. Later lessons reuse the established F and G controls without step-by-step labels." },
  { version: "v0.13.2", commit: "50845fc", date: "2026-08-16", message: "Require every placed hazard", description: "Changed every-hazard challenges to require a death from each actual placed spike, lava section, or enemy rather than one death per general hazard type. Repeated deaths to the same hazard count once, and falling is not a placed hazard and never counts." },
  { version: "v0.13.1", commit: "82f51b6", date: "2026-08-16", message: "Fix run builder access", description: "Corrected the displayed version and script cache key so Play reliably opens the custom run builder. Separated the v0.13.0 run-type release from the v0.12.0 rewind changelog and preserved both as playable versions." },
  { version: "v0.13.0", commit: "cff2f5f", date: "2026-08-16", message: "Add custom run types", description: "Added a pre-run challenge builder that combines objectives, constraints, selected level routes, and Time, Score, or Stars ranking metrics. Custom runs track star requirements, deaths by hazard type, mechanic activation, route completion, splits, and separate global leaderboard categories." },
  { version: "v0.12.0", commit: "3f7b4fa", date: "2026-08-16", message: "Add the first rewind level", description: "Replaced the level 11 placeholder with First Recall, a focused rewind tutorial with F/G timeline previews, golden path arrows, clickable pointer controls, and release-to-commit playback." },
  { version: "v0.11.7", commit: "f498e91", date: "2026-08-16", message: "Move results before the cutscene", description: "Moved the completed-run results screen to immediately after level 10 so timing, splits, publishing, and quitting happen before the story cinematic. Added a large story Continue button directly below publishing that pulses and receives focus after a successful publication, then starts the rewind cutscene and leads into a frozen level 11 placeholder for the gameplay planned for v0.12.0." },
  { version: "v0.11.6", commit: "f47ded0", date: "2026-08-15", message: "Add enemy rewards and an opening route", description: "Made each defeated enemy drop one collectible star at the spot where it was stomped. Enemy stars count toward the level display, run total, star bonus, and leaderboard score, while remaining protected from repeated collection after a death. Raised Dirtbound Trail's opening floating crate so the slime can run beneath it as a faster route that skips the nearby star, while preserving the upper collectible route." },
  { version: "v0.11.5", commit: "3b2a7b1", date: "2026-08-15", message: "Remove flag-overlapping stars", description: "Removed only the five stars whose collectible areas overlapped finish-flag trigger boxes in levels 3, 5, 6, 7, and 8. Stars near flags that remain independently collectible were left untouched." },
  { version: "v0.11.4", commit: "d5c7b63", date: "2026-08-15", message: "Refine enemy frowns", description: "Kept the red enemies' eyes and angry eyebrows, then replaced the high frown with the player's exact smile curve flipped vertically within the same mouth area." },
  { version: "v0.11.3", commit: "eb25612", date: "2026-08-15", message: "Give enemies angry expressions", description: "Changed the red enemy slimes from friendly smiles to subtle frowns with naturally angled eyebrows, while leaving the player's friendly expression unchanged." },
  { version: "v0.11.2", commit: "336de3b", date: "2026-08-14", message: "Repair playable version archives", description: "Rebuilt the archive generator so historical releases link to sibling versions correctly, load their own archived scripts and styles, and share a generated archive asset bundle. Added generation checks that stop broken nested version links from being published again." },
  { version: "v0.11.1", commit: "52986ee", date: "2026-08-14", message: "Add enemy defeat particles", description: "Added a brief red slime-piece burst when an enemy is stomped, matching the player's understated green death effect without changing enemy behavior, physics, timing, or scoring." },
  { version: "v0.11.0", commit: "686139c", date: "2026-08-14", message: "Complete the introductory levels", description: "Added patrolling red slime enemies to level 9. They reverse at patrol boundaries or obstacles, defeat the player on side contact, and can be defeated from above. Added a longer final test in level 10 that combines floating platforms, a jump pad, automatic movers, a required crate climb, switches, timed pressure-plate shuttles, and a crate-held final bridge. Expanded the roadmap, full-run splits, star limit, and ending trigger from eight levels to ten." },
  { version: "v0.10.4", commit: "70f5c5e", date: "2026-08-14", message: "Require the first pressure plate", description: "Moved Pressure Passage's first shuttle beyond normal jump range so the opening lava gap cannot be cleared without activating the plate. Added a short activation hold that carries the shuttle inward long enough for runners to cross the plate and jump immediately instead of waiting beside the ledge." },
  { version: "v0.10.3", commit: "538a1af", date: "2026-08-14", message: "Refine pressure plate routes", description: "Shifted the later Pressure Passage geometry left as a single unit so runners can cross the first plate at full speed and intercept its shuttle without waiting. Preserved every distance in the second pressure-plate puzzle and made its bridge support the slime only while the crate keeps the plate depressed." },
  { version: "v0.10.2", commit: "893aa50", date: "2026-08-14", message: "Moved cutscene to after level 8", description: "Moved the rewind-awakening cutscene from the end of level 7 to the end of Pressure Passage. All eight levels now form the complete introductory run before the future rewind-focused levels begin." },
  { version: "v0.10.1", commit: "843c4d1", date: "2026-08-14", message: "Fixed platform edge overlap", description: "Stopped shallow top-corner overlaps from being treated as wall impacts before the landing pass. Fast platform and crate-edge landings now preserve horizontal momentum, while true side collisions and intentional crate pushing remain unchanged." },
  { version: "v0.10.0", commit: "b03ea23", date: "2026-08-14", message: "Added 8th level with pressure plates", description: "Added Pressure Passage as level 8, unlocked after the seven-level introduction and rewind cutscene. Thin illuminated pressure plates activate linked platforms automatically while held, and a pushable crate can keep a plate depressed while the slime crosses its route." },
  { version: "v0.9.2", commit: "5ce8f93", date: "2026-08-14", message: "Added particles", description: "Added subtle landing bursts matched to each surface: dirt flecks from grass, pebbles from stone, and wood chips from crates. Particle strength follows landing impact and pauses with the rest of gameplay." },
  { version: "v0.9.1", commit: "4a7e227", date: "2026-08-14", message: "Fixed leaderboard size", description: "Constrained the leaderboard to the game viewport so long ranking lists scroll independently while the Back button remains visible and accessible." },
  { version: "v0.9.0", commit: "a8c2f76", date: "2026-08-14", message: "Added customization panel for animation", description: "Unlocked main-menu customization after the final cutscene. Players can switch between the previous bounce and current climb animations, render platforms with the game's grass, stone, or crate assets, and swap between the sunny and lava-dark backdrops for the rest of the session." },
  { version: "v0.8.3", commit: "40cf24c", date: "2026-08-13", message: "Added leaderboard metrics", description: "Added Time, Stars, and Score tabs to the global leaderboard. Time is selected by default, while each tab reorders the same version-compatible runs using its chosen metric and appropriate tie breakers." },
  { version: "v0.8.2", commit: "ee37d36", date: "2026-08-13", message: "Changed global leaderboard version ranges pt 2", description: "Added the missing playable v0.8.0 archive to complete the version-range update." },
  { version: "v0.8.1", commit: "edc97dd", date: "2026-08-13", message: "Changed global leaderboard version ranges", description: "Renamed leaderboard choices as explicit version ranges so players can see which releases share identical gameplay and compete on the same board." },
  { version: "v0.8.0", commit: "fdaba75", date: "2026-08-13", message: "Make supabase and global leaderboard", description: "Replaced browser-only records with a shared online leaderboard available across devices and tabs. Added independent gameplay ruleset IDs so balance-changing releases receive separate boards, restricted ranked submissions to complete level-one starts, and added a menu of playable release archives built from the original Git commits." },
  { version: "v0.7.6", commit: "9cc5fc1", date: "2026-08-13", message: "Updated post-cutscene animation", description: "Rebuilt the awakened main-menu climb as one continuous loop without separate move-and-wait phases. Both platforms now descend at a constant speed and recycle seamlessly, while the slime's trajectory uses the game's real gravity and jump-speed calculations scaled uniformly to the smaller menu scene." },
  { version: "v0.7.5", commit: "6447b71", date: "2026-08-12", message: "Add cutscene skipping", description: "Made the final rewind cutscene skippable by clicking anywhere on the game canvas. Skipping immediately completes the cinematic and opens the existing adventure results screen without changing the finished run's recorded time, score, stars, or level splits." },
  { version: "v0.7.4", commit: "4a8de6e", date: "2026-08-12", message: "Add session-based progression", description: "Changed roadmap unlocks and the post-cutscene menu transformation to last only for the current browser session. Refreshing now restores Dirtbound Trail as the sole unlocked level and returns the menu to its original animation, while a new Restart session button performs the same complete reset immediately." },
  { version: "v0.7.3", commit: "4a8de6e", date: "2026-08-12", message: "Refine the post-cutscene climb loop", description: "Reworked the awakened main-menu animation around the original two platforms. One remains central while the other drops below the stage, reappears at the top as a new destination, and trades places with it after the slime jumps upward." },
  { version: "v0.7.2", commit: "8bcce68", date: "2026-08-12", message: "Added post-cutscene menu animation", description: "Added a persistent post-cutscene main-menu animation. After awakening rewind and returning to the menu, the slime endlessly climbs a looping staircase of rising platforms while layered clouds drift past." },
  { version: "v0.7.1", commit: "1aaa466", date: "2026-08-12", message: "Finished cutscene", description: "Completed the cinematic after all seven introductory levels. The slime automatically crosses a short platforming route, enters a time machine instead of a flag, is struck by temporal static, and awakens the power of rewind before the existing results screen appears." },
  { version: "v0.7.0", commit: "232ee51", date: "2026-08-12", message: "Added rewind cutscene", description: "Established the rewind-origin update and its initial ending-cutscene structure." },
  { version: "v0.6.2", commit: "094b908", date: "2026-08-12", message: "Added clickable switches", description: "Turned the nearby E - FLIP prompt into a clickable in-game control while retaining keyboard interaction. The prompt's visible bounds and pointer hit area now stay aligned as it gently bobs above the switch." },
  { version: "v0.6.1", commit: "acfadd2", date: "2026-08-12", message: "Added 2 way switches", description: "Changed switches into two-way controls. A nearby lever can be flipped in either direction, causing its linked platform to move smoothly between its raised destination and submerged starting position." },
  { version: "v0.6.0", commit: "8f4c9a0", date: "2026-08-12", message: "Added 7th level with switches", description: "Added the seventh and final introductory level. Nearby levers display an E interaction prompt and move their linked platforms into place when flipped, creating a route that must be assembled before it can be crossed." },
  { version: "v0.5.2", commit: "0ab1735", date: "2026-08-12", message: "Added roadmap for levels", description: "Changed Play to open a connected level roadmap instead of immediately starting level 1. Completed levels and the next challenge are blue and selectable, future levels are gray and locked, and progression persists in the browser." },
  { version: "v0.5.1", commit: "d5edda3", date: "2026-08-11", message: "Revamped cracked block texture", description: "Replaced the colored symbol blocks with nine-sliced rectangles made from the original grass, stone, and crate assets. Breakable variants now share an unmistakable cracked appearance and burst into material-specific dirt, pebble, or woodchip debris." },
  { version: "v0.5.0", commit: "ce40cef", date: "2026-08-11", message: "Breakable blocks added in 6th level", description: "Added a sixth level introducing three floating block types: delayed crumble blocks that break after being stood on, impact blocks that break after a jump landing, and permanent floating blocks that never break. Breakable blocks warn the player before disappearing and reset after death or restart." },
  { version: "v0.4.6", commit: "ccf56e7", date: "2026-08-11", message: "Fixed terrain 2", description: "Rebuilt the lower grass and stone layers as left-side, tiled-middle, and right-side columns. The pillar sides now line up with the top layer instead of allowing the center texture to extend past its edges." },
  { version: "v0.4.5", commit: "cf4936d", date: "2026-08-11", message: "Connected obstacle textures", description: "Changed grass and stone platforms to use outer edge slices only at the ends of each obstacle. Their center texture now fills the space between those edges without repeating rounded block borders or leaving tiny gaps." },
  { version: "v0.4.4", commit: "753c74a", date: "2026-08-11", message: "Fixed pushable crates level", description: "Raised both walls in level 5 and moved their crates farther away. An untouched crate can no longer launch the player across either wall, while pushing each crate into place creates a reliable route upward." },
  { version: "v0.4.3", commit: "270a3f4", date: "2026-08-11", message: "Added pushable crates in 5th level", description: "Added a fifth compact level built around two pushable crates. Crates move when the slime presses into either side, stop against solid terrain or other crates, support the player's weight, and reset with the level; pulling is not available." },
  { version: "v0.4.2", commit: "0bfb27c", date: "2026-08-11", message: "Buffed jump pad strength", description: "Increased the level 3 jump pad's launch force and prevented manual short-hop gravity from cutting pad launches short. The first springboard now comfortably clears the elevated platform without a perfectly timed manual jump." },
  { version: "v0.4.1", commit: "e2c2041", date: "2026-08-11", message: "Modified restart level", description: "Changed Restart so it begins the current level timer again from zero while preserving the full run timer. Completed splits now represent only the successful attempt after the most recent level restart." },
  { version: "v0.4.0", commit: "fd83beb", date: "2026-08-11", message: "Added first mechanics", description: "Replaced the ten long stages with four compact levels that introduce grass, dirt, stone, crates, lava, and mechanical surfaces. Added a powerful jump pad in level 3 and automatically cycling horizontal and vertical moving platforms in level 4." },
  { version: "v0.3.2", commit: "6756a1a", date: "2026-08-10", message: "Added changelog", description: "Added a complete, scrollable development history based on every Git commit. The changelog can be opened from both the main menu and pause menu." },
  { version: "v0.3.1", commit: "ee5ba4d", date: "2026-08-10", message: "Added level splits", description: "Added separate run and level timers. Level times persist through level restarts, pause with the run, and appear as a ten-level split summary after victory." },
  { version: "v0.3.0", commit: "5854624", date: "2026-08-10", message: "Pause + leaderboard overhaul", description: "Added a pause menu with resume, restart, quit, and leaderboard actions while freezing the timer. Added named run publishing and a score-sorted local leaderboard stored in the browser." },
  { version: "v0.2.4", commit: "c53fa4b", date: "2026-08-10", message: "Added second restart button", description: "Added Restart run beside the level restart control. The new T shortcut returns to level 1 and resets the timer, stars, and deaths." },
  { version: "v0.2.3", commit: "dbd5ffc", date: "2026-08-10", message: "Added timer+score", description: "Introduced a speedrun timer that starts on the first movement or jump and persists across all levels. Added the final score formula of 300 minus elapsed seconds plus two points per star." },
  { version: "v0.2.2", commit: "6c9e210", date: "2026-08-10", message: "Updated t extures again", description: "Replaced mismatched generated pillar fills with center crops tiled directly from the original dirt and stone assets. This made pillar colors and texture style continuous with their tops." },
  { version: "v0.2.1", commit: "86cd4dd", date: "2026-08-10", message: "Updated textures", description: "Added the first textured extensions beneath grass and stone platforms, including shaded dirt and masonry detail instead of completely flat pillar colors." },
  { version: "v0.2.0", commit: "bd5df68", date: "2026-08-10", message: "Overhauled content", description: "Expanded the adventure from three levels to ten with seven longer and harder stages. Introduced animated lava, volcanic scenery, tougher elevation changes, and more demanding star routes." },
  { version: "v0.1.4", commit: "ab1bee1", date: "2026-08-10", message: "Add quit button", description: "Added controls for abandoning an active run and returning to the main menu. The victory screen also gained a quit option alongside playing again." },
  { version: "v0.1.3", commit: "5425772", date: "2026-08-10", message: "Revamped audio", description: "Reworked movement audio so landings, rather than jumps, produce feedback. Grass received a soft landing sound while stone uses a harder clack." },
  { version: "v0.1.2", commit: "292ed94", date: "2026-08-10", message: "Added audio", description: "Added procedural music for the main menu and levels, plus sound effects for jumping, dying, collecting stars, and reaching flags. Connected the volume setting to the new audio system." },
  { version: "v0.1.1", commit: "67286c2", date: "2026-08-10", message: "Updated animation", description: "Rebuilt the main-menu slime animation to follow a physics-like jumping arc between the two platforms, with landing squash and airborne stretch matching gameplay more closely." },
  { version: "v0.1.0", commit: "38f5931", date: "2026-08-10", message: "Add main menu", description: "Introduced the main menu with horizontal Play and Settings controls, a volume setting, version display, and an endlessly bouncing slime scene between two platforms." },
  { version: "v0.0.13", commit: "09d767c", date: "2026-08-10", message: "Added spike animation", description: "Added a brief, understated spike-death sequence that freezes the player and breaks the green slime into small pieces before restarting." },
  { version: "v0.0.12", commit: "84da34a", date: "2026-08-10", message: "Changed fullscreen icon", description: "Replaced the fullscreen text control with the classic four-corner expand and collapse icons. Repositioned the level name so it no longer overlaps the corner control." },
  { version: "v0.0.11", commit: "ef9755b", date: "2026-08-10", message: "Changed player asset", description: "Changed the player from a tall, ghost-like shape into a squat rounded-square slime while retaining its simple green face and squash animation." },
  { version: "v0.0.10", commit: "8864938", date: "2026-08-10", message: "Added full screen mode", description: "Added a fullscreen control for expanding the game shell and responsive fullscreen layout styling for a larger play area." },
  { version: "Early development", commit: "a5acbda", date: "2026-08-10", message: "Remove standalone version display", description: "Removed the temporary in-game v0.0.5 badge and returned the script cache key to a simple revision number while the versioning policy was being settled." },
  { version: "Early development", commit: "66d7d3a", date: "2026-08-10", message: "Remove standalone version display", description: "Temporarily restored the v0.0.5 badge, README version, and matching script cache version during the back-and-forth over where versions should appear." },
  { version: "Early development", commit: "9599d67", date: "2026-08-10", message: "Changed version number policy", description: "Removed the standalone v0.0.5 badge and README version entry, and changed the script cache key while the project adopted a commit-based versioning policy." },
  { version: "v0.0.5", commit: "07afbba", date: "2026-08-10", message: "Update README with game link", description: "Added the public GitHub Pages play link to the README so the browser game could be launched directly from the project page." },
  { version: "v0.0.5", commit: "4f30474", date: "2026-08-10", message: "Created version numbers starting at 0.0.5", description: "Established semantic-style vX.Y.Z numbering at v0.0.5 and displayed that version in the README, game interface, and cache-busted script URL." },
  { version: "Prototype", commit: "6de6735", date: "2026-08-10", message: "Make opening jump easier and refresh slime player", description: "Adjusted the opening layout so the first jump was reachable and refined the green slime player presentation after the initial character pass." },
  { version: "Prototype", commit: "6024a78", date: "2026-08-10", message: "Balanced jump height + changed player asset + renamed website name", description: "Raised jump strength slightly, changed the player into a cute generic green slime, and renamed the game heading from Skybound Steps to Platforms of the Past." },
  { version: "Prototype", commit: "9b62c40", date: "2026-08-10", message: "Created README.md", description: "Created the project README with the game concept, controls, current prototype features, planned time-travel mechanic, and credits." },
  { version: "Initial commit", commit: "d914b1e", date: "2026-08-09", message: "Made base platformer", description: "Created the original browser platformer, including HTML and styling, movement and jumping physics, platforms, hazards, stars, flags, three levels, and the first sprite atlas." }
];

const VIEW_W = canvas.width;
const VIEW_H = canvas.height;
const PLAYER_W = 30;
const PLAYER_H = 42;
const STEP = 1 / 120;
const GRAVITY = 1900;
const RUN_SPEED = 285;
const GROUND_ACCEL = 2400;
const AIR_ACCEL = 1450;
const FRICTION = 2600;
const JUMP_SPEED = 720;
const JUMP_PAD_SPEED = 1120;
const CRATE_GRAVITY = 2300;
const CRATE_MAX_FALL_SPEED = 1050;
const COYOTE_TIME = 0.1;
const JUMP_BUFFER = 0.12;
const PLATFORM_TOP_GRACE = 10;
const DEATH_DURATION = 0.42;
const CUTSCENE_DURATION = 10.4;
const ECHO_CUTSCENE_DURATION = 9.2;
const INTRO_LEVEL_COUNT = 10;
const CAMPAIGN_LEVEL_COUNT = 40;
const GAUNTLET_COUNT = 4;

const R = (x, y, w, h, kind = "grass") => ({ x, y, w, h, kind });
const P = (x, y, w = 60, h = 60) => ({
  x, y, w, h, kind: "crate", pushable: true, baseX: x, baseY: y,
  vy: 0, grounded: false, lost: false,
  rewindableManual: true, motionHistory: [], timelinePreview: false,
  previewCursor: 0, previewLatest: 0, previewAccumulator: 0, previewPaused: false,
  timelinePlayback: [], rewindGrace: 0, timelineLocked: false, speed: 330
});
const B = (x, y, trigger, material = "stone", w = 110, h = 54, options = {}) => ({
  x, y, w, h, kind: "breakable-block", material,
  breakable: true, breakTrigger: trigger, broken: false, breakTimer: null, rewindableState: true,
  motionHistory: [], timelinePreview: false, previewCursor: 0, previewLatest: 0,
  previewAccumulator: 0, previewPaused: false, timelinePlayback: [], speed: 260,
  ...options
});
const F = (x, y, material = "stone", w = 110, h = 54) => ({ x, y, w, h, kind: "floating-block", material });
const M = (x, y, w, h, axis, range, speed, phase = 0, kind = "stone") => ({
  x, y, w, h, kind, moving: true, axis, range, speed, phase, baseX: x, baseY: y
});
const C = (x, y, targetX, targetY, switchId, w = 140, h = 40, kind = "stone", requiresActive = false, releaseDelay = 0) => ({
  x, y, w, h, kind, controlled: true, switchId, targetX, targetY, baseX: x, baseY: y,
  moveProgress: 0, requiresActive, releaseDelay, releaseTimer: 0
});
const W = (x, y, targetX, targetY, plateId, w = 160, h = 40, kind = "stone", speed = 330, options = {}) => ({
  x, y, w, h, kind, axis: "x", rewindable: true, plateId, targetX, targetY,
  baseX: x, baseY: y, speed, releaseDelay: 3, releaseTimer: 0,
  motionHistory: [{ x, y, time: 0 }], timelinePreview: false,
  previewCursor: 0, previewLatest: 0, previewAccumulator: 0, previewPaused: false,
  timelinePlayback: [], rewindGrace: 0, timelineLocked: false,
  ...options
});
const D = (x, y, motionPath, speed = 170, size = 58, options = {}) => ({
  x, y, w: size, h: size, kind: "moving-obstacle", dangerous: true, nonSolid: true,
  rewindable: true, baseX: x, baseY: y, speed, motionPath,
  pathIndex: 1, autoStart: true, loopPath: true, carryPlayer: false,
  motionHistory: [{ x, y, time: 0 }], timelinePreview: false,
  previewCursor: 0, previewLatest: 0, previewAccumulator: 0, previewPaused: false,
  timelinePlayback: [], rewindGrace: 0, timelineLocked: false,
  ...options
});
const K = (x, y, w = 60, h = 60) => ({
  ...P(x, y, w, h), rewindableManual: true,
  motionHistory: [{ x, y, time: 0 }], timelinePreview: false,
  previewCursor: 0, previewLatest: 0, previewAccumulator: 0, previewPaused: false,
  timelinePlayback: [], rewindGrace: 0, timelineLocked: false, speed: 330
});
const S = (x, y, id, options = {}) => ({ x, y, w: 42, h: 44, id, flipped: false, activeTimer: 0, ...options });
const Q = (x, y, id, w = 72, options = {}) => ({ x, y, w, h: 12, id, pressed: false, pressProgress: 0, ...options });
const A = (platformId, offsetX = 0, offsetY = -18, w = 72, h = 18) => ({
  x: 0, y: 0, w, h, kind: "attached-spikes", platformId, offsetX, offsetY
});
const E = (x, surfaceY, minX, maxX, direction = 1, speed = 62) => ({
  x, y: surfaceY - PLAYER_H, w: PLAYER_W, h: PLAYER_H, minX, maxX, speed,
  direction, baseX: x, baseDirection: direction, alive: true, rewindableEnemy: true,
  starDropped: false, starCollected: false, starX: x + PLAYER_W / 2, starY: surfaceY - PLAYER_H / 2,
  motionHistory: [], timelinePreview: false, previewCursor: 0, previewLatest: 0,
  previewAccumulator: 0, previewPaused: false, timelinePlayback: [], rewindGrace: 0
});
const ER = (x, surfaceY, minX, maxX, direction = 1, speed = 62, options = {}) => ({
  ...E(x, surfaceY, minX, maxX, direction, speed), rewindableEnemy: true,
  motionHistory: [], timelinePreview: false, previewCursor: 0, previewLatest: 0,
  previewAccumulator: 0, previewPaused: false, timelinePlayback: [], rewindGrace: 0, speed,
  ...options
});
const legacyLevels = [
  {
    name: "Dirtbound Trail", width: 1260, start: [70, 430], music: "level1",
    platforms: [R(0,490,330,80), R(400,445,190,125), R(660,390,170,180), R(900,450,180,120), R(1150,480,110,90), R(185,400,70,40,"crate")],
    hazards: [R(330,472,70,18), R(590,472,70,18), R(830,472,70,18), R(1080,472,70,18)],
    stars: [[220,365],[495,400],[745,345],[990,405]], finish: R(1190,390,34,90)
  },
  {
    name: "Stonework Steps", width: 1320, start: [55, 430], music: "level2",
    platforms: [R(0,490,260,80,"stone"), R(330,430,180,140,"stone"), R(580,360,160,210,"stone"), R(820,440,190,130,"stone"), R(1090,390,230,180,"stone"), R(905,376,64,64,"crate")],
    hazards: [R(260,472,70,18), R(510,472,70,18), R(740,472,80,18), R(1010,472,80,18)],
    stars: [[420,385],[655,315],[910,330],[1180,345]], finish: R(1235,300,34,90)
  },
  {
    name: "Springboard Rise", width: 1380, start: [55, 430], music: "level3",
    platforms: [R(0,490,450,80), R(525,300,180,270,"stone"), R(760,390,180,180), R(1020,330,180,240,"stone"), R(1260,460,120,110), R(610,242,62,58,"crate")],
    jumpPads: [R(360,470,60,20,"jump-pad")],
    hazards: [R(450,472,75,18), R(705,472,55,18), R(940,472,80,18), R(1200,472,60,18)],
    stars: [[390,410],[610,235],[850,345],[1110,285]], finish: R(1300,370,34,90)
  },
  {
    name: "Clockwork Crossing", width: 1500, start: [55, 430], music: "level2", theme: "lava",
    platforms: [R(0,490,300,80,"stone"), M(350,430,150,40,"x",65,1.15,0,"stone"), R(570,380,170,190,"stone"), M(790,420,150,40,"y",70,1.3,-Math.PI / 2,"stone"), R(1000,330,170,240,"stone"), M(1210,410,140,40,"x",45,1.45,Math.PI,"stone"), R(1380,450,120,120,"stone")],
    hazards: [R(300,490,270,80,"lava"), R(740,490,260,80,"lava"), R(1170,490,210,80,"lava")],
    stars: [[420,365],[655,325],[855,335],[1085,285],[1275,345]], finish: R(1415,360,34,90)
  },
  {
    name: "Crateyard Climb", width: 1500, start: [55, 430], music: "level1",
    platforms: [R(0,490,720,80), R(720,310,90,260,"stone"), R(880,430,190,140), R(1130,250,180,320,"stone"), R(1370,390,130,180), P(450,430), P(900,370)],
    hazards: [R(810,472,70,18), R(1070,472,60,18), R(1310,472,60,18)],
    stars: [[505,385],[765,265],[970,325],[1215,205]], finish: R(1415,300,34,90)
  },
  {
    name: "Fracture Falls", width: 1500, start: [55, 430], music: "level3", theme: "lava",
    platforms: [R(0,490,260,80,"stone"), F(320,430,"grass"), B(500,390,"stand","grass"), F(680,350,"stone"), B(860,420,"impact","stone"), F(1040,360,"crate"), B(1220,420,"stand","crate"), R(1380,450,120,120,"stone")],
    hazards: [R(260,490,1120,80,"lava")],
    stars: [[375,385],[555,345],[735,305],[915,375],[1095,315],[1275,375]], finish: R(1415,360,34,90)
  },
  {
    name: "Switchback Summit", width: 1500, start: [55,430], music: "level2",
    platforms: [R(0,490,320,80,"stone"), C(410,520,440,380,"bridge-a",140,40,"stone"), R(640,420,180,150,"stone"), C(900,520,920,345,"bridge-b",145,40,"grass"), R(1160,390,170,180,"stone"), R(1380,450,120,120,"stone")],
    switches: [S(250,446,"bridge-a"), S(740,376,"bridge-b")],
    hazards: [R(320,490,320,80,"lava"), R(820,490,340,80,"lava"), R(1330,490,50,80,"lava")],
    stars: [[285,400],[510,330],[735,330],[1035,285],[1245,345]], finish: R(1415,360,34,90)
  },
  {
    name: "Pressure Passage", width: 1380, start: [55,430], music: "level3", theme: "lava",
    platforms: [R(0,490,360,80,"stone"), C(600,430,400,430,"plate-a",150,40,"stone",false,.7), R(620,420,210,150,"stone"), P(635,360), F(805,380,"stone",25,40), C(870,520,880,350,"plate-b",150,40,"grass",true), R(1110,390,170,180,"stone"), R(1310,450,70,120,"stone")],
    pressurePlates: [Q(270,478,"plate-a"), Q(730,408,"plate-b")],
    hazards: [R(360,490,260,80,"lava"), R(830,490,280,80,"lava"), R(1280,490,30,80,"lava")],
    stars: [[300,430],[555,375],[695,315],[955,300],[1195,345]], finish: R(1320,360,34,90)
  },
  {
    name: "Crimson Crossing", width: 1550, start: [55,430], music: "level1",
    platforms: [R(0,490,330,80), R(390,450,300,120), R(750,410,200,160,"stone"), R(1010,450,300,120), R(1370,420,180,150,"stone")],
    enemies: [E(520,450,420,630,1), E(1140,450,1040,1250,-1)],
    hazards: [R(330,472,60,18), R(690,472,60,18), R(950,472,60,18), R(1310,472,60,18)],
    stars: [[210,440],[460,400],[850,360],[1080,400],[1435,370]], finish: R(1480,330,34,90)
  },
  {
    name: "The Final Test", width: 5100, start: [55,430], music: "level3", theme: "lava",
    platforms: [R(0,490,430,80), R(500,300,180,270,"stone"), F(740,360,"grass",120,54), M(900,400,250,40,"x",45,1.2,0,"stone"), R(1160,340,210,230,"stone"), M(1510,400,140,40,"y",75,1.2,-Math.PI/2,"grass"), R(1700,430,380,140), P(1800,370), R(2080,260,120,310,"stone"), F(2260,350,"stone",110,54), R(2420,450,80,120,"stone"), R(2500,490,400,80,"stone"), C(3020,520,2970,400,"final-switch-a",150,40,"stone"), R(3220,420,260,150,"stone"), C(3760,390,3510,390,"final-plate-a",150,40,"grass",false,.7), R(3790,330,210,240,"stone"), C(4080,520,4080,300,"final-switch-b",150,40,"stone"), R(4340,400,330,170,"stone"), P(4450,340), F(4670,360,"stone",25,40), C(4750,520,4750,360,"final-plate-b",150,40,"grass",true), R(4980,450,120,120,"stone")],
    jumpPads: [R(320,470,60,20,"jump-pad")],
    switches: [S(2810,446,"final-switch-a"), S(3920,286,"final-switch-b")],
    pressurePlates: [Q(3380,408,"final-plate-a"), Q(4570,388,"final-plate-b")],
    hazards: [R(430,490,1270,80,"lava"), R(2200,490,220,80,"lava"), R(2900,490,320,80,"lava"), R(3480,490,310,80,"lava"), R(4000,490,340,80,"lava"), R(4670,490,310,80,"lava")],
    stars: [[350,410],[585,245],[800,315],[1015,340],[1575,300],[2135,215],[2315,305],[2835,400],[3055,350],[3415,360],[3590,335],[3950,240],[4155,250],[4825,310]], finish: R(5020,360,34,90)
  },
  {
    name: "First Recall", width: 1450, start: [35,418], music: "level2", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindHintUnlocked: false,
    showRewindHintOnPlate: true,
    platforms: [
      R(0,460,440,110,"stone"),
      W(450,420,900,420,"recall-plates"),
      R(1070,460,380,110,"stone")
    ],
    pressurePlates: [
      Q(0,448,"recall-plates",78), Q(74,448,"recall-plates",78),
      Q(148,448,"recall-plates",78), Q(222,448,"recall-plates",78),
      Q(296,448,"recall-plates",78), Q(370,448,"recall-plates",70)
    ],
    hazards: [], stars: [], finish: R(1370,370,34,90)
  },
  {
    name: "Echo Descent", width: 1250, start: [55,318], music: "level2", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindHintUnlocked: false,
    platforms: [
      R(0,360,300,210,"stone"),
      W(330,340,330,475,null,170,36,"stone",170, {
        autoWhenRidden: true, carryDuringRewind: true, resumeAfterRewind: false
      }),
      R(620,330,630,240,"stone")
    ],
    hazards: [], stars: [[415,440]], finish: R(1165,240,34,90)
  },
  {
    name: "Crate Recall", width: 1450, start: [55,448], music: "level1", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindHintUnlocked: false,
    platforms: [
      R(0,490,650,80,"stone"), K(300,430), R(650,330,80,240,"stone"),
      R(730,490,190,80,"stone"), C(950,520,950,400,"crate-return",150,40,"stone",true),
      R(1140,390,310,180,"stone")
    ],
    pressurePlates: [Q(290,478,"crate-return",90)],
    hazards: [], stars: [[690,285]], finish: R(1370,300,34,90)
  },
  {
    name: "Halfway Home", width: 1320, start: [55,388], music: "level3", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindHintUnlocked: false,
    platforms: [
      R(0,430,480,140,"stone"),
      W(520,450,620,520,null,160,40,"stone",300, {
        autoStart: true, resumeAfterRewind: false,
        motionPath: [{ x: 520, y: 450 }, { x: 620, y: 350 }, { x: 620, y: 520 }],
        pathIndex: 1
      }),
      R(820,300,500,270,"stone")
    ],
    hazards: [], stars: [[695,300]], finish: R(1235,210,34,90)
  },
  {
    name: "Field Selection", width: 1600, start: [55,388], music: "level2", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindField: true,
    rewindFieldRadius: 340, rewindHintUnlocked: false,
    platforms: [
      R(0,430,620,140,"stone"),
      W(650,390,650,520,null,130,40,"stone",260, {
        autoStart: true, resumeAfterRewind: false,
        motionPath: [{ x: 650, y: 390 }, { x: 650, y: 520 }], pathIndex: 1
      }),
      W(800,350,800,520,null,130,40,"stone",260, {
        autoStart: true, resumeAfterRewind: false,
        motionPath: [{ x: 800, y: 350 }, { x: 800, y: 520 }], pathIndex: 1
      }),
      W(980,520,980,320,null,150,40,"stone",260, {
        autoStart: true, resumeAfterRewind: false,
        motionPath: [{ x: 980, y: 520 }, { x: 980, y: 320 }], pathIndex: 1
      }),
      R(1190,390,410,180,"stone")
    ],
    hazards: [], stars: [[1055,270]], finish: R(1515,300,34,90)
  },
  {
    name: "Last Second", width: 1350, start: [55,318], music: "level3", theme: "lava",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindHintUnlocked: false,
    requiredStars: 1,
    platforms: [
      R(0,360,300,210,"stone"),
      W(340,340,340,525,null,180,40,"stone",90, {
        autoWhenRidden: true, carryDuringRewind: true, resumeAfterRewind: false
      }),
      R(650,330,700,240,"stone")
    ],
    hazards: [R(300,500,350,70,"lava")],
    stars: [[430,442]], finish: R(1265,240,34,90)
  },
  {
    name: "Patrol Recall", width: 1450, start: [55,448], music: "level1", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindHintUnlocked: false,
    requiredStars: 1,
    platforms: [
      R(0,490,520,80,"stone"),
      C(650,520,650,420,"enemy-gate",180,40,"stone",false,0),
      R(940,430,510,140,"stone")
    ],
    pressurePlates: [Q(395,478,"enemy-gate",72,{ enemyOnly: true })],
    enemies: [ER(400,490,120,500,1,68,{ stopAtBoundary: true })],
    hazards: [R(520,490,420,80,"lava")],
    stars: [[740,372]], finish: R(1370,340,34,90)
  },
  {
    name: "Second Chance", width: 1450, start: [55,318], music: "level2", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindHintUnlocked: false,
    requiredStars: 1,
    platforms: [
      R(0,360,400,210,"stone"),
      B(400,360,"stand","grass",120,54,{ rewindableState: true, speed: 260 }),
      R(350,490,300,80,"stone"),
      R(650,330,800,240,"stone")
    ],
    hazards: [], stars: [[460,445]], finish: R(1370,240,34,90)
  },
  {
    name: "Crossed Signals", width: 1500, start: [55,448], music: "level3", theme: "lava",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindField: true,
    rewindFieldRadius: 400, rewindFieldOffset: 180, rewindHintUnlocked: false,
    platforms: [
      R(0,490,520,80,"stone"), P(220,430),
      W(600,430,980,430,"signal-plate",170,40,"stone",290),
      R(1120,390,380,180,"stone")
    ],
    pressurePlates: [Q(105,478,"signal-plate",90,{ crateOnly: true })],
    hazards: [R(520,490,600,80,"lava")],
    stars: [[1205,345]], finish: R(1420,300,34,90)
  },
  {
    name: "Rewind Final Exam", width: 3000, start: [55,448], music: "level3", theme: "lava",
    postRun: true, rewindChapter: true, rewindTutorial: true, rewindField: true,
    rewindFieldRadius: 440, rewindFieldOffset: 180, rewindHintUnlocked: false, requiredLevelStars: 3,
    platforms: [
      R(0,490,520,80,"stone"),
      C(650,520,650,420,"exam-enemy",180,40,"stone",false,0),
      R(940,430,360,140,"stone"),
      B(1300,430,"stand","grass",120,54,{ rewindableState: true, speed: 260 }),
      R(1240,520,300,50,"stone"),
      R(1540,330,510,240,"stone"), P(1780,270),
      W(2130,430,2510,430,"exam-signal",170,40,"stone",290),
      R(2650,390,350,180,"stone")
    ],
    pressurePlates: [
      Q(395,478,"exam-enemy",72,{ enemyOnly: true }),
      Q(1645,318,"exam-signal",90,{ crateOnly: true })
    ],
    enemies: [ER(400,490,120,500,1,68,{ stopAtBoundary: true })],
    hazards: [R(520,490,420,80,"lava"), R(2050,490,600,80,"lava")],
    stars: [[740,372],[1360,475],[2570,378]], finish: R(2920,300,34,90)
  },
  {
    name: "First Echo", width: 1160, start: [55,448], music: "level2", theme: "rewind",
    postRun: true, echoChapter: true, echoTutorial: true,
    platforms: [
      R(0,490,1160,80,"stone"),
      {
        ...C(800,190,800,55,"echo-gate",90,288,"stone",false,.95),
        requiredPlateIds: ["echo-a", "echo-b"]
      }
    ],
    pressurePlates: [Q(275,478,"echo-a",110), Q(620,478,"echo-b",470)],
    hazards: [], stars: [], finish: R(1050,400,34,90)
  },
  {
    name: "Next Time Around", width: 1300, start: [55,448], music: "level1", theme: "rewind",
    postRun: true, echoChapter: true,
    platforms: [
      R(0,490,470,80,"stone"),
      C(510,540,510,490,"loop-plate",330,40,"stone",false,.18),
      R(880,490,420,80,"stone")
    ],
    pressurePlates: [Q(270,478,"loop-plate",120)],
    hazards: [R(470,510,410,60,"lava")], stars: [], finish: R(1220,400,34,90)
  },
  {
    name: "Remote Instructions", width: 1400, start: [55,448], music: "level2", theme: "rewind",
    postRun: true, echoChapter: true,
    platforms: [
      R(0,490,420,80,"stone"),
      C(440,430,820,430,"echo-pulse",180,40,"stone",false,.18),
      R(1040,490,360,80,"stone")
    ],
    switches: [S(90,446,"echo-pulse",{ momentary: true, pulseDuration: 1 })],
    hazards: [R(420,510,620,60,"lava")], stars: [], finish: R(1320,400,34,90)
  },
  {
    name: "Passing Signals", width: 1450, start: [55,448], music: "level3", theme: "rewind",
    postRun: true, echoChapter: true,
    platforms: [
      R(0,490,1450,80,"stone"),
      R(120,300,960,40,"stone"), R(1230,300,220,40,"stone"),
      C(850,170,850,35,"sequence-c",72,130,"stone",false,.95),
      C(550,170,550,35,"sequence-b",72,130,"stone",false,.95),
      C(250,170,250,35,"sequence-a",72,130,"stone",false,.95)
    ],
    pressurePlates: [
      Q(275,478,"sequence-a",155), Q(585,478,"sequence-b",155), Q(895,478,"sequence-c",155)
    ],
    jumpPads: [R(1120,470,64,20,"jump-pad")],
    hazards: [A("sequence-a"), A("sequence-b"), A("sequence-c")], stars: [], finish: R(145,210,34,90)
  },
  {
    name: "Crossing Paths", width: 1500, start: [90,448], music: "level1", theme: "rewind",
    postRun: true, echoChapter: true,
    platforms: [
      R(0,490,1500,80,"stone"),
      R(210,330,1290,40,"stone"),
      C(600,200,600,65,"cross-a",76,130,"stone",false,1.05),
      C(980,200,980,65,"cross-b",76,130,"stone",false,1.05)
    ],
    pressurePlates: [Q(1010,478,"cross-a",170), Q(300,478,"cross-b",170)],
    jumpPads: [R(5,470,60,20,"jump-pad")],
    hazards: [A("cross-a",0,-18,76), A("cross-b",0,-18,76)], stars: [], finish: R(1410,240,34,90)
  },
  {
    name: "Echo Rhythm", width: 1540, start: [55,448], music: "level3", theme: "lava",
    postRun: true, echoChapter: true,
    platforms: [
      R(0,490,420,80,"stone"),
      C(470,535,470,420,"rhythm-plate",130,38,"stone",false,.08),
      C(665,535,665,370,"rhythm-plate",130,38,"stone",false,.08),
      C(860,535,860,420,"rhythm-plate",130,38,"stone",false,.08),
      C(1055,535,1055,350,"rhythm-plate",130,38,"stone",false,.08),
      R(1250,450,290,120,"stone")
    ],
    pressurePlates: [Q(220,478,"rhythm-plate",145)],
    hazards: [R(420,500,830,70,"lava")], stars: [], finish: R(1460,360,34,90)
  },
  {
    name: "Cargo Loop", width: 1500, start: [55,448], music: "level1", theme: "rewind",
    postRun: true, echoChapter: true, echoCanPushCrates: true,
    platforms: [
      R(0,490,900,80,"stone"), R(120,330,250,40,"stone"),
      P(560,430), C(650,280,650,35,"cargo-release",58,210,"stone"),
      R(820,300,80,270,"stone"),
      C(930,540,930,410,"cargo-lock",260,40,"stone",false,.8),
      R(1240,390,260,180,"stone")
    ],
    pressurePlates: [Q(205,318,"cargo-release",92), Q(700,478,"cargo-lock",112,{ crateOnly: true })],
    hazards: [R(900,500,340,70,"lava")], stars: [], finish: R(1410,300,34,90)
  },
  {
    name: "Safe Interval", width: 1580, start: [55,448], music: "level2", theme: "lava",
    postRun: true, echoChapter: true,
    platforms: [
      R(0,490,1580,80,"stone"),
      C(560,540,560,380,"safe-window",620,40,"stone",false,.9)
    ],
    pressurePlates: [Q(245,478,"safe-window",150)],
    enemies: [E(910,490,610,1120,1,92)],
    hazards: Array.from({ length: 10 }, (_, index) => R(520 + index * 68,472,68,18)),
    stars: [], finish: R(1490,400,34,90)
  },
  {
    name: "Echo Assembly", width: 2450, start: [55,448], music: "level3", theme: "rewind",
    postRun: true, echoChapter: true,
    platforms: [
      R(0,490,790,80,"stone"), P(520,430),
      C(820,430,1130,430,"assembly-pulse",180,40,"stone",false,.55),
      R(1300,490,250,80,"stone"),
      C(1470,300,1470,75,"assembly-step",64,190,"stone",false,.7),
      C(1570,540,1570,420,"assembly-crate",260,40,"stone",false,.85),
      M(1900,385,150,40,"y",65,1.15,-Math.PI/2,"stone"),
      R(2150,390,300,180,"stone")
    ],
    switches: [S(90,446,"assembly-pulse",{ momentary: true, pulseDuration: 1.15 })],
    pressurePlates: [Q(300,478,"assembly-step",145), Q(675,478,"assembly-crate",100,{ crateOnly: true })],
    hazards: [R(790,500,510,70,"lava"), R(1550,500,600,70,"lava")],
    stars: [], finish: R(2370,300,34,90)
  },
  {
    name: "Echo Final Exam", width: 4300, start: [55,448], music: "level3", theme: "lava",
    postRun: true, echoChapter: true, echoCanPushCrates: true,
    platforms: [
      R(0,490,780,80,"stone"),
      { ...C(690,205,690,45,"exam-a",70,285,"stone",false,.85), requiredPlateIds: ["exam-a","exam-b"] },
      R(780,490,220,80,"stone"),
      C(1020,430,1360,430,"exam-pulse",180,40,"stone",false,.55),
      R(1540,490,560,80,"stone"), P(1770,430),
      C(2030,280,2030,35,"exam-cargo-release",58,210,"stone"),
      C(2130,540,2130,410,"exam-cargo-lock",270,40,"stone",false,.8),
      R(2450,490,520,80,"stone"),
      C(2740,490,2740,315,"exam-safe",58,175,"stone",false,.7),
      C(3000,540,3000,405,"exam-rhythm",170,40,"stone",false,1),
      C(3230,540,3230,345,"exam-rhythm",170,40,"stone",false,1),
      R(3470,450,300,120,"stone"),
      M(3830,390,150,40,"y",60,1.2,-Math.PI/2,"stone"),
      R(4050,390,250,180,"stone")
    ],
    switches: [S(840,446,"exam-pulse",{ momentary: true, pulseDuration: 1.1 })],
    pressurePlates: [
      Q(210,478,"exam-a",115), Q(505,478,"exam-b",185),
      Q(1635,478,"exam-cargo-release",100), Q(2075,478,"exam-cargo-lock",105,{ crateOnly: true }),
      Q(2540,478,"exam-safe",130), Q(2840,478,"exam-rhythm",120)
    ],
    enemies: [E(2820,490,2460,2940,1,88)],
    hazards: [
      R(1000,500,540,70,"lava"), R(2100,500,350,70,"lava"),
      R(2970,500,500,70,"lava"), R(3770,500,280,70,"lava")
    ],
    stars: [], finish: R(4220,300,34,90)
  },
  {
    name: "Shared History", width: 1700, start: [55,448], music: "level2", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    rewindField: true, rewindFieldRadius: 430, rewindFieldOffset: 140,
    platforms: [
      R(0,490,500,80,"stone"),
      C(520,535,520,430,"shared-entry",210,40,"stone",true,.15),
      R(770,490,210,80,"stone"),
      W(1010,430,1280,430,null,170,40,"stone",210,{
        autoStart: true, resumeAfterRewind: false,
        motionPath: [{ x: 1010, y: 430 }, { x: 1280, y: 430 }], pathIndex: 1
      }),
      R(1430,450,270,120,"stone")
    ],
    pressurePlates: [Q(205,478,"shared-entry",145)],
    hazards: [R(500,500,270,70,"lava"), R(980,500,450,70,"lava")],
    stars: [[1095,380]], finish: R(1620,360,34,90)
  },
  {
    name: "Blade Recall", width: 1700, start: [55,448], music: "level3", theme: "lava",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    rewindField: true, rewindFieldRadius: 440, rewindFieldOffset: 150,
    platforms: [
      R(0,490,1700,80,"stone"), R(520,360,560,40,"stone"),
      D(390,426,[{ x: 390, y: 426 },{ x: 890, y: 426 }],155,60,{
        loopPath: false, resumeAfterRewind: false
      }),
      C(1080,170,1080,35,"blade-exit",72,320,"stone",false,.2)
    ],
    pressurePlates: [Q(230,478,"blade-exit",150)],
    hazards: [], stars: [[1000,430]], finish: R(1605,400,34,90)
  },
  {
    name: "Pulse Return", width: 1800, start: [55,448], music: "level1", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    rewindField: true, rewindFieldRadius: 460, rewindFieldOffset: 170,
    platforms: [
      R(0,490,520,80,"stone"),
      W(560,430,1040,430,"pulse-route",180,40,"stone",245,{ releaseDelay: .32 }),
      R(1240,450,560,120,"stone"),
      D(1310,382,[{ x: 1310, y: 382 },{ x: 1590, y: 382 },{ x: 1310, y: 382 }],145,54)
    ],
    pressurePlates: [Q(250,478,"pulse-route",120)],
    hazards: [R(520,500,720,70,"lava")], stars: [[1115,375]], finish: R(1715,360,34,90)
  },
  {
    name: "Cargo Countermove", width: 1900, start: [55,448], music: "level2", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    echoCanPushCrates: true, rewindField: true, rewindFieldRadius: 470, rewindFieldOffset: 180,
    platforms: [
      R(0,490,860,80,"stone"), K(310,430),
      C(860,235,860,70,"cargo-gate",78,255,"stone",false,.35),
      R(940,490,260,80,"stone"),
      W(1225,430,1510,430,"cargo-bridge",170,40,"stone",230,{ releaseDelay: 0 }),
      R(1680,450,220,120,"stone")
    ],
    pressurePlates: [Q(660,478,"cargo-gate",125,{ crateOnly: true }), Q(1030,478,"cargo-bridge",120)],
    hazards: [R(1200,500,480,70,"lava")], stars: [[985,420],[1575,380]],
    requiredLevelStars: 2, finish: R(1820,360,34,90)
  },
  {
    name: "Restored Route", width: 1900, start: [300,448], music: "level3", theme: "lava",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    rewindField: true, rewindFieldRadius: 520, rewindFieldOffset: 180,
    platforms: [
      R(0,490,420,80,"stone"), C(180,220,180,55,"restored-exit",76,270,"stone",false,.2),
      B(440,430,"impact","grass",120,54), B(580,390,"impact","stone",120,54),
      B(720,430,"impact","crate",120,54), R(860,490,1040,80,"stone")
    ],
    pressurePlates: [Q(1010,478,"restored-exit",145)],
    hazards: [R(420,510,440,60,"lava")], stars: [[650,340]],
    finish: R(55,400,34,90)
  },
  {
    name: "Patrol Paradox", width: 2000, start: [55,448], music: "level1", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    rewindField: true, rewindFieldRadius: 500, rewindFieldOffset: 190,
    platforms: [
      R(0,490,820,80,"stone"),
      { ...C(950,235,950,70,"patrol-gate",78,255,"stone",false,0), moveDuration: .32 },
      R(1030,490,170,80,"stone"),
      C(1230,535,1230,420,"patrol-pulse",190,40,"stone",false,.5),
      R(1460,450,540,120,"stone"),
      D(1560,382,[{ x: 1560, y: 382 },{ x: 1810, y: 382 },{ x: 1560, y: 382 }],150,54)
    ],
    switches: [S(980,446,"patrol-pulse",{ momentary: true, pulseDuration: 1.3 })],
    pressurePlates: [Q(625,478,"patrol-gate",125,{ enemyOnly: true })],
    enemies: [ER(640,490,620,710,1,48,{ stopAtBoundary: true })],
    hazards: [R(1200,500,260,70,"lava")], stars: [[720,425],[1330,370]],
    requiredStars: 3, finish: R(1915,360,34,90)
  },
  {
    name: "Selective Interference", width: 2050, start: [55,448], music: "level2", theme: "lava",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    rewindField: true, rewindFieldRadius: 310, rewindFieldOffset: 175,
    platforms: [
      R(0,490,560,80,"stone"),
      W(610,430,930,430,"interference-a",160,40,"stone",225),
      D(720,350,[{ x: 720, y: 350 },{ x: 1020, y: 350 },{ x: 720, y: 350 }],150,58),
      R(1130,490,340,80,"stone"),
      W(1510,430,1740,330,"interference-b",160,40,"stone",215),
      R(1870,390,180,180,"stone")
    ],
    pressurePlates: [Q(270,478,"interference-a",135), Q(1280,478,"interference-b",125)],
    hazards: [R(560,500,570,70,"lava"), R(1470,500,400,70,"lava")],
    stars: [[1000,300],[1780,275]], requiredLevelStars: 2, finish: R(1970,300,34,90)
  },
  {
    name: "Fractured Schedule", width: 2200, start: [55,448], music: "level3", theme: "rewind",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    echoCanPushCrates: true, rewindField: true, rewindFieldRadius: 500, rewindFieldOffset: 190,
    platforms: [
      R(0,490,650,80,"stone"), K(330,430),
      B(650,430,"impact","stone",120,54), R(600,490,250,80,"stone"),
      C(850,220,850,55,"schedule-switch",74,270,"stone",false,.65),
      R(850,490,510,80,"stone"),
      W(1390,430,1680,430,"schedule-plate",170,40,"stone",225),
      R(1840,450,360,120,"stone")
    ],
    switches: [S(190,446,"schedule-switch",{ momentary: true, pulseDuration: 1.4 })],
    pressurePlates: [Q(1180,478,"schedule-plate",120,{ crateOnly: true })],
    hazards: [R(1360,500,480,70,"lava")], stars: [[720,475],[1745,375]],
    requiredLevelStars: 2, finish: R(2115,360,34,90)
  },
  {
    name: "Displaced Replay", width: 2200, start: [55,448], music: "level1", theme: "lava",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    rewindField: true, rewindFieldRadius: 480, rewindFieldOffset: 190,
    platforms: [
      R(0,490,500,80,"stone"),
      W(540,430,920,350,null,170,40,"stone",205,{
        autoStart: true,
        motionPath: [{ x: 540, y: 430 },{ x: 760, y: 330 },{ x: 920, y: 430 },{ x: 540, y: 430 }],
        pathIndex: 1, loopPath: true
      }),
      R(1080,490,520,80,"stone"),
      C(1500,220,1500,55,"replay-exit",76,270,"stone",false,.45),
      R(1580,490,620,80,"stone"),
      D(1690,425,[{ x: 1690, y: 425 },{ x: 1980, y: 425 },{ x: 1690, y: 425 }],145,58)
    ],
    pressurePlates: [Q(1240,478,"replay-exit",145)],
    hazards: [R(500,500,580,70,"lava")], stars: [[830,285]],
    finish: R(2115,400,34,90)
  },
  {
    name: "Convergence", width: 5400, start: [55,448], music: "level3", theme: "lava",
    postRun: true, rewindChapter: true, rewindTutorial: true, echoChapter: true,
    echoCanPushCrates: true, rewindField: true, rewindFieldRadius: 500, rewindFieldOffset: 190,
    requiredLevelStars: 5,
    platforms: [
      R(0,490,520,80,"stone"),
      C(540,535,540,430,"final-entry",210,40,"stone",true,.2),
      R(790,490,250,80,"stone"),
      W(1070,430,1390,430,null,170,40,"stone",220,{
        autoStart: true, resumeAfterRewind: false,
        motionPath: [{ x: 1070, y: 430 },{ x: 1390, y: 430 }], pathIndex: 1
      }),
      R(1560,490,650,80,"stone"),
      D(1710,425,[{ x: 1710, y: 425 },{ x: 2050, y: 425 }],160,60,{
        loopPath: false, resumeAfterRewind: false
      }),
      K(2250,430), R(2210,490,700,80,"stone"),
      C(2910,230,2910,65,"final-cargo",80,260,"stone",false,.3),
      B(3040,430,"stand","grass",120,54), B(3180,390,"impact","stone",120,54),
      R(3300,490,650,80,"stone"),
      C(3950,235,3950,70,"final-enemy",80,255,"stone",false,.3),
      R(4030,490,360,80,"stone"),
      W(4420,430,4740,360,"final-exit",170,40,"stone",220),
      D(4590,300,[{ x: 4590, y: 300 },{ x: 4890, y: 410 },{ x: 4590, y: 300 }],155,58),
      R(5050,430,350,140,"stone")
    ],
    switches: [S(1650,446,"final-cargo",{ momentary: true, pulseDuration: 1.4 })],
    pressurePlates: [
      Q(220,478,"final-entry",145), Q(2710,478,"final-cargo",120,{ crateOnly: true }),
      Q(3740,478,"final-enemy",105,{ enemyOnly: true }), Q(4190,478,"final-exit",130)
    ],
    enemies: [ER(3660,490,3440,3860,1,74,{ stopAtBoundary: true })],
    hazards: [
      R(520,500,270,70,"lava"), R(1040,500,520,70,"lava"),
      R(2910,500,390,70,"lava"), R(4390,500,660,70,"lava")
    ],
    stars: [[1120,380],[2010,375],[3090,380],[3240,340],[4800,300]],
    finish: R(5310,340,34,90)
  },
  {
    name: "Foundry Circuit", gauntletId: "G1", gauntletChapter: 0,
    width: 4800, start: [55,448], music: "level3", theme: "lava", requiredLevelStars: 8,
    platforms: [
      R(0,490,420,80,"stone"),
      M(520,365,170,40,"x",70,1.05,0,"stone"), R(790,340,180,230,"stone"),
      M(1040,400,170,40,"y",62,1.2,-Math.PI/2,"grass"), R(1240,490,940,80,"stone"),
      P(1450,430), C(2100,230,2100,55,"g1-cargo",80,260,"stone",false,.35),
      R(2180,490,300,80,"stone"), F(2520,410,"stone",120,54),
      B(2680,370,"stand","grass",120,54), F(2840,410,"crate",120,54),
      B(3000,360,"impact","stone",120,54), R(3180,490,400,80,"stone"),
      C(3620,525,3620,390,"g1-switch",180,40,"stone",false,.4),
      M(3890,375,160,40,"y",58,1.1,Math.PI/2,"grass"), R(4110,490,690,80,"stone"),
      C(4370,235,4370,60,"g1-plate",78,255,"stone",false,.3)
    ],
    jumpPads: [R(330,470,62,20,"jump-pad")],
    switches: [S(3370,446,"g1-switch")],
    pressurePlates: [Q(1780,478,"g1-cargo",130,{ crateOnly: true }), Q(4200,478,"g1-plate",120)],
    enemies: [E(3260,490,3210,3510,1,78), E(4500,490,4450,4660,-1,82)],
    hazards: [
      R(420,500,820,70,"lava"), R(2480,500,700,70,"lava"),
      R(3580,500,530,70,"lava"), R(2140,472,40,18), R(4050,472,60,18)
    ],
    stars: [[355,410],[650,300],[1125,300],[1540,385],[2350,430],[2740,315],[3970,305],[4580,400]],
    finish: R(4720,400,34,90)
  },
  {
    name: "History Forge", gauntletId: "G2", gauntletChapter: 1,
    width: 5200, start: [55,448], music: "level2", theme: "rewind", postRun: true,
    rewindChapter: true, rewindTutorial: true, rewindField: true, rewindFieldRadius: 560,
    rewindFieldOffset: 190, requiredLevelStars: 6,
    platforms: [
      R(0,490,500,80,"stone"),
      W(560,430,1040,430,"g2-launch",180,40,"stone",235,{ releaseDelay: 2.8 }),
      R(1250,490,1200,80,"stone"), K(1640,430), R(2050,300,180,270,"stone"),
      C(2370,230,2370,55,"g2-cargo",80,260,"stone",false,.35),
      R(2450,490,250,80,"stone"), B(2740,410,"stand","grass",130,54),
      B(2910,350,"impact","stone",130,54), F(3080,410,"crate",120,54),
      R(3240,490,980,80,"stone"),
      C(4180,230,4180,55,"g2-enemy",78,260,"stone",false,.3),
      R(4260,490,250,80,"stone"), W(4540,430,4820,370,"g2-exit",170,40,"stone",220,{ releaseDelay: 2.5 }),
      R(5000,450,200,120,"stone")
    ],
    pressurePlates: [
      Q(150,478,"g2-launch",300), Q(1630,478,"g2-cargo",110,{ crateOnly: true }),
      Q(3860,478,"g2-enemy",110,{ enemyOnly: true }), Q(4320,478,"g2-exit",120)
    ],
    enemies: [ER(3440,490,3380,3990,1,76,{ stopAtBoundary: true })],
    hazards: [R(500,500,750,70,"lava"), R(2700,500,540,70,"lava"), R(4510,500,490,70,"lava"), A("g2-cargo",0,-18,80)],
    stars: [[640,375],[1320,440],[2110,245],[2965,295],[3895,420],[4870,320]],
    finish: R(5120,360,34,90)
  },
  {
    name: "Echo Works", gauntletId: "G3", gauntletChapter: 2,
    width: 5400, start: [55,448], music: "level1", theme: "lava", postRun: true,
    echoChapter: true, echoCanPushCrates: true, requiredLevelStars: 6,
    platforms: [
      R(0,490,500,80,"stone"), C(530,530,530,410,"g3-entry",220,40,"stone",true,.25),
      R(790,490,760,80,"stone"), C(1580,520,1580,345,"g3-pulse",180,40,"grass",false,.2),
      R(1830,490,1200,80,"stone"), K(2180,430),
      { ...C(2990,230,2990,55,"g3-both",80,260,"stone",false,.3), requiredPlateIds: ["g3-echo","g3-cargo"] },
      R(3070,490,760,80,"stone"),
      C(3860,430,4260,360,"g3-route",180,40,"stone",false,1.1),
      R(4440,490,960,80,"stone"), C(4740,235,4740,60,"g3-final",80,255,"stone",false,.3)
    ],
    switches: [S(1240,446,"g3-pulse",{ momentary: true, pulseDuration: 1.35 }), S(4580,446,"g3-final",{ momentary: true, pulseDuration: 1.4 })],
    pressurePlates: [
      Q(200,478,"g3-entry",150), Q(2470,478,"g3-echo",130),
      Q(2740,478,"g3-cargo",130,{ crateOnly: true }), Q(3470,478,"g3-route",150)
    ],
    enemies: [E(1030,490,900,1380,1,78), E(3290,490,3180,3700,-1,82), E(4930,490,4860,5240,1,84)],
    hazards: [R(500,500,290,70,"lava"), R(1550,500,280,70,"lava"), R(3830,500,610,70,"lava"), R(4780,472,70,18)],
    stars: [[620,365],[1310,400],[1900,440],[2830,420],[4200,305],[5110,400]],
    finish: R(5310,400,34,90)
  },
  {
    name: "Paradox Engine", gauntletId: "G4", gauntletChapter: 3,
    width: 6200, start: [55,448], music: "level3", theme: "lava", postRun: true,
    rewindChapter: true, rewindTutorial: true, echoChapter: true, echoCanPushCrates: true,
    rewindField: true, rewindFieldRadius: 570, rewindFieldOffset: 200, requiredLevelStars: 7,
    platforms: [
      R(0,490,500,80,"stone"), W(540,430,1050,430,"g4-entry",180,40,"stone",230,{ releaseDelay: 2.7 }),
      R(1250,490,380,80,"stone"), R(1510,380,250,190,"stone"),
      B(1760,380,"stand","grass",180,54), R(1760,490,180,80,"stone"), R(1940,380,360,40,"stone"),
      C(1940,450,1940,380,"g4-restore",180,40,"stone",false,.15), F(2360,410,"stone",100,54), R(2520,490,850,80,"stone"),
      D(2720,426,[{ x: 2720, y: 426 },{ x: 3210, y: 426 }],165,60,{ loopPath: false, resumeAfterRewind: false }),
      R(2860,360,510,40,"stone"), C(3370,230,3370,55,"g4-blade",80,260,"stone",false,.3),
      R(3450,490,870,80,"stone"), K(3710,430), R(4140,300,180,270,"stone"),
      C(4380,520,4380,380,"g4-pulse",180,40,"grass",false,.25),
      C(4660,230,4660,55,"g4-cargo",80,260,"stone",false,.3),
      R(4740,490,300,80,"stone"),
      W(5070,430,5480,350,"g4-final",180,40,"stone",220,{ releaseDelay: 2.8 }),
      D(5260,290,[{ x: 5260, y: 290 },{ x: 5580, y: 410 },{ x: 5260, y: 290 }],155,58),
      R(5700,450,500,120,"stone")
    ],
    switches: [S(2080,336,"g4-restore",{ momentary: true, pulseDuration: 1.25 }), S(3560,446,"g4-pulse",{ momentary: true, pulseDuration: 1.35 })],
    pressurePlates: [
      Q(190,478,"g4-entry",170), Q(2610,478,"g4-blade",130),
      Q(3710,478,"g4-cargo",120,{ crateOnly: true }), Q(4860,478,"g4-final",130)
    ],
    enemies: [ER(4800,490,4760,4980,-1,80,{ stopAtBoundary: true })],
    hazards: [
      R(500,500,750,70,"lava"), R(1630,500,130,70,"lava"), R(1940,500,580,70,"lava"), R(2860,342,510,18),
      R(4320,500,340,70,"lava"), R(5040,500,660,70,"lava"), R(3410,472,40,18), R(4690,472,50,18)
    ],
    stars: [[650,375],[1840,450],[2180,300],[3260,420],[4210,245],[4510,420],[5540,300]],
    finish: R(6110,360,34,90)
  }
];

function levelObjectId(object, runtimeObject) {
  runtimeObject.levelObjectId = object.id;
  return runtimeObject;
}

const LEVEL_RUNTIME_ADAPTERS = Object.freeze({
  exit: (object) => levelObjectId(object, R(object.x, object.y, object.width, object.height)),
  platform: (object) => levelObjectId(object, R(object.x, object.y, object.width, object.height, object.material)),
  floatingPlatform: (object) => levelObjectId(object, F(object.x, object.y, object.material, object.width, object.height)),
  crate: (object) => levelObjectId(object, object.rewindable
    ? K(object.x, object.y, object.width, object.height)
    : P(object.x, object.y, object.width, object.height)),
  breakableBlock: (object) => levelObjectId(object, B(
    object.x, object.y, object.trigger, object.material, object.width, object.height,
    { rewindableState: object.rewindable !== false, ...(object.rewindSpeed !== undefined ? { speed: object.rewindSpeed } : {}) }
  )),
  jumpPad: (object) => levelObjectId(object, R(object.x, object.y, object.width, object.height, "jump-pad")),
  hazard: (object) => object.attachedTo
    ? levelObjectId(object, A(object.attachedTo, object.offsetX || 0, object.offsetY || 0, object.width, object.height))
    : levelObjectId(object, R(object.x, object.y, object.width, object.height, object.hazard === "lava" ? "lava" : "grass")),
  star: (object) => [object.x, object.y],
  movingPlatform: (object) => levelObjectId(object, M(
    object.x, object.y, object.width, object.height,
    object.motion.axis, object.motion.range, object.motion.speed, object.motion.phase || 0, object.material
  )),
  controlledPlatform: (object) => {
    const platform = C(
      object.x, object.y, object.target.x, object.target.y, object.controllerIds[0],
      object.width, object.height, object.material, Boolean(object.requiresActive), object.releaseDelay || 0
    );
    if (object.controllerIds.length > 1) platform.requiredPlateIds = [...object.controllerIds];
    if (object.moveDuration !== undefined) platform.moveDuration = object.moveDuration;
    return levelObjectId(object, platform);
  },
  rewindPlatform: (object) => {
    const target = object.target || object.motionPath[object.motionPath.length - 1];
    const options = {};
    for (const key of [
      "releaseDelay", "pathIndex", "autoStart", "autoWhenRidden", "carryDuringRewind",
      "resumeAfterRewind", "loopPath", "carryPlayer"
    ]) {
      if (object[key] !== undefined) options[key] = object[key];
    }
    if (object.motionPath) options.motionPath = object.motionPath.map((point) => ({ ...point }));
    return levelObjectId(object, W(
      object.x, object.y, target.x, target.y, object.controllerId ?? null,
      object.width, object.height, object.material, object.speed, options
    ));
  },
  switch: (object) => levelObjectId(object, S(object.x, object.y, object.id, {
    ...(object.momentary ? { momentary: true } : {}),
    ...(object.pulseDuration !== undefined ? { pulseDuration: object.pulseDuration } : {})
  })),
  pressurePlate: (object) => levelObjectId(object, Q(object.x, object.y, object.id, object.width, {
    ...(object.filter === "crate" ? { crateOnly: true } : {}),
    ...(object.filter === "enemy" ? { enemyOnly: true } : {})
  })),
  enemy: (object) => {
    const enemy = ER(
      object.x, object.surfaceY, object.patrolMinX, object.patrolMaxX,
      object.direction, object.speed, { stopAtBoundary: Boolean(object.stopAtBoundary) }
    );
    if (object.rewindable === false) enemy.rewindableEnemy = false;
    return levelObjectId(object, enemy);
  },
  movingObstacle: (object) => levelObjectId(object, D(
    object.x, object.y, object.motionPath.map((point) => ({ ...point })), object.speed, object.size,
    {
      ...(object.loopPath !== undefined ? { loopPath: object.loopPath } : {}),
      ...(object.resumeAfterRewind !== undefined ? { resumeAfterRewind: object.resumeAfterRewind } : {})
    }
  ))
});

const SERIALIZED_LEVEL_SLOTS = new Map([
  [0, "dirtbound-trail"],
  [4, "crateyard-climb"],
  [6, "switchback-summit"],
  [30, "shared-history"]
]);

function loadSerializedCampaignLevel(index, dataId) {
  const source = window.PlatformsLevelData?.CAMPAIGN_LEVELS?.[dataId];
  const result = source && window.PlatformsLevelData.loadLevel(source, LEVEL_RUNTIME_ADAPTERS);
  if (!result?.ok) {
    console.error(`Serialized level ${dataId} was rejected; using its legacy campaign definition.`, result?.errors || ["Level-data module unavailable."]);
    return legacyLevels[index];
  }
  result.level.levelDataId = dataId;
  return result.level;
}

const levels = legacyLevels.map((level, index) => {
  const dataId = SERIALIZED_LEVEL_SLOTS.get(index);
  return dataId ? loadSerializedCampaignLevel(index, dataId) : level;
});

window.PlatformsLevelDev = Object.freeze({
  schemaVersion: window.PlatformsLevelData?.SCHEMA_VERSION,
  migratedLevelIds: Object.freeze([...SERIALIZED_LEVEL_SLOTS.values()]),
  validate: (levelData) => window.PlatformsLevelData.validateLevel(levelData),
  clone: (levelData) => window.PlatformsLevelData.cloneLevel(levelData),
  importJSON: (jsonText) => window.PlatformsLevelData.importLevel(jsonText),
  exportJSON: (levelData, spacing = 2) => window.PlatformsLevelData.exportLevel(levelData, spacing),
  load: (levelOrJson) => window.PlatformsLevelData.loadLevel(levelOrJson, LEVEL_RUNTIME_ADAPTERS)
});

const MUSIC_TRACKS = {
  menu: {
    tempo: 92, wave: "triangle", gain: .11,
    melody: [72, null, 76, null, 79, null, 76, null, 74, null, 77, null, 81, null, 77, null],
    bass: [48, null, null, null, 55, null, null, null, 50, null, null, null, 55, null, null, null]
  },
  level1: {
    tempo: 112, wave: "triangle", gain: .1,
    melody: [64, 67, 71, 72, 71, 67, 64, null, 67, 71, 74, 76, 74, 71, 67, null],
    bass: [48, null, 55, null, 52, null, 55, null, 48, null, 55, null, 52, null, 55, null]
  },
  level2: {
    tempo: 94, wave: "sawtooth", gain: .065,
    melody: [57, null, 60, 64, 62, null, 60, null, 55, null, 59, 62, 60, null, 57, null],
    bass: [45, null, null, null, 40, null, null, null, 43, null, null, null, 40, null, null, null]
  },
  level3: {
    tempo: 124, wave: "sine", gain: .12,
    melody: [76, 79, 83, 86, 83, 79, 78, 81, 84, 88, 84, 81, 79, 83, 86, 91],
    bass: [52, null, 59, null, 55, null, 59, null, 52, null, 59, null, 55, null, 59, null]
  }
};

const input = { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false };
const pressed = { jump: false };
let rewindPointerId = null;
let rewindPointerOwnsInput = false;
let forwardPointerId = null;
let rewindFieldPreview = null;
const player = { x: 0, y: 0, vx: 0, vy: 0, grounded: false, facing: 1, coyote: 0, jumpBuffer: 0, padLaunched: false };
let echoRecording = null;
let echoPreview = null;
let echo = null;
let levelIndex = 0;
let collected = [];
let totalStars = 0;
let deaths = 0;
let cameraX = 0;
let accumulator = 0;
let lastTime = performance.now();
let won = false;
let levelTransition = 0;
let levelMotionTime = 0;
let deathTimer = 0;
let deathParticles = [];
let enemyDeathParticles = [];
let blockDebris = [];
let landingParticles = [];
let gameStarted = false;
let cutsceneActive = false;
let cutsceneTime = 0;
let cutsceneZapPlayed = false;
let cutscenePowerPlayed = false;
let cutsceneKind = "rewind";
let runStartedAt = 0;
let runElapsed = 0;
let timerRunning = false;
let levelStartedAt = 0;
let levelElapsed = 0;
let levelTimerRunning = false;
let levelSplits = [];
let runStartLevel = 0;
let countPostRunInRunTimer = false;
let paused = false;
let timerWasRunningBeforePause = false;
let levelTimerWasRunningBeforePause = false;
let leaderboardReturn = "main";
let changelogReturn = "main";
let finishedRun = null;
let runPublished = false;
let gauntletChapterReturnState = null;
const LEGACY_SESSION_STORAGE_KEYS = ["platforms-past-progress-v1", "platforms-past-rewind-awakened-v1"];
const GAME_VERSION = "v0.25.0";
const SUPABASE_URL = "https://fuhqixfcdeyyjzpdnivy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_2ILI9grJw5pwi35d7v5qCQ_zTgh-I4A";
const GUEST_PROGRESS_STORAGE_KEY = "platforms-past-guest-progress-v3";
const ACCOUNT_PROGRESS_STORAGE_PREFIX = "platforms-past-account-progress-v1:";
const LEADERBOARD_RULESETS = [
  { id: "crate-jump-collision-v1", label: "Version 0.24.1 to 0.25.0" },
  { id: "crate-platform-collision-v1", label: "Version 0.23.2 to 0.24.0" },
  { id: "history-forge-gate-v1", label: "Version 0.23.1 to 0.23.1" },
  { id: "crate-gravity-v1", label: "Version 0.23.0 to 0.23.0" },
  { id: "chapter-gate-fixes-v1", label: "Version 0.22.2 to 0.22.2" },
  { id: "chapter-gauntlets-v1", label: "Version 0.22.0 to 0.22.1" },
  { id: "zero-delay-platform-v1", label: "Version 0.21.4 to 0.21.5" },
  { id: "cargo-gate-star-v1", label: "Version 0.21.3 to 0.21.3" },
  { id: "cargo-gate-collision-v1", label: "Version 0.21.2 to 0.21.2" },
  { id: "blade-recall-corridor-v1", label: "Version 0.21.1 to 0.21.1" },
  { id: "combined-chapter-v1", label: "Version 0.21.0 to 0.21.0" },
  { id: "rewind-final-crossing-v1", label: "Version 0.19.7 to 0.20.1" },
  { id: "direct-chapter-timer-v1", label: "Version 0.19.6 to 0.19.6" },
  { id: "chapter-timer-continuation-v1", label: "Version 0.19.5 to 0.19.5" },
  { id: "echo-shortcut-fix-v1", label: "Version 0.19.2 to 0.19.4" },
  { id: "echo-route-preview-v1", label: "Version 0.19.1 to 0.19.1" },
  { id: "echo-final-v1", label: "Version 0.19.0 to 0.19.0" },
  { id: "echo-chapter-timing-v1", label: "Version 0.18.0 to 0.18.0" },
  { id: "first-echo-v1", label: "Version 0.17.0 to 0.17.0" },
  { id: "roadmap-rewind-timing-v1", label: "Version 0.16.1 to 0.16.1" },
  { id: "systemic-rewind-v1", label: "Version 0.16.0 to 0.16.0" },
  { id: "rewind-state-fix-v1", label: "Version 0.15.3 to 0.15.3" },
  { id: "rewind-hold-v1", label: "Version 0.15.2 to 0.15.2" },
  { id: "rewind-final-fix-v1", label: "Version 0.15.1 to 0.15.1" },
  { id: "rewind-final-v1", label: "Version 0.15.0 to 0.15.0" },
  { id: "dangerous-rewind-v1", label: "Version 0.14.5 to 0.14.5" },
  { id: "rewind-field-v1", label: "Version 0.14.1 to 0.14.4" },
  { id: "rewind-chapter-v2", label: "Version 0.14.0 to 0.14.0" },
  { id: "hazard-instance-runs-v1", label: "Version 0.13.2 to 0.13.2" },
  { id: "custom-runs-v1", label: "Version 0.13.0 to 0.13.1" },
  { id: "first-rewind-v1", label: "Version 0.12.0 to 0.12.0" },
  { id: "enemy-star-drops-v1", label: "Version 0.11.6 to 0.11.7" },
  { id: "flag-star-cleanup-v1", label: "Version 0.11.5 to 0.11.5" },
  { id: "intro-ten-v1", label: "Version 0.11.0 to 0.11.4" },
  { id: "pressure-gate-v1", label: "Version 0.10.4 to 0.10.4" },
  { id: "pressure-route-v2", label: "Version 0.10.3 to 0.10.3" },
  { id: "eight-intro-v1", label: "Version 0.10.2 to 0.10.2" },
  { id: "edge-collision-v1", label: "Version 0.10.1 to 0.10.1" },
  { id: "pressure-plates-v1", label: "Version 0.10.0 to 0.10.0" },
  { id: "intro-seven-v1", label: "Version 0.6.2 to 0.9.2" }
];
const CURRENT_LEADERBOARD_ID = LEADERBOARD_RULESETS[0].id;
const RELEASE_VERSIONS = [
  "v0.25.0", "v0.24.2", "v0.24.1", "v0.24.0", "v0.23.2", "v0.23.1", "v0.23.0", "v0.22.2", "v0.22.1", "v0.22.0", "v0.21.5", "v0.21.4", "v0.21.3", "v0.21.2", "v0.21.1", "v0.21.0", "v0.20.1", "v0.20.0", "v0.19.7", "v0.19.6", "v0.19.5", "v0.19.4", "v0.19.3", "v0.19.2", "v0.19.1", "v0.19.0", "v0.18.0", "v0.17.0", "v0.16.1", "v0.16.0", "v0.15.3", "v0.15.2", "v0.15.1", "v0.15.0",
  "v0.14.5", "v0.14.4", "v0.14.3", "v0.14.2", "v0.14.1", "v0.14.0", "v0.13.2", "v0.13.1", "v0.13.0", "v0.12.0", "v0.11.7", "v0.11.6", "v0.11.5", "v0.11.4", "v0.11.3", "v0.11.2", "v0.11.1", "v0.11.0", "v0.10.4", "v0.10.3", "v0.10.2", "v0.10.1", "v0.10.0", "v0.9.2", "v0.9.1", "v0.9.0", "v0.8.3", "v0.8.1", "v0.8.0", "v0.7.6", "v0.7.5", "v0.7.4", "v0.7.2", "v0.7.1", "v0.7.0",
  "v0.6.2", "v0.6.1", "v0.6.0", "v0.5.2", "v0.5.1", "v0.5.0", "v0.4.6", "v0.4.5",
  "v0.4.4", "v0.4.3", "v0.4.2", "v0.4.1", "v0.4.0", "v0.3.2", "v0.3.1", "v0.3.0",
  "v0.2.4", "v0.2.3", "v0.2.2", "v0.2.1", "v0.2.0", "v0.1.4", "v0.1.3", "v0.1.2",
  "v0.1.1", "v0.1.0", "v0.0.13", "v0.0.12", "v0.0.11", "v0.0.10", "v0.0.5"
];
let rewindMenuAwakened = false;
let menuCustomizationUnlocked = false;
let menuPlatformTexture = "grass";
let menuBackdrop = "sun";
let awakenedMenuAnimationStart = null;
let highestUnlockedLevel = 0;
let completedChapters = new Set();
let completedGauntlets = new Set();
let accountSession = null;
let accountProfile = null;
let accountInitializationError = null;
let accountSyncGeneration = 0;
let accountProgressSyncTimer = null;
let accountRecoveryActive = false;
let roadmapChapterIndex = 0;
let leaderboardEntries = [];
let leaderboardRequest = 0;
let leaderboardMetric = "time";
const ALL_INTRO_LEVELS = Array.from({ length: INTRO_LEVEL_COUNT }, (_, index) => index);
const RUN_OBJECTIVE_LABELS = {
  "complete-all": "Complete all levels",
  specific: "Complete specific levels",
  "all-stars": "Collect all stars",
  "all-hazards": "Die to every hazard",
  "all-mechanics": "Activate every mechanic"
};
const RUN_CONSTRAINT_LABELS = {
  none: "No constraint",
  "no-stars": "No stars",
  "all-stars": "All stars",
  "all-hazards": "Every hazard",
  "all-mechanics": "Every mechanic"
};
let selectedRunConfig = { objective: "complete-all", constraint: "none", metric: "time", levels: [...ALL_INTRO_LEVELS] };
let activeRunConfig = null;
let runLevelQueue = [];
let runQueuePosition = 0;
let nextLevelIndex = null;
let runProgress = { completedLevels: new Set(), hazardDeaths: new Set(), mechanics: new Set() };
let masterVolume = 1;
let audioContext = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let musicTimer = null;
let currentTrack = "menu";
let musicStep = 0;
let nextMusicNoteTime = 0;
let developmentSequencePosition = 0;
let levelDeveloperSequencePosition = 0;
let musicTempoSequencePosition = 0;
let flightEnabled = false;
const activeMusicVoices = new Set();

function clearLegacySessionState() {
  try { LEGACY_SESSION_STORAGE_KEYS.forEach(key => localStorage.removeItem(key)); }
  catch { /* Storage may be unavailable. */ }
}

function normalizedProgress(value = {}) {
  const completedChapterValues = Array.isArray(value.completedChapters)
    ? value.completedChapters
    : Array.isArray(value.completed_chapters) ? value.completed_chapters : [];
  const completedGauntletValues = Array.isArray(value.completedGauntlets)
    ? value.completedGauntlets
    : Array.isArray(value.completed_gauntlets) ? value.completed_gauntlets : [];
  const highestValue = value.highestUnlockedLevel ?? value.highest_unlocked_level ?? 0;
  return {
    highestUnlockedLevel: Math.max(0, Math.min(CAMPAIGN_LEVEL_COUNT - 1, Number.isFinite(Number(highestValue)) ? Math.floor(Number(highestValue)) : 0)),
    completedChapters: [...new Set(completedChapterValues.map(Number).filter((chapter) => Number.isInteger(chapter) && chapter >= 0 && chapter < GAUNTLET_COUNT))],
    completedGauntlets: [...new Set(completedGauntletValues.map(String).filter((id) => /^G[1-4]$/.test(id)))],
    menuCustomizationUnlocked: Boolean(value.menuCustomizationUnlocked ?? value.menu_customization_unlocked),
    rewindMenuAwakened: Boolean(value.rewindMenuAwakened),
    menuPlatformTexture: ["grass", "stone", "crate"].includes(value.menuPlatformTexture) ? value.menuPlatformTexture : "grass",
    menuBackdrop: ["sun", "lava"].includes(value.menuBackdrop) ? value.menuBackdrop : "sun"
  };
}

function mergeProgress(...values) {
  const progressValues = values.filter(Boolean).map(normalizedProgress);
  if (progressValues.length === 0) return normalizedProgress();
  return {
    highestUnlockedLevel: Math.max(...progressValues.map((value) => value.highestUnlockedLevel)),
    completedChapters: [...new Set(progressValues.flatMap((value) => value.completedChapters))].sort((a, b) => a - b),
    completedGauntlets: [...new Set(progressValues.flatMap((value) => value.completedGauntlets))].sort(),
    menuCustomizationUnlocked: progressValues.some((value) => value.menuCustomizationUnlocked),
    rewindMenuAwakened: progressValues[0].rewindMenuAwakened,
    menuPlatformTexture: progressValues[0].menuPlatformTexture,
    menuBackdrop: progressValues[0].menuBackdrop
  };
}

function currentProgressSnapshot() {
  return normalizedProgress({
    highestUnlockedLevel,
    completedChapters: [...completedChapters],
    completedGauntlets: [...completedGauntlets],
    menuCustomizationUnlocked,
    rewindMenuAwakened,
    menuPlatformTexture,
    menuBackdrop
  });
}

function accountProgressPayload(progress = currentProgressSnapshot()) {
  return {
    highest_unlocked_level: progress.highestUnlockedLevel,
    completed_chapters: progress.completedChapters,
    completed_gauntlets: progress.completedGauntlets,
    menu_customization_unlocked: progress.menuCustomizationUnlocked
  };
}

function applyProgress(progress) {
  const safe = normalizedProgress(progress);
  highestUnlockedLevel = safe.highestUnlockedLevel;
  completedChapters = new Set(safe.completedChapters);
  completedGauntlets = new Set(safe.completedGauntlets);
  menuCustomizationUnlocked = safe.menuCustomizationUnlocked;
  rewindMenuAwakened = safe.rewindMenuAwakened;
  menuPlatformTexture = safe.menuPlatformTexture;
  menuBackdrop = safe.menuBackdrop;
}

function readStoredProgress(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? normalizedProgress(JSON.parse(raw)) : normalizedProgress();
  } catch {
    return normalizedProgress();
  }
}

function activeProgressStorageKey() {
  return accountSession?.user?.id
    ? `${ACCOUNT_PROGRESS_STORAGE_PREFIX}${accountSession.user.id}`
    : GUEST_PROGRESS_STORAGE_KEY;
}

function writeStoredProgress(key, progress) {
  try { localStorage.setItem(key, JSON.stringify(normalizedProgress(progress))); }
  catch { /* Progress remains available in memory when storage is blocked. */ }
}

function persistProgress(syncAccount = true) {
  const progress = currentProgressSnapshot();
  writeStoredProgress(activeProgressStorageKey(), progress);
  if (syncAccount && accountSession?.user?.id) scheduleAccountProgressSync();
}

function migrateLegacyGuestProgress() {
  try {
    if (localStorage.getItem(GUEST_PROGRESS_STORAGE_KEY) !== null) return;
    const oldUnlocked = Number(localStorage.getItem("platforms-past-progress-v1"));
    const oldAwakened = localStorage.getItem("platforms-past-rewind-awakened-v1") === "true";
    if (!Number.isInteger(oldUnlocked) && !oldAwakened) return;
    writeStoredProgress(GUEST_PROGRESS_STORAGE_KEY, {
      highestUnlockedLevel: Number.isInteger(oldUnlocked) ? oldUnlocked : 0,
      rewindMenuAwakened: oldAwakened,
      menuCustomizationUnlocked: oldAwakened
    });
  } catch { /* Legacy progress remains untouched if storage is unavailable. */ }
}

migrateLegacyGuestProgress();
clearLegacySessionState();
applyProgress(readStoredProgress(GUEST_PROGRESS_STORAGE_KEY));

const spriteSheet = new Image();
let spritesReady = false;
spriteSheet.addEventListener("load", () => {
  spritesReady = true;
  renderMenuPlatformAssets();
});
spriteSheet.src = "../assets/platformer-assets.png";

const gameArt = {};
for (const [name, filename] of Object.entries({
  player: "slime-player.svg",
  enemy: "slime-enemy.svg",
  echo: "slime-echo.svg",
  pressurePlateBase: "pressure-plate-base.svg",
  pressurePlateTop: "pressure-plate-top.svg",
  pressurePlateTopActive: "pressure-plate-top-active.svg",
  jumpPadBase: "jump-pad-base.svg",
  jumpPadTop: "jump-pad-top.svg",
  switchLeft: "switch-left.svg",
  switchRight: "switch-right.svg",
  fragileBlockCracks: "fragile-block-cracks.svg",
  fragileBlockHalfBroken: "fragile-block-half-broken.svg",
  movingObstacle: "moving-obstacle.svg"
})) {
  const image = new Image();
  image.src = `../assets/${filename}`;
  gameArt[name] = image;
}

function drawGameArt(name, x, y, width, height) {
  const image = gameArt[name];
  if (!image?.complete || !image.naturalWidth) return false;
  ctx.drawImage(image, x, y, width, height);
  return true;
}

function currentLevel() { return levels[levelIndex]; }
function overlaps(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function playerBox() { return { x: player.x, y: player.y, w: PLAYER_W, h: PLAYER_H }; }

function resolvedHazard(hazard) {
  if (!hazard.platformId) return hazard;
  const platform = currentLevel().platforms.find((candidate) =>
    candidate.levelObjectId === hazard.platformId || candidate.switchId === hazard.platformId
  );
  if (!platform) return hazard;
  return {
    ...hazard,
    x: platform.x + hazard.offsetX,
    y: platform.y + hazard.offsetY
  };
}

function linkedControlActive(platform) {
  if (platform.requiredPlateIds?.length) {
    return platform.requiredPlateIds.every((id) =>
      currentLevel().pressurePlates?.some((plate) => plate.id === id && plate.pressed)
    );
  }
  const linkedSwitch = currentLevel().switches?.find((candidate) => candidate.id === platform.switchId);
  const linkedPlateActive = currentLevel().pressurePlates?.some((candidate) =>
    candidate.id === platform.switchId && candidate.pressed
  );
  return Boolean(linkedSwitch?.flipped || linkedPlateActive);
}

function platformHasCollision(platform) {
  return !platform.nonSolid && !platform.broken && !platform.lost &&
    (!platform.requiresActive || linkedControlActive(platform));
}

function resetEnemies(resetRewards = false) {
  enemyDeathParticles = [];
  for (const enemy of currentLevel().enemies || []) {
    enemy.x = enemy.baseX;
    enemy.direction = enemy.baseDirection;
    enemy.alive = true;
    enemy.timelinePreview = false;
    enemy.previewCursor = 0;
    enemy.previewLatest = 0;
    enemy.previewAccumulator = 0;
    enemy.previewPaused = false;
    enemy.timelinePlayback = [];
    enemy.stopped = false;
    enemy.starDropped = false;
    if (resetRewards) enemy.starCollected = false;
    if (enemy.rewindableEnemy) resetPlatformMotionHistory(enemy);
  }
}

function resetPlayer(countDeath = false, resetEnemyRewards = false) {
  if (countDeath) clearEchoState();
  if (countDeath) deaths++;
  resetBreakablePlatforms();
  resetEnemies(resetEnemyRewards);
  deathTimer = 0;
  deathParticles = [];
  landingParticles = [];
  const [x, y] = currentLevel().start;
  Object.assign(player, { x, y, vx: 0, vy: 0, grounded: false, coyote: 0, jumpBuffer: 0, padLaunched: false });
  cameraX = Math.max(0, x - VIEW_W * .3);
}

function resetBreakablePlatforms() {
  blockDebris = [];
  for (const platform of currentLevel().platforms) {
    if (!platform.breakable) continue;
    platform.broken = false;
    platform.breakTimer = null;
  }
}

function startSpikeDeath(hazardId = null) {
  cancelTimelinePreview();
  clearEchoState();
  deaths++;
  if (hazardId) recordHazardDeath(hazardId);
  playSfx("death");
  deathTimer = DEATH_DURATION;
  pressed.jump = false;
  const x = player.x + PLAYER_W / 2;
  const y = player.y + PLAYER_H / 2;
  deathParticles = Array.from({ length: 7 }, (_, index) => {
    const angle = index / 7 * Math.PI * 2;
    const speed = 65 + index % 3 * 18;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 75,
      size: 4 + index % 2 * 2,
      rotation: index * .7,
      spin: (index % 2 ? -1 : 1) * (3 + index * .3)
    };
  });
}

function resetLevelMotion() {
  clearEchoState();
  levelMotionTime = 0;
  rewindFieldPreview = null;
  if (currentLevel().rewindTutorial) currentLevel().rewindHintUnlocked = false;
  for (const levelSwitch of currentLevel().switches || []) {
    levelSwitch.flipped = false;
    levelSwitch.activeTimer = 0;
  }
  for (const plate of currentLevel().pressurePlates || []) {
    plate.pressed = false;
    plate.pressProgress = 0;
  }
  for (const platform of currentLevel().platforms) {
    if (platform.breakable) {
      platform.broken = false;
      platform.breakTimer = null;
    }
    if (platform.rewindable || platform.rewindableManual) {
      platform.x = platform.baseX;
      platform.y = platform.baseY;
      platform.releaseTimer = 0;
      platform.timelinePreview = false;
      platform.previewCursor = 0;
      platform.previewLatest = 0;
      platform.previewAccumulator = 0;
      platform.previewPaused = false;
      platform.timelinePlayback = [];
      platform.rewindGrace = 0;
      platform.timelineLocked = false;
      platform.pathIndex = platform.motionPath ? 1 : platform.pathIndex;
      platform.autoActivated = false;
      if (platform.rewindable) continue;
    }
    if (platform.pushable) {
      platform.x = platform.baseX;
      platform.y = platform.baseY;
      platform.vy = 0;
      platform.grounded = false;
      platform.lost = false;
    }
    if (platform.controlled) {
      platform.x = platform.baseX;
      platform.y = platform.baseY;
      platform.moveProgress = 0;
      platform.releaseTimer = 0;
    }
    if (!platform.moving) continue;
    const offset = Math.sin(platform.phase) * platform.range;
    platform.x = platform.baseX + (platform.axis === "x" ? offset : 0);
    platform.y = platform.baseY + (platform.axis === "y" ? offset : 0);
  }
  for (const platform of currentLevel().platforms) resetPlatformMotionHistory(platform);
  for (const enemy of currentLevel().enemies || []) {
    if (!enemy.rewindableEnemy) continue;
    enemy.x = enemy.baseX;
    enemy.direction = enemy.baseDirection;
    enemy.alive = true;
    enemy.stopped = false;
    enemy.timelinePreview = false;
    enemy.previewCursor = 0;
    enemy.previewLatest = 0;
    enemy.previewAccumulator = 0;
    enemy.previewPaused = false;
    enemy.timelinePlayback = [];
    resetPlatformMotionHistory(enemy);
  }
}

function updatePressurePlates(dt) {
  for (const plate of currentLevel().pressurePlates || []) {
    const playerOnPlate = player.grounded &&
      player.x + PLAYER_W > plate.x + 4 && player.x < plate.x + plate.w - 4 &&
      Math.abs(player.y + PLAYER_H - (plate.y + plate.h)) < 4;
    const crateOnPlate = currentLevel().platforms.some((platform) =>
      platform.pushable && !platform.broken && !platform.lost &&
      platform.x + platform.w > plate.x + 4 && platform.x < plate.x + plate.w - 4 &&
      Math.abs(platform.y + platform.h - (plate.y + plate.h)) < 4
    );
    const enemyOnPlate = (currentLevel().enemies || []).some((enemy) =>
      enemy.alive && enemy.x + enemy.w > plate.x + 4 && enemy.x < plate.x + plate.w - 4 &&
      Math.abs(enemy.y + enemy.h - (plate.y + plate.h)) < 4
    );
    const echoOnPlate = Boolean(echo?.grounded) &&
      echo.x + PLAYER_W > plate.x + 4 && echo.x < plate.x + plate.w - 4 &&
      Math.abs(echo.y + PLAYER_H - (plate.y + plate.h)) < 4;
    const isPressed = plate.enemyOnly ? enemyOnPlate
      : plate.crateOnly ? crateOnPlate
        : playerOnPlate || crateOnPlate || enemyOnPlate || echoOnPlate;
    if (isPressed && !plate.pressed) recordMechanic("pressure-plate");
    if (isPressed && currentLevel().showRewindHintOnPlate) currentLevel().rewindHintUnlocked = true;
    if (isPressed !== plate.pressed) playSfx("switch", isPressed ? .72 : .48);
    plate.pressed = isPressed;
    const target = isPressed ? 1 : 0;
    plate.pressProgress = Math.max(0, Math.min(1,
      plate.pressProgress + Math.sign(target - plate.pressProgress) * dt * 10
    ));
  }
}

function updateMomentarySwitches(dt) {
  for (const levelSwitch of currentLevel().switches || []) {
    if (!levelSwitch.momentary || levelSwitch.activeTimer <= 0) continue;
    levelSwitch.activeTimer = Math.max(0, levelSwitch.activeTimer - dt);
    levelSwitch.flipped = levelSwitch.activeTimer > 0;
  }
}

function tracksMotion(platform) {
  return Boolean(platform.rewindable || platform.rewindableManual || platform.rewindableEnemy ||
    platform.rewindableState || platform.controlled || platform.moving);
}

function isTimelineObject(platform) {
  return Boolean(platform.rewindable || platform.rewindableManual || platform.rewindableEnemy || platform.rewindableState);
}

function currentTimelineObjects() {
  return [...currentLevel().platforms, ...(currentLevel().enemies || [])].filter(isTimelineObject);
}

function timelineSnapshot(object) {
  return {
    x: object.x, y: object.y, time: levelMotionTime,
    ...(object.pushable ? {
      vy: object.vy, grounded: object.grounded, lost: object.lost
    } : {}),
    ...(object.rewindableEnemy ? {
      direction: object.direction, alive: object.alive, stopped: object.stopped,
      starDropped: object.starDropped, starX: object.starX, starY: object.starY
    } : {}),
    ...(object.rewindableState ? { broken: object.broken, breakTimer: object.breakTimer } : {})
  };
}

function resetPlatformMotionHistory(platform) {
  if (!tracksMotion(platform)) return;
  platform.motionHistory = [timelineSnapshot(platform)];
  platform.motionLastRecordedAt = levelMotionTime;
}

function recordPlatformMotion(platform, force = false) {
  if (!tracksMotion(platform)) return;
  if (!platform.motionHistory) resetPlatformMotionHistory(platform);
  const previous = platform.motionHistory[platform.motionHistory.length - 1];
  const moved = !previous || Math.hypot(platform.x - previous.x, platform.y - previous.y) >= .5;
  const stateChanged = platform.rewindableState && previous?.broken !== platform.broken;
  const enemyChanged = platform.rewindableEnemy &&
    (previous?.alive !== platform.alive || previous?.stopped !== platform.stopped);
  const crateChanged = platform.pushable &&
    (previous?.lost !== platform.lost || previous?.grounded !== platform.grounded);
  if (!force && !moved && !stateChanged && !enemyChanged && !crateChanged) return;
  if (!force && levelMotionTime - platform.motionLastRecordedAt < 1 / 30) return;
  platform.motionHistory.push(timelineSnapshot(platform));
  if (platform.motionHistory.length > 900) platform.motionHistory.shift();
  platform.motionLastRecordedAt = levelMotionTime;
}

function crateStandingOn(crate, support, supportX = support.x, supportY = support.y) {
  return !crate.lost && crate.grounded &&
    Math.abs(crate.y + crate.h - supportY) < 3 &&
    crate.x + crate.w > supportX && crate.x < supportX + support.w;
}

function resolveCrateTerrainOverlap(crate) {
  if (crate.lost) return;
  for (let pass = 0; pass < 4; pass++) {
    const solid = currentLevel().platforms.find((candidate) =>
      candidate !== crate && platformHasCollision(candidate) && overlaps(crate, candidate)
    );
    if (!solid) return;
    const shifts = [
      { axis: "x", value: solid.x - crate.w - crate.x },
      { axis: "x", value: solid.x + solid.w - crate.x },
      { axis: "y", value: solid.y - crate.h - crate.y },
      { axis: "y", value: solid.y + solid.h - crate.y }
    ];
    const shift = shifts.reduce((smallest, candidate) =>
      Math.abs(candidate.value) < Math.abs(smallest.value) ? candidate : smallest
    );
    crate[shift.axis] += shift.value;
    if (shift.axis === "y") {
      crate.vy = 0;
      crate.grounded = shift.value < 0;
    }
  }
}

function moveCrateFromSolid(crate, dx, dy, movingSolid, movedCrates, visiting = new Set()) {
  if (crate.lost || crate.timelinePreview || crate.timelinePlayback?.length > 0 || visiting.has(crate)) return false;
  visiting.add(crate);

  const riders = currentLevel().platforms.filter((candidate) =>
    candidate !== crate && candidate !== movingSolid && candidate.pushable &&
    crateStandingOn(candidate, crate)
  );
  for (const rider of riders) {
    if (!moveCrateFromSolid(rider, dx, dy, movingSolid, movedCrates, visiting)) return false;
  }

  const candidate = { x: crate.x + dx, y: crate.y + dy, w: crate.w, h: crate.h };
  if (candidate.x < 0 || candidate.x + candidate.w > currentLevel().width) return false;
  for (const solid of currentLevel().platforms) {
    if (solid === crate || solid === movingSolid || visiting.has(solid) || !platformHasCollision(solid)) continue;
    if (!overlaps(candidate, solid)) continue;
    if (!solid.pushable) return false;
    let pushX = 0;
    let pushY = 0;
    if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) {
      pushX = dx > 0 ? candidate.x + crate.w - solid.x : candidate.x - (solid.x + solid.w);
    } else if (dy !== 0) {
      pushY = dy > 0 ? candidate.y + crate.h - solid.y : candidate.y - (solid.y + solid.h);
    } else {
      return false;
    }
    if (!moveCrateFromSolid(solid, pushX, pushY, movingSolid, movedCrates, visiting)) return false;
  }

  crate.x = candidate.x;
  crate.y = candidate.y;
  if (dy !== 0) crate.vy = 0;
  movedCrates.add(crate);
  visiting.delete(crate);
  return true;
}

function pushOverlappingCrateFromSolid(platform, crate, oldX, oldY, dx, dy, movedCrates) {
  const cameFromLeft = dx > 0 && oldX + platform.w <= crate.x + 1;
  const cameFromRight = dx < 0 && oldX >= crate.x + crate.w - 1;
  const cameFromAbove = dy > 0 && oldY + platform.h <= crate.y + 1;
  const cameFromBelow = dy < 0 && oldY >= crate.y + crate.h - 1;
  if (cameFromLeft || cameFromRight) {
    const targetX = cameFromLeft ? platform.x + platform.w : platform.x - crate.w;
    return moveCrateFromSolid(crate, targetX - crate.x, 0, platform, movedCrates);
  }
  if (cameFromAbove || cameFromBelow) {
    const targetY = cameFromAbove ? platform.y + platform.h : platform.y - crate.h;
    const moved = moveCrateFromSolid(crate, 0, targetY - crate.y, platform, movedCrates);
    if (moved && cameFromBelow) {
      crate.grounded = true;
      crate.vy = 0;
    }
    return moved;
  }

  const pushLeft = platform.x - crate.w - crate.x;
  const pushRight = platform.x + platform.w - crate.x;
  const pushUp = platform.y - crate.h - crate.y;
  const pushDown = platform.y + platform.h - crate.y;
  const correction = [
    { dx: pushLeft, dy: 0 }, { dx: pushRight, dy: 0 },
    { dx: 0, dy: pushUp }, { dx: 0, dy: pushDown }
  ].sort((left, right) => Math.hypot(left.dx, left.dy) - Math.hypot(right.dx, right.dy))[0];
  return moveCrateFromSolid(crate, correction.dx, correction.dy, platform, movedCrates);
}

function movePlatformWithPlayer(platform, nextX, nextY, carryPlayer = true, recordMotion = true) {
  const oldX = platform.x;
  const oldY = platform.y;
  const totalDx = nextX - oldX;
  const totalDy = nextY - oldY;
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(totalDx), Math.abs(totalDy))));
  const stepX = totalDx / steps;
  const stepY = totalDy / steps;
  const movedCrates = new Set();
  let blocked = false;

  for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
    const stepOldX = platform.x;
    const stepOldY = platform.y;
    const crateStates = currentLevel().platforms
      .filter((candidate) => candidate.pushable)
      .map((crate) => ({ crate, x: crate.x, y: crate.y, vy: crate.vy, grounded: crate.grounded }));
    const playerState = { x: player.x, y: player.y };
    const echoState = echo ? { x: echo.x, y: echo.y } : null;
    const wasStanding = player.grounded &&
      Math.abs(player.y + PLAYER_H - stepOldY) < 3 &&
      player.x + PLAYER_W > stepOldX && player.x < stepOldX + platform.w;
    const echoWasStanding = echo?.grounded &&
      Math.abs(echo.y + PLAYER_H - stepOldY) < 3 &&
      echo.x + PLAYER_W > stepOldX && echo.x < stepOldX + platform.w;
    const supportedCrates = currentLevel().platforms.filter((crate) =>
      crate !== platform && crate.pushable && crateStandingOn(crate, platform, stepOldX, stepOldY)
    );

    platform.x += stepX;
    platform.y += stepY;
    let cratesMoved = true;
    for (const crate of supportedCrates) {
      if (!moveCrateFromSolid(crate, stepX, stepY, platform, movedCrates)) {
        cratesMoved = false;
        break;
      }
      crate.vy = 0;
      crate.grounded = true;
    }
    if (cratesMoved) {
      for (const crate of currentLevel().platforms.filter((candidate) =>
        candidate !== platform && candidate.pushable && !candidate.lost && overlaps(candidate, platform)
      )) {
        if (!pushOverlappingCrateFromSolid(platform, crate, stepOldX, stepOldY, stepX, stepY, movedCrates)) {
          cratesMoved = false;
          break;
        }
      }
    }

    if (!cratesMoved) {
      platform.x = stepOldX;
      platform.y = stepOldY;
      for (const state of crateStates) {
        state.crate.x = state.x;
        state.crate.y = state.y;
        state.crate.vy = state.vy;
        state.crate.grounded = state.grounded;
      }
      player.x = playerState.x;
      player.y = playerState.y;
      if (echo && echoState) {
        echo.x = echoState.x;
        echo.y = echoState.y;
      }
      blocked = true;
      break;
    }

    if (wasStanding && carryPlayer) {
      if (platform.moving) recordMechanic("moving-platform");
      player.x += stepX;
      player.y += stepY;
    }
    if (echoWasStanding && carryPlayer) {
      echo.x += stepX;
      echo.y += stepY;
    }
  }

  for (const crate of movedCrates) recordPlatformMotion(crate, true);
  if (recordMotion) recordPlatformMotion(platform);
  return !blocked;
}

function rewindPlateActive(platform) {
  return (currentLevel().pressurePlates || []).some((plate) =>
    plate.id === platform.plateId && plate.pressed
  );
}

function updateTimelinePreview(platform, dt) {
  if (platform.previewPaused && !input.forwardTime) return;
  platform.previewAccumulator += dt * 75;
  const steps = Math.floor(platform.previewAccumulator);
  if (steps <= 0) return;
  platform.previewAccumulator -= steps;
  if (input.forwardTime) {
    platform.previewCursor = Math.min(platform.previewLatest, platform.previewCursor + steps);
  } else {
    platform.previewCursor = Math.max(0, platform.previewCursor - steps);
  }
}

function updateTimelinePlayback(platform, dt) {
  const target = platform.timelinePlayback[0];
  if (!target) return;
  const dx = target.x - platform.x;
  const dy = target.y - platform.y;
  const distance = Math.hypot(dx, dy);
  const step = Math.min(distance, (platform.speed || 260) * 2 * dt);
  const nextX = distance <= .01 ? target.x : platform.x + dx / distance * step;
  const nextY = distance <= .01 ? target.y : platform.y + dy / distance * step;
  if (platform.pushable && target.lost === false) platform.lost = false;
  if (platform.rewindableEnemy) {
    platform.x = nextX;
    platform.y = nextY;
  } else if (platform.rewindableState) {
    platform.x = nextX;
    platform.y = nextY;
  } else {
    movePlatformWithPlayer(platform, nextX, nextY, Boolean(platform.carryDuringRewind), false);
  }
  if (distance <= step + .01) {
    if (platform.pushable) {
      platform.vy = target.vy || 0;
      platform.grounded = Boolean(target.grounded);
      platform.lost = Boolean(target.lost);
    }
    if (platform.rewindableEnemy) {
      if (typeof target.direction === "number") platform.direction = target.direction;
      if (typeof target.alive === "boolean") platform.alive = target.alive;
      platform.stopped = Boolean(target.stopped);
      platform.starDropped = !platform.starCollected && Boolean(target.starDropped);
      if (typeof target.starX === "number") platform.starX = target.starX;
      if (typeof target.starY === "number") platform.starY = target.starY;
    }
    if (platform.rewindableState && typeof target.broken === "boolean") {
      platform.broken = target.broken;
      platform.breakTimer = target.broken ? 0 : null;
    }
    platform.timelinePlayback.shift();
    if (platform.timelinePlayback.length === 0) {
      if (platform.pushable && !platform.lost) resolveCrateTerrainOverlap(platform);
      platform.rewindGrace = .85;
      if (platform.resumeAfterRewind === false) platform.timelineLocked = true;
      playSfx("rewind-release");
    }
  }
}

function playerStandingOn(platform) {
  return player.grounded && Math.abs(player.y + PLAYER_H - platform.y) < 3 &&
    player.x + PLAYER_W > platform.x && player.x < platform.x + platform.w;
}

function updateRewindablePlatform(platform, dt) {
  if (platform.timelinePreview) {
    updateTimelinePreview(platform, dt);
    return;
  }
  if (platform.timelinePlayback.length > 0) {
    updateTimelinePlayback(platform, dt);
    return;
  }
  if (platform.timelineLocked) return;

  if (platform.autoWhenRidden && playerStandingOn(platform)) platform.autoActivated = true;

  if (platform.motionPath) {
    if (!platform.autoStart && !platform.autoActivated) return;
    if (platform.pathIndex >= platform.motionPath.length && platform.loopPath) platform.pathIndex = 0;
    const target = platform.motionPath[platform.pathIndex];
    if (!target) return;
    const dx = target.x - platform.x;
    const dy = target.y - platform.y;
    const distance = Math.hypot(dx, dy);
    const step = Math.min(distance, platform.speed * dt);
    movePlatformWithPlayer(
      platform,
      distance <= .01 ? target.x : platform.x + dx / distance * step,
      distance <= .01 ? target.y : platform.y + dy / distance * step,
      platform.carryPlayer !== false
    );
    if (distance <= step + .01) {
      platform.pathIndex++;
      if (platform.pathIndex >= platform.motionPath.length && platform.loopPath) platform.pathIndex = 0;
    }
    return;
  }

  const activelyMoving = platform.autoActivated || rewindPlateActive(platform);
  if (activelyMoving) platform.releaseTimer = platform.releaseDelay;
  else platform.releaseTimer = Math.max(0, platform.releaseTimer - dt);
  if (!activelyMoving && platform.releaseTimer <= 0) return;

  platform.rewindGrace = Math.max(0, platform.rewindGrace - dt);
  const travelSpeed = platform.rewindGrace > 0 ? 125 : platform.speed;
  const dx = platform.targetX - platform.x;
  const dy = platform.targetY - platform.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= .01) return;
  const step = Math.min(distance, travelSpeed * dt);
  const nextX = platform.x + dx / distance * step;
  const nextY = platform.y + dy / distance * step;
  movePlatformWithPlayer(platform, nextX, nextY);
}

function updateMovingPlatforms(dt) {
  levelMotionTime += dt;
  for (const platform of currentLevel().platforms) {
    if (isTimelineObject(platform)) {
      if (platform.rewindableManual || platform.rewindableState) {
        if (platform.timelinePreview) updateTimelinePreview(platform, dt);
        else if (platform.timelinePlayback?.length > 0) updateTimelinePlayback(platform, dt);
        continue;
      }
      updateRewindablePlatform(platform, dt);
      continue;
    }
    if (platform.controlled) {
      if (linkedControlActive(platform)) platform.releaseTimer = platform.releaseDelay;
      else platform.releaseTimer = Math.max(0, platform.releaseTimer - dt);
      const targetProgress = linkedControlActive(platform) || platform.releaseTimer > 0 ? 1 : 0;
      if (platform.moveProgress === targetProgress) continue;
      const previousProgress = platform.moveProgress;
      platform.moveProgress = Math.max(0, Math.min(1,
        platform.moveProgress + Math.sign(targetProgress - platform.moveProgress) * dt / (platform.moveDuration || 1.15)
      ));
      const eased = platform.moveProgress * platform.moveProgress * (3 - 2 * platform.moveProgress);
      const movedFully = movePlatformWithPlayer(
        platform,
        platform.baseX + (platform.targetX - platform.baseX) * eased,
        platform.baseY + (platform.targetY - platform.baseY) * eased
      );
      if (!movedFully) platform.moveProgress = previousProgress;
      continue;
    }
    if (!platform.moving) continue;
    const offset = Math.sin(levelMotionTime * platform.speed + platform.phase) * platform.range;
    movePlatformWithPlayer(
      platform,
      platform.baseX + (platform.axis === "x" ? offset : 0),
      platform.baseY + (platform.axis === "y" ? offset : 0)
    );
  }
}

function updateEnemies(dt, previousPlayerBottom) {
  for (const [enemyIndex, enemy] of (currentLevel().enemies || []).entries()) {
    if (enemy.timelinePreview) {
      updateTimelinePreview(enemy, dt);
    } else if (enemy.timelinePlayback?.length > 0) {
      updateTimelinePlayback(enemy, dt);
    } else if (enemy.alive && !enemy.stopped) {
      const nextX = enemy.x + enemy.direction * enemy.speed * dt;
      const candidate = { x: nextX, y: enemy.y, w: enemy.w, h: enemy.h };
      const reachedBoundary = nextX < enemy.minX || nextX > enemy.maxX;
      const blocked = currentLevel().platforms.some((platform) =>
        platformHasCollision(platform) && overlaps(candidate, platform)
      );
      if (reachedBoundary || blocked) {
        if (enemy.stopAtBoundary) enemy.stopped = true;
        else enemy.direction *= -1;
        enemy.x = Math.max(enemy.minX, Math.min(enemy.maxX, enemy.x));
        recordPlatformMotion(enemy, true);
      } else {
        enemy.x = nextX;
        recordPlatformMotion(enemy);
      }
    }

    if (!enemy.alive) continue;

    if (!overlaps(playerBox(), enemy)) continue;
    const stomped = player.vy >= 0 && previousPlayerBottom <= enemy.y + 9;
    if (stomped) {
      recordMechanic("enemy-stomp");
      enemy.alive = false;
      if (!enemy.starCollected) {
        enemy.starDropped = true;
        enemy.starX = enemy.x + enemy.w / 2;
        enemy.starY = enemy.y + enemy.h / 2;
      }
      recordPlatformMotion(enemy, true);
      createEnemyDeathParticles(enemy);
      player.y = enemy.y - PLAYER_H;
      player.vy = -JUMP_SPEED * .48;
      player.grounded = false;
      player.coyote = 0;
      playSfx("enemy-stomp");
      continue;
    }
    startSpikeDeath(`${levelIndex}:enemy:${enemyIndex}`);
    return true;
  }
  return false;
}

function createEnemyDeathParticles(enemy) {
  const centerX = enemy.x + enemy.w / 2;
  const centerY = enemy.y + enemy.h / 2;
  for (let index = 0; index < 7; index++) {
    const angle = index / 7 * Math.PI * 2;
    const speed = 65 + index % 3 * 18;
    enemyDeathParticles.push({
      x: centerX, y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 75,
      size: 4 + index % 2 * 2,
      rotation: index * .7,
      spin: (index % 2 ? -1 : 1) * (3 + index * .3),
      life: DEATH_DURATION
    });
  }
}

function updateEnemyDeathParticles(dt) {
  for (const particle of enemyDeathParticles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 500 * dt;
    particle.rotation += particle.spin * dt;
    particle.life -= dt;
  }
  enemyDeathParticles = enemyDeathParticles.filter((particle) => particle.life > 0);
}

function loadLevel(index, keepScore = true) {
  levelIndex = index;
  collected = currentLevel().stars.map(() => false);
  if (!keepScore) { totalStars = 0; deaths = 0; }
  levelTransition = 0;
  won = false;
  message.hidden = true;
  chapterCompleteMessage.hidden = true;
  echoChapterMessage.hidden = true;
  convergenceChapterMessage.hidden = true;
  gauntletCompleteMessage.hidden = true;
  resetLevelMotion();
  resetPlayer(false, true);
  if (timerRunning && gameStarted) beginLevelTimer();
  else resetLevelTimer();
  updateHud();
  if (gameStarted) startMusic(currentLevel().music || `level${index + 1}`);
}

function restartLevel() {
  if (!gameStarted || won || cutsceneActive || deathTimer > 0 || levelTransition > 0) return false;
  const gained = currentLevelStarCount();
  totalStars = Math.max(0, totalStars - gained);
  collected.fill(false);
  levelTransition = 0;
  nextLevelIndex = null;
  cancelTimelinePreview();
  resetLevelMotion();
  resetPlayer(false, true);
  beginLevelTimer();
  updateHud();
  return true;
}

function updateHud() {
  levelLabel.textContent = currentLevel().gauntletId
    ? `Gauntlet ${currentLevel().gauntletId} — ${currentLevel().name}`
    : `Level ${levelIndex + 1} / ${CAMPAIGN_LEVEL_COUNT} — ${currentLevel().name}`;
  const enemyStarTotal = (currentLevel().enemies || []).length;
  starLabel.textContent = `Stars ${currentLevelStarCount()} / ${collected.length + enemyStarTotal}`;
}

function currentLevelStarCount() {
  const enemyStars = (currentLevel().enemies || []).filter((enemy) => enemy.starCollected).length;
  return collected.filter(Boolean).length + enemyStars;
}

function currentRunTime() {
  return timerRunning ? (performance.now() - runStartedAt) / 1000 : runElapsed;
}

function currentLevelTime() {
  return levelTimerRunning ? (performance.now() - levelStartedAt) / 1000 : levelElapsed;
}

function formatRunTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = (seconds % 60).toFixed(1).padStart(4, "0");
  return `${minutes}:${remainder}`;
}

function updateTimerHud() {
  timerLabel.textContent = `Run ${formatRunTime(currentRunTime())}`;
  levelTimerLabel.textContent = `Level ${formatRunTime(currentLevelTime())}`;
}

function startRunTimer() {
  if (timerRunning || paused || won || !gameStarted) return;
  if (currentLevel().postRun && !countPostRunInRunTimer) {
    if (!levelTimerRunning) {
      levelStartedAt = performance.now() - levelElapsed * 1000;
      levelTimerRunning = true;
    }
    return;
  }
  runStartedAt = performance.now() - runElapsed * 1000;
  timerRunning = true;
  if (!levelTimerRunning) {
    levelStartedAt = performance.now() - levelElapsed * 1000;
    levelTimerRunning = true;
  }
}

function finishRunTimer() {
  runElapsed = currentRunTime();
  timerRunning = false;
  updateTimerHud();
}

function resumeRunTimerForLoadedLevel() {
  runStartedAt = performance.now() - runElapsed * 1000;
  timerRunning = true;
  beginLevelTimer();
}

function finishLevelTimer() {
  levelElapsed = currentLevelTime();
  levelTimerRunning = false;
  updateTimerHud();
}

function beginLevelTimer() {
  levelElapsed = 0;
  levelStartedAt = performance.now();
  levelTimerRunning = timerRunning && !paused;
  updateTimerHud();
}

function resetLevelTimer() {
  levelStartedAt = 0;
  levelElapsed = 0;
  levelTimerRunning = false;
}

function resetRunTimer() {
  runStartedAt = 0;
  runElapsed = 0;
  timerRunning = false;
  resetLevelTimer();
  updateTimerHud();
}

function completeLevelSplit() {
  finishLevelTimer();
  levelSplits[levelIndex] = Math.round(levelElapsed * 10) / 10;
}

function renderSplitSummary() {
  splitList.replaceChildren();
  const resultSplits = finishedRun?.splits || levelSplits;
  levels.forEach((level, index) => {
    if (!Number.isFinite(resultSplits[index])) return;
    const item = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = `${level.gauntletId || index + 1}. ${level.name}`;
    const time = document.createElement("strong");
    time.textContent = formatRunTime(resultSplits[index]);
    item.append(name, time);
    splitList.append(item);
  });
}

function leaderboardHeaders(includeJson = false) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    ...(accountSession?.access_token ? { Authorization: `Bearer ${accountSession.access_token}` } : {}),
    ...(includeJson ? { "Content-Type": "application/json" } : {})
  };
}

function storedProgressExists(key) {
  try { return localStorage.getItem(key) !== null; }
  catch { return false; }
}

function accountRedirectUrl() {
  const redirect = new URL(location.href);
  redirect.search = "";
  redirect.hash = "";
  return redirect.href;
}

function setAccountMessage(message = "", isError = false) {
  accountFormStatus.textContent = message;
  accountFormStatus.classList.toggle("error", isError);
}

function accountFriendlyError(error) {
  return window.PlatformsAccount?.friendlyError(error) || "That account request could not be completed. Please try again.";
}

function accountDisplayName() {
  if (accountProfile?.display_name) return accountProfile.display_name;
  const metadataName = window.PlatformsAccount?.cleanDisplayName(accountSession?.user?.user_metadata?.display_name);
  return metadataName || (accountSession?.user?.id ? `Traveler-${accountSession.user.id.slice(0, 6)}` : "");
}

function applyLeaderboardIdentity() {
  const signedInName = accountDisplayName();
  const label = document.querySelector('label[for="runNameInput"]');
  if (accountSession && signedInName) {
    runNameInput.value = signedInName;
    runNameInput.readOnly = true;
    if (label) label.textContent = "Publishing as";
  } else {
    runNameInput.readOnly = false;
    if (label) label.textContent = "Name this run";
  }
}

function renderAccountState(message = "") {
  const signedIn = Boolean(accountSession?.user);
  const displayName = accountDisplayName();
  signedOutAccountActions.hidden = signedIn;
  signedInAccountActions.hidden = !signedIn;
  accountIdentity.textContent = signedIn ? displayName || "Signed in" : "Playing as Guest";
  playButton.textContent = signedIn ? "Play" : "Continue as Guest";
  restartSessionButton.disabled = signedIn;
  restartSessionButton.title = signedIn ? "Sign out before resetting guest progress." : "";
  if (message) accountNotice.textContent = message;
  else if (!signedIn) accountNotice.textContent = "Account optional";
  else accountNotice.textContent = "Progress synced";
  applyLeaderboardIdentity();
}

function showAccountMode(mode, message = "") {
  const forms = { signin: signInForm, signup: signUpForm, forgot: forgotPasswordForm, recovery: newPasswordForm, profile: profileForm };
  const titles = { signin: "Sign In", signup: "Create Account", forgot: "Reset Password", recovery: "Choose New Password", profile: "Player Profile" };
  Object.entries(forms).forEach(([name, form]) => { form.hidden = name !== mode; });
  accountMenuTitle.textContent = titles[mode] || "Player Account";
  setAccountMessage(message);
  accountMenu.hidden = false;
  settingsPanel.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  if (mode === "profile") profileDisplayName.value = accountDisplayName();
  const focusTarget = forms[mode]?.querySelector("input, button");
  focusTarget?.focus();
}

function closeAccountMenu() {
  if (accountRecoveryActive && !newPasswordForm.hidden) {
    setAccountMessage("Finish choosing a new password or refresh to leave recovery mode.", true);
    return;
  }
  accountMenu.hidden = true;
  setAccountMessage();
  if (!mainMenu.hidden) playButton.focus();
}

function setAccountFormBusy(form, busy) {
  form.querySelectorAll("input, button").forEach((control) => { control.disabled = busy; });
  closeAccountButton.disabled = busy;
}

function cleanAuthReturnUrl() {
  if (!location.search && !location.hash) return;
  try { history.replaceState({}, document.title, accountRedirectUrl()); }
  catch { /* A local file preview may not permit URL cleanup. */ }
}

async function syncProgressWithAccount(session, event = "SIGNED_IN") {
  const generation = ++accountSyncGeneration;
  const service = window.PlatformsAccount;
  if (!session?.user || !service) return;
  accountSession = session;
  renderAccountState("Loading account...");

  const userId = session.user.id;
  const accountKey = `${ACCOUNT_PROGRESS_STORAGE_PREFIX}${userId}`;
  const guestProgress = readStoredProgress(GUEST_PROGRESS_STORAGE_KEY);
  const cachedProgress = readStoredProgress(accountKey);
  const preferenceProgress = storedProgressExists(accountKey) ? cachedProgress : guestProgress;
  let remoteProgress = null;
  let syncWarning = "";

  try {
    accountProfile = await service.loadOrCreateProfile(session.user);
  } catch (error) {
    accountProfile = { user_id: userId, display_name: accountDisplayName() };
    syncWarning = accountFriendlyError(error);
  }

  try {
    remoteProgress = await service.loadProgress(userId);
  } catch (error) {
    syncWarning = accountFriendlyError(error);
  }
  if (generation !== accountSyncGeneration || accountSession?.user?.id !== userId) return;

  const merged = mergeProgress(preferenceProgress, remoteProgress, guestProgress, cachedProgress);
  applyProgress(merged);
  writeStoredProgress(accountKey, merged);
  applyRewindMenuState();
  if (!roadmapMenu.hidden) renderRoadmap();

  try {
    const saved = await service.saveProgress(userId, accountProgressPayload(merged));
    if (saved) {
      const serverMerged = mergeProgress(merged, saved);
      applyProgress(serverMerged);
      writeStoredProgress(accountKey, serverMerged);
    }
  } catch (error) {
    syncWarning = accountFriendlyError(error);
  }
  if (generation !== accountSyncGeneration || accountSession?.user?.id !== userId) return;

  let finalMessage = syncWarning;
  if (event === "PASSWORD_RECOVERY") {
    accountRecoveryActive = true;
    showAccountMode("recovery", "The reset link is valid. Choose your new password.");
  } else if (event === "SIGNED_IN" && /[?#]/.test(location.href)) {
    finalMessage = "Email verified. Signed in.";
  }
  cleanAuthReturnUrl();
  renderAccountState(finalMessage);
}

function restoreGuestProgress() {
  accountSyncGeneration++;
  accountSession = null;
  accountProfile = null;
  accountRecoveryActive = false;
  if (accountProgressSyncTimer) clearTimeout(accountProgressSyncTimer);
  applyProgress(readStoredProgress(GUEST_PROGRESS_STORAGE_KEY));
  applyRewindMenuState();
  if (!roadmapMenu.hidden) renderRoadmap();
  renderAccountState();
}

function scheduleAccountProgressSync() {
  if (!accountSession?.user?.id || !window.PlatformsAccount?.isAvailable()) return;
  if (accountProgressSyncTimer) clearTimeout(accountProgressSyncTimer);
  const userId = accountSession.user.id;
  accountProgressSyncTimer = setTimeout(async () => {
    accountProgressSyncTimer = null;
    if (accountSession?.user?.id !== userId) return;
    const progress = currentProgressSnapshot();
    writeStoredProgress(`${ACCOUNT_PROGRESS_STORAGE_PREFIX}${userId}`, progress);
    try {
      const saved = await window.PlatformsAccount.saveProgress(userId, accountProgressPayload(progress));
      if (!saved || accountSession?.user?.id !== userId) return;
      const merged = mergeProgress(progress, saved);
      applyProgress(merged);
      writeStoredProgress(`${ACCOUNT_PROGRESS_STORAGE_PREFIX}${userId}`, merged);
      accountNotice.textContent = "Progress synced";
    } catch (error) {
      accountNotice.textContent = accountFriendlyError(error);
    }
  }, 450);
}

async function initializeAccounts() {
  renderAccountState();
  if (!window.PlatformsAccount) {
    accountInitializationError = new Error("Account service could not be reached.");
    return;
  }
  window.PlatformsAccount.subscribe((event, session) => {
    setTimeout(() => {
      if (session?.user) syncProgressWithAccount(session, event);
      else if (event === "SIGNED_OUT" || event === "INITIAL_SESSION") restoreGuestProgress();
    }, 0);
  });
  try {
    await window.PlatformsAccount.initialize(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  } catch (error) {
    accountInitializationError = error;
    restoreGuestProgress();
  }
}

async function loadGlobalLeaderboard(rulesetId, metric, runType) {
  const rankingOrders = {
    time: "seconds.asc,stars.desc,score.desc,created_at.asc",
    stars: "stars.desc,seconds.asc,score.desc,created_at.asc",
    score: "score.desc,seconds.asc,stars.desc,created_at.asc"
  };
  const query = new URLSearchParams({
    select: "name,game_version,seconds,stars,score,created_at",
    leaderboard_id: `eq.${rulesetId}`,
    run_type_id: `eq.${runType}`,
    ranking_metric: `eq.${metric}`,
    order: rankingOrders[metric] || rankingOrders.time,
    limit: "50"
  });
  const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard_scores?${query}`, {
    headers: leaderboardHeaders()
  });
  if (!response.ok) throw new Error(`Leaderboard request failed (${response.status})`);
  return response.json();
}

function applyRewindMenuState() {
  menuStage.classList.toggle("rewind-awakened", rewindMenuAwakened);
  menuStage.classList.toggle("backdrop-lava", menuBackdrop === "lava");
  menuCustomization.hidden = !menuCustomizationUnlocked;
  awakenedMenuAnimationStart = null;
  if (!rewindMenuAwakened) {
    menuPlatforms.forEach(platform => {
      platform.style.removeProperty("left");
      platform.style.removeProperty("right");
      platform.style.removeProperty("bottom");
    });
  }
  menuAnimationButtons.forEach(button => {
    const active = button.dataset.menuAnimation === (rewindMenuAwakened ? "awakened" : "classic");
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  menuTextureButtons.forEach(button => {
    const active = button.dataset.menuTexture === menuPlatformTexture;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  menuBackdropButtons.forEach(button => {
    const active = button.dataset.menuBackdrop === menuBackdrop;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderMenuPlatformAssets();
  const animationLabel = rewindMenuAwakened ? "climbing between two looping platforms" : "jumping between two platforms";
  const backdropLabel = menuBackdrop === "lava" ? "a lava-dark sky" : "a sunny sky";
  menuStage.setAttribute("aria-label", `A green slime ${animationLabel} on ${menuPlatformTexture} textures beneath ${backdropLabel}`);
}

function renderMenuPlatformAssets() {
  if (!spritesReady) {
    menuPlatforms.forEach(platform => platform.classList.remove("asset-texture"));
    return;
  }
  menuPlatformCanvases.forEach((canvas, index) => {
    const platformContext = canvas.getContext("2d");
    platformContext.clearRect(0, 0, canvas.width, canvas.height);
    drawAssetRectangle(menuPlatformTexture, 0, 0, canvas.width, canvas.height, platformContext);
    menuPlatforms[index].classList.add("asset-texture");
  });
}

function selectMenuAnimation(mode) {
  if (!menuCustomizationUnlocked) return;
  rewindMenuAwakened = mode === "awakened";
  applyRewindMenuState();
  persistProgress();
}

function selectMenuTexture(texture) {
  if (!menuCustomizationUnlocked || !["grass", "stone", "crate"].includes(texture)) return;
  menuPlatformTexture = texture;
  applyRewindMenuState();
  persistProgress();
}

function selectMenuBackdrop(backdrop) {
  if (!menuCustomizationUnlocked || !["sun", "lava"].includes(backdrop)) return;
  menuBackdrop = backdrop;
  applyRewindMenuState();
  persistProgress();
}

function unlockThrough(index) {
  const unlocked = Math.max(0, Math.min(CAMPAIGN_LEVEL_COUNT - 1, index));
  if (unlocked <= highestUnlockedLevel) return;
  highestUnlockedLevel = unlocked;
  persistProgress();
}

function completeChapter(chapterIndex) {
  if (chapterIndex < 0 || chapterIndex >= GAUNTLET_COUNT) return;
  const previousSize = completedChapters.size;
  completedChapters.add(chapterIndex);
  if (completedChapters.size !== previousSize) persistProgress();
  if (!roadmapMenu.hidden) renderRoadmap();
}

function resetRunProgress() {
  runProgress = { completedLevels: new Set(), hazardDeaths: new Set(), mechanics: new Set() };
}

function runTypeId(config) {
  const levelsPart = config.levels.map((index) => index + 1).join("-");
  return `${config.objective}:${levelsPart}:${config.constraint}`;
}

function runTypeLabel(config) {
  const levelDetail = config.objective === "specific" ? ` (${config.levels.map((index) => index + 1).join(", ")})` : "";
  return `${RUN_OBJECTIVE_LABELS[config.objective]}${levelDetail} · ${RUN_CONSTRAINT_LABELS[config.constraint]}`;
}

function availableHazards(levelIndexes) {
  const hazards = new Set();
  levelIndexes.forEach((index) => {
    const level = levels[index];
    (level.hazards || []).forEach((hazard, hazardIndex) => hazards.add(`${index}:hazard:${hazardIndex}`));
    (level.enemies || []).forEach((enemy, enemyIndex) => hazards.add(`${index}:enemy:${enemyIndex}`));
  });
  return hazards;
}

function availableMechanics(levelIndexes) {
  const mechanics = new Set();
  levelIndexes.forEach((index) => {
    const level = levels[index];
    if ((level.jumpPads || []).length) mechanics.add("jump-pad");
    if ((level.platforms || []).some((platform) => platform.moving)) mechanics.add("moving-platform");
    if ((level.platforms || []).some((platform) => platform.pushable)) mechanics.add("crate");
    if ((level.platforms || []).some((platform) => platform.breakable && platform.breakTrigger === "stand")) mechanics.add("crumble");
    if ((level.platforms || []).some((platform) => platform.breakable && platform.breakTrigger === "impact")) mechanics.add("impact-block");
    if ((level.switches || []).length) mechanics.add("switch");
    if ((level.pressurePlates || []).length) mechanics.add("pressure-plate");
    if ((level.enemies || []).length) mechanics.add("enemy-stomp");
  });
  return mechanics;
}

function routeStarTotal(levelIndexes) {
  return levelIndexes.reduce((sum, index) => sum + levels[index].stars.length + (levels[index].enemies || []).length, 0);
}

function recordMechanic(mechanic) {
  if (activeRunConfig) runProgress.mechanics.add(mechanic);
}

function recordHazardDeath(hazard) {
  if (activeRunConfig) runProgress.hazardDeaths.add(hazard);
}

function runRequirementStatus(config) {
  const missing = [];
  const requiresStars = config.objective === "all-stars" || config.constraint === "all-stars";
  const requiresHazards = config.objective === "all-hazards" || config.constraint === "all-hazards";
  const requiresMechanics = config.objective === "all-mechanics" || config.constraint === "all-mechanics";
  if (config.constraint === "no-stars" && totalStars > 0) missing.push("the no-stars constraint was broken");
  if (requiresStars && totalStars < routeStarTotal(config.levels)) missing.push("not every star was collected");
  if (requiresHazards) {
    const unseen = [...availableHazards(config.levels)].filter((hazard) => !runProgress.hazardDeaths.has(hazard));
    if (unseen.length) missing.push(`${unseen.length} placed ${unseen.length === 1 ? "hazard has" : "hazards have"} not defeated you`);
  }
  if (requiresMechanics) {
    const unused = [...availableMechanics(config.levels)].filter((mechanic) => !runProgress.mechanics.has(mechanic));
    if (unused.length) missing.push(`unused mechanics: ${unused.join(", ")}`);
  }
  const incomplete = config.levels.filter((index) => !runProgress.completedLevels.has(index));
  if (incomplete.length) missing.push(`unfinished levels: ${incomplete.map((index) => index + 1).join(", ")}`);
  return { success: missing.length === 0, missing };
}

function populateSpecificLevelChoices() {
  specificLevelChoices.replaceChildren();
  ALL_INTRO_LEVELS.forEach((levelIndex) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "specificLevel";
    input.value = String(levelIndex);
    input.checked = levelIndex === 0;
    label.append(input, document.createTextNode(String(levelIndex + 1)));
    specificLevelChoices.append(label);
  });
}

function readRunSetup() {
  const data = new FormData(runSetupForm);
  const objective = String(data.get("runObjective") || "complete-all");
  const constraint = String(data.get("runConstraint") || "none");
  const metric = String(data.get("runMetric") || "time");
  const specificLevels = data.getAll("specificLevel").map(Number).sort((a, b) => a - b);
  const route = objective === "specific" ? specificLevels : [...ALL_INTRO_LEVELS];
  return { objective, constraint, metric, levels: route };
}

function updateRunSetup() {
  const config = readRunSetup();
  specificLevelChoices.hidden = config.objective !== "specific";
  if (config.levels.length === 0) {
    runSetupSummary.textContent = "Choose at least one level.";
    return;
  }
  runSetupSummary.textContent = `${runTypeLabel(config)} · Ranked by ${config.metric}`;
}

function openPlayChoice() {
  gameStarted = false;
  accountMenu.hidden = true;
  settingsPanel.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  mainMenu.hidden = true;
  playChoiceMenu.hidden = false;
  customRunButton.focus();
}

function closePlayChoice() {
  playChoiceMenu.hidden = true;
  mainMenu.hidden = false;
  playButton.focus();
}

function openRunSetup() {
  gameStarted = false;
  settingsPanel.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  mainMenu.hidden = true;
  playChoiceMenu.hidden = true;
  runSetupMenu.hidden = false;
  updateRunSetup();
  runSetupForm.querySelector("input:checked")?.focus();
}

function closeRunSetup() {
  runSetupMenu.hidden = true;
  playChoiceMenu.hidden = false;
  customRunButton.focus();
}

const ROADMAP_CHAPTER_SIZE = 10;
const ROADMAP_CHAPTERS = ["Introduction", "Rewind", "Echo", "Rewind + Echo"];
const ROADMAP_POINTS = [
  [10, 20], [30, 20], [50, 20], [70, 20], [90, 20],
  [10, 58], [30, 58], [50, 58], [70, 58], [90, 58]
];
const ROADMAP_GAUNTLET_POINT = [50, 87];
const ROADMAP_GAUNTLETS = Array.from({ length: GAUNTLET_COUNT }, (_, chapterIndex) => ({
  chapterIndex,
  levelIndex: CAMPAIGN_LEVEL_COUNT + chapterIndex,
  id: `G${chapterIndex + 1}`
}));

function renderRoadmap() {
  levelRoadmap.replaceChildren();
  const lastChapter = ROADMAP_CHAPTERS.length - 1;
  const chapterStart = roadmapChapterIndex * ROADMAP_CHAPTER_SIZE;
  const chapterLevels = levels.slice(chapterStart, Math.min(CAMPAIGN_LEVEL_COUNT, chapterStart + ROADMAP_CHAPTER_SIZE));
  const chapterEnd = chapterStart + chapterLevels.length;
  const gauntlet = ROADMAP_GAUNTLETS[roadmapChapterIndex];
  const gauntletLevel = levels[gauntlet.levelIndex];
  roadmapChapterLabel.textContent = ROADMAP_CHAPTERS[roadmapChapterIndex] || `Chapter ${roadmapChapterIndex + 1}`;
  roadmapChapterRange.textContent = `Levels ${chapterStart + 1}-${chapterEnd} · Optional ${gauntlet.id}`;
  previousRoadmapChapterButton.disabled = roadmapChapterIndex === 0;
  nextRoadmapChapterButton.disabled = roadmapChapterIndex >= lastChapter;
  levelRoadmap.setAttribute("aria-label", `${roadmapChapterLabel.textContent} roadmap, levels ${chapterStart + 1} through ${chapterEnd}`);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("roadmap-lines");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  for (let index = 0; index < chapterLevels.length - 1; index++) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", `${ROADMAP_POINTS[index].join(",")} ${ROADMAP_POINTS[index + 1].join(",")}`);
    if (chapterStart + index < highestUnlockedLevel) line.classList.add("unlocked");
    svg.append(line);
  }
  const gauntletLine = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  gauntletLine.classList.add("gauntlet-branch");
  gauntletLine.setAttribute("points", `${ROADMAP_POINTS[ROADMAP_POINTS.length - 1].join(",")} ${ROADMAP_GAUNTLET_POINT.join(",")}`);
  if (completedChapters.has(roadmapChapterIndex)) gauntletLine.classList.add("unlocked");
  svg.append(gauntletLine);
  levelRoadmap.append(svg);

  chapterLevels.forEach((level, index) => {
    const levelIndex = chapterStart + index;
    const node = document.createElement("div");
    const locked = levelIndex > highestUnlockedLevel;
    node.className = `roadmap-level${locked ? " locked" : ""}`;
    node.style.left = `${ROADMAP_POINTS[index][0]}%`;
    node.style.top = `${ROADMAP_POINTS[index][1]}%`;
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = locked;
    button.setAttribute("aria-label", locked ? `Level ${levelIndex + 1}, locked` : `Play level ${levelIndex + 1}: ${level.name}`);
    if (locked) {
      button.innerHTML = '<svg class="roadmap-lock" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7Zm3 0h4V7a2 2 0 1 0-4 0v3Z"/></svg>';
    } else {
      button.textContent = String(levelIndex + 1);
      button.addEventListener("click", () => startRoadmapRun(levelIndex));
    }
    const name = document.createElement("span");
    name.className = "level-name";
    name.textContent = locked ? `Level ${levelIndex + 1}` : level.name;
    node.append(button, name);
    levelRoadmap.append(node);
  });

  const gauntletLocked = !completedChapters.has(roadmapChapterIndex);
  const gauntletComplete = completedGauntlets.has(gauntlet.id);
  const gauntletNode = document.createElement("div");
  gauntletNode.className = `roadmap-level roadmap-gauntlet${gauntletLocked ? " locked" : ""}${gauntletComplete ? " completed" : ""}`;
  gauntletNode.style.left = `${ROADMAP_GAUNTLET_POINT[0]}%`;
  gauntletNode.style.top = `${ROADMAP_GAUNTLET_POINT[1]}%`;
  const gauntletButton = document.createElement("button");
  gauntletButton.type = "button";
  gauntletButton.disabled = gauntletLocked;
  gauntletButton.setAttribute("aria-label", gauntletLocked
    ? `${gauntlet.id}, locked until this chapter is complete`
    : `Play ${gauntlet.id}: ${gauntletLevel.name}${gauntletComplete ? ", completed" : ""}`);
  if (gauntletLocked) {
    gauntletButton.innerHTML = '<svg class="roadmap-lock" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7Zm3 0h4V7a2 2 0 1 0-4 0v3Z"/></svg>';
  } else {
    gauntletButton.textContent = gauntletComplete ? `${gauntlet.id} ✓` : gauntlet.id;
    gauntletButton.addEventListener("click", () => startGauntletRun(gauntlet.levelIndex));
  }
  const gauntletName = document.createElement("span");
  gauntletName.className = "level-name";
  gauntletName.textContent = gauntletLocked ? `${gauntlet.id} Gauntlet` : gauntletLevel.name;
  gauntletNode.append(gauntletButton, gauntletName);
  levelRoadmap.append(gauntletNode);
}

function setRoadmapChapter(index) {
  const lastChapter = ROADMAP_CHAPTERS.length - 1;
  const nextIndex = Math.max(0, Math.min(lastChapter, index));
  if (nextIndex === roadmapChapterIndex) return false;
  roadmapChapterIndex = nextIndex;
  renderRoadmap();
  return true;
}

function openRoadmap() {
  gameStarted = false;
  settingsPanel.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  mainMenu.hidden = true;
  playChoiceMenu.hidden = true;
  const lastChapter = ROADMAP_CHAPTERS.length - 1;
  roadmapChapterIndex = Math.min(lastChapter, Math.floor(highestUnlockedLevel / ROADMAP_CHAPTER_SIZE));
  renderRoadmap();
  roadmapMenu.hidden = false;
  levelRoadmap.querySelector("button:not(:disabled)")?.focus();
}

function closeRoadmap() {
  roadmapMenu.hidden = true;
  playChoiceMenu.hidden = false;
  roadmapChoiceButton.focus();
}

function startRoadmapRun(index) {
  activeRunConfig = null;
  runLevelQueue = [];
  runQueuePosition = 0;
  countPostRunInRunTimer = index >= INTRO_LEVEL_COUNT;
  beginRun(index);
}

function captureChapterReturnState(chapterIndex) {
  return {
    chapterIndex,
    levelSplits: [...levelSplits],
    runElapsed,
    levelElapsed,
    runStartLevel,
    countPostRunInRunTimer,
    totalStars,
    deaths,
    finishedRun: finishedRun ? { ...finishedRun, splits: [...finishedRun.splits] } : null,
    runPublished,
    runName: runNameInput.value,
    runNameDisabled: runNameInput.disabled,
    publishDisabled: publishRunButton.disabled,
    publishStatus: publishStatus.textContent
  };
}

function startChapterGauntlet(chapterIndex) {
  const gauntletIndex = CAMPAIGN_LEVEL_COUNT + chapterIndex;
  const gauntlet = levels[gauntletIndex];
  if (!gauntlet?.gauntletId || !completedChapters.has(gauntlet.gauntletChapter)) return false;
  gauntletChapterReturnState = captureChapterReturnState(chapterIndex);
  startGauntletRun(gauntletIndex, true);
  return true;
}

function startGauntletRun(index, preserveChapterReturn = false) {
  const gauntlet = levels[index];
  if (!gauntlet?.gauntletId || !completedChapters.has(gauntlet.gauntletChapter)) return;
  if (!preserveChapterReturn) gauntletChapterReturnState = null;
  activeRunConfig = null;
  runLevelQueue = [];
  runQueuePosition = 0;
  countPostRunInRunTimer = true;
  beginRun(index);
}

function startConfiguredRun() {
  const config = readRunSetup();
  if (config.levels.length === 0) {
    runSetupSummary.textContent = "Choose at least one level before starting.";
    return;
  }
  selectedRunConfig = config;
  activeRunConfig = { ...config, levels: [...config.levels] };
  runLevelQueue = [...config.levels];
  runQueuePosition = 0;
  countPostRunInRunTimer = true;
  leaderboardMetric = config.metric;
  beginRun(runLevelQueue[0]);
}

function beginRun(index) {
  resetCutscene();
  runStartLevel = index;
  gameStarted = true;
  paused = false;
  timerWasRunningBeforePause = false;
  levelTimerWasRunningBeforePause = false;
  levelSplits = [];
  nextLevelIndex = null;
  resetRunProgress();
  resetRunTimer();
  resetFinishedRun();
  loadLevel(index, false);
  ensureAudio();
  playChoiceMenu.hidden = true;
  roadmapMenu.hidden = true;
  runSetupMenu.hidden = true;
  leaderboardMenu.hidden = true;
  changelogMenu.hidden = true;
  versionsMenu.hidden = true;
  accountMenu.hidden = true;
  pauseButton.disabled = false;
  restartButton.disabled = false;
  restartRunButton.disabled = false;
  quitButton.disabled = false;
  canvas.focus();
}

function renderLeaderboard() {
  leaderboardList.replaceChildren();
  if (leaderboardEntries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "leaderboard-empty";
    empty.textContent = "No published runs yet.";
    leaderboardList.append(empty);
    return;
  }

  leaderboardEntries.forEach((entry, index) => {
    const item = document.createElement("li");
    item.className = "leaderboard-entry";
    const rank = document.createElement("span");
    rank.className = "leaderboard-rank";
    rank.textContent = `#${index + 1}`;
    const name = document.createElement("span");
    name.className = "leaderboard-name";
    name.textContent = entry.name;
    const details = document.createElement("small");
    details.className = "leaderboard-details";
    const secondaryMetrics = [entry.game_version];
    if (leaderboardMetric !== "time") secondaryMetrics.push(formatRunTime(Number(entry.seconds)));
    if (leaderboardMetric !== "stars") secondaryMetrics.push(`${entry.stars} ${entry.stars === 1 ? "star" : "stars"}`);
    if (leaderboardMetric !== "score") secondaryMetrics.push(`${entry.score} pts`);
    details.textContent = secondaryMetrics.join(" · ");
    name.append(details);
    const score = document.createElement("span");
    score.className = "leaderboard-result";
    if (leaderboardMetric === "stars") score.textContent = `${entry.stars} stars`;
    else if (leaderboardMetric === "score") score.textContent = `${entry.score} pts`;
    else score.textContent = formatRunTime(Number(entry.seconds));
    item.append(rank, name, score);
    leaderboardList.append(item);
  });
}

function leaderboardRunContext() {
  const option = leaderboardRunType.selectedOptions[0];
  if (option) return { id: option.value, label: option.textContent };
  if (finishedRun?.runTypeId) return { id: finishedRun.runTypeId, label: finishedRun.runTypeLabel };
  return { id: runTypeId(selectedRunConfig), label: runTypeLabel(selectedRunConfig) };
}

function populateLeaderboardRunTypes() {
  const preferred = finishedRun?.runTypeId || (activeRunConfig ? runTypeId(activeRunConfig) : runTypeId(selectedRunConfig));
  const configs = [];
  ["complete-all", "all-stars", "all-hazards", "all-mechanics"].forEach((objective) => {
    Object.keys(RUN_CONSTRAINT_LABELS).forEach((constraint) => {
      configs.push({ objective, constraint, metric: "time", levels: [...ALL_INTRO_LEVELS] });
    });
  });
  if (selectedRunConfig.objective === "specific") configs.push(selectedRunConfig);
  if (activeRunConfig?.objective === "specific") configs.push(activeRunConfig);
  const options = new Map(configs.map((config) => [runTypeId(config), runTypeLabel(config)]));
  if (finishedRun?.runTypeId) options.set(finishedRun.runTypeId, finishedRun.runTypeLabel);
  leaderboardRunType.replaceChildren();
  options.forEach((label, id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = label;
    leaderboardRunType.append(option);
  });
  if (options.has(preferred)) leaderboardRunType.value = preferred;
}

async function refreshLeaderboard() {
  const request = ++leaderboardRequest;
  leaderboardEntries = [];
  leaderboardNote.textContent = "Loading scores from around the world...";
  renderLeaderboard();
  try {
    const context = leaderboardRunContext();
    const entries = await loadGlobalLeaderboard(leaderboardVersion.value || CURRENT_LEADERBOARD_ID, leaderboardMetric, context.id);
    if (request !== leaderboardRequest) return;
    leaderboardEntries = entries;
    const metricDescriptions = {
      time: "Ranked by fastest completion time.",
      stars: "Ranked by most stars collected.",
      score: "Ranked by highest total score."
    };
    leaderboardNote.textContent = `${metricDescriptions[leaderboardMetric]} Boards split when gameplay changes.`;
    renderLeaderboard();
  } catch {
    if (request !== leaderboardRequest) return;
    leaderboardNote.textContent = "The global leaderboard is unavailable. Check the connection or finish the Supabase setup.";
    renderLeaderboard();
  }
}

function selectLeaderboardMetric(metric, shouldRefresh = true) {
  leaderboardMetric = metric;
  leaderboardMetricButtons.forEach(button => {
    const selected = button.dataset.leaderboardMetric === metric;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  if (shouldRefresh) refreshLeaderboard();
}

function populateLeaderboardVersions() {
  leaderboardVersion.replaceChildren();
  LEADERBOARD_RULESETS.forEach(ruleset => {
    const option = document.createElement("option");
    option.value = ruleset.id;
    option.textContent = ruleset.label;
    leaderboardVersion.append(option);
  });
  leaderboardVersion.value = CURRENT_LEADERBOARD_ID;
}

function openLeaderboard(source) {
  leaderboardReturn = source;
  populateLeaderboardRunTypes();
  selectLeaderboardMetric(finishedRun?.metric || activeRunConfig?.metric || selectedRunConfig.metric || "time", false);
  if (source === "pause") pauseMenu.hidden = true;
  else {
    settingsPanel.hidden = true;
    settingsButton.setAttribute("aria-expanded", "false");
    mainMenu.hidden = true;
  }
  leaderboardMenu.hidden = false;
  refreshLeaderboard();
  closeLeaderboardButton.focus();
}

function closeLeaderboard() {
  leaderboardMenu.hidden = true;
  if (leaderboardReturn === "pause") {
    pauseMenu.hidden = false;
    pauseLeaderboardButton.focus();
  } else {
    mainMenu.hidden = false;
    mainLeaderboardButton.focus();
  }
}

function renderVersions() {
  versionsList.replaceChildren();
  RELEASE_VERSIONS.forEach(version => {
    const link = document.createElement("a");
    link.textContent = version === GAME_VERSION ? `${version} (current)` : version;
    link.href = version === GAME_VERSION ? "./" : `../${version}/index.html`;
    link.target = "_blank";
    link.rel = "noopener";
    versionsList.append(link);
  });
}

function openVersions() {
  settingsPanel.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  mainMenu.hidden = true;
  renderVersions();
  versionsMenu.hidden = false;
  versionsList.querySelector("a")?.focus();
}

function closeVersions() {
  versionsMenu.hidden = true;
  mainMenu.hidden = false;
  versionsButton.focus();
}

function renderChangelog() {
  changelogList.replaceChildren();
  CHANGELOG_ENTRIES.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "changelog-entry";
    const heading = document.createElement("div");
    heading.className = "changelog-heading";
    const version = document.createElement("span");
    version.className = "changelog-version";
    version.textContent = entry.version;
    const commit = document.createElement("code");
    commit.textContent = entry.commit;
    heading.append(version, commit);
    const title = document.createElement("h3");
    title.textContent = entry.message;
    const description = document.createElement("p");
    description.textContent = entry.description;
    const date = document.createElement("time");
    date.dateTime = entry.date;
    date.textContent = entry.date;
    article.append(heading, title, description, date);
    changelogList.append(article);
  });
}

function openChangelog(source) {
  changelogReturn = source;
  renderChangelog();
  if (source === "pause") pauseMenu.hidden = true;
  else {
    settingsPanel.hidden = true;
    settingsButton.setAttribute("aria-expanded", "false");
    mainMenu.hidden = true;
  }
  changelogMenu.hidden = false;
  closeChangelogButton.focus();
}

function closeChangelog() {
  changelogMenu.hidden = true;
  if (changelogReturn === "pause") {
    pauseMenu.hidden = false;
    pauseChangelogButton.focus();
  } else {
    mainMenu.hidden = false;
    mainChangelogButton.focus();
  }
}

function updatePauseButton() {
  pauseButton.childNodes[0].textContent = paused ? "Resume " : "Pause ";
  pauseButton.setAttribute("aria-label", paused ? "Resume the game" : "Pause the game");
}

function setPaused(shouldPause) {
  if (!gameStarted || won || cutsceneActive || paused === shouldPause) return;
  if (shouldPause) {
    cancelTimelinePreview();
    timerWasRunningBeforePause = timerRunning;
    levelTimerWasRunningBeforePause = levelTimerRunning;
    if (timerRunning) finishRunTimer();
    if (levelTimerRunning) finishLevelTimer();
    paused = true;
    Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
    pressed.jump = false;
    pauseMenu.hidden = false;
    restartButton.disabled = true;
    restartRunButton.disabled = true;
    quitButton.disabled = true;
    resumeButton.focus();
  } else {
    paused = false;
    pauseMenu.hidden = true;
    leaderboardMenu.hidden = true;
    changelogMenu.hidden = true;
    restartButton.disabled = false;
    restartRunButton.disabled = false;
    quitButton.disabled = false;
    if (timerWasRunningBeforePause) {
      runStartedAt = performance.now() - runElapsed * 1000;
      timerRunning = true;
    }
    if (levelTimerWasRunningBeforePause) {
      levelStartedAt = performance.now() - levelElapsed * 1000;
      levelTimerRunning = true;
    }
    timerWasRunningBeforePause = false;
    levelTimerWasRunningBeforePause = false;
    updateTimerHud();
    canvas.focus();
  }
  updatePauseButton();
}

async function publishFinishedRun() {
  if (!finishedRun || runPublished) return;
  const name = (accountDisplayName() || runNameInput.value).trim().slice(0, 24);
  if (!name) {
    publishStatus.textContent = "Enter a run name first.";
    runNameInput.focus();
    return;
  }
  if (!finishedRun.eligible) {
    publishStatus.textContent = finishedRun.failureReason ? `Challenge incomplete: ${finishedRun.failureReason}.` : "This practice run cannot be ranked.";
    return;
  }
  publishRunButton.disabled = true;
  runNameInput.disabled = true;
  publishStatus.textContent = "Publishing run...";
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard_scores`, {
      method: "POST",
      headers: leaderboardHeaders(true),
      body: JSON.stringify({
        leaderboard_id: CURRENT_LEADERBOARD_ID,
        game_version: GAME_VERSION,
        name,
        seconds: finishedRun.seconds,
        stars: finishedRun.stars,
        splits: finishedRun.splits,
        run_type_id: finishedRun.runTypeId,
        ranking_metric: finishedRun.metric,
        user_id: accountSession?.user?.id || null
      })
    });
    if (!response.ok) throw new Error(`Publish failed (${response.status})`);
    runPublished = true;
    publishStatus.textContent = "Run published to the global leaderboard.";
    if (!continueButton.hidden) continueButton.focus();
    else victoryQuitButton.focus();
  } catch {
    publishRunButton.disabled = false;
    runNameInput.disabled = false;
    applyLeaderboardIdentity();
    publishStatus.textContent = "Could not publish. Check the connection or finish the Supabase setup.";
  }
}

function resetFinishedRun() {
  finishedRun = null;
  runPublished = false;
  runNameInput.value = "";
  runNameInput.disabled = false;
  publishRunButton.disabled = false;
  publishStatus.textContent = "";
  continueButton.hidden = false;
  splitList.replaceChildren();
  applyLeaderboardIdentity();
}

function resetCutscene() {
  gameShell.classList.remove("cutscene-playing");
  cutsceneActive = false;
  cutsceneTime = 0;
  cutsceneZapPlayed = false;
  cutscenePowerPlayed = false;
}

function prepareAdventureResults() {
  const seconds = Math.round(runElapsed * 10) / 10;
  const timeScore = Math.round((300 - seconds) * 10) / 10;
  const starBonus = totalStars * 2;
  const finalScore = Math.round((timeScore + starBonus) * 10) / 10;
  const baseSummary = `Time ${formatRunTime(seconds)} · ${totalStars} stars (+${starBonus}) · Final score ${finalScore}`;
  const introSplits = Array.from({ length: INTRO_LEVEL_COUNT }, (_, index) => levelSplits[index]);
  if (activeRunConfig) {
    const requirement = runRequirementStatus(activeRunConfig);
    const resultSplits = activeRunConfig.levels.map((index) => levelSplits[index]);
    scoreSummary.textContent = `${baseSummary} · ${requirement.success ? "Challenge complete" : "Challenge failed"}`;
    finishedRun = {
      seconds, stars: totalStars, score: finalScore, splits: resultSplits,
      eligible: requirement.success && resultSplits.every(Number.isFinite),
      metric: activeRunConfig.metric,
      runTypeId: runTypeId(activeRunConfig),
      runTypeLabel: runTypeLabel(activeRunConfig),
      failureReason: requirement.missing.join("; ")
    };
  } else {
    const eligible = runStartLevel === 0 && introSplits.every(Number.isFinite);
    const resultSplits = eligible ? introSplits : [...levelSplits];
    scoreSummary.textContent = baseSummary;
    finishedRun = {
      seconds, stars: totalStars, score: finalScore, splits: resultSplits, eligible,
      metric: "time", runTypeId: "classic", runTypeLabel: "Classic adventure", failureReason: ""
    };
  }
  runPublished = false;
  runNameInput.value = "";
  runNameInput.disabled = false;
  publishRunButton.disabled = false;
  publishStatus.textContent = "";
  applyLeaderboardIdentity();
  if (!finishedRun.eligible) {
    publishStatus.textContent = finishedRun.failureReason
      ? `Not rankable: ${finishedRun.failureReason}.`
      : "Practice run: choose a run type from Play to publish a ranking.";
  }
  renderSplitSummary();
}

function showRunResults() {
  finishRunTimer();
  prepareAdventureResults();
  won = true;
  message.hidden = false;
  introSplitSummary.hidden = false;
  introPublishRun.hidden = false;
  introMasteryStatus.hidden = !completedGauntlets.has("G1");
  introMasteryStatus.textContent = completedGauntlets.has("G1") ? "G1 mastered." : "";
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  pressed.jump = false;
  continueButton.hidden = Boolean(activeRunConfig && !runProgress.completedLevels.has(INTRO_LEVEL_COUNT - 1));
  introGauntletButton.hidden = continueButton.hidden;
  if (finishedRun.eligible) runNameInput.focus();
  else if (!continueButton.hidden) continueButton.focus();
  else victoryQuitButton.focus();
}

function startRewindCutscene() {
  const continuingStoryRun = Number.isFinite(levelSplits[INTRO_LEVEL_COUNT - 1]);
  resetCutscene();
  cutsceneKind = "rewind";
  developerPanel.hidden = true;
  setFlightEnabled(false);
  levelDeveloperSequencePosition = 0;
  activeRunConfig = null;
  runLevelQueue = [];
  runQueuePosition = 0;
  countPostRunInRunTimer = continuingStoryRun;
  won = false;
  cutsceneActive = true;
  gameShell.classList.add("cutscene-playing");
  message.hidden = true;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  pressed.jump = false;
}

function showEchoChapterResults() {
  completeLevelSplit();
  if (countPostRunInRunTimer) finishRunTimer();
  won = true;
  echoChapterSummary.textContent = `Level time ${formatRunTime(levelElapsed)}`;
  rewindMasteryStatus.hidden = !completedGauntlets.has("G2");
  rewindMasteryStatus.textContent = completedGauntlets.has("G2") ? "G2 mastered." : "";
  echoChapterMessage.hidden = false;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  pressed.jump = false;
  echoContinueButton.focus();
}

function showConvergenceChapterResults() {
  completeLevelSplit();
  unlockThrough(30);
  if (countPostRunInRunTimer) finishRunTimer();
  won = true;
  convergenceChapterSummary.textContent = `Level time ${formatRunTime(levelElapsed)}`;
  echoMasteryStatus.hidden = !completedGauntlets.has("G3");
  echoMasteryStatus.textContent = completedGauntlets.has("G3") ? "G3 mastered." : "";
  convergenceChapterMessage.hidden = false;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  pressed.jump = false;
  convergenceContinueButton.focus();
}

function startConvergenceLevel() {
  const continuingTimedRun = countPostRunInRunTimer;
  convergenceChapterMessage.hidden = true;
  unlockThrough(30);
  if (!continuingTimedRun) runStartLevel = 30;
  loadLevel(30);
  if (continuingTimedRun) resumeRunTimerForLoadedLevel();
  won = false;
  pauseButton.disabled = false;
  restartButton.disabled = false;
  restartRunButton.disabled = false;
  quitButton.disabled = false;
  updatePauseButton();
  canvas.focus();
}

function startEchoCutscene() {
  resetCutscene();
  cutsceneKind = "echo";
  developerPanel.hidden = true;
  setFlightEnabled(false);
  levelDeveloperSequencePosition = 0;
  won = false;
  cutsceneActive = true;
  gameShell.classList.add("cutscene-playing");
  echoChapterMessage.hidden = true;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  pressed.jump = false;
}

function startEchoLevel() {
  const continuingTimedRun = countPostRunInRunTimer;
  resetCutscene();
  unlockThrough(20);
  if (!continuingTimedRun) runStartLevel = 20;
  loadLevel(20);
  if (continuingTimedRun) resumeRunTimerForLoadedLevel();
  won = false;
  pauseButton.disabled = false;
  restartButton.disabled = false;
  restartRunButton.disabled = false;
  quitButton.disabled = false;
  updatePauseButton();
  canvas.focus();
}

function startRewindLevel() {
  const continuingTimedRun = countPostRunInRunTimer;
  resetCutscene();
  menuCustomizationUnlocked = true;
  rewindMenuAwakened = true;
  applyRewindMenuState();
  unlockThrough(INTRO_LEVEL_COUNT);
  persistProgress();
  if (!continuingTimedRun) runStartLevel = INTRO_LEVEL_COUNT;
  loadLevel(INTRO_LEVEL_COUNT);
  if (continuingTimedRun) resumeRunTimerForLoadedLevel();
  won = false;
  message.hidden = true;
  chapterCompleteMessage.hidden = true;
  pauseButton.disabled = false;
  restartButton.disabled = false;
  restartRunButton.disabled = false;
  quitButton.disabled = false;
  updatePauseButton();
  canvas.focus();
}

function finishCombinedChapter() {
  completeLevelSplit();
  if (countPostRunInRunTimer) finishRunTimer();
  won = true;
  chapterCompleteMessage.hidden = false;
  rewindTutorialSummary.textContent = `Level time ${formatRunTime(levelElapsed)}`;
  combinedMasteryStatus.hidden = !completedGauntlets.has("G4");
  combinedMasteryStatus.textContent = completedGauntlets.has("G4") ? "G4 mastered." : "";
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  finalContinueButton.focus();
}

function restoreChapterReturnState() {
  const state = gauntletChapterReturnState;
  if (!state) return null;
  levelSplits = [...state.levelSplits];
  runElapsed = state.runElapsed;
  levelElapsed = state.levelElapsed;
  runStartLevel = state.runStartLevel;
  countPostRunInRunTimer = state.countPostRunInRunTimer;
  totalStars = state.totalStars;
  deaths = state.deaths;
  finishedRun = state.finishedRun ? { ...state.finishedRun, splits: [...state.finishedRun.splits] } : null;
  runPublished = state.runPublished;
  runNameInput.value = state.runName;
  runNameInput.disabled = state.runNameDisabled;
  publishRunButton.disabled = state.publishDisabled;
  publishStatus.textContent = state.publishStatus;
  applyLeaderboardIdentity();
  timerRunning = false;
  levelTimerRunning = false;
  gauntletChapterReturnState = null;
  updateHud();
  updateTimerHud();
  return state;
}

function showChapterCompletionAfterGauntlet(chapterIndex, gauntletId, gauntletSummary, restoredState) {
  message.hidden = true;
  echoChapterMessage.hidden = true;
  convergenceChapterMessage.hidden = true;
  chapterCompleteMessage.hidden = true;
  const statuses = [introMasteryStatus, rewindMasteryStatus, echoMasteryStatus, combinedMasteryStatus];
  statuses[chapterIndex].textContent = `${gauntletId} mastered · ${gauntletSummary}`;
  statuses[chapterIndex].hidden = false;

  if (chapterIndex === 0) {
    message.hidden = false;
    continueButton.hidden = false;
    introGauntletButton.hidden = false;
    introSplitSummary.hidden = !restoredState?.finishedRun;
    introPublishRun.hidden = !restoredState?.finishedRun;
    if (restoredState?.finishedRun) renderSplitSummary();
    else scoreSummary.textContent = gauntletSummary;
    continueButton.focus();
  } else if (chapterIndex === 1) {
    echoChapterMessage.hidden = false;
    if (!restoredState) echoChapterSummary.textContent = gauntletSummary;
    echoContinueButton.focus();
  } else if (chapterIndex === 2) {
    convergenceChapterMessage.hidden = false;
    if (!restoredState) convergenceChapterSummary.textContent = gauntletSummary;
    convergenceContinueButton.focus();
  } else {
    chapterCompleteMessage.hidden = false;
    if (!restoredState) rewindTutorialSummary.textContent = gauntletSummary;
    finalContinueButton.focus();
  }
}

function finishGauntlet() {
  completeLevelSplit();
  finishRunTimer();
  const gauntlet = currentLevel();
  const gauntletSummary = `Run time ${formatRunTime(runElapsed)} · ${currentLevelStarCount()} stars · ${deaths} deaths`;
  completedGauntlets.add(gauntlet.gauntletId);
  persistProgress();
  const restoredState = restoreChapterReturnState();
  if (!restoredState) {
    levelSplits = [];
    runElapsed = 0;
    countPostRunInRunTimer = false;
    updateTimerHud();
  }
  won = true;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  pressed.jump = false;
  if (restoredState) {
    showChapterCompletionAfterGauntlet(gauntlet.gauntletChapter, gauntlet.gauntletId, gauntletSummary, restoredState);
  } else {
    gauntletCompleteTitle.textContent = `${gauntlet.gauntletId}: ${gauntlet.name} complete.`;
    gauntletCompleteSummary.textContent = gauntletSummary;
    gauntletCompleteMessage.hidden = false;
    replayGauntletButton.focus();
  }
}

function returnToGauntletRoadmap() {
  const chapterIndex = currentLevel().gauntletChapter;
  quitRun();
  openRoadmap();
  roadmapChapterIndex = chapterIndex;
  renderRoadmap();
  levelRoadmap.querySelector(".roadmap-gauntlet button:not(:disabled)")?.focus();
}

function replayCombinedFinale() {
  chapterCompleteMessage.hidden = true;
  won = false;
  loadLevel(CAMPAIGN_LEVEL_COUNT - 1);
  pauseButton.disabled = false;
  restartButton.disabled = false;
  restartRunButton.disabled = false;
  quitButton.disabled = false;
  canvas.focus();
}

function updateCutscene(dt) {
  const duration = cutsceneKind === "echo" ? ECHO_CUTSCENE_DURATION : CUTSCENE_DURATION;
  cutsceneTime = Math.min(duration, cutsceneTime + dt);
  if (cutsceneKind === "echo") {
    if (!cutsceneZapPlayed && cutsceneTime >= 5.35) {
      cutsceneZapPlayed = true;
      playSfx("time-zap");
    }
    if (!cutscenePowerPlayed && cutsceneTime >= 6.55) {
      cutscenePowerPlayed = true;
      playSfx("rewind-awaken");
    }
    if (cutsceneTime >= duration) startEchoLevel();
    return;
  }
  if (!cutsceneZapPlayed && cutsceneTime >= 6.65) {
    cutsceneZapPlayed = true;
    playSfx("time-zap");
  }
  if (!cutscenePowerPlayed && cutsceneTime >= 7.45) {
    cutscenePowerPlayed = true;
    playSfx("rewind-awaken");
  }
  if (cutsceneTime >= CUTSCENE_DURATION) startRewindLevel();
}

function tutorialRewindPlatform() {
  return currentTimelineObjects().find((platform) => platform.timelinePreview) ||
    currentTimelineObjects()[0] || null;
}

function previewedTimelineObjects() {
  return currentTimelineObjects().filter((platform) => platform.timelinePreview);
}

function setTimelinePreviewPaused(paused) {
  previewedTimelineObjects().forEach((platform) => {
    platform.previewPaused = paused;
    platform.previewAccumulator = 0;
  });
}

function prepareTimelinePreview(platform) {
  platform.timelinePreview = true;
  platform.previewLatest = platform.motionHistory.length - 1;
  platform.previewCursor = platform.previewLatest;
  platform.previewAccumulator = 0;
  platform.previewPaused = false;
}

function levelUsesRewindField() {
  return Boolean(currentLevel().rewindField || (currentLevel().rewindChapter && levelIndex >= 14));
}

function rewindFieldAnchor() {
  const offset = currentLevel().rewindFieldOffset || 0;
  return {
    x: player.x + PLAYER_W / 2 + (player.facing || 1) * offset,
    y: player.y + PLAYER_H / 2
  };
}

function beginTimelinePreview() {
  if (!currentLevel().rewindTutorial) return false;
  const candidates = currentTimelineObjects().filter((platform) =>
    isTimelineObject(platform) && platform.timelinePlayback.length === 0 && platform.motionHistory.length >= 2
  );
  if (candidates.length === 0) return false;

  if (levelUsesRewindField()) {
    const { x: centerX, y: centerY } = rewindFieldAnchor();
    const radius = currentLevel().rewindFieldRadius || 340;
    const targets = candidates.filter((platform) =>
      Math.hypot(platform.x + platform.w / 2 - centerX, platform.y + platform.h / 2 - centerY) <= radius
    );
    rewindFieldPreview = { x: centerX, y: centerY, radius, targets };
    targets.forEach(prepareTimelinePreview);
  } else {
    const mostRecent = candidates.reduce((latest, candidate) => {
      const candidateTime = candidate.motionHistory.at(-1)?.time ?? -Infinity;
      const latestTime = latest.motionHistory.at(-1)?.time ?? -Infinity;
      return candidateTime > latestTime ? candidate : latest;
    });
    prepareTimelinePreview(mostRecent);
  }
  playSfx("rewind-start");
  return true;
}

function commitTimelinePreview() {
  previewedTimelineObjects().forEach((platform) => {
    platform.timelinePreview = false;
    const cursor = Math.max(0, Math.min(platform.previewCursor, platform.previewLatest));
    if (cursor < platform.previewLatest) {
      platform.timelinePlayback = platform.motionHistory.slice(cursor, platform.previewLatest).reverse();
      platform.motionHistory = platform.motionHistory.slice(0, cursor + 1);
      platform.motionLastRecordedAt = platform.motionHistory[platform.motionHistory.length - 1].time;
    }
    platform.previewAccumulator = 0;
    platform.previewPaused = false;
  });
  rewindFieldPreview = null;
  input.forwardTime = false;
}

function cancelTimelinePreview() {
  previewedTimelineObjects().forEach((platform) => {
    platform.timelinePreview = false;
    platform.previewAccumulator = 0;
    platform.previewPaused = false;
  });
  rewindFieldPreview = null;
  input.rewind = false;
  input.forwardTime = false;
  rewindPointerId = null;
  rewindPointerOwnsInput = false;
  forwardPointerId = null;
}

function levelSupportsEcho() {
  return Boolean(currentLevel().echoChapter);
}

function echoActorState(actor) {
  return {
    x: actor.x, y: actor.y, vx: actor.vx, vy: actor.vy,
    grounded: actor.grounded, facing: actor.facing,
    coyote: actor.coyote, jumpBuffer: actor.jumpBuffer,
    padLaunched: actor.padLaunched
  };
}

function clearEchoState() {
  echoRecording = null;
  echoPreview = null;
  echo = null;
}

function beginEchoRecording() {
  if (!levelSupportsEcho()) return false;
  echo = null;
  echoPreview = null;
  echoRecording = {
    start: echoActorState(player), frames: [], pendingInteract: false,
    path: [{ x: player.x + PLAYER_W / 2, y: player.y + PLAYER_H / 2 }]
  };
  playSfx("switch", .62);
  return true;
}

function finishEchoRecording() {
  if (!echoRecording) return false;
  if (echoRecording.frames.length === 0) {
    echoRecording.frames.push({ left: false, right: false, jump: false, jumpPressed: false, interact: false });
  }
  const endPoint = { x: player.x + PLAYER_W / 2, y: player.y + PLAYER_H / 2 };
  const lastPoint = echoRecording.path[echoRecording.path.length - 1];
  if (!lastPoint || Math.hypot(endPoint.x - lastPoint.x, endPoint.y - lastPoint.y) > 1) {
    echoRecording.path.push(endPoint);
  }
  echoPreview = {
    start: { ...echoRecording.start },
    frames: echoRecording.frames.map((frame) => ({ ...frame })),
    path: echoRecording.path.map((point) => ({ ...point }))
  };
  echoRecording = null;
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  pressed.jump = false;
  playSfx("rewind-release");
  return true;
}

function createEchoFromPreview() {
  if (!echoPreview) return false;
  echo = {
    ...echoPreview.start,
    start: { ...echoPreview.start },
    frames: echoPreview.frames.map((frame) => ({ ...frame })),
    cursor: 0
  };
  echoPreview = null;
  playSfx("rewind-release");
  return true;
}

function toggleEchoRecording() {
  if (!levelSupportsEcho()) return false;
  if (echoRecording) return finishEchoRecording();
  if (echoPreview) return createEchoFromPreview();
  return beginEchoRecording();
}

function destroyEcho() {
  if (!echo) return false;
  echo = null;
  playSfx("switch", .45);
  return true;
}

function captureEchoFrame() {
  if (!echoRecording) return;
  echoRecording.frames.push({
    left: input.left,
    right: input.right,
    jump: input.jump,
    jumpPressed: pressed.jump,
    interact: echoRecording.pendingInteract
  });
  const point = { x: player.x + PLAYER_W / 2, y: player.y + PLAYER_H / 2 };
  const lastPoint = echoRecording.path[echoRecording.path.length - 1];
  if (!lastPoint || Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) >= 3) {
    echoRecording.path.push(point);
  }
  echoRecording.pendingInteract = false;
}

function resetEchoLoop() {
  if (!echo) return;
  Object.assign(echo, echo.start, { cursor: 0 });
  echo.x = Math.max(0, Math.min(currentLevel().width - PLAYER_W, echo.x));
  for (const solid of currentLevel().platforms) {
    if (!platformHasCollision(solid) || !overlaps({ x: echo.x, y: echo.y, w: PLAYER_W, h: PLAYER_H }, solid)) continue;
    echo.y = solid.y - PLAYER_H;
    echo.vy = 0;
    echo.grounded = true;
  }
}

function setKey(code, down) {
  if (down && (!gameStarted || paused || won || cutsceneActive || deathTimer > 0 || levelTransition > 0)) return;
  if (down && ["ArrowLeft", "KeyA", "ArrowRight", "KeyD", "ArrowUp", "KeyW", "Space", "ArrowDown", "KeyS", "KeyF", "KeyG"].includes(code)) startRunTimer();
  if (["ArrowLeft", "KeyA"].includes(code)) input.left = down;
  if (["ArrowRight", "KeyD"].includes(code)) input.right = down;
  if (["ArrowDown", "KeyS"].includes(code)) input.down = down;
  if (["ArrowUp", "KeyW", "Space"].includes(code)) {
    if (down && !input.jump) pressed.jump = true;
    input.jump = down;
  }
  if (code === "KeyF") {
    if (down && !input.rewind) input.rewind = beginTimelinePreview();
    else if (!down && input.rewind) {
      commitTimelinePreview();
      input.rewind = false;
    }
  }
  if (code === "KeyG") {
    if (down && input.rewind) {
      if (!input.forwardTime) setTimelinePreviewPaused(false);
      input.forwardTime = true;
    } else {
      if (input.forwardTime) setTimelinePreviewPaused(true);
      input.forwardTime = false;
    }
  }
}

function nearbySwitch(actor = player) {
  if (!actor.grounded) return null;
  const playerCenter = actor.x + PLAYER_W / 2;
  const playerFeet = actor.y + PLAYER_H;
  return (currentLevel().switches || []).find((levelSwitch) =>
    Math.abs(playerCenter - (levelSwitch.x + levelSwitch.w / 2)) <= 72 &&
    Math.abs(playerFeet - (levelSwitch.y + levelSwitch.h)) <= 8
  ) || null;
}

function activateNearbySwitch(actor = player) {
  const levelSwitch = nearbySwitch(actor);
  if (!levelSwitch) return false;
  if (levelSwitch.momentary) {
    levelSwitch.activeTimer = levelSwitch.pulseDuration || 1;
    levelSwitch.flipped = true;
  } else {
    levelSwitch.flipped = !levelSwitch.flipped;
  }
  recordMechanic("switch");
  playSfx("switch");
  return true;
}

function switchPromptBounds(levelSwitch, time) {
  const centerX = levelSwitch.x - cameraX + levelSwitch.w / 2;
  return {
    x: centerX - 44,
    y: levelSwitch.y - 38 + Math.sin(time * .006) * 2,
    w: 88,
    h: 29
  };
}

function canvasPointerPosition(event) {
  const canvasRect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - canvasRect.left) * VIEW_W / canvasRect.width,
    y: (event.clientY - canvasRect.top) * VIEW_H / canvasRect.height
  };
}

function rewindPromptButtons() {
  if (!currentLevel().rewindTutorial || won || !currentLevel().rewindHintUnlocked) return [];
  const platform = tutorialRewindPlatform();
  if (!platform) return [];
  const controls = platform.timelinePreview
    ? [{ kind: "rewind", label: "F  GO BACK" }, { kind: "forward", label: "G  GO FORWARD" }]
    : [{ kind: "rewind", label: "F  REWIND" }];
  const gap = 10;
  const widths = controls.map((control) => control.label.length * 9 + 30);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (controls.length - 1);
  let x = VIEW_W / 2 - totalWidth / 2;
  return controls.map((control, index) => {
    const button = { ...control, x, y: 60, w: widths[index], h: 34 };
    x += widths[index] + gap;
    return button;
  });
}

function echoPromptButtons() {
  if (!currentLevel().echoTutorial || won) return [];
  const recordLabel = echoRecording ? "C  STOP RECORDING" : echoPreview ? "C  CREATE ECHO" : "C  RECORD";
  const controls = [{ kind: "record", label: recordLabel }];
  if (echo) controls.push({ kind: "destroy", label: "V  DESTROY ECHO" });
  const gap = 10;
  const widths = controls.map((control) => control.label.length * 9 + 30);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (controls.length - 1);
  let x = VIEW_W / 2 - totalWidth / 2;
  return controls.map((control, index) => {
    const button = { ...control, x, y: 60, w: widths[index], h: 34 };
    x += widths[index] + gap;
    return button;
  });
}

function pointInsideButton(point, button) {
  return point.x >= button.x && point.x <= button.x + button.w &&
    point.y >= button.y && point.y <= button.y + button.h;
}

function releaseRewindPointer(event) {
  if (event.pointerId === forwardPointerId) {
    forwardPointerId = null;
    input.forwardTime = false;
    setTimelinePreviewPaused(true);
  }
  if (event.pointerId !== rewindPointerId) return;
  rewindPointerId = null;
  if (rewindPointerOwnsInput && input.rewind) {
    commitTimelinePreview();
    input.rewind = false;
  }
  rewindPointerOwnsInput = false;
}

canvas.addEventListener("pointerdown", (event) => {
  if (cutsceneActive) {
    event.preventDefault();
    if (cutsceneKind === "echo") startEchoLevel();
    else startRewindLevel();
    return;
  }
  if (!gameStarted || paused || won || deathTimer > 0 || levelTransition > 0) return;
  const pointer = canvasPointerPosition(event);
  const echoControl = echoPromptButtons().find((button) => pointInsideButton(pointer, button));
  if (echoControl) {
    event.preventDefault();
    startRunTimer();
    if (echoControl.kind === "record") toggleEchoRecording();
    else destroyEcho();
    canvas.focus();
    return;
  }
  if (echoPreview) return;
  const rewindControl = rewindPromptButtons().find((button) => pointInsideButton(pointer, button));
  if (rewindControl) {
    event.preventDefault();
    startRunTimer();
    canvas.setPointerCapture(event.pointerId);
    if (rewindControl.kind === "rewind") {
      rewindPointerOwnsInput = !input.rewind;
      if (!input.rewind) input.rewind = beginTimelinePreview();
      if (input.rewind) {
        setTimelinePreviewPaused(false);
        input.forwardTime = false;
        rewindPointerId = event.pointerId;
      }
    } else if (input.rewind) {
      setTimelinePreviewPaused(false);
      input.forwardTime = true;
      forwardPointerId = event.pointerId;
    }
    canvas.focus();
    return;
  }
  const levelSwitch = nearbySwitch();
  if (!levelSwitch) return;
  const prompt = switchPromptBounds(levelSwitch, performance.now());
  if (!pointInsideButton(pointer, prompt)) return;
  event.preventDefault();
  activateNearbySwitch();
  canvas.focus();
});
canvas.addEventListener("pointerup", releaseRewindPointer);
canvas.addEventListener("pointercancel", releaseRewindPointer);
canvas.addEventListener("lostpointercapture", releaseRewindPointer);
canvas.addEventListener("pointermove", (event) => {
  if (!gameStarted || paused || won || cutsceneActive || deathTimer > 0 || levelTransition > 0) {
    canvas.style.cursor = "default";
    return;
  }
  const pointer = canvasPointerPosition(event);
  const overEchoControl = echoPromptButtons().some((button) => pointInsideButton(pointer, button));
  const overRewindControl = rewindPromptButtons().some((button) => pointInsideButton(pointer, button));
  const levelSwitch = nearbySwitch();
  const overSwitchControl = levelSwitch && pointInsideButton(pointer, switchPromptBounds(levelSwitch, performance.now()));
  canvas.style.cursor = overEchoControl || overRewindControl || overSwitchControl ? "pointer" : "default";
});

function trackDevelopmentSequence(event) {
  if (event.repeat || event.key.length !== 1) return;
  const sequence = [99, 104, 101, 101, 115, 101, 98, 117, 114, 103, 101, 114];
  const key = event.key.toLowerCase().charCodeAt(0);
  developmentSequencePosition = key === sequence[developmentSequencePosition]
    ? developmentSequencePosition + 1
    : key === sequence[0] ? 1 : 0;
  if (developmentSequencePosition !== sequence.length) return;
  developmentSequencePosition = 0;
  unlockThrough(CAMPAIGN_LEVEL_COUNT - 1);
  completedChapters = new Set(Array.from({ length: GAUNTLET_COUNT }, (_, index) => index));
  persistProgress();
  if (!roadmapMenu.hidden) renderRoadmap();
}

function setFlightEnabled(enabled) {
  flightEnabled = enabled;
  flightToggleButton.setAttribute("aria-pressed", String(enabled));
  flightToggleButton.textContent = `Fly: ${enabled ? "On" : "Off"}`;
  if (enabled) player.vy = 0;
}

function toggleDeveloperPanel() {
  if (!gameStarted || cutsceneActive || won || deathTimer > 0 || levelTransition > 0) return;
  developerPanel.hidden = !developerPanel.hidden;
  if (!developerPanel.hidden) flightToggleButton.focus();
  else {
    setFlightEnabled(false);
    canvas.focus();
  }
}

function trackLevelDeveloperSequence(event) {
  if (!gameStarted || cutsceneActive || won || deathTimer > 0 || levelTransition > 0 || event.repeat || event.key.length !== 1) return false;
  const sequence = [101, 103, 103, 101, 115, 116];
  const key = event.key.toLowerCase().charCodeAt(0);
  levelDeveloperSequencePosition = key === sequence[levelDeveloperSequencePosition]
    ? levelDeveloperSequencePosition + 1
    : key === sequence[0] ? 1 : 0;
  if (levelDeveloperSequencePosition !== sequence.length) return false;
  levelDeveloperSequencePosition = 0;
  toggleDeveloperPanel();
  return true;
}

function trackMusicTempoSequence(event) {
  if (event.repeat || event.key.length !== 1) return;
  const sequence = [116, 117, 102, 102];
  const key = event.key.toLowerCase().charCodeAt(0);
  musicTempoSequencePosition = key === sequence[musicTempoSequencePosition]
    ? musicTempoSequencePosition + 1
    : key === sequence[0] ? 1 : 0;
  if (musicTempoSequencePosition !== sequence.length) return;
  musicTempoSequencePosition = 0;
  Object.values(MUSIC_TRACKS).forEach(track => { track.tempo = 999; });
  stopMusicVoices();
  musicStep = 0;
  if (audioContext) {
    nextMusicNoteTime = audioContext.currentTime + .02;
    scheduleMusic();
  }
}

addEventListener("keydown", (event) => {
  if (event.target instanceof Element && event.target.matches("input, textarea, select")) return;
  trackDevelopmentSequence(event);
  trackMusicTempoSequence(event);
  if (trackLevelDeveloperSequence(event)) return;
  if (event.target instanceof Element && event.target.matches("button")) return;
  if (!gameStarted) return;
  if (cutsceneActive) return;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "KeyP", "KeyE", "KeyF", "KeyG", "KeyC", "KeyV"].includes(event.code)) event.preventDefault();
  if (event.code === "KeyP" && !won) {
    if (!leaderboardMenu.hidden && leaderboardReturn === "pause") closeLeaderboard();
    else if (!changelogMenu.hidden && changelogReturn === "pause") closeChangelog();
    else setPaused(!paused);
    return;
  }
  if (paused) return;
  if (won) {
    if (event.code === "Enter") {
      if (!echoChapterMessage.hidden) startEchoCutscene();
      else if (!convergenceChapterMessage.hidden) startConvergenceLevel();
      else if (!message.hidden && !continueButton.hidden) startRewindCutscene();
      else if (!chapterCompleteMessage.hidden) quitRun();
    }
    return;
  }
  if (deathTimer > 0 || levelTransition > 0) return;
  if (event.code === "KeyC" && !event.repeat) {
    startRunTimer();
    toggleEchoRecording();
    return;
  }
  if (event.code === "KeyV" && !event.repeat) {
    destroyEcho();
    return;
  }
  if (echoPreview) {
    if (event.code === "KeyR") restartLevel();
    if (event.code === "KeyT") startOver();
    return;
  }
  if (event.code === "KeyE" && !event.repeat) {
    if (echoRecording) echoRecording.pendingInteract = true;
    activateNearbySwitch();
  }
  if (event.code === "KeyR") restartLevel();
  if (event.code === "KeyT") startOver();
  setKey(event.code, true);
});
addEventListener("keyup", (event) => { if (gameStarted) setKey(event.code, false); });
addEventListener("blur", () => {
  if (input.rewind) commitTimelinePreview();
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  rewindPointerId = null;
  forwardPointerId = null;
  rewindPointerOwnsInput = false;
});
restartButton.addEventListener("click", restartLevel);
restartRunButton.addEventListener("click", () => {
  if (!won && !cutsceneActive && deathTimer <= 0 && levelTransition <= 0) startOver();
});
pauseButton.addEventListener("click", () => setPaused(!paused));
resumeButton.addEventListener("click", () => setPaused(false));
pauseRestartLevelButton.addEventListener("click", () => { restartLevel(); setPaused(false); });
pauseRestartRunButton.addEventListener("click", startOver);
pauseQuitButton.addEventListener("click", quitRun);
mainLeaderboardButton.addEventListener("click", () => openLeaderboard("main"));
pauseLeaderboardButton.addEventListener("click", () => openLeaderboard("pause"));
closeLeaderboardButton.addEventListener("click", closeLeaderboard);
mainChangelogButton.addEventListener("click", () => openChangelog("main"));
pauseChangelogButton.addEventListener("click", () => openChangelog("pause"));
closeChangelogButton.addEventListener("click", closeChangelog);
closeDeveloperPanelButton.addEventListener("click", () => {
  developerPanel.hidden = true;
  setFlightEnabled(false);
  canvas.focus();
});
flightToggleButton.addEventListener("click", () => {
  if (won || cutsceneActive || deathTimer > 0 || levelTransition > 0) return;
  setFlightEnabled(!flightEnabled);
  canvas.focus();
});
versionsButton.addEventListener("click", openVersions);
closeVersionsButton.addEventListener("click", closeVersions);
leaderboardVersion.addEventListener("change", refreshLeaderboard);
leaderboardRunType.addEventListener("change", refreshLeaderboard);
leaderboardMetricButtons.forEach(button => {
  button.addEventListener("click", () => selectLeaderboardMetric(button.dataset.leaderboardMetric));
});
addEventListener("focus", () => { if (!leaderboardMenu.hidden) refreshLeaderboard(); });
restartSessionButton.addEventListener("click", restartSession);
menuAnimationButtons.forEach(button => button.addEventListener("click", () => selectMenuAnimation(button.dataset.menuAnimation)));
menuTextureButtons.forEach(button => button.addEventListener("click", () => selectMenuTexture(button.dataset.menuTexture)));
menuBackdropButtons.forEach(button => button.addEventListener("click", () => selectMenuBackdrop(button.dataset.menuBackdrop)));
publishRunButton.addEventListener("click", publishFinishedRun);
continueButton.addEventListener("click", startRewindCutscene);
introGauntletButton.addEventListener("click", () => startChapterGauntlet(0));
echoContinueButton.addEventListener("click", startEchoCutscene);
rewindGauntletButton.addEventListener("click", () => startChapterGauntlet(1));
echoMenuButton.addEventListener("click", quitRun);
convergenceContinueButton.addEventListener("click", startConvergenceLevel);
echoGauntletButton.addEventListener("click", () => startChapterGauntlet(2));
convergenceMenuButton.addEventListener("click", quitRun);
finalContinueButton.addEventListener("click", quitRun);
combinedGauntletButton.addEventListener("click", () => startChapterGauntlet(3));
replayRewindButton.addEventListener("click", replayCombinedFinale);
replayGauntletButton.addEventListener("click", startOver);
gauntletRoadmapButton.addEventListener("click", returnToGauntletRoadmap);
gauntletMenuButton.addEventListener("click", quitRun);
rewindMenuButton.addEventListener("click", quitRun);
runNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    publishFinishedRun();
  }
});
document.querySelector("#playAgainButton").addEventListener("click", startOver);
quitButton.addEventListener("click", quitRun);
victoryQuitButton.addEventListener("click", quitRun);

function midiToFrequency(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function scheduleTone(frequency, start, duration, wave, gain, destination, musicVoice = false) {
  if (!audioContext || !destination) return;
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, start);
  envelope.gain.setValueAtTime(.0001, start);
  envelope.gain.exponentialRampToValueAtTime(Math.max(.0001, gain), start + .018);
  envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(envelope).connect(destination);
  oscillator.start(start);
  oscillator.stop(start + duration + .025);
  if (musicVoice) {
    activeMusicVoices.add(oscillator);
    oscillator.addEventListener("ended", () => activeMusicVoices.delete(oscillator), { once: true });
  }
}

function stopMusicVoices() {
  if (!audioContext) return;
  for (const voice of activeMusicVoices) {
    try { voice.stop(audioContext.currentTime + .015); } catch { /* Voice already ended. */ }
  }
  activeMusicVoices.clear();
}

function scheduleMusic() {
  if (!audioContext || audioContext.state !== "running" || !currentTrack) return;
  const track = MUSIC_TRACKS[currentTrack];
  if (!track) return;
  const stepDuration = 60 / track.tempo / 2;
  while (nextMusicNoteTime < audioContext.currentTime + .16) {
    const melody = track.melody[musicStep % track.melody.length];
    const bass = track.bass[musicStep % track.bass.length];
    if (melody !== null) {
      scheduleTone(midiToFrequency(melody), nextMusicNoteTime, stepDuration * .78, track.wave, track.gain, musicGain, true);
    }
    if (bass !== null) {
      scheduleTone(midiToFrequency(bass), nextMusicNoteTime, stepDuration * 1.7, "sine", .095, musicGain, true);
    }
    musicStep++;
    nextMusicNoteTime += stepDuration;
  }
}

function startMusic(trackName) {
  if (!MUSIC_TRACKS[trackName] || currentTrack === trackName && musicStep > 0) return;
  currentTrack = trackName;
  musicStep = 0;
  stopMusicVoices();
  if (audioContext) {
    nextMusicNoteTime = audioContext.currentTime + .04;
    scheduleMusic();
  }
}

async function ensureAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    musicGain = audioContext.createGain();
    sfxGain = audioContext.createGain();
    masterGain.gain.value = masterVolume;
    musicGain.gain.value = .42;
    sfxGain.gain.value = .55;
    musicGain.connect(masterGain);
    sfxGain.connect(masterGain);
    masterGain.connect(audioContext.destination);
    nextMusicNoteTime = audioContext.currentTime + .04;
    musicTimer = setInterval(scheduleMusic, 50);
  }
  if (audioContext.state === "suspended") await audioContext.resume();
  scheduleMusic();
  return true;
}

function playNoise(duration, gain, cutoff = 900) {
  if (!audioContext || !sfxGain) return;
  const frameCount = Math.max(1, Math.floor(audioContext.sampleRate * duration));
  const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < frameCount; index++) data[index] = Math.random() * 2 - 1;
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const envelope = audioContext.createGain();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  envelope.gain.setValueAtTime(gain, audioContext.currentTime);
  envelope.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
  source.buffer = buffer;
  source.connect(filter).connect(envelope).connect(sfxGain);
  source.start();
}

function playSfx(name, intensity = 1) {
  if (!audioContext || audioContext.state !== "running" || !sfxGain || masterVolume === 0) return;
  const now = audioContext.currentTime;
  if (name === "land-grass") {
    playNoise(.085, .035 * intensity, 520);
    scheduleTone(95, now, .07, "sine", .045 * intensity, sfxGain);
  } else if (name === "land-stone") {
    playNoise(.045, .08 * intensity, 3200);
    scheduleTone(175, now, .055, "square", .085 * intensity, sfxGain);
    scheduleTone(115, now + .018, .05, "triangle", .065 * intensity, sfxGain);
  } else if (name === "land-crate") {
    playNoise(.06, .05 * intensity, 1400);
    scheduleTone(145, now, .065, "triangle", .075 * intensity, sfxGain);
    scheduleTone(105, now + .025, .055, "sine", .055 * intensity, sfxGain);
  } else if (name === "jump-pad") {
    [55, 62, 67].forEach((note, index) => scheduleTone(midiToFrequency(note), now + index * .035, .13, "square", .09, sfxGain));
    playNoise(.07, .035, 1800);
  } else if (name === "switch") {
    scheduleTone(160, now, .08, "square", .07, sfxGain);
    scheduleTone(245, now + .06, .13, "triangle", .09, sfxGain);
  } else if (name === "time-zap") {
    playNoise(.28, .13, 5200);
    scheduleTone(520, now, .1, "sawtooth", .12, sfxGain);
    scheduleTone(1160, now + .07, .18, "square", .1, sfxGain);
    scheduleTone(185, now + .16, .22, "sawtooth", .11, sfxGain);
  } else if (name === "rewind-awaken") {
    [60, 67, 72, 79, 84].forEach((note, index) => scheduleTone(midiToFrequency(note), now + index * .09, .3, "sine", .13, sfxGain));
    scheduleTone(110, now, .65, "triangle", .08, sfxGain);
  } else if (name === "rewind-start") {
    scheduleTone(720, now, .18, "sine", .08, sfxGain);
    scheduleTone(420, now + .06, .22, "triangle", .075, sfxGain);
  } else if (name === "rewind-release") {
    scheduleTone(420, now, .1, "triangle", .065, sfxGain);
    scheduleTone(680, now + .045, .14, "sine", .07, sfxGain);
  } else if (name === "block-break") {
    playNoise(.12, .075, 1250);
    scheduleTone(125, now, .09, "square", .07, sfxGain);
    scheduleTone(82, now + .045, .11, "triangle", .06, sfxGain);
  } else if (name === "enemy-stomp") {
    scheduleTone(185, now, .07, "square", .075, sfxGain);
    scheduleTone(285, now + .035, .1, "triangle", .065, sfxGain);
  } else if (name === "death") {
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(65, now + .2);
    envelope.gain.setValueAtTime(.12, now);
    envelope.gain.exponentialRampToValueAtTime(.0001, now + .22);
    oscillator.connect(envelope).connect(sfxGain);
    oscillator.start(now);
    oscillator.stop(now + .23);
    playNoise(.11, .06);
  } else if (name === "star") {
    [79, 83, 86].forEach((note, index) => scheduleTone(midiToFrequency(note), now + index * .045, .12, "sine", .14, sfxGain));
  } else if (name === "flag") {
    [72, 76, 79, 84].forEach((note, index) => scheduleTone(midiToFrequency(note), now + index * .07, .18, "triangle", .15, sfxGain));
  }
}

function setVolume(value) {
  masterVolume = Math.max(0, Math.min(1, Number(value) / 100));
  const percent = Math.round(masterVolume * 100);
  volumeInput.value = String(percent);
  volumeValue.textContent = `${percent}%`;
  if (masterGain && audioContext) masterGain.gain.setTargetAtTime(masterVolume, audioContext.currentTime, .02);
  try { localStorage.setItem("platforms-volume", String(percent)); } catch { /* Storage may be unavailable. */ }
}

try {
  const savedVolume = localStorage.getItem("platforms-volume");
  if (savedVolume !== null) volumeInput.value = savedVolume;
} catch { /* Use the default volume. */ }
setVolume(volumeInput.value);

signUpButton.addEventListener("click", () => showAccountMode("signup"));
signInButton.addEventListener("click", () => showAccountMode("signin"));
editProfileButton.addEventListener("click", () => showAccountMode("profile"));
forgotPasswordButton.addEventListener("click", () => {
  resetEmail.value = signInEmail.value;
  showAccountMode("forgot");
});
backToSignInButton.addEventListener("click", () => showAccountMode("signin"));
closeAccountButton.addEventListener("click", closeAccountMenu);

signUpForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(signUpForm);
  const displayName = window.PlatformsAccount?.cleanDisplayName(formData.get("displayName"));
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!displayName) { setAccountMessage("Choose a public display name.", true); return; }
  if (password.length < 6) { setAccountMessage("Use a password with at least 6 characters.", true); return; }
  if (accountInitializationError || !window.PlatformsAccount?.isAvailable()) {
    setAccountMessage(accountFriendlyError(accountInitializationError), true);
    return;
  }
  setAccountFormBusy(signUpForm, true);
  setAccountMessage("Creating account...");
  try {
    const result = await window.PlatformsAccount.signUp(email, password, displayName, accountRedirectUrl());
    signUpForm.reset();
    if (result.needsVerification) {
      setAccountMessage("Account created. Check your email and follow the verification link, then return here to sign in.");
      accountNotice.textContent = "Check your email to verify your account.";
    } else {
      accountMenu.hidden = true;
      accountNotice.textContent = "Account created. Merging progress...";
    }
  } catch (error) {
    setAccountMessage(accountFriendlyError(error), true);
  } finally {
    setAccountFormBusy(signUpForm, false);
  }
});

signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(signInForm);
  if (accountInitializationError || !window.PlatformsAccount?.isAvailable()) {
    setAccountMessage(accountFriendlyError(accountInitializationError), true);
    return;
  }
  setAccountFormBusy(signInForm, true);
  setAccountMessage("Signing in...");
  try {
    await window.PlatformsAccount.signIn(String(formData.get("email") || ""), String(formData.get("password") || ""));
    signInForm.reset();
    accountMenu.hidden = true;
    accountNotice.textContent = "Signed in. Merging progress...";
  } catch (error) {
    setAccountMessage(accountFriendlyError(error), true);
  } finally {
    setAccountFormBusy(signInForm, false);
  }
});

forgotPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(forgotPasswordForm);
  if (accountInitializationError || !window.PlatformsAccount?.isAvailable()) {
    setAccountMessage(accountFriendlyError(accountInitializationError), true);
    return;
  }
  setAccountFormBusy(forgotPasswordForm, true);
  setAccountMessage("Sending reset email...");
  try {
    await window.PlatformsAccount.sendPasswordReset(String(formData.get("email") || ""), accountRedirectUrl());
    setAccountMessage("Reset email sent. Open its link on this device to choose a new password.");
  } catch (error) {
    setAccountMessage(accountFriendlyError(error), true);
  } finally {
    setAccountFormBusy(forgotPasswordForm, false);
  }
});

newPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(newPasswordForm);
  const password = String(formData.get("password") || "");
  const confirmation = String(formData.get("confirmPassword") || "");
  if (password.length < 6) { setAccountMessage("Use a password with at least 6 characters.", true); return; }
  if (password !== confirmation) { setAccountMessage("The passwords do not match.", true); return; }
  setAccountFormBusy(newPasswordForm, true);
  setAccountMessage("Updating password...");
  try {
    await window.PlatformsAccount.updatePassword(password);
    accountRecoveryActive = false;
    newPasswordForm.reset();
    accountMenu.hidden = true;
    accountNotice.textContent = "Password updated.";
  } catch (error) {
    setAccountMessage(accountFriendlyError(error), true);
  } finally {
    setAccountFormBusy(newPasswordForm, false);
  }
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const displayName = window.PlatformsAccount?.cleanDisplayName(new FormData(profileForm).get("displayName"));
  if (!displayName) { setAccountMessage("Choose a public display name.", true); return; }
  if (!accountSession?.user?.id) { setAccountMessage("Sign in before editing your profile.", true); return; }
  setAccountFormBusy(profileForm, true);
  setAccountMessage("Saving profile...");
  try {
    accountProfile = await window.PlatformsAccount.updateProfile(accountSession.user.id, displayName);
    renderAccountState("Display name updated.");
    accountMenu.hidden = true;
  } catch (error) {
    setAccountMessage(accountFriendlyError(error), true);
  } finally {
    setAccountFormBusy(profileForm, false);
  }
});

signOutButton.addEventListener("click", async () => {
  if (!accountSession?.user?.id || !window.PlatformsAccount?.isAvailable()) return;
  signOutButton.disabled = true;
  accountNotice.textContent = "Signing out...";
  try {
    await window.PlatformsAccount.saveProgress(accountSession.user.id, accountProgressPayload());
  } catch (error) {
    accountNotice.textContent = accountFriendlyError(error);
  }
  try {
    await window.PlatformsAccount.signOut();
  } catch (error) {
    accountNotice.textContent = accountFriendlyError(error);
  } finally {
    signOutButton.disabled = false;
  }
});

playButton.addEventListener("click", openPlayChoice);
customRunButton.addEventListener("click", openRunSetup);
roadmapChoiceButton.addEventListener("click", openRoadmap);
closePlayChoiceButton.addEventListener("click", closePlayChoice);
runSetupForm.addEventListener("change", updateRunSetup);
runSetupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startConfiguredRun();
});
closeRunSetupButton.addEventListener("click", closeRunSetup);
closeRoadmapButton.addEventListener("click", closeRoadmap);
previousRoadmapChapterButton.addEventListener("click", () => setRoadmapChapter(roadmapChapterIndex - 1));
nextRoadmapChapterButton.addEventListener("click", () => setRoadmapChapter(roadmapChapterIndex + 1));
roadmapMenu.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  event.stopPropagation();
  const direction = event.key === "ArrowRight" ? 1 : -1;
  if (setRoadmapChapter(roadmapChapterIndex + direction)) {
    const continuedButton = direction > 0 ? nextRoadmapChapterButton : previousRoadmapChapterButton;
    const returnButton = direction > 0 ? previousRoadmapChapterButton : nextRoadmapChapterButton;
    (continuedButton.disabled ? returnButton : continuedButton).focus();
  }
});

settingsButton.addEventListener("click", () => {
  const opening = settingsPanel.hidden;
  settingsPanel.hidden = !opening;
  settingsButton.setAttribute("aria-expanded", String(opening));
  if (opening) volumeInput.focus();
});

volumeInput.addEventListener("input", () => setVolume(volumeInput.value));
document.addEventListener("pointerdown", () => ensureAudio(), { once: true });
document.addEventListener("keydown", () => ensureAudio(), { once: true });

function updateMenuAnimation(time) {
  if (mainMenu.hidden) {
    awakenedMenuAnimationStart = null;
    return;
  }

  const stageWidth = menuStage.clientWidth;
  const stageHeight = menuStage.clientHeight;
  const slimeWidth = menuSlime.offsetWidth || 44;

  if (rewindMenuAwakened) {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (awakenedMenuAnimationStart === null) awakenedMenuAnimationStart = time;
    const animationTime = time - awakenedMenuAnimationStart;
    const physicsScale = .75;
    const middleBottom = Math.max(28, stageHeight * .22);
    const climbHeight = Math.min(75, stageHeight * .43);
    const worldClimbHeight = climbHeight / physicsScale;
    const discriminant = Math.max(0, JUMP_SPEED ** 2 - 2 * GRAVITY * worldClimbHeight);
    const flightSeconds = (JUMP_SPEED + Math.sqrt(discriminant)) / GRAVITY;
    const cycleDuration = flightSeconds * 1000;
    const cycle = reducedMotion ? 0 : Math.floor(animationTime / cycleDuration);
    const flightTime = reducedMotion ? 0 : (animationTime % cycleDuration) / 1000;
    const sourceIndex = cycle % 2;
    const destinationIndex = (sourceIndex + 1) % 2;
    const source = menuPlatforms[sourceIndex];
    const destination = menuPlatforms[destinationIndex];
    const leftX = stageWidth * .08;
    const rightX = stageWidth * .60;
    const sourceX = sourceIndex === 0 ? leftX : rightX;
    const destinationX = destinationIndex === 0 ? leftX : rightX;
    const scrollSpeed = climbHeight / flightSeconds;
    const scrollDistance = scrollSpeed * flightTime;
    const sourceBottom = middleBottom - scrollDistance;
    const destinationBottom = middleBottom + climbHeight - scrollDistance;

    source.style.left = `${sourceX}px`;
    source.style.right = "auto";
    source.style.bottom = `${sourceBottom}px`;
    destination.style.left = `${destinationX}px`;
    destination.style.right = "auto";
    destination.style.bottom = `${destinationBottom}px`;

    menuClouds.forEach((cloud, index) => {
      const cloudCycle = stageHeight + 70;
      const top = -48 + ((index * 79 + (reducedMotion ? 0 : animationTime * (.006 + index * .0015))) % cloudCycle);
      const scale = [1, .72, .55][index];
      cloud.style.top = `${top}px`;
      cloud.style.transform = `scale(${scale})`;
    });

    const sourceCenter = sourceX + source.offsetWidth / 2;
    const destinationCenter = destinationX + destination.offsetWidth / 2;
    const platformHeight = source.offsetHeight || 34;
    const direction = destinationCenter > sourceCenter ? 1 : -1;
    const platformWidth = source.offsetWidth;
    const edgeInset = slimeWidth / 2 + 10;
    const startX = sourceX + (direction > 0 ? platformWidth - edgeInset : edgeInset);
    const endX = destinationX + (direction > 0 ? edgeInset : platformWidth - edgeInset);
    const horizontalSpeed = (endX - startX) / flightSeconds;
    const slimeX = startX + horizontalSpeed * flightTime;
    const physicsHeight = (JUMP_SPEED * flightTime - .5 * GRAVITY * flightTime ** 2) * physicsScale;
    const slimeBottom = middleBottom + platformHeight + physicsHeight - scrollDistance;
    const verticalVelocity = (JUMP_SPEED - GRAVITY * flightTime) * physicsScale - scrollSpeed;
    const scaledJumpSpeed = JUMP_SPEED * physicsScale;
    const airborneStretch = reducedMotion ? 0 : Math.min(1, Math.abs(verticalVelocity) / scaledJumpSpeed);
    const rotation = reducedMotion ? 0 : direction * verticalVelocity / scaledJumpSpeed * 3;
    menuSlime.style.left = `${slimeX - slimeWidth / 2}px`;
    menuSlime.style.bottom = `${slimeBottom}px`;
    menuSlime.style.transform = `rotate(${rotation}deg) scale(${1 - airborneStretch * .035}, ${1 + airborneStretch * .05})`;
    return;
  }

  const leftPlatform = stageWidth * .23;
  const rightPlatform = stageWidth * .77;
  const baseBottom = 48;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    menuSlime.style.left = `${leftPlatform - slimeWidth / 2}px`;
    menuSlime.style.bottom = `${baseBottom}px`;
    menuSlime.style.transform = "none";
    return;
  }

  const legDuration = 900;
  const landingPause = 110;
  const leg = Math.floor(time / legDuration);
  const legTime = time % legDuration;
  const movingRight = leg % 2 === 0;
  const from = movingRight ? leftPlatform : rightPlatform;
  const to = movingRight ? rightPlatform : leftPlatform;

  let x = from;
  let height = 0;
  let scaleX = 1;
  let scaleY = 1;
  let rotation = 0;

  if (legTime < landingPause) {
    const settle = 1 - legTime / landingPause;
    scaleX = 1 + settle * .08;
    scaleY = 1 - settle * .08;
  } else {
    const progress = (legTime - landingPause) / (legDuration - landingPause);
    const peakHeight = Math.max(38, Math.min(70, stageHeight - 95));
    x = from + (to - from) * progress;
    height = 4 * peakHeight * progress * (1 - progress);
    const stretch = Math.sin(Math.PI * progress);
    scaleX = 1 - stretch * .04;
    scaleY = 1 + stretch * .04;
    rotation = (movingRight ? 1 : -1) * stretch * 4;
  }

  menuSlime.style.left = `${x - slimeWidth / 2}px`;
  menuSlime.style.bottom = `${baseBottom + height}px`;
  menuSlime.style.transform = `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
}

const requestFullscreen = gameShell.requestFullscreen?.bind(gameShell)
  || gameShell.webkitRequestFullscreen?.bind(gameShell);
const exitFullscreen = document.exitFullscreen?.bind(document)
  || document.webkitExitFullscreen?.bind(document);

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

async function toggleFullscreen() {
  try {
    if (fullscreenElement()) await exitFullscreen?.();
    else await requestFullscreen?.();
  } catch (error) {
    console.warn("Unable to change full-screen mode.", error);
  }
}

function updateFullscreenButton() {
  const active = fullscreenElement() === gameShell;
  const label = active ? "Exit full screen" : "Enter full screen";
  fullscreenButton.setAttribute("aria-label", label);
  fullscreenButton.title = label;
  fullscreenButton.setAttribute("aria-pressed", String(active));
}

if (requestFullscreen && exitFullscreen) {
  fullscreenButton.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
} else {
  fullscreenButton.hidden = true;
}

document.querySelectorAll("[data-control]").forEach((button) => {
  const control = button.dataset.control;
  const set = (down) => {
    if (down && (!gameStarted || paused || won || cutsceneActive || deathTimer > 0 || levelTransition > 0)) return;
    if (down) startRunTimer();
    if (control === "jump" && down && !input.jump) pressed.jump = true;
    input[control] = down;
  };
  button.addEventListener("pointerdown", (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); set(true); });
  button.addEventListener("pointerup", () => set(false));
  button.addEventListener("pointercancel", () => set(false));
  button.addEventListener("lostpointercapture", () => set(false));
});

function startOver() {
  resetCutscene();
  paused = false;
  timerWasRunningBeforePause = false;
  levelTimerWasRunningBeforePause = false;
  pauseMenu.hidden = true;
  playChoiceMenu.hidden = true;
  runSetupMenu.hidden = true;
  roadmapMenu.hidden = true;
  leaderboardMenu.hidden = true;
  changelogMenu.hidden = true;
  versionsMenu.hidden = true;
  levelSplits = [];
  runQueuePosition = 0;
  nextLevelIndex = null;
  resetRunProgress();
  resetFinishedRun();
  resetRunTimer();
  loadLevel(activeRunConfig ? activeRunConfig.levels[0] : runStartLevel, false);
  pauseButton.disabled = false;
  restartButton.disabled = false;
  restartRunButton.disabled = false;
  quitButton.disabled = false;
  updatePauseButton();
  canvas.focus();
}

function quitRun() {
  gauntletChapterReturnState = null;
  countPostRunInRunTimer = false;
  resetCutscene();
  developerPanel.hidden = true;
  setFlightEnabled(false);
  levelDeveloperSequencePosition = 0;
  gameStarted = false;
  paused = false;
  timerWasRunningBeforePause = false;
  levelTimerWasRunningBeforePause = false;
  Object.assign(input, { left: false, right: false, jump: false, down: false, rewind: false, forwardTime: false });
  pressed.jump = false;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  settingsPanel.hidden = true;
  pauseMenu.hidden = true;
  playChoiceMenu.hidden = true;
  runSetupMenu.hidden = true;
  roadmapMenu.hidden = true;
  leaderboardMenu.hidden = true;
  changelogMenu.hidden = true;
  versionsMenu.hidden = true;
  accountMenu.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  levelSplits = [];
  activeRunConfig = null;
  runLevelQueue = [];
  runQueuePosition = 0;
  nextLevelIndex = null;
  resetRunProgress();
  resetRunTimer();
  resetFinishedRun();
  loadLevel(0, false);
  mainMenu.hidden = false;
  startMusic("menu");
  playButton.focus();
  updatePauseButton();
}

function restartSession() {
  if (accountSession) {
    accountNotice.textContent = "Sign out before resetting guest progress.";
    return;
  }
  try { localStorage.removeItem(GUEST_PROGRESS_STORAGE_KEY); }
  catch { /* The in-memory reset still works when storage is unavailable. */ }
  highestUnlockedLevel = 0;
  completedChapters = new Set();
  completedGauntlets = new Set();
  menuCustomizationUnlocked = false;
  rewindMenuAwakened = false;
  menuPlatformTexture = "grass";
  menuBackdrop = "sun";
  runStartLevel = 0;
  developmentSequencePosition = 0;
  levelDeveloperSequencePosition = 0;
  clearLegacySessionState();
  persistProgress(false);
  applyRewindMenuState();
  quitRun();
}

function actorBox(actor) {
  return { x: actor.x, y: actor.y, w: PLAYER_W, h: PLAYER_H };
}

function loseCrate(crate) {
  if (crate.lost) return;
  crate.lost = true;
  crate.grounded = false;
  crate.vy = 0;
  recordPlatformMotion(crate, true);
}

function crateTouchesHazard(crate) {
  return currentLevel().hazards.some((hazard) => overlaps(crate, resolvedHazard(hazard)));
}

function updateCrates(dt) {
  for (const crate of currentLevel().platforms.filter((platform) => platform.pushable)) {
    if (crate.timelinePreview || crate.timelinePlayback?.length > 0 || crate.lost) continue;

    const oldY = crate.y;
    const oldBottom = crate.y + crate.h;
    crate.vy = Math.min(CRATE_MAX_FALL_SPEED, (crate.vy || 0) + CRATE_GRAVITY * dt);
    const nextY = crate.y + crate.vy * dt;
    const nextBottom = nextY + crate.h;
    const support = currentLevel().platforms
      .filter((candidate) =>
        candidate !== crate && platformHasCollision(candidate) &&
        crate.x + crate.w > candidate.x + 1 && crate.x < candidate.x + candidate.w - 1 &&
        candidate.y >= oldBottom - 2 && candidate.y <= nextBottom + 1
      )
      .sort((left, right) => left.y - right.y)[0];

    if (support) {
      const wasGrounded = crate.grounded;
      movePlatformWithPlayer(crate, crate.x, support.y - crate.h, true, false);
      crate.vy = 0;
      crate.grounded = true;
      if (!wasGrounded || Math.abs(crate.y - oldY) >= .5) recordPlatformMotion(crate, true);
    } else {
      movePlatformWithPlayer(crate, crate.x, nextY, true, false);
      crate.grounded = false;
      recordPlatformMotion(crate);
    }

    if (crateTouchesHazard(crate) || crate.y > VIEW_H + 100) loseCrate(crate);
  }
}

function tryPushCrate(crate, distance) {
  if (crate.lost || crate.timelinePreview || crate.timelinePlayback?.length > 0) return false;
  const candidate = { x: crate.x + distance, y: crate.y, w: crate.w, h: crate.h };
  if (candidate.x < 0 || candidate.x + candidate.w > currentLevel().width) return false;
  for (const solid of currentLevel().platforms) {
    if (solid === crate) continue;
    if (!platformHasCollision(solid)) continue;
    if (overlaps(candidate, solid)) return false;
  }
  movePlatformWithPlayer(crate, candidate.x, crate.y, true, true);
  crate.vy = Math.max(0, crate.vy || 0);
  crate.grounded = false;
  recordPlatformMotion(crate, true);
  recordMechanic("crate");
  return true;
}

function moveActorAndCollideX(actor, dt, allowPush = true) {
  const distance = actor.vx * dt;
  actor.x += distance;
  const box = actorBox(actor);
  for (const solid of currentLevel().platforms) {
    if (!platformHasCollision(solid)) continue;
    if (!overlaps(box, solid)) continue;
    const feet = actor.y + PLAYER_H;
    const approachingTop = actor.vy >= 0 && actor.y < solid.y &&
      feet <= solid.y + PLATFORM_TOP_GRACE;
    if (approachingTop) continue;
    if (solid.pushable && allowPush) {
      if (distance > 0 && actor.x < solid.x) {
        const pushDistance = actor.x + PLAYER_W - solid.x;
        if (tryPushCrate(solid, pushDistance)) { box.x = actor.x; continue; }
      } else if (distance < 0 && actor.x + PLAYER_W > solid.x + solid.w) {
        const pushDistance = actor.x - (solid.x + solid.w);
        if (tryPushCrate(solid, pushDistance)) { box.x = actor.x; continue; }
      }
    }
    if (actor.vx > 0) actor.x = solid.x - PLAYER_W;
    else if (actor.vx < 0) actor.x = solid.x + solid.w;
    actor.vx = 0;
    box.x = actor.x;
  }
}

function moveActorAndCollideY(actor, dt) {
  const previousY = actor.y;
  const previousBottom = actor.y + PLAYER_H;
  const verticalVelocity = actor.vy;
  actor.y += actor.vy * dt;
  actor.grounded = false;
  let landedOn = null;
  const box = actorBox(actor);
  for (const solid of currentLevel().platforms) {
    if (!platformHasCollision(solid)) continue;
    if (!overlaps(box, solid)) continue;
    if (verticalVelocity > 0 && previousBottom <= solid.y + PLATFORM_TOP_GRACE) {
      const impactSpeed = verticalVelocity;
      const surface = solid.material || solid.kind;
      const landingKind = surface === "crate" ? "crate" : surface === "grass" ? "grass" : "stone";
      landedOn = { platform: solid, kind: landingKind, impactSpeed, intensity: Math.max(.45, Math.min(1, impactSpeed / 700)) };
      actor.y = solid.y - PLAYER_H;
      actor.grounded = true;
    }
    else if (verticalVelocity < 0 && previousY >= solid.y + solid.h - 2) {
      actor.y = solid.y + solid.h;
    } else {
      continue;
    }
    actor.vy = 0;
    box.y = actor.y;
  }
  return landedOn;
}

function moveAndCollideX(dt) {
  moveActorAndCollideX(player, dt);
}

function moveAndCollideY(dt) {
  return moveActorAndCollideY(player, dt);
}

function createBlockDebris(platform) {
  const material = platform.material || "stone";
  const colors = material === "grass"
    ? ["#6f3f24", "#92552b", "#bd7133"]
    : material === "crate"
      ? ["#7b421f", "#b86b2b", "#e0a04a"]
      : ["#59616a", "#7d8790", "#aeb5bb"];
  for (let index = 0; index < 13; index++) {
    const angle = Math.PI * (1.08 + Math.random() * .84);
    const speed = 95 + Math.random() * 155;
    blockDebris.push({
      material,
      x: platform.x + platform.w * (.12 + Math.random() * .76),
      y: platform.y + platform.h * (.25 + Math.random() * .5),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 75,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - .5) * 12,
      color: colors[index % colors.length],
      life: .72 + Math.random() * .28
    });
  }
}

function updateBlockDebris(dt) {
  for (const piece of blockDebris) {
    piece.x += piece.vx * dt;
    piece.y += piece.vy * dt;
    piece.vy += 620 * dt;
    piece.rotation += piece.spin * dt;
    piece.life -= dt;
  }
  blockDebris = blockDebris.filter((piece) => piece.life > 0);
}

function createLandingParticles(landing) {
  const material = landing.kind;
  const colors = material === "grass"
    ? ["#6f3f24", "#92552b", "#bd7133"]
    : material === "crate"
      ? ["#7b421f", "#b86b2b", "#e0a04a"]
      : ["#59616a", "#7d8790", "#aeb5bb"];
  const strength = Math.max(.35, Math.min(1, landing.impactSpeed / 650));
  const count = 4 + Math.round(strength * 3);
  const footX = player.x + PLAYER_W / 2;
  const footY = player.y + PLAYER_H - 1;

  for (let index = 0; index < count; index++) {
    const direction = index % 2 === 0 ? -1 : 1;
    const speed = (24 + Math.random() * 38) * strength;
    landingParticles.push({
      material,
      x: footX + direction * (5 + Math.random() * 10),
      y: footY - Math.random() * 2,
      vx: direction * speed,
      vy: -(20 + Math.random() * 38) * strength,
      size: 2 + Math.random() * 2.2,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - .5) * 10,
      color: colors[index % colors.length],
      life: .26 + Math.random() * .16
    });
  }
}

function updateLandingParticles(dt) {
  for (const particle of landingParticles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 360 * dt;
    particle.vx *= Math.max(0, 1 - dt * 3.5);
    particle.rotation += particle.spin * dt;
    particle.life -= dt;
  }
  landingParticles = landingParticles.filter((particle) => particle.life > 0);
}

function updateBreakablePlatforms(dt, ...landings) {
  for (const landedOn of landings) {
    const platform = landedOn?.platform;
    if (platform?.breakable && platform.breakTimer === null) {
      if (platform.breakTrigger === "stand") {
        platform.breakTimer = .75;
        recordMechanic("crumble");
      } else if (platform.breakTrigger === "impact" && landedOn.impactSpeed >= 180) {
        platform.breakTimer = .24;
        recordMechanic("impact-block");
      }
    }
  }

  for (const candidate of currentLevel().platforms) {
    if (!candidate.breakable || candidate.broken || candidate.breakTimer === null) continue;
    candidate.breakTimer -= dt;
    if (candidate.breakTimer > 0) continue;
    candidate.broken = true;
    candidate.breakTimer = 0;
    if (candidate.rewindableState) recordPlatformMotion(candidate, true);
    const standingOnBlock = player.x + PLAYER_W > candidate.x && player.x < candidate.x + candidate.w &&
      Math.abs(player.y + PLAYER_H - candidate.y) < 2;
    if (standingOnBlock) player.grounded = false;
    createBlockDebris(candidate);
    playSfx("block-break");
  }
}

function activateJumpPad() {
  if (player.vy < 0) return false;
  const pad = currentLevel().jumpPads?.find((candidate) => overlaps(playerBox(), candidate));
  if (!pad) return false;
  player.y = pad.y - PLAYER_H;
  player.vy = -JUMP_PAD_SPEED;
  player.grounded = false;
  player.coyote = 0;
  player.jumpBuffer = 0;
  player.padLaunched = true;
  recordMechanic("jump-pad");
  playSfx("jump-pad");
  return true;
}

function activateEchoJumpPad() {
  if (!echo || echo.vy < 0) return false;
  const pad = currentLevel().jumpPads?.find((candidate) => overlaps(actorBox(echo), candidate));
  if (!pad) return false;
  echo.y = pad.y - PLAYER_H;
  echo.vy = -JUMP_PAD_SPEED;
  echo.grounded = false;
  echo.coyote = 0;
  echo.jumpBuffer = 0;
  echo.padLaunched = true;
  return true;
}

function updateEcho(dt) {
  if (!echo || echo.frames.length === 0) return null;
  if (echo.cursor >= echo.frames.length) resetEchoLoop();
  const frame = echo.frames[echo.cursor++];
  const direction = Number(frame.right) - Number(frame.left);
  const acceleration = echo.grounded ? GROUND_ACCEL : AIR_ACCEL;
  if (direction) {
    echo.vx += direction * acceleration * dt;
    echo.vx = Math.max(-RUN_SPEED, Math.min(RUN_SPEED, echo.vx));
    echo.facing = direction;
  } else {
    const drag = FRICTION * dt;
    echo.vx = Math.abs(echo.vx) <= drag ? 0 : echo.vx - Math.sign(echo.vx) * drag;
  }

  if (frame.jumpPressed) echo.jumpBuffer = JUMP_BUFFER;
  else echo.jumpBuffer = Math.max(0, echo.jumpBuffer - dt);
  echo.coyote = echo.grounded ? COYOTE_TIME : Math.max(0, echo.coyote - dt);
  if (echo.jumpBuffer > 0 && echo.coyote > 0) {
    echo.vy = -JUMP_SPEED;
    echo.grounded = false;
    echo.coyote = 0;
    echo.jumpBuffer = 0;
  }
  if (!frame.jump && echo.vy < -220 && !echo.padLaunched) echo.vy += GRAVITY * 1.55 * dt;
  echo.vy = Math.min(echo.vy + GRAVITY * dt, 900);

  moveActorAndCollideX(echo, dt, Boolean(currentLevel().echoCanPushCrates));
  const landedOn = moveActorAndCollideY(echo, dt);
  const padActivated = activateEchoJumpPad();
  if (landedOn && !padActivated) echo.padLaunched = false;
  echo.x = Math.max(0, Math.min(currentLevel().width - PLAYER_W, echo.x));
  if (frame.interact) activateNearbySwitch(echo);
  if (echo.y > VIEW_H + 100) resetEchoLoop();
  return landedOn;
}

function update(dt) {
  if (!gameStarted) return;
  if (paused) return;

  if (cutsceneActive) {
    updateCutscene(dt);
    return;
  }

  updateBlockDebris(dt);
  updateLandingParticles(dt);
  updateEnemyDeathParticles(dt);

  if (deathTimer > 0) {
    deathTimer = Math.max(0, deathTimer - dt);
    for (const particle of deathParticles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 500 * dt;
      particle.rotation += particle.spin * dt;
    }
    if (deathTimer === 0) resetPlayer(false);
    return;
  }

  if (won || levelTransition > 0) {
    if (levelTransition > 0) {
      levelTransition -= dt;
      if (levelTransition <= 0) {
        const destination = nextLevelIndex ?? levelIndex + 1;
        nextLevelIndex = null;
        loadLevel(destination);
      }
    }
    return;
  }

  if (echoPreview) return;

  captureEchoFrame();
  updateMomentarySwitches(dt);
  updatePressurePlates(dt);
  updateMovingPlatforms(dt);
  updateCrates(dt);

  const wasGrounded = player.grounded;
  const previousPlayerBottom = player.y + PLAYER_H;
  const direction = Number(input.right) - Number(input.left);
  const acceleration = player.grounded ? GROUND_ACCEL : AIR_ACCEL;
  if (direction) {
    player.vx += direction * acceleration * dt;
    player.vx = Math.max(-RUN_SPEED, Math.min(RUN_SPEED, player.vx));
    player.facing = direction;
  } else {
    const drag = FRICTION * dt;
    player.vx = Math.abs(player.vx) <= drag ? 0 : player.vx - Math.sign(player.vx) * drag;
  }

  if (flightEnabled) {
    pressed.jump = false;
    player.jumpBuffer = 0;
    player.coyote = 0;
    player.grounded = false;
    player.padLaunched = false;
    player.vy = (Number(input.down) - Number(input.jump)) * RUN_SPEED;
  } else {
    if (pressed.jump) { player.jumpBuffer = JUMP_BUFFER; pressed.jump = false; }
    else player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);
    player.coyote = player.grounded ? COYOTE_TIME : Math.max(0, player.coyote - dt);
    if (player.jumpBuffer > 0 && player.coyote > 0) {
      player.vy = -JUMP_SPEED;
      player.grounded = false;
      player.coyote = 0;
      player.jumpBuffer = 0;
    }
    if (!input.jump && player.vy < -220 && !player.padLaunched) player.vy += GRAVITY * 1.55 * dt;
    player.vy = Math.min(player.vy + GRAVITY * dt, 900);
  }

  moveAndCollideX(dt);
  const landedOn = moveAndCollideY(dt);
  if (!wasGrounded && landedOn) {
    createLandingParticles(landedOn);
    playSfx(`land-${landedOn.kind}`, landedOn.intensity);
  }
  const padActivated = activateJumpPad();
  if (landedOn && !padActivated) player.padLaunched = false;
  player.x = Math.max(0, Math.min(currentLevel().width - PLAYER_W, player.x));
  const echoLandedOn = updateEcho(dt);
  updateBreakablePlatforms(dt, landedOn, echoLandedOn);

  if (updateEnemies(dt, previousPlayerBottom)) return;
  const box = playerBox();
  if (player.y > VIEW_H + 100) {
    playSfx("death");
    resetPlayer(true);
    return;
  }
  const touchedHazardIndex = currentLevel().hazards.findIndex((hazard) => overlaps(box, resolvedHazard(hazard)));
  const touchedHazard = currentLevel().hazards[touchedHazardIndex];
  if (touchedHazard) {
    startSpikeDeath(`${levelIndex}:hazard:${touchedHazardIndex}`);
    return;
  }
  const touchedMovingObstacleIndex = currentLevel().platforms.findIndex((platform) =>
    platform.dangerous && !platform.broken && overlaps(box, platform)
  );
  if (touchedMovingObstacleIndex >= 0) {
    startSpikeDeath(`${levelIndex}:moving-obstacle:${touchedMovingObstacleIndex}`);
    return;
  }

  currentLevel().stars.forEach(([x, y], i) => {
    const star = { x: x - 15, y: y - 15, w: 30, h: 30 };
    if (!collected[i] && overlaps(box, star)) {
      collected[i] = true;
      totalStars++;
      playSfx("star");
      updateHud();
    }
  });

  for (const enemy of currentLevel().enemies || []) {
    if (!enemy.starDropped || enemy.starCollected) continue;
    const star = { x: enemy.starX - 15, y: enemy.starY - 15, w: 30, h: 30 };
    if (!overlaps(box, star)) continue;
    enemy.starCollected = true;
    enemy.starDropped = false;
    totalStars++;
    playSfx("star");
    updateHud();
  }

  const collectedLevelStars = collected.filter(Boolean).length;
  const finishRequirementMet = flightEnabled ||
    ((!currentLevel().requiredStars || currentLevelStarCount() >= currentLevel().requiredStars) &&
      (!currentLevel().requiredLevelStars || collectedLevelStars >= currentLevel().requiredLevelStars));
  if (finishRequirementMet && overlaps(box, currentLevel().finish)) {
    playSfx("flag");
    const chapterEndIndex = [9, 19, 29, 39].indexOf(levelIndex);
    if (chapterEndIndex >= 0) {
      completeChapter(chapterEndIndex);
      unlockThrough(levelIndex + 1);
    }
    if (currentLevel().gauntletId) {
      finishGauntlet();
    }
    else if (activeRunConfig) {
      completeLevelSplit();
      runProgress.completedLevels.add(levelIndex);
      unlockThrough(levelIndex + 1);
      runQueuePosition++;
      if (runQueuePosition >= runLevelQueue.length) showRunResults();
      else {
        nextLevelIndex = runLevelQueue[runQueuePosition];
        levelTransition = .65;
      }
    }
    else if (currentLevel().rewindChapter || currentLevel().echoChapter) {
      if (levelIndex === 19) showEchoChapterResults();
      else if (levelIndex === 29) showConvergenceChapterResults();
      else if (levelIndex === CAMPAIGN_LEVEL_COUNT - 1) finishCombinedChapter();
      else {
        completeLevelSplit();
        unlockThrough(levelIndex + 1);
        levelTransition = .65;
      }
    }
    else if (levelIndex === INTRO_LEVEL_COUNT - 1) {
      completeLevelSplit();
      showRunResults();
    }
    else {
      completeLevelSplit();
      unlockThrough(levelIndex + 1);
      levelTransition = .65;
    }
  }

  const target = Math.max(0, Math.min(currentLevel().width - VIEW_W, player.x - VIEW_W * .38));
  cameraX += (target - cameraX) * Math.min(1, dt * 6);
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
}

const spriteCuts = [
  [63, 239, 337, 331], [460, 239, 327, 330], [862, 237, 333, 339],
  [60, 774, 330, 244], [462, 691, 331, 324], [879, 637, 303, 399]
];

function drawSprite(index, x, y, w, h) {
  if (!spritesReady) return false;
  // Crop the transparent padding around each of the six generated atlas objects.
  const scale = spriteSheet.naturalWidth / 1254;
  const [sx, sy, sw, sh] = spriteCuts[index].map((value) => value * scale);
  ctx.drawImage(spriteSheet, sx, sy, sw, sh, x, y, w, h);
  return true;
}

function drawBackground() {
  const isLavaLevel = currentLevel().theme === "lava";
  const isRewindLevel = currentLevel().theme === "rewind";
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  gradient.addColorStop(0, isLavaLevel ? "#382337" : isRewindLevel ? "#182b52" : "#5ac8fa");
  gradient.addColorStop(.62, isLavaLevel ? "#9d493c" : isRewindLevel ? "#4887a5" : "#b9edff");
  gradient.addColorStop(1, isLavaLevel ? "#ef9b47" : isRewindLevel ? "#b7e4e8" : "#edfaff");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = isLavaLevel ? "#d7b3a34a" : isRewindLevel ? "#c7f8ff45" : "#ffffff7a";
  for (let i = -1; i < 7; i++) {
    const x = ((i * 230 - cameraX * .14) % 1500) - 80;
    ctx.beginPath(); ctx.ellipse(x, 125 + (i % 3) * 54, 60, 20, 0, 0, Math.PI * 2); ctx.ellipse(x + 42, 118 + (i % 3) * 54, 38, 27, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = isLavaLevel ? "#352b386e" : isRewindLevel ? "#233d5f80" : "#6798a966";
  ctx.beginPath(); ctx.moveTo(0, 420);
  for (let x = 0; x <= VIEW_W; x += 100) ctx.lineTo(x, 330 + Math.sin((x + cameraX * .09) * .009) * 45);
  ctx.lineTo(VIEW_W, VIEW_H); ctx.lineTo(0, VIEW_H); ctx.fill();
}

function drawPillarTexture(spriteIndex, x, y, width, height) {
  if (!spritesReady || height <= 0) return false;
  const scale = spriteSheet.naturalWidth / 1254;
  const [cutX, cutY, cutW, cutH] = spriteCuts[spriteIndex];
  const middleCrop = spriteIndex === 1
    ? [.18, .20, .64, .62]
    : [.22, .38, .56, .48];
  const sourceEdge = cutW * (spriteIndex === 1 ? .16 : .14);
  const destinationEdge = Math.min(18, width / 2);
  const middleWidth = Math.max(0, width - destinationEdge * 2);
  const sourceY = (cutY + cutH * middleCrop[1]) * scale;
  const sourceH = cutH * middleCrop[3] * scale;
  const middleSourceX = (cutX + cutW * middleCrop[0]) * scale;
  const middleSourceW = cutW * middleCrop[2] * scale;
  const tileW = 58;
  const tileH = 58;

  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, width, height); ctx.clip();
  for (let ty = 0; ty < height; ty += tileH) {
    const drawH = Math.min(tileH, height - ty);
    for (let tx = 0; tx < middleWidth; tx += tileW) {
      const drawW = Math.min(tileW, middleWidth - tx);
      ctx.drawImage(
        spriteSheet,
        middleSourceX, sourceY, middleSourceW * drawW / tileW, sourceH * drawH / tileH,
        x + destinationEdge + tx, y + ty, drawW + .5, drawH + .5
      );
    }
    ctx.drawImage(
      spriteSheet,
      cutX * scale, sourceY, sourceEdge * scale, sourceH * drawH / tileH,
      x, y + ty, destinationEdge, drawH + .5
    );
    ctx.drawImage(
      spriteSheet,
      (cutX + cutW - sourceEdge) * scale, sourceY, sourceEdge * scale, sourceH * drawH / tileH,
      x + width - destinationEdge, y + ty, destinationEdge, drawH + .5
    );
  }
  ctx.restore();
  return true;
}

function drawConnectedPlatformCap(spriteIndex, x, y, width, height) {
  const scale = spriteSheet.naturalWidth / 1254;
  const [cutX, cutY, cutW, cutH] = spriteCuts[spriteIndex];
  const sourceEdge = cutW * (spriteIndex === 1 ? .16 : .14);
  const destinationEdge = Math.min(18, width / 2);
  const middleWidth = Math.max(0, width - destinationEdge * 2);
  const sourceY = cutY * scale;
  const sourceHeight = cutH * scale;
  const tileWidth = 64;

  ctx.drawImage(
    spriteSheet,
    cutX * scale, sourceY, sourceEdge * scale, sourceHeight,
    x, y, destinationEdge, height
  );

  for (let offset = 0; offset < middleWidth; offset += tileWidth) {
    const drawWidth = Math.min(tileWidth, middleWidth - offset);
    ctx.drawImage(
      spriteSheet,
      (cutX + sourceEdge) * scale, sourceY,
      (cutW - sourceEdge * 2) * scale * drawWidth / tileWidth, sourceHeight,
      x + destinationEdge + offset, y, drawWidth + .5, height
    );
  }

  ctx.drawImage(
    spriteSheet,
    (cutX + cutW - sourceEdge) * scale, sourceY, sourceEdge * scale, sourceHeight,
    x + width - destinationEdge, y, destinationEdge, height
  );
}

function drawAssetRectangle(material, x, y, width, height, targetContext = ctx) {
  const spriteIndex = material === "grass" ? 0 : material === "crate" ? 2 : 1;
  if (!spritesReady) {
    targetContext.fillStyle = material === "grass" ? "#925b35" : material === "crate" ? "#a76728" : "#77828d";
    targetContext.fillRect(x, y, width, height);
    return;
  }

  const scale = spriteSheet.naturalWidth / 1254;
  const [cutX, cutY, cutW, cutH] = spriteCuts[spriteIndex];
  const inset = material === "grass"
    ? { left: .14, right: .14, top: .36, bottom: .10, dx: 15, dyTop: 20, dyBottom: 10 }
    : material === "crate"
      ? { left: .17, right: .17, top: .17, bottom: .17, dx: 16, dyTop: 14, dyBottom: 14 }
      : { left: .15, right: .15, top: .15, bottom: .15, dx: 15, dyTop: 14, dyBottom: 14 };
  const sourceLeft = cutW * inset.left;
  const sourceRight = cutW * inset.right;
  const sourceTop = cutH * inset.top;
  const sourceBottom = cutH * inset.bottom;
  const destinationLeft = Math.min(inset.dx, width / 2);
  const destinationRight = Math.min(inset.dx, width - destinationLeft);
  const destinationTop = Math.min(inset.dyTop, height / 2);
  const destinationBottom = Math.min(inset.dyBottom, height - destinationTop);
  const sourceColumns = [0, sourceLeft, cutW - sourceRight, cutW];
  const sourceRows = [0, sourceTop, cutH - sourceBottom, cutH];
  const destinationColumns = [0, destinationLeft, width - destinationRight, width];
  const destinationRows = [0, destinationTop, height - destinationBottom, height];

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      const sourceW = sourceColumns[column + 1] - sourceColumns[column];
      const sourceH = sourceRows[row + 1] - sourceRows[row];
      const destinationW = destinationColumns[column + 1] - destinationColumns[column];
      const destinationH = destinationRows[row + 1] - destinationRows[row];
      if (sourceW <= 0 || sourceH <= 0 || destinationW <= 0 || destinationH <= 0) continue;
      targetContext.drawImage(
        spriteSheet,
        (cutX + sourceColumns[column]) * scale, (cutY + sourceRows[row]) * scale,
        sourceW * scale, sourceH * scale,
        x + destinationColumns[column], y + destinationRows[row], destinationW + .25, destinationH + .25
      );
    }
  }
}

function drawMechanicBlock(block, x, time) {
  const activeDuration = block.breakTrigger === "stand" ? .75 : .24;
  const breakProgress = block.breakTimer === null ? 0 : Math.min(1, 1 - block.breakTimer / activeDuration);
  const shake = breakProgress > .35 ? Math.sin(time * .09) * breakProgress * 2.2 : 0;
  const drawX = x + shake;

  ctx.save();
  ctx.globalAlpha = 1 - breakProgress * .2;
  ctx.shadowColor = "#10182590";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 4;
  drawAssetRectangle(block.material, drawX, block.y, block.w, block.h);
  ctx.shadowColor = "transparent";

  if (block.breakable) {
    const damageAsset = breakProgress > .3 ? "fragileBlockHalfBroken" : "fragileBlockCracks";
    drawGameArt(damageAsset, drawX, block.y, block.w, block.h);
  }
  ctx.restore();
}

function drawMovingObstacle(obstacle, x, time) {
  const pulse = (Math.sin(time * .012) + 1) * .5;
  ctx.save();
  ctx.translate(x + obstacle.w / 2, obstacle.y + obstacle.h / 2);
  ctx.rotate(time * .0045);
  ctx.shadowColor = "#ff4a32";
  ctx.shadowBlur = 8 + pulse * 7;
  drawGameArt("movingObstacle", -obstacle.w / 2, -obstacle.h / 2, obstacle.w, obstacle.h);
  ctx.restore();
}

function drawPlatform(p, time) {
  if (p.broken || p.lost) return;
  const x = p.x - cameraX;
  if (x + p.w < -80 || x > VIEW_W + 80) return;
  if (p.kind === "moving-obstacle") {
    drawMovingObstacle(p, x, time);
    return;
  }
  if (p.kind === "breakable-block" || p.kind === "floating-block") {
    drawMechanicBlock(p, x, time);
    return;
  }
  if (p.kind === "crate") {
    const drewSprite = p.w <= 100 && drawSprite(2, x, p.y, p.w, p.h);
    if (!drewSprite) {
      ctx.fillStyle = "#a76728"; roundedRect(x, p.y, p.w, p.h, 6);
      ctx.fillStyle = "#d7963c"; ctx.fillRect(x, p.y, p.w, Math.min(13, p.h));
    }
    if (p.pushable) drawPushableCrateMarker(p, x);
    return;
  }

  const tile = p.kind === "stone" ? 1 : 0;
  if (spritesReady) {
    const capDepth = Math.min(p.h, p.kind === "stone" ? 52 : 50);
    drawPillarTexture(tile, x, p.y + capDepth - 2, p.w, p.h - capDepth + 2);
    ctx.save();
    ctx.beginPath(); ctx.rect(x, p.y, p.w, capDepth); ctx.clip();
    drawConnectedPlatformCap(tile, x, p.y, p.w, 82);
    ctx.restore();
    if (p.moving || p.rewindable) drawMovingPlatformMarker(p, x);
    return;
  }
  const topDepth = Math.min(82, p.h);
  ctx.fillStyle = p.kind === "stone" ? "#77828d" : "#925b35";
  ctx.fillRect(x, p.y, p.w, topDepth);
  ctx.fillStyle = p.kind === "stone" ? "#aab3bb" : "#61bb3c";
  ctx.fillRect(x, p.y, p.w, Math.min(13, p.h));
  if (p.moving || p.rewindable) drawMovingPlatformMarker(p, x);
}

function drawPushableCrateMarker(crate, x) {
  const centerX = x + crate.w / 2;
  const centerY = crate.y + crate.h / 2;
  ctx.save();
  ctx.fillStyle = "#0b3957d9";
  ctx.strokeStyle = "#8de4ff";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.roundRect(centerX - 20, centerY - 8, 40, 16, 8); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(centerX - 13, centerY); ctx.lineTo(centerX + 13, centerY);
  ctx.moveTo(centerX - 13, centerY); ctx.lineTo(centerX - 7, centerY - 5);
  ctx.moveTo(centerX - 13, centerY); ctx.lineTo(centerX - 7, centerY + 5);
  ctx.moveTo(centerX + 13, centerY); ctx.lineTo(centerX + 7, centerY - 5);
  ctx.moveTo(centerX + 13, centerY); ctx.lineTo(centerX + 7, centerY + 5);
  ctx.stroke();
  ctx.restore();
}

function platformMotionAxes(platform) {
  if (platform.moving) {
    return { horizontal: platform.axis === "x", vertical: platform.axis === "y" };
  }
  const points = platform.motionPath?.length > 1
    ? platform.motionPath
    : [
        { x: platform.baseX, y: platform.baseY },
        { x: platform.targetX, y: platform.targetY }
      ];
  const xs = points.map((point) => point.x).filter(Number.isFinite);
  const ys = points.map((point) => point.y).filter(Number.isFinite);
  return {
    horizontal: xs.length > 1 && Math.max(...xs) - Math.min(...xs) > .5,
    vertical: ys.length > 1 && Math.max(...ys) - Math.min(...ys) > .5
  };
}

function drawMovingPlatformMarker(platform, x) {
  const { horizontal, vertical } = platformMotionAxes(platform);
  if (!horizontal && !vertical) return;
  const centerX = x + platform.w / 2;
  const centerY = platform.y + (horizontal && !vertical ? 9 : 17);
  const markerWidth = horizontal && vertical ? 34 : horizontal ? 48 : 22;
  const markerHeight = horizontal && !vertical ? 15 : 28;
  ctx.save();
  ctx.strokeStyle = "#8de4ff";
  ctx.fillStyle = "#0b3957cc";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.roundRect(centerX - markerWidth / 2, centerY - markerHeight / 2, markerWidth, markerHeight, 7);
  ctx.fill();
  ctx.beginPath();
  if (horizontal) {
    const reach = vertical ? 11 : 15;
    ctx.moveTo(centerX - reach, centerY); ctx.lineTo(centerX + reach, centerY);
    ctx.moveTo(centerX - reach, centerY); ctx.lineTo(centerX - reach + 6, centerY - 5);
    ctx.moveTo(centerX - reach, centerY); ctx.lineTo(centerX - reach + 6, centerY + 5);
    ctx.moveTo(centerX + reach, centerY); ctx.lineTo(centerX + reach - 6, centerY - 5);
    ctx.moveTo(centerX + reach, centerY); ctx.lineTo(centerX + reach - 6, centerY + 5);
  }
  if (vertical) {
    const reach = 9;
    ctx.moveTo(centerX, centerY - reach); ctx.lineTo(centerX, centerY + reach);
    ctx.moveTo(centerX, centerY - reach); ctx.lineTo(centerX - 5, centerY - reach + 5);
    ctx.moveTo(centerX, centerY - reach); ctx.lineTo(centerX + 5, centerY - reach + 5);
    ctx.moveTo(centerX, centerY + reach); ctx.lineTo(centerX - 5, centerY + reach - 5);
    ctx.moveTo(centerX, centerY + reach); ctx.lineTo(centerX + 5, centerY + reach - 5);
  }
  ctx.stroke();
  ctx.restore();
}

function drawSwitch(levelSwitch, time) {
  const x = levelSwitch.x - cameraX;
  if (x + levelSwitch.w < -30 || x > VIEW_W + 30) return;
  ctx.save();
  ctx.shadowColor = "#0a102288";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 3;
  drawGameArt(levelSwitch.flipped ? "switchRight" : "switchLeft", x, levelSwitch.y, levelSwitch.w, levelSwitch.h);
  ctx.shadowColor = "transparent";

  if (nearbySwitch() === levelSwitch) {
    const prompt = switchPromptBounds(levelSwitch, time);
    ctx.fillStyle = "#07162de8";
    ctx.strokeStyle = "#8de4ff";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(prompt.x, prompt.y, prompt.w, prompt.h, 9); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ffe05d";
    ctx.beginPath(); ctx.roundRect(prompt.x + 7, prompt.y + 5, 20, 19, 5); ctx.fill();
    ctx.fillStyle = "#152039";
    ctx.font = "900 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("E", prompt.x + 17, prompt.y + 15);
    ctx.fillStyle = "#e9f7ff";
    ctx.font = "800 11px Inter, sans-serif";
    ctx.fillText("- FLIP", prompt.x + 57, prompt.y + 15);
  }
  ctx.restore();
}

function drawPressurePlate(plate) {
  const x = plate.x - cameraX;
  if (x + plate.w < -20 || x > VIEW_W + 20) return;
  const depression = plate.pressProgress * 5;
  ctx.save();
  ctx.shadowColor = plate.pressed ? "#75e38aaa" : "#8de4ff88";
  ctx.shadowBlur = plate.pressed ? 12 : 7;
  drawGameArt("pressurePlateBase", x, plate.y + 5, plate.w, 7);
  drawGameArt(plate.pressed ? "pressurePlateTopActive" : "pressurePlateTop", x + 4, plate.y + depression, plate.w - 8, 6);
  ctx.shadowColor = "transparent";
  ctx.restore();
}

function drawJumpPad(pad, time) {
  const x = pad.x - cameraX;
  if (x + pad.w < -20 || x > VIEW_W + 20) return;
  const pulse = (Math.sin(time * .008) + 1) * .5;
  ctx.save();
  ctx.shadowColor = "#ffe05d";
  ctx.shadowBlur = 6 + pulse * 7;
  drawGameArt("jumpPadBase", x, pad.y + 7, pad.w, pad.h - 7);
  drawGameArt("jumpPadTop", x + 3, pad.y + 2 - pulse * 2, pad.w - 6, 10);
  ctx.restore();
}

function drawHazard(h, time) {
  const x = h.x - cameraX;
  if (x + h.w < -40 || x > VIEW_W + 40) return;
  if (h.kind === "lava") {
    ctx.save();
    ctx.fillStyle = "#d43a25";
    ctx.fillRect(x, h.y, h.w, h.h);
    ctx.fillStyle = "#ff8128";
    ctx.beginPath();
    ctx.moveTo(x, h.y + 5);
    for (let px = 0; px <= h.w; px += 10) {
      ctx.lineTo(x + px, h.y + 5 + Math.sin(time * .006 + (h.x + px) * .05) * 4);
    }
    ctx.lineTo(x + h.w, h.y + h.h);
    ctx.lineTo(x, h.y + h.h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffd65a";
    const bubbleCount = Math.max(1, Math.floor(h.w / 45));
    for (let i = 0; i < bubbleCount; i++) {
      const bx = x + ((i * 53 + time * .018) % h.w);
      const by = h.y + 13 + Math.sin(time * .004 + i * 2.1) * 5;
      ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }
  if (drawSprite(3, x, h.y - 29, h.w, 48)) return;
  ctx.fillStyle = "#e9f5ff"; ctx.strokeStyle = "#526478"; ctx.lineWidth = 2;
  const count = Math.max(1, Math.round(h.w / 24));
  for (let i = 0; i < count; i++) { const sx = x + i * h.w / count; ctx.beginPath(); ctx.moveTo(sx, h.y + h.h); ctx.lineTo(sx + h.w / count / 2, h.y - 18); ctx.lineTo(sx + h.w / count, h.y + h.h); ctx.closePath(); ctx.fill(); ctx.stroke(); }
}

function drawStar(x, y, index, time) {
  if (collected[index]) return;
  drawStarShape(x, y, index, time);
}

function drawStarShape(x, y, index, time) {
  const bob = Math.sin(time * .004 + index) * 4;
  if (drawSprite(4, x - cameraX - 20, y + bob - 20, 40, 40)) return;
  ctx.save(); ctx.translate(x - cameraX, y + bob); ctx.rotate(time * .001);
  ctx.fillStyle = "#ffd83d"; ctx.strokeStyle = "#d68b13"; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const r = i % 2 ? 8 : 18; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}

function drawEnemyStars(time) {
  const indexOffset = currentLevel().stars.length;
  (currentLevel().enemies || []).forEach((enemy, index) => {
    if (enemy.starDropped && !enemy.starCollected) {
      drawStarShape(enemy.starX, enemy.starY, indexOffset + index, time);
    }
  });
}

function drawFlag(flag) {
  const x = flag.x - cameraX;
  if (drawSprite(5, x - 25, flag.y - 18, 82, flag.h + 25)) return;
  ctx.fillStyle = "#f5c54e"; ctx.fillRect(x + 4, flag.y, 6, flag.h);
  ctx.fillStyle = "#f0445a"; ctx.beginPath(); ctx.moveTo(x + 10, flag.y + 5); ctx.lineTo(x + 55, flag.y + 18); ctx.lineTo(x + 10, flag.y + 34); ctx.fill();
}

function drawSlimeCharacter(character, time, assetName) {
  const x = character.x - cameraX, y = character.y;
  ctx.save(); ctx.translate(x + PLAYER_W / 2, y + PLAYER_H / 2);
  if (!character.grounded) ctx.rotate(character.vx * .00025);
  const moving = character.grounded && Math.abs(character.vx) > 20;
  const bounce = moving ? Math.sin(time * .018) * 1.6 : Math.sin(time * .004) * .6;
  const squash = character.grounded ? bounce : -1.4;
  const scaleX = (34 + squash * .9) / 34;
  const scaleY = (31 - squash * .35) / 31;
  ctx.scale(character.facing * scaleX, scaleY);
  drawGameArt(assetName, -19, -16, 38, 38);
  ctx.restore();
}

function drawPlayer(time) {
  drawSlimeCharacter(player, time, "player");
}

function drawEcho(time) {
  if (!echo) return;
  ctx.save();
  ctx.globalAlpha = .74;
  ctx.shadowColor = "#77e8ff";
  ctx.shadowBlur = 12;
  drawSlimeCharacter(echo, time, "echo");
  ctx.restore();
}

function drawEchoRoutePreview(time) {
  if (!echoPreview) return;
  const path = echoPreview.path || [];
  const start = echoPreview.start;
  ctx.save();
  ctx.translate(-cameraX, 0);

  if (path.length > 1) {
    ctx.strokeStyle = "rgba(255, 211, 77, .7)";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ffd34d";
    ctx.shadowBlur = 10;
    ctx.setLineDash([9, 8]);
    ctx.lineDashOffset = -time * .025;
    ctx.beginPath();
    path.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    const segments = [];
    let totalLength = 0;
    for (let index = 1; index < path.length; index++) {
      const from = path[index - 1];
      const to = path[index];
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      if (length < .5) continue;
      segments.push({ from, to, length, start: totalLength });
      totalLength += length;
    }
    ctx.fillStyle = "#fff0a3";
    ctx.shadowBlur = 7;
    const phase = (time * .035) % 56;
    for (let distance = 22 + phase; distance < totalLength; distance += 56) {
      const segment = segments.find((candidate) => distance <= candidate.start + candidate.length);
      if (!segment) continue;
      const progress = (distance - segment.start) / segment.length;
      const x = segment.from.x + (segment.to.x - segment.from.x) * progress;
      const y = segment.from.y + (segment.to.y - segment.from.y) * progress;
      const angle = Math.atan2(segment.to.y - segment.from.y, segment.to.x - segment.from.x);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-7, -6);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-7, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  const pulse = .74 + Math.sin(time * .008) * .14;
  ctx.fillStyle = `rgba(255, 211, 77, ${.08 + pulse * .05})`;
  ctx.strokeStyle = `rgba(255, 226, 111, ${pulse})`;
  ctx.lineWidth = 3;
  ctx.setLineDash([7, 6]);
  ctx.shadowColor = "#ffd34d";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(start.x, start.y + 10, PLAYER_W, PLAYER_H - 11, 9);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawEnemies(time) {
  for (const enemy of currentLevel().enemies || []) {
    if (!enemy.alive) continue;
    drawSlimeCharacter({
      x: enemy.x, y: enemy.y, vx: enemy.direction * enemy.speed,
      grounded: true, facing: enemy.direction
    }, time, "enemy");
  }
}

function drawDeathParticles() {
  const opacity = Math.min(1, deathTimer / .14);
  ctx.fillStyle = `rgba(85, 201, 107, ${opacity})`;
  ctx.strokeStyle = `rgba(32, 122, 67, ${opacity * .75})`;
  ctx.lineWidth = 1;
  for (const particle of deathParticles) {
    ctx.save();
    ctx.translate(particle.x - cameraX, particle.y);
    ctx.rotate(particle.rotation);
    ctx.beginPath();
    ctx.roundRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size, 1.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawEnemyDeathParticles() {
  ctx.fillStyle = "#e85b61";
  ctx.strokeStyle = "#8f2735";
  ctx.lineWidth = 1;
  for (const particle of enemyDeathParticles) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, particle.life / .14);
    ctx.translate(particle.x - cameraX, particle.y);
    ctx.rotate(particle.rotation);
    ctx.beginPath();
    ctx.roundRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size, 1.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawBlockDebris() {
  for (const piece of blockDebris) {
    const opacity = Math.min(1, piece.life * 2.5);
    ctx.save();
    ctx.translate(piece.x - cameraX, piece.y);
    ctx.rotate(piece.rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = piece.color;
    ctx.strokeStyle = "#34251da8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (piece.material === "stone") {
      ctx.roundRect(-piece.size / 2, -piece.size * .4, piece.size, piece.size * .8, piece.size * .25);
    } else if (piece.material === "crate") {
      ctx.roundRect(-piece.size, -piece.size * .22, piece.size * 2, piece.size * .44, 1.5);
    } else {
      ctx.roundRect(-piece.size * .55, -piece.size * .45, piece.size * 1.1, piece.size * .9, 2);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawLandingParticles() {
  for (const particle of landingParticles) {
    ctx.save();
    ctx.translate(particle.x - cameraX, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = Math.min(1, particle.life * 4);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    if (particle.material === "stone") {
      ctx.roundRect(-particle.size / 2, -particle.size * .35, particle.size, particle.size * .7, 1);
    } else if (particle.material === "crate") {
      ctx.roundRect(-particle.size, -particle.size * .18, particle.size * 2, particle.size * .36, 1);
    } else {
      ctx.ellipse(0, 0, particle.size * .7, particle.size * .45, 0, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }
}

function cutsceneEase(value) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function cutsceneJump(time, startTime, endTime, startX, startY, endX, endY, height) {
  const progress = Math.max(0, Math.min(1, (time - startTime) / (endTime - startTime)));
  return {
    x: startX + (endX - startX) * progress,
    y: startY + (endY - startY) * progress - Math.sin(progress * Math.PI) * height,
    airborne: progress > 0 && progress < 1
  };
}

function cutsceneSlimePose(time) {
  if (time < .8) return { x: 55, y: 418, airborne: false };
  if (time < 1.45) return { x: 55 + cutsceneEase((time - .8) / .65) * 110, y: 418, airborne: false };
  if (time < 2.35) return cutsceneJump(time, 1.45, 2.35, 165, 418, 305, 368, 78);
  if (time < 2.95) return { x: 305 + cutsceneEase((time - 2.35) / .6) * 85, y: 368, airborne: false };
  if (time < 3.85) return cutsceneJump(time, 2.95, 3.85, 390, 368, 525, 408, 72);
  if (time < 4.4) return { x: 525 + cutsceneEase((time - 3.85) / .55) * 95, y: 408, airborne: false };
  if (time < 5.35) return cutsceneJump(time, 4.4, 5.35, 620, 408, 750, 348, 82);
  if (time < 6.35) return { x: 750 + cutsceneEase((time - 5.35) / 1) * 112, y: 348, airborne: false };
  if (time < 7.45) return { x: 862, y: 348, airborne: false, inside: true };
  return { x: 862 - cutsceneEase((time - 7.45) / .9) * 72, y: 348, airborne: false, powered: true };
}

function drawCutsceneSlime(pose, time, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(pose.x + PLAYER_W / 2, pose.y + PLAYER_H / 2);
  if (pose.airborne) ctx.rotate(.08);
  const running = !pose.airborne && time > .8 && time < 6.35;
  const bounce = running ? Math.sin(time * 18) * 1.6 : Math.sin(time * 4) * .6;

  if (pose.powered) {
    const pulse = .7 + Math.sin(time * 9) * .12;
    ctx.shadowColor = "#79f5ff";
    ctx.shadowBlur = 24;
    ctx.strokeStyle = `rgba(121,245,255,${pulse})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 27 + Math.sin(time * 7) * 3, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.scale((34 + bounce * .8) / 34, (31 - bounce * .3) / 31);
  drawGameArt("player", -19, -16, 38, 38);
  ctx.restore();
}

function drawTimeMachine(time, staticIntensity) {
  const x = 825;
  const y = 252;
  const width = 120;
  const height = 138;
  const glow = .55 + Math.sin(time * 7) * .15 + staticIntensity * .25;

  ctx.save();
  ctx.shadowColor = `rgba(91,232,255,${glow})`;
  ctx.shadowBlur = 18 + staticIntensity * 18;
  const frameGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  frameGradient.addColorStop(0, "#d3dae4");
  frameGradient.addColorStop(.42, "#53687a");
  frameGradient.addColorStop(1, "#253546");
  ctx.fillStyle = frameGradient;
  ctx.strokeStyle = "#142233";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(x, y + 24, width, height - 24, 42);
  ctx.fill(); ctx.stroke();

  const portalGradient = ctx.createRadialGradient(x + 60, y + 83, 5, x + 60, y + 83, 42);
  portalGradient.addColorStop(0, `rgba(228,255,255,${.72 + staticIntensity * .2})`);
  portalGradient.addColorStop(.36, "#47dce8");
  portalGradient.addColorStop(.72, "#5367cf");
  portalGradient.addColorStop(1, "#111c45");
  ctx.fillStyle = portalGradient;
  ctx.beginPath(); ctx.ellipse(x + 60, y + 84, 39, 50, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#aafaff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#24364b";
  ctx.strokeStyle = "#101d2c";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(x - 8, y + height - 16, width + 16, 22, 7); ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#e8f5f7";
  ctx.strokeStyle = "#26384d";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(x + 60, y + 18, 21, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#3b63a0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 60, y + 18); ctx.lineTo(x + 60 - Math.sin(time * 2.2) * 11, y + 18 - Math.cos(time * 2.2) * 11);
  ctx.moveTo(x + 60, y + 18); ctx.lineTo(x + 60 + Math.sin(time * 4.4) * 7, y + 18 + Math.cos(time * 4.4) * 7);
  ctx.stroke();
  ctx.fillStyle = "#3b63a0";
  ctx.beginPath(); ctx.arc(x + 60, y + 18, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawTemporalStatic(time, intensity) {
  if (intensity <= 0) return;
  const centerX = 885;
  const centerY = 333;
  ctx.save();
  ctx.lineCap = "round";
  for (let index = 0; index < 18; index++) {
    const angle = index / 18 * Math.PI * 2 + time * (index % 2 ? -.9 : 1.2);
    const radius = 45 + (index % 4) * 13 + Math.sin(time * 13 + index) * 7;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius * .75;
    const length = 5 + index % 3 * 3;
    ctx.strokeStyle = index % 3 === 0 ? `rgba(255,255,255,${intensity})` : `rgba(86,235,255,${intensity * .9})`;
    ctx.lineWidth = 1.5 + index % 2;
    ctx.beginPath();
    ctx.moveTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(215,252,255,${intensity})`;
  ctx.lineWidth = 2.5;
  for (let arc = 0; arc < 4; arc++) {
    const startY = 275 + arc * 32 + Math.sin(time * 19 + arc) * 8;
    ctx.beginPath();
    ctx.moveTo(822, startY);
    for (let step = 1; step <= 6; step++) {
      ctx.lineTo(822 + step * 21, startY + Math.sin(time * 31 + arc * 4 + step * 2) * 12);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawRewindPower(time, pose) {
  if (time < 7.45) return;
  const progress = cutsceneEase((time - 7.45) / 1.25);
  const centerX = pose.x + PLAYER_W / 2;
  const centerY = pose.y + PLAYER_H / 2;

  ctx.save();
  for (let echo = 1; echo <= 4; echo++) {
    drawCutsceneSlime({ ...pose, x: pose.x + echo * 19, powered: false }, time - echo * .08, progress * (.2 - echo * .03));
  }
  ctx.translate(centerX, centerY);
  ctx.strokeStyle = `rgba(126,241,255,${progress})`;
  ctx.fillStyle = `rgba(126,241,255,${progress})`;
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, 46, .35, Math.PI * 1.75); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-43, -15); ctx.lineTo(-52, -4); ctx.lineTo(-36, -2); ctx.closePath(); ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = progress;
  ctx.textAlign = "center";
  ctx.fillStyle = "#9df8ff";
  ctx.shadowColor = "#51dff4";
  ctx.shadowBlur = 18;
  ctx.font = "900 15px Inter, sans-serif";
  ctx.fillText("POWER AWAKENED", VIEW_W / 2, 82);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 44px Inter, sans-serif";
  ctx.fillText("REWIND", VIEW_W / 2, 126);
  ctx.restore();
}

function drawEchoMachine(time, scanIntensity) {
  const x = 382;
  const y = 235;
  const width = 196;
  const height = 225;
  const pulse = .55 + Math.sin(time * 8) * .18;
  ctx.save();

  ctx.fillStyle = "#172848";
  ctx.strokeStyle = "#79e9ff";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(x, y + 28, 34, height - 28, 10); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(x + width - 34, y + 28, 34, height - 28, 10); ctx.fill(); ctx.stroke();

  ctx.strokeStyle = "#304c73";
  ctx.lineWidth = 18;
  ctx.beginPath(); ctx.arc(x + width / 2, y + 58, 80, Math.PI, 0); ctx.stroke();
  ctx.strokeStyle = "#9bf4ff";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x + width / 2, y + 58, 80, Math.PI, 0); ctx.stroke();

  for (let side = 0; side < 2; side++) {
    const coilX = side ? x + width - 17 : x + 17;
    for (let row = 0; row < 5; row++) {
      const coilY = y + 58 + row * 28;
      ctx.fillStyle = row % 2 ? "#53d8ec" : "#ffe17a";
      ctx.globalAlpha = .62 + Math.sin(time * 11 + row + side) * .2;
      ctx.beginPath(); ctx.arc(coilX, coilY, 7, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#0a1730cc";
  ctx.strokeStyle = "#d5fbff";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x + 43, y + 48, width - 86, height - 56, 52); ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#0d1e37";
  ctx.strokeStyle = "#071226";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(x - 13, y + height - 13, width + 26, 24, 7); ctx.fill(); ctx.stroke();

  if (scanIntensity > 0) {
    const scanY = y + 58 + ((time * 105) % 135);
    ctx.shadowColor = "#7ff5ff";
    ctx.shadowBlur = 17;
    ctx.strokeStyle = `rgba(151,249,255,${Math.min(1, scanIntensity * (.7 + pulse * .3))})`;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x + 48, scanY); ctx.lineTo(x + width - 48, scanY); ctx.stroke();
  }
  ctx.restore();
}

function drawEchoCutscene() {
  const time = cutsceneTime;
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  gradient.addColorStop(0, "#07142d");
  gradient.addColorStop(.62, "#19375b");
  gradient.addColorStop(1, "#386376");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.save();
  ctx.globalAlpha = .28;
  ctx.strokeStyle = "#8befff";
  ctx.lineWidth = 1;
  for (let x = 0; x < VIEW_W; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, VIEW_H); ctx.stroke();
  }
  for (let y = 20; y < VIEW_H; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(VIEW_W, y); ctx.stroke();
  }
  ctx.restore();

  drawAssetRectangle("stone", 0, 460, VIEW_W, 80);
  const walking = Math.max(0, Math.min(1, (time - .8) / 2.35));
  const slimeX = time < 3.15 ? 82 + cutsceneEase(walking) * 385 : 467;
  const scanning = Math.max(0, Math.min(1, (time - 3.75) / .65)) * Math.max(0, Math.min(1, (6.45 - time) / .55));
  const duplicateProgress = cutsceneEase((time - 6.35) / 1.05);

  drawEchoMachine(time, scanning);
  drawCutsceneSlime({ x: slimeX, y: 418, airborne: false, powered: scanning > .1 }, time);

  if (time >= 5.25) {
    const trailProgress = Math.max(0, Math.min(1, (time - 5.25) / 1.35));
    for (let copy = 1; copy <= 4; copy++) {
      const alpha = trailProgress * (.2 - copy * .025);
      drawCutsceneSlime({ x: slimeX + copy * 18, y: 418, airborne: false }, time - copy * .09, alpha);
    }
  }

  if (time >= 6.35) {
    const loop = time < 7.4 ? duplicateProgress : (Math.sin((time - 7.4) * 3.5) + 1) / 2;
    ctx.save();
    ctx.filter = "hue-rotate(95deg) saturate(1.35) brightness(1.2)";
    ctx.globalAlpha = duplicateProgress * .82;
    drawCutsceneSlime({ x: 467 + loop * 180, y: 418, airborne: false }, time);
    ctx.restore();
  }

  if (time < 1.55) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, time / .45) * Math.max(0, 1 - (time - 1.12) / .43);
    ctx.fillStyle = "#e8fbff";
    ctx.textAlign = "center";
    ctx.font = "800 18px Inter, sans-serif";
    ctx.fillText("AFTER THE REWIND TESTS...", VIEW_W / 2, 64);
    ctx.restore();
  }
  if (time >= 6.55) {
    const reveal = cutsceneEase((time - 6.55) / .75);
    ctx.save();
    ctx.globalAlpha = reveal;
    ctx.textAlign = "center";
    ctx.fillStyle = "#a7f7ff";
    ctx.shadowColor = "#63e8ff";
    ctx.shadowBlur = 18;
    ctx.font = "900 15px Inter, sans-serif";
    ctx.fillText("NEW ABILITY", VIEW_W / 2, 76);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 44px Inter, sans-serif";
    ctx.fillText("ECHO", VIEW_W / 2, 122);
    ctx.restore();
  }

  const flashDistance = Math.abs(time - 5.4);
  if (flashDistance < .2) {
    ctx.fillStyle = `rgba(224,253,255,${(1 - flashDistance / .2) * .78})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  const fadeIn = Math.max(0, 1 - time / .45);
  const fadeOut = Math.max(0, (time - (ECHO_CUTSCENE_DURATION - .7)) / .7);
  ctx.fillStyle = `rgba(3,8,20,${Math.max(fadeIn, fadeOut)})`;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function drawCutscene(time) {
  const sceneTime = cutsceneTime;
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  gradient.addColorStop(0, "#10183f");
  gradient.addColorStop(.58, "#435887");
  gradient.addColorStop(1, "#d28b72");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.fillStyle = "#ffffffba";
  for (let index = 0; index < 34; index++) {
    const x = (index * 83 + 31) % VIEW_W;
    const y = 48 + (index * 47) % 235;
    const radius = 1 + (index % 3) * .45;
    ctx.globalAlpha = .45 + Math.sin(time * .003 + index) * .25;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#1c2947aa";
  ctx.beginPath(); ctx.moveTo(0, 390);
  for (let x = 0; x <= VIEW_W; x += 80) ctx.lineTo(x, 300 + Math.sin(x * .013) * 55);
  ctx.lineTo(VIEW_W, VIEW_H); ctx.lineTo(0, VIEW_H); ctx.fill();

  const cutscenePlatforms = [
    [0, 460, 220, 90], [280, 410, 165, 140], [500, 450, 160, 100], [720, 390, 240, 160]
  ];
  for (const [x, y, width, height] of cutscenePlatforms) drawAssetRectangle("grass", x, y, width, height);

  const pose = cutsceneSlimePose(sceneTime);
  if (pose.powered) drawRewindPower(sceneTime, pose);
  const staticStart = Math.max(0, Math.min(1, (sceneTime - 5.85) / .65));
  const staticEnd = sceneTime > 7.45 ? Math.max(0, 1 - (sceneTime - 7.45) / 1.2) : 1;
  const staticIntensity = staticStart * staticEnd;
  const insideAlpha = pose.inside ? .72 + Math.sin(sceneTime * 35) * .25 : 1;
  if (!pose.powered) drawCutsceneSlime(pose, sceneTime, insideAlpha);
  drawTimeMachine(sceneTime, staticIntensity);
  drawTemporalStatic(sceneTime, staticIntensity);
  if (pose.powered) drawCutsceneSlime(pose, sceneTime);

  if (sceneTime < 1.4) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, sceneTime / .5) * Math.max(0, 1 - (sceneTime - 1) / .4);
    ctx.fillStyle = "#eaf9ff";
    ctx.textAlign = "center";
    ctx.font = "800 18px Inter, sans-serif";
    ctx.fillText("BEYOND THE LAST SUMMIT...", VIEW_W / 2, 64);
    ctx.restore();
  }

  const zapDistance = Math.abs(sceneTime - 6.72);
  if (zapDistance < .24) {
    ctx.fillStyle = `rgba(230,253,255,${(1 - zapDistance / .24) * .9})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

  const fadeIn = Math.max(0, 1 - sceneTime / .45);
  const fadeOut = Math.max(0, (sceneTime - (CUTSCENE_DURATION - .75)) / .75);
  ctx.fillStyle = `rgba(4,8,22,${Math.max(fadeIn, fadeOut)})`;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = "#02040b";
  ctx.fillRect(0, 0, VIEW_W, 24);
  ctx.fillRect(0, VIEW_H - 24, VIEW_W, 24);
}

function drawRewindPathPreview(time) {
  if (!currentLevel().rewindTutorial) return;
  const platforms = previewedTimelineObjects();
  const fieldAnchor = rewindFieldAnchor();
  const field = rewindFieldPreview || (levelUsesRewindField() ? {
    x: fieldAnchor.x,
    y: fieldAnchor.y,
    radius: currentLevel().rewindFieldRadius || 340,
    idle: true
  } : null);
  if (platforms.length === 0 && !field) return;

  ctx.save();
  if (platforms.length > 0) {
    ctx.fillStyle = "rgba(48, 35, 8, .1)";
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  ctx.translate(-cameraX, 0);
  if (field) {
    const pulse = (Math.sin(time * .008) + 1) * .5;
    const gradient = ctx.createRadialGradient(
      field.x, field.y, field.radius * .2,
      field.x, field.y, field.radius
    );
    gradient.addColorStop(0, field.idle ? "rgba(255, 222, 92, .025)" : "rgba(255, 222, 92, .08)");
    gradient.addColorStop(1, "rgba(255, 211, 77, .01)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(field.x, field.y, field.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = field.idle
      ? `rgba(255, 220, 91, ${.18 + pulse * .06})`
      : `rgba(255, 220, 91, ${.62 + pulse * .22})`;
    ctx.lineWidth = field.idle ? 2 : 3;
    ctx.setLineDash([10, 9]);
    ctx.lineDashOffset = -time * .03;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  platforms.forEach((platform) => {
    const history = platform.motionHistory;
    const selected = history.slice(Math.min(platform.previewCursor, platform.previewLatest), platform.previewLatest + 1);
    if (selected.length < 2) return;
    if (platform.rewindableState) {
      const restoredState = selected[0];
      if (restoredState.broken === false) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 224, 93, .95)";
        ctx.fillStyle = "rgba(255, 211, 77, .16)";
        ctx.lineWidth = 3;
        ctx.setLineDash([9, 7]);
        ctx.lineDashOffset = platform.previewPaused ? 0 : -time * .03;
        ctx.beginPath();
        ctx.roundRect(restoredState.x, restoredState.y, platform.w, platform.h, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }
    if (platform.rewindableEnemy && !platform.alive && selected[0].alive) {
      const restoredState = selected[0];
      ctx.save();
      ctx.globalAlpha = .62;
      ctx.strokeStyle = "#ffe05d";
      ctx.lineWidth = 3;
      ctx.setLineDash([7, 6]);
      drawGameArt("enemy", restoredState.x - 4, restoredState.y + 2, 38, 38);
      ctx.beginPath();
      ctx.roundRect(restoredState.x - 2, restoredState.y + 8, platform.w + 4, platform.h - 8, 9);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    ctx.strokeStyle = "rgba(255, 211, 77, .82)";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ffd34d";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    selected.forEach((point, index) => {
      const x = point.x + platform.w / 2;
      const y = point.y + platform.h / 2;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#fff0a3";
    ctx.shadowBlur = 7;
    const spacing = Math.max(2, Math.floor(selected.length / 7));
    const phase = platform.previewPaused ? 0 : Math.floor(time / 90) % spacing;
    for (let index = phase + 1; index < selected.length - 1; index += spacing) {
      const point = selected[index];
      if (platform.previewPaused) {
        ctx.beginPath();
        ctx.arc(point.x + platform.w / 2, point.y + platform.h / 2, 4, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      const neighbor = input.forwardTime ? selected[index + 1] : selected[index - 1];
      const angle = Math.atan2(neighbor.y - point.y, neighbor.x - point.x);
      ctx.save();
      ctx.translate(point.x + platform.w / 2, point.y + platform.h / 2);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(-6, -6);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-6, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  });
  ctx.restore();
}

function drawRewindTutorialPrompt(time) {
  const buttons = rewindPromptButtons();
  if (buttons.length === 0) return;
  const platform = tutorialRewindPlatform();
  const pulse = (Math.sin(time * .008) + 1) * .5;
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "900 13px Inter, sans-serif";
  buttons.forEach((button, index) => {
    const active = platform.timelinePreview && !platform.previewPaused &&
      (index === 1 ? input.forwardTime : !input.forwardTime);
    ctx.fillStyle = active ? "rgba(72, 52, 7, .94)" : "rgba(6, 20, 43, .88)";
    ctx.strokeStyle = active ? `rgba(255,211,77,${.78 + pulse * .22})` : "rgba(255,255,255,.28)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(button.x, button.y, button.w, button.h, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active || buttons.length === 1 ? "#ffe05d" : "#dbeaf7";
    ctx.fillText(button.label, button.x + button.w / 2, button.y + 22);
  });
  ctx.restore();
}

function drawEchoTutorialPrompt(time) {
  const buttons = echoPromptButtons();
  if (buttons.length === 0) return;
  const pulse = (Math.sin(time * .008) + 1) * .5;
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "900 13px Inter, sans-serif";
  buttons.forEach((button) => {
    const recording = button.kind === "record" && Boolean(echoRecording);
    const previewing = button.kind === "record" && Boolean(echoPreview);
    const active = recording || previewing;
    ctx.fillStyle = previewing ? "rgba(72, 52, 7, .94)" : recording ? "rgba(20, 78, 89, .96)" : "rgba(6, 20, 43, .88)";
    ctx.strokeStyle = previewing ? `rgba(255,211,77,${.78 + pulse * .22})` : recording ? `rgba(119,232,255,${.78 + pulse * .22})` : "rgba(255,255,255,.28)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(button.x, button.y, button.w, button.h, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = previewing ? "#ffe05d" : active ? "#c0fff5" : "#dbeaf7";
    ctx.fillText(button.label, button.x + button.w / 2, button.y + 22);
  });
  ctx.restore();
}

function render(time) {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  if (cutsceneActive) {
    if (cutsceneKind === "echo") drawEchoCutscene();
    else drawCutscene(time);
    return;
  }
  drawBackground();
  drawRewindPathPreview(time);
  for (const p of currentLevel().platforms) drawPlatform(p, time);
  for (const levelSwitch of currentLevel().switches || []) drawSwitch(levelSwitch, time);
  for (const plate of currentLevel().pressurePlates || []) drawPressurePlate(plate);
  for (const pad of currentLevel().jumpPads || []) drawJumpPad(pad, time);
  for (const h of currentLevel().hazards) drawHazard(resolvedHazard(h), time);
  drawEchoRoutePreview(time);
  drawEnemies(time);
  drawEcho(time);
  currentLevel().stars.forEach(([x, y], i) => drawStar(x, y, i, time));
  drawEnemyStars(time);
  drawFlag(currentLevel().finish);
  drawBlockDebris();
  drawLandingParticles();
  drawEnemyDeathParticles();
  if (deathTimer > 0) drawDeathParticles();
  else drawPlayer(time);
  drawRewindTutorialPrompt(time);
  drawEchoTutorialPrompt(time);
  if (levelTransition > 0) {
    ctx.fillStyle = `rgba(255,255,255,${Math.sin((.65 - levelTransition) / .65 * Math.PI) * .65})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
}

function frame(time) {
  accumulator += Math.min(.05, (time - lastTime) / 1000);
  lastTime = time;
  while (accumulator >= STEP) { update(STEP); accumulator -= STEP; }
  updateMenuAnimation(time);
  updateTimerHud();
  render(time);
  requestAnimationFrame(frame);
}

applyRewindMenuState();
populateSpecificLevelChoices();
populateLeaderboardVersions();
loadLevel(0, false);
initializeAccounts();
requestAnimationFrame(frame);
