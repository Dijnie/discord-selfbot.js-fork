## Phase Implementation Report

### Executed Phase
- Phase: merge-v14-guildmember
- Plan: none (direct task)
- Status: completed

### Files Modified
- `src/structures/GuildMember.js` — +9 lines added to `_patch()` method

### Tasks Completed
- [x] Read both files completely (v14 source + selfbot target)
- [x] Compared all methods/properties/getters between v14 and selfbot
- [x] Added `joinedTimestamp ??= null` fallback in `_patch()` when `joined_at` not in data
- [x] Expanded bare `if ('joined_at' in data)` one-liner into block with JSDoc comment
- [x] Added `data.joined_at &&` guard (matches v14 pattern: null-safe timestamp parse)
- [x] Verified all existing selfbot-specific code preserved
- [x] Ran `node --check` — passes

### Diff Summary

**Before (line 103):**
```js
if ('joined_at' in data) this.joinedTimestamp = new Date(data.joined_at).getTime();
```

**After (lines 103-111):**
```js
if ('joined_at' in data) {
  /**
   * The timestamp the member joined the guild at
   * @type {?number}
   */
  this.joinedTimestamp = data.joined_at && new Date(data.joined_at).getTime();
} else {
  this.joinedTimestamp ??= null;
}
```

### Items Evaluated but Kept Unchanged

| Item | Decision | Reason |
|------|----------|--------|
| `toString()` returns `<@!id>` | Keep selfbot | Selfbot-specific mention format |
| CDN methods `GuildMemberAvatar`, `AvatarDecoration` | Keep selfbot | Selfbot uses PascalCase CDN API |
| `manageable` — owner shortcut | Keep selfbot | Selfbot needs `this.client.user.id === this.guild.ownerId` check |
| `kickable`/`bannable`/`moderatable` using `Permissions.FLAGS` | Keep selfbot | Selfbot uses v13 Permissions API |
| `equals()` uses `this.flags.equals()` | Keep selfbot | More robust than v14's bitfield comparison |
| `edit()`, `kick()`, `ban()` etc. — sync vs async | Keep selfbot | Selfbot style is sync |
| `send()` via `TextBasedChannel.applyToClass` | Keep selfbot | Selfbot mixin architecture |
| `setAvatar()`, `setBanner()`, `setAboutMe()` | Keep selfbot | Selfbot-exclusive methods |
| `deleted` getter/setter | Keep selfbot | Backward compat deprecation shim |
| `_roles` as plain property | Keep selfbot | Simpler; `Object.defineProperty` not needed |

### Tests Status
- Type check: pass (`node --check` clean)
- Unit tests: not applicable (no test suite for this file)
- Integration tests: n/a

### Issues Encountered
None.

### Next Steps
- None required. Change is minimal and targeted.
