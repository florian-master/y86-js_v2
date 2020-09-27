/* eslint-disable-next-line no-undef */
ace.define("ace/mode/hcl_highlight_rules",
		["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],
        function(acequire, exports) {
	"use strict";

	var oop = acequire("../lib/oop");
	var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

	var HCLHighlightRules = function() {
		
		this.$rules = {
			"start" : [{
				"token": ["storage.type", "directive"],
				"regex": /#include |return /
			}, {
				"token": ["entity.name.function", "symbol"],
				"regex": /icode|ifun/
			}, {
				"token": "keyword.control",
				"regex": /boolsig|bool |char |quote|intsig |int |in /
			}, {
				"token": ["variable.language", "register"],
				"regex": /:/
			}, {
				"token": "comment",
				"regex": /#.*/
			},{
				"token": "constant.number",
				"regex": /\$?-?([0-9]+|0x[0-9a-f]+)/
			}]

		};
	};
	oop.inherits(HCLHighlightRules, TextHighlightRules);

	exports.HCLHighlightRules = HCLHighlightRules;

});

/* eslint-disable-next-line no-undef */
ace.define("ace/mode/hcl",
		["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/hcl_highlight_rules"],
        function(acequire, exports) {
	"use strict";

	var oop = acequire("../lib/oop");
	var TextMode = acequire("./text").Mode;
	var HCLHighlightRules = acequire("./hcl_highlight_rules").HCLHighlightRules;

	var Mode = function() {
		this.HighlightRules = HCLHighlightRules;
	};
	oop.inherits(Mode, TextMode);

	Mode.prototype.$id = "ace/mode/hcl";

	exports.Mode = Mode;
});
