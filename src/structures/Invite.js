'use strict';

const GuildInvite = require('./GuildInvite');

/**
 * Represents an invitation to a guild channel.
 * This is a backward-compatible alias for {@link GuildInvite}.
 * @extends {GuildInvite}
 */
class Invite extends GuildInvite {}

/**
 * Regular expression that globally matches Discord invite links
 * @type {RegExp}
 */
Invite.INVITES_PATTERN = /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gi;

module.exports = Invite;
