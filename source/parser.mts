
import { token } from './token-types.mjs';

export class Parser {

  /** is debug mode */
  private DEBUG_MODE: boolean = false;
  
  /** source code string */
  private source: string = '';

  /** token list */
  private tokens: token[] = [];

  /** cursor index */
  private cursor: number = 0;

  public parse(source: string, DEBUG_MODE: boolean = false): token[] {
    
    // init
    this.DEBUG_MODE = DEBUG_MODE;
    this.source = source;
    this.tokens = [];
    this.cursor = 0;

    // tannhauser = ws , { expression , separator.semicolon , ws }
    while(this.cursor < this.source.length) {
      
      // ws
      this.whiteSpace();

      // {
      while(this.source[this.cursor]) {

        // expression
        this.expression();

        // separator.semicolon
        this.separator_semicolon();

        // ws
        this.whiteSpace();
      }
    }

    return this.tokens;
  }

  /**
   * expression = ws , [ operator.plus | operator.minus ] , ws , term , ws , { ( operator.plus | operator.minus ) , ws , term } ;
   */
  private expression(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) {
      console.log('[debug]', `call Parser.expression (cursor-pos: ${ this.cursor })`);
      console.group();
    }

    // ws
    this.whiteSpace();

    // [ operator.plus | operator.minus ]
    if(this.source[this.cursor] == '+') {
      this.operator_plus();
    }
    if(this.source[this.cursor] == '-') {
      this.operator_minus();
    }

    // ws
    this.whiteSpace();

    // term
    this.term();

    // ws
    this.whiteSpace();

    // {
    while(/\+|\-/.test(this.source[this.cursor] ?? '')) {

      // ( operator.plus | operator.minus )
      if(this.source[this.cursor] == '+') {
        this.operator_plus();
      } else if (this.source[this.cursor] == '-') {
        this.operator_minus();
      } else {
        console.log({ token: this.tokens, cursor: this.cursor });
        throw `invalid operator "${ this.source[this.cursor] }"`;
      }

      // ws
      this.whiteSpace();

      // term
      this.term();

      // ws
      this.whiteSpace();

      // }
    }

