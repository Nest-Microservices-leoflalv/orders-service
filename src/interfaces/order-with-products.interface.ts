import { OrderStatus } from '@prisma/client';

export interface OrderWithProducts {
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  paid: boolean;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
  OrderItem: {
    name: string;
    price: number;
    productId: number;
    quantity: number;
  }[];
}
