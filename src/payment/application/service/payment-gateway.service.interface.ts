import { MoneyValueObject } from '@marcostmunhoz/fastfood-libs';

export type PaymentRequestData = {
  amount: MoneyValueObject;
};

export type PaymentResponseData = {
  id: string;
};

export type PixPaymentRequestData = PaymentRequestData;

export type PixPaymentResponseData = PaymentResponseData & {
  qrCode: string;
  qrCodeText: string;
};

export type CardRequestData = PaymentRequestData & {
  cardNumber: string;
  cardExpirationDate: string;
  cardVerificationCode: string;
};

export type CardResponseData = PaymentResponseData;

export interface PaymentGatewayService {
  createPixPayment(
    data: PixPaymentRequestData,
  ): Promise<PixPaymentResponseData>;

  isPixPaid(paymentId: string): Promise<boolean>;

  createCreditCardPayment(data: CardRequestData): Promise<CardResponseData>;

  createDebitCardPayment(data: CardRequestData): Promise<CardResponseData>;

  createVoucherPayment(data: CardRequestData): Promise<CardResponseData>;
}
