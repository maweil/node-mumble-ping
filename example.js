var MumblePing = require('./');

// Note: This is an example ip address, and default port.
MumblePing('mumble.probablyaserver.com', function(err, res) {
	console.log(res);
});