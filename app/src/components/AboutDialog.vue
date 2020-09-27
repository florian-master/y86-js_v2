<template>
  <Dialog
    ref="Dialog"
    :title="this.scopedStrings.title"
    :width=400
  >
    <div>
      <h1>{{ scopedStrings.about }}</h1>
      <p>
        <i class="fa fa-code"></i>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/xsznix/js-y86/tree/master/samples">{{ scopedStrings.codeSamples }}</a>
      </p>
      <p>
        <i class="fa fa-file-alt"></i>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/xsznix/js-y86/wiki">{{ scopedStrings.documentation }}</a>
      </p>
      <p>
        <i class="fab fa-github"></i>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/ABandet/y86-in-js">{{ scopedStrings.sourceCode }}</a>
      </p>
      <div id="branding-container">
        <img src="@/assets/images/branding.png"/>
        <a target="_blank" rel="noopener noreferrer" href="https://www.u-bordeaux.fr/">{{ scopedStrings.branding }}</a>
      </div>
    </div>
  </Dialog>
</template>

<script>
  import Dialog from './Dialog.vue'

  export default {
    props: {
      scopedStrings: {
        type: Object,
        required: true
      }
    },
    components: {
      Dialog
    },
    methods: {
      show () {
        this.$refs.Dialog.show()
      }
    }
  }
</script>

<style scoped>
  .dialog-window {
    border: 4px solid red !important;
  }

  div {
    padding: 20px;
  }

  p > * {
    font-size: 20px;
  }

  p > i {
    width: 30px;
    text-align: center;
    padding-right: 10px;
    color: var(--AboutDialog-icon-foreground);
  }

  p > a,
  #branding-container > a {
    color: var(--Dialog-foreground);
  }

  #branding-container {
    display: flex;
    align-items: center;
  }

  #branding-container > a {
    margin: 0;
    padding: 6px 0 0 10px;
  }
</style>
