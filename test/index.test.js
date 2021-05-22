/* eslint-env jest */
const mp = require('..')
const MumblePing = mp.MumblePing

const UNKNOWN_HOST_EXAMPLE = 'unknown_host.example'

function expectValidPingResult (response) {
  expect(response.version).toMatch(/\d.\d/)
  expect(response.users).toBeGreaterThanOrEqual(0)
  expect(response.maxUsers).toBeGreaterThanOrEqual(1)
  expect(response.bandwidth).toBeGreaterThanOrEqual(1000)
}

function getExpectedErrorENOTFOUND () {
  const expectedError = new Error()
  expectedError.code = 'ENOTFOUND'
  expectedError.errno = -3008
  expectedError.syscall = 'getaddrinfo'
  expectedError.hostname = 'unknown_host.example'
  return expectedError
}

function getTestMumbleServer(){
  return process.env["MUMBLE_SERVER"] || "localhost"
}

test('Promise resolves with meaningful values for real server', () => {
  return mp.pingMumble(getTestMumbleServer(), 64738, 45000).then(response => {
    expectValidPingResult(response)
  })
})

test('Promise resolves with error on timeout', () => {
  return expect(mp.pingMumble('localhost', '60000', 500)).rejects.toEqual(Error('Timeout'))
})

test('Promise resolves with error when host is not found', () => {
  const expectedError = getExpectedErrorENOTFOUND()
  expect.assertions(1);
  return mp.pingMumble(UNKNOWN_HOST_EXAMPLE, '60000', 45000).catch(e => {
    expect(e.code).toBe("ENOTFOUND");
  });
})

test('Compatible with example for nikkiii/node-mumble-ping on success', done => {
  MumblePing(getTestMumbleServer(), function (err, res) {
    if (res) {
      expectValidPingResult(res)
      done()
      return
    }
    done(err)
  })
})

test('Compatible with example for nikkiii/node-mumble-ping on error', done => {
  MumblePing(UNKNOWN_HOST_EXAMPLE, '60000', function (err, res) {
    expect(err).toEqual(getExpectedErrorENOTFOUND())
    done()
  })
})
