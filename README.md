<div>
  <p align="center"><img src="https://github.com/wizaaard/arrow-cache/blob/master/doc/logo.png" alt="arrow cache"></p>
</div>
<p align="center">
  <img src="https://github.com/wizaaard/arrow-cache/blob/master/doc/text.png" />
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/flat-dev-ti/Flat.svg?style=flat-square">
  <img src="https://img.shields.io/badge/TypeScript-3.2-blue.svg?style=flat-square">
</p>

# Arrow Cache

基于 `WebWorker` 的缓存机制，提供可靠高性能的缓存，帮助构建高性能的 `webApp`。

## 简介

`Arrow Cache` 和许多缓存库一样，通过 `Key-Value` 来缓存数据，任何存入 `Arrow Cache` 的数据都会被第一时间放入内存。当放入的东西越来越多，内存会逐渐膨胀，`Arrow Cache` 会启动一个定时器来每隔一段时间做一次标记清除，这种做法会使得内存里都是热数据，进而控制内存。这些被标记的数据并不会马上从内存里被清除，而是持久化到硬盘，下次再用到这个数据的时候会先从内存里寻找，如果没有找到，会发起一起 IO 从硬盘上寻找，如果发现会将它读入内存并且初始化。

## 特性

- 基于 `Typescript` 构建，完整的代码提示和 API 描述
- 基于 `WebWorker` ，对缓存的任何操作只会对当前页面带来极少的开销
- 完善的热数据保证，控制内存膨胀
- 开箱即用的精致小的缓存库

## 整体架构

使用者应该大致的了解 `Arrow Cache` 的 架构，以便更好的使用它，`Arrow Cache` 是一种典型的 `C/S` 结构，客户端通过跟服务端通信完成对缓存的操作，这里的客户端通常指代 `Web` 页面，服务端指代 `Web Worker`，通过与 `Web Worker` 进行通信完成对缓存的操作。客户端通常是没有权限来直接操作缓存的，它能做的只有去“调用”服务端的方法。整体架构非常简单，图如下:

<div>
  <p align="center"><img src="https://github.com/wizaaard/arrow-cache/blob/master/doc/arrow-cache.png" alt="arrow cache"></p>
</div>

每个存入 `Arrow Cache` 的数据都会有一个 `isActive` 标记和一个 `lifeCount` 标记。

`isActive`: 当数据存在于内存中时，证明它是活跃的，这时候该数据的 `isActive` 是 `True`，如果它被写入了磁盘，这时候变为 `False` 代表它是不活跃的。

`lifeCount`: 用来帮助 `ArrowCount` 的标记清除机制，每隔一段时间（默认是 10min，可以通过设置 `clearDuration` 来更改）会检查当前容器中的数据的 `lifeCount` 是否为 0（初始化是 2），当 `lifeCount` 为 0 时，会将这个数据标记为 `imminentDead` 表示为可以被清除的，然后会将所有标记为 `imminentDead` 的数据持久化到磁盘。

## Usage

```bash
# install
yarn add arrow-cache
npm install arrow-cache
```

```js
/** Usage */
const cache = new ArrowCache();

cache.setItem("name", "Jon");
```

## Example

Examples 里有一个 Counter 的例子，可以呈现一种虚假的“常驻内存”，在刷新页面后依然可以拿到上次的计数，它的工作原理是每次存放的时候都会被持久化，这样做会有损伤性能，如果不是很必要，请不要使用它。这是因为 `WebWorker` 的生命周期导致的，`WebWorker` 会在页面关闭时销毁，我们很难找到一个恰当的时机发起一次 IO 让它把数据持久化下来。

see [example/counter](https://github.com/wizaaard/arrow-cache/tree/master/example/counter).

## Options

你可以在实例化 `ArrowCache` 的时候传递一个 Options，可用属性如下：

`isPermanentMemory` `[Boolean]`: 标记是否为“常驻内存”，如果开启此项，`Arrow Cache` 会在必要的时候缓存你的数据到磁盘，下一次刷新页面的时候将它读到内存，调用者会感受到它一直存在于内存中。

`clearDuration` `[Number]`: 设置 `Arrow Cache` 的清除周期时间。

## APIs

[v1.0.0](https://github.com/wizaaard/arrow-cache/tree/master/apis/v1.0.0)

# LICENSE

MIT.
