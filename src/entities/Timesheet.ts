import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Application } from './Application';

export enum TimesheetStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INVOICED = 'invoiced',
}

@Entity('timesheets')
export class Timesheet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  weekEndingDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  mondayHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  tuesdayHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  wednesdayHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  thursdayHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  fridayHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  saturdayHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  sundayHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  totalHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: TimesheetStatus,
    default: TimesheetStatus.DRAFT,
  })
  status: TimesheetStatus;

  @Column({ type: 'text', nullable: true })
  workDescription: string;

  @Column({ nullable: true })
  clientApprovalDate: Date;

  @Column({ nullable: true })
  clientApprovedBy: string;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  invoiceDate: Date;

  @Column({ nullable: true })
  paymentDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.timesheets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Application, { nullable: true })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @Column({ nullable: true })
  applicationId: string;
} 