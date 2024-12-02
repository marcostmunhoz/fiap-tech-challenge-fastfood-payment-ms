import { ProcessInvoiceEventUseCase } from '@/payment/application/use-case/process-invoice-event.use-case';
import { PaymentStatusEnum } from '@marcostmunhoz/fastfood-libs';
import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceEventRequest } from '../dto/invoice-event.request';
import { InvoiceEventController } from './invoice-event.controller';

describe('InvoiceEventController', () => {
  let useCaseMock: jest.Mocked<ProcessInvoiceEventUseCase>;
  let controller: InvoiceEventController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ProcessInvoiceEventUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProcessInvoiceEventUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [InvoiceEventController],
    }).compile();

    controller = module.get<InvoiceEventController>(InvoiceEventController);
  });

  describe('execute', () => {
    it('should call the use case', async () => {
      // Arrange
      const request: InvoiceEventRequest = {
        event: 'invoice.status_changed',
        data: {
          id: 'external-id',
          status: PaymentStatusEnum.PAID,
        },
      };

      // Act
      await controller.execute(request);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith(request);
    });
  });
});
