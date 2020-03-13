import React, { useLayoutEffect, useState } from "react";
import { render } from "react-dom";
import { ArrowCache } from "arrow-cache";
import { Count } from "./styles";
import { Logo, Global, Button, Container } from "../common";

const cache = new ArrowCache({
  isPermanentMemory: true
});

const COUNT_KEY = "count_key";

const Counter = () => {
  const [num, setNum] = useState(0);

  const initNum = async () => setNum(await cache.getItem(COUNT_KEY, 0));

  const increment = async () =>
    setNum(await cache.append(COUNT_KEY, pre => pre + 1, 0));

  useLayoutEffect(() => {
    initNum();
  }, []);

  return (
    <Container>
      <Global></Global>
      <Logo></Logo>
      <Count>{num}</Count>
      <Button onClick={increment}>increment</Button>
    </Container>
  );
};

render(<Counter />, document.querySelector("#root"));
