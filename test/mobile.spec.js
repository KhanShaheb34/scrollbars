// Mobile tests simulate scrollbarWidth of 0 to test mobile behavior
// Instead of mocking, we run the same tests with scrollbarWidth=0 config
import createTests from "./Scrollbars";
import getScrollbarWidth from "../src/utils/getScrollbarWidth";

const envScrollbarWidth = getScrollbarWidth();

describe("Scrollbars (mobile)", () => {
  // Run tests with mobileScrollbarsWidth = 0 to simulate mobile
  const mobileScrollbarsWidth = 0;
  createTests(mobileScrollbarsWidth, envScrollbarWidth);
});
