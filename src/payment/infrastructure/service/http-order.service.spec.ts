import {
  getCompleteOrderData,
  HttpClientService,
} from '@marcostmunhoz/fastfood-libs';
import { PaymentConfig } from '../config/payment.config';
import { HttpOrderService } from './http-order.service';

describe('HttpOrderService', () => {
  let httpClient: jest.Mocked<HttpClientService>;
  let paymentConfig: PaymentConfig;
  let sut: HttpOrderService;

  beforeEach(() => {
    httpClient = {
      requestJson: jest.fn(),
    } as unknown as jest.Mocked<HttpClientService>;
    paymentConfig = {
      ORDER_SERVICE_URL: 'http://localhost:3000',
    };
    sut = new HttpOrderService(paymentConfig, httpClient);
  });

  describe('findByCode', () => {
    it('should call requestJson with correct url', async () => {
      // Arrange
      const { id, status, total } = getCompleteOrderData();
      const data = { id, status, total };
      httpClient.requestJson.mockResolvedValue({
        id: data.id.value,
        status: data.status,
        total: data.total.valueAsFloat,
      });

      // Act
      const response = await sut.findById(data.id);

      // Assert
      expect(httpClient.requestJson).toHaveBeenCalledTimes(1);
      expect(httpClient.requestJson).toHaveBeenCalledWith(
        'get',
        `http://localhost:3000/api/v1/orders/${data.id.value}`,
      );
      expect(response).toEqual(data);
    });
  });
});
