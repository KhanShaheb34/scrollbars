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

  describe("autoHide", () => {
    describe("when Scrollbars are rendered", () => {
      it("should hide tracks", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} autoHide style={{ width: 100, height: 100 }}>
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          expect(ref.current.trackHorizontal.style.opacity).toEqual("0");
          expect(ref.current.trackVertical.style.opacity).toEqual("0");
          done();
        }, 200);
      });
    });
    describe("enter/leave track", () => {
      describe("when entering horizontal track", () => {
        it("should show tracks", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars ref={ref} autoHide style={{ width: 100, height: 100 }}>
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            const track = ref.current.trackHorizontal;
            simulant.fire(track, "mouseenter");
            expect(track.style.opacity).toEqual("1");
            done();
          }, 200);
        });
      });
      describe("when leaving horizontal track", () => {
        it("should hide tracks", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars
              ref={ref}
              autoHide
              autoHideTimeout={10}
              autoHideDuration={10}
              style={{ width: 100, height: 100 }}
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            const track = ref.current.trackHorizontal;
            simulant.fire(track, "mouseenter");
            simulant.fire(track, "mouseleave");
            setTimeout(() => {
              expect(track.style.opacity).toEqual("0");
              done();
            }, 400);
          }, 200);
        });
      });
      describe("when entering vertical track", () => {
        it("should show tracks", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars ref={ref} autoHide style={{ width: 100, height: 100 }}>
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            const track = ref.current.trackVertical;
            simulant.fire(track, "mouseenter");
            expect(track.style.opacity).toEqual("1");
            done();
          }, 200);
        });
      });
      describe("when leaving vertical track", () => {
        it("should hide tracks", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars
              ref={ref}
              autoHide
              autoHideTimeout={10}
              autoHideDuration={10}
              style={{ width: 100, height: 100 }}
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            const track = ref.current.trackVertical;
            simulant.fire(track, "mouseenter");
            simulant.fire(track, "mouseleave");
            setTimeout(() => {
              expect(track.style.opacity).toEqual("0");
              done();
            }, 400);
          }, 200);
        });
      });
    });
    describe("when scrolling", () => {
      it("should show tracks", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars ref={ref} autoHide style={{ width: 100, height: 100 }}>
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          ref.current.scrollTop(50);
          setTimeout(() => {
            const { trackHorizontal, trackVertical } = ref.current;
            expect(trackHorizontal.style.opacity).toEqual("1");
            expect(trackVertical.style.opacity).toEqual("1");
            done();
          }, 400);
        }, 200);
      });
      it("should hide tracks after scrolling", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            autoHide
            autoHideTimeout={10}
            autoHideDuration={10}
            style={{ width: 100, height: 100 }}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          ref.current.scrollTop(50);
          setTimeout(() => {
            const { trackHorizontal, trackVertical } = ref.current;
            expect(trackHorizontal.style.opacity).toEqual("0");
            expect(trackVertical.style.opacity).toEqual("0");
            done();
          }, 300);
        }, 200);
      });
    });
    describe("when dragging x-axis", () => {
      it("should show tracks", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            autoHide
            autoHideTimeout={10}
            autoHideDuration={10}
            style={{ width: 100, height: 100 }}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const { thumbHorizontal: thumb, trackHorizontal: track } =
            ref.current;
          const { left } = thumb.getBoundingClientRect();
          simulant.fire(thumb, "mousedown", {
            target: thumb,
            clientX: left + 1,
          });
          simulant.fire(document, "mousemove", {
            clientX: left + 100,
          });
          setTimeout(() => {
            expect(track.style.opacity).toEqual("1");
            done();
          }, 400);
        }, 100);
      });

      it("should hide tracks on end", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            autoHide
            autoHideTimeout={10}
            autoHideDuration={10}
            style={{ width: 100, height: 100 }}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const { thumbHorizontal: thumb, trackHorizontal: track } =
            ref.current;
          const { left } = thumb.getBoundingClientRect();
          simulant.fire(thumb, "mousedown", {
            target: thumb,
            clientX: left + 1,
          });
          simulant.fire(document, "mouseup");
          setTimeout(() => {
            expect(track.style.opacity).toEqual("0");
            done();
          }, 400);
        }, 100);
      });

      describe("and leaving track", () => {
        it("should not hide tracks", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars
              ref={ref}
              autoHide
              autoHideTimeout={10}
              autoHideDuration={10}
              style={{ width: 100, height: 100 }}
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            const { thumbHorizontal: thumb, trackHorizontal: track } =
              ref.current;
            const { left } = thumb.getBoundingClientRect();
            simulant.fire(thumb, "mousedown", {
              target: thumb,
              clientX: left + 1,
            });
            simulant.fire(document, "mousemove", {
              clientX: left + 100,
            });
            simulant.fire(track, "mouseleave");
            setTimeout(() => {
              expect(track.style.opacity).toEqual("1");
              done();
            }, 200);
          }, 400);
        });
      });
    });
    describe("when dragging y-axis", () => {
      it("should show tracks", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            autoHide
            autoHideTimeout={10}
            autoHideDuration={10}
            style={{ width: 100, height: 100 }}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const { thumbVertical: thumb, trackVertical: track } = ref.current;
          const { top } = thumb.getBoundingClientRect();
          simulant.fire(thumb, "mousedown", {
            target: thumb,
            clientY: top + 1,
          });
          simulant.fire(document, "mousemove", {
            clientY: top + 100,
          });
          setTimeout(() => {
            expect(track.style.opacity).toEqual("1");
            done();
          }, 400);
        }, 100);
      });
      it("should hide tracks on end", (done) => {
        const ref = createRef();
        root = createRoot(node);
        root.render(
          <Scrollbars
            ref={ref}
            autoHide
            autoHideTimeout={10}
            autoHideDuration={10}
            style={{ width: 100, height: 100 }}
          >
            <div style={{ width: 200, height: 200 }} />
          </Scrollbars>
        );
        setTimeout(() => {
          const { thumbVertical: thumb, trackVertical: track } = ref.current;
          const { top } = thumb.getBoundingClientRect();
          simulant.fire(thumb, "mousedown", {
            target: thumb,
            clientY: top + 1,
          });
          simulant.fire(document, "mouseup");
          setTimeout(() => {
            expect(track.style.opacity).toEqual("0");
            done();
          }, 400);
        }, 100);
      });
      describe("and leaving track", () => {
        it("should not hide tracks", (done) => {
          const ref = createRef();
          root = createRoot(node);
          root.render(
            <Scrollbars
              ref={ref}
              autoHide
              autoHideTimeout={10}
              autoHideDuration={10}
              style={{ width: 100, height: 100 }}
            >
              <div style={{ width: 200, height: 200 }} />
            </Scrollbars>
          );
          setTimeout(() => {
            const { thumbVertical: thumb, trackVertical: track } = ref.current;
            const { top } = thumb.getBoundingClientRect();
            simulant.fire(thumb, "mousedown", {
              target: thumb,
              clientY: top + 1,
            });
            simulant.fire(document, "mousemove", {
              clientY: top + 100,
            });
            simulant.fire(track, "mouseleave");
            setTimeout(() => {
              expect(track.style.opacity).toEqual("1");
              done();
            }, 200);
          }, 400);
        });
      });
    });
  });
}
