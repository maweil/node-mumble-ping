# node-mumble-ping

# Installation

```sh
npm install mumble-ping --save
```

# Usage

```js
var MumblePing = require('mumble-ping');

MumblePing('localhost', function(err, res) {
	console.log(res);
});
```