import { Buffer } from "buffer";
import { useState } from "react";

class GalileoParsePacket {
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
    anSensors: AnSensor[];
    liquidSensors: LiquidSensor[];

    constructor() {
        this.client = 0;
        this.packetID = 0;
        this.navigationTimestamp = 0;
        this.receivedTimestamp = 0;
        this.latitude = 0.0;
        this.longitude = 0.0;
        this.speed = 0;
        this.pdop = 0;
        this.hdop = 0;
        this.vdop = 0;
        this.nsat = 0;
        this.ns = 0;
        this.course = 0;
        this.anSensors = [];
        this.liquidSensors = [];
    }

    save() {
        const result = JSON.stringify(this, null, 2); // Use null, 2 para formatar o JSON
        return result;
    }
}

class LiquidSensor {
    sensorNumber: number;
    valueMm: number;
    valueL: number;

    constructor() {
        this.sensorNumber = 0;
        this.valueMm = 0;
        this.valueL = 0;
    }
}

class AnSensor {
    sensorNumber: number;
    value: number;

    constructor() {
        this.sensorNumber = 0;
        this.value = 0;
    }
}

class Tag {
    tag: number;
    value: any;

    constructor() {
        this.tag = 0;
        this.value = new UintTag();
    }

    setValue(tagType: string, val: Buffer) {
        let v;

        switch (tagType) {
            case "uint":
                v = new UintTag();
                break;
            case "string":
                v = new StringTag();
                break;
            case "time":
                v = new TimeTag();
                break;
            case "coord":
                v = new CoordTag();
                break;
            case "speed":
                v = new SpeedTag();
                break;
            case "accel":
                v = new AccelTag();
                break;
            case "int":
                v = new IntTag();
                break;
            case "bitstring":
                v = new BitsTag();
                break;
            default:
                return new Error(`Tipo de dados desconhecido: ${tagType}`);
        }

        if (!v) {
            return new Error("Ponteiro de tag inválido");
        }

        try{
            v.parse(val);
        } catch (error){
            return error;
        }

        this.value = v;
        return null;
    }
}

class UintTag {
    val: number;

    constructor(val = 0) {
        this.val = val;
    }

    parse(val: Buffer) {
        const size = val.length;
        if (size === 1) {
            this.val = val[0];
        } else if (size === 2) {
            this.val = val.readUInt16LE(0);
        } else {
            throw new Error(`Matriz de entrada maior que 2 bytes: ${val.toString("hex")}`);
        }
    }
}

class StringTag {
    val: string;

    constructor(val = '') {
        this.val = val;
    }

    parse(val: Buffer) {
        const size = val.length;
        if (size === 15) {
            this.val = val.toString();
        } else {
            throw new Error(`Matriz de entrada com tamanho diferente de 15 bytes: ${val}`);
        }

    }
}

class TimeTag {
    val: Date;
    
    constructor(val = new Date()) {
        this.val = val;
    }

    parse(val: Buffer) {
        if (val.length !== 4) {
            throw new Error(`Matriz de entrada com tamanho incorreto para tag de tempo: ${val.toString("hex")}`);
        }
        const secs = val.readUInt32LE();
        this.val = new Date(secs * 1000); // Multiplica por 1000 para obter milissegundos
    }
}

class CoordTag {
    nsat: number;
    isValid: number;
    longitude: number;
    latitude: number;

    constructor(val = [0, 0, 0, 0]) {
        this.nsat = val[0];
        this.isValid = val[1];
        this.longitude = val[2];
        this.latitude = val[3];

    }

    parse(val: Buffer) {
        if (val.length !== 9) {
            throw new Error(`Matriz de entrada com tamanho incorreto para tag de coordenadas: ${val.toString("hex")}`);
        }
        const flgByte = val[0];
        this.latitude = val.readInt32LE(1) / 1000000;
        this.longitude = val.readInt32LE(5) / 1000000;
        this.nsat = flgByte & 0x0F;
        this.isValid = (flgByte >> 4) & 0x0F;
    }
}

class SpeedTag {
    speed: number;
    course: number;
    val: number;

    constructor(val = [0, 0]) {
        this.speed = val[0];
        this.course = val[1];
        this.val = 0;
    }

