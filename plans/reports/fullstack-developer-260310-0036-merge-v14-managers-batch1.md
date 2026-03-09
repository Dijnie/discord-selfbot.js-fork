# Merge v14 Managers — Batch 1 Report

**Date:** 2026-03-10
**Status:** completed

---

## Files Modified

| File | Lines (approx) | Actions |
|------|---------------|---------|
| `src/managers/MessageManager.js` | +70 | Added `fetchPins()`, fixed `fetchPollAnswerVoters`, added typedefs |
| `src/managers/RoleManager.js` | +30 | Updated `fetch()` single-role support, `fetchMemberCounts` returns `Collection`, updated `edit()` signature |
| `src/managers/GuildBanManager.js` | ~1 | Fixed `bulkCreate` body field `delete_message_days` → `delete_message_seconds` |
| `src/managers/GuildEmojiManager.js` | +85 | Added `resolve`/`resolveId`/`resolveIdentifier` overrides for `ApplicationEmoji`, updated `fetchAuthor` permission check |
| `src/managers/UserManager.js` | 0 | No material changes needed — selfbot API patterns and DM logic already correct |

---

## Per-File Detail

### MessageManager.js

**ADDED:**
- `fetchPins(options)` — paginated pinned messages API returning `{ items, hasMore }` (v14 method name vs selfbot's `fetchPinned`)
- `FetchPinnedMessagesOptions`, `FetchPinnedMessagesResponse`, `MessagePin` typedefs from v14
- Fixed `fetchPollAnswerVoters` — was using `this.client.channels(...)` (wrong), corrected to `this.client.api.channels(...).polls(...).answers(...).get()`

**KEPT:**
- `fetchPinned(cache)` — selfbot original returning flat `Collection<Snowflake, Message>`
- `search()` — selfbot-specific guild/channel message search
- `_fetchId()` — selfbot fetch-around workaround
- `crosspost()` — selfbot method
- `react()` with `burst` param — selfbot Super Reactions support
- All selfbot REST patterns (`this.client.api...`)
- Upload URL / file attachment flow in `edit()`

**NOT APPLIED from v14:**
- `_fetchSingle`/`_fetchMany` refactor using `Routes.*` — kept selfbot patterns

---

### RoleManager.js

**ADDED/UPDATED:**
- `fetch(id)` — now attempts to fetch single role by ID first (with try/catch fallback to full list), instead of always fetching all roles
- `fetchMemberCounts()` — now returns `Collection<Snowflake, number>` (wraps `Object.entries`) instead of raw object
- `fetchMemberIds(role)` — kept (selfbot-specific, not in base v14)
- `edit(role, options, reason)` — updated signature from `(role, data, reason)` to `(role, options, reason)` with `options.reason` priority; maintains backward compatibility via `resolvedReason = options?.reason ?? reason`

**KEPT:**
- `setPosition()` using `Util.setPosition` with selfbot `route.patch()` API
- `setPositions()` using selfbot API
- `create()` with `color` deprecation warning
- All selfbot `this.client.api.*` patterns
- `deprecationEmittedForCreate` / `deprecationEmittedForEdit` deprecation flags

---

### GuildBanManager.js

**FIXED:**
- `bulkCreate()`: body field was `delete_message_days` (wrong) → `delete_message_seconds` (matches v14 and the `BulkBanOptions` typedef)

**KEPT:**
- `create()` with `days` deprecation warning and return value (GuildMember/User/Snowflake)
- `remove()` returning resolved User
- All selfbot `this.client.api.*` patterns
- `deprecationEmittedForDays` flag

---

### GuildEmojiManager.js

**ADDED from v14:**
- `resolve(emoji)` override — adds `ApplicationEmoji` support alongside existing `ReactionEmoji`
- `resolveId(emoji)` override — adds `ApplicationEmoji` support
- `resolveIdentifier(emoji)` override — adds `ApplicationEmoji` support, migrated improved identifier logic from v14
- Updated typedef `EmojiResolvable` to include `ApplicationEmoji`
- New imports: `ApplicationEmoji`, `ReactionEmoji`, `parseEmoji`
- `fetchAuthor()` — updated permission check to `any([CREATE_GUILD_EXPRESSIONS, MANAGE_EMOJIS_AND_STICKERS])` (v14 broadened the check)

**KEPT:**
- Inherits `BaseGuildEmojiManager` (selfbot pattern, different from v14 `CachedManager` direct)
- `create(attachment, name, options)` — selfbot positional param signature
- All selfbot `this.client.api.*` patterns
- `Collection` import (used in `create()` roles validation)

---

### UserManager.js

**NO CHANGES** — selfbot implementation already functionally correct:
- `dmChannel()` uses `c.type === 'DM' && c.recipient.id` (selfbot DMChannel has `type = 'DM'` string, no `recipientId`)
- `createDM()` uses selfbot-specific `recipients: [id]` body + `dm_channel.sync()` — selfbot-specific behavior preserved
- `fetch()`, `resolve()`, `resolveId()` identical between v13 selfbot and v14

---

## Syntax Check

```
node --check src/managers/MessageManager.js  → OK
node --check src/managers/RoleManager.js     → OK
node --check src/managers/GuildBanManager.js → OK
node --check src/managers/GuildEmojiManager.js → OK
node --check src/managers/UserManager.js     → OK
```

---

## Unresolved Questions

- `fetchPinned` (flat Collection) vs `fetchPins` (paginated) — both now exist; callers should migrate to `fetchPins` eventually but both are kept for backward compat. Should `fetchPinned` be deprecated?
- `RoleManager.fetch(id)` try/catch fallback — if Discord API ever returns 200 for single role fetch on selfbot, the fallback path becomes dead code. Acceptable for now.
- `bulkCreate` in GuildBanManager has deprecation note in selfbot source ("will not be usable until effective MFA implementation"). Still updated the field name for correctness.
