import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePaymentUseCase } from './application/use-case/create-payment.use-case';
import { ProcessInvoiceEventUseCase } from './application/use-case/process-invoice-event.use-case';
import { RefreshPaymentStatusUseCase } from './application/use-case/refresh-payment-status.use-case';
import { PaymentFactory } from './domain/factory/payment.factory';
import { PaymentEntity } from './infrastructure/entity/payment.entity';
import { TypeOrmPaymentRepository } from './infrastructure/repository/type-orm-payment.repository';
import { FakePaymentGatewayService } from './infrastructure/service/fake-payment-gateway.service';
import { CreatePaymentController } from './interface/controller/create-payment.controller';
import { InvoiceEventController } from './interface/controller/invoice-event.controller';
import { RefreshPaymentStatusController } from './interface/controller/refresh-payment-status.controller';
import { PaymentGatewayServiceToken, PaymentRepositoryToken } from './tokens';

const factories = [PaymentFactory];
const useCases = [
  CreatePaymentUseCase,
  RefreshPaymentStatusUseCase,
  ProcessInvoiceEventUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), SharedModule],
  providers: [
    {
      provide: PaymentRepositoryToken,
      useClass: TypeOrmPaymentRepository,
    },
    {
      provide: PaymentGatewayServiceToken,
      useClass: FakePaymentGatewayService,
    },
    ...factories,
    ...useCases,
  ],
  controllers: [
    CreatePaymentController,
    RefreshPaymentStatusController,
    InvoiceEventController,
  ],
})
export class PaymentModule {}
