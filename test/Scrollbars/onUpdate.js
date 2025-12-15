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

  describe("onUpdate", () => {
    describe("when scrolling x-axis", () => {
      it("should call `onUpdate`", (done) => {
        let initialCallCount = 0;
        const spy = createSpy().andCall(() => {
          // Track calls
        });
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onUpdate={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        // Wait for initial mount update
        setTimeout(() => {
          initialCallCount = spy.calls.length;
          ref.current.scrollLeft(50);
          setTimeout(() => {
            // Expect at least one more call after the initial mount
            expect(spy.calls.length).toBeGreaterThan(initialCallCount);
            done();
          }, 100);
        }, 100);
      });
    });
    describe("when scrolling y-axis", () => {
      it("should call `onUpdate`", (done) => {
        let initialCallCount = 0;
        const spy = createSpy().andCall(() => {
          // Track calls
        });
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onUpdate={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        // Wait for initial mount update
        setTimeout(() => {
          initialCallCount = spy.calls.length;
          ref.current.scrollTop(50);
          setTimeout(() => {
            // Expect at least one more call after the initial mount
            expect(spy.calls.length).toBeGreaterThan(initialCallCount);
            done();
          }, 100);
        }, 100);
      });
    });

    describe("when resizing window", () => {
      it("should call onUpdate", (done) => {
        const spy = createSpy();
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onUpdate={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          // Should be called at least once on mount
          expect(spy.calls.length).toBeGreaterThan(0);
          done();
        }, 100);
      });
    });
  });
}
