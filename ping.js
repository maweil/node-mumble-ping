const mumble = require('.');
const yargs = require("yargs");
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
    .option("s", {
        alias: "server",
        string: true,
        demandOption: true
    })
    .option("p", {
        alias: "port",
        number: true,
        demandOption: true,
        default: 64738
    })
    .argv;

async function run( ){
    const response = await mumble.pingMumble(argv.s, argv.p);
    console.log(`${JSON.stringify(response.users)} user(s) are currently on ${argv.s}`);  
}
run();
