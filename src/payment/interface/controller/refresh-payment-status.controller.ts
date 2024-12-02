import { RefreshPaymentStatusUseCase } from '@/payment/application/use-case/refresh-payment-status.use-case';

import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
  mapObjectToResponse,
  UuidParam,
} from '@marcostmunhoz/fastfood-libs';
import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaymentParam } from '../dto/payment.param';
import { RefreshPaymentStatusResponse } from '../dto/refresh-payment-status.response';

@ApiTags('Payments')
@Controller('payments')
export class RefreshPaymentStatusController {
  constructor(private readonly useCase: RefreshPaymentStatusUseCase) {}

  @Post(':id/refresh-status')
  @HttpCode(200)
  @UuidParam({ name: 'id' })
  @ApiOkResponse({ type: RefreshPaymentStatusResponse })
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @Param() param: PaymentParam,
  ): Promise<RefreshPaymentStatusResponse> {
    const result = await this.useCase.execute(param);

    return mapObjectToResponse(RefreshPaymentStatusResponse, result);
  }
}
