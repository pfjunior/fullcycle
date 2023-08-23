import PlaceOrderUseCase from "./placer-order.usecase";
import { PlaceOrderInputDto } from "./placer-order.usecase.dto";

describe("Place Order UseCase Unit Test", () => {
  describe("Execute Method", () => {
    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };
      // @ts-expect-error - no params in constructor
      const placerOrderUseCase = new PlaceOrderUseCase();

      // @ts-expect-error - force set clientFacade
      placerOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = { clientId: "0", products: [] };

      await expect(placerOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });
  });
});
