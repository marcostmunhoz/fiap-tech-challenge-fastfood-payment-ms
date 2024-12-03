import { validateConfig } from '@marcostmunhoz/fastfood-libs';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentConfig {
  @IsString()
  @IsNotEmpty()
  ORDER_SERVICE_URL: string;
}

export const PAYMENT_CONFIG_PROPS = registerAs('payment', () => {
  const props = {
    ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL,
  };

  return validateConfig(PaymentConfig, props);
});
