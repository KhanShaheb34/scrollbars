import { Scrollbars } from "react-custom-scrollbars";
import React, { createRef } from "react";
import { createRoot } from "react-dom/client";
import simulant from "simulant";

export default function createTests(scrollbarWidth) {
  // Not for mobile environment
  if (!scrollbarWidth) return;

  let node;
  let root;
  beforeEach(() => {
    node = document.createElement("div");
    document.body.appendChild(node);
  });
  afterEach(() => {
    if (root) root.unmount();
    document.body.removeChild(node);
  });

  describe("when clicking on horizontal track", () => {
    it("should scroll to the respective position", (done) => {
      const ref = createRef();
      root = createRoot(node);
      root.render(
        <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbars>
      );
      setTimeout(() => {
        const { view, trackHorizontal: bar } = ref.current;
        const { left, width } = bar.getBoundingClientRect();
        simulant.fire(bar, "mousedown", {
          target: bar,
          clientX: left + width / 2,
        });
        expect(view.scrollLeft).toEqual(50);
        done();
      }, 100);
    });
  });

  describe("when clicking on vertical track", () => {
    it("should scroll to the respective position", (done) => {
      const ref = createRef();
      root = createRoot(node);
      root.render(
        <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbars>
      );
      setTimeout(() => {
        const { view, trackVertical: bar } = ref.current;
        const { top, height } = bar.getBoundingClientRect();
        simulant.fire(bar, "mousedown", {
          target: bar,
          clientY: top + height / 2,
        });
        expect(view.scrollTop).toEqual(50);
        done();
      }, 100);
    });
  });
}
