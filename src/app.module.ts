import {
  FastfoodLibsModule,
  TypeOrmModuleOptionsToken,
} from '@marcostmunhoz/fastfood-libs';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import * as migrations from './module/infrastructure/migrations';

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
          entities: [],
        };
      },
      inject: [TypeOrmModuleOptionsToken],
    }),
    TypeOrmModule.forFeature([]),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
