'use strict';

const { Emoji } = require('./Emoji');

/**
 * Represents an application emoji.
 * @extends {Emoji}
 */
class ApplicationEmoji extends Emoji {
  constructor(client, data, application) {
    super(client, data);

    /**
     * The application this emoji originates from
     * @type {Object}
     */
    this.application = application;

    this._patch(data);
  }

  _patch(data) {
    if ('name' in data) this.name = data.name;

    if (data.user) {
      /**
       * The user who created this emoji
       * @type {User}
       */
      this.author = this.client.users._add(data.user);
    }

    if ('managed' in data) {
      /**
       * Whether this emoji is managed by an external service
       * @type {boolean}
       */
      this.managed = data.managed;
    }

    if ('require_colons' in data) {
      /**
       * Whether this emoji requires colons surrounding it
       * @type {boolean}
       */
      this.requiresColons = data.require_colons;
    }

    if ('available' in data) {
      /**
       * Whether this emoji is available
       * @type {boolean}
       */
      this.available = data.available;
    }
  }

  /**
   * Fetches the author for this emoji
   * @returns {Promise<User>}
   */
  async fetchAuthor() {
    return this.application.emojis.fetchAuthor(this);
  }

  /**
   * Edits the emoji.
   * @param {Object} options The options to provide
   * @returns {Promise<ApplicationEmoji>}
   */
  async edit(options) {
    return this.application.emojis.edit(this.id, options);
  }

  /**
   * Sets the name of the emoji.
   * @param {string} name The new name for the emoji
   * @returns {Promise<ApplicationEmoji>}
   */
  async setName(name) {
    return this.edit({ name });
  }

  /**
   * Deletes the emoji.
   * @returns {Promise<ApplicationEmoji>}
   */
  async delete() {
    await this.application.emojis.delete(this.id);
    return this;
  }

  /**
   * Whether this emoji is the same as another one.
   * @param {ApplicationEmoji|APIEmoji} other The emoji to compare it to
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof ApplicationEmoji) {
      return (
        other.animated === this.animated &&
        other.id === this.id &&
        other.name === this.name &&
        other.managed === this.managed &&
        other.requiresColons === this.requiresColons &&
        other.available === this.available
      );
    }
    return other.id === this.id && other.name === this.name;
  }
}

module.exports = ApplicationEmoji;
