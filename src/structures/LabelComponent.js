'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');

/**
 * Represents a label component
 * @extends {BaseMessageComponent}
 */
class LabelComponent extends BaseMessageComponent {
  constructor(data) {
    super(data);

    /**
     * The component in this label
     * @type {?BaseMessageComponent}
     * @readonly
     */
    this.component = data.component ? BaseMessageComponent.create(data.component) : null;
  }

  /**
   * The label text of the component
   * @type {?string}
   * @readonly
   */
  get label() {
    return this.data?.label ?? null;
  }

  /**
   * The description of this component
   * @type {?string}
   * @readonly
   */
  get description() {
    return this.data?.description ?? null;
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {Object}
   */
  toJSON() {
    return {
      ...this.data,
      component: this.component?.toJSON?.() ?? this.component,
    };
  }
}

module.exports = LabelComponent;
