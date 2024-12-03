import {
  FastfoodLibsModule,
  TypeOrmModuleOptionsToken,
} from '@marcostmunhoz/fastfood-libs';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { PaymentEntity } from './payment/infrastructure/entity/payment.entity';
import * as migrations from './payment/infrastructure/migrations';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    FastfoodLibsModule.forRootAsync({
      imports: [],
      useFactory: () => ({
        database: {
          migrations,
          migrationsTransactionMode: 'none',
          runMigrationsOnStartup: true,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (options: TypeOrmModuleOptions) => {
        return {
          ...options,
          entities: [PaymentEntity],
        };
      },
      inject: [TypeOrmModuleOptionsToken],
    }),
    TypeOrmModule.forFeature([PaymentEntity]),
    HealthModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
