import {
  PaymentStatusEnum,
  TransformValueObjectToPrimitive,
  UuidProperty,
} from '@marcostmunhoz/fastfood-libs';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class PaymentData {
  @Expose()
  qrCode: string;

  @Expose()
  qrCodeText: string;
}

export class CreatePaymentResponse {
  @Expose()
  @TransformValueObjectToPrimitive()
  @UuidProperty()
  id: string;

  @Expose()
  @ApiProperty({
    example: PaymentStatusEnum.PENDING,
    enum: PaymentStatusEnum,
  })
  status: string;

  @Expose()
  @Type(() => PaymentData)
  @ApiProperty({
    example: {
      qrCode: 'https://example.com/qr-code.png',
      qrCodeText:
        '00020101021226880014br.gov.bcb.pix0136258e7-0b2f-4b7d-8b7a-9d7ebf0d6f0d520400005303986540510303986540520405234.856304587-0606-4b6b-9d7e-0f0d6f0d6f0d530398654053039865405403.005802BR5923MerchantName6009SALESMAN6010BRANDS INC62070503***6304B3E4',
    },
    type: PaymentData,
    required: false,
  })
  paymentData?: PaymentData;
}
