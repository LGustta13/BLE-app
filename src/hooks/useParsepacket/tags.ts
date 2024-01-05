import * as types from "./types";

export default class Tag {
    tag: number;
    value: any;

    constructor() {
        this.tag = 0;
        this.value = null;
    }

    setValue(tagType: string, val: Buffer) {
        let v;

        switch (tagType) {
            case "uint":
                v = new types.UintTag();
                break;
            case "string":
                v = new types.StringTag();
                break;
            case "time":
                v = new types.TimeTag();
                break;
            case "coord":
                v = new types.CoordTag();
                break;
            case "speed":
                v = new types.SpeedTag();
                break;
            case "accel":
                v = new types.AccelTag();
                break;
            case "int":
                v = new types.IntTag();
                break;
            case "bitstring":
                v = new types.BitsTag();
                break;
            default:
                return new Error(`Tipo de dados desconhecido: ${tagType}`);
        }

        if (!v) {
            return new Error("Ponteiro de tag inválido");
        }

        try {
            v.parse(val);
        } catch (error) {
            return error;
        }

        this.value = v;
        return null;
    }
}