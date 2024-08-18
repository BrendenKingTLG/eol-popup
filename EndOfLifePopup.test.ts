import { EndOfLifePopup } from "./popup";

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (...args: string[]) => mockGetItem(...args),
    setItem: (...args: string[]) => mockSetItem(...args),
    removeItem: (...args: string[]) => mockRemoveItem(...args),
  },
});

describe("EndOfLifePopup", () => {
  beforeEach(() => {
    mockGetItem.mockClear();
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();
  });

  it("should show popup if no preexisting popup date", () => {
    const currentDate = new Date("2024-08-17T00:00:00Z");
    const weeklyDate = new Date("2024-08-10T00:00:00Z");
    const monthlyDate = new Date("2024-07-17T00:00:00Z");

    new EndOfLifePopup(currentDate, monthlyDate, weeklyDate);

    expect(mockSetItem).toHaveBeenCalledTimes(1);
    expect(mockSetItem).toHaveBeenCalledWith(
      "LAST_POPUP",
      currentDate.toISOString()
    );
  });

  it("should not show popup if last popup was recently displayed", () => {
    const currentDate = new Date("2024-08-17T00:00:00Z");
    const weeklyDate = new Date("2024-08-10T00:00:00Z");
    const monthlyDate = new Date("2024-07-17T00:00:00Z");
    const lastPopupDate = new Date("2024-08-16T00:00:00Z");

    mockGetItem.mockReturnValue(lastPopupDate.toISOString());

    new EndOfLifePopup(currentDate, monthlyDate, weeklyDate);

    expect(mockSetItem).not.toHaveBeenCalled();
  });

  it("should show popup after weekly threshold has passed since the last popup", () => {
    const currentDate = new Date("2024-08-17T00:00:00Z");
    const weeklyDate = new Date("2024-08-10T00:00:00Z");
    const monthlyDate = new Date("2024-07-17T00:00:00Z");
    const lastPopupDate = new Date("2024-08-09T00:00:00Z");

    mockGetItem.mockReturnValue(lastPopupDate.toISOString());

    new EndOfLifePopup(currentDate, monthlyDate, weeklyDate);

    expect(mockSetItem).toHaveBeenCalledTimes(1);
    expect(mockSetItem).toHaveBeenCalledWith(
      "LAST_POPUP",
      currentDate.toISOString()
    );
  });

  it("should show popup after monthly threshold has passed since the last popup", () => {
    const currentDate = new Date("2024-08-17T00:00:00Z");
    const weeklyDate = new Date("2024-08-10T00:00:00Z");
    const monthlyDate = new Date("2024-07-17T00:00:00Z");
    const lastPopupDate = new Date("2024-07-16T00:00:00Z");

    mockGetItem.mockReturnValue(lastPopupDate.toISOString());

    new EndOfLifePopup(currentDate, monthlyDate, weeklyDate);

    expect(mockSetItem).toHaveBeenCalledTimes(1);
    expect(mockSetItem).toHaveBeenCalledWith(
      "LAST_POPUP",
      currentDate.toISOString()
    );
  });

  it("should not show popup if last popup less than a month", () => {
    const currentDate = new Date("2024-08-17T00:00:00Z");
    const weeklyDate = new Date("2024-010-10T00:00:00Z");
    const monthlyDate = new Date("2024-07-08T00:00:00Z");
    const lastPopupDate = new Date("2024-07-23T00:00:00Z");

    mockGetItem.mockReturnValue(lastPopupDate.toISOString());

    new EndOfLifePopup(currentDate, monthlyDate, weeklyDate);

    expect(mockSetItem).not.toHaveBeenCalled();
  });
});
