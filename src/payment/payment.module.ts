import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePaymentUseCase } from './application/use-case/create-payment.use-case';
import { ProcessInvoiceEventUseCase } from './application/use-case/process-invoice-event.use-case';
import { RefreshPaymentStatusUseCase } from './application/use-case/refresh-payment-status.use-case';
import { PaymentFactory } from './domain/factory/payment.factory';
import { PAYMENT_CONFIG_PROPS } from './infrastructure/config/payment.config';
import { PaymentEntity } from './infrastructure/entity/payment.entity';
import { TypeOrmPaymentRepository } from './infrastructure/repository/type-orm-payment.repository';
import { FakePaymentGatewayService } from './infrastructure/service/fake-payment-gateway.service';
import { HttpOrderService } from './infrastructure/service/http-order.service';
import { CreatePaymentController } from './interface/controller/create-payment.controller';
import { InvoiceEventController } from './interface/controller/invoice-event.controller';
import { RefreshPaymentStatusController } from './interface/controller/refresh-payment-status.controller';
import {
  OrderServiceToken,
  PaymentGatewayServiceToken,
  PaymentRepositoryToken,
} from './tokens';

const useCases: Provider[] = [
  CreatePaymentUseCase,
  RefreshPaymentStatusUseCase,
  ProcessInvoiceEventUseCase,
];
const factories = [PaymentFactory];
const tokens: Provider[] = [
  {
    provide: PaymentRepositoryToken,
    useClass: TypeOrmPaymentRepository,
  },
  {
    provide: PaymentGatewayServiceToken,
    useClass: FakePaymentGatewayService,
  },
  {
    provide: OrderServiceToken,
    useClass: HttpOrderService,
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    ConfigModule.forRoot({
      isGlobal: false,
      load: [PAYMENT_CONFIG_PROPS],
    }),
  ],
  providers: [...useCases, ...factories, ...tokens],
  controllers: [
    CreatePaymentController,
    RefreshPaymentStatusController,
    InvoiceEventController,
  ],
})
export class PaymentModule {}
