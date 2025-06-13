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

export enum DocumentType {
  PASSPORT = 'passport',
  VISA = 'visa',
  I94 = 'i94',
  I797 = 'i797',
  DIPLOMA = 'diploma',
  TRANSCRIPT = 'transcript',
  RESUME = 'resume',
  OFFER_LETTER = 'offer_letter',
  CLIENT_LETTER = 'client_letter',
  SOW = 'sow',
  MSA = 'msa',
  PAYSTUB = 'paystub',
  BANK_STATEMENT = 'bank_statement',
  TAX_RETURN = 'tax_return',
  USCIS_FORM = 'uscis_form',
  OTHER = 'other',
}

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  fileSize: number;

  @Column()
  filePath: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.UPLOADED,
  })
  status: DocumentStatus;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  reviewNotes: string;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Application, (application) => application.documents, { nullable: true })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @Column({ nullable: true })
  applicationId: string;
} 