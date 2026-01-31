// src/organizations/entities/organization.entity.ts
@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // STRIPE FIELDS
  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({
    type: 'enum',
    enum: ['active', 'past_due', 'canceled', 'incomplete', 'trialing'],
    default: 'incomplete'
  })
  subscriptionStatus: string;

  @Column({ nullable: true })
  planTier: string; // 'basic' | 'pro' | 'enterprise'
}
