import chalk from 'chalk';
import util from 'util';

class Logger {
  static log(...args) {
    console.log(chalk.reset(...args));
  }

  static info(...args) {
    console.log(chalk.gray(...args));
  }

  static error(...args) {
    console.log(chalk.red(...args));
  }

  static success(...args) {
    console.log(chalk.green(...args));
  }

  static warn(...args) {
    console.log(chalk.magenta(...args));
  }

  static data(...args) {
    console.log(chalk.blue(...args));
  }

  static object(...args) {
    console.log(...args);
  }

  static deepObject(...args) {
    console.log(util.inspect(...args, { showHidden: false, depth: null }));
  }
}

export default Logger;
