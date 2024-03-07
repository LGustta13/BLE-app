class TagDesc {
    Len: number;
    Type: string;

    constructor(len: number, type: string) {
        this.Len = len;
        this.Type = type;
    }
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
    [0xC4, new TagDesc(1, "can8")],
    [0xC5, new TagDesc(1, "can8")],
    [0xC6, new TagDesc(1, "can8")],
    [0xD6, new TagDesc(2, "can16")],
    // Incluir mais tags se necessário
]);

export default tagsTable;