var dgram = require('dgram');

function MumblePing(host, port, callback) {
	var client = dgram.createSocket('udp4');

	if (!callback && typeof port == 'function') {
		callback = port;
		port = 64738;
	}

	client.on('message', function(message) {
		var version = [];

		for (var i = 0; i < 4; i++) {
			var ver = message.readUInt8(i);

			if (ver != 0) {
				version.push(ver);
			}
		}

		callback(null, {
			version: version.join('.'),
			users: message.readUInt32BE(12),
			maxUsers: message.readUInt32BE(16),
			bandwidth: message.readUInt32BE(20)
		});

		client.close();
	});

	client.on('error', function(err) {
		callback(err);

		client.close();
	});

	var req = new Buffer(12);

	req.writeUInt32BE(0, 0);
	req.writeUInt32BE(1234, 4);
	req.writeUInt32BE(5678, 8);

	client.send(req, 0, req.length, port, host, function(err) {
		if (err) {
			callback(err);

			client.close();
		}
	});
}

module.exports = MumblePing;