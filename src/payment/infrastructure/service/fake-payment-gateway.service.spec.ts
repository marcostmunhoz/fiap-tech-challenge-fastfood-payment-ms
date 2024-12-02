import { FakePaymentGatewayService } from './fake-payment-gateway.service';

describe('FakePaymentGatewayService', () => {
  it('should be defined', () => {
    expect(new FakePaymentGatewayService()).toBeDefined();
  });
});
