const {WallSwitches} = require("./wall-switches");
const { TwoTogglesOneBlind } = require('./two-toggles-one-blind');
const { TwoTogglesTwoBlinds } = require('./two-toggles-two-blinds');
const { TwoTogglesWallSwitch } = require('./two-toggles-wall-switch');

console.debug("Defining WallSwitch WC...");

WallSwitches.equipments.push(
    new TwoTogglesWallSwitch(
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


console.debug("Defining WallSwitch Sala...");
WallSwitches.equipments.push(
    new TwoTogglesOneBlind(
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


console.debug("Defining WallSwitch Mia...");
WallSwitches.equipments.push(
    new TwoTogglesTwoBlinds(
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



console.debug("Defining WallSwitch Irai...");
WallSwitches.equipments.push(
    new TwoTogglesOneBlind(
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


console.debug("Defining WallSwitch Ekain...");
WallSwitches.equipments.push(
    new TwoTogglesOneBlind(
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


console.debug("Defining WallSwitch Estudio...");

WallSwitches.equipments.push(
    new TwoTogglesOneBlind(
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



console.debug("Defining WallSwitch Cocina...");
WallSwitches.equipments.push(
    new TwoTogglesTwoBlinds(
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


console.debug("Defining WallSwitch Hall...");
WallSwitches.equipments.push(
    new TwoTogglesOneBlind(
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
