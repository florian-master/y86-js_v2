%parse-param data

/* Code used when parsing. Grammar is below. */
%{
    /*
     * The parser use few variables not instanciated here.
     * Here is the needed code :
     *
     * let quoteList = [] 
     *
     * let intsigs = [] // Pairs intsig <-> value
     * let boolsigs = [] // Pairs boolsig <-> value
     *
     * let intDefinitions = [] // Pairs int function <-> instruction list 
     * let boolDefinitions = [] // Pairs bool function <-> instruction
     * 
     * In order to use the parser many times, we must be able to reset these
     * variables. The only solution found at the moment is to clean them
     * manually outside of the parser.
     */

    // Checks if both intsig and boolsig have not any
    // value associated to the given identifier
    function checkSigUnicity(identifier, data, line) {
        if(data.intsigs[identifier]) {
            data.errors.push(new data.CompilationError(line, identifier + " is already declared as an intsig"))
        }
        if(data.boolsigs[identifier]) {
            data.errors.push(new data.CompilationError(line, identifier + " is already declared as a boolsig"))
        }
    }

    // Checks if both int definitions and bool definitions have not any
    // value associated to the given identifier
    function checkDefinitionUnicity(identifier, data, line) {
        if(data.intDefinitions[identifier]) {
            data.errors.push(new data.CompilationError(line, identifier + " is already defined as an int defintion"))
        }
        if(data.boolDefinitions[identifier]) {
            data.errors.push(new data.CompilationError(line, identifier + " is already defined as an bool defintion"))
        }
    }

    // HCL strings are parsed as 'text'.
    // This function returns text, without the ' character
    // It assumes the given string is of the form 'text'.
    function cleanHclString(str) {
        return str.substring(1, str.length - 1)
    }

    function sanitizeString(str) {
        return str.replace(/"/g, "'")
    }

    // Returns a intsig or boolsig value
    // using the given identifier as key.
    function getSigValue(identifier, data, line) {
        let jsSigName = "'none'"

        if(data.intsigs[identifier]) {
            jsSigName = data.intsigs[identifier]
        } else if(data.boolsigs[identifier]) {
            jsSigName = data.boolsigs[identifier]
        } else {
            data.errors.push(new data.CompilationError(line, identifier + " is not declared"))
        }

        let finalValue = cleanHclString(jsSigName)
        data.identifiersList.push(finalValue)

        return finalValue
    }

    function generateIdentifiersVerificationJs(identifiersList, functionName) {
        if(identifiersList.length === 0) {
            return ""
        }

        let jsOutput  = "   // Checks if some identifiers are undefined\n"

        identifiersList.forEach((identifier) => {
            jsOutput += "   try { if(" + identifier + " === undefined) { throw '' } } catch(e) { throw \"HCL : " 
            + sanitizeString(identifier) + " is not accessible in function '" + functionName + "'\" }\n"
        })
        jsOutput += "   // End of checks\n\n"
        
        return jsOutput
    }
%}

/* lexical grammar */
%lex
%%

\n                      /* ignore */
[^\S\n]+                /* ignore whitespace other than newlines */

[ \r\t\f]               /* ignore */              
\#[^\n]+                /* skip comments   */
quote                   return 'QUOTE'
boolsig                 return 'BOOLARG'
bool                    return 'BOOL'
intsig                  return 'INTARG'
int                     return 'INT'
in                      return 'IN'
"'".+?(?="'")"'"        return 'QSTRING'
[a-zA-Z][a-zA-Z0-9_]*   return 'VAR'
[0-9][0-9]*             return 'P_NUM'
"-"[0-9][0-9]*          return 'N_NUM'
";"                     return 'SEMI'
":"                     return 'COLON'
","                     return 'COMMA'
"("                     return 'LPAREN'
")"                     return 'RPAREN'
"{"                     return 'LBRACE'
"}"                     return 'RBRACE'
"["                     return 'LBRACK'
"]"                     return 'RBRACK'
"&&"                    return 'AND'
"^^"                    return 'XOR'
"||"                    return 'OR'
"!="                    return 'COMP'
"=="                    return 'COMP'
"<"                     return 'COMP'
"<="                    return 'COMP'
">"                     return 'COMP'
">="                    return 'COMP'
"!"                     return 'NOT'
"="                     return 'ASSIGN'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

/lex

%left 'OR'
%left 'XOR'
%left 'AND'
%left 'NOT'
%left 'COMP'
%left 'IN'

%start hcl

%% /* language grammar */

hcl
    : statements EOF 
        {
            /*
            * The js file is generated here in 3 steps.
            */

            let jsOutput = "new function() {\n\n"

            // Render user's quotes --- step 1
            data.quoteList.forEach(function (item) {
                jsOutput += item + "\n\n"
            })

            // Render int definitions --- step 2
            for(let name in data.intDefinitions) {
                const instr = data.intDefinitions[name].definition
                const identifiersList = data.intDefinitions[name].identifiersList

                jsOutput += "this." + name + " = () => {\n"
                jsOutput += generateIdentifiersVerificationJs(identifiersList, name)
                jsOutput += "   return " + instr + ";\n}\n\n"
            }

            // Render bool defintions --- step 3
            for(let name in data.boolDefinitions) {
                const instr = data.boolDefinitions[name].definition
                const identifiersList = data.boolDefinitions[name].identifiersList

                jsOutput += "this." + name + " = () => {\n"
                jsOutput += generateIdentifiersVerificationJs(identifiersList, name)
                jsOutput += "   return " + instr + ";\n}\n\n"
            }

            jsOutput += "}"
            $$ = jsOutput 
            return $$
        }
    ;

statements
    : statements statement
    |
    ;

statement
    : QUOTE QSTRING   
        { data.quoteList.push(cleanHclString($2)) }                
    | BOOLARG VAR QSTRING    
        { 
            checkSigUnicity($2, data, @2.first_line)
            data.boolsigs[$2] = $3
        }         
    | INTARG VAR QSTRING      
        { 
            checkSigUnicity($2, data, @2.first_line)
            data.intsigs[$2] = $3
        }       
    | BOOL VAR ASSIGN expr SEMI    
        {
            checkDefinitionUnicity($2, data, @2.first_line)
            var content = {
                definition: $4,
                identifiersList: data.identifiersList,
            }
            data.boolDefinitions[$2] = content

            data.identifiersList = []
        }   
    | INT VAR ASSIGN expr SEMI        
        {
            checkDefinitionUnicity($2, data, @2.first_line)
            var content = {
                definition: $4,
                identifiersList: data.identifiersList,
            }
            data.intDefinitions[$2] = content

            data.identifiersList = []
        }
    ;

expr
    : VAR 
        { $$ = getSigValue($1, data, @1.first_line) }             
    | P_NUM    
        { $$ = $1 }          
    | N_NUM    
        { $$ = $1 }
    | LPAREN expr RPAREN  
        { $$ = $1 + $2 + $3 }
    | NOT expr            
        { $$ = $1 + ' ' + $2 }
    | expr AND expr        
        { $$ = $1 + ' ' + $2 + ' ' + $3 }
    | expr XOR expr        
        { $$ = $1 + ' ' + $2 + ' ' + $3 }
    | expr OR expr       
        { $$ = $1 + ' ' + $2 + ' ' + $3 }
    | expr COMP expr      
        { $$ = $1 + ' ' + $2 + ' ' + $3 }
    | expr IN LBRACE exprlist RBRACE    
        { 
            let exp = "(" + $1 + ")"
            let list = $4
            let condition = ""
            
            let i
            for(i = 0; i < list.length; i++) {
                condition += "(" + exp + " === (" + list[i] +"))"
                if(i != list.length - 1) {
                    condition += " || "
                }
            }

            $$ = condition
        }
    | LBRACK caselist RBRACK
        { 
            let expr = ''

            $2.forEach((exprCase) => {
                expr += '(' + exprCase.condition + ') ? '
                expr += '(' + exprCase.value + ') : '
            })

            // Default value if all conditions were false, or the list is empty
            expr += '0' 
            $$ = expr 
        }
    ;

exprlist
    : expr
        {
            $$ = []
            $$.push($1)
        }
    | exprlist COMMA expr
        {
            $$ = $1
            $$.push($3)
        } 
    ;

caselist
    : caselist expr COLON expr SEMI 
        {
             $$ = $1 
             $$.push({condition: $2, value: $4})
        }
    |   { $$ = [] }
    ;