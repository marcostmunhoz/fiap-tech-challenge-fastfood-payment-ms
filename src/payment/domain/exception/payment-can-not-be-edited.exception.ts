import { DomainException } from '@marcostmunhoz/fastfood-libs';

export class PaymentCanNotBeEditedException extends DomainException {
  constructor() {
    super('Only pending payments can be edited.');
  }
}
