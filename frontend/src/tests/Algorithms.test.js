import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Visualizer from "../components/Visualizer";

describe("Visualizer Component", () => {
  test("renders Merge Sort heading when algoId = merge", () => {
    render(
      <MemoryRouter initialEntries={["/visualizer/merge"]}>
        <Routes>
          <Route path="/visualizer/:algoId" element={<Visualizer />} />
        </Routes>
      </MemoryRouter>
    );

    // check for heading
    const heading = screen.getByText(/MERGE SORT INTERACTIVE/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders Compare heading when algoId = compare", () => {
    render(
      <MemoryRouter initialEntries={["/visualizer/compare"]}>
        <Routes>
          <Route path="/visualizer/:algoId" element={<Visualizer />} />
        </Routes>
      </MemoryRouter>
    );

    const heading = screen.getByText(/Compare All Algorithms 🔀/i);
    expect(heading).toBeInTheDocument();
  });

  test("shows control buttons", () => {
    render(
      <MemoryRouter initialEntries={["/visualizer/quick"]}>
        <Routes>
          <Route path="/visualizer/:algoId" element={<Visualizer />} />
        </Routes>
      </MemoryRouter>
    );

    // check control buttons exist
    expect(screen.getByText("🔄 New Array")).toBeInTheDocument();
    expect(screen.getByText("📑 Prepare Steps")).toBeInTheDocument();
    expect(screen.getByText("👉 Next Step")).toBeInTheDocument();
    expect(screen.getByText("🔁 Replay")).toBeInTheDocument();
    expect(screen.getByText("🛑 Stop")).toBeInTheDocument();
  });
});
