import { PaymentEntity as DomainPaymentEntity } from '@/payment/domain/entity/payment.entity';
import {
  getDomainPaymentEntity,
  getInfrastructurePaymentEntity,
} from '@/payment/testing/helpers';
import {
  EntityIdValueObject,
  getTypeOrmRepositoryMock,
  getValidPaymentEntityId,
  PaymentStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { In, Repository } from 'typeorm';
import { PaymentEntity as InfrastructurePaymentEntity } from '../entity/payment.entity';
import { TypeOrmPaymentRepository } from './type-orm-payment.repository';

describe('TypeOrmPaymentRepository', () => {
  let repositoryMock: jest.Mocked<Repository<InfrastructurePaymentEntity>>;
  let sut: TypeOrmPaymentRepository;

  beforeEach(() => {
    const mocks = getTypeOrmRepositoryMock<InfrastructurePaymentEntity>();
    repositoryMock = mocks.repositoryMock as unknown as jest.Mocked<
      Repository<InfrastructurePaymentEntity>
    >;
    sut = new TypeOrmPaymentRepository(repositoryMock);
  });

  describe('findById', () => {
    it('should return false when a payment with the provided order ID does not exist', async () => {
      // Arrange
      const id = getValidPaymentEntityId();
      repositoryMock.findOneBy.mockResolvedValue(null);

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
      repositoryMock.exists.mockResolvedValue(true);

      // Act
      const result = await sut.existsWithOrderIdAndNotFailed(dbEntity.orderId);

      // Assert
      expect(repositoryMock.exists).toHaveBeenCalledTimes(1);
      expect(repositoryMock.exists).toHaveBeenCalledWith({
        where: {
          orderId: dbEntity.orderId,
          status: In([PaymentStatusEnum.PENDING, PaymentStatusEnum.PAID]),
        },
      });
      expect(result).toBe(true);
    });
  });

  describe('save', () => {
    it('should create a payment', async () => {
      // Arrange
      const entity = getDomainPaymentEntity();
      const dbEntity = getInfrastructurePaymentEntity(entity);
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.save(entity);

      // Assert
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(dbEntity);
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
