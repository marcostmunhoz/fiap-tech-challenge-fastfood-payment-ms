import { DomainException } from '@marcostmunhoz/fastfood-libs';

export class InvalidPaymentMethodException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
