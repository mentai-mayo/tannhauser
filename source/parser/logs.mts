
// function isNodeJs(): boolean{
//   return typeof globalThis.window !== 'object';
// }

export const flags = {

  /**
   * info表示を抑制する
   */
  hideInfos: false,

  /**
   * warning表示を抑制する
   */
  hideWarnings: false,

  /**
   * error表示を抑制する
   */
  hideErrors: false,

  /**
   * logfileのrootdirのpath
   * nullのときはlogfileへの出力をしない
   * ブラウザ版を作るときはnullに固定
   * @default "logs/"
   */
  // logRoot: 'logs/' as (string | null),
};

export namespace Log {

  /**
   * error出力
   * @param args 出力する内容
   */
  export function error(...args: any[]): void{
    if(flags.hideErrors) return;
    console.error('\u001b[41m tannhauser ERROR \u001b[0m', ...args);
  }

  /**
   * warning出力
   * @param args 出力する内容
   */
  export function warning(...args: any[]): void{
    if(flags.hideWarnings) return;
    console.warn('\u001b[43m tannhauser WARN  \u001b[0m', ...args);
  }

  /**
   * info出力
   * @param args 出力する内容
   */
  export function info(...args: any[]): void{
    if(flags.hideInfos) return;
    console.warn('\u001b[42m tannhauser INFO  \u001b[0m', ...args);
  }
};
