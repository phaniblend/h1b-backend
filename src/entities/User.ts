import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Application } from './Application';
import { Document } from './Document';
import { Timesheet } from './Timesheet';
import { UserProfile } from './UserProfile';

export enum UserRole {
  APPLICANT = 'applicant',
  ADMIN = 'admin',
  ADVISOR = 'advisor',
  CLIENT = 'client',
}

export enum VisaStatus {
  H1B = 'h1b',
  H4 = 'h4',
  L1 = 'l1',
  F1_OPT = 'f1_opt',
  F1_CPT = 'f1_cpt',
  GREEN_CARD = 'green_card',
  CITIZEN = 'citizen',
  OTHER = 'other',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  @IsPhoneNumber()
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.APPLICANT,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: VisaStatus,
    nullable: true,
  })
  currentVisaStatus: VisaStatus;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];

  @OneToMany(() => Timesheet, (timesheet) => timesheet.user)
  timesheets: Timesheet[];
} 