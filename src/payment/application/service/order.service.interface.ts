import { EntityIdValueObject, OrderData } from '@marcostmunhoz/fastfood-libs';

export interface OrderService {
  findById(id: EntityIdValueObject): Promise<OrderData>;
  setAsPaid(id: EntityIdValueObject): Promise<void>;
  setAsCanceled(id: EntityIdValueObject): Promise<void>;
}
