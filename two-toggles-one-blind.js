const { TwoTogglesWallSwitch } = require('./two-toggles-wall-switch');
const { EquipmentItems } = require('./equipment-items');
const { WallSwitchState } = require('./wall-switch-state');
const { ToggleStateDescription } = require('./toggle-state-description');
const { BlindStateDescription } = require('./blind-state-description');

/**
 * Special WallSwitch with an state to toggle two items 
 */
class TwoTogglesOneBlind extends TwoTogglesWallSwitch {

    /**
     * @param {string} id 
     * @param {string} name 
     * @param {EquipmentItems} items Definition of the equipment
     * @param {ToggleStateDescription} toggleStateDescription Description of the 2 toggle state
     * @param {BlindStateDescription} blindStatesDescription Description of the blind states
     */
    constructor(id, name, items, toggleStateDescription, blindStatesDescription) {
        super(id, name, items, toggleStateDescription);

        let twoTogglesState = this.getState(0);

        let blindStates = WallSwitchState.createPersianaStates(
            blindStatesDescription.id,
            blindStatesDescription.text,
            blindStatesDescription.controlItemName,
            twoTogglesState
        )

        this.addState(blindStates);

        twoTogglesState.both = (command) => {
            if (command === "click") {
                // move to idle
                twoTogglesState.owner.setState(blindStates[0]);
            }
        };
    }


}

module.exports = {TwoTogglesOneBlind};