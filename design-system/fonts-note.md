# Fonts

The original Claude-Design folder shipped self-hosted Inter (302 files, ~114 MB) in `fonts/`. That directory is **intentionally excluded** from this repo snapshot because:

1. The app loads Inter + JetBrains Mono from Google Fonts via `app/globals.css` (`@import url('https://fonts.googleapis.com/css2?family=Inter:...&family=JetBrains+Mono:...')`). The self-hosted files are redundant in production.
2. At 114 MB, committing them would bloat the repo far out of proportion to their use (they exist for offline skill-workspace prototyping).

If you need the self-hosted files for an offline preview or Claude-Design skill invocation, they remain in the original folder: `/Users/chrismccann/Dropbox (Personal)/Mac/Downloads/Latent Coffee Design System/fonts/`.

If that Dropbox folder ever goes away, the Inter + JetBrains Mono webfont CSS + WOFF2 files can be regenerated from [Google Fonts](https://fonts.google.com/) or [rsms/inter](https://github.com/rsms/inter) + [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono).
