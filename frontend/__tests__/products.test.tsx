import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsPage from "@/app/products/page";
import { apiFetch } from "@/lib/api";

jest.mock("@/lib/api", () => require("../__mocks__/api"));
jest.mock("next/navigation", () => require("../__mocks__/nextNavigation"));

describe("Products Page", () => {
  it("shows alert if name or price is missing", async () => {
    window.alert = jest.fn();
    render(<ProductsPage />);
    await userEvent.click(screen.getByText("Add Product"));
    expect(window.alert).toHaveBeenCalledWith("Name and price are required");
    expect(apiFetch).not.toHaveBeenCalledWith(
      "/api/products",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("handles API error on add", async () => {
    window.alert = jest.fn();
    (apiFetch as jest.Mock).mockImplementation((path, opts) => {
      if (path === "/api/products" && opts && opts.method === "POST") {
        return Promise.reject(new Error("fail"));
      }
      if (path === "/api/products") {
        return Promise.resolve([
          { _id: "1", name: "Test Product", price: 100 },
        ]);
      }
      return Promise.resolve({});
    });
    render(<ProductsPage />);
    await userEvent.type(screen.getByPlaceholderText("Name"), "X");
    await userEvent.type(screen.getByPlaceholderText("Price"), "1");
    await userEvent.click(screen.getByText("Add Product"));
    // Should alert error and reset form
    expect(window.alert).toHaveBeenCalledWith("This product no longer exists.");
  });

  it("shows 'No products found' if empty", async () => {
    (apiFetch as jest.Mock).mockImplementation((path) => {
      if (path === "/api/products") return Promise.resolve([]);
      return Promise.resolve({});
    });
    render(<ProductsPage />);
    expect(await screen.findByText("No products found")).toBeInTheDocument();
  });

  it("cancels delete if not confirmed", async () => {
    window.confirm = jest.fn(() => false);
    render(<ProductsPage />);
    await userEvent.click(await screen.findByText("Delete"));
    expect(apiFetch).not.toHaveBeenCalledWith(
      "/api/products/1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("alerts and resets if deleting editing product", async () => {
    (apiFetch as jest.Mock)
      .mockResolvedValueOnce([{ _id: "1", name: "Test Product", price: 100 }]) // loadProducts
      .mockResolvedValueOnce({}); // delete

    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<ProductsPage />);

    // Wait for product row
    expect(await screen.findByText("Test Product")).toBeInTheDocument();

    // Click Edit FIRST (this was missing)
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    // Now form should be populated
    expect(await screen.findByDisplayValue("Test Product")).toBeInTheDocument();

    // Delete the product
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    // Alert shown
    expect(alertSpy).toHaveBeenCalledWith(
      "The product you were editing was deleted."
    );

    // Form reset
    expect(screen.getByPlaceholderText("Name")).toHaveValue("");

    alertSpy.mockRestore();
    confirmSpy.mockRestore();
  });

  beforeEach(() => {
    (apiFetch as jest.Mock).mockReset();
    (apiFetch as jest.Mock).mockImplementation((path) => {
      if (path === "/api/products") {
        return Promise.resolve([
          {
            _id: "1",
            name: "Test Product",
            price: 100,
          },
        ]);
      }
      return Promise.resolve({});
    });
  });

  it("loads and displays products", async () => {
    render(<ProductsPage />);

    expect(await screen.findByText("Test Product")).toBeInTheDocument();
  });

  it("adds a product", async () => {
    render(<ProductsPage />);

    await userEvent.type(
      await screen.findByPlaceholderText("Name"),
      "New Product"
    );
    await userEvent.type(await screen.findByPlaceholderText("Price"), "200");
    await userEvent.click(screen.getByText("Add Product"));

    expect(apiFetch).toHaveBeenCalledWith(
      "/api/products",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("logs out user", async () => {
    render(<ProductsPage />);
    await userEvent.click(await screen.findByText("Logout"));

    expect(apiFetch).toHaveBeenCalledWith(
      "/api/auth/logout",
      expect.objectContaining({ method: "POST" })
    );
  });
});
