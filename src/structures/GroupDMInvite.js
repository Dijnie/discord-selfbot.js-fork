'use strict';

const BaseInvite = require('./BaseInvite');

/**
 * A channel invite leading to a group direct message channel.
 * @extends {BaseInvite}
 */
class GroupDMInvite extends BaseInvite {
  /**
   * The approximate total number of members in the group direct message channel.
   * <info>This is only available when the invite was fetched through {@link Client#fetchInvite}.</info>
   * @name GroupDMInvite#memberCount
   * @type {?number}
   */

  _patch(data) {
    super._patch(data);

    if ('channel' in data) {
      /**
       * The channel this invite is for
       * @type {?PartialGroupDMChannel}
       */
      this.channel =
        this.client.channels._add(data.channel, null, { cache: false }) ??
        this.client.channels.cache.get(this.channelId);

      this.channelId ??= data.channel.id;
    }
  }
}

module.exports = GroupDMInvite;
