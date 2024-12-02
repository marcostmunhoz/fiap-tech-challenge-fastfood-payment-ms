import {
  EntityIdValueObject,
  TransformPrimitiveToValueObject,
} from '@marcostmunhoz/fastfood-libs';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentParam {
  @IsNotEmpty()
  @IsString()
  @TransformPrimitiveToValueObject(EntityIdValueObject)
  id: EntityIdValueObject;
}
