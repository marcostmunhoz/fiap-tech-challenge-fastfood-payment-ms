import { ProcessInvoiceEventUseCase } from '@/payment/application/use-case/process-invoice-event.use-case';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
} from '@marcostmunhoz/fastfood-libs';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceEventRequest } from '../dto/invoice-event.request';

@ApiTags('Payments')
@Controller('payments')
export class InvoiceEventController {
  constructor(private readonly useCase: ProcessInvoiceEventUseCase) {}

  @Post('invoice-event')
  @HttpCode(204)
  @ApiNoContentResponse()
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(@Body() request: InvoiceEventRequest): Promise<void> {
    await this.useCase.execute(request);
  }
}
