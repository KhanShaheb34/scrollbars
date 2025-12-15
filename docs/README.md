# @shakirul/scrollbars

[![npm](https://img.shields.io/badge/npm-@shakirul/scrollbars-brightgreen.svg?style=flat-square)](https://www.npmjs.com/package/@shakirul/scrollbars)
[![npm version](https://img.shields.io/npm/v/@shakirul/scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/@shakirul/scrollbars)
[![npm downloads](https://img.shields.io/npm/dm/@shakirul/scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/@shakirul/scrollbars)

A custom scrollbars component for React, based on [react-custom-scrollbars](https://github.com/malte-wessel/react-custom-scrollbars) by Malte Wessel.

This fork adds support for **React 17, 18, and 19**, and includes TypeScript type definitions directly in the package.

## Features

- Frictionless native browser scrolling
- Native scrollbars for mobile devices
- [Fully customizable](./customization.md)
- [Auto hide](./usage.md#auto-hide)
- [Auto height](./usage.md#auto-height)
- [Universal](./usage.md#universal-rendering) (runs on client & server)
- `requestAnimationFrame` for 60fps
- No extra stylesheets
- Well tested, 100% code coverage

## Installation

```bash
npm install @shakirul/scrollbars --save
```

Or with yarn:

```bash
yarn add @shakirul/scrollbars
```

## Usage

This is the minimal configuration. [Check out the Documentation for advanced usage](./).

```jsx
import { Scrollbars } from "@shakirul/scrollbars";

function App() {
  return (
    <Scrollbars style={{ width: 500, height: 300 }}>
      <p>Some great content...</p>
    </Scrollbars>
  );
}
```

The `<Scrollbars>` component is completely customizable:

```jsx
import { Scrollbars } from "@shakirul/scrollbars";

function CustomScrollbars({ children, ...props }) {
  return (
    <Scrollbars
      onScroll={handleScroll}
      onScrollFrame={handleScrollFrame}
      onScrollStart={handleScrollStart}
      onScrollStop={handleScrollStop}
      onUpdate={handleUpdate}
      renderView={renderView}
      renderTrackHorizontal={renderTrackHorizontal}
      renderTrackVertical={renderTrackVertical}
      renderThumbHorizontal={renderThumbHorizontal}
      renderThumbVertical={renderThumbVertical}
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      autoHeight
      autoHeightMin={0}
      autoHeightMax={200}
      thumbMinSize={30}
      universal={true}
      {...props}
    >
      {children}
    </Scrollbars>
  );
}
```

All properties are documented in the [API docs](./API.md).

## Documentation

- [API](./API.md)
- [Customization](./customization.md)
- [Usage](./usage.md)
- [Upgrade Guide v2 to v3](./upgrade-guide-v2-v3.md)

## License

MIT
