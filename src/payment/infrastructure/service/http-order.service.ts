import {
  OrderData,
  OrderService,
} from '@/payment/application/service/order.service.interface';
import {
  EntityIdValueObject,
  HttpClientService,
  MoneyValueObject,
  OrderStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';
import { PAYMENT_CONFIG_PROPS, PaymentConfig } from '../config/payment.config';

type HttpOrderData = {
  id: string;
  status: string;
  total: number;
};

export class HttpOrderService implements OrderService {
  constructor(
    @Inject(PAYMENT_CONFIG_PROPS.KEY)
    private readonly paymentConfig: PaymentConfig,
    private readonly httpClient: HttpClientService,
  ) {}

  async findById(id: EntityIdValueObject): Promise<OrderData> {
    const data = await this.httpClient.requestJson<HttpOrderData>(
      'get',
      `${this.paymentConfig.ORDER_SERVICE_URL}/api/v1/orders/${id.value}`,
    );

    return {
      id: EntityIdValueObject.create(data.id),
      status: data.status as OrderStatusEnum,
      total: MoneyValueObject.createFromFloat(data.total),
    };
  }

  async setAsPaid(id: EntityIdValueObject): Promise<void> {
    await this.httpClient.requestJson(
      'post',
      `${this.paymentConfig.ORDER_SERVICE_URL}/api/v1/orders/${id.value}/change-status`,
      { status: OrderStatusEnum.PAID },
    );
  }
  async setAsCanceled(id: EntityIdValueObject): Promise<void> {
    await this.httpClient.requestJson(
      'post',
      `${this.paymentConfig.ORDER_SERVICE_URL}/api/v1/orders/${id.value}/change-status`,
      { status: OrderStatusEnum.CANCELED },
    );
  }
}
