ace.define("ace/theme/y86_sim",
           ["require", "exports", "module", "ace/lib/dom"],
           function (acequire, exports, module) {
    exports.isDark = false;
    exports.cssClass = "ace-y86-sim";
    exports.cssText = require("./y86_sim.css");
    var dom = acequire("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
})
