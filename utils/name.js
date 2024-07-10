// name.js
import chalk from 'chalk';

export function printName() {
    console.log(chalk.blueBright(`
    +==============================================================+                                 
    =              ${chalk.yellowBright('Tools Create Smart Contract ERC20')}              =
    =                    ${chalk.greenBright('Network: All EVM Chain')}                    =
    =                   ${chalk.magentaBright('Author: Prastian Hidayat')}                   =
    +==============================================================+
    `));
}