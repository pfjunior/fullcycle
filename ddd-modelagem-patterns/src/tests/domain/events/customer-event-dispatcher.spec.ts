import CustomerAddressChangedEvent from "../../../domain/events/customer/customer-address-changed.event";
import CustomerCreatedEvent from "../../../domain/events/customer/customer-created.events";
import SendConsoleLogHandler from "../../../domain/events/customer/handler/send-console-log-when-address-is-changed.handler";
import SendConsoleLog1Handler from "../../../domain/events/customer/handler/send-console-log1-when-customer-created.handler";
import SendConsoleLog2Handler from "../../../domain/events/customer/handler/send-console-log2-when-custom.handler.ts";
import EventDispatcher from "../../../domain/events/shared/event-dispatcher";

describe("Domain Events Tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLog1Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLog1Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);
    });

    it("should unregister all event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLog1Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
    });


    it("should notify an event when customer is created", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new SendConsoleLog1Handler();
        const eventHandler2 = new SendConsoleLog2Handler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        const customerCreatedEvent1 = new CustomerCreatedEvent({ id: "c1", name: "Customer 01" });
        const customerCreatedEvent2 = new CustomerCreatedEvent({ id: "c2", name: "Customer 02" });

        eventDispatcher.notify(customerCreatedEvent1);
        eventDispatcher.notify(customerCreatedEvent2);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should notify an event when customer address is changed", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({ street: "Street 01", number: "1", zip: "12345-678", city: "City 01" });

        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});