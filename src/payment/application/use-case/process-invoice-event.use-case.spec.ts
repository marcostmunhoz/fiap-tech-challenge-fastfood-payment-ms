import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import {
  getDomainPaymentEntity,
  getOrderServiceMock,
  getPaymentRepositoryMock,
} from '@/payment/testing/helpers';
import {
  getCompleteOrderData,
  PaymentStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { OrderService } from '../service/order.service.interface';
import {
  Input,
  ProcessInvoiceEventUseCase,
} from './process-invoice-event.use-case';

describe('ProcessInvoiceEventUseCase', () => {
  let paymentRepositoryMock: jest.Mocked<PaymentRepository>;
  let orderServiceMock: jest.Mocked<OrderService>;
  let sut: ProcessInvoiceEventUseCase;

  beforeEach(() => {
    paymentRepositoryMock = getPaymentRepositoryMock();
    orderServiceMock = getOrderServiceMock();
    sut = new ProcessInvoiceEventUseCase(
      paymentRepositoryMock,
      orderServiceMock,
    );
  });

  describe('execute', function () {
    it('should throw an error if payment is not found with given external payment id', () => {
      // Arrange
      const input: Input = {
        event: 'invoice.status_changed',
        data: {
          id: 'invalid-id',
          status: PaymentStatusEnum.PAID,
        },
      };
      paymentRepositoryMock.findByExternalPaymentId.mockResolvedValueOnce(null);

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow('Payment not found with given ID.');
    });

    it('should mark payment and order as paid if status is PAID', async () => {
      // Arrange
      const order = getCompleteOrderData();
      const payment = getDomainPaymentEntity({ orderId: order.id.value });
      const input: Input = {
        event: 'invoice.status_changed',
        data: {
          id: 'valid-id',
          status: PaymentStatusEnum.PAID,
        },
      };
      const paymentMarkAsPaidSpy = jest.spyOn(payment, 'markAsPaid');
      paymentRepositoryMock.findByExternalPaymentId.mockResolvedValueOnce(
        payment,
      );
      orderServiceMock.findById.mockResolvedValueOnce(order);

      // Act
      await sut.execute(input);

      // Assert
      expect(paymentMarkAsPaidSpy).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith(payment);
      expect(orderServiceMock.setAsPaid).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.setAsPaid).toHaveBeenCalledWith(order.id);
    });

    it('should mark payment as failed and order as canceled if status is FAILED', async () => {
      // Arrange
      const order = getCompleteOrderData();
      const payment = getDomainPaymentEntity({ orderId: order.id.value });
      const input: Input = {
        event: 'invoice.status_changed',
        data: {
          id: 'valid-id',
          status: PaymentStatusEnum.FAILED,
        },
      };
      const paymentMarkAsFailedSpy = jest.spyOn(payment, 'markAsFailed');
      paymentRepositoryMock.findByExternalPaymentId.mockResolvedValueOnce(
        payment,
      );
      orderServiceMock.findById.mockResolvedValueOnce(order);

      // Act
      await sut.execute(input);

      // Assert
      expect(paymentMarkAsFailedSpy).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith(payment);
      expect(orderServiceMock.setAsCanceled).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.setAsCanceled).toHaveBeenCalledWith(order.id);
    });
  });
});
