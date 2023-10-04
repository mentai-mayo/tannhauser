
import { token as parser_token } from './token-types.mjs';
import { AstElement } from './ast-elements.mjs';

type position = {
  line: number;   // n行目
  letter: number; // n文字目
  index: number;  // ソースコード上のindex
};

type token = {
  id: parser_token["id"];
  value: string;
  position: {
    head: position;
    tail: position;
  };
};

export class Ast {

  /** is debug mode */
  private DEBUG_MODE: boolean = false;
  
  /** parsed token list */
  private tokens: token[] = [];

  /** AST element root (language root) */
  private ast_element: AstElement.root = { id: 'tannhauser', statements: [] };

  private toAstTokens(tokens: parser_token[], source: string): token[] {

    // get LF positions
    const lfs: number[] = [];
    if(true) {
      const regexp = /\n/g;
      let result: RegExpExecArray | null = null;
      while(result = regexp.exec(source)) {
        lfs.push(result.index);
      }
    }
  
    let idx = 0;
    return tokens.map((token)=>{
      
      // calc head position
      const head = {
        line: 0,
        letter: 0,
        index: token.head,
      };
      while(lfs[idx] && head.index > (lfs[idx] as number)) idx++;
      if(!lfs[idx]) {
        throw `[Ast.toAstTokens] token position (head) is outside the range of source code (pos: ${ head.index }, source.length: ${ source.length })`;
      }
      head.line = idx + 1;
      head.letter = token.head - (lfs[idx] as number);
  
      // calc tail position
      const tail = {
        line: 0,
        letter: 0,
        index: token.tail,
      };
      while(lfs[idx] && tail.index > (lfs[idx] as number)) idx++;
      if(!lfs[idx]) {
        throw `[Ast.toAstTokens] token position (tail) is outside the range of source code (pos: ${ tail.index }, source.length: ${ source.length })`;
      }
      tail.line = idx + 1;
      tail.letter = token.tail - (lfs[idx] as number);
  
      // return AST token
      return {
        id: token.id,
        value: source.substring(token.head, token.tail + 1),
        position: {
          head,
          tail,
        },
      };
    });
  }

  /**
   * create AST from token list
   */
  public create(tokens: parser_token[], source: string, DEBUG_MODE: boolean = false): AstElement.root {
    
    this.DEBUG_MODE = DEBUG_MODE;
    this.tokens = this.toAstTokens(tokens, source);

    this.ast_element = { id: 'tannhauser', statements: [] };
  }
}
