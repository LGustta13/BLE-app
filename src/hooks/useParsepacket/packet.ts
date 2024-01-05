import tagsTable from "./map";
import Tag from "./tags";

const sendBitFilter = 0x7FFF;
const sendBitData = "1";

export default class Packet {
    header: number;
    length: number;
    tags: Tag[];

    constructor() {
        this.header = 0;
        this.length = 0;
        this.tags = [];
    }

    decode(pkg: Buffer) {
        if (!Buffer.isBuffer(pkg)) {
            pkg = Buffer.from(pkg);
        }

        let pos = 0;
        const packetBodyLen = pkg.length - 2;

        this.header = pkg.readUInt8(pos);
        pos++;

        this.length = pkg.readUInt16LE(pos);
        pos += 2;

        const lenBits = this.length.toString(2);
        if (lenBits.length < 1) {
            throw new Error("Comprimento do pacote incorreto");
        }

        if (lenBits[0] === sendBitData) {
            this.length = this.length & sendBitFilter;
        }

        while (pos < packetBodyLen) {
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