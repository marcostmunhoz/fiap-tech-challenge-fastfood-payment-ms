import { DomainException } from '@marcostmunhoz/fastfood-libs';

export class InvalidPaymentStatusException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
