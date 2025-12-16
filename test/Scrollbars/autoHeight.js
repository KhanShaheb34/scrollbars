import { Scrollbars } from "react-custom-scrollbars";
import React, { createRef } from "react";
import { createRoot } from "react-dom/client";

export default function createTests(scrollbarWidth, envScrollbarWidth) {
  describe("autoHeight", () => {
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

    describe("when rendered", () => {
      it("should have min-height and max-height", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            autoHeight
            autoHeightMin={0}
            autoHeightMax={100}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const scrollbars = ref.current.container;
          expect(scrollbars.style.position).toEqual("relative");
          expect(scrollbars.style.minHeight).toEqual("0px");
          expect(scrollbars.style.maxHeight).toEqual("100px");
          expect(ref.current.view.style.position).toEqual("relative");
          expect(ref.current.view.style.minHeight).toEqual(
            `${scrollbarWidth}px`
          );
          expect(ref.current.view.style.maxHeight).toEqual(
            `${100 + scrollbarWidth}px`
          );
          done();
        }, 200);
      });
    });

    describe("when native scrollbars have a width", () => {
      if (!scrollbarWidth) return;
      it("hides native scrollbars", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} autoHeight autoHeightMax={100}>
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const width = `-${scrollbarWidth}px`;
          expect(ref.current.view.style.marginRight).toEqual(width);
          expect(ref.current.view.style.marginBottom).toEqual(width);
          done();
        }, 200);
      });
    });

    describe("when native scrollbars have no width", () => {
      if (scrollbarWidth) return;
      it("hides bars", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} autoHeight autoHeightMax={100}>
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          expect(ref.current.trackVertical.style.display).toEqual("none");
          expect(ref.current.trackHorizontal.style.display).toEqual("none");
          done();
        }, 100);
      });
    });

    describe("when content is smaller than maxHeight", () => {
      it("should have the content's height", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} autoHeight autoHeightMax={100}>
            <div style={{ height: 50 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const scrollbars = ref.current.container;
          expect(scrollbars.clientHeight).toEqual(
            50 + (envScrollbarWidth - scrollbarWidth)
          );
          expect(ref.current.view.clientHeight).toEqual(50);
          expect(ref.current.view.scrollHeight).toEqual(50);
          expect(ref.current.thumbVertical.clientHeight).toEqual(0);
          done();
        }, 100);
      });
    });

    describe("when content is larger than maxHeight", () => {
      it("should show scrollbars", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} autoHeight autoHeightMax={100}>
            <div style={{ height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const scrollbars = ref.current.container;
          expect(scrollbars.clientHeight).toEqual(100);
          expect(ref.current.view.clientHeight).toEqual(
            100 - (envScrollbarWidth - scrollbarWidth)
          );
          expect(ref.current.view.scrollHeight).toEqual(200);
          if (scrollbarWidth) {
            // 100 / 200 * 96 = 48
            expect(ref.current.thumbVertical.clientHeight).toEqual(48);
          }
          done();
        }, 100);
      });
    });

    describe("when minHeight is greater than 0", () => {
      it("should have height greater than 0", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            autoHeight
            autoHeightMin={100}
            autoHeightMax={200}
          >
            <div />
          </Scrollbars>
        );
        setTimeout(() => {
          const scrollbars = ref.current.container;
          expect(scrollbars.clientHeight).toEqual(100);
          expect(ref.current.view.clientHeight).toEqual(
            100 - (envScrollbarWidth - scrollbarWidth)
          );
          expect(ref.current.thumbVertical.clientHeight).toEqual(0);
          done();
        }, 100);
      });
    });

    describe("when using perecentages", () => {
      it("should use calc", (done) => {
        const scrollbarsRef = createRef();
        root = createRoot(node);
        root.render(
          <div style={{ width: 500, height: 500 }}>
            <Scrollbars
              ref={scrollbarsRef}
              autoHeight
              autoHeightMin="50%"
              autoHeightMax="100%"
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          </div>
        );
        setTimeout(() => {
          const $scrollbars = scrollbarsRef.current.container;
          const view = scrollbarsRef.current.view;
          expect($scrollbars.clientWidth).toEqual(500);
          expect($scrollbars.clientHeight).toEqual(250);
          expect($scrollbars.style.position).toEqual("relative");
          expect($scrollbars.style.minHeight).toEqual("50%");
          expect($scrollbars.style.maxHeight).toEqual("100%");
          expect(view.style.position).toEqual("relative");
          expect(view.style.minHeight).toEqual(
            `calc(50% + ${scrollbarWidth}px)`
          );
          expect(view.style.maxHeight).toEqual(
            `calc(100% + ${scrollbarWidth}px)`
          );
          done();
        }, 100);
      });
    });

    describe("when using other units", () => {
      it("should use calc", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            autoHeight
            autoHeightMin="10em"
            autoHeightMax="100em"
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const scrollbars = ref.current.container;
          expect(scrollbars.style.position).toEqual("relative");
          expect(scrollbars.style.minHeight).toEqual("10em");
          expect(scrollbars.style.maxHeight).toEqual("100em");
          expect(ref.current.view.style.position).toEqual("relative");
          expect(ref.current.view.style.minHeight).toEqual(
            `calc(10em + ${scrollbarWidth}px)`
          );
          expect(ref.current.view.style.maxHeight).toEqual(
            `calc(100em + ${scrollbarWidth}px)`
          );
          done();
        }, 200);
      });
    });
  });
}
