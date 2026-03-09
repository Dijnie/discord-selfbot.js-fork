'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link ThreadMember#flags} bitfield.
 * @extends {BitField}
 */
class ThreadMemberFlags extends BitField {}

/**
 * @name ThreadMemberFlags
 * @kind constructor
 * @memberof ThreadMemberFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name ThreadMemberFlags#bitfield
 */

/**
 * Numeric thread member flags. All available properties:
 * * `HAS_INTERACTED`
 * * `ALL_MESSAGES`
 * * `ONLY_MENTIONS`
 * * `NO_MESSAGES`
 * @type {Object<string, number>}
 * @see {@link https://discord.com/developers/docs/resources/channel#thread-member-object-thread-member-flags}
 */
ThreadMemberFlags.FLAGS = {
  HAS_INTERACTED: 1 << 0,
  ALL_MESSAGES: 1 << 1,
  ONLY_MENTIONS: 1 << 2,
  NO_MESSAGES: 1 << 3,
};

module.exports = ThreadMemberFlags;
