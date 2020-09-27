# Improvements

## Ability to set breakpoints in the editors

The module used for the `Editor` component is [brace](https://github.com/thlorenz/brace) which is a browserify compatible version of [ace](https://github.com/ajaxorg/ace/).
It has support for **breakpoints**, so adding this feature should not be too troublesome, the simulator's `continue()` function also allows breakpoints to be passed.
Here is an [article](https://ourcodeworld.com/articles/read/1052/how-to-add-toggle-breakpoints-on-the-ace-editor-gutter) explaining the steps to follow.

## More try/catch covered code

Thanks to the `PromptDialog` component, we can easily display success, warning or errors messages.
It has been used a lot in try/catch code blocks to ensure no error is silently ignored.
But not every bit of code has these safeties, so adding more try/catch blocks would help.
