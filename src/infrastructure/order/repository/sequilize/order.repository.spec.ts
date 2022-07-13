import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  const products: Product[] = [];
  const customers: Customer[] = [];

  beforeAll(() => {
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    customers.push(customer);

    products.push(new Product("123", "Product 1", 11));
    products.push(new Product("456", "Product 2", 20));
    products.push(new Product("789", "Product 3", 5));
  });

  beforeEach(async () => {
    return await bootstrapDb();
  });

  afterEach(async () => {
    return await sequelize.close();
  });

  it("should create a new order", async () => {
    const order = getOrder("123", 2);

    const orderRepository = new OrderRepository();

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      status: order.status,
      items: order.items.map((ordermItem) => ({
        id: ordermItem.id,
        name: ordermItem.name,
        price: ordermItem.price,
        quantity: ordermItem.quantity,
        order_id: order.id,
        product_id: ordermItem.productId,
        unity_price: ordermItem.unityPrice,
      })),
    });
  });

  it("should update an order", async () => {
    const order = getOrder("123", 2);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    order.approve();

    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      status: order.status,
      items: order.items.map((ordermItem) => ({
        id: ordermItem.id,
        name: ordermItem.name,
        price: ordermItem.price,
        quantity: ordermItem.quantity,
        order_id: order.id,
        product_id: ordermItem.productId,
        unity_price: ordermItem.unityPrice,
      })),
    });
  });

  it("should update an order", async () => {
    const order = getOrder("123", 1);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    order.approve();

    orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      status: order.status,
      items: order.items.map((ordermItem) => ({
        id: ordermItem.id,
        name: ordermItem.name,
        price: ordermItem.price,
        quantity: ordermItem.quantity,
        order_id: order.id,
        product_id: ordermItem.productId,
        unity_price: ordermItem.unityPrice,
      })),
    });
  });

  it("should throw when order not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("unk");
    }).rejects.toThrow("Order not found");
  });

  it("shoud find an order", async () => {
    const order = getOrder("123", 2);
    order.ship();
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderFound = await orderRepository.find(order.id);

    expect(JSON.stringify(orderFound)).toStrictEqual(JSON.stringify(order));
  });

  it("should find all orders", async () => {
    const orderRepository = new OrderRepository();

    const order1 = getOrder("123", 1);
    const order2 = getOrder("456", 3);

    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toHaveLength(2);

    expect(foundOrders).toContainEqual<Order>(order1);
    expect(foundOrders).toContainEqual<Order>(order2);
  });

  async function bootstrapDb() {
    try {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });

      await sequelize.addModels([
        CustomerModel,
        OrderModel,
        OrderItemModel,
        ProductModel,
      ]);

      await sequelize.sync({ force: true });

      const customerRepository = new CustomerRepository();
      for (let c of customers) {
        await customerRepository.create(c);
      }
      const productRepository = new ProductRepository();
      for (let p of products) {
        await productRepository.create(p);
      }
    } catch (err) {
      console.dir(err);
    }
  }

  function getOrder(id: string, numberOfItens: number = 1) {
    const customer = customers[0];
    const orderItens: OrderItem[] = [];

    for (let i = 0; i < numberOfItens; i++) {
      orderItens.push(
        new OrderItem(
          uuid(),
          products[i].name,
          products[i].price,
          products[i].id,
          i + 1
        )
      );
    }

    return new Order(
      id,
      customer.id,
      orderItens.sort((x, y) => x.id.localeCompare(y.id))
    );
  }
});
