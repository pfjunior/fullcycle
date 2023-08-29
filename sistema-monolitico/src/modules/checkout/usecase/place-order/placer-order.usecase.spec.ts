import Id from "../../../shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import PlaceOrderUseCase from "./placer-order.usecase";
import { PlaceOrderInputDto } from "./placer-order.usecase.dto";

const mockDate = new Date(2023, 1, 1);

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
        find: jest.fn().mockResolvedValue(true),
      };

      // @ts-expect-error - no params in constructor
      const placerOrderUseCase = new PlaceOrderUseCase();

      // @ts-expect-error - force set clientFacade
      placerOrderUseCase["_clientFacade"] = mockClientFacade;

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placerOrderUseCase, "validateProducts")
        // @ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      const input: PlaceOrderInputDto = { clientId: "c1", products: [] };

      await expect(placerOrderUseCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("validateProducts methods", () => {
    // @ts-expect-error - no params in constructor
    const placerOrderUseCase = new PlaceOrderUseCase();

    it("should throw error if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(
        placerOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("No products selected"));
    });

    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({ productId, stock: productId === "p1" ? 0 : 1 })
        ),
      };

      // @ts-expect-error - force set productFacade
      placerOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "p1" }],
      };

      await expect(
        placerOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product p1 is not available in stock"));

      input = {
        clientId: "0",
        products: [{ productId: "p1" }, { productId: "p2" }],
      };

      await expect(
        placerOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product p1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(2);

      input = {
        clientId: "0",
        products: [
          { productId: "p1" },
          { productId: "p2" },
          { productId: "p3" },
        ],
      };

      await expect(
        placerOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product p1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);
    });
  });

  describe("getProducts methods", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    // @ts-expect-error - no params in constructor
    const placerOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error when product not found", async () => {
      const mockCatalogFacade = { find: jest.fn().mockResolvedValue(null) };

      // @ts-expect-error - force set catalogFacade
      placerOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placerOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "p0",
          name: "Product 0",
          description: "Product 0 Description",
          salesPrice: 0,
        }),
      };

      // @ts-expect-error - force set catalogFacade
      placerOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placerOrderUseCase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("p0"),
          name: "Product 0",
          description: "Product 0 Description",
          salesPrice: 0,
        })
      );

      expect(mockCatalogFacade.find).toBeCalledTimes(1);
    });
  });
});
