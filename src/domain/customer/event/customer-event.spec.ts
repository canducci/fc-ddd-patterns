import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import CustomerFactory from "../factory/customer.factory";
import Address from "../value-object/address";
import AddressChangedEvent from "./address-changed.event";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleAddressChangedEventHandler from "./handler/envia-console-log-when-address-changed.handler";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";

describe("Customer events tests", () => {
  it("should console log 1 when user is created", () => {
    const eventDispatcher = new EventDispatcher();
    const log1EventHandler = new EnviaConsoleLog1Handler();

    const handleSpy = jest.spyOn(log1EventHandler, "handle");
    const consoleSpy = jest.spyOn(console, "log");

    eventDispatcher.register("CustomerCreatedEvent", log1EventHandler);

    const event = new CustomerCreatedEvent(new Customer("c1", "Customer 1"));

    eventDispatcher.notify(event);

    expect(handleSpy).toBeCalled();
    expect(consoleSpy).toBeCalled();
    expect(consoleSpy).toBeCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
  });

  it("should console log 2 when user is created", () => {
    const eventDispatcher = new EventDispatcher();
    const log2EventHandler = new EnviaConsoleLog2Handler();

    const handleSpy = jest.spyOn(log2EventHandler, "handle");
    const consoleSpy = jest.spyOn(console, "log");

    eventDispatcher.register("CustomerCreatedEvent", log2EventHandler);

    const event = new CustomerCreatedEvent(new Customer("c1", "Customer 1"));

    eventDispatcher.notify(event);

    expect(handleSpy).toBeCalled();
    expect(consoleSpy).toBeCalled();
    expect(consoleSpy).toBeCalledWith(
      "Esse é o segundo console.log do evento: CustomerCreated"
    );
  });

  it("should console log 1 and log 2 when user is created", () => {
    const eventDispatcher = new EventDispatcher();
    const log1EventHandler = new EnviaConsoleLog1Handler();
    const log2EventHandler = new EnviaConsoleLog2Handler();

    const consoleSpy = jest.spyOn(console, "log");

    eventDispatcher.register("CustomerCreatedEvent", log1EventHandler);
    eventDispatcher.register("CustomerCreatedEvent", log2EventHandler);

    const event = new CustomerCreatedEvent(new Customer("c1", "Customer 1"));

    eventDispatcher.notify(event);

    expect(consoleSpy).toBeCalledTimes(2);
    expect(consoleSpy).toBeCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
    expect(consoleSpy).toBeCalledWith(
      "Esse é o segundo console.log do evento: CustomerCreated"
    );
  });

  it("should console log address changed", () => {
    const eventDispatcher = new EventDispatcher();
    const addressEventHandler = new EnviaConsoleAddressChangedEventHandler();

    const consoleSpy = jest.spyOn(console, "log");

    eventDispatcher.register("AddressChangedEvent", addressEventHandler);

    const customer = new Customer("c1", "Juan");
    customer.changeAddress(
      new Address("R Flores", 123, "90999-909", "Ipatinga")
    );

    const addressChangedEvent = new AddressChangedEvent(customer);
    eventDispatcher.notify(addressChangedEvent);

    expect(consoleSpy).toBeCalledWith(
      `Endereço do cliente: ${customer.id}, ${
        customer.name
      } alterado para: ${customer.Address.toString()}`
    );
  });

  it("should dispatch CustomerCreated event", () => {
    const eventDispatcher = EventDispatcher.getInstance();
    const log1EventHandler = new EnviaConsoleLog1Handler();
    eventDispatcher.register("CustomerCreatedEvent", log1EventHandler);

    const dispatcherSpy = jest.spyOn(eventDispatcher, "notify");
    const handleSpy = jest.spyOn(log1EventHandler, "handle");

    CustomerFactory.create("Juan");

    expect(dispatcherSpy).toBeCalled();
    expect(handleSpy).toBeCalled();
  });

  it("should dispatch AddressChanged event", () => {
    const eventDispatcher = EventDispatcher.getInstance();
    const addressEventHandler = new EnviaConsoleAddressChangedEventHandler();
    eventDispatcher.register("AddressChangedEvent", addressEventHandler);

    const dispatcherSpy = jest.spyOn(eventDispatcher, "notify");
    const handleSpy = jest.spyOn(addressEventHandler, "handle");

    const customer = new Customer("c1", "Juan");
    customer.changeAddress(
      new Address("R Flores", 123, "90999-909", "Ipatinga")
    );

    expect(dispatcherSpy).toBeCalled();
    expect(handleSpy).toBeCalled();
  });
});
