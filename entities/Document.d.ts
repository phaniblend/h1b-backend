import { User } from './User';
import { Application } from './Application';
export declare enum DocumentType {
    PASSPORT = "passport",
    VISA = "visa",
    I94 = "i94",
    I797 = "i797",
    DIPLOMA = "diploma",
    TRANSCRIPT = "transcript",
    RESUME = "resume",
    OFFER_LETTER = "offer_letter",
    CLIENT_LETTER = "client_letter",
    SOW = "sow",
    MSA = "msa",
    PAYSTUB = "paystub",
    BANK_STATEMENT = "bank_statement",
    TAX_RETURN = "tax_return",
    USCIS_FORM = "uscis_form",
    OTHER = "other"
}
export declare enum DocumentStatus {
    UPLOADED = "uploaded",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired"
}
export declare class Document {
    id: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    filePath: string;
    type: DocumentType;
    status: DocumentStatus;
    expiryDate: Date;
    description: string;
    reviewNotes: string;
    reviewedBy: string;
    reviewedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    application: Application;
    applicationId: string;
}
//# sourceMappingURL=Document.d.ts.map