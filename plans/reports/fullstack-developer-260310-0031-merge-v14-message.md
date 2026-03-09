# Merge Report: v14.16.3 Message.js → Selfbot

**Date:** 2026-03-10
**File:** `src/structures/Message.js`
**Status:** Completed

---

## Files Modified

- `src/structures/Message.js` (+8 lines net; targeted edits)

---

## Changes Made

### Imports Updated
- Added `UndeletableMessageTypes` to destructured import from `../util/Constants`

### `_patch()` Improvements
- **`edited_timestamp` check**: Changed `if (data.edited_timestamp)` → `if ('edited_timestamp' in data)` to match v14's `'field' in data` pattern. This correctly handles the case where Discord sends `null` explicitly (patching should update the field) vs field absent (keep existing).

### Methods Updated

| Method/Getter | Change | Reason |
|---|---|---|
| `deletable` | Added `UndeletableMessageTypes.includes(this.type)` early return; replaced `communicationDisabledUntilTimestamp < Date.now()` with `!isCommunicationDisabled()`; added `AUTO_MODERATION_ACTION` type exclusion for own-message delete | v14 correctness improvements |
| `pinnable` | Rewrote: removed `deletedMessages.has()` check; added `isVoiceBased()` guard; changed perm check to `READ_MESSAGE_HISTORY \| MANAGE_MESSAGES` | v14 aligns pinning to require READ_MESSAGE_HISTORY too |
| `fetchReference()` | Removed redundant `const message = await ...; return message` → `return channel.messages.fetch(messageId)` | v14 style cleanup |
| `equals()` | Changed `new Date(rawData.timestamp).getTime()` → `Date.parse(rawData.timestamp)` (same for edited_timestamp) | v14 style, `Date.parse` is equivalent but cleaner |

---

## Selfbot-Specific Code Kept (Untouched)

- `deletedMessages` WeakSet + `deprecated` getter/setter for `deleted` property
- `channel` getter uses `cache.get()` (selfbot pattern, not `resolve()`)
- `react(emoji, burst)` — selfbot adds `burst` (Super Reactions) parameter with `me_burst` in payload
- `clickButton(buttonid)` — selfbot REST interaction dispatch
- `selectMenu(menu, values)` — selfbot REST interaction dispatch
- `vote(...ids)` — selfbot poll vote via REST
- `markUnread()` / `markRead()` — selfbot ack endpoint calls
- `report(breadcrumbs, elements)` — selfbot reporting API
- `isMessage` getter — TypeScript helper
- `forward(channel)` — selfbot uses different REST approach (resolves channel, calls `send({ forward: ... })`)
- All selfbot import paths (`require('./Base')` not `@discordjs/*`)
- String-based enum comparisons (`'GUILD_NEWS'`, `'FORWARD'`, `'AUTO_MODERATION_ACTION'`, etc.)

---

## Methods NOT Added from v14

- None needed — all v14 methods that made sense are already present in selfbot or not applicable (selfbot uses different REST/ws patterns)

---

## Syntax Check

```
node --check src/structures/Message.js → SYNTAX OK
```

---

## Unresolved Questions

- `pinnable` now checks `isVoiceBased?.()` with optional chaining since selfbot channel objects may not always have this method — safe but worth verifying all channel types expose it.
- `deletable` for `AUTO_MODERATION_ACTION` type: selfbot uses string `'AUTO_MODERATION_ACTION'` — confirm this matches what `MessageTypes[data.type]` resolves to for that type.
