import { ArrowCache } from "arrow-cache";
import { Button } from "../common";
import React from "react";
import { render } from "react-dom";

const cache = new ArrowCache({
  clearDuration: 1000
});

const CACHE_KEY = "foo";

const App = () => {
  const handleSideEffectClick = () => {
    cache.setItem(CACHE_KEY, 0);

    setTimeout(async () => {
      console.info(await cache.snapshot());

      await cache.setItem(CACHE_KEY, 1);

      console.info(await cache.snapshot());
    }, 2100);
  };

  const handlePureClick = () => {
    cache.setItem(CACHE_KEY, 0);

    setTimeout(async () => {
      console.info(await cache.snapshot());

      await cache.updateContent(CACHE_KEY, 1);

      console.info(await cache.snapshot());
    }, 2100);
  };

  return (
    <>
      <Button onClick={handleSideEffectClick}>side effect</Button>
      <p></p>
      <Button onClick={handlePureClick}>pure</Button>
    </>
  );
};

render(<App />, document.querySelector("#root"));
