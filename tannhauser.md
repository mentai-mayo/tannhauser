# tannhauser
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
