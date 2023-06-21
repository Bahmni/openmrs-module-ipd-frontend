import React from "react";
import "./TestComp.scss";
import { Switch, ContentSwitcher } from "carbon-components-react";

export function TestComp() {
  const n = "Random";

  const [counter, setCounter] = React.useState(0);

  return (
    <div className="test-comp">
      <h3>Hello World!</h3>
      <span>{n}</span>
      <ContentSwitcher>
        <Switch name="one">Hello</Switch>
        <Switch name="two" text="Two" />
      </ContentSwitcher>
    </div>
  );
}
