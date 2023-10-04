
/** token id list */
const token_ids = [
  'separator.semicolon',

  'brace.group.head',
  'brace.group.tail',

  'operator.plus',
  'operator.minus',
  'operator.multi',
  'operator.divide',

  'literal.integer',
] as const;

/** token type */
export type token = {
  /** identifier name */
  id: typeof token_ids[number];

  /** token head index */
  head: number;

  /** token tail index */
  tail: number;
};
