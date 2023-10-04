
type SizedArray<Type, size extends number, args extends any[] = []> = args['length'] extends size ? args : SizedArray<Type, size, [Type, ...args]>;

export namespace AstElement {
  
  export type root = tannhauser;

  export type tannhauser = {
    id: 'tannhauser';
    statements: (addition_substraction | multiplication_division | literal.all)[];
  };

  export type addition_substraction = {
    id: 'addition';
    expressions: SizedArray< (addition_substraction | multiplication_division | literal.all), 2>;
  } | {
    id: 'substraction';
    expressions: SizedArray< (addition_substraction | multiplication_division | literal.all), 2>;
  };

  export type multiplication_division = {
    id: 'multiplication';
    expressions: SizedArray< (addition_substraction | multiplication_division | literal.all), 2>;
  } | {
    id: 'division';
    expressions: SizedArray< (addition_substraction | multiplication_division | literal.all), 2>;
  };

  export namespace literal {
    
    export type all = integer;

    export type integer = {
      id: 'literal',
      type: 'integer',
      data: string; // 実際のデータに変換していいんかこれ？
    };
  }
}
