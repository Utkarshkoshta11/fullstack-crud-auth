import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/register/page";
import { apiFetch } from "@/lib/api";

jest.mock("@/lib/api", () => require("../__mocks__/api"));
jest.mock("next/navigation", () => require("../__mocks__/nextNavigation"));

describe("Register Page", () => {
  it("renders register form", () => {
    render(<RegisterPage />);

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("calls register API", async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({});

    render(<RegisterPage />);
    await userEvent.type(
      await screen.findByPlaceholderText("Username"),
      "newuser"
    );
    await userEvent.type(
      await screen.findByPlaceholderText("Password"),
      "123456"
    );
    await userEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(apiFetch).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ method: "POST" })
    );
  });
});
