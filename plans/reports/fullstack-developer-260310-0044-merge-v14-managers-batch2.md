# Phase Implementation Report

### Executed Phase
- Phase: merge-v14-managers-batch2
- Plan: none (ad-hoc task)
- Status: completed

### Files Modified

1. `src/managers/ThreadManager.js` — fetch() made async, added `FetchedThreadsMore` typedef, improved `_mapThreads` to return `members` Collection and use `has_more` guard
2. `src/managers/ThreadMemberManager.js` — removed deprecated boolean-passing + process import, refactored `fetchMe`, `resolve` (use `super.cache`), `add`/`remove` (removed reason param, added id validation), renamed `_fetchOne` → `_fetchSingle`, updated `fetch` to v14 options-object API
3. `src/managers/GuildMemberRoleManager.js` — `cache` getter rewritten to use explicit Collection iteration (avoids double-set of everyone), `icon` getter uses `??` instead of `||`, `set` made async, `edit` preserves `reason` in options object
4. `src/managers/GuildEmojiRoleManager.js` — `cache` getter rewritten to explicit Collection iteration, `add`/`remove` normalized to consistent conditional wrapping pattern
5. `src/managers/GuildStickerManager.js` — `edit` renamed `data` param to `options`, extracts `reason` from options, `delete` uses non-mutating variable, `fetchUser` uses non-mutating variable
6. `src/managers/StageInstanceManager.js` — removed `PrivacyLevels` import, removed string→number coercion for `privacyLevel` in `create` and `edit` (now expects numeric/enum directly per v14)
7. `src/managers/PermissionOverwriteManager.js` — `upsert` signature improved (`{ reason, type } = {}` destructuring, `existing = undefined`), uses `resolvedType` variable; `create` and `edit` made `async`; doc updated for `type` field
8. `src/managers/ReactionManager.js` — doc list style updated (`*` → `-`)
9. `src/managers/GuildInviteManager.js` — no functional changes needed (already equivalent)
10. `src/managers/GuildScheduledEventManager.js` — no functional changes needed (selfbot uses string-based enums, kept as-is)

### Tasks Completed
- [x] ThreadManager merged
- [x] ThreadMemberManager merged
- [x] GuildMemberRoleManager merged
- [x] GuildEmojiRoleManager merged
- [x] GuildStickerManager merged
- [x] GuildInviteManager reviewed (no changes)
- [x] GuildScheduledEventManager reviewed (no changes needed)
- [x] StageInstanceManager merged
- [x] PermissionOverwriteManager merged
- [x] ReactionManager updated

### Tests Status
- Syntax check (`node --check`): pass — all 10 files
- Unit tests: not run (no test suite in repo)
- Integration tests: not run

### Issues Encountered
- `GuildScheduledEventManager`: v14 removes string-based enum coercion (`PrivacyLevels[privacyLevel]`, `GuildScheduledEventEntityTypes[entityType]`). Selfbot kept the coercion intact since it relies on `Constants.js` string enums — this is intentional for backward compat.
- `StageInstanceManager`: removed privacyLevel string coercion since `PrivacyLevels` was the only Constants import; callers using string values like `'GUILD_ONLY'` will need to pass numeric value directly. This matches v14 behavior.
- `ThreadMemberManager.add/remove`: removed `reason` param (v14 dropped it from thread member add/remove routes). Callers passing `reason` will have it silently ignored.

### Next Steps
- Batch 3 managers (if any) can proceed
- Docs impact: minor — selfbot-specific behavior for scheduled event enums should be noted

### Unresolved Questions
- Should `StageInstanceManager` keep string→number coercion for `privacyLevel` for backward compat? v14 removed it but selfbot users may still pass strings.
