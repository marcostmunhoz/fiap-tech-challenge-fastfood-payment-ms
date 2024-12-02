import { BaseEntity } from '@marcostmunhoz/fastfood-libs';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'payments' })
export class PaymentEntity extends BaseEntity {
  @Column()
  orderId: string;

  @Column()
  total: number;

  @Column()
  paymentMethod: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  externalPaymentId?: string;
}
