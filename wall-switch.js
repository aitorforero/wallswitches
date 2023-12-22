const { EquipmentItems } = require('./equipment-items');
const { WallSwitchState } = require('./wall-switch-state');


/**
 * Represents a WallSwitch equipment.
 */
class WallSwitch {

    /**
     * The identifier of the WallSwitch. Will be used to determine the estate in mqtt commands.
     * @type {string}
     */
    #id;

    /**
    * The name of the WallSwitch
    * @type {string}
    */
    name;

    /**
     * Item names of the equipment represented by this WallSwitch
     * @type {EquipmentItems}
     */
    items;

    /**
     * someProperty is an example property that is set to `true`
     * @type {WallSwitchState[]}
     */
    #states = [];

    /**
     * ID of the timeout
     * @type {number}
     */
    #timeoutID;



    /**
     * @param {string} id The identifier of the WallSwitch. Will be used to determine the estate in mqtt commands
     * @param {string} name The name of the WallSwitch
     * @param {EquipmentItems} items Definition of the equipment
     */
    constructor(id, name, items) {
        console.info(`Creando WallSwitch ${id}:${name}`);

        this.#id = id;
        this.name = name;
        this.items = items;
    }


    /**
     * Gets the identifier of the WallSwitch.
     * @returns {string} 
     */
    get id() {
        return this.#id;
    }

    clearTimeout() {
        if (this.#timeoutID) {
            console.debug(`Canceling ID ${this.#timeoutID}...`)
            clearTimeout(this.#timeoutID);
            this.#timeoutID = undefined;
        }
    }

    createTimeout() {
        var owner = this;
        // After 30 seconds without interaction the WallSwitch returns to initial state
        this.#timeoutID = setTimeout(function () {
            console.debug("Reseting...");
            owner.setState(owner.getState(0));
            owner.clearTimeout();
        }, 30000);    
        
        console.debug(`Created ID ${this.#timeoutID}...`)
    }

    /**
     * Called when a do from state is called
     */
    onCommand() {
        this.clearTimeout();
        this.createTimeout();
    }

    /**
     * Add the state to the WallSwitch
     * @param {(WallSwitchState|WallSwitchState[])} states 
     */
    addState(states) {
        if (!Array.isArray(states)) {
            states = [states];
        }

        states.forEach(state => {
            this.#states[state.id] = state;
            state.owner = this;
        });
    }

    /**
     * Gets an state of the WallSwitch
     * @param {(string|number)} idOrIndex The id or the index of the state 
     * @returns {WallSwitchState} 
     */
    getState(idOrIndex) {
        if (typeof idOrIndex === "string") {
            return this.#states[idOrIndex];
        } else if (typeof idOrIndex === "number") {
            return this.#states[Object.keys(this.#states)[idOrIndex]];
        } else {
            return null
        }
    }

    /**
     * Sets state in the WallSwitch
     * @param {WallSwitchState} nextState Next state 
     */
    setState(nextState) {
        nextState.enter();
        nextState.publishSetState();
    }

    /**
     * Publish to MQTT the topic to set the first state
     * @param {string} id of the state 
     */
    initialize() {
        console.info(`initializing ${this.name}(${this.id})`);
        this.getState(0).publishSetState();
    };

    /**
     * check the validity of an status
     * @param {string} id Id of the state
     * @returns {boolean} true if is valid
     */
    statusIsValid(status) {
        return this.getState(status) !== null;
    };
}

module.exports = {WallSwitch};