import { Scrollbars } from "react-custom-scrollbars";
import React, { createRef } from "react";
import { createRoot } from "react-dom/client";

export default function createTests() {
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
  describe("when scrollbars are in flexbox environment", () => {
    it("should still work", (done) => {
      const scrollbarsRef = createRef();
      root = createRoot(node);
      root.render(
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Scrollbars ref={scrollbarsRef}>
            <div style={{ width: 10000, height: 10000 }} />
          </Scrollbars>
        </div>
      );
      setTimeout(() => {
        const scrollbars = scrollbarsRef.current;
        const $scrollbars = scrollbars.container;
        const $view = scrollbars.view;
        expect($scrollbars.clientHeight).toBeGreaterThan(0);
        expect($view.clientHeight).toBeGreaterThan(0);
        done();
      }, 100);
    });
  });
}
