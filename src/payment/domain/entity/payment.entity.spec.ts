import { getDomainPaymentEntity } from '@/payment/testing/helpers';
import {
  getCompletePaymentData,
  getValidPaymentExternalId,
  PaymentStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { PaymentCanNotBeEditedException } from '../exception/payment-can-not-be-edited.exception';

describe('PaymentEntity', () => {
  describe('getters', () => {
    it('should return the correct values', async () => {
      // Arrange
      const props = getCompletePaymentData();
      const payment = getDomainPaymentEntity(props);

      // Assert
      expect(payment.id).toEqual(props.id);
      expect(payment.orderId).toEqual(props.orderId);
      expect(payment.total).toEqual(props.total);
      expect(payment.paymentMethod).toEqual(props.paymentMethod);
      expect(payment.total).toEqual(props.total);
      expect(payment.createdAt).toEqual(props.createdAt);
      expect(payment.updatedAt).toEqual(props.updatedAt);
    });
  });

  describe('canBeEdited', () => {
    it('should return a boolean indicating whether the payment status is PENDING', async () => {
      // Arrange
      const props = getCompletePaymentData();
      const pendingPayment = getDomainPaymentEntity({
        ...props,
        status: PaymentStatusEnum.PENDING,
      });
      const paidPayment = getDomainPaymentEntity({
        ...props,
        status: PaymentStatusEnum.PAID,
      });

      // Act
      const pendingPaymentResult = pendingPayment.canBeEdited();
      const paidPaymentResult = paidPayment.canBeEdited();

      // Assert
      expect(pendingPaymentResult).toBe(true);
      expect(paidPaymentResult).toBe(false);
    });
  });

  describe('markAsPaid', () => {
    it('should mark the payment as paid', async () => {
      // Arrange
      const props = getCompletePaymentData();
      const payment = getDomainPaymentEntity(props);
      const paymentSpy = jest.spyOn(payment as any, 'markAsUpdated');

      // Act
      payment.markAsPaid();

      // Assert
      expect(paymentSpy).toHaveBeenCalledTimes(1);
      expect(payment.status).toEqual(PaymentStatusEnum.PAID);
    });

    it('should throw an exception if the payment can not be edited', async () => {
      // Arrange
      const props = getCompletePaymentData();
      const payment = getDomainPaymentEntity({
        ...props,
        status: PaymentStatusEnum.PAID,
      });

      // Act
      const act = () => payment.markAsPaid();

      // Assert
      expect(act).toThrow(PaymentCanNotBeEditedException);
    });
  });

  describe('markAsFailed', () => {
    it('should mark the payment as failed', async () => {
      // Arrange
      const props = getCompletePaymentData();
      const payment = getDomainPaymentEntity(props);
      const paymentSpy = jest.spyOn(payment as any, 'markAsUpdated');

      // Act
      payment.markAsFailed();

      // Assert
      expect(paymentSpy).toHaveBeenCalledTimes(1);
      expect(payment.status).toEqual(PaymentStatusEnum.FAILED);
    });

    it('should throw an exception if the payment can not be edited', async () => {
      // Arrange
      const props = getCompletePaymentData();
      const payment = getDomainPaymentEntity({
        ...props,
        status: PaymentStatusEnum.PAID,
      });

      // Act
      const act = () => payment.markAsFailed();

      // Assert
      expect(act).toThrow(PaymentCanNotBeEditedException);
    });
  });

  describe('setExternalPaymentId', () => {
    it('should set the externalPaymentId property', async () => {
      // Arrange
      const payment = getDomainPaymentEntity();
      const externalPaymentId = getValidPaymentExternalId();
      const paymentSpy = jest.spyOn(payment as any, 'markAsUpdated');

      // Act
      payment.setExternalPaymentId(externalPaymentId);

      // Assert
      expect(paymentSpy).toHaveBeenCalledTimes(1);
      expect(payment.externalPaymentId).toEqual(externalPaymentId);
    });
  });
});
