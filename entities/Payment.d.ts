import { User } from './User';
import { Application } from './Application';
export declare enum PaymentType {
    REGISTRATION_FEE = "registration_fee",
    MONTHLY_FEE = "monthly_fee",
    PREMIUM_PROCESSING = "premium_processing",
    LEGAL_FEES = "legal_fees",
    USCIS_FEES = "uscis_fees",
    REFUND = "refund"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    BANK_TRANSFER = "bank_transfer",
    ACH = "ach",
    WALLET = "wallet"
}
export declare class Payment {
    id: string;
    type: PaymentType;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    stripePaymentIntentId: string;
    stripeCustomerId: string;
    transactionId: string;
    description: string;
    metadata: Record<string, any>;
    failureReason: string;
    processedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    application: Application;
    applicationId: string;
}
//# sourceMappingURL=Payment.d.ts.map