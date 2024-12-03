import { PaymentFactory } from '@/payment/domain/factory/payment.factory';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import {
  getDomainPaymentEntity,
  getOrderServiceMock,
  getPaymentFactoryMock,
  getPaymentGatewayServiceMock,
  getPaymentRepositoryMock,
} from '@/payment/testing/helpers';
import {
  getCompleteOrderData,
  getCompletePaymentData,
  getPartialPaymentData,
  mockUser,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { OrderService } from '../service/order.service.interface';
import { PaymentGatewayService } from '../service/payment-gateway.service.interface';
import { CreatePaymentUseCase, Input, Output } from './create-payment.use-case';

describe('CreatePaymentUseCase', () => {
  let paymentGatewayServiceMock: jest.Mocked<PaymentGatewayService>;
  let paymentRepositoryMock: jest.Mocked<PaymentRepository>;
  let orderServiceMock: jest.Mocked<OrderService>;
  let paymentFactoryMock: jest.Mocked<PaymentFactory>;
  let sut: CreatePaymentUseCase;

  beforeEach(() => {
    paymentGatewayServiceMock = getPaymentGatewayServiceMock();
    paymentRepositoryMock = getPaymentRepositoryMock();
    orderServiceMock = getOrderServiceMock();
    paymentFactoryMock = getPaymentFactoryMock();
    sut = new CreatePaymentUseCase(
      paymentGatewayServiceMock,
      paymentRepositoryMock,
      orderServiceMock,
      paymentFactoryMock,
    );
  });

  describe('execute', () => {
    it('should throw if a valid payment already exists with given order ID', () => {
      // Arrange
      const input: Input = {
        orderId: 'order-id',
        user: mockUser,
        paymentMethod: PaymentMethodEnum.PIX,
      };
      paymentRepositoryMock.existsWithOrderIdAndNotFailed.mockResolvedValue(
        true,
      );

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow(
        'A pending or paid payment already exists for the given order ID.',
      );
    });

    it('should throw if the order can not be found with given ID', () => {
      // Arrange
      const input: Input = {
        orderId: 'order-id',
        user: mockUser,
        paymentMethod: PaymentMethodEnum.PIX,
      };
      paymentRepositoryMock.existsWithOrderIdAndNotFailed.mockResolvedValue(
        false,
      );
      orderServiceMock.findById.mockResolvedValue(null);

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow('Order not found with given ID.');
    });

    it('should return a PixPaymentOutput if payment method is PIX', async () => {
      // Arrange
      const order = getCompleteOrderData();
      const paymentProps = getPartialPaymentData();
      const payment = getDomainPaymentEntity({
        ...paymentProps,
        orderId: order.id.value,
        total: order.total,
        paymentMethod: PaymentMethodEnum.PIX,
      });
      const input: Input = {
        orderId: order.id.value,
        user: mockUser,
        paymentMethod: PaymentMethodEnum.PIX,
      };
      const output: Output = {
        id: payment.id,
        status: PaymentStatusEnum.PENDING,
        paymentData: {
          qrCode: 'qr-code-url',
          qrCodeText: 'qr-code-text',
        },
      };
      const paymentSetExternalPaymentIdSpy = jest.spyOn(
        payment,
        'setExternalPaymentId',
      );
      paymentRepositoryMock.existsWithOrderIdAndNotFailed.mockResolvedValueOnce(
        false,
      );
      orderServiceMock.findById.mockResolvedValueOnce(order);
      // using mockImplementation instead of mockResolvedValue because of some odd behavior in the type
      // hiting. The return type is being inferred as never instead of PaymentEntity, and the mock is
      // returning a Promise instead of the actual value passed to it.
      paymentFactoryMock.createPayment.mockImplementation(() => payment);
      paymentGatewayServiceMock.createPixPayment.mockResolvedValueOnce({
        id: 'external-payment-id',
        qrCode: 'qr-code-url',
        qrCodeText: 'qr-code-text',
      });

      // Act
      const result = await sut.execute(input);

      // Assert
      expect(
        paymentRepositoryMock.existsWithOrderIdAndNotFailed,
      ).toHaveBeenCalledTimes(1);
      expect(
        paymentRepositoryMock.existsWithOrderIdAndNotFailed,
      ).toHaveBeenCalledWith(order.id.value);
      expect(orderServiceMock.findById).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.findById).toHaveBeenCalledWith(order.id);
      expect(paymentFactoryMock.createPayment).toHaveBeenCalledTimes(1);
      expect(paymentFactoryMock.createPayment).toHaveBeenCalledWith({
        orderId: order.id.value,
        total: order.total,
        paymentMethod: PaymentMethodEnum.PIX,
      });
      expect(paymentGatewayServiceMock.createPixPayment).toHaveBeenCalledTimes(
        1,
      );
      expect(paymentGatewayServiceMock.createPixPayment).toHaveBeenCalledWith({
        amount: payment.total,
      });
      expect(paymentSetExternalPaymentIdSpy).toHaveBeenCalledTimes(1);
      expect(paymentSetExternalPaymentIdSpy).toHaveBeenCalledWith(
        'external-payment-id',
      );
      expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith(payment);
      expect(result).toEqual(output);
    });

    const cardPaymentDataset = [
      [PaymentMethodEnum.CREDIT_CARD, 'createCreditCardPayment'],
      [PaymentMethodEnum.DEBIT_CARD, 'createDebitCardPayment'],
      [PaymentMethodEnum.VOUCHER, 'createVoucherPayment'],
    ];

    it.each(cardPaymentDataset)(
      'should return a CardPaymentOutput if payment method is with any kind of card',
      async (
        paymentMethod:
          | PaymentMethodEnum.CREDIT_CARD
          | PaymentMethodEnum.DEBIT_CARD
          | PaymentMethodEnum.VOUCHER,
        expectedGatewayMethod:
          | 'createCreditCardPayment'
          | 'createDebitCardPayment'
          | 'createVoucherPayment',
      ) => {
        // Arrange
        const order = getCompleteOrderData();
        const paymentProps = getCompletePaymentData();
        const payment = getDomainPaymentEntity({
          ...paymentProps,
          orderId: order.id.value,
          total: order.total,
          paymentMethod,
        });
        const input: Input = {
          orderId: order.id.value,
          user: mockUser,
          paymentMethod,
          cardData: {
            number: '1111222233334444',
            expiration: '12/30',
            verificationCode: '111',
          },
        };
        const output: Output = {
          id: payment.id,
          status: PaymentStatusEnum.PAID,
        };
        const paymentSetExternalPaymentIdSpy = jest.spyOn(
          payment,
          'setExternalPaymentId',
        );
        const paymentMarkAsPaidSpy = jest.spyOn(payment, 'markAsPaid');
        paymentRepositoryMock.existsWithOrderIdAndNotFailed.mockResolvedValueOnce(
          false,
        );
        orderServiceMock.findById.mockResolvedValueOnce(order);
        // using mockImplementation instead of mockResolvedValue because of some odd behavior in the type
        // hiting. The return type is being inferred as never instead of PaymentEntity, and the mock is
        // returning a Promise instead of the actual value passed to it.
        paymentFactoryMock.createPayment.mockImplementation(() => payment);
        paymentGatewayServiceMock[expectedGatewayMethod].mockResolvedValueOnce({
          id: 'external-payment-id',
        });

        // Act
        const result = await sut.execute(input);

        // Assert
        expect(
          paymentGatewayServiceMock[expectedGatewayMethod],
        ).toHaveBeenCalledTimes(1);
        expect(
          paymentGatewayServiceMock[expectedGatewayMethod],
        ).toHaveBeenCalledWith({
          amount: payment.total,
          cardNumber: input.cardData.number,
          cardExpirationDate: input.cardData.expiration,
          cardVerificationCode: input.cardData.verificationCode,
        });
        expect(paymentSetExternalPaymentIdSpy).toHaveBeenCalledTimes(1);
        expect(paymentSetExternalPaymentIdSpy).toHaveBeenCalledWith(
          'external-payment-id',
        );
        expect(paymentMarkAsPaidSpy).toHaveBeenCalledTimes(1);
        expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(paymentRepositoryMock.save).toHaveBeenCalledWith(payment);
        expect(orderServiceMock.setAsPaid).toHaveBeenCalledTimes(1);
        expect(orderServiceMock.setAsPaid).toHaveBeenCalledWith(order.id);
        expect(result).toEqual(output);
      },
    );

    it('should throw mark payment as failed and throw error when payment gateway throws', async () => {
      // Arrange
      const order = getCompleteOrderData();
      const paymentProps = getCompletePaymentData();
      const payment = getDomainPaymentEntity({
        ...paymentProps,
        orderId: order.id.value,
        total: order.total,
        paymentMethod: PaymentMethodEnum.PIX,
      });
      const input: Input = {
        orderId: order.id.value,
        user: mockUser,
        paymentMethod: PaymentMethodEnum.PIX,
      };
      const paymentMarkAsFailedSpy = jest.spyOn(payment, 'markAsFailed');
      paymentRepositoryMock.existsWithOrderIdAndNotFailed.mockResolvedValueOnce(
        false,
      );
      orderServiceMock.findById.mockResolvedValueOnce(order);
      // using mockImplementation instead of mockResolvedValue because of some odd behavior in the type
      // hiting. The return type is being inferred as never instead of PaymentEntity, and the mock is
      // returning a Promise instead of the actual value passed to it.
      paymentFactoryMock.createPayment.mockImplementation(() => payment);
      paymentGatewayServiceMock.createPixPayment.mockImplementation(() => {
        throw new Error('Some error message.');
      });

      // Act
      let caughtError;
      try {
        await sut.execute(input);
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError.message).toEqual(
        'There was an error processing the payment: Some error message.',
      );
      expect(paymentMarkAsFailedSpy).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith(payment);
      expect(orderServiceMock.setAsCanceled).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.setAsCanceled).toHaveBeenCalledWith(order.id);
    });
  });
});
