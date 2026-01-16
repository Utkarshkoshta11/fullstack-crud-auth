import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/login/page";
import { apiFetch } from "@/lib/api";

jest.mock("@/lib/api", () => require("../__mocks__/api"));
jest.mock("next/navigation", () => require("../__mocks__/nextNavigation"));

describe("Login Page", () => {
  it("renders login form", () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("calls login API on submit", async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({});

    render(<LoginPage />);
    await userEvent.type(
      await screen.findByPlaceholderText("Username"),
      "user"
    );
    await userEvent.type(
      await screen.findByPlaceholderText("Password"),
      "pass"
    );
    await userEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(apiFetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" })
    );
  });
});
