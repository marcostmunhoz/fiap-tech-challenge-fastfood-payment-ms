import { PaymentStatusEnum } from '@marcostmunhoz/fastfood-libs';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RefreshPaymentStatusResponse {
  @Expose()
  @ApiProperty({
    example: PaymentStatusEnum.PAID,
    enum: PaymentStatusEnum,
  })
  status: string;
}
