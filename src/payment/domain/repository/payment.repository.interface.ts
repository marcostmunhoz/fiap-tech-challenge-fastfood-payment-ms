import { EntityIdValueObject } from '@marcostmunhoz/fastfood-libs';
import { PaymentEntity } from '../entity/payment.entity';

export interface PaymentRepository {
  findById(id: EntityIdValueObject): Promise<PaymentEntity>;
  findByExternalPaymentId(externalPaymentId: string): Promise<PaymentEntity>;
  existsWithOrderIdAndNotFailed(orderId: string): Promise<boolean>;
  save(payment: PaymentEntity): Promise<PaymentEntity>;
}
