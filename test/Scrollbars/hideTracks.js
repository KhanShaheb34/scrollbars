import { Scrollbars } from "react-custom-scrollbars";
import React, { createRef } from "react";
import { createRoot } from "react-dom/client";

export default function createTests(scrollbarWidth) {
  describe("hide tracks", () => {
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

    describe("when native scrollbars have a width", () => {
      if (!scrollbarWidth) return;
      describe("when content is greater than wrapper", () => {
        it("should show tracks", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars
              ref={ref}
              hideTracksWhenNotNeeded
              style={{ width: 100, height: 100 }}
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            const { trackHorizontal, trackVertical } = ref.current;
            expect(trackHorizontal.style.visibility).toEqual("visible");
            expect(trackVertical.style.visibility).toEqual("visible");
            done();
          }, 400);
        });
      });
      describe("when content is smaller than wrapper", () => {
        it("should hide tracks", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars
              ref={ref}
              hideTracksWhenNotNeeded
              style={{ width: 100, height: 100 }}
            >
              <div style={{ width: 50, height: 50 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            const { trackHorizontal, trackVertical } = ref.current;
            expect(trackHorizontal.style.visibility).toEqual("hidden");
            expect(trackVertical.style.visibility).toEqual("hidden");
            done();
          }, 400);
        });
      });
    });
  });
}
