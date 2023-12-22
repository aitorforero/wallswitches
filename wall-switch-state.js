const { UP, DOWN, STOP } = require("@runtime");
const {actions, items} = require("openhab");
const {WallSwitch} = require("./wall-switch");

/**
 * Represents a state of WallSwitch.
 */
class WallSwitchState {
    /**
     * Id of the state
     * @type string
     */    
    #id;

    /**
     * Action for MQTT
     */    
    #mqttActions;

    /**
     * Text of the state
     */    
    text = "";

    /**
     * Owner of the state
     * @type WallSwitch
     */    
    owner = undefined;

    /**
     * Represents a state of WallSwitch.
     * @param {string} id - The identifier of the state. Will be used to determine the estate in mqtt commands
     */
    constructor(id) {
        this.#id = id;
        this.#mqttActions = actions.get("mqtt", "mqtt:broker:f3b60118a2");
    }

    /**
     * Callback for left button
     */
    left = (command) => {};

    /**
     * Callback for right button
     */
    right = (command) => {};

    /**
     * Callback for both buttons
     */
    both = (command) => {};

    /**
     * Callback that will called when entering into the state
     */
    enter = () => {};

    /**
     * Identifier of the state.
     * @returns {string} 
     */
    get id() {
        return this.#id;
    }

    /**
     * Execute left action
     * @param {string} command command parameter
     */
    doLeft(command) {
        this.left(command);
        this.owner.onCommand();
    }

    /**
     * Execute right action
     * @param {string} command command parameter
     */
    doRight(command) {
        this.right(command);
        this.owner.onCommand();
    }

    /**
     * Execute both action
     * @param {string} command command parameter
     */
    doBoth(command) {
        this.both(command);
        this.owner.onCommand();
        
        return this;
    }

    /**
     * Publish to MQTT the topic to set the new state
     * @param {string} id of the state 
     */
    publishSetState() {
        var topic = `casa/mandos/${this.owner.id}/setState`;
        var payload = JSON.stringify({
            "name": this.owner.name,
            "state": this.id,
            "text": this.text
        });

        this.#mqttActions.publishMQTT(topic, payload);
    }

    /**
     * Factory method for an state whith two toggle actions
     * @param {string} id Id of the state
     * @param {string} text Text of the state
     * @param {string} leftItemName Name of the item to toggle on left
     * @param {string} rightItemName Name of the item to toggle on right
     * @param {WallSwitchState} nextState Next state when both. Default itself
     * @returns {WallSwitchState}
     */
    static get2TogglesState(id, text, leftItemName, rightItemName, nextState) {
        var state = new WallSwitchState(id);

        state.text = text;

        state.left = (command) => {
            if (command === "click") {
                items.getItem(leftItemName).sendToggleCommand();
            }
        };

        state.right = (command) => {
            if (command === "click") {
                items.getItem(rightItemName).sendToggleCommand();
            }
        };


        state.both = (command) => {
            if (command === "click") {
                state.owner.setState(nextState || state);
            }
        };

        return state;
    }

    /**
     * Factory method for three states to control a blind
     * @param {string} id Id of the state
     * @param {string} text Text of the state
     * @param {string} controlItemName Name of the control item
     * @param {WallSwitchState} nextState Next state when both
     * @returns {WallSwitchState[]}
     */
    static createPersianaStates(id, text, controlItemName, nextState) {
        let idleState = new WallSwitchState(id + "_idle");
        let downState = new WallSwitchState(id + "_down");
        let upState = new WallSwitchState(id + "_up");


        idleState.text = text;
        idleState.enter = () => {items.getItem(controlItemName).sendCommand(STOP);};
        idleState.left = (command) => {
            if (command === "click") {
                idleState.owner.setState(downState);
            }
        };
        idleState.right = (command) => {
            if (command === "click") {
                idleState.owner.setState(upState);
            }
        };
        idleState.both = (command) => {
            if (command === "click") {
                idleState.owner.setState(nextState || idleState);
            }
        };

        downState.text = "Bajar";
        downState.enter = () => {items.getItem(controlItemName).sendCommand(DOWN);};
        downState.left = (command) => {
            if (command === "click") {
                idleState.owner.setState(idleState);
            }
        };
        downState.right = (command) => {
            if (command === "click") {
                idleState.owner.setState(upState);
            }
        };
        downState.both = (command) => {
            if (command === "click") {
                idleState.owner.setState(nextState || idleState);
            }
        };

        upState.text = "Subir";
        upState.enter = () => {items.getItem(controlItemName).sendCommand(UP);};
        upState.left = (command) => {
            if (command === "click") {
                idleState.owner.setState(downState);
            }
        };
        upState.right = (command) => {
            if (command === "click") {
                idleState.owner.setState(idleState);
            }
        };
        upState.both = (command) => {
            if (command === "click") {
                idleState.owner.setState(nextState || idleState);
            }
        };

        return [idleState, downState, upState]
    }

    
}

module.exports = {WallSwitchState};