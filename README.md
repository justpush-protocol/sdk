<div align="center">
  <img height="170x" src="https://i.imgur.com/Jzhomj5.png" />

  <h1>JustPush</h1>

  <p>
    <strong>Push notifications for the TRON ecosystem</strong>
  </p>

  <p>
    <a href="https://docs.justpush.app/"><img alt="Docs" src="https://img.shields.io/badge/docs-justpush-informational" /></a>
    <a href="https://discord.gg/Baqkey4sPK"><img alt="Discord Chat" src="https://img.shields.io/discord/1037419699409006592?color=yellowgreen" /></a>
    <a href="https://opensource.org/licenses/MIT"><img alt="License" src="https://img.shields.io/github/license/justpush-protocol/sdk?color=blueviolet" /></a>
  </p>
</div>

JustPush brings notification capabilities to the TRON ecosystem.

The protocol consists of several componenets.

> All the components were implemented in the hacakthon timeframe.

### Smart contracts

[[github.com/justpush-protocol/contracts](https://github.com/justpush-protocol/contracts)]

### JustPush node

[[github.com/justpush-protocol/node](https://github.com/justpush-protocol/node)]

### JustPush SDK

This repository

### Dapp

[[github.com/justpush-protocol/frontend](https://github.com/justpush-protocol/frontend)]

### Telegram Bot

[[github.com/justpush-protocol/telegram-bot](https://github.com/justpush-protocol/telegram-bot)]

### Discord Bot

[[github.com/justpush-protocol/discord-bot](https://github.com/justpush-protocol/discord-bot)]

---

## JustPush SDK

### Installation

Install the package using npm:

```bash
npm install @justpush/sdk
```

If you are using yarn:

```bash
yarn add @justpush/sdk
```

### Usage

Start by creating a new instance of the JustPush client.
You can use the `new` keyword like any other class.

The constructor takes a single argument, which is tronweb instance.
If you are on the browser (dApp), you can use `window.tronWeb` instead. Otherwise (on the backend likely), you can use `require("tronweb")`.

```ts
import { JustPush } from "@justpush/sdk";
import TronWeb from "tronweb";

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: "YOUR_PRIVATE_KEY",
});

const justPush = new JustPush(tronWeb);
```

### List groups a user is subscribed to

```ts
const groups = await justPush.listGroups({
  filter: {
    subscribed: true,
  },
});

// get the first group
const group = groups[0];
const groupId = group.id;
```

### List groups you own

```ts
const groups = await justPush.listGroups({
  filter: {
    owner: true,
  },
});
```

### Sending a notification

Checkout the docs for more details on sending a notification.

https://docs.justpush.app/developer-guides/sending-notification

```ts
 await justPush.sendNotification({
    {
      id: uuidv4(), // A unique id
      groupId: 'cb5edeb6-a8a1-466a-aa6c-0d01d88fa68e',
      to: undefined,
      notification: {
        title: 'Hi there',
        content: 'Welcome to JustPush',
        link: 'justpush.app',
      },
      broadcast: true,
      self: false,
      timestamp: (Date.now())/1000,
  });
```

### Subscribing to a group

```ts
const groupId = "cb5edeb6-a8a1-466a-aa6c-0d01d88fa68e";
const subscription = await justPush.subscribe({ groupId });
```

### Monitoring notifications of a user

```ts
justPush.monitorNotifcations(USER_WALLET_ADDRESS).subscribe((result) => {
    if (result.data && result.data.notificationAdded) {
      const { data, group } = result.data.notificationAdded;
      const title = data.title;
      const content = data.content;
      const link = data.link;

      // do something with the notification
    }
  });
```

---