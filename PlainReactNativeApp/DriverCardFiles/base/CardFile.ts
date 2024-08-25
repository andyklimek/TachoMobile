
class CardFile {
    fileId: number[];
    name: string;
    needsSignature: boolean;

    selectCommand: number[];
    readCommand: number[];

    constructor(name: string, fileId:number[], needs_signature: boolean = false) {
        this.name = name;
        this.fileId = fileId
        this.needsSignature = needs_signature
    }

    createSelectCommand() {
        
    }

    createReadCommand() {}

    getSelectCommand(): number[] {
        return this.selectCommand
    }

    getReadCommand(): number[] {
        return this.readCommand
    }
}