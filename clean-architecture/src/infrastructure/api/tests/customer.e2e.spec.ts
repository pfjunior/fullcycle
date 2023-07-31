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
});