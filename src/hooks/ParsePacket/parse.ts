export default class GalileoParsePacket {
    client: number;
    packetID: number;
    navigationTimestamp: number;
    receivedTimestamp: number;
    latitude: number;
    longitude: number;
    speed: number;
    pdop: number;
    hdop: number;
    vdop: number;
    nsat: number;
    ns: number;
    course: number;
    hardwareVersion: number;
    firmwareVersion: number;
    imei: string;
    height: number;
    deviceStatus: number;
    supplyVoltage: number;
    batteryVoltage: number;
    temperature: number;
    accelX: number;
    accelY: number;
    accelZ: number;
    outputStatus: number;
    inputStatus: number;
    inputVoltage0: number;
    inputVoltage1: number;
    inputVoltage2: number;
    inputVoltage3: number;
    inputVoltage4: number;
    inputVoltage5: number;
    inputVoltage6: number;
    inputVoltage7: number;
    rs485a: number;
    rs485b: number;
    rs485c: number;
    can8bitr0: number;
    can8bitr1: number;
    can8bitr2: number;
    can16bitr0: number;

    constructor() {
        this.hardwareVersion = 0;
        this.firmwareVersion = 0;
        this.imei = "";
        this.client = 0;
        this.packetID = 0;
        this.navigationTimestamp = 0;
        this.receivedTimestamp = 0;
        this.latitude = 0.0;
        this.longitude = 0.0;
        this.speed = 0;
        this.height = 0;
        this.deviceStatus = 0;
        this.supplyVoltage = 0;
        this.batteryVoltage = 0;
        this.temperature = 0;
        this.accelX = 0;
        this.accelY = 0;
        this.accelZ = 0;
        this.pdop = 0;
        this.hdop = 0;
        this.vdop = 0;
        this.nsat = 0;
        this.ns = 0;
        this.course = 0;
        this.outputStatus = 0;
        this.inputStatus = 0;
        this.inputVoltage0 = 0;
        this.inputVoltage1 = 0;
        this.inputVoltage2 = 0;
        this.inputVoltage3 = 0;
        this.inputVoltage4 = 0;
        this.inputVoltage5 = 0;
        this.inputVoltage6 = 0;
        this.inputVoltage7 = 0;
        this.rs485a = 0;
        this.rs485b = 0;
        this.rs485c = 0;
        this.can8bitr0 = 0;
        this.can8bitr1 = 0;
        this.can8bitr2 = 0;
        this.can16bitr0 = 0;
    }

    save() {
        const result = JSON.stringify(this, null, 2); // Use null, 2 para formatar o JSON
        return result;
    }
}