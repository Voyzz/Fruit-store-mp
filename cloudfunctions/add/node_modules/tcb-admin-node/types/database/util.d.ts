interface DocumentModel {
    _id: string;
}
export declare class Util {
    private static encodeServerDate;
    static encodeDocumentDataForReq: (document: any, merge?: boolean, concatKey?: boolean) => {};
    static formatResDocumentData: (documents: DocumentModel[]) => {}[];
    static whichType: (obj: any) => String;
    static generateDocId: () => string;
}
export {};
