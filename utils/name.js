// name.js
const chalk = require('chalk')

function printName() {
    console.log(chalk.blueBright(`
    +==============================================================+                                 
    =              ${chalk.yellowBright('Tools Create Smart Contract ERC20')}              =
    =                    ${chalk.greenBright('Network: All EVM Chain')}                    =
    =                   ${chalk.magentaBright('Author: Prastian Hidayat')}                   =
    +==============================================================+
    `));
}
module.exports = { printName };