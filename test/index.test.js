/* eslint-env jest */
const mp = require('..')
const MumblePing = mp.MumblePing

const UNKNOWN_HOST_EXAMPLE = 'unknown_host.example'

function _expectValidPingResult (response) {
  expect(response.version).toMatch(/\d.\d/)
  expect(response.users).toBeGreaterThanOrEqual(0)
  expect(response.maxUsers).toBeGreaterThanOrEqual(1)
  expect(response.bandwidth).toBeGreaterThanOrEqual(1000)
}

function _getTestMumbleServer () {
  return process.env.MUMBLE_SERVER || 'localhost'
}

function _expectHostNotFound (error) {
  const expectedError = new Error()
  expectedError.code = 'ENOTFOUND'
  expectedError.hostname = 'unknown_host.example'
  expect(error.code).toBe(expectedError.code)
  expect(error.host).toBe(expectedError.host)
}

test('Promise resolves with meaningful values for real server', () => {
  return mp.pingMumble(_getTestMumbleServer(), 64738, 45000).then(response => {
    _expectValidPingResult(response)
  })
})

test('Promise resolves with error on timeout', () => {
  return expect(mp.pingMumble('localhost', '60000', 500)).rejects.toEqual(Error('Timeout'))
})

test('Promise resolves with error when host is not found', () => {
  expect.assertions(2)
  return mp.pingMumble(UNKNOWN_HOST_EXAMPLE, '60000', 45000).catch(e => {
    _expectHostNotFound(e)
  })
})

test('Compatible with example for nikkiii/node-mumble-ping on success', done => {
  MumblePing(_getTestMumbleServer(), function (err, res) {
    if (res) {
      _expectValidPingResult(res)
      done()
      return
    }
    done(err)
  })
})

test('Compatible with example for nikkiii/node-mumble-ping on error', done => {
  MumblePing(UNKNOWN_HOST_EXAMPLE, '60000', function (err, res) {
    _expectHostNotFound(err)
    done()
  })
})