    parse(val: Buffer) {
        if (val.length !== 4) {
            throw new Error(`Matriz de entrada com tamanho incorreto para tag de velocidade: ${val.toString("hex")}`);
        }
        this.speed = val.readUInt16LE(0) / 10;
        this.course = val.readUInt16LE(2) / 10;
    }
}

class AccelTag {
    x: number;
    y: number;
    z: number;
    val: number;

    constructor(val = [0, 0, 0]) {
        this.x = val[0];
        this.y = val[1];
        this.z = val[2];
        this.val = 0;
    }

    parse(val: Buffer) {
        if (val.length !== 4) {
            throw new Error(`Matriz de entrada com tamanho incorreto para tag de aceleração: ${val.toString("hex")}`);
        }
        this.x = val.readUInt16LE(0) & 0x03FF;
        this.y = (val.readUInt16LE(1) & 0x0FFC) >> 2;
        this.z = (val.readUInt16LE(2) & 0x3FF0) >> 4;
    }
}

class IntTag {
    val: number;

    constructor(val = 0) {
        this.val = val;
    }

    parse(val: Buffer) {
        const size = val.length;
        if (size === 1) {
            this.val = val.readInt8(0);
        } else if (size === 2) {
            this.val = val.readInt16LE(0);
        } else {
            throw new Error(`Matriz de entrada maior que 2 bytes: ${val.toString("hex")}`);
        }
    }
}

class BitsTag {
    val: string;

    constructor(val = '') {
        this.val = val;
    }

    parse(val: Buffer) {
        const size = val.length;
        if (size === 1) {
            this.val = val[0].toString(2).padStart(8, '0');
        } else if (size === 2) {
            this.val = val.readUInt16LE(0).toString(2).padStart(16, '0');
        } else {
            throw new Error(`Matriz de entrada maior que 2 bytes: ${val.toString("hex")}`);
        }
    }
}

class TagDesc {
    Len: number;
    Type: string;

    constructor(len: number, type: string) {
        this.Len = len;
        this.Type = type;
    }
}

interface ParsePacketApi {
    handleRecvPkg: (packet: Buffer) => void;
    outParsedPkg: GalileoParsePacket;
}

const headerLen = 3;

