'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const { TypeError } = require('../errors');
const ApplicationEmoji = require('../structures/ApplicationEmoji');
const DataResolver = require('../util/DataResolver');

/**
 * Manages API methods for ApplicationEmojis and stores their cache.
 * @extends {CachedManager}
 */
class ApplicationEmojiManager extends CachedManager {
  constructor(application, iterable) {
    super(application.client, ApplicationEmoji, iterable);

    /**
     * The application this manager belongs to
     * @type {Object}
     */
    this.application = application;
  }

  _add(data, cache) {
    return super._add(data, cache, { extras: [this.application] });
  }

  /**
   * Creates a new custom emoji of the application.
   * @param {Object} options Options for creating the emoji
   * @param {BufferResolvable|Base64Resolvable} options.attachment The image for the emoji
   * @param {string} options.name The name for the emoji
   * @returns {Promise<ApplicationEmoji>}
   */
  async create({ attachment, name }) {
    const image = await DataResolver.resolveImage(attachment);
    if (!image) throw new TypeError('REQ_RESOURCE_TYPE');

    const body = { image, name };
    const emoji = await this.client.api.applications(this.application.id).emojis.post({ data: body });

    return this._add(emoji);
  }

  /**
   * Obtains one or more emojis from Discord, or the emoji cache if they're already available.
   * @param {Snowflake} [id] The emoji's id
   * @param {Object} [options] Additional options for this fetch
   * @returns {Promise<ApplicationEmoji|Collection<Snowflake, ApplicationEmoji>>}
   */
  async fetch(id, { cache = true, force = false } = {}) {
    if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }

      const emoji = await this.client.api.applications(this.application.id).emojis(id).get();

      return this._add(emoji, cache);
    }

    const data = await this.client.api.applications(this.application.id).emojis.get();

    const emojis = new Collection();
    const items = data.items ?? data;
    for (const emoji of items) emojis.set(emoji.id, this._add(emoji, cache));
    return emojis;
  }

  /**
   * Deletes an emoji.
   * @param {ApplicationEmoji|Snowflake} emoji The emoji to delete
   * @returns {Promise<void>}
   */
  async delete(emoji) {
    const id = this.resolveId(emoji);
    if (!id) throw new TypeError('INVALID_TYPE', 'emoji', 'EmojiResolvable', true);

    await this.client.api.applications(this.application.id).emojis(id).delete();
  }

  /**
   * Edits an emoji.
   * @param {ApplicationEmoji|Snowflake} emoji The emoji to edit
   * @param {Object} options The options to provide
   * @returns {Promise<ApplicationEmoji>}
   */
  async edit(emoji, options) {
    const id = this.resolveId(emoji);
    if (!id) throw new TypeError('INVALID_TYPE', 'emoji', 'EmojiResolvable', true);

    const newData = await this.client.api
      .applications(this.application.id)
      .emojis(id)
      .patch({ data: { name: options.name } });

    const existing = this.cache.get(id);
    if (existing) {
      existing._patch(newData);
      return existing;
    }

    return this._add(newData);
  }

  /**
   * Fetches the author for this emoji
   * @param {ApplicationEmoji|Snowflake} emoji The emoji to fetch the author of
   * @returns {Promise<User>}
   */
  async fetchAuthor(emoji) {
    const id = this.resolveId(emoji);
    if (!id) throw new TypeError('INVALID_TYPE', 'emoji', 'EmojiResolvable', true);

    const data = await this.client.api.applications(this.application.id).emojis(id).get();

    return this._add(data).author;
  }
}

module.exports = ApplicationEmojiManager;
