## Phase Implementation Report

### Executed Phase
- Phase: merge-v14-remaining (batch)
- Plan: none (direct task)
- Status: completed

### Files Modified

**Structures (changes from v14.16.3):**
- `src/structures/ThreadMember.js` — Added `flags = null` init, `partial` getter, fixed `joinedTimestamp` to use `Date.parse()`, `joinedAt` uses `&&` pattern
- `src/structures/VoiceRegion.js` — Removed deprecated `vip` property (no longer sent by API)
- `src/structures/Widget.js` — Added `imageURL(style)` method
- `src/structures/TeamMember.js` — Reordered `_patch` to match v14 order, removed deprecated `permissions` field

**Utils:**
- `src/util/LimitedCollection.js` — Improved `set()`: when `maxSize === 0`, honors `keepOverLimit` before rejecting
- `src/util/Sweepers.js` — Added `sweepEntitlements()`, fixed `isText()` → `isTextBased()` in `sweepMessages`/`sweepReactions`, added `default: break` to switch, added `guild.available` guard in `_sweepGuildDirectProp`

**Managers:**
- `src/managers/PresenceManager.js` — Fixed `resolve()` to use `super.cache.get()` (avoids infinite recursion risk)
- `src/managers/VoiceStateManager.js` — Removed redundant `guild.id` null guard in `fetch()`
- `src/managers/ApplicationCommandManager.js` — Added `_fetchSingle`/`_fetchMany` helpers, refactored `fetch()` to accept object options, fixed `defaultMemberPermissions` null check (`!== null` → `=== null`), added `nsfw`, `integration_types`, `contexts`, `handler` to `transformCommand`
- `src/managers/ApplicationCommandPermissionsManager.js` — Fixed `permissionsPath()` for no-commandId case, added `channels` parameter to `remove()`, added `permissionType` to `has()`, improved logic

**No changes needed (identical logic, only selfbot-specific code present):**
- `src/structures/Base.js` — v14 only changed export style (named vs default)
- `src/structures/MessagePayload.js` — Selfbot version has significant extensions (forward, activity, poll) that supersede v14
- `src/structures/Typing.js` — Identical logic
- `src/structures/WidgetMember.js` — Identical logic
- `src/structures/ReactionEmoji.js` — Identical logic
- `src/structures/TextInputComponent.js` — Selfbot uses BaseMessageComponent inheritance (selfbot-specific); v14 uses Component base
- `src/structures/DirectoryChannel.js` — Selfbot extends Channel (correct for v13-style); v14 has BaseChannel
- `src/util/BitField.js` — Already had v14 aliases (FLAGS/Flags, defaultBit/DefaultBit) from previous migration
- `src/util/DataResolver.js` — Already modernized (uses `fs/promises`, etc.)
- `src/util/Options.js` — Selfbot has extensive custom options (captcha, TOTPKey, ws properties) that differ from v14
- `src/managers/BaseManager.js` — Identical logic
- `src/managers/CachedManager.js` — Already updated (uses `_cleanupSymbol`)
- `src/managers/DataManager.js` — Identical logic
- `src/managers/ChannelManager.js` — Selfbot has `createGroupDM()` selfbot feature; uses `client.api` not REST routes
- `src/managers/ReactionUserManager.js` — Selfbot uses `client.api` style; same logic

### Tasks Completed
- [x] Merge 12 structure files
- [x] Merge 5 util files
- [x] Merge 6+ manager files (including permissions)
- [x] Keep all selfbot-specific code intact
- [x] Keep selfbot import paths
- [x] Add new v14 methods/properties
- [x] Update shared methods with v14 improvements
- [x] Run `node --check` on all modified files

### Tests Status
- Type check: pass (node --check all files)
- Runtime check: pass (BitField, LimitedCollection instantiation verified)
- Unit tests: not run (no test suite configured for this project)

### Issues Encountered
None. All files compiled cleanly.

### Key v14 Improvements Applied
1. `ThreadMember.partial` getter — enables partial detection without type checks
2. `Sweepers.sweepEntitlements()` — new v14 sweeper for entitlements cache
3. `Sweepers._sweepGuildDirectProp` — skips unavailable guilds (prevents errors on uninitalized caches)
4. `Sweepers` switch — added `default: break` (cleaner case fallthrough)
5. `isTextBased()` — v14 uses `isTextBased()` instead of `isText()` for channel type checks
6. `LimitedCollection.set` — `maxSize=0` now respects `keepOverLimit` before blocking
7. `ApplicationCommandManager.transformCommand` — added `nsfw`, `integration_types`, `contexts`, `handler` fields
8. `ApplicationCommandManager.fetch` — accepts unified options object (v14 API style)
9. `ApplicationCommandPermissionsManager.remove` — added `channels` filter type
10. `ApplicationCommandPermissionsManager.has` — added `permissionType` for disambiguation

### Next Steps
- None required. All files pass syntax checks.
