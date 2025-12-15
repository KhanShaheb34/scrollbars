import React, { createRef } from "react";
import { createRoot } from "react-dom/client";

// Helper to render a component and get a ref to it
export function renderScrollbars(element, container) {
  return new Promise((resolve) => {
    const ref = createRef();
    const root = createRoot(container);
    const clonedElement = React.cloneElement(element, { ref });
    root.render(clonedElement);
    // Wait for next tick to ensure component is mounted
    setTimeout(() => {
      resolve({ ref: ref.current, root });
    }, 0);
  });
}

// Helper to unmount
export function unmountRoot(root) {
  if (root) {
    root.unmount();
  }
}
