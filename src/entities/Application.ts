import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Document } from './Document';
import { Payment } from './Payment';

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  DOCUMENTS_REQUIRED = 'documents_required',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FILED = 'filed',
  APPROVED_BY_USCIS = 'approved_by_uscis',
  DENIED_BY_USCIS = 'denied_by_uscis',
}

export enum ApplicationType {
  H1B_TRANSFER = 'h1b_transfer',
  H1B_EXTENSION = 'h1b_extension',
  GREEN_CARD = 'green_card',
  PREMIUM_PROCESSING = 'premium_processing',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ApplicationType,
    default: ApplicationType.H1B_TRANSFER,
  })
  type: ApplicationType;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.DRAFT,
  })
  status: ApplicationStatus;

  @Column({ nullable: true })
  receiptNumber: string;

  @Column({ nullable: true })
  caseNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  clientBillRate: number;

  @Column({ nullable: true })
  clientCompanyName: string;

  @Column({ nullable: true })
  endClientName: string;

  @Column({ nullable: true })
  projectDescription: string;

  @Column({ nullable: true })
  workLocation: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  assignedAdvisorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Document, (document) => document.application)
  documents: Document[];

  @OneToMany(() => Payment, (payment) => payment.application)
  payments: Payment[];
} 