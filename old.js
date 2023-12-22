

this.OPENHAB_CONF = (this.OPENHAB_CONF === undefined) ? java.lang.System.getProperty("openhab.conf") : OPENHAB_CONF;
load(this.OPENHAB_CONF + "/automation/jsr223/javascript/personal/utils.js");


! function (context) {

    context = context || {};

    /** @namespace */
    context.WallSwitches =  context.WallSwitches || {};

    context.WallSwitches.logger = Java.type('org.slf4j.LoggerFactory').getLogger('org.openhab.rule.automation.WallSwitches');

    /** Valid buttons */ 
    context.WallSwitches.buttons = ["left", "right", "both"];

    /** Valid status values */
    context.WallSwitches.values = ["down", "click", "up"];

    /** Valid point names */
    context.WallSwitches.points = {
        initialize: "Initialize",
        status: "Status",
        left: "Left",
        right: "Right",
        both: "Both"
    };

    // Not overrided between rule ejecutions
    context.WallSwitches.equipments = context.WallSwitches.equipments || [];


    /**
     * Represents a state of WallSwitch.
     * @constructor
     * @param {string} id - The identifier of the state. Will be used to determine the estate in mqtt commands
     */
    context.WallSwitches.StateWallSwitch = function (id) {
        this._id = id;
        this._text = "";
        this._owner = undefined;
        this._enter = function () { };
        this._left = function () { };
        this._right = function () { };
        this._both = function () { };
    }

    /**
     * Returns the identifier of the state.
     * @function 
     * @returns {string} 
     */
    context.WallSwitches.StateWallSwitch.prototype.id = function () {
        return this._id;
    }

    /**
     * Sets or gets the text of the state
     * @param {string} [text] 
     * @returns {(string|context.WallSwitches.StateWallSwitch)} 
     */
    context.WallSwitches.StateWallSwitch.prototype.text = function (text) {

        if (arguments.length == 0) {
            return this._text;
        }
        this._text = text;
        return this;
    }

    /**
     * Sets or gets the callback for left button
     * @param {function} [callback] 
     * @returns {(function|context.WallSwitches.StateWallSwitch)} 
     */
    context.WallSwitches.StateWallSwitch.prototype.left = function (callback) {
        if (arguments.length == 0) {
            return this._left;
        }

        this._left = callback;
        return this;
    }

    /**
     * Sets or gets the callback for right button
     * @param {function} [callback] 
     * @returns {(function|context.WallSwitches.StateWallSwitch)} 
     */
    context.WallSwitches.StateWallSwitch.prototype.right = function (callback) {
        if (arguments.length == 0) {
            return this._right;
        }

        this._right = callback;
        return this;
    }

    /**
     * Sets or gets the callback that will called when entering into the state
     * @param {function} [callback]
     * @returns {(function|context.WallSwitches.StateWallSwitch)} 
     */
    context.WallSwitches.StateWallSwitch.prototype.enter = function (callback) {
        if (arguments.length == 0) {
            return this._enter;
        }

        this._enter = callback;
        return this;
    }


    /**
     * Sets or gets the callback for both button
     * @param {function} [callback]
     * @returns {(function|context.WallSwitches.StateWallSwitch)} 
     */
    context.WallSwitches.StateWallSwitch.prototype.both = function (callback) {
        if (arguments.length == 0) {
            return this._both;
        }

        this._both = callback;
        return this;
    }

    /**
     * Sets or gets the owner of the state
     * @param {context.WallSwitches.WallSwitch} [owner]
     * @returns {(function|context.WallSwitches.StateWallSwitch)} 
     */
    context.WallSwitches.StateWallSwitch.prototype.owner = function (owner) {
        if (arguments.length == 0) {
            return this._owner;
        }

        this._owner = owner;
        return this;
    }

    /**
     * Execute left action
     * @param {string} command command parameter
     * @returns {context.WallSwitches.WallSwitch} 
     */
    context.WallSwitches.StateWallSwitch.prototype.doLeft = function (command) {
        this._left(command);
        this._owner.onCommand();

        return this;
    }

     /**
     * Execute right action
     * @param {string} command command parameter
     * @returns {context.WallSwitches.WallSwitch} 
     */
    context.WallSwitches.StateWallSwitch.prototype.doRight = function (command) {
        this._right(command);
        this._owner.onCommand();
        
        return this;
    }

    /**
     * Execute both action
     * @param {string} command command parameter
     * @returns {context.WallSwitches.WallSwitch} 
     */
    context.WallSwitches.StateWallSwitch.prototype.doBoth = function (command) {
        this._both(command);
        this._owner.onCommand();
        
        return this;
    }



     /**
     * Publish to MQTT the topic to set the new state
     * @param {string} id of the state 
     * @returns {context.WallSwitches.WallSwitch} 
     */
    context.WallSwitches.StateWallSwitch.prototype.publishSetState = function () {

        var topic = "casa/mandos/" + this.owner().id() + "/setState";
        var payload = JSON.stringify({
            "name": this.owner().name(),
            "state": this.id(),
            "text": this.text()
        });

        var mqttActions = actions.get("mqtt", "mqtt:broker:f3b60118a2");
        mqttActions.publishMQTT(topic, payload);

        return this;
    }


    /**
     * Factory method for an state whith two toggle actions
     * @param {string} id Id of the state
     * @param {string} text Text of the state
     * @param {string} leftItemName Name of the item to toggle on left
     * @param {string} rightItemName Name of the item to toggle on right
     * @param {WallSwitch.StateWallSwitch} [nextState] Next state when both. Default itself
     * @returns {WallSwitch.StateWallSwitch} The new state created
     */
    context.WallSwitches.StateWallSwitch.get2TogglesState = function (id, text, leftItemName, rightItemName, nextState) {
        var state = new context.WallSwitches.StateWallSwitch(id);


        state.text(text).left(
            function (command) {
                if (command.toFullString() === "click") {
                    utils.toggle(leftItemName);
                }
            }
        ).right(
            function (command) {
                if (command.toFullString() === "click") {
                    utils.toggle(rightItemName);
                }
            }
        );


        state.both(
            function (command) {
                if (command.toFullString() === "click") {
                    state.owner().setState(nextState || state);
                }
            }
        )


        return state
    }

    /**
     * Factory method for three states to control a blind
     * @param {string} id Id of the state
     * @param {string} text Text of the state
     * @param {string} controlItemName Name of the control item
     * @param {WallSwitch.StateWallSwitch} [nextState] Next state when both
     */
    context.WallSwitches.StateWallSwitch.createPersianaStates = function (id, text, controlItemName, nextState) {
        var idleState = new context.WallSwitches.StateWallSwitch(id + "_idle");
        var downState = new context.WallSwitches.StateWallSwitch(id + "_down");
        var upState = new context.WallSwitches.StateWallSwitch(id + "_up");


        idleState
            .text(text)
            .enter(
                function () {
                    events.sendCommand(controlItemName, STOP);
                }
            ).left(
                function (command) {
                    if (command.toFullString() === "click") {
                        idleState.owner().setState(downState);
                    }
                }
            ).right(
                function (command) {
                    if (command.toFullString() === "click") {
                        idleState.owner().setState(upState);
                    }
                }
            ).both(
                function (command) {
                    if (command.toFullString() === "click") {
                        idleState.owner().setState(nextState || idleState);
                    }
                }
            )

        downState
            .text("Bajar")
            .enter(
                function () {
                    events.sendCommand(controlItemName, DOWN);
                }
            ).left(
                function (command) {
                    if (command.toFullString() === "click") {
                        idleState.owner().setState(idleState);
                    }
                }
            ).right(
                function (command) {
                    if (command.toFullString() === "click") {
                        idleState.owner().setState(upState);
                    }
                }
            ).both(
                function (command) {
                    if (command.toFullString() === "click") {
                        idleState.owner().setState(nextState || idleState);
                    }
                }
            )


        upState
            .text("Subir")
            .enter(
                function () {
                    events.sendCommand(controlItemName, UP);
                }
            ).left(
                function (command) {
                    if (command.toFullString() === "click") {
                        idleState.owner().setState(downState);
                    }
                }
            ).right(
                function (command) {
                    if (command.toFullString() === "click") {
                        idleState.owner().setState(idleState);
                    }
                }
            ).both(
                function (command) {
                    if (command.toFullString() === "click") {
                        idleState.owner().setState(nextState || idleState);
                    }
                }
            )

        return [idleState, downState, upState]
    }


    /**
     * Represents a WallSwitch equipment.
     * @constructor
     * @param {string} id The identifier of the WallSwitch. Will be used to determine the estate in mqtt commands
     * @param {string} name The name of the WallSwitch
     * @param {object} items Definition of the equipment
     * @param {string} items.equipment Equipment item name
     * @param {string} items.left Left button status item name
     * @param {string} items.right Right button status item name
     * @param {string} items.both Both buttons status item name
     * @param {string} items.status Equipment state item name
     * @param {string} items.initialize Equipment initialization command item name
     */
    context.WallSwitches.WallSwitch = function (id, name, items) {
       this._id = id;
        this._name = name;
        this._states = {};
        this.items = items;
        this._timer = null;
    }

    /**
     * Returns the identifier of the WallSwitch.
     * @function 
     * @returns {string} 
     */
    context.WallSwitches.WallSwitch.prototype.id = function () {
        return this._id;
    }


    /**
     * Sets or gets the name of the WallSwitch
     * @param {string} [name] 
     * @returns {(string|context.WallSwitches.WallSwitch)} 
     */
    context.WallSwitches.WallSwitch.prototype.name = function (name) {
        if (arguments.length == 0) {
            return this._name;
        }

        this._name = name;
        return this;
    }

    /**
     * Called when a do from state is called
     * @returns {context.WallSwitches.WallSwitch} 
     */ 
    context.WallSwitches.WallSwitch.prototype.onCommand = function() {
        if (this._timer !== null) {
            context.WallSwitches.logger.debug(this._timer);
            context.WallSwitches.logger.debug("Cancelling...");
            this._timer.cancel();
        } else {
            context.WallSwitches.logger.debug(this._timer);
            context.WallSwitches.logger.debug("Not Cancelling");

        }
         // After 30 seconds without interaction the WallSwitch returns to initial state
        var owner = this;
        this._timer = utils.setTimeout(function () {
            owner.setState(owner.getState(0));
        }, 30000);
 
        context.WallSwitches.logger.debug(this._timer);

 
        return this;
    }


    /**
     * Add the state to the WallSwitch
     * @param {context.WallSwitches.StateWallSwitch} state 
     * @returns {context.WallSwitches.WallSwitch} 
     */
    context.WallSwitches.WallSwitch.prototype.addState = function (state) {
        if (!Array.isArray(state)) {
            state = [state];
        }

        for (var i = 0; i < state.length; i++) {
            this._states[state[i].id()] = state[i];
            state[i].owner(this);
        }

    }

    /**
     * Gets an state of the WallSwitch
     * @param {string|number} idOrIndex The id or the index of the state 
     * @returns {context.WallSwitches.StateWallSwitch} 
     */

     context.WallSwitches.WallSwitch.prototype.getState = function (idOrIndex) {

        if (typeof idOrIndex === "string") {
            return this._states[idOrIndex];
        } else if (typeof idOrIndex === "number") {
            return this._states[Object.keys(this._states)[idOrIndex]];
        } else {
            return null
        }

    }

    /**
     * Sets state in the WallSwitch
     * @param {context.WallSwitches.StateWallSwitch} nextState next state 
     * @returns {context.WallSwitches.WallSwitch} 
     */
    context.WallSwitches.WallSwitch.prototype.setState = function (nextState) {
        nextState._enter();
        nextState.publishSetState();
    }


    /**
     * Publish to MQTT the topic to set the first state
     * @param {string} id of the state 
     * @returns {context.WallSwitches.WallSwitch} 
     */
    context.WallSwitches.WallSwitch.prototype.initialize = function () {
        context.WallSwitches.logger.info("initializing {}({})", [this.name(), this.id()]);
        this.getState(0).publishSetState();

        return this;
    };

    /**
     * check the validity of an status
     * @param {string} id Id of the state
     * @returns {boolean} true if is valid
     */
    context.WallSwitches.WallSwitch.prototype.statusIsValid = function (status) {
        return this.getState(status) !== null;
    };

    /**
     * Special WallSwitch with an state to toggle two items 
     * @constructor
     * @param {string} id 
     * @param {string} name 
     * @param {object} items Definition of the equipment
     * @param {string} items.equipment Equipment item name
     * @param {string} items.left Left button status item name
     * @param {string} items.right Right button status item name
     * @param {string} items.both Both buttons status item name
     * @param {string} items.status Equipment state item name
     * @param {string} items.initialize Equipment initialization command item name
     * @param {object} toggleStateDescription Description of the 2 toggle state
     * @param {string} toggleStateDescription.id Id of the state
     * @param {string} toggleStateDescription.text Text of the state
     * @param {string} toggleStateDescription.leftItemName Name of the item to toggle on left
     * @param {string} toggleStateDescription.rightItemName Name of the item to toggle on right
     */
    context.WallSwitches.TwoTogglesWallSwitch = function (id, name, items, toggleStateDescription) {
        context.WallSwitches.WallSwitch.call(this, id, name, items);

        this.addState(
            context.WallSwitches.StateWallSwitch.get2TogglesState(
                toggleStateDescription.id,
                toggleStateDescription.text,
                toggleStateDescription.leftItemName,
                toggleStateDescription.rightItemName
            )
        );
    }

    //-- Prototype chain
    context.WallSwitches.TwoTogglesWallSwitch.prototype = Object.create(context.WallSwitches.WallSwitch.prototype);
    context.WallSwitches.TwoTogglesWallSwitch.prototype.constructor = context.WallSwitches.TwoTogglesWallSwitch;


    /**
     * Special WallSwitch with an state to toggle two items and another three to conrol a blind
     * @constructor
     * @param {string} id 
     * @param {string} name 
     * @param {object} items Definition of the equipment
     * @param {string} items.equipment Equipment item name
     * @param {string} items.left Left button status item name
     * @param {string} items.right Right button status item name
     * @param {string} items.both Both buttons status item name
     * @param {string} items.status Equipment state item name
     * @param {string} items.initialize Equipment initialization command item name
     * @param {object} toggleStateDescription Description of the 2 toggle state
     * @param {string} toggleStateDescription.id Id of the state
     * @param {string} toggleStateDescription.text Text of the state
     * @param {string} toggleStateDescription.leftItemName Name of the item to toggle on left
     * @param {string} toggleStateDescription.rightItemName Name of the item to toggle on right
     * @param {object} blindStatesDescription Description of the blind states
     * @param {string} blindStatesDescription.id Id of the state
     * @param {string} blindStatesDescription.text Text of the state
     * @param {string} blindStatesDescription.controlItemName Name of the control item
     */
    context.WallSwitches.TwoTogglesOneBlind = function (id, name, items, toggleStateDescription, blindStatesDescription) {
        context.WallSwitches.TwoTogglesWallSwitch.call(this, id, name, items, toggleStateDescription);

        var twoTogglesState = this.getState(0);

        var blindStates = context.WallSwitches.StateWallSwitch.createPersianaStates(
            blindStatesDescription.id,
            blindStatesDescription.text,
            blindStatesDescription.controlItemName,
            twoTogglesState
        )

        this.addState(blindStates);

        twoTogglesState.both(
            function (command) {
                if (command.toFullString() === "click") {
                    // move to idle
                    twoTogglesState.owner().setState(blindStates[0]);
                }
        });

    }

    //-- Prototype chain
    context.WallSwitches.TwoTogglesOneBlind.prototype = Object.create(context.WallSwitches.TwoTogglesWallSwitch.prototype);
    context.WallSwitches.TwoTogglesOneBlind.prototype.constructor = context.WallSwitches.TwoTogglesOneBlind;


    /**
     * Special WallSwitch with an state to toggle two items and another six to conrol two blinds
     * @constructor
     * @param {string} id 
     * @param {string} name 
     * @param {object} items Definition of the equipment
     * @param {string} items.equipment Equipment item name
     * @param {string} items.left Left button status item name
     * @param {string} items.right Right button status item name
     * @param {string} items.both Both buttons status item name
     * @param {string} items.status Equipment state item name
     * @param {string} items.initialize Equipment initialization command item name
     * @param {object} toggleStateDescription Description of the 2 toggle state
     * @param {string} toggleStateDescription.id Id of the state
     * @param {string} toggleStateDescription.text Text of the state
     * @param {string} toggleStateDescription.leftItemName Name of the item to toggle on left
     * @param {string} toggleStateDescription.rightItemName Name of the item to toggle on right
     * @param {object} blindStatesDescription Description of the first blind states
     * @param {string} blindStatesDescription.id Id of the state
     * @param {string} blindStatesDescription.text Text of the state
     * @param {string} blindStatesDescription.controlItemName Name of the control item
     * @param {object} blindStatesDescription Description of the second blind states
     * @param {string} blindStatesDescription.id Id of the state
     * @param {string} blindStatesDescription.text Text of the state
     * @param {string} blindStatesDescription.controlItemName Name of the control item* 
     */
    context.WallSwitches.TwoTogglesTwoBlinds = function (id, name, items, toggleStateDescription, firstBlindStatesDescription, secondBlindStatesDescription) {
        context.WallSwitches.TwoTogglesOneBlind.call(this, id, name, items, toggleStateDescription, firstBlindStatesDescription);

        var TwoTogglesState = this.getState(0);

        var secondBlindStates = context.WallSwitches.StateWallSwitch.createPersianaStates(
            secondBlindStatesDescription.id,
            secondBlindStatesDescription.text,
            secondBlindStatesDescription.controlItemName,
            TwoTogglesState
        )

        this.addState(secondBlindStates);

        var setSecondBlindState = function (command) {
            if (command.toFullString() === "click") {
                context.WallSwitches.logger.debug("Moving to secondBlind State");
                TwoTogglesState.owner().setState(secondBlindStates[0]);
            }
        }


        this.getState(1).both(setSecondBlindState);
        this.getState(2).both(setSecondBlindState);
        this.getState(3).both(setSecondBlindState);


    };

    //-- Prototype chain
    context.WallSwitches.TwoTogglesTwoBlinds.prototype = Object.create(context.WallSwitches.TwoTogglesOneBlind.prototype);
    context.WallSwitches.TwoTogglesTwoBlinds.prototype.constructor = context.WallSwitches.TwoTogglesTwoBlinds;


    /**
     * Gets an Equipment by his id
     * @param {string} id Id of the element to return
     * @returns {context.WallSwitches.WallSwitch|null} If id is valid, returns the equipment else null
     */
    context.WallSwitches.getEquipmentById = function (id) {
        foreach(var equipment in context.WallSwitches.equipments) {
            if (equipment.id() === id) return equipment;
        }

        return null;
    }

    /**
     * Gets an Equipment by his id
     * @param {string} id Id of the element to return
     * @returns {context.WallSwitches.WallSwitch|null} If id is valid, returns the equipment else null
     */
    context.WallSwitches.getEquipmentByItemName = function (itenName) {
        for each(var equipment in context.WallSwitches.equipments) {
            for each(var item in equipment.items) {
                if (item === itenName) {
                    return equipment;
                }
            }
        }


        return null;
    }


    /**
     * check the validity of an id
     * @param {string} id Id to check
     * @returns {context.WallSwitches.WallSwitch|null} true if an equipment with the id exists
     */
    context.WallSwitches.idIsValid = function (id) {
        return context.WallSwitches.getEquipmentById(id) !== null;
    };

    /**
     * check the validity of a button
     * @param {string} button Button to check
     * @returns {context.WallSwitches.WallSwitch|null} true if it is valid
     */
    context.WallSwitches.buttonIsValid = function (button) {
        for (var i = 0; i < context.WallSwitches.buttons.length; i++) {
            if (context.WallSwitches.buttons[i] === button) {
                return true;
            }
        }

        return false;
    };

    /**
     * check the validity of a value
     * @param {string} value Value to check
     * @returns {context.WallSwitches.WallSwitch|null} true if it is valid
     */
    context.WallSwitches.valueIsValid = function (value) {
        for (var i = 0; i < context.WallSwitches.values.length; i++) {
            if (context.WallSwitches.values[i] === value) {
                return true;
            }
        }

        return false;
    };




    /**
     * check the validity of an id
     * @param {string} id Id of the element to return
     * @returns {context.WallSwitches.WallSwitch|null} true if an equipment with the id exists
     */
    context.WallSwitches.parseInitializationRequest = function (id) {

        var equipment = context.WallSwitches.getEquipmentById(id);

        if (!equipment) {
            throw "Invalid Id";
        }

        events.sendCommand(equipment.items.initialize, ON);
    };


    /**
     * Parse a command receive for an equipment
     * @param {string} id 
     * @param {string} status 
     * @param {string} button 
     * @param {string} value 
     */
    context.WallSwitches.parseCommand = function (id, status, button, value) {

        var equipment = context.WallSwitches.getEquipmentById(id);

        if (!equipment) {
            throw "Invalid Id";
        } else if (!equipment.statusIsValid(status)) {
            throw "Invalid status";
        } else if (!context.WallSwitches.buttonIsValid(button)) {
            throw "Invalid status";
        } else if (!context.WallSwitches.valueIsValid(value)) {
            context.WallSwitches.logger.debug(value);
            throw "Invalid value";
        }


        // the status is an status ;)
        events.postUpdate(equipment.items.status, status);
        events.sendCommand(equipment.items[button], value);

        
    };


    // The definition of the WallSwitches is not overrided

    if (context.WallSwitches.equipments.length == 0) {

        context.WallSwitches.logger.debug("Defining WallSwitch WC...");

        context.WallSwitches.equipments.push(
            new context.WallSwitches.TwoTogglesWallSwitch(
                "1E0000000001",
                "MandoWC",
                {
                    equipment: "MandoBano",
                    left: "MandoBanoLeft",
                    right: "MandoBanoRight",
                    both: "MandoBanoBoth",
                    status: "MandoBanoStatus",
                    initialize: "MandoBanoInitialize"
                },
                {
                    id: "luz",
                    text: "Luces",
                    leftItemName: "LuzBanoEspejoEstado",
                    rightItemName: "LuzBanoEstado"
                }
            )
        );


        context.WallSwitches.logger.debug("Defining WallSwitch Sala...");
        context.WallSwitches.equipments.push(
            new context.WallSwitches.TwoTogglesOneBlind(
                "1E0000000002",
                "MandoSala",
                {
                    equipment: "MandoSala",
                    left: "MandoSalaLeft",
                    right: "MandoSalaRight",
                    both: "MandoSalaBoth",
                    status: "MandoSalaStatus",
                    initialize: "MandoSalaInitialize"
                },
                {
                    id: "luz",
                    text: "Luces",
                    leftItemName: "LuzSalaEstado",
                    rightItemName: "LuzHallEstado"
                },
                {
                    id: "persiana",
                    text: "Persiana",
                    controlItemName: "PersianaSalaControl"
                }
            )
        );


        context.WallSwitches.logger.debug("Defining WallSwitch Mia...");
        context.WallSwitches.equipments.push(
            new context.WallSwitches.TwoTogglesTwoBlinds(
                "1E0000000003",
                "MandoMia",
                {
                    equipment: "MandoPrincipal",
                    left: "MandoMiaLeft",
                    right: "MandoMiaRight",
                    both: "MandoMiaBoth",
                    status: "MandoMiaStatus",
                    initialize: "MandoMiaInitialize"
                },
                {
                    id: "luz",
                    text: "Luces",
                    leftItemName: "LuzMiaEstado",
                    rightItemName: "LuzMiaMesillaIzquiedaEstado"
                },
                {
                    id: "persiana_puerta",
                    text: "Puerta",
                    controlItemName: "PersianaPuertaMiaControl"
                },
                {
                    id: "persiana_ventana",
                    text: "Ventana",
                    controlItemName: "PersianaVentanaMiaControl"
                }
            )
        );



        context.WallSwitches.logger.debug("Defining WallSwitch Irai...");
        context.WallSwitches.equipments.push(
            new context.WallSwitches.TwoTogglesOneBlind(
                "1E0000000004",
                "MandoIrai",
                {
                    equipment: "MandoIrai",
                    left: "MandoIraiLeft",
                    right: "MandoIraiRight",
                    both: "MandoIraiBoth",
                    status: "MandoIraiStatus",
                    initialize: "MandoIraiInitialize"
                },
                {
                    id: "luz",
                    text: "Luces",
                    leftItemName: "LuzIraiApliqueEstado",
                    rightItemName: "LuzIraiEstado"
                },
                {
                    id: "persiana",
                    text: "Persiana",
                    controlItemName: "PersianaIraiControl"
                }
            )
        );


        context.WallSwitches.logger.debug("Defining WallSwitch Ekain...");
        context.WallSwitches.equipments.push(
            new context.WallSwitches.TwoTogglesOneBlind(
                "1E0000000005",
                "MandoEkain",
                {
                    equipment: "MandoEkain",
                    left: "MandoEkainLeft",
                    right: "MandoEkainRight",
                    both: "MandoEkainBoth",
                    status: "MandoEkainStatus",
                    initialize: "MandoEkainInitialize"
                },
                {
                    id: "luz",
                    text: "Luces",
                    leftItemName: "LuzEkainEstado",
                    rightItemName: "LuzEkainApliqueEstado"
                },
                {
                    id: "persiana",
                    text: "Persiana",
                    controlItemName: "PersianaEkainControl"
                }
            )
        );


        context.WallSwitches.logger.debug("Defining WallSwitch Estudio...");

        context.WallSwitches.equipments.push(
            new context.WallSwitches.TwoTogglesOneBlind(
                "1E0000000006",
                "MandoEstudio",
                {
                    equipment: "MandoEstudio",
                    left: "MandoEstudioLeft",
                    right: "MandoEstudioRight",
                    both: "MandoEstudioBoth",
                    status: "MandoEstudioStatus",
                    initialize: "MandoEstudioInitialize"
                },
                {
                    id: "luz",
                    text: "Luces",
                    leftItemName: "LuzEstudioEstado",
                    rightItemName: "LuzEstudioEstado"
                },
                {
                    id: "persiana",
                    text: "Persiana",
                    controlItemName: "PersianaEstudioControl"
                }
            )
        );



        context.WallSwitches.logger.debug("Defining WallSwitch Cocina...");
        context.WallSwitches.equipments.push(
            new context.WallSwitches.TwoTogglesTwoBlinds(
                "1E0000000007",
                "MandoCocina",
                {
                    equipment: "MandoCocina",
                    left: "MandoCocinaLeft",
                    right: "MandoCocinaRight",
                    both: "MandoCocinaBoth",
                    status: "MandoCocinaStatus",
                    initialize: "MandoCocinaInitialize"
                },
                {
                    id: "luz",
                    text: "Luces",
                    leftItemName: "LuzCocinaEstado",
                    rightItemName: "LuzCocinaArmariosEstado"
                },
                {
                    id: "persiana_puerta",
                    text: "Puerta",
                    controlItemName: "PersianaPuertaCocinaControl"
                },
                {
                    id: "persiana_ventana",
                    text: "Ventana",
                    controlItemName: "PersianaVentanaCocinaControl"
                }
            )
        );


        context.WallSwitches.logger.debug("Defining WallSwitch Hall...");
        context.WallSwitches.equipments.push(
            new context.WallSwitches.TwoTogglesOneBlind(
                "1E0000000008",
                "MandoHall",
                {
                    equipment: "MandoHall",
                    left: "MandoHallLeft",
                    right: "MandoHallRight",
                    both: "MandoHallBoth",
                    status: "MandoHallStatus",
                    initialize: "MandoHallInitialize"
                },
                {
                    id: "luz",
                    text: "Luces",
                    leftItemName: "LuzSalaEstado",
                    rightItemName: "LuzHallEstado"
                },
                {
                    id: "persiana",
                    text: "Persiana",
                    controlItemName: "PersianaSalaControl"
                }
            )
        );
    }


}(this);


