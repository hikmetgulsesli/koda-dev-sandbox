import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { SearchBar } from "@/components/search/SearchBar";
import * as citiesModule from "@/lib/cities";

// Mock the cities module
jest.mock("@/lib/cities", () => ({
  ...jest.requireActual("@/lib/cities"),
  fetchCities: jest.fn(),
}));

const mockedFetchCities = citiesModule.fetchCities as jest.MockedFunction<
  typeof citiesModule.fetchCities
>;

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders input and search button", () => {
    render(<SearchBar />);

    expect(screen.getByLabelText("Şehir ara")).toBeInTheDocument();
    expect(screen.getByLabelText("Ara")).toBeInTheDocument();
  });

  it("shows loading state while fetching", async () => {
    jest.useFakeTimers();
    mockedFetchCities.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 500))
    );

    render(<SearchBar />);

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "İstan" } });

    // Fast-forward past debounce
    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("Yükleniyor...")).toBeInTheDocument();
    });
  });

  it("shows 'Şehir bulunamadı' when no results found", async () => {
    jest.useFakeTimers();
    mockedFetchCities.mockResolvedValue([]);

    render(<SearchBar />);

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "xyznonexistent" } });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("Şehir bulunamadı")).toBeInTheDocument();
    });
  });

  it("displays city results in dropdown", async () => {
    jest.useFakeTimers();
    const mockCities = [
      { id: "34", name: "İstanbul", plateNumber: "34" },
      { id: "35", name: "İzmir", plateNumber: "35" },
    ];
    mockedFetchCities.mockResolvedValue(mockCities);

    render(<SearchBar />);

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "İz" } });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("İstanbul")).toBeInTheDocument();
      expect(screen.getByText("İzmir")).toBeInTheDocument();
    });
  });

  it("navigates with ArrowDown/ArrowUp keys", async () => {
    jest.useFakeTimers();
    const mockCities = [
      { id: "34", name: "İstanbul", plateNumber: "34" },
      { id: "35", name: "İzmir", plateNumber: "35" },
      { id: "6", name: "Ankara", plateNumber: "06" },
    ];
    mockedFetchCities.mockResolvedValue(mockCities);

    render(<SearchBar />);

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "a" } });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("İstanbul")).toBeInTheDocument();
    });

    // Navigate down
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const firstOption = screen.getByText("İstanbul").closest("li");
    expect(firstOption).toHaveClass("bg-[var(--neon-cyan)]/20");

    // Navigate down again
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const secondOption = screen.getByText("İzmir").closest("li");
    expect(secondOption).toHaveClass("bg-[var(--neon-cyan)]/20");

    // Navigate up
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(firstOption).toHaveClass("bg-[var(--neon-cyan)]/20");
  });

  it("selects city with Enter key", async () => {
    jest.useFakeTimers();
    const mockCities = [
      { id: "34", name: "İstanbul", plateNumber: "34" },
    ];
    mockedFetchCities.mockResolvedValue(mockCities);

    render(<SearchBar />);

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "istan" } });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("İstanbul")).toBeInTheDocument();
    });

    // Navigate to first option
    fireEvent.keyDown(input, { key: "ArrowDown" });

    // Press Enter to select
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/Seçili şehir:/)).toHaveTextContent("İstanbul");
    });
  });

  it("closes dropdown with Escape key", async () => {
    jest.useFakeTimers();
    const mockCities = [
      { id: "34", name: "İstanbul", plateNumber: "34" },
    ];
    mockedFetchCities.mockResolvedValue(mockCities);

    render(<SearchBar />);

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "istan" } });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("İstanbul")).toBeInTheDocument();
    });

    // Press Escape
    fireEvent.keyDown(input, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByText("İstanbul")).not.toBeInTheDocument();
    });
  });

  it("saves selected city to localStorage", async () => {
    jest.useFakeTimers();
    const mockCities = [
      { id: "34", name: "İstanbul", plateNumber: "34" },
    ];
    mockedFetchCities.mockResolvedValue(mockCities);

    render(<SearchBar storageKey="testCity" />);

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "istan" } });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("İstanbul")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("İstanbul"));

    await waitFor(() => {
      const stored = mockLocalStorage.getItem("testCity");
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.name).toBe("İstanbul");
    });
  });

  it("closes dropdown when clicking outside", async () => {
    jest.useFakeTimers();
    const mockCities = [
      { id: "34", name: "İstanbul", plateNumber: "34" },
    ];
    mockedFetchCities.mockResolvedValue(mockCities);

    render(
      <div>
        <SearchBar />
        <div data-testid="outside">Outside</div>
      </div>
    );

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "istan" } });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("İstanbul")).toBeInTheDocument();
    });

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside"));

    await waitFor(() => {
      expect(screen.queryByText("İstanbul")).not.toBeInTheDocument();
    });
  });

  it("calls onSelect callback when city is selected", async () => {
    jest.useFakeTimers();
    const mockOnSelect = jest.fn();
    const mockCities = [
      { id: "34", name: "İstanbul", plateNumber: "34" },
    ];
    mockedFetchCities.mockResolvedValue(mockCities);

    render(<SearchBar onSelect={mockOnSelect} />);

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "istan" } });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("İstanbul")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("İstanbul"));

    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "34",
          name: "İstanbul",
          plateNumber: "34",
        })
      );
    });
  });

  it("search button triggers search", async () => {
    jest.useFakeTimers();
    const mockCities = [
      { id: "34", name: "İstanbul", plateNumber: "34" },
    ];
    mockedFetchCities.mockResolvedValue(mockCities);

    render(<SearchBar />);

    const input = screen.getByLabelText("Şehir ara");
    fireEvent.change(input, { target: { value: "İstanbul" } });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("İstanbul")).toBeInTheDocument();
    });

    // Click search button
    fireEvent.click(screen.getByLabelText("Ara"));

    await waitFor(() => {
      expect(screen.getByText(/Seçili şehir:/)).toHaveTextContent("İstanbul");
    });
  });
});
