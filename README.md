# node-mumble-ping

This library can be used to ping a mumble server via UDP and retreive the following information:

- Version of the mumble server
- Number of users currently connected
- Maximum number of users that can connect simultaneously
- Maximum bandwidth per user

## Installation

```sh
npm install https://github.com/maweil/node-mumble-ping  --save
```

## Usage

### Using Promises (recommended)

```js
const mp = require('mumble-ping')

// Specifying a port number
mp.pingMumble('localhost', 64739).then(response => console.log(response))

// To use the default port (64738)
mp.pingMumble('localhost').then(response => console.log(response))
```

The response object looks like the following:

```js
{ version: '1.3', users: 3, maxUsers: 50, bandwidth: 72000 }
```

### Using a Callback

This method is maintained for compatibility with [nikkiii/node-mumble-ping](https://github.com/nikkiii/node-mumble-ping).

```js
const mp = require('mumble-ping');

// Specifying a port number
mp.MumblePing('localhost', 64739, function(err, res) {
  console.log(res);
});

// Using the default port (64738)
mp.MumblePing('localhost', function(err, res) {
  console.log(res);
});
```
