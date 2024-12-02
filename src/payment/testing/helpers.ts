import {
  getCompletePaymentData,
  PaymentData,
} from '@marcostmunhoz/fastfood-libs';
import { OrderService } from '../application/service/order.service.interface';
import { PaymentGatewayService } from '../application/service/payment-gateway.service.interface';
import {
  CompletePaymentEntityProps,
  PaymentEntity as DomainPaymentEntity,
} from '../domain/entity/payment.entity';
import { PaymentFactory } from '../domain/factory/payment.factory';
import { PaymentRepository } from '../domain/repository/payment.repository.interface';
import { PaymentEntity as InfrastructurePaymentEntity } from '../infrastructure/entity/payment.entity';

export const getDomainPaymentEntity = (
  props: Partial<CompletePaymentEntityProps> = {},
): DomainPaymentEntity => {
  const defaultProps = getCompletePaymentData();

  return new DomainPaymentEntity({
    id: props.id || defaultProps.id,
    orderId: props.orderId || defaultProps.orderId,
    total: props.total || defaultProps.total,
    paymentMethod: props.paymentMethod || defaultProps.paymentMethod,
    status: props.status || defaultProps.status,
    externalPaymentId:
      props.externalPaymentId || defaultProps.externalPaymentId,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  });
};

export const getInfrastructurePaymentEntity = (
  props: Partial<PaymentData> = {},
): InfrastructurePaymentEntity => {
  const defaultProps = getCompletePaymentData();

  return {
    id: props.id?.value || defaultProps.id.value,
    orderId: props.orderId || defaultProps.orderId,
    total: props.total?.value || defaultProps.total.value,
    paymentMethod: props.paymentMethod || defaultProps.paymentMethod,
    status: props.status || defaultProps.status,
    externalPaymentId:
      props.externalPaymentId || defaultProps.externalPaymentId,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  };
};

export const getPaymentFactoryMock = (): jest.Mocked<PaymentFactory> =>
  ({
    createPayment: jest.fn(),
  }) as unknown as jest.Mocked<PaymentFactory>;

export const getPaymentRepositoryMock = (): jest.Mocked<PaymentRepository> => ({
  findById: jest.fn(),
  findByExternalPaymentId: jest.fn(),
  existsWithOrderIdAndNotFailed: jest.fn(),
  save: jest.fn(),
});

export const getPaymentGatewayServiceMock =
  (): jest.Mocked<PaymentGatewayService> => ({
    createPixPayment: jest.fn(),
    isPixPaid: jest.fn(),
    createCreditCardPayment: jest.fn(),
    createDebitCardPayment: jest.fn(),
    createVoucherPayment: jest.fn(),
  });

export const getOrderServiceMock = (): jest.Mocked<OrderService> => ({
  findById: jest.fn(),
  setAsPaid: jest.fn(),
  setAsCanceled: jest.fn(),
});
