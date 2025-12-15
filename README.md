# @shakirul/scrollbars

[![npm](https://img.shields.io/badge/npm-@shakirul/scrollbars-brightgreen.svg?style=flat-square)](https://www.npmjs.com/package/@shakirul/scrollbars)
[![npm version](https://img.shields.io/npm/v/@shakirul/scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/@shakirul/scrollbars)
[![npm downloads](https://img.shields.io/npm/dm/@shakirul/scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/@shakirul/scrollbars)

A custom scrollbars component for React, based on [react-custom-scrollbars](https://github.com/malte-wessel/react-custom-scrollbars) by Malte Wessel.

This fork adds support for **React 17, 18, and 19**, and includes TypeScript type definitions directly in the package.

## Features

- Frictionless native browser scrolling
- Native scrollbars for mobile devices
- [Fully customizable](https://github.com/KhanShaheb34/scrollbars/blob/master/docs/customization.md)
- [Auto hide](https://github.com/KhanShaheb34/scrollbars/blob/master/docs/usage.md#auto-hide)
- [Auto height](https://github.com/KhanShaheb34/scrollbars/blob/master/docs/usage.md#auto-height)
- [Universal](https://github.com/KhanShaheb34/scrollbars/blob/master/docs/usage.md#universal-rendering) (runs on client & server)
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

This is the minimal configuration. [Check out the Documentation for advanced usage](https://github.com/KhanShaheb34/scrollbars/tree/master/docs).

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

All properties are documented in the [API docs](https://github.com/KhanShaheb34/scrollbars/blob/master/docs/API.md).

## Examples

Run the simple example:

```bash
# Make sure that you've installed the dependencies
npm install
# Move to example directory
cd examples/simple
npm install
npm start
```

## Tests

```bash
# Make sure that you've installed the dependencies
npm install
# Run tests
npm test
```

### Code Coverage

```bash
# Run code coverage. Results can be found in `./coverage`
npm run test:cov
```

## Documentation

- [API](https://github.com/KhanShaheb34/scrollbars/blob/master/docs/API.md)
- [Customization](https://github.com/KhanShaheb34/scrollbars/blob/master/docs/customization.md)
- [Usage](https://github.com/KhanShaheb34/scrollbars/blob/master/docs/usage.md)

## License

MIT
