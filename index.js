const dgram = require('dgram')

/**
 * Response of the Mumble Ping.
 * @typedef {Object} MumblePingResponse
 * @property {string} version - Version of the mumble server.
 * @property {number} users - Number of users currently online.
 * @property {number} maxUsers - Maximum number of users that can connect simultaneously.
 * @property {number} bandwidth - Maximum bandwidth in b/s per user.
 */

function _getPingBody () {
  const requestBody = Buffer.alloc(12)
  requestBody.writeUInt32BE(0, 0)
  requestBody.writeUInt32BE(1234, 4)
  requestBody.writeUInt32BE(5678, 8)
  return requestBody
}

/**
 * Ping the given mumble server and query version, number of users and bandwidth
 * @param {string} host Host to connect to.
 * @param {number} port Port to connect to. Mumble's default port is 64738
 * @param {number} requestTimeout Number of milliseconds to wait before rejecting with a timeout error
 * @returns {Promise<MumblePingResponse>} Promise that resolves with the response of the ping if successful.
 */
function pingMumble (host, port = 64738, requestTimeout = 5000) {
  const client = dgram.createSocket('udp4')
  return new Promise(function (resolve, reject) {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout'))
      client.close()
    }, requestTimeout)

    client.on('error', (e) => {
      clearTimeout(timeout)
      client.close()
      reject(e)
    })

    client.on('message', (message) => {
      clearTimeout(timeout)

      const major = message.readUInt16BE(0)
      const minor = message.readUInt8(2)
      const patch = message.readUInt8(3)
      const version = [major, minor, patch]

      client.close()
      resolve({
        version: version.join('.'),
        users: message.readUInt32BE(12),
        maxUsers: message.readUInt32BE(16),
        bandwidth: message.readUInt32BE(20)
      })
    })

    const requestBody = _getPingBody()
    client.send(requestBody, 0, requestBody.length, port, host)
  })
}

/**
 * Callback for MumblePing
 * @callback MumblePingCallback
 * @param {Error} error
 * @param {MumblePingResponse} response
 */

/**
 * Ping the given mumble server and query version, number of users and bandwidth
 * @param {string} host Host to connect to.
 * @param {number} port Port to connect to. Mumble's default port is 64738
 * @param {MumblePingCallback} callback
 */
function MumblePing (host, port, callback) {
  const DEFAULT_MUMBLE_PORT = 64738
  let callbackFn = callback
  let actualPort = port
  if (!callback && typeof port === 'function') {
    callbackFn = port
    actualPort = DEFAULT_MUMBLE_PORT
  }
  pingMumble(host, actualPort).then(response => {
    callbackFn(null, response)
  }).catch(error => {
    callbackFn(error, null)
  })
}

exports.MumblePing = MumblePing
exports.pingMumble = pingMumble