/*
// Bano

Group MandoBano "Mando Baño" (Bano) [Equipment]
String MandoBanoLeft "Izquierdo" (MandoBano) [Status]
String MandoBanoRight "Derecho" (MandoBano) [Status]
String MandoBanoBoth "Ambos" (MandoBano) [Status]
String MandoBanoStatus "Estado" (MandoBano) [Status]
Switch MandoBanoInitialize "Inicializar" (MandoBano) [Point]

// Sala

Group MandoSala "Mando Sala" (Sala) [Equipment]
String MandoSalaLeft "Izquierdo" (MandoSala) [Status]
String MandoSalaRight "Derecho" (MandoSala) [Status]
String MandoSalaBoth "Ambos" (MandoSala) [Status]
String MandoSalaStatus "Estado" (MandoSala) [Status]
Switch MandoSalaInitialize "Inicializar" (MandoSala) [Point]


// Mia

Group MandoMia "Mando Mia" (Mia) [Equipment]
String MandoMiaLeft "Izquierdo" (MandoMia) [Status]
String MandoMiaRight "Derecho" (MandoMia) [Status]
String MandoMiaBoth "Ambos" (MandoMia) [Status]
String MandoMiaStatus "Estado" (MandoMia) [Status]
Switch MandoMiaInitialize "Inicializar" (MandoMia) [Point]

// Irai

Group MandoIrai "Mando Irai" (Irai) [Equipment]
String MandoIraiLeft "Izquierdo" (MandoIrai) [Status]
String MandoIraiRight "Derecho" (MandoIrai) [Status]
String MandoIraiBoth "Ambos" (MandoIrai) [Status]
String MandoIraiStatus "Estado" (MandoIrai) [Status]
Switch MandoIraiInitialize "Inicializar" (MandoIrai) [Point]

// Ekain

Group MandoEkain "Mando Ekain" (Ekain) [Equipment]
String MandoEkainLeft "Izquierdo" (MandoEkain) [Status]
String MandoEkainRight "Derecho" (MandoEkain) [Status]
String MandoEkainBoth "Ambos" (MandoEkain) [Status]
String MandoEkainStatus "Estado" (MandoEkain) [Status]
Switch MandoEkainInitialize "Inicializar" (MandoEkain) [Point]

// Estudio

Group MandoEstudio "Mando Estudio" (Estudio) [Equipment]
String MandoEstudioLeft "Izquierdo" (MandoEstudio) [Status]
String MandoEstudioRight "Derecho" (MandoEstudio) [Status]
String MandoEstudioBoth "Ambos" (MandoEstudio) [Status]
String MandoEstudioStatus "Estado" (MandoEstudio) [Status]
Switch MandoEstudioInitialize "Inicializar" (MandoEstudio) [Point]

// Cocina

Group MandoCocina "Mando Cocina" (Cocina) [Equipment]
String MandoCocinaLeft "Izquierdo" (MandoCocina) [Status]
String MandoCocinaRight "Derecho" (MandoCocina) [Status]
String MandoCocinaBoth "Ambos" (MandoCocina) [Status]
String MandoCocinaStatus "Estado" (MandoCocina) [Status]
Switch MandoCocinaInitialize "Inicializar" (MandoCocina) [Point]

// Hall

Group MandoHall "Mando Hall" (Hall) [Equipment]
String MandoHallLeft "Izquierdo" (MandoHall) [Status]
String MandoHallRight "Derecho" (MandoHall) [Status]
String MandoHallBoth "Ambos" (MandoHall) [Status]
String MandoHallStatus "Estado" (MandoHall) [Status]
Switch MandoHallInitialize "Inicializar" (MandoHall) [Point]
*/