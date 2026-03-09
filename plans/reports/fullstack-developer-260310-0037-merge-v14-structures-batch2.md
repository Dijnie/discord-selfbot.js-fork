## Phase Implementation Report

### Executed Phase
- Phase: merge-v14-structures-batch2
- Plan: none (direct task)
- Status: completed

### Files Modified

1. `src/structures/VoiceState.js` - 355 lines
2. `src/structures/MessageMentions.js` - 270 lines
3. `src/structures/MessageReaction.js` - 195 lines
4. `src/structures/PermissionOverwrites.js` - no changes needed (already uses `'field' in data`)
5. `src/structures/GuildPreview.js` - 192 lines
6. `src/structures/GuildTemplate.js` - 250 lines
7. `src/structures/Integration.js` - 220 lines
8. `src/structures/IntegrationApplication.js` - 80 lines

### Tasks Completed

- [x] **VoiceState.js**
  - Fixed `suppress` else branch (`??= null`)
  - Added `edit(options)` method with unified stage voice editing logic
  - Refactored `setRequestToSpeak()` to delegate to `edit()`
  - Refactored `setSuppressed()` to delegate to `edit()`
  - Added `VoiceStateEditOptions` typedef
  - Kept selfbot-specific `user` getter, `setStatus()`, `getPreview()`, `postPreview()`

- [x] **MessageMentions.js**
  - Moved static patterns from post-class assignment to static class fields
  - Fixed `members` getter to use `for...of` instead of `.forEach()`
  - Cleaned up crosspostedChannels loop variable naming
  - Removed redundant post-class static assignments

- [x] **MessageReaction.js**
  - Added `react()` method (delegate to `message.react(this.emoji)`)
  - Added `valueOf()` method returning emoji id or name

- [x] **PermissionOverwrites.js** - already correctly uses `'field' in data` pattern, no changes needed

- [x] **GuildPreview.js**
  - Fixed emojis initialization order: check `if (this.emojis)` first, then else create (matches v14)

- [x] **GuildTemplate.js**
  - Added `GuildTemplatesPattern` static class field (with named capture group `code`)
  - Changed `createdAt`/`updatedAt` from stored Date objects to `createdTimestamp`/`updatedTimestamp` (timestamps via `Date.parse`)
  - Added `createdAt`/`updatedAt` as readonly getters returning `new Date()`
  - Kept old `GUILD_TEMPLATES_PATTERN` static at bottom for backward compat

- [x] **Integration.js**
  - Changed `enabled` to `data.enabled ?? null`
  - Added `'syncing' in data` guard with else branch
  - Changed `guild.roles.cache.get()` to `guild.roles.resolve()` for role
  - Added `'synced_at' in data` guard, stored as `syncedTimestamp` via `Date.parse`
  - Added `syncedAt` readonly getter returning `new Date(syncedTimestamp)`
  - Changed `this.user = null` to `this.user ??= null`
  - Added else branches to `_patch`: `expireBehavior ??= null`, `expireGracePeriod ??= null`
  - Added `scopes` field in `_patch` with `'scopes' in data` guard

- [x] **IntegrationApplication.js**
  - Removed `summary` field (no longer sent by API)
  - Removed `hook` field (no longer sent by API)

### Tests Status
- node --check: all 8 files PASS

### Issues Encountered
- None

### Next Steps
- `GuildTemplate.GUILD_TEMPLATES_PATTERN` (old pattern) and `GuildTemplate.GuildTemplatesPattern` (new) both exist; callers using old pattern still work
- `VoiceState.setRequestToSpeak`/`setSuppressed` now delegate through `edit()` which uses selfbot's `this.client.api` (not `client.rest`) — consistent with rest of selfbot codebase

### Unresolved Questions
- None
