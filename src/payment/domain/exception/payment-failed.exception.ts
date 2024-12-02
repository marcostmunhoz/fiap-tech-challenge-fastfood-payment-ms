import { DomainException } from '@marcostmunhoz/fastfood-libs';

export class PaymentFailedException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
