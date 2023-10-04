# tannhauser
自分で言語作ってみたい


## version 0.1.0

### parser syntax (ebnf)
```ebnf
# ----- language root -----
tannhauser = ws , { expression , separator.semicolon , ws } ;

# ----- idents -----
expression = ws , [ operator.plus | operator.minus ] , ws , term , ws , { ( operator.plus | operator.minus ) , ws , term , ws } ;
term = factor , ws , { ( operator.multi | operator.divide ) , ws , factor } ;
factor = literal.integer | ( brace.group.head , ws , expression , ws , brace.group.tail ) ;

# ----- tokens -----

# separator
separator.semicolon = ";";

# brace
brace.group.head = "(" ;
brace.group.tail = ")" ;

# operator
operator.plus = "+" ;
operator.minus = "-" ;
operator.multi = "*" ;
operator.divide = "/" ;

# literal
literal.integer = "0" | ( ( digit.decimal - "0" ) , { digit.decimal } ) ;

# ----- symbols -----

# digit
digit.decimal = "0" | "1" | ... | "9" ; # [0-9]

# white space
ws = { " " | "\t" | "\n" | "\r" |"\xa0" } ; # \xa0 non-break space
```

### AST struct
```ts
type tannhauser = {
  expressions: expression[];
}

type expression = {
  operator: '+' | '-';
  left: term;
  right: term;
} | term;

type term = {
  operator: '*' | '/';
  left: factor;
  right: factor;
} | factor;

type factor = literal | expression;

type literal = {
  type: 'integer',
  value: number;
};
```