function useParsepacket(): ParsePacketApi {

    const [outParsedPkg, setOutParsedPkg] = useState<GalileoParsePacket>(new GalileoParsePacket())

    class Packet {
        header: number;
        length: number;
        tags: Tag[];
        crc: number;
    
        constructor() {
            this.header = 0;
            this.length = 0;
            this.tags = [];
            this.crc = 0;
        }
    
        decode(pkg: Buffer) {
            if (!Buffer.isBuffer(pkg)) {
                pkg = Buffer.from(pkg);
            }
    
            let pos = 0;
            const paketBodyLen = pkg.length - 2; // sem o checksum
    
            // Lê e verifica o CRC
            this.crc = pkg.readUInt16LE(paketBodyLen);
            if (crc16(pkg.slice(0, paketBodyLen)) !== this.crc) {
                throw new Error("Crc do pacote não corresponde");
            }
    
            // Lê o cabeçalho
            this.header = pkg.readUInt8(pos);
            pos++;
    
            // Lê o comprimento
            this.length = pkg.readUInt16LE(pos);
            pos += 2;
    
            const lenBits = this.length.toString(2);
            if (lenBits.length < 1) {
                throw new Error("Comprimento do pacote incorreto");
            }
    
            if (lenBits[0] === "1") {
                this.length = this.length & 0x7FFF; // Se houver dados não enviados, limpe o bit mais significativo
            }
    
            // Decodifica os tags
            while (pos < paketBodyLen) {
                const tag = new Tag();
                tag.tag = pkg.readUInt8(pos);
                pos++;
    
                if (tagsTable.has(tag.tag)) {
                    const tagInfo = tagsTable.get(tag.tag);
                    const tagVal = Buffer.alloc(tagInfo!.Len);
                    pkg.copy(tagVal, 0, pos, pos + tagInfo!.Len);
                    pos += tagInfo!.Len;
    
                    tag.setValue(tagInfo!.Type, tagVal);
                    this.tags.push(tag);
                } else {
                    throw new Error(`Informações sobre a tag ${tag.tag.toString(16)} não encontradas`);
                }
            }
        }
    }

    function crc16(data: Buffer) {
        const mbTable = [
            0x0000, 0xC0C1, 0xC181, 0x0140, 0xC301, 0x03C0, 0x0280, 0xC241,
            0xC601, 0x06C0, 0x0780, 0xC741, 0x0500, 0xC5C1, 0xC481, 0x0440,
            0xCC01, 0x0CC0, 0x0D80, 0xCD41, 0x0F00, 0xCFC1, 0xCE81, 0x0E40,
            0x0A00, 0xCAC1, 0xCB81, 0x0B40, 0xC901, 0x09C0, 0x0880, 0xC841,
            0xD801, 0x18C0, 0x1980, 0xD941, 0x1B00, 0xDBC1, 0xDA81, 0x1A40,
            0x1E00, 0xDEC1, 0xDF81, 0x1F40, 0xDD01, 0x1DC0, 0x1C80, 0xDC41,
            0x1400, 0xD4C1, 0xD581, 0x1540, 0xD701, 0x17C0, 0x1680, 0xD641,
            0xD201, 0x12C0, 0x1380, 0xD341, 0x1100, 0xD1C1, 0xD081, 0x1040,
            0xF001, 0x30C0, 0x3180, 0xF141, 0x3300, 0xF3C1, 0xF281, 0x3240,
            0x3600, 0xF6C1, 0xF781, 0x3740, 0xF501, 0x35C0, 0x3480, 0xF441,
            0x3C00, 0xFCC1, 0xFD81, 0x3D40, 0xFF01, 0x3FC0, 0x3E80, 0xFE41,
            0xFA01, 0x3AC0, 0x3B80, 0xFB41, 0x3900, 0xF9C1, 0xF881, 0x3840,
            0x2800, 0xE8C1, 0xE981, 0x2940, 0xEB01, 0x2BC0, 0x2A80, 0xEA41,
            0xEE01, 0x2EC0, 0x2F80, 0xEF41, 0x2D00, 0xEDC1, 0xEC81, 0x2C40,
            0xE401, 0x24C0, 0x2580, 0xE541, 0x2700, 0xE7C1, 0xE681, 0x2640,
            0x2200, 0xE2C1, 0xE381, 0x2340, 0xE101, 0x21C0, 0x2080, 0xE041,
            0xA001, 0x60C0, 0x6180, 0xA141, 0x6300, 0xA3C1, 0xA281, 0x6240,
            0x6600, 0xA6C1, 0xA781, 0x6740, 0xA501, 0x65C0, 0x6480, 0xA441,
            0x6C00, 0xACC1, 0xAD81, 0x6D40, 0xAF01, 0x6FC0, 0x6E80, 0xAE41,
            0xAA01, 0x6AC0, 0x6B80, 0xAB41, 0x6900, 0xA9C1, 0xA881, 0x6840,
            0x7800, 0xB8C1, 0xB981, 0x7940, 0xBB01, 0x7BC0, 0x7A80, 0xBA41,
            0xBE01, 0x7EC0, 0x7F80, 0xBF41, 0x7D00, 0xBDC1, 0xBC81, 0x7C40,
            0xB401, 0x74C0, 0x7580, 0xB541, 0x7700, 0xB7C1, 0xB681, 0x7640,
            0x7200, 0xB2C1, 0xB381, 0x7340, 0xB101, 0x71C0, 0x7080, 0xB041,
            0x5000, 0x90C1, 0x9181, 0x5140, 0x9301, 0x53C0, 0x5280, 0x9241,
            0x9601, 0x56C0, 0x5780, 0x9741, 0x5500, 0x95C1, 0x9481, 0x5440,
            0x9C01, 0x5CC0, 0x5D80, 0x9D41, 0x5F00, 0x9FC1, 0x9E81, 0x5E40,
            0x5A00, 0x9AC1, 0x9B81, 0x5B40, 0x9901, 0x59C0, 0x5880, 0x9841,
            0x8801, 0x48C0, 0x4980, 0x8941, 0x4B00, 0x8BC1, 0x8A81, 0x4A40,
            0x4E00, 0x8EC1, 0x8F81, 0x4F40, 0x8D01, 0x4DC0, 0x4C80, 0x8C41,
            0x4400, 0x84C1, 0x8581, 0x4540, 0x8701, 0x47C0, 0x4680, 0x8641,
            0x8201, 0x42C0, 0x4380, 0x8341, 0x4100, 0x81C1, 0x8081, 0x4040,
        ];

        let crc = 0xFFFF;
        for (let i = 0; i < data.length; i++) {
            const n = (data[i] ^ crc) & 0xFF;
            crc >>= 8;
            crc ^= mbTable[n];
        }
        return crc;
    }

    const tagsTable = new Map([
        [0x01, new TagDesc(1, "uint")],
        [0x02, new TagDesc(1, "uint")],
        [0x03, new TagDesc(15, "string")],
        [0x04, new TagDesc(2, "uint")],
        [0x10, new TagDesc(2, "uint")],
        [0x20, new TagDesc(4, "time")],
        [0x30, new TagDesc(9, "coord")],
        [0x33, new TagDesc(4, "speed")],
        [0x34, new TagDesc(2, "int")],
        [0x35, new TagDesc(1, "uint")],
        [0x40, new TagDesc(2, "bitstring")],
        [0x41, new TagDesc(2, "uint")],
        [0x42, new TagDesc(2, "uint")],
        [0x43, new TagDesc(1, "int")],
        [0x44, new TagDesc(4, "accel")],
        [0x45, new TagDesc(2, "bitstring")],
        [0x46, new TagDesc(2, "bitstring")],
        [0x50, new TagDesc(2, "uint")],
        [0x51, new TagDesc(2, "uint")],
        [0x52, new TagDesc(2, "uint")],
        [0x53, new TagDesc(2, "uint")],
        [0x54, new TagDesc(2, "uint")],
        [0x55, new TagDesc(2, "uint")],
        [0x56, new TagDesc(2, "uint")],
        [0x57, new TagDesc(2, "uint")],
        [0x60, new TagDesc(2, "uint")],
        [0x61, new TagDesc(2, "uint")],
        [0x62, new TagDesc(2, "uint")],
        // Incluir mais tags se necessário
    ]);

    const handleRecvPkg = (packet: Buffer) => {
        let recvPacket;
        let outPkg = new GalileoParsePacket();

        const data = packet.slice(4, packet.length);
        const headerBuf = data.slice(0, headerLen);
        const tag = headerBuf[0];

        if (tag !== 0x01) {
            console.log("Pacote não está no formato Galileo");
            return;
        }

        const pkgLen = data.readUInt16LE(1) & 0x7FFF;
        const buf = data.slice(headerLen, headerLen + pkgLen);
        const crcbuf = data.slice(headerLen + pkgLen);
        recvPacket = Buffer.concat([headerBuf, buf, crcbuf]);

        const pkg = new Packet();
        try {
            pkg.decode(recvPacket);
        } catch (error) {
            console.log('Erro na decodificação do pacote');
            return;
        }

        const receivedTime = Math.floor(Date.now() / 1000);
        const crc = Buffer.alloc(2);
        crc.writeUInt16LE(pkg.crc);

        if (pkg.tags.length < 1) {
            return;
        }

        outPkg.receivedTimestamp = receivedTime;
        let prevTag = 0;
        let isSave = false;

        for (const curTag of pkg.tags) {
            if (prevTag > curTag.tag && isSave) {
                try {
                    outPkg.save();
                } catch (error) {
                    console.log(error);
                }
                let client = outPkg.client;
                outPkg = new GalileoParsePacket();
                outPkg.client = client;
                outPkg.receivedTimestamp = receivedTime;
                isSave = false;
            }

            switch (curTag.tag) {
                case 0x04:
                    outPkg.client = curTag.value.val;
                    break;
                case 0x10:
                    outPkg.packetID = curTag.value.val;
                    break;
                case 0x20:
                    outPkg.navigationTimestamp = Math.floor(curTag.value.val.getTime() / 1000);
                    break;
                case 0x30:
                    outPkg.nsat = curTag.value.nsat;
                    outPkg.latitude = curTag.value.latitude;
                    outPkg.longitude = curTag.value.longitude;
                    isSave = true;
                    break;
                case 0x33:
                    outPkg.course = curTag.value.course;
                    outPkg.speed = curTag.value.speed;
                    break;
                case 0x35:
                    outPkg.hdop = curTag.value.val;
                    break;
            }
            prevTag = curTag.tag;
        }

        setOutParsedPkg(outPkg);
        // console.log(outPkg);
    };

    return {
        handleRecvPkg,
        outParsedPkg,
    }
}

export default useParsepacket;