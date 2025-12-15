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
  describe("when dragging horizontal thumb", () => {
    it("should scroll to the respective position", (done) => {
      const ref = createRef();
      root = createRoot(node);
      root.render(
        <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbars>
      );
      setTimeout(() => {
        const { view, thumbHorizontal: thumb } = ref.current;
        const { left } = thumb.getBoundingClientRect();
        simulant.fire(thumb, "mousedown", {
          target: thumb,
          clientX: left + 1,
        });
        simulant.fire(document, "mousemove", {
          clientX: left + 100,
        });
        simulant.fire(document, "mouseup");
        expect(view.scrollLeft).toEqual(100);
        done();
      }, 100);
    });

    it("should disable selection", (done) => {
      const ref = createRef();
      root = createRoot(node);
      root.render(
        <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbars>
      );
      setTimeout(() => {
        const { thumbHorizontal: thumb } = ref.current;
        const { left } = thumb.getBoundingClientRect();
        simulant.fire(thumb, "mousedown", {
          target: thumb,
          clientX: left + 1,
        });
        expect(document.body.style.webkitUserSelect).toEqual("none");
        simulant.fire(document, "mouseup");
        expect(document.body.style.webkitUserSelect).toEqual("");
        done();
      }, 100);
    });
  });

  describe("when dragging vertical thumb", () => {
    it("should scroll to the respective position", (done) => {
      const ref = createRef();
      root = createRoot(node);
      root.render(
        <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbars>
      );
      setTimeout(() => {
        const { view, thumbVertical: thumb } = ref.current;
        const { top } = thumb.getBoundingClientRect();
        simulant.fire(thumb, "mousedown", {
          target: thumb,
          clientY: top + 1,
        });
        simulant.fire(document, "mousemove", {
          clientY: top + 100,
        });
        simulant.fire(document, "mouseup");
        expect(view.scrollTop).toEqual(100);
        done();
      }, 100);
    });

    it("should disable selection", (done) => {
      const ref = createRef();
      root = createRoot(node);
      root.render(
        <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbars>
      );
      setTimeout(() => {
        const { thumbVertical: thumb } = ref.current;
        const { top } = thumb.getBoundingClientRect();
        simulant.fire(thumb, "mousedown", {
          target: thumb,
          clientY: top + 1,
        });
        expect(document.body.style.webkitUserSelect).toEqual("none");
        simulant.fire(document, "mouseup");
        expect(document.body.style.webkitUserSelect).toEqual("");
        done();
      }, 100);
    });
  });
}
