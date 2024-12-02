import { PaymentStatusEnum } from '@marcostmunhoz/fastfood-libs';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

class InvoiceData {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentStatusEnum)
  status: PaymentStatusEnum;
}

export class InvoiceEventRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'invoice.status_changed',
    type: String,
  })
  event: 'invoice.status_changed';

  @Expose()
  @Type(() => InvoiceData)
  @ApiProperty({
    example: {
      id: 'external-id',
      status: PaymentStatusEnum.PAID,
    },
    type: InvoiceData,
  })
  data: InvoiceData;
}
