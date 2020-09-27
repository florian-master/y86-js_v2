ace.define("ace/mode/y86_highlight_rules",
		["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],
		function(acequire, exports, module) {
	"use strict";

	var oop = acequire("../lib/oop");
	var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

	var Y86HighlightRules = function() {
		
		this.$rules = {
			"start" : [{
				"token": "comment",
				"regex": /#.*/
			}, {
				"token": ["storage.type", "directive"],
				"regex": /\.(?:pos|align|long)/
			}, {
				"token": ["entity.name.function", "symbol"],
				"regex": /\w+[ \t]*:/
			}, {
				"token": "keyword.control",
				"regex": /halt|nop|rrmovl|cmovle|cmovl|cmove|cmovne|cmovge|cmovg|irmovl|rmmovl|mrmovl|addl|subl|xorl|andl|jmp|jle|jl|je|jne|jge|jg|loop|call|ret|pushl|popl|iaddl|isubl|iandl|ixorl|brk|brkle|brkl|brke|brkne|brkge|brkg/
			}, {
				"token": ["variable.language", "register"],
				"regex": /%(?:eax|ebx|ecx|edx|ebp|esp|esi|edi)/
			}, {
				"token": "constant.number",
				"regex": /\$?\-?([0-9]+|\0\x[0-9a-f]+)/
			}]

		};
	};
	oop.inherits(Y86HighlightRules, TextHighlightRules);

	exports.Y86HighlightRules = Y86HighlightRules;

});

ace.define("ace/mode/y86",
		   ["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/y86_highlight_rules","ace/worker/worker_client"],
		function(acequire, exports, module) {
	"use strict";

	var oop = acequire("../lib/oop");
	var TextMode = acequire("./text").Mode;
	var Y86HighlightRules = acequire("./y86_highlight_rules").Y86HighlightRules;
	var WorkerClient = acequire("../worker/worker_client").WorkerClient;

	var Mode = function() {
		this.HighlightRules = Y86HighlightRules;
	};
	oop.inherits(Mode, TextMode);

	Mode.prototype.$id = "ace/mode/y86";

	exports.Mode = Mode;
});
