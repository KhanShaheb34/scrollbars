import { Scrollbars } from "react-custom-scrollbars";
import React, { createRef } from "react";
import { createRoot } from "react-dom/client";

export default function createTests(scrollbarWidth) {
  describe("rendering", () => {
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

    describe("when Scrollbars are rendered", () => {
      it("takes className", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} className="foo">
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          expect(ref.current.container.className).toEqual("foo");
          done();
        }, 200);
      });

      it("takes styles", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          expect(ref.current.container.style.width).toEqual("100px");
          expect(ref.current.container.style.height).toEqual("100px");
          expect(ref.current.container.style.overflow).toEqual("hidden");
          done();
        }, 200);
      });

      it("renders view", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          expect(ref.current.view).toBeA(Node);
          done();
        }, 200);
      });

      describe("when using custom tagName", () => {
        it("should use the defined tagName", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars
              ref={ref}
              tagName="nav"
              style={{ width: 100, height: 100 }}
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            expect(ref.current.container.tagName.toLowerCase()).toEqual("nav");
            done();
          }, 200);
        });
      });

      describe("when custom `renderView` is passed", () => {
        it("should render custom element", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars
              ref={ref}
              style={{ width: 100, height: 100 }}
              renderView={({ style, ...props }) => (
                <section style={{ ...style, color: "red" }} {...props} />
              )}
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            expect(ref.current.view.tagName).toEqual("SECTION");
            expect(ref.current.view.style.color).toEqual("red");
            expect(ref.current.view.style.position).toEqual("absolute");
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
            <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            const width = `-${scrollbarWidth}px`;
            expect(ref.current.view.style.marginRight).toEqual(width);
            expect(ref.current.view.style.marginBottom).toEqual(width);
            done();
          }, 100);
        });

        it("renders bars", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            expect(ref.current.trackHorizontal).toBeA(Node);
            expect(ref.current.trackVertical).toBeA(Node);
            done();
          }, 200);
        });

        it("renders thumbs", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            expect(ref.current.thumbHorizontal).toBeA(Node);
            expect(ref.current.thumbVertical).toBeA(Node);
            done();
          }, 200);
        });

        it("renders thumbs with correct size", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            // 100 / 200 * 96 = 48
            expect(ref.current.thumbVertical.style.height).toEqual("48px");
            expect(ref.current.thumbHorizontal.style.width).toEqual("48px");
            done();
          }, 100);
        });

        it("the thumbs size should not be less than the given `thumbMinSize`", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
              <div style={{ width: 2000, height: 2000 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            // 100 / 200 * 96 = 48
            expect(ref.current.thumbVertical.style.height).toEqual("30px");
            expect(ref.current.thumbHorizontal.style.width).toEqual("30px");
            done();
          }, 100);
        });

        describe("when thumbs have a fixed size", () => {
          it("thumbs should have the given fixed size", (done) => {
            const ref = createRef();
            root = createRoot(node);
            root.render(
              <Scrollbars
                ref={ref}
                thumbSize={50}
                style={{ width: 100, height: 100 }}
              >
                <div style={{ width: 2000, height: 2000 }} />
              </Scrollbars>
            );
            setTimeout(() => {
              // 100 / 200 * 96 = 48
              expect(ref.current.thumbVertical.style.height).toEqual("50px");
              expect(ref.current.thumbHorizontal.style.width).toEqual("50px");
              done();
            }, 100);
          });
        });

        describe("when custom `renderTrackHorizontal` is passed", () => {
          it("should render custom element", (done) => {
            const ref = createRef();
            root = createRoot(node);
            root.render(
              <Scrollbars
                ref={ref}
                style={{ width: 100, height: 100 }}
                renderTrackHorizontal={({ style, ...props }) => (
                  <section
                    style={{ ...style, height: 10, color: "red" }}
                    {...props}
                  />
                )}
              >
                <div style={{ width: 200, height: 200 }} />
              </Scrollbars>
            );
            setTimeout(() => {
              expect(ref.current.trackHorizontal.tagName).toEqual("SECTION");
              expect(ref.current.trackHorizontal.style.position).toEqual(
                "absolute"
              );
              expect(ref.current.trackHorizontal.style.color).toEqual("red");
              done();
            }, 200);
          });
        });

        describe("when custom `renderTrackVertical` is passed", () => {
          it("should render custom element", (done) => {
            const ref = createRef();
            root = createRoot(node);
            root.render(
              <Scrollbars
                ref={ref}
                style={{ width: 100, height: 100 }}
                renderTrackVertical={({ style, ...props }) => (
                  <section
                    style={{ ...style, width: 10, color: "red" }}
                    {...props}
                  />
                )}
              >
                <div style={{ width: 200, height: 200 }} />
              </Scrollbars>
            );
            setTimeout(() => {
              expect(ref.current.trackVertical.tagName).toEqual("SECTION");
              expect(ref.current.trackVertical.style.position).toEqual(
                "absolute"
              );
              expect(ref.current.trackVertical.style.color).toEqual("red");
              done();
            }, 200);
          });
        });

        describe("when custom `renderThumbHorizontal` is passed", () => {
          it("should render custom element", (done) => {
            const ref = createRef();
            root = createRoot(node);
            root.render(
              <Scrollbars
                ref={ref}
                style={{ width: 100, height: 100 }}
                renderThumbHorizontal={({ style, ...props }) => (
                  <section style={{ ...style, color: "red" }} {...props} />
                )}
              >
                <div style={{ width: 200, height: 200 }} />
              </Scrollbars>
            );
            setTimeout(() => {
              expect(ref.current.thumbHorizontal.tagName).toEqual("SECTION");
              expect(ref.current.thumbHorizontal.style.position).toEqual(
                "relative"
              );
              expect(ref.current.thumbHorizontal.style.color).toEqual("red");
              done();
            }, 200);
          });
        });

        describe("when custom `renderThumbVertical` is passed", () => {
          it("should render custom element", (done) => {
            const ref = createRef();
            root = createRoot(node);
            root.render(
              <Scrollbars
                ref={ref}
                style={{ width: 100, height: 100 }}
                renderThumbVertical={({ style, ...props }) => (
                  <section style={{ ...style, color: "red" }} {...props} />
                )}
              >
                <div style={{ width: 200, height: 200 }} />
              </Scrollbars>
            );
            setTimeout(() => {
              expect(ref.current.thumbVertical.tagName).toEqual("SECTION");
              expect(ref.current.thumbVertical.style.position).toEqual(
                "relative"
              );
              expect(ref.current.thumbVertical.style.color).toEqual("red");
              done();
            }, 200);
          });
        });

        it("positions view absolute", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            expect(ref.current.view.style.position).toEqual("absolute");
            expect(ref.current.view.style.top).toEqual("0px");
            expect(ref.current.view.style.left).toEqual("0px");
            done();
          }, 200);
        });

        it("should not override the scrollbars width/height values", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars
              ref={ref}
              style={{ width: 100, height: 100 }}
              renderTrackHorizontal={({ style, ...props }) => (
                <div style={{ ...style, height: 10 }} {...props} />
              )}
              renderTrackVertical={({ style, ...props }) => (
                <div style={{ ...style, width: 10 }} {...props} />
              )}
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            expect(ref.current.trackHorizontal.style.height).toEqual("10px");
            expect(ref.current.trackVertical.style.width).toEqual("10px");
            done();
          }, 100);
        });

        describe("when view does not overflow container", () => {
          it("should hide scrollbars", (done) => {
            const ref = createRef();
            root = createRoot(node);
            root.render(
              <Scrollbars
                ref={ref}
                style={{ width: 100, height: 100 }}
                renderTrackHorizontal={({ style, ...props }) => (
                  <div style={{ ...style, height: 10 }} {...props} />
                )}
                renderTrackVertical={({ style, ...props }) => (
                  <div style={{ ...style, width: 10 }} {...props} />
                )}
              >
                <div style={{ width: 90, height: 90 }} />
              </Scrollbars>
            );
            setTimeout(() => {
              expect(ref.current.thumbHorizontal.style.width).toEqual("0px");
              expect(ref.current.thumbVertical.style.height).toEqual("0px");
              done();
            }, 100);
          });
        });
      });

      describe("when native scrollbars have no width", () => {
        if (scrollbarWidth) return;

        it("hides bars", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
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
    });

    describe("when rerendering Scrollbars", () => {
      it("should update scrollbars", (done) => {
        const ref = createRef();
        let updateCount = 0;
        const onUpdate = () => {
          updateCount++;
        };
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            style={{ width: 100, height: 100 }}
            onUpdate={onUpdate}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const initialCount = updateCount;
          root.render(
            <Scrollbars
              ref={ref}
              style={{ width: 100, height: 100 }}
              onUpdate={onUpdate}
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            expect(updateCount).toBeGreaterThan(initialCount);
            done();
          }, 100);
        }, 100);
      });
    });
  });
}
