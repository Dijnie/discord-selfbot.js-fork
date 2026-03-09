'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const SoundboardSound = require('../structures/SoundboardSound');
const DataResolver = require('../util/DataResolver');

/**
 * Manages API methods for Soundboard Sounds and stores their cache.
 * @extends {CachedManager}
 */
class GuildSoundboardSoundManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, SoundboardSound, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of Soundboard Sounds
   * @type {Collection<Snowflake, SoundboardSound>}
   * @name GuildSoundboardSoundManager#cache
   */

  _add(data, cache) {
    return super._add(data, cache, { id: data.sound_id });
  }

  /**
   * Resolves a SoundboardSoundResolvable to a SoundboardSound id.
   * @param {SoundboardSound|Snowflake} soundboardSound The soundboard sound resolvable to resolve
   * @returns {?Snowflake}
   */
  resolveId(soundboardSound) {
    if (soundboardSound instanceof this.holds) return soundboardSound.soundId;
    if (typeof soundboardSound === 'string') return soundboardSound;
    return null;
  }

  /**
   * Creates a new guild soundboard sound.
   * @param {Object} options Options for creating a guild soundboard sound
   * @param {BufferResolvable|Stream} options.file The file for the soundboard sound
   * @param {string} options.name The name for the soundboard sound
   * @param {number} [options.volume] The volume for the soundboard sound, from 0 to 1
   * @param {Snowflake} [options.emojiId] The emoji id for the soundboard sound
   * @param {string} [options.emojiName] The emoji name for the soundboard sound
   * @param {string} [options.reason] The reason for creating the soundboard sound
   * @returns {Promise<SoundboardSound>}
   */
  async create({ file, name, volume, emojiId, emojiName, reason }) {
    const resolvedFile = await DataResolver.resolveFile(file);
    const sound = DataResolver.resolveBase64(resolvedFile.data);

    const body = { emoji_id: emojiId, emoji_name: emojiName, name, sound, volume };

    const soundboardSound = await this.client.api.guilds(this.guild.id).soundboard.sounds.post({ data: body, reason });

    return this._add(soundboardSound);
  }

  /**
   * Edits a soundboard sound.
   * @param {SoundboardSound|Snowflake} soundboardSound The soundboard sound to edit
   * @param {Object} [options={}] The new data for the soundboard sound
   * @returns {Promise<SoundboardSound>}
   */
  async edit(soundboardSound, options = {}) {
    const soundId = this.resolveId(soundboardSound);
    if (!soundId) throw new TypeError('INVALID_TYPE', 'soundboardSound', 'SoundboardSoundResolvable');

    const { emojiId, emojiName, name, reason, volume } = options;
    const body = { emoji_id: emojiId, emoji_name: emojiName, name, volume };

    const data = await this.client.api.guilds(this.guild.id).soundboard.sounds(soundId).patch({ data: body, reason });

    const existing = this.cache.get(soundId);
    if (existing) {
      const clone = existing._clone();
      clone._patch(data);
      return clone;
    }

    return this._add(data);
  }

  /**
   * Deletes a soundboard sound.
   * @param {SoundboardSound|Snowflake} soundboardSound The soundboard sound to delete
   * @param {string} [reason] Reason for deleting this soundboard sound
   * @returns {Promise<void>}
   */
  async delete(soundboardSound, reason) {
    const soundId = this.resolveId(soundboardSound);
    if (!soundId) throw new TypeError('INVALID_TYPE', 'soundboardSound', 'SoundboardSoundResolvable');

    await this.client.api.guilds(this.guild.id).soundboard.sounds(soundId).delete({ reason });
  }

  /**
   * Obtains one or more soundboard sounds from Discord, or the cache if available.
   * @param {Object} [options] Options for fetching soundboard sound(s)
   * @returns {Promise<SoundboardSound|Collection<Snowflake, SoundboardSound>>}
   */
  async fetch(options) {
    if (!options) return this._fetchMany();
    const { cache, force, soundboardSound } = options;
    const resolvedSoundboardSound = this.resolveId(soundboardSound ?? options);
    if (resolvedSoundboardSound) return this._fetchSingle({ cache, force, soundboardSound: resolvedSoundboardSound });
    return this._fetchMany({ cache });
  }

  async _fetchSingle({ cache, force, soundboardSound } = {}) {
    if (!force) {
      const existing = this.cache.get(soundboardSound);
      if (existing) return existing;
    }

    const data = await this.client.api.guilds(this.guild.id).soundboard.sounds(soundboardSound).get();

    return this._add(data, cache);
  }

  async _fetchMany({ cache } = {}) {
    const data = await this.client.api.guilds(this.guild.id).soundboard.sounds.get();

    return data.items.reduce((coll, sound) => coll.set(sound.sound_id, this._add(sound, cache)), new Collection());
  }
}

module.exports = GuildSoundboardSoundManager;
