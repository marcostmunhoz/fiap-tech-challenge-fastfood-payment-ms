import {
  EntityIdValueObject,
  MoneyValueObject,
  OrderStatusEnum,
} from '@marcostmunhoz/fastfood-libs';

export type OrderData = {
  id: EntityIdValueObject;
  status: OrderStatusEnum;
  total: MoneyValueObject;
};

export interface OrderService {
  findById(id: EntityIdValueObject): Promise<OrderData>;
  setAsPaid(id: EntityIdValueObject): Promise<void>;
  setAsCanceled(id: EntityIdValueObject): Promise<void>;
}
