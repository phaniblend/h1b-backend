import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  countryOfBirth: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  passportNumber: string;

  @Column({ nullable: true })
  passportExpiryDate: Date;

  @Column({ nullable: true })
  currentAddress: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ nullable: true })
  emergencyContactRelation: string;

  @Column({ nullable: true })
  currentEmployer: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentSalary: number;

  @Column({ nullable: true })
  yearsOfExperience: number;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  university: string;

  @Column({ nullable: true })
  degreeYear: number;

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ nullable: true })
  linkedinProfile: string;

  @Column({ nullable: true })
  githubProfile: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true })
  userId: string;
} 