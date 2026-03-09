# Merge Report: v14 Guild.js → Selfbot Guild.js

**Date:** 2026-03-10
**File modified:** `src/structures/Guild.js`
**v14 source (read-only):** `discord.js/src/structures/Guild.js`

---

## Methods Added

None. All v14 methods either already existed in selfbot or depend on infrastructure not present in selfbot (e.g., `GuildApplicationCommandManager`, `DiscordSnowflake`).

## Methods Updated

| Method | Change |
|--------|--------|
| `fetchOwner` | Made `async`; added ownerId guard throwing `Error('FETCH_OWNER_ID')` if guild has no owner id set (mirrors v14 behavior) |
| `fetchOnboarding` | Removed `// TODO` comment; now returns `new GuildOnboarding(this.client, data)` instead of raw data |
| `editOnboarding` | Removed `// TODO` comment; now returns `new GuildOnboarding(this.client, data)` instead of raw data |

## Properties/Imports Added

| Item | Location | Detail |
|------|----------|--------|
| `GuildOnboarding` require | line 7 | `require('./GuildOnboarding')` — was missing despite GuildOnboarding.js existing in selfbot |

## Selfbot-Specific Code Kept (unchanged)

- `markAsRead()` — selfbot-specific guild ack via old API
- `setCommunity()` — selfbot helper using string-based feature flags
- `topEmojis()` — selfbot endpoint `/top-emojis`
- `setVanityCode()` — selfbot vanity URL setter
- `setOwner()` — selfbot owner transfer
- `delete()` — selfbot guild deletion
- `setChannelPositions()` / `setRolePositions()` — deprecated but kept per selfbot contract
- `voiceAdapterCreator` getter — selfbot version checks `shard.status !== Status.READY`
- `me` getter (deprecated)
- `_sortedChannels()` — uses selfbot string-based `ChannelTypes` constants
- `discoverySplashURL()` — uses selfbot CDN pattern `{ format, size }` destructure
- `leave()` — selfbot version checks `this.ownerId === this.client.user.id` and calls old API
- `edit()` — selfbot version uses old `this.client.api` pattern; kept as-is
- `disableInvites()` — uses string `'INVITES_DISABLED'` not `GuildFeature` enum
- All `set*` methods — kept non-async per selfbot style (v14 makes them async)
- `GuildSettingManager` (this.settings) — selfbot-specific manager
- Import paths — all use selfbot's local require paths (no `@discordjs/*`)

## Not Merged (intentionally skipped)

| v14 Feature | Reason skipped |
|-------------|----------------|
| `this.commands = new GuildApplicationCommandManager(this)` in constructor | `GuildApplicationCommandManager` doesn't exist in selfbot |
| `editOnboarding` emoji via `resolvePartialEmoji` | `resolvePartialEmoji` not in selfbot; kept existing emoji resolution logic |
| `edit()` destructured signature from v14 | Selfbot `edit()` has different signature with `owner` field support; kept selfbot version |
| `maximumBitrate` using `GuildFeature` enum | Selfbot uses string `'VIP_REGIONS'`; kept selfbot version |
| v14 REST routes (`Routes.*`) in internal methods | All internal methods kept using `this.client.api.*` selfbot pattern |
| `fetchOnboarding` returning `GuildOnboarding` class from v14 | Already updated — selfbot now has GuildOnboarding structure |

## Syntax Check

```
node --check src/structures/Guild.js → SYNTAX OK
```

## Issues / Notes

- `editOnboarding` uses `id: prompt.id` (no fallback snowflake generation) — v14 generates a snowflake for prompts without an id using `DiscordSnowflake.generate()`, but since selfbot doesn't have `@sapphire/snowflake`, this was left as selfbot's existing behavior
- `fetchOwner` error key `'FETCH_OWNER_ID'` used as a string error; v14 uses `ErrorCodes.FetchOwnerId` enum. Selfbot's error system uses string keys so this is correct

## Unresolved Questions

- None
