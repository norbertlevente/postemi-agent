# Changelog

All notable changes to the Postemi CLI (npm `postemi`) are listed here.

## 1.0.1

- The source moved to its own repository,
  https://github.com/norbertlevente/postemi-agent. `repository`, `bugs` and the
  plugin manifests point there; the Claude Code marketplace is now
  `norbertlevente/postemi-agent` (`claude plugin install postemi-cli@postemi-agent`).
- The CLI reads `POSTEMI_*` environment variables only.
- No change to the commands, their flags or their output.

## 1.0.0

- First release of the Postemi CLI, command `postemi`: posts, integrations,
  analytics, uploads and upload links, workspaces, billing (plans Basic, Pro,
  Creator and Team; a Stripe Checkout link the person pays themselves),
  settings, `auth:login` (device flow on postemi.com/app/device),
  `auth:signup`, `auth:status` and `auth:logout`.
- Talks to `https://api.postemi.com`; stores credentials and settings in
  `~/.postemi`.
