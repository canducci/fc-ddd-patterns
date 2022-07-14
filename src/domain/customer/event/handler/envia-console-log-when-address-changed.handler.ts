import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import AddressChangedEvent from "../address-changed.event";

export default class EnviaConsoleAddressChangedEventHandler implements EventHandlerInterface<AddressChangedEvent> {
    handle(event: AddressChangedEvent): void {
        const customer = event.eventData;
        console.log(`Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.Address.toString()}`);        
    }
    
}