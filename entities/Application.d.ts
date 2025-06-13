import { User } from './User';
import { Document } from './Document';
import { Payment } from './Payment';
export declare enum ApplicationStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    DOCUMENTS_REQUIRED = "documents_required",
    APPROVED = "approved",
    REJECTED = "rejected",
    FILED = "filed",
    APPROVED_BY_USCIS = "approved_by_uscis",
    DENIED_BY_USCIS = "denied_by_uscis"
}
export declare enum ApplicationType {
    H1B_TRANSFER = "h1b_transfer",
    H1B_EXTENSION = "h1b_extension",
    GREEN_CARD = "green_card",
    PREMIUM_PROCESSING = "premium_processing"
}
export declare class Application {
    id: string;
    type: ApplicationType;
    status: ApplicationStatus;
    receiptNumber: string;
    caseNumber: string;
    clientBillRate: number;
    clientCompanyName: string;
    endClientName: string;
    projectDescription: string;
    workLocation: string;
    startDate: Date;
    endDate: Date;
    notes: string;
    assignedAdvisorId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    documents: Document[];
    payments: Payment[];
}
//# sourceMappingURL=Application.d.ts.map