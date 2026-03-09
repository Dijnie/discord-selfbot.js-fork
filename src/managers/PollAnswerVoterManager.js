'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const User = require('../structures/User');

/**
 * Manages API methods for users who voted on a poll and stores their cache.
 * @extends {CachedManager}
 */
class PollAnswerVoterManager extends CachedManager {
  constructor(answer) {
    super(answer.client, User);

    /**
     * The poll answer that this manager belongs to
     * @type {PollAnswer}
     */
    this.answer = answer;
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, User>}
   * @name PollAnswerVoterManager#cache
   */

  /**
   * Fetches the users that voted on this poll answer.
   * @param {Object} [options={}] Options for fetching the users
   * @param {number} [options.limit] The maximum number of voters to fetch
   * @param {Snowflake} [options.after] The user id to fetch voters after
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  async fetch({ after, limit } = {}) {
    const poll = this.answer.poll;
    const query = new URLSearchParams();
    if (limit !== undefined) query.set('limit', String(limit));
    if (after !== undefined) query.set('after', after);

    const data = await this.client.api
      .channels(poll.channelId)
      .polls(poll.messageId)
      .answers(this.answer.id)
      .get({ query: query.toString() || undefined });

    return data.users.reduce((coll, rawUser) => {
      const user = this.client.users._add(rawUser);
      this.cache.set(user.id, user);
      return coll.set(user.id, user);
    }, new Collection());
  }
}

module.exports = PollAnswerVoterManager;
