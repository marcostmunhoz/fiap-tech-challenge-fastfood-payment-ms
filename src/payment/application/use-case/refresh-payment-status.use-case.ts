import { InvalidPaymentMethodException } from '@/payment/domain/exception/invalid-payment-method.exception';
import { InvalidPaymentStatusException } from '@/payment/domain/exception/invalid-payment-status.exception';
import { PaymentFailedException } from '@/payment/domain/exception/payment-failed.exception';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import {
  OrderServiceToken,
  PaymentGatewayServiceToken,
  PaymentRepositoryToken,
} from '@/payment/tokens';
import {
  EntityIdValueObject,
  EntityNotFoundException,
  PaymentMethodEnum,
  PaymentStatusEnum,
  UseCase,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';
import { OrderService } from '../service/order.service.interface';
import { PaymentGatewayService } from '../service/payment-gateway.service.interface';

export type Input = {
  id: EntityIdValueObject;
};

export type Output = {
  status: PaymentStatusEnum;
};

export class RefreshPaymentStatusUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PaymentRepositoryToken)
    private readonly paymentRepository: PaymentRepository,
    @Inject(OrderServiceToken)
    private readonly orderService: OrderService,
    @Inject(PaymentGatewayServiceToken)
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const payment = await this.paymentRepository.findById(input.id);

    if (!payment) {
      throw new EntityNotFoundException('Payment not found with given ID.');
    }

    if (PaymentMethodEnum.PIX !== payment.paymentMethod) {
      throw new InvalidPaymentMethodException(
        'Only Pix payments can be refreshed.',
      );
    }

    if (PaymentStatusEnum.FAILED === payment.status) {
      throw new InvalidPaymentStatusException(
        'Payment with status FAILED cannot be refreshed.',
      );
    }

    if (PaymentStatusEnum.PAID === payment.status) {
      return { status: payment.status };
    }

    const order = await this.orderService.findById(
      EntityIdValueObject.create(payment.orderId),
    );

    try {
      const idPaid = await this.paymentGatewayService.isPixPaid(
        payment.externalPaymentId,
      );

      if (idPaid) {
        payment.markAsPaid();
        this.paymentRepository.save(payment);
        this.orderService.setAsPaid(order.id);
      }

      return { status: payment.status };
    } catch (error) {
      throw new PaymentFailedException(
        `There was an error refreshing the payment status: ${error.message || 'Generic error'}`,
      );
    }
  }
}
