import { PaymentEntity as DomainPaymentEntity } from '@/payment/domain/entity/payment.entity';
import {
  getDomainPaymentEntity,
  getInfrastructurePaymentEntity,
  getTypeOrmMongoRepositoryMock,
} from '@/payment/testing/helpers';
import {
  EntityIdValueObject,
  getValidPaymentEntityId,
  PaymentStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { DataSource, MongoRepository } from 'typeorm';
import { PaymentEntity as InfrastructurePaymentEntity } from '../entity/payment.entity';
import { TypeOrmPaymentRepository } from './type-orm-payment.repository';

describe('TypeOrmPaymentRepository', () => {
  let fakeDataSource: jest.Mocked<DataSource>;
  let repositoryMock: jest.Mocked<MongoRepository<InfrastructurePaymentEntity>>;
  let sut: TypeOrmPaymentRepository;

  beforeEach(() => {
    repositoryMock =
      getTypeOrmMongoRepositoryMock<InfrastructurePaymentEntity>() as unknown as jest.Mocked<
        MongoRepository<InfrastructurePaymentEntity>
      >;
    fakeDataSource = {
      getMongoRepository: () => repositoryMock,
    } as unknown as jest.Mocked<DataSource>;
    sut = new TypeOrmPaymentRepository(fakeDataSource);
  });

  describe('findById', () => {
    it('should return false when a payment with the provided order ID does not exist', async () => {
      // Arrange
      const id = getValidPaymentEntityId();

      // Act
      const result = await sut.findById(id);

      // Assert
      expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: id.value });
      expect(result).toBeNull();
    });

    it('should return the payment when it exists', async () => {
      // Arrange
      const dbEntity = getInfrastructurePaymentEntity();
      const id = EntityIdValueObject.create(dbEntity.id);
      repositoryMock.findOneBy.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.findById(id);

      // Assert
      expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
        id: dbEntity.id,
      });
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainPaymentEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.orderId).toBe(dbEntity.orderId);
      expect(result.total.value).toBe(dbEntity.total);
      expect(result.paymentMethod).toBe(dbEntity.paymentMethod);
      expect(result.status).toBe(dbEntity.status);
      expect(result.externalPaymentId).toBe(dbEntity.externalPaymentId);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });
  });

  describe('existsWithOrderIdAndNotFailed', () => {
    it('should return true when a payment with the provided order ID exists and is not failed', async () => {
      // Arrange
      const dbEntity = getInfrastructurePaymentEntity();
      repositoryMock.findOne.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.existsWithOrderIdAndNotFailed(dbEntity.orderId);

      // Assert
      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          orderId: dbEntity.orderId,
          status: {
            $in: [PaymentStatusEnum.PENDING, PaymentStatusEnum.PAID],
          },
        },
      });
      expect(result).toBe(true);
    });
  });

  describe('save', () => {
    it('should create a payment when it does not exist', async () => {
      // Arrange
      const entity = getDomainPaymentEntity();
      const dbEntity = getInfrastructurePaymentEntity(entity);

      // Act
      const result = await sut.save(entity);

      // Assert
      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: entity.id.value },
      });
      expect(repositoryMock.insertOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.insertOne).toHaveBeenCalledWith(dbEntity);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainPaymentEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.orderId).toBe(dbEntity.orderId);
      expect(result.total.value).toBe(dbEntity.total);
      expect(result.paymentMethod).toBe(dbEntity.paymentMethod);
      expect(result.status).toBe(dbEntity.status);
      expect(result.externalPaymentId).toBe(dbEntity.externalPaymentId);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });

    it('should update an existing payment', async () => {
      // Arrange
      const entity = getDomainPaymentEntity();
      const dbEntity = getInfrastructurePaymentEntity(entity);
      repositoryMock.findOne.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.save(entity);

      // Assert
      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: entity.id.value },
      });
      expect(repositoryMock.updateOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.updateOne).toHaveBeenCalledWith(
        { id: entity.id.value },
        { $set: { ...dbEntity } },
        { upsert: true },
      );
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainPaymentEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.orderId).toBe(dbEntity.orderId);
      expect(result.total.value).toBe(dbEntity.total);
      expect(result.paymentMethod).toBe(dbEntity.paymentMethod);
      expect(result.status).toBe(dbEntity.status);
      expect(result.externalPaymentId).toBe(dbEntity.externalPaymentId);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });
  });
});
