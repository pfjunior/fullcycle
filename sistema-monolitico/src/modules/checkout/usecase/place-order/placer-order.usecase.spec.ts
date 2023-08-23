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

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      // @ts-expect-error - no params in constructor
      const placerOrderUseCase = new PlaceOrderUseCase();

      // @ts-expect-error - force set clientFacade
      placerOrderUseCase["_clientFacade"] = mockClientFacade;

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placerOrderUseCase, "validateProducts")
        // @ts-expect-error - not return never
        .mockResolvedValue(new Error("No products selected"));

      const input: PlaceOrderInputDto = { clientId: "c1", products: [] };

      await expect(placerOrderUseCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });
});
