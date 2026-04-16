import { Injectable } from '@angular/core';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogTag = string | object | null | undefined;

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly debugEnabled = true;

  public debug(tag: LogTag, ...args: unknown[]): void {
    if (!this.debugEnabled) return;
    this.print('debug', tag, args);
  }

  public info(tag: LogTag, ...args: unknown[]): void {
    this.print('info', tag, args);
  }

  public warn(tag: LogTag, ...args: unknown[]): void {
    this.print('warn', tag, args);
  }

  public error(tag: LogTag, ...args: unknown[]): void {
    this.print('error', tag, args);
  }

  private print(level: LogLevel, tagInput: LogTag, args: unknown[]): void {
    const timestamp = this.formatTimestamp(new Date());
    const tag = this.resolveTag(tagInput);

    const timestampStyle = this.getTimestampStyle(level);
    //const levelStyle = this.getLevelStyle(level);
    const tagStyle = 'color: #9e9e9e; font-weight: 700;';
    const resetStyle = '';

    const consoleMethod = this.getConsoleMethod(level);

    if (args.length === 0) {
      consoleMethod(
        `%c${timestamp} %c[${tag}]`,
        timestampStyle,
        //levelStyle,
        tagStyle,
      );
      return;
    }

    consoleMethod(
      `%c${timestamp} %c[${tag}]%c`,
      timestampStyle,
      //levelStyle,
      tagStyle,
      resetStyle,
      ...args,
    );
  }

  private resolveTag(tagInput: LogTag): string {
    if (typeof tagInput === 'string' && tagInput.trim()) {
      return tagInput.trim();
    }

    if (
      tagInput &&
      typeof tagInput === 'object' &&
      tagInput.constructor?.name &&
      tagInput.constructor.name !== 'Object'
    ) {
      return tagInput.constructor.name;
    }

    return 'App';
  }

  private formatTimestamp(date: Date): string {
    const pad = (value: number, length = 2): string =>
      value.toString().padStart(length, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
      date.getHours(),
    )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(
      date.getMilliseconds(),
      3,
    )}`;
  }

  private getConsoleMethod(level: LogLevel): (...data: unknown[]) => void {
    switch (level) {
      case 'debug':
        return console.debug.bind(console);
      case 'info':
        return console.info.bind(console);
      case 'warn':
        return console.warn.bind(console);
      case 'error':
        return console.error.bind(console);
    }
  }

  private getTimestampStyle(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return 'color: #51d78b; font-weight: 500;';
      case 'info':
        return 'color: #42a5f5; font-weight: 500;';
      case 'warn':
        return 'color: #ffb300; font-weight: 500;';
      case 'error':
        return 'color: #ef5350; font-weight: 500;';
    }
  }

  private getLevelStyle(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return 'color: #51d78b; font-weight: 700;';
      case 'info':
        return 'color: #1e88e5; font-weight: 700;';
      case 'warn':
        return 'color: #fb8c00; font-weight: 700;';
      case 'error':
        return 'color: #e53935; font-weight: 700;';
    }
  }
}
