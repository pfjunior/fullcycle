import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E Test for Customer", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "Customer 1",
                address: {
                    street: "Street 1",
                    number: 101,
                    zip: "12345-678",
                    city: "City 1"
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Customer 1");
        expect(response.body.address.street).toBe("Street 1");
        expect(response.body.address.number).toBe(101);
        expect(response.body.address.zip).toBe("12345-678");
        expect(response.body.address.city).toBe("City 1");
    });

    it("should not create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "Customer 1"
            });

        expect(response.status).toBe(500);
    });

    it("should list all customers", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "Customer 1",
                address: {
                    street: "Street 1",
                    number: 101,
                    zip: "12345-678",
                    city: "City 1"
                }
            });
        expect(response.status).toBe(200);

        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "Customer 2",
                address: {
                    street: "Street 2",
                    number: 202,
                    zip: "12345-789",
                    city: "City 2"
                }
            });
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/customer").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);

        const customer = listResponse.body.customers[0];
        expect(customer.name).toBe("Customer 1");
        expect(customer.address.street).toBe("Street 1");

        const customer2 = listResponse.body.customers[1];
        expect(customer2.name).toBe("Customer 2");
        expect(customer2.address.street).toBe("Street 2");
    });

    it("should list all customers with response in xml", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "Customer 1",
                address: {
                    street: "Street 1",
                    number: 101,
                    zip: "12345-678",
                    city: "City 1"
                }
            });
        expect(response.status).toBe(200);

        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "Customer 2",
                address: {
                    street: "Street 2",
                    number: 202,
                    zip: "12345-789",
                    city: "City 2"
                }
            });
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/customer").set("Accept", "application/xml").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(listResponse.text).toContain(`<customers>`);
        expect(listResponse.text).toContain(`<customer>`);
        expect(listResponse.text).toContain(`<name>Customer 1</name>`);
        expect(listResponse.text).toContain(`<address>`);
        expect(listResponse.text).toContain(`<street>Street 1</street>`);
        expect(listResponse.text).toContain(`<number>101</number>`);
        expect(listResponse.text).toContain(`<zip>12345-678</zip>`);
        expect(listResponse.text).toContain(`<city>City 1</city>`);
        expect(listResponse.text).toContain(`</address>`);
        expect(listResponse.text).toContain(`</customer>`);
        expect(listResponse.text).toContain(`<name>Customer 2</name>`);
        expect(listResponse.text).toContain(`<street>Street 2</street>`);
        expect(listResponse.text).toContain(`</customers>`);
    });
});