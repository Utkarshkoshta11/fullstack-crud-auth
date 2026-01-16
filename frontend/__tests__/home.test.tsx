import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("Home Page", () => {
  it("shows login and register links", () => {
    render(<HomePage />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});
