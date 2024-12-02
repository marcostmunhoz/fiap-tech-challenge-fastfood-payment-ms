import {
  AbstractEntity,
  MoneyValueObject,
  PartialPaymentData,
  PaymentData,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { PaymentCanNotBeEditedException } from '../exception/payment-can-not-be-edited.exception';

export type PartialPaymentEntityProps = Pick<
  PartialPaymentData,
  'orderId' | 'total' | 'paymentMethod'
>;

export type CompletePaymentEntityProps = PaymentData;

export class PaymentEntity extends AbstractEntity<CompletePaymentEntityProps> {
  protected markAsUpdated(): void {
    this.props.updatedAt = new Date();
  }
  public get orderId(): string {
    return this.props.orderId;
  }

  public get total(): MoneyValueObject {
    return this.props.total;
  }

  public get paymentMethod(): PaymentMethodEnum {
    return this.props.paymentMethod;
  }

  public get status(): PaymentStatusEnum {
    return this.props.status;
  }

  public get externalPaymentId(): string | null {
    return this.props.externalPaymentId;
  }

  public canBeEdited(): boolean {
    return PaymentStatusEnum.PENDING === this.status;
  }

  public setExternalPaymentId(id: string): PaymentEntity {
    this.props.externalPaymentId = id;
    this.markAsUpdated();

    return this;
  }

  public markAsPaid(): PaymentEntity {
    this.ensureCanBeEdited();

    this.props.status = PaymentStatusEnum.PAID;
    this.markAsUpdated();

    return this;
  }

  public markAsFailed(): PaymentEntity {
    this.ensureCanBeEdited();

    this.props.status = PaymentStatusEnum.FAILED;
    this.markAsUpdated();

    return this;
  }

  private ensureCanBeEdited(): void {
    if (!this.canBeEdited()) {
      throw new PaymentCanNotBeEditedException();
    }
  }
}
