import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  readonly #logger = new Logger(OrdersService.name);

  async onModuleInit() {
    await this.$connect();
    this.#logger.log('Connected to database');
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.order.create({
      data: createOrderDto,
    });
    return order;
  }

  async findAll(paginationDto: OrderPaginationDto) {
    const totalPages = await this.order.count({
      where: {
        status: paginationDto.status,
      },
    });
    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;

    const orders = await this.order.findMany({
      skip: (currentPage - 1) * perPage,
      take: perPage,
      where: {
        status: paginationDto.status,
      },
    });

    return {
      data: orders,
      total: totalPages,
      page: currentPage,
      lastPage: Math.ceil(totalPages / perPage),
    };
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }

    return order;
  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${changeOrderStatusDto.id} not found`,
      });
    }

    return order;
  }
}
