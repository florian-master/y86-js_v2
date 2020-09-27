<template>
  <div class="component">
    <h1>{{ scopedStrings.title }}</h1>
    <div></div>
  </div>
</template>

<script>
  import brace from 'brace'

  export default {
    name:"Editor",
    props: {
      scopedStrings: {
        type: Object,
        required: true
      },
      mode: {
        type: String,
        required: true
      },
      controller: {
        type: Object,
        required: true
      }
    },
    methods: {
      getCode () {
        return this.editor.getValue()
      },
      setCode(code) {
        this.editor.setValue(code, 1)
        this.editor.gotoLine(0);
      },
      deferredAnnotate () {
        if (this.annotateTimeout) {
          window.clearTimeout(this.annotateTimeout)
        }
        this.annotateTimeout = window.setTimeout(this.annotate, 500)
      },
      annotate () {
        try {
          let errors = this.controller.assemble(this.editor.getValue()).errors;
          let aceFormattedErrors = errors.map(function (error) {
            return {
              row:    error.line - 1,
              column: 0,
              text:   error.message,
              type:   'error'
            }
          })
          this.editor.getSession().setAnnotations(aceFormattedErrors)
        } catch(e) {
          this.editor.getSession().setAnnotations([{
            row:    0,
            column: 0,
            text:   'Unknown error : ' + e,
            type:   'error',
          }])
        }
      }
    },
    mounted () {
      // Which element of the template should contain the editor
      this.editor = brace.edit(this.$el.childNodes[1])

      // NOTE This only works for our home-made modes, builtins modes cannot be
      // loaded this way, use `brace/mode/${this.mode}` instead
      require(`@/assets/brace/mode/${this.mode}`)
      require('@/assets/brace/theme/y86_sim')

      this.editor.setOptions({
        displayIndentGuides: true,
        fixedWidthGutter: true,
        highlightActiveLine: true,
        highlightGutterLine: true,
        mode: `ace/mode/${this.mode}`,
        theme: 'ace/theme/y86_sim',
        newLineMode: 'unix',
        printMargin: 80,
        readOnly: false,
        showGutter: true,
        tabSize: 4,
        useSoftTabs: true,
        wrap: true
      })

      this.editor.setValue("", 1)
      this.editor.gotoLine(0);

      // Enables annotations on input errors
      this.editor.on('change', this.deferredAnnotate)
    }
  }
</script>

<style scoped>
  .component > div {
    display: flex;
    flex-direction: column;
  }
</style>