    if(this.DEBUG_MODE) {
      console.groupEnd();
    }
  }

  /**
   * term = factor , ws , { ( operator.multi | operator.divide ) , ws , factor } ;
   */
  private term(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) {
      console.log('[debug]', `call Parser.term (cursor-pos: ${ this.cursor })`);
      console.group();
    }

    // factor
    this.factor();

    // ws
    this.whiteSpace();

    // {
    while(/\*|\//.test(this.source[this.cursor] ?? '')) {

      // ( operator.multi | operator.divide )
      if(this.source[this.cursor] == '*') {
        this.operator_multi();
      } else if(this.source[this.cursor] == '/') {
        this.operator_divide();
      }

      // ws
      this.whiteSpace();

      // factor
      this.factor();

      // {
    }

    if(this.DEBUG_MODE) {
      console.groupEnd();
    }
  }

  /**
   * factor = literal.integer | ( brace.group.head , ws , expression , ws , brace.group.tail ) ;
   */
  private factor(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) {
      console.log('[debug]', `call Parser.factor (cursor-pos: ${ this.cursor })`);
      console.group();
    }
    
    if(this.source[this.cursor] == '(') {
      
      // brace.group.head
      this.brace_group_head();

      // ws
      this.whiteSpace();

      // expression
      this.expression();

      // ws
      this.whiteSpace();

      // brace.group.tail
      this.brace_group_tail();
    } else {

      // literal.integer
      this.literal_integer();
    }

    if(this.DEBUG_MODE) {
      console.groupEnd();
    }
  }

  /**
   * [token]: separator.semicolon
   * separator.semicolon = ";" ;
   */
  private separator_semicolon(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) console.log('[debug]', `call Parser.separator_semicolon (cursor-pos: ${ this.cursor })`);
    
    if(this.source[this.cursor] == ';') {

      // ";"
      this.tokens.push({
        id: 'separator.semicolon',
        head: this.cursor,
        tail: this.cursor,
      });
      this.cursor++;
    } else {
      console.log({ token: this.tokens, cursor: this.cursor });
      throw `[Parser.separator_semicolon] invalid separator "${ this.source[this.cursor] }" detected`;
    }
  }

  /**
   * [token]: literal.integer
   * literal.integer = "0" | ( ( digit.decimal - "0" ) , { digit.decimal } ) ;
   * digit.decimal = "0" | "1" | ... | "9" ; # [0-9]
   */
  private literal_integer(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) console.log('[debug]', `call Parser.literal_integer (cursor-pos: ${ this.cursor })`);
    
    if(this.source[this.cursor] == '0') {
      
      // "0"
      this.tokens.push({
        id: 'literal.integer',
        head: this.cursor,
        tail: this.cursor,
      });
      this.cursor++;
    } else if(/[1-9]/.test(this.source[this.cursor] ?? '')) {

      // [1-9][0-9]*
      const head = this.cursor;
      const regexp = /[^0-9]/g;
      regexp.lastIndex = this.cursor;
      regexp.exec(this.source);
      this.tokens.push({
        id: 'literal.integer',
        head,
        tail: regexp.lastIndex - 2,
      });
      this.cursor = regexp.lastIndex - 1;
    } else {
      console.log({ token: this.tokens, cursor: this.cursor });
      throw `[Parser.literal_integer] invalid integer detected at ${ this.cursor }`;
    }
  }

  /**
   * [token]: brace.group.tail
   * brace.group.tail = ")" ;
   */
  private brace_group_tail(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) console.log('[debug]', `call Parser.brace_group_tail (cursor-pos: ${ this.cursor })`);
    
    // ")"
    if(this.source[this.cursor] == ')') {
      this.tokens.push({
        id: 'brace.group.tail',
        head: this.cursor,
        tail: this.cursor,
      });
      this.cursor++;
    } else {
      console.log({ token: this.tokens, cursor: this.cursor });
      throw `[Parser.brace_group_tail] invalid character "${ this.source[this.cursor] }" detected`;
    }
  }

  /**
   * [token]: brace.group.head
   * brace.group.head = "(" ;
   */
  private brace_group_head(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) console.log('[debug]', `call Parser.brace_group_head (cursor-pos: ${ this.cursor })`);
    
    // "("
    if(this.source[this.cursor] == '(') {
      this.tokens.push({
        id: 'brace.group.head',
        head: this.cursor,
        tail: this.cursor,
      });
      this.cursor++;
    } else {
      console.log({ token: this.tokens, cursor: this.cursor });
      throw `[Parser.brace_group_head] invalid character "${ this.source[this.cursor] }" detected`;
    }
  }

  /**
   * [token]: operator.divide
   * operator.divide = "/" ;
   */
  private operator_divide(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) console.log('[debug]', `call Parser.operator_divide (cursor-pos: ${ this.cursor })`);
    
    // "/"
    if(this.source[this.cursor] == '/') {
      this.tokens.push({
        id: 'operator.divide',
        head: this.cursor,
        tail: this.cursor,
      });
      this.cursor++;
    } else {
      console.log({ token: this.tokens, cursor: this.cursor });
      throw `[Parser.operator_divide] invalid character "${ this.source[this.cursor] }" detected`;
    }
  }

  /**
   * [token]: operator.multi
   * operator.multi = "*" ;
   */
  private operator_multi(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) console.log('[debug]', `call Parser.operator_multi (cursor-pos: ${ this.cursor })`);
    
    // "*"
    if(this.source[this.cursor] == '*') {
      this.tokens.push({
        id: 'operator.multi',
        head: this.cursor,
        tail: this.cursor,
      });
      this.cursor++;
    } else {
      console.log({ token: this.tokens, cursor: this.cursor });
      throw `[Parser.operator_multi] invalid character "${ this.source[this.cursor] }" detected`;
    }
  }

  /**
   * [token]: operator.plus
   * operator.plus = "+" ;
   */
  private operator_plus(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) console.log('[debug]', `call Parser.operator_plus (cursor-pos: ${ this.cursor })`);
    
    // "+"
    if(this.source[this.cursor] == '+') {
      this.tokens.push({
        id: 'operator.plus',
        head: this.cursor,
        tail: this.cursor,
      });
      this.cursor++;
    } else {
      console.log({ token: this.tokens, cursor: this.cursor });
      throw `[Parser.operator_plus] invalid character "${ this.source[this.cursor] }" detected`;
    }
  }

  /**
   * [token]: operator.minus
   * operator.minus = "-" ;
   */
  private operator_minus(): void {
    
    // this.DEBUG_MODE
    if(this.DEBUG_MODE) console.log('[debug]', `call Parser.operator_minus (cursor-pos: ${ this.cursor })`);

    // "-"
    if(this.source[this.cursor] == '-') {
      this.tokens.push({
        id: 'operator.minus',
        head: this.cursor,
        tail: this.cursor,
      });
      this.cursor++;
    } else {
      console.log({ token: this.tokens, cursor: this.cursor });
      throw `[Parser.operator_minus] invalid character "${ this.source[this.cursor] }" detected`;
    }
  }

  /**
   * white space
   * ws = { " " | "\t" | "\n" | "\r" |"\xa0" } ; # \xa0 non-break space
   */
  private whiteSpace(): void {

    // this.DEBUG_MODE
    if(this.DEBUG_MODE) console.log('[debug]', `call Parser.whiteSpace (cursor-pos: ${ this.cursor })`);
    
    while(/ |\t|\n|\r|\xa0/.test(this.source[this.cursor] ?? '')) {
      this.cursor++;
    }
  }
}
