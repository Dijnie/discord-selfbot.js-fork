# Phase Implementation Report

### Executed Phase
- Phase: merge-v14-structures-batch3
- Plan: none (direct task)
- Status: completed

### Files Modified
- `src/structures/ApplicationCommand.js` — added `nsfw`, `integrationTypes`, `contexts`, `handler` fields in constructor + `_patch`; added `nsfw` check in `equals()`
- `src/structures/Emoji.js` — added `imageURL()` method (alongside existing `url` getter, kept for selfbot compat)
- `src/structures/ClientPresence.js` — fixed `_parse` bug: `since` now uses parameter value (not `this.since`), `afk` defaults to `false` (not `this.afk`)
- `src/structures/InteractionCollector.js` — added `message.channelId`/`message.guildId` resolution paths; changed `endReason` to return `super.endReason` instead of `null`
- `src/structures/InteractionWebhook.js` — added `async` to `send()`/`fetchMessage()`/`editMessage()` stubs; added JSDoc for `fetchMessage` and `editMessage`
- `src/structures/WelcomeChannel.js` — updated `channel` getter to use `channels.resolve()`; updated `emoji` getter to check `guild.emojis.cache` before `client.emojis.cache`

### Files with No Changes (identical logic or selfbot keeps its own approach)
- `ApplicationRoleConnectionMetadata.js` — selfbot uses string type mapping; v14 uses raw; no functional gap
- `AnonymousGuild.js` — selfbot uses string enums (VerificationLevels/NSFWLevels); kept as-is
- `BaseGuild.js` — selfbot uses own API fetch pattern; kept as-is
- `BaseGuildEmoji.js` — v14 only adds JSDoc comments; no logic diff
- `ClientUser.js` — selfbot has significantly more selfbot-specific methods; v14 has fewer; selfbot is superset
- `GuildAuditLogs.js` — selfbot already has more targets/actions than v14; structure is selfbot-extended
- `GuildPreviewEmoji.js` — identical logic
- `InviteGuild.js` — minor style diff only (`undefined` vs `typeof`); no functional gap
- `OAuth2Guild.js` — identical logic (Permissions class is selfbot's wrapper)
- `WelcomeScreen.js` — selfbot uses `'WELCOME_SCREEN_ENABLED'` string; v14 uses `GuildFeature.WelcomeScreenEnabled`; kept selfbot string for compat

### Tasks Completed
- [x] Read all 15 v14 source files
- [x] Read all 15 selfbot source files
- [x] Diff and identify meaningful additions
- [x] Merge `nsfw`, `integrationTypes`, `contexts`, `handler` into ApplicationCommand
- [x] Add `imageURL()` to Emoji
- [x] Fix `ClientPresence._parse` since/afk defaults
- [x] Fix `InteractionCollector` channelId/guildId resolution + endReason
- [x] Improve `InteractionWebhook` stubs (async + JSDoc)
- [x] Fix `WelcomeChannel` channel/emoji getters
- [x] Run `node --check` on all modified files

### Tests Status
- Syntax check (`node --check`): pass — all 6 modified files
- Unit tests: not run (no test runner available in scope)

### Issues Encountered
- None

### Next Steps
- None required; all changes are additive/non-breaking
