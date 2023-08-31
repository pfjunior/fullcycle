import Id from "../../../shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import PlaceOrderUseCase from "./placer-order.usecase";
import { PlaceOrderInputDto } from "./placer-order.usecase.dto";

const mockDate = new Date(2023, 1, 1);

describe("Place Order UseCase Unit Test", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

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

    describe("place an order", () => {
      const clientProps = {
        id: "c1",
        name: "Client 1",
        email: "client@email.com",
        address: "Street 1, 101 - City 1",
      };

      const mockClientFacade = {
        add: jest.fn(),
        find: jest.fn().mockResolvedValue(clientProps),
      };

      const mockPaymentFacade = { process: jest.fn() };

      const mockCheckoutRepository = {
        addOrder: jest.fn(),
        findOrder: jest.fn(),
      };

      const mockInvoiceFacade = {
        generate: jest.fn().mockResolvedValue("i1"),
        find: jest.fn(),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        null,
        mockCheckoutRepository,
        mockInvoiceFacade,
        mockPaymentFacade
      );

      const products = {
        p1: new Product({
          id: new Id("p1"),
          name: "Product 01",
          description: "Product 01 Description",
          salesPrice: 40,
        }),
        p2: new Product({
          id: new Id("p2"),
          name: "Product 02",
          description: "Product 02 Description",
          salesPrice: 30,
        }),
      };

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        // @ts-expect-error - spy on private method
        .mockResolvedValue(null);

      const mockGetProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "getProduct")
        // @ts-expect-error - not return never
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId];
        });

      it("should not be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "t1",
          orderId: "o1",
          amount: 100,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "c1",
          products: [{ productId: "p1" }, { productId: "p2" }],
        };

        let output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: "p1" },
          { productId: "p2" },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "c1" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
      });
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
