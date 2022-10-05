
## version 0.2.0

```ebnf

expression = [ "-" ] , number , ( "+" | "-" ), ( number | expression ) ;

number = { digit } , [ "." , { digit } ] , [ "e" , [ "-" ] , { digit } ] ;

digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;

```

## version 0.1.0

``` ebnf

# 加算

expression = [ "+" | "-" ] , literal.integer , [ expression ] ;

# 整数型
literal.integer = ( ( _digit - "0" ) , { _digit } ) | "0" ;

# 桁
_digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;

```
