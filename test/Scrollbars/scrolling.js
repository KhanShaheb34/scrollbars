import { Scrollbars } from "react-custom-scrollbars";
import React, { createRef } from "react";
import { createRoot } from "react-dom/client";

export default function createTests(scrollbarWidth, envScrollbarWidth) {
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

  describe("when scrolling", () => {
    describe("when native scrollbars have a width", () => {
      if (!scrollbarWidth) return;
      it("should update thumbs position", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          ref.current.scrollTop(50);
          ref.current.scrollLeft(50);
          setTimeout(() => {
            if (scrollbarWidth) {
              // 50 / (200 - 100) * (96 - 48) = 24
              expect(ref.current.thumbVertical.style.transform).toEqual(
                "translateY(24px)"
              );
              expect(ref.current.thumbHorizontal.style.transform).toEqual(
                "translateX(24px)"
              );
            } else {
              expect(ref.current.thumbVertical.style.transform).toEqual("");
              expect(ref.current.thumbHorizontal.style.transform).toEqual("");
            }
            done();
          }, 100);
        }, 0);
      });
    });

    it("should not trigger a rerender", (done) => {
      const ref = createRef();
      let renderCount = 0;
      const WrappedScrollbars = React.forwardRef((props, fRef) => {
        renderCount++;
        return <Scrollbars ref={fRef} {...props} />;
      });
      root = createRoot(node);
      root.render(
        <WrappedScrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </WrappedScrollbars>
      );
      setTimeout(() => {
        const initialRenderCount = renderCount;
        ref.current.scrollTop(50);
        setTimeout(() => {
          // scrollTop should not cause a re-render
          expect(renderCount).toEqual(initialRenderCount);
          done();
        }, 100);
      }, 0);
    });

    describe("when scrolling x-axis", () => {
      it("should call `onScroll`", (done) => {
        const spy = createSpy();
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onScroll={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          ref.current.scrollLeft(50);
          setTimeout(() => {
            expect(spy.calls.length).toEqual(1);
            const args = spy.calls[0].arguments;
            const event = args[0];
            expect(event).toBeA(Event);
            done();
          }, 100);
        }, 0);
      });
      it("should call `onScrollFrame`", (done) => {
        const spy = createSpy();
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onScrollFrame={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          ref.current.scrollLeft(50);
          setTimeout(() => {
            expect(spy.calls.length).toEqual(1);
            const args = spy.calls[0].arguments;
            const values = args[0];
            expect(values).toBeA(Object);

            if (scrollbarWidth) {
              expect(values).toEqual({
                left: 0.5,
                top: 0,
                scrollLeft: 50,
                scrollTop: 0,
                scrollWidth: 200,
                scrollHeight: 200,
                clientWidth: 100,
                clientHeight: 100,
              });
            } else {
              expect(values).toEqual({
                left:
                  values.scrollLeft / (values.scrollWidth - values.clientWidth),
                top: 0,
                scrollLeft: 50,
                scrollTop: 0,
                scrollWidth: 200,
                scrollHeight: 200,
                clientWidth: 100 - envScrollbarWidth,
                clientHeight: 100 - envScrollbarWidth,
              });
            }
            done();
          }, 100);
        }, 0);
      });
      it("should call `onScrollStart` once", (done) => {
        const spy = createSpy();
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onScrollStart={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          let left = 0;
          const interval = setInterval(() => {
            ref.current.scrollLeft(++left);
            if (left >= 50) {
              clearInterval(interval);
              expect(spy.calls.length).toEqual(1);
              done();
            }
          }, 10);
        }, 0);
      });
      it("should call `onScrollStop` once when scrolling stops", (done) => {
        const spy = createSpy();
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onScrollStop={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          let left = 0;
          const interval = setInterval(() => {
            ref.current.scrollLeft(++left);
            if (left >= 50) {
              clearInterval(interval);
              setTimeout(() => {
                expect(spy.calls.length).toEqual(1);
                done();
              }, 300);
            }
          }, 10);
        }, 0);
      });
    });

    describe("when scrolling y-axis", () => {
      it("should call `onScroll`", (done) => {
        const spy = createSpy();
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onScroll={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          ref.current.scrollTop(50);
          setTimeout(() => {
            expect(spy.calls.length).toEqual(1);
            const args = spy.calls[0].arguments;
            const event = args[0];
            expect(event).toBeA(Event);
            done();
          }, 100);
        }, 0);
      });
      it("should call `onScrollFrame`", (done) => {
        const spy = createSpy();
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onScrollFrame={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          ref.current.scrollTop(50);
          setTimeout(() => {
            expect(spy.calls.length).toEqual(1);
            const args = spy.calls[0].arguments;
            const values = args[0];
            expect(values).toBeA(Object);

            if (scrollbarWidth) {
              expect(values).toEqual({
                left: 0,
                top: 0.5,
                scrollLeft: 0,
                scrollTop: 50,
                scrollWidth: 200,
                scrollHeight: 200,
                clientWidth: 100,
                clientHeight: 100,
              });
            } else {
              expect(values).toEqual({
                left: 0,
                top:
                  values.scrollTop /
                  (values.scrollHeight - values.clientHeight),
                scrollLeft: 0,
                scrollTop: 50,
                scrollWidth: 200,
                scrollHeight: 200,
                clientWidth: 100 - envScrollbarWidth,
                clientHeight: 100 - envScrollbarWidth,
              });
            }
            done();
          }, 100);
        }, 0);
      });
      it("should call `onScrollStart` once", (done) => {
        const spy = createSpy();
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onScrollStart={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          let top = 0;
          const interval = setInterval(() => {
            ref.current.scrollTop(++top);
            if (top >= 50) {
              clearInterval(interval);
              expect(spy.calls.length).toEqual(1);
              done();
            }
          }, 10);
        }, 0);
      });
      it("should call `onScrollStop` once when scrolling stops", (done) => {
        const spy = createSpy();
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onScrollStop={spy}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          let top = 0;
          const interval = setInterval(() => {
            ref.current.scrollTop(++top);
            if (top >= 50) {
              clearInterval(interval);
              setTimeout(() => {
                expect(spy.calls.length).toEqual(1);
                done();
              }, 300);
            }
          }, 10);
        }, 0);
      });
    });
  });
}
