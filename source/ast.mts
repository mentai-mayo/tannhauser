
import { token } from './parser.mjs';

/** AST element identifiers */
const ast_element_ids = [
  'tannhauser', // program root
  'expression',
  'term',
  'factor',
  'literal',
] as const;

// ----- AST elements -----

type Element_tannhauser = {
  expressions: (Element_expression | Element_term)[]; // 循環参照を解消する苦肉の策
};

type Element_expression = {
  operator: '+' | '-';
  left: Element_term;
  right: Element_term;
}; // 本来は Element_term も Element_expression のうち

type Element_term = {
  operator: '*' | '/';
  left: Element_factor;
  right: Element_factor;
} | Element_factor;

type Element_factor = Element_literal | Element_expression;

type Element_literal = {
  type: 'integer';
  value: number;
};

export type AST_Element = Element_tannhauser;

export class Ast {
  
  /** parsed token list */
  private tokens: token[] = [];

  /** AST element root (language root) */
  private ast_element: Element_tannhauser = { expressions: [] };

  public create(): AST_Element {
    // 
  }
}
