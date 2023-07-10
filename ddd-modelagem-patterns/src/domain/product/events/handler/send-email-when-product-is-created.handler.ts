import EventHandlerInterface from "../../../shared/events/event-handler.interface";
import ProductCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface<ProductCreatedEvent>{
    handle(event: ProductCreatedEvent): void {
        console.log(`Sending e-mail to ...`);
    }

}