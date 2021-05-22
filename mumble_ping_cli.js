#! /bin/env node
/**
 * Minimal CLI for node-mumble-ping
 * Usage:
 *   node mumble_ping_cli.js <mumble host>
 *   OR
 *   node mumble_ping_cli.js <mumble host> <port>
 */
const mp = require('.')

const args = process.argv.slice(2)
if (args.length > 0) {
  const host = args[0]
  const port = args[1] || 64738

  mp.pingMumble(host, port)
    .then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err)
    })
} else {
  console.error('Usage: node mumble_ping_cli.js <mumble host> <(optional) port>')
}
