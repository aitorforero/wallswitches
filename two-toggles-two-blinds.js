const { TwoTogglesOneBlind } = require('./two-toggles-one-blind');
const { EquipmentItems } = require('./equipment-items');
const { WallSwitchState } = require('./wall-switch-state');
const { ToggleStateDescription } = require('./toggle-state-description');
const { BlindStateDescription } = require('./blind-state-description');

/**
 * Special WallSwitch with an state to toggle two items 
 */
class TwoTogglesTwoBlinds extends TwoTogglesOneBlind {

    /**
     * @param {string} id 
     * @param {string} name 
     * @param {EquipmentItems} items Definition of the equipment
     * @param {ToggleStateDescription} toggleStateDescription Description of the 2 toggle state
     * @param {BlindStateDescription} firstBlindStatesDescription Description of the first blind states
     * @param {BlindStateDescription} secondBlindStatesDescription Description of the second blind states
     */
    constructor(id, name, items, toggleStateDescription, firstBlindStatesDescription, secondBlindStatesDescription) {
        super(id, name, items, toggleStateDescription, firstBlindStatesDescription);

        let TwoTogglesState = this.getState(0);

        let secondBlindStates = WallSwitchState.createPersianaStates(
            secondBlindStatesDescription.id,
            secondBlindStatesDescription.text,
            secondBlindStatesDescription.controlItemName,
            TwoTogglesState
        )

        this.addState(secondBlindStates);

        let setSecondBlindState = (command) => {
            if (command === "click") {
                console.debug("Moving to secondBlind State");
                TwoTogglesState.owner.setState(secondBlindStates[0]);
            }
        }


        this.getState(1).both(setSecondBlindState);
        this.getState(2).both(setSecondBlindState);
        this.getState(3).both(setSecondBlindState);


    }


}

module.exports = {TwoTogglesTwoBlinds};