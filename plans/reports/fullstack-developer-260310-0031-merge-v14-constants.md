# Merge Report: discord.js v14.16.3 Constants.js into selfbot

**Date:** 2026-03-10
**File modified:** `src/util/Constants.js`
**V14 source (read-only):** `discord.js/src/util/Constants.js`

---

## Summary

V14 `Constants.js` is minimal (254 lines) — it imports from `discord-api-types/v10` and re-exports grouped arrays using those types. Selfbot `Constants.js` is comprehensive (2063+ lines) with its own string-based enum system. Most constants are equivalent but expressed differently. Three actual gaps were found and merged.

---

## Changes Made

### 1. ADDED: `'GROUP_DM'` to `TextBasedChannelTypes` (line 976)

V14 adds `ChannelType.GroupDM` to `TextBasedChannelTypes`. Selfbot was missing `'GROUP_DM'` in this array. Added it as the second entry (after `'DM'`).

```js
exports.TextBasedChannelTypes = [
  'DM',
  'GROUP_DM',   // <-- added
  'GUILD_TEXT',
  ...
];
```

### 2. ADDED: `SelectMenuTypes` export (after `SelectMenuComponentTypes`)

V14 exports `SelectMenuTypes` as an array of select menu component type values. Selfbot had `SelectMenuComponentTypes` (bidirectional enum) but no `SelectMenuTypes` array alias. Added for v14 API compatibility.

```js
exports.SelectMenuTypes = ['STRING_MENU', 'USER_SELECT', 'ROLE_SELECT', 'MENTIONABLE_SELECT', 'CHANNEL_SELECT'];
```

### 3. ADDED: `HolographicStyle` (singular, PascalCase keys) alongside existing `HolographicStyles`

V14 exports `HolographicStyle` with PascalCase keys (`Primary`, `Secondary`, `Tertiary`). Selfbot had `HolographicStyles` (plural) with UPPER_CASE keys (`PRIMARY`, `SECONDARY`, `TERTIARY`). Added `HolographicStyle` as a v14-compatible alias — both exports kept.

```js
exports.HolographicStyle = {
  Primary: 11_127_295,
  Secondary: 16_759_788,
  Tertiary: 16_761_760,
};
```

---

## Items Verified as Already Present / Not Applicable

| V14 Item | Status |
|---|---|
| `MaxBulkDeletableMessageAge` | Already present (same value: 1_209_600_000) |
| `SweeperKeys` incl. `entitlements` | Already present (selfbot has `entitlements`) |
| `NonSystemMessageTypes` | Present (string-based, compatible) |
| `GuildTextBasedChannelTypes` | Present (string-based) |
| `SendableChannels` | Present |
| `ThreadChannelTypes` | Present |
| `VoiceBasedChannelTypes` | Present |
| `UndeletableMessageTypes` | Present |
| `StickerFormatExtensionMap` | Present (keys differ: selfbot uses string names, v14 uses numeric type IDs — both valid, kept selfbot's) |

---

## Items Kept (selfbot-specific, not touched)

- All selfbot-specific events (RELATIONSHIP_*, CALL_*, VOICE_BROADCAST_*, INTERACTION_MODAL_CREATE, etc.)
- All selfbot opcodes (DM_UPDATE, GUILD_SUBSCRIPTIONS, STREAM_*, EMBEDDED_ACTIVITY_*, etc.)
- `UserAgent`, `ciphers` (TLS), `WSCodes`, `VoiceOpcodes`, `VoiceStatus`
- `ActivityTypes` with `HANG` type (selfbot-specific)
- `MessageTypes` extended array with selfbot-specific message types
- `MessageReferenceTypes`, `RelationshipTypes`, `PollLayoutTypes`
- `HolographicStyles` (plural UPPER_CASE variant — kept alongside new alias)

---

## Syntax Check

```
node --check src/util/Constants.js → OK
```

---

## Issues / Notes

None. No conflicts. No removals. Selfbot-specific constants untouched.
