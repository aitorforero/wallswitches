const { items } = require('openhab');
const { ON } = require("@runtime");
const { WallSwitch } = require('./wall-switch');

class WallSwitches {
    /**
     * @type WallSwitch[]
     */
    static equipments = [];





    /**
     * Gets an Equipment by his id
     * @param {string} id Id of the element to return
     * @returns {WallSwitch|undefined} If id is valid, returns the equipment else undefined
     */
    static getEquipmentById(id) {
        return this.equipments.find(equipment => equipment.id === id)
    }

    /**
     * Gets an Equipment that contains the item
     * @param {string} itenName Name of the item to be owned
     * @returns {WallSwitch|undefined} If id is valid, returns the equipment else undefined
     */
    static getEquipmentByItemName(itenName) {
        return this.equipments.find(
            equipment => { 
                return Object.values(equipment.items).some(item => item === itenName);
            }
        );
    }

    /**
     * check the validity of an id
     * @param {string} id Id to check
     * @returns {bool} true if an equipment with the id exists
     */
    static idIsValid(id) {
        return this.getEquipmentById(id) !== undefined;
    };

    /**
     * check the validity of a button
     * @param {string} button Button to check
     * @returns {bool} true if it is valid
     */
    static buttonIsValid(button) {
        /** Valid buttons */
        const buttons = ["left", "right", "both"];

        return buttons.includes(button);
    };

    /**
     * check the validity of a value
     * @param {string} value Value to check
     * @returns {bool} true if it is valid
     */
    static valueIsValid(value) {
        const values = ["down", "click", "up"];

        return values.includes(value);
    };

    /**
     * Sends initialization message to an equipment
     * @param {string} id Id of the equipment to be initialized
     */
    static parseInitializationRequest(id) {

        var equipment = this.getEquipmentById(id);

        if (!equipment) {
            throw "Invalid Id";
        }

        items.getItem(equipment.items.initialize).sendCommand(ON);
    };

    /**
     * Parse a command receive for an equipment
     * @param {string} id 
     * @param {string} status 
     * @param {string} button 
     * @param {string} value 
     */
    static parseCommand(id, status, button, value) {

        var equipment = this.getEquipmentById(id);

        if (!equipment) {
            throw "Invalid Id";
        } else if (!equipment.statusIsValid(status)) {
            throw "Invalid status";
        } else if (!this.buttonIsValid(button)) {
            throw "Invalid status";
        } else if (!this.valueIsValid(value)) {
            console.debug(value);
            throw "Invalid value";
        }


        // the status is an status ;)
        items.getItem(equipment.items.status).postUpdate(status);
        items.getItem(equipment.items[button]).sendCommand(value); 
    };

    /** Valid point names */
    points = {
        initialize: "Initialize",
        status: "Status",
        left: "Left",
        right: "Right",
        both: "Both"
    };
}

module.exports = {WallSwitches};
