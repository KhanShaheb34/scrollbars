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

  describe("getters", () => {
    function renderScrollbars(callback) {
      const ref = createRef();
      root = createRoot(node);
      root.render(
        <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbars>
      );
      setTimeout(() => callback(ref.current), 0);
    }
    describe("getScrollLeft", () => {
      it("should return scrollLeft", (done) => {
        renderScrollbars(function callback(scrollbars) {
          scrollbars.scrollLeft(50);
          expect(scrollbars.getScrollLeft()).toEqual(50);
          done();
        });
      });
    });
    describe("getScrollTop", () => {
      it("should return scrollTop", (done) => {
        renderScrollbars(function callback(scrollbars) {
          scrollbars.scrollTop(50);
          expect(scrollbars.getScrollTop()).toEqual(50);
          done();
        });
      });
    });
    describe("getScrollWidth", () => {
      it("should return scrollWidth", (done) => {
        renderScrollbars(function callback(scrollbars) {
          expect(scrollbars.getScrollWidth()).toEqual(200);
          done();
        });
      });
    });
    describe("getScrollHeight", () => {
      it("should return scrollHeight", (done) => {
        renderScrollbars(function callback(scrollbars) {
          expect(scrollbars.getScrollHeight()).toEqual(200);
          done();
        });
      });
    });
    describe("getClientWidth", () => {
      it("should return scrollWidth", (done) => {
        renderScrollbars(function callback(scrollbars) {
          expect(scrollbars.getClientWidth()).toEqual(
            100 + (scrollbarWidth - envScrollbarWidth)
          );
          done();
        });
      });
    });
    describe("getClientHeight", () => {
      it("should return scrollHeight", (done) => {
        renderScrollbars(function callback(scrollbars) {
          expect(scrollbars.getClientHeight()).toEqual(
            100 + (scrollbarWidth - envScrollbarWidth)
          );
          done();
        });
      });
    });
  });

  describe("setters", () => {
    function renderScrollbars(callback) {
      const ref = createRef();
      root = createRoot(node);
      root.render(
        <Scrollbars ref={ref} style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbars>
      );
      setTimeout(() => callback(ref.current), 0);
    }
    describe("scrollLeft/scrollToLeft", () => {
      it("should scroll to given left value", (done) => {
        renderScrollbars(function callback(scrollbars) {
          scrollbars.scrollLeft(50);
          expect(scrollbars.getScrollLeft()).toEqual(50);
          scrollbars.scrollToLeft();
          expect(scrollbars.getScrollLeft()).toEqual(0);
          scrollbars.scrollLeft(50);
          scrollbars.scrollLeft();
          expect(scrollbars.getScrollLeft()).toEqual(0);
          done();
        });
      });
    });
    describe("scrollTop/scrollToTop", () => {
      it("should scroll to given top value", (done) => {
        renderScrollbars(function callback(scrollbars) {
          scrollbars.scrollTop(50);
          expect(scrollbars.getScrollTop()).toEqual(50);
          scrollbars.scrollToTop();
          expect(scrollbars.getScrollTop()).toEqual(0);
          scrollbars.scrollTop(50);
          scrollbars.scrollTop();
          expect(scrollbars.getScrollTop()).toEqual(0);
          done();
        });
      });
    });
    describe("scrollToRight", () => {
      it("should scroll to right", (done) => {
        renderScrollbars(function callback(scrollbars) {
          scrollbars.scrollToRight();
          expect(scrollbars.getScrollLeft()).toEqual(
            100 + (envScrollbarWidth - scrollbarWidth)
          );
          done();
        });
      });
    });
    describe("scrollToBottom", () => {
      it("should scroll to bottom", (done) => {
        renderScrollbars(function callback(scrollbars) {
          scrollbars.scrollToBottom();
          expect(scrollbars.getScrollTop()).toEqual(
            100 + (envScrollbarWidth - scrollbarWidth)
          );
          done();
        });
      });
    });
  });
}
