# Usage

## Default Scrollbars

The `<Scrollbars>` component works out of the box with some default styles. The only thing you need to care about is that the component has a `width` and `height`:

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

Also don't forget to set the `viewport` meta tag, if you want to **support mobile devices**

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
/>
```

## Events

There are several events you can listen to:

```jsx
import { Scrollbars } from "@shakirul/scrollbars";

function App() {
  const handleScroll = (event) => {
    // Native scroll event
  };

  const handleScrollFrame = (values) => {
    // Runs inside the animation frame
    // values: { top, left, clientWidth, clientHeight, scrollWidth, scrollHeight, scrollLeft, scrollTop }
  };

  const handleScrollStart = () => {
    // Called when scrolling starts
  };

  const handleScrollStop = () => {
    // Called when scrolling stops
  };

  const handleUpdate = (values) => {
    // Called when ever the component is updated
  };

  return (
    <Scrollbars
      onScroll={handleScroll}
      onScrollFrame={handleScrollFrame}
      onScrollStart={handleScrollStart}
      onScrollStop={handleScrollStop}
      onUpdate={handleUpdate}
    >
      <p>Some great content...</p>
    </Scrollbars>
  );
}
```

## Auto-hide

You can activate auto-hide by setting the `autoHide` property.

```jsx
import { Scrollbars } from "@shakirul/scrollbars";

function App() {
  return (
    <Scrollbars
      // This will activate auto hide
      autoHide
      // Hide delay in ms
      autoHideTimeout={1000}
      // Duration for hide animation in ms.
      autoHideDuration={200}
    >
      <p>Some great content...</p>
    </Scrollbars>
  );
}
```

## Auto-height

You can activate auto-height by setting the `autoHeight` property.

```jsx
import { Scrollbars } from "@shakirul/scrollbars";

function App() {
  return (
    <Scrollbars
      // This will activate auto-height
      autoHeight
      autoHeightMin={100}
      autoHeightMax={200}
    >
      <p>Some great content...</p>
    </Scrollbars>
  );
}
```

## Universal rendering

If your app runs on both client and server, activate the `universal` mode. This will ensure that the initial markup on client and server are the same:

```jsx
import { Scrollbars } from "@shakirul/scrollbars";

function App() {
  return (
    // This will activate universal mode
    <Scrollbars universal>
      <p>Some great content...</p>
    </Scrollbars>
  );
}
```
