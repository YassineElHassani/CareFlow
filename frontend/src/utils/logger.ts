/**
 * Logger Utility
 * Provides controlled logging that can be disabled in production
 */

const isDevelopment = import.meta.env.MODE === 'development';

class Logger {
  private prefix: string;

  constructor(prefix = 'CareFlow') {
    this.prefix = prefix;
  }

  private formatMessage(message: string, ...args: any[]): any[] {
    return [`[${this.prefix}] ${message}`, ...args];
  }

  log(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.log(...this.formatMessage(message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.info(...this.formatMessage(message, ...args));
    }
  }

  warn(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.warn(...this.formatMessage(message, ...args));
    }
  }

  error(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.error(...this.formatMessage(message, ...args));
    }
  }

  debug(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.debug(...this.formatMessage(message, ...args));
    }
  }
}

export const logger = new Logger();
export default logger;
