var MumblePing = require('./');

// Note: This is an example host name and default port.
MumblePing('mumble.probablyaserver.com', function(err, res) {
	console.log(res);
});