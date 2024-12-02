import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import {
  getDomainPaymentEntity,
  getOrderServiceMock,
  getPaymentGatewayServiceMock,
  getPaymentRepositoryMock,
} from '@/payment/testing/helpers';
import {
  getCompleteOrderData,
  getCompletePaymentData,
  getValidPaymentEntityId,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { OrderService } from '../service/order.service.interface';
import { PaymentGatewayService } from '../service/payment-gateway.service.interface';
import {
  Input,
  Output,
  RefreshPaymentStatusUseCase,
} from './refresh-payment-status.use-case';

describe('RefreshPaymentStatusUseCase', () => {
  let paymentRepositoryMock: jest.Mocked<PaymentRepository>;
  let orderServiceMock: jest.Mocked<OrderService>;
  let paymentGatewayMock: jest.Mocked<PaymentGatewayService>;
  let sut: RefreshPaymentStatusUseCase;

  beforeEach(() => {
    paymentRepositoryMock = getPaymentRepositoryMock();
    orderServiceMock = getOrderServiceMock();
    paymentGatewayMock = getPaymentGatewayServiceMock();
    sut = new RefreshPaymentStatusUseCase(
      paymentRepositoryMock,
      orderServiceMock,
      paymentGatewayMock,
    );
  });

  describe('execute', function () {
    it('should throw an error if payment is not found with given id', () => {
      // Arrange
      const input: Input = {
        id: getValidPaymentEntityId(),
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(null);

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow('Payment not found with given ID.');
    });

    it('should throw an error if payment method is not PIX', () => {
      // Arrange
      const props = getCompletePaymentData();
      const entity = getDomainPaymentEntity({
        ...props,
        paymentMethod: PaymentMethodEnum.CREDIT_CARD,
      });
      const input: Input = {
        id: entity.id,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow('Only Pix payments can be refreshed.');
    });

    it('should throw an error if payment status is FAILED', () => {
      // Arrange
      const props = getCompletePaymentData();
      const entity = getDomainPaymentEntity({
        ...props,
        paymentMethod: PaymentMethodEnum.PIX,
        status: PaymentStatusEnum.FAILED,
      });
      const input: Input = {
        id: entity.id,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow(
        'Payment with status FAILED cannot be refreshed.',
      );
    });

    it('returns without calling payment gateway if the payment is already PAID', async () => {
      // Arrange
      const props = getCompletePaymentData();
      const entity = getDomainPaymentEntity({
        ...props,
        paymentMethod: PaymentMethodEnum.PIX,
        status: PaymentStatusEnum.PAID,
      });
      const input: Input = {
        id: entity.id,
      };
      const output: Output = {
        status: PaymentStatusEnum.PAID,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);

      // Act
      const result = await sut.execute(input);

      // Assert
      expect(paymentGatewayMock.isPixPaid).not.toHaveBeenCalled();
      expect(result).toEqual(output);
    });

    it('should throw an error if payment gateway service fails', () => {
      // Arrange
      const props = getCompletePaymentData();
      const entity = getDomainPaymentEntity({
        ...props,
        paymentMethod: PaymentMethodEnum.PIX,
        status: PaymentStatusEnum.PENDING,
      });
      const input: Input = {
        id: entity.id,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);
      paymentGatewayMock.isPixPaid.mockRejectedValueOnce(new Error('Error'));

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow(
        'There was an error refreshing the payment status: Error',
      );
    });

    it('should mark the payment as paid if the payment is paid', async () => {
      // Arrange
      const order = getCompleteOrderData();
      const props = getCompletePaymentData();
      const entity = getDomainPaymentEntity({
        ...props,
        orderId: order.id.value,
        paymentMethod: PaymentMethodEnum.PIX,
        status: PaymentStatusEnum.PENDING,
      });
      const input: Input = {
        id: entity.id,
      };
      const output: Output = {
        status: PaymentStatusEnum.PAID,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);
      orderServiceMock.findById.mockResolvedValueOnce(order);
      paymentGatewayMock.isPixPaid.mockResolvedValueOnce(true);
      const paymentMarkAsPaidSpy = jest.spyOn(entity, 'markAsPaid');

      // Act
      const result = await sut.execute(input);

      // Assert
      expect(paymentMarkAsPaidSpy).toHaveBeenCalledTimes(1);
      expect(paymentGatewayMock.isPixPaid).toHaveBeenCalledTimes(1);
      expect(paymentGatewayMock.isPixPaid).toHaveBeenCalledWith(
        entity.externalPaymentId,
      );
      expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.setAsPaid).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.setAsPaid).toHaveBeenCalledWith(order.id);
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith(entity);
      expect(entity.status).toEqual(PaymentStatusEnum.PAID);
      expect(result).toEqual(output);
    });
  });
});
