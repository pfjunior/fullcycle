import SendEmailWhenProductIsCreatedHandler from "../../../domain/events/product/handler/send-email-when-product-is-created.handler";
import EventDispatcher from "../../../domain/events/shared/event-dispatcher";

describe("Domain Events Tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].lengt).toBe(1);
    });
});