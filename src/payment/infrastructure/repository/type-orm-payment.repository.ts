import { PaymentEntity as DomainPaymentEntity } from '@/payment/domain/entity/payment.entity';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import {
  EntityIdValueObject,
  MoneyValueObject,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MongoRepository } from 'typeorm';
import { PaymentEntity as InfrastructurePaymentEntity } from '../entity/payment.entity';

export class TypeOrmPaymentRepository implements PaymentRepository {
  private readonly typeOrmRepository: MongoRepository<InfrastructurePaymentEntity>;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.typeOrmRepository = this.dataSource.getMongoRepository(
      InfrastructurePaymentEntity,
    );
  }

  async findById(id: EntityIdValueObject): Promise<DomainPaymentEntity> {
    const dbEntity = await this.typeOrmRepository.findOneBy({ id: id.value });

    if (!dbEntity) {
      return null;
    }

    return this.mapToDomainEntity(dbEntity);
  }

  async findByExternalPaymentId(
    externalPaymentId: string,
  ): Promise<DomainPaymentEntity> {
    const dbEntity = await this.typeOrmRepository.findOneBy({
      externalPaymentId,
    });

    if (!dbEntity) {
      return null;
    }

    return this.mapToDomainEntity(dbEntity);
  }

  async existsWithOrderIdAndNotFailed(orderId: string): Promise<boolean> {
    const order = await this.typeOrmRepository.findOne({
      where: {
        orderId,
        status: {
          $in: [PaymentStatusEnum.PENDING, PaymentStatusEnum.PAID],
        },
      },
    });

    return !!order;
  }
  async save(payment: DomainPaymentEntity): Promise<DomainPaymentEntity> {
    const dbEntity = await this.typeOrmRepository.save(
      this.mapToDbEntity(payment),
    );

    return this.mapToDomainEntity(dbEntity);
  }

  private mapToDomainEntity(
    entity: InfrastructurePaymentEntity,
  ): DomainPaymentEntity {
    return new DomainPaymentEntity({
      id: EntityIdValueObject.create(entity.id),
      orderId: entity.orderId,
      total: MoneyValueObject.create(entity.total),
      paymentMethod: entity.paymentMethod as PaymentMethodEnum,
      status: entity.status as PaymentStatusEnum,
      externalPaymentId: entity.externalPaymentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private mapToDbEntity(
    entity: DomainPaymentEntity,
  ): InfrastructurePaymentEntity {
    return {
      id: entity.id.value,
      orderId: entity.orderId,
      total: entity.total.value,
      paymentMethod: entity.paymentMethod,
      status: entity.status,
      externalPaymentId: entity.externalPaymentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
