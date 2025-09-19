import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders landing page welcome message", () => {
  render(<App />);
  const headingElement = screen.getByText(/welcome to sorting visualizer/i);
  expect(headingElement).toBeInTheDocument();
});
