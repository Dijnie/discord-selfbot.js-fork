# Merge Report: v14.16.3 Structures Batch 1

**Date:** 2026-03-10
**Status:** Completed

---

## Files Modified

| File | Changes |
|------|---------|
| `src/structures/GuildEmoji.js` | Added `async` to `fetchAuthor()` |
| `src/structures/GuildBan.js` | Added `async` to `fetch()` |
| `src/structures/Sticker.js` | Removed deprecated `deleted` getter/setter + WeakSet; removed `deletedStickers` export |
| `src/structures/StickerPack.js` | Updated `bannerURL` JSDoc: `StaticImageURLOptions` → `ImageURLOptions` |
| `src/structures/GuildScheduledEvent.js` | Fixed `isActive/isCanceled/isCompleted/isScheduled` to direct string compare; added `async` to 8 methods; fixed `scheduledStartAt` to be null-safe |
| `src/structures/StageInstance.js` | Removed deprecated `deleted` getter/setter + WeakSet; removed `deletedStageInstances` export; added `async` to `edit()`, `setTopic()`; fixed `delete()` to not use removed WeakSet |
| `src/structures/Webhook.js` | Added `applicationId` field in `_patch()`; added `isUserCreated()` and `isApplicationCreated()` methods; updated `avatarURL` JSDoc |
| `src/client/actions/GuildStickerDelete.js` | Removed `deletedStickers` import/usage (WeakSet deprecated) |
| `src/client/actions/StageInstanceDelete.js` | Removed `deletedStageInstances` import/usage (WeakSet deprecated) |

---

## Tasks Completed

- [x] GuildEmoji.js — merged v14 improvements
- [x] GuildBan.js — merged v14 improvements
- [x] Sticker.js — merged v14 improvements, removed deprecated deleted WeakSet
- [x] StickerPack.js — merged v14 improvements
- [x] GuildScheduledEvent.js — merged v14 improvements, fixed status comparisons
- [x] StageInstance.js — merged v14 improvements, removed deprecated deleted WeakSet
- [x] Webhook.js — merged v14 improvements (applicationId, isUserCreated, isApplicationCreated)
- [x] Updated action files that depended on removed WeakSet exports

---

## Tests Status

- Syntax check (`node --check`): **PASS** — all 9 files

---

## Design Decisions

### Selfbot patterns preserved
- `Sticker#url` — kept selfbot `cdn.Sticker(id, format)` call (v14 uses format extension map)
- `Sticker#fetch` — kept `client.api.stickers(id).get()` (v14 uses `client.rest.get(Routes.sticker(id))`)
- `Sticker#fetchPack` — kept `client.fetchPremiumStickerPacks()` (v14 uses `client.fetchStickerPacks()`)
- `Sticker#tags` — kept array split behavior (`sticker.tags.split(', ')`); v14 stores as plain string
- `GuildEmoji#edit` — kept direct API call pattern; v14 delegates to manager
- `GuildScheduledEvent#url` — kept selfbot `Endpoints.scheduledEvent(...)` (v14 uses `RouteBases`)
- `GuildScheduledEvent#createInviteURL` — kept string `'EXTERNAL'` comparison (selfbot string-enum)
- `Webhook#send/edit/fetchMessage/editMessage/delete/deleteMessage` — kept `client.api.*` pattern
- `Webhook#url` — kept `client.options.http.api + client.api.webhooks(...)` (v14 uses Routes)
- `Webhook#avatarURL` — kept `cdn.Avatar(id, avatar, format, size)` call
- `Webhook#isChannelFollower/isIncoming` — kept string type comparisons (`'Channel Follower'`, `'Incoming'`)
- `StageInstance#discoverableDisabled` — kept (selfbot-specific field, v14 removed it)
- `StageInstance#privacyLevel` — kept `PrivacyLevels[data.privacy_level]` mapping

### v14 improvements applied
- `async` consistency on methods that return promises
- Removed deprecated `deleted` WeakSet pattern from Sticker and StageInstance
- `GuildScheduledEvent#isActive/isCanceled/isCompleted/isScheduled` — simplified to direct `this.status === 'STRING'`
- `GuildScheduledEvent#scheduledStartAt` — null-safe (`this.scheduledStartTimestamp && new Date(...)`)
- `Webhook#applicationId` — added field tracking
- `Webhook#isUserCreated()` / `isApplicationCreated()` — new helper methods

---

## Issues Encountered

- `GuildStickerDelete.js` and `StageInstanceDelete.js` both imported the now-removed WeakSet exports — updated both action files to remove the dead references (these are outside the original 7-file scope but were required to prevent runtime errors).

---

## Unresolved Questions

- None.
