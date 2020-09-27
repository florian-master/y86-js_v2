%parse-param data

/* lexical grammar */
%lex
%%

/**
 * https://stackoverflow.com/questions/37550567/how-to-detect-new-line-in-jison
 * Used to make the new line tokens work.
 */
\n                              return 'NEW_LINE'
[^\S\n]+                        /* ignore whitespace other than newlines */

[ \r\t\f]                       /* ignore */
\#[^\n]+                        return 'COMMENT'
":"                             return 'COLON'
"("                             return 'LPAREN'
")"                             return 'RPAREN'
(0x[0-9a-fA-F]+)|(\-?[0-9]+)    return 'NUMBER'
\%([a-z]+)                      return 'REGISTER'
","                             return 'COMMA'
<<EOF>>                         return 'EOF'
[a-zA-Z][0-9a-zA-Z_]*           return 'IDENTIFIER'
\.[a-zA-Z][0-9a-zA-Z_]*         return 'DIRECTIVE_IDENTIFIER'
.                               return 'INVALID'

/lex

%start document

%% /* language grammar */

document
    : line_list EOF
        {
            $$ = new data.Document($1)
            return $$
        }
    ;

line_list
    : line
        { $$ = [$1] }
    | line_list line
        { 
            $$ = $1
            $$.push($2)
        }
    ;

line
    : label statement line_comment NEW_LINE
        { 
            $$ = new data.Line(@1.first_line, [$1, $2], $3)
        }
    | label line_comment NEW_LINE
        {
            $$ = new data.Line(@1.first_line, [$1], $2)
        }
    | statement line_comment NEW_LINE
        { 
            $$ = new data.Line(@1.first_line, [$1], $2)
        }
    | line_comment NEW_LINE
        { 
            $$ = new data.Line(@1.first_line, [], $1)
        }
    ;

statement
    : directive
        { $$ = $1 }
    | instruction
        { $$ = $1 }
    ;

label
    : IDENTIFIER COLON
        { $$ = new data.Label($1, @1.first_line) }
    ;

directive
    : DIRECTIVE_IDENTIFIER NUMBER
        { 
            $$ = new data.Directive($1.substr(1), $2, @1.first_line) 
        }
    ;

instruction
    : IDENTIFIER arg_list
        { $$ = new data.InstructionLine($1, $2, @1.first_line) }
    ;

arg_list
    : arg
        {
            $$ = []
            $$.push($1)
        }
    | arg_list COMMA arg
        {
            $$ = $1
            $$.push($3)
        }
    | { $$ = [] }
    ;

arg
    : IDENTIFIER
        { $$ = $1 }
    | NUMBER
        { $$ = $1 }
    | REGISTER
        { $$ = $1}
    | addressFromRegister 
        { $$ = $1 }
    ;

addressFromRegister
    : LPAREN REGISTER RPAREN
        { $$ = new data.AddressFromRegister($2) }
    | NUMBER LPAREN REGISTER RPAREN
        { $$ = new data.AddressFromRegister($3, $1) }
    ;

line_comment
    : COMMENT
        { $$ = $1 }
    | 
        { $$ = '' }
    ;