# Customization

The `<Scrollbars>` component consists of the following elements:

- `view` The element your content is rendered in
- `trackHorizontal` The horizontal scrollbars track
- `trackVertical` The vertical scrollbars track
- `thumbHorizontal` The horizontal thumb
- `thumbVertical` The vertical thumb

Each element can be **rendered individually** with a function that you pass to the component. Say, you want use your own `className` for each element:

```jsx
import { Scrollbars } from "@shakirul/scrollbars";

function CustomScrollbars({ children, ...props }) {
  return (
    <Scrollbars
      renderTrackHorizontal={(props) => (
        <div {...props} className="track-horizontal" />
      )}
      renderTrackVertical={(props) => (
        <div {...props} className="track-vertical" />
      )}
      renderThumbHorizontal={(props) => (
        <div {...props} className="thumb-horizontal" />
      )}
      renderThumbVertical={(props) => (
        <div {...props} className="thumb-vertical" />
      )}
      renderView={(props) => <div {...props} className="view" />}
      {...props}
    >
      {children}
    </Scrollbars>
  );
}

function App() {
  return (
    <CustomScrollbars style={{ width: 500, height: 300 }}>
      <p>Some great content...</p>
    </CustomScrollbars>
  );
}
```

**Important**: **You will always need to pass through the given props** for the respective element like in the example above: `<div {...props} className="track-horizontal"/>`.
This is because we need to pass some default `styles` down to the element in order to make the component work.

If you are working with **inline styles**, you could do something like this:

```jsx
import { Scrollbars } from "@shakirul/scrollbars";

function CustomScrollbars({ children, ...props }) {
  return (
    <Scrollbars
      renderTrackHorizontal={({ style, ...props }) => (
        <div {...props} style={{ ...style, backgroundColor: "blue" }} />
      )}
      {...props}
    >
      {children}
    </Scrollbars>
  );
}
```

## Respond to scroll events

If you want to change the appearance in respond to the scrolling position, you could do that like:

```jsx
import { Scrollbars } from "@shakirul/scrollbars";
import { useState, useCallback } from "react";

function CustomScrollbars({ children, ...props }) {
  const [top, setTop] = useState(0);

  const handleScrollFrame = useCallback((values) => {
    setTop(values.top);
  }, []);

  const renderView = useCallback(
    ({ style, ...props }) => {
      const color = Math.round(top * 255);
      const customStyle = {
        backgroundColor: `rgb(${color}, ${color}, ${color})`,
      };
      return <div {...props} style={{ ...style, ...customStyle }} />;
    },
    [top]
  );

  return (
    <Scrollbars
      renderView={renderView}
      onScrollFrame={handleScrollFrame}
      {...props}
    >
      {children}
    </Scrollbars>
  );
}
```

Check out these examples for some inspiration:

- [ColoredScrollbars](https://github.com/KhanShaheb34/scrollbars/tree/master/examples/simple/components/ColoredScrollbars)
- [ShadowScrollbars](https://github.com/KhanShaheb34/scrollbars/tree/master/examples/simple/components/ShadowScrollbars)
