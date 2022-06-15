
## version 0.1.0

```ebnf

expression = [ "-" ] , number , ( "+" | "-" ), ( number | expression ) ;

number = { digit } , [ "." , { digit } ] , [ "e" , [ "-" ] , { digit } ] ;

digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;

```
