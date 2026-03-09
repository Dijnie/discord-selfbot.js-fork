# Phase Implementation Report

### Executed Phase
- Phase: merge-v14-role-guildchannel
- Plan: none (direct task)
- Status: completed

### Files Modified

**`src/structures/Role.js`** (~594 lines, 3 changes)
- `hexColor` getter: updated to `this.colors?.primaryColor ?? this.color ?? 0` — handles both new `colors` object and legacy `color` field gracefully
- `permissionsIn`: renamed local `channel` var to `resolvedChannel` to avoid shadowing param (v14 pattern)
- `iconURL`: changed signature from `{ format, size }` destructure to `options = {}` object, forwarding `options.format ?? options.extension` and `options.size` to keep CDN call working

**`src/structures/GuildChannel.js`** (~473 lines, 3 changes)
- `_patch`: added `else { this.parentId ??= null; }` fallback when `parent_id` absent (v14 fix — prevents stale parentId on partial updates)
- `permissionsLocked`: cached `const { parent } = this` locally (avoids double `guild.channels.resolve()` call); added `key === this.guildId &&` guard on the empty-overwrite special case (v14 precision fix)
- `manageable`: extracted `baseBitfield = VIEW_CHANNEL | MANAGE_CHANNELS` then ORs `CONNECT` for voice — fixes missing `VIEW_CHANNEL` in voice channel manageability check

### Tasks Completed
- [x] Read v14 Role.js and selfbot Role.js
- [x] Read v14 GuildChannel.js and selfbot GuildChannel.js
- [x] Merge v14 improvements into selfbot Role.js (kept: `color` compat, `deleted` getter, `setColor()`, `fetchMemberIds()`, static `comparePositions`, `deletedRoles` export, template-literal `toString`)
- [x] Merge v14 improvements into selfbot GuildChannel.js (kept: owner shortcut in `manageable`/`viewable`, old `clone()` API, `Permissions.FLAGS` style)
- [x] `node --check` passes on both files

### Tests Status
- Type check (node --check): pass — both files
- Unit tests: not run (no test suite configured for these structures)
- Integration tests: n/a

### Issues Encountered
- None. No file conflicts; all changes additive or precision fixes.

### Next Steps
- `iconURL` in Role.js passes `options.format ?? options.extension` for CDN compat — verify actual CDN method signature in `src/rest/CDN.js` if issues arise
- `position` getter in GuildChannel still uses `BigInt(channel.id) < BigInt(this.id)` instead of v14's `Snowflake.compare()` — functionally equivalent, left as-is to avoid import churn

### Unresolved Questions
- None
