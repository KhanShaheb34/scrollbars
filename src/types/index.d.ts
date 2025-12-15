// Type definitions for @shakirul/scrollbars
// Based on react-custom-scrollbars types by kittimiyo

import * as React from "react";

export interface positionValues {
  top: number;
  left: number;
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
}

export interface ScrollbarProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "onScroll"> {
  onScroll?: React.UIEventHandler<HTMLDivElement> | undefined;
  onScrollFrame?: ((values: positionValues) => void) | undefined;
  onScrollStart?: (() => void) | undefined;
  onScrollStop?: (() => void) | undefined;
  onUpdate?: ((values: positionValues) => void) | undefined;

  renderView?: React.FunctionComponent<any> | undefined;
  renderTrackHorizontal?: React.FunctionComponent<any> | undefined;
  renderTrackVertical?: React.FunctionComponent<any> | undefined;
  renderThumbHorizontal?: React.FunctionComponent<any> | undefined;
  renderThumbVertical?: React.FunctionComponent<any> | undefined;

  tagName?: string | undefined;
  hideTracksWhenNotNeeded?: boolean | undefined;

  autoHide?: boolean | undefined;
  autoHideTimeout?: number | undefined;
  autoHideDuration?: number | undefined;

  thumbSize?: number | undefined;
  thumbMinSize?: number | undefined;
  universal?: boolean | undefined;

  autoHeight?: boolean | undefined;
  autoHeightMin?: number | string | undefined;
  autoHeightMax?: number | string | undefined;

  style?: React.CSSProperties | undefined;
  children?: React.ReactNode | undefined;
}

export interface ScrollbarsRef {
  scrollTop(top: number): void;
  scrollLeft(left: number): void;
  scrollToTop(): void;
  scrollToBottom(): void;
  scrollToLeft(): void;
  scrollToRight(): void;
  getScrollLeft(): number;
  getScrollTop(): number;
  getScrollWidth(): number;
  getScrollHeight(): number;
  getClientWidth(): number;
  getClientHeight(): number;
  getValues(): positionValues;
  update(callback?: (values: positionValues) => void): void;
  view: HTMLDivElement | null;
  container: HTMLElement | null;
  trackHorizontal: HTMLDivElement | null;
  trackVertical: HTMLDivElement | null;
  thumbHorizontal: HTMLDivElement | null;
  thumbVertical: HTMLDivElement | null;
}

export const Scrollbars: React.ForwardRefExoticComponent<
  ScrollbarProps & React.RefAttributes<ScrollbarsRef>
>;

export default Scrollbars;
