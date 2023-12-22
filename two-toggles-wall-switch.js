const { WallSwitch } = require('./wall-switch');
const { EquipmentItems } = require('./equipment-items');
const { WallSwitchState } = require('./wall-switch-state');
const { ToggleStateDescription } = require('./toggle-state-description');

/**
 * Special WallSwitch with an state to toggle two items 
 */
class TwoTogglesWallSwitch extends WallSwitch {

    /**
     * @param {string} id 
     * @param {string} name 
     * @param {EquipmentItems} items Definition of the equipment
     * @param {ToggleStateDescription} toggleStateDescription Description of the 2 toggle state
     */
    constructor(id, name, items, toggleStateDescription) {
        super(id, name, items);

        this.addState(
            WallSwitchState.get2TogglesState(
                toggleStateDescription.id,
                toggleStateDescription.text,
                toggleStateDescription.leftItemName,
                toggleStateDescription.rightItemName
            )
        );
    }


}

module.exports = {TwoTogglesWallSwitch};
