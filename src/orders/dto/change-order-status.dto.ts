import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatusList } from '../enum/orders.enum';
import { OrderStatus } from '@prisma/client';

export class ChangeOrderStatusDto {
  @IsUUID(4)
  id: string;

  @IsEnum(OrderStatusList, {
    message: `Valid status options are: ${OrderStatusList.join(', ')}`,
  })
  status: OrderStatus;
}
