import {
  EntityIdGeneratorHelper,
  EntityIdGeneratorHelperToken,
  PaymentStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';
import {
  PartialPaymentEntityProps,
  PaymentEntity,
} from '../entity/payment.entity';

export class PaymentFactory {
  constructor(
    @Inject(EntityIdGeneratorHelperToken)
    private readonly entityIdGenerator: EntityIdGeneratorHelper,
  ) {}

  public createPayment(props: PartialPaymentEntityProps): PaymentEntity {
    return new PaymentEntity({
      ...props,
      id: this.entityIdGenerator.generate(),
      status: PaymentStatusEnum.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
