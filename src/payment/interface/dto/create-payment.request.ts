import { PaymentMethodEnum, UuidProperty } from '@marcostmunhoz/fastfood-libs';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

class PaymentCardData {
  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  expiration: string;

  @IsNotEmpty()
  @IsString()
  verificationCode: string;
}

export class CreatePaymentRequest {
  @IsNotEmpty()
  @IsString()
  @UuidProperty()
  orderId: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethodEnum)
  @ApiProperty({
    example: PaymentMethodEnum.CREDIT_CARD,
    enum: PaymentMethodEnum,
  })
  paymentMethod: PaymentMethodEnum;

  @Expose()
  @Type(() => PaymentCardData)
  @ApiProperty({
    example: {
      number: '1111222233334444',
      expiration: '12/2030',
      verificationCode: '123',
    },
    type: PaymentCardData,
    required: false,
  })
  cardData?: PaymentCardData;
}
