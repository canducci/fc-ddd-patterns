import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        status: entity.status,
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          unity_price: item.unityPrice,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      { status: entity.status },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findByPk(id, {
        include: [{ model: OrderItemModel }],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const order = new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(
        (oim) =>
          new OrderItem(
            oim.id,
            oim.name,
            oim.unity_price,
            oim.product_id,
            oim.quantity
          )
      )
    );

    Object.assign(order, { _status: orderModel.status });

    return order;
  }

  async findAll(): Promise<Order[]> {
    const foundModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    return foundModels.map((model) => {
      const order = new Order(
        model.id,
        model.customer_id,

        model.items.map((item) => {
          return new OrderItem(
            item.id,
            item.name,
            item.unity_price,
            item.product_id,
            item.quantity
          );
        })
      );
      Object.assign(order, { _status: model.status });
      return order;
    });
  }
}
