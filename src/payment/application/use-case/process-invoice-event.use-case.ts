import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import { OrderServiceToken, PaymentRepositoryToken } from '@/payment/tokens';
import {
  EntityIdValueObject,
  EntityNotFoundException,
  PaymentStatusEnum,
  UseCase,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';
import { OrderService } from '../service/order.service.interface';

export type Input = {
  event: 'invoice.status_changed';
  data: {
    id: string;
    status: PaymentStatusEnum;
  };
};

export type Output = void;

export class ProcessInvoiceEventUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PaymentRepositoryToken)
    private readonly paymentRepository: PaymentRepository,
    @Inject(OrderServiceToken)
    private readonly orderService: OrderService,
  ) {}

  async execute({ data }: Input): Promise<Output> {
    const payment = await this.paymentRepository.findByExternalPaymentId(
      data.id,
    );

    if (!payment) {
      throw new EntityNotFoundException('Payment not found with given ID.');
    }

    const order = await this.orderService.findById(
      EntityIdValueObject.create(payment.orderId),
    );

    if (data.status === PaymentStatusEnum.PAID) {
      payment.markAsPaid();
      this.orderService.setAsPaid(order.id);
    } else if (data.status === PaymentStatusEnum.FAILED) {
      payment.markAsFailed();
      this.orderService.setAsCanceled(order.id);
    }

    await this.paymentRepository.save(payment);
  }
}
