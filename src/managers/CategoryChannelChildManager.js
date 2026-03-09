'use strict';

const DataManager = require('./DataManager');
const GuildChannel = require('../structures/GuildChannel');

/**
 * Manages API methods for CategoryChannels' children.
 * @extends {DataManager}
 */
class CategoryChannelChildManager extends DataManager {
  constructor(channel) {
    super(channel.client, GuildChannel);

    /**
     * The category channel this manager belongs to
     * @type {CategoryChannel}
     */
    this.channel = channel;
  }

  /**
   * The channels that are a part of this category
   * @type {Collection<Snowflake, GuildChannel>}
   * @readonly
   */
  get cache() {
    return this.guild.channels.cache.filter(channel => channel.parentId === this.channel.id);
  }

  /**
   * The guild this manager belongs to
   * @type {Guild}
   * @readonly
   */
  get guild() {
    return this.channel.guild;
  }

  /**
   * Creates a new channel within this category.
   * @param {Object} options Options for creating the new channel
   * @returns {Promise<GuildChannel>}
   */
  async create(options) {
    return this.guild.channels.create(options.name, {
      ...options,
      parent: this.channel.id,
    });
  }
}

module.exports = CategoryChannelChildManager;
