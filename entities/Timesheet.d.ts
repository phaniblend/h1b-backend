import { User } from './User';
import { Application } from './Application';
export declare enum TimesheetStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    APPROVED = "approved",
    REJECTED = "rejected",
    INVOICED = "invoiced"
}
export declare class Timesheet {
    id: string;
    weekEndingDate: Date;
    mondayHours: number;
    tuesdayHours: number;
    wednesdayHours: number;
    thursdayHours: number;
    fridayHours: number;
    saturdayHours: number;
    sundayHours: number;
    totalHours: number;
    hourlyRate: number;
    totalAmount: number;
    status: TimesheetStatus;
    workDescription: string;
    clientApprovalDate: Date;
    clientApprovedBy: string;
    invoiceNumber: string;
    invoiceDate: Date;
    paymentDate: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    application: Application;
    applicationId: string;
}
//# sourceMappingURL=Timesheet.d.ts.map