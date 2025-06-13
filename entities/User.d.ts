import { Application } from './Application';
import { Document } from './Document';
import { Timesheet } from './Timesheet';
import { UserProfile } from './UserProfile';
export declare enum UserRole {
    APPLICANT = "applicant",
    ADMIN = "admin",
    ADVISOR = "advisor",
    CLIENT = "client"
}
export declare enum VisaStatus {
    H1B = "h1b",
    H4 = "h4",
    L1 = "l1",
    F1_OPT = "f1_opt",
    F1_CPT = "f1_cpt",
    GREEN_CARD = "green_card",
    CITIZEN = "citizen",
    OTHER = "other"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    currentVisaStatus: VisaStatus;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isActive: boolean;
    lastLoginAt: Date;
    emailVerificationToken: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    createdAt: Date;
    updatedAt: Date;
    profile: UserProfile;
    applications: Application[];
    documents: Document[];
    timesheets: Timesheet[];
}
//# sourceMappingURL=User.d.ts.map