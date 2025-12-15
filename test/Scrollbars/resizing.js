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

  describe("when resizing window", () => {
    it("should update scrollbars", (done) => {
      const ref = createRef();
      root = createRoot(node);
      root.render(
        <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbars>
      );
      setTimeout(() => {
        const spy = spyOn(ref.current, "update");
        simulant.fire(window, "resize");
        expect(spy.calls.length).toEqual(1);
        done();
      }, 100);
    });
  });
}
