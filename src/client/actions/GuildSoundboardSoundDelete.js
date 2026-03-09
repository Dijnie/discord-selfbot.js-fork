'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildSoundboardSoundDeleteAction extends Action {
  handle(data) {
    const guild = this.client.guilds.cache.get(data.guild_id);
    if (!guild) return {};

    const soundboardSound = guild.soundboardSounds?.cache?.get(data.sound_id) ?? null;

    if (soundboardSound) {
      guild.soundboardSounds.cache.delete(soundboardSound.soundId);

      /**
       * Emitted whenever a soundboard sound is deleted in a guild.
       * @event Client#guildSoundboardSoundDelete
       * @param {SoundboardSound} soundboardSound The soundboard sound that was deleted
       */
      this.client.emit(Events.GUILD_SOUNDBOARD_SOUND_DELETE, soundboardSound);
    }

    return { soundboardSound };
  }
}

module.exports = GuildSoundboardSoundDeleteAction;
