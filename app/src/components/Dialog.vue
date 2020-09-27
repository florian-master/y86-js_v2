/* Based on: https://vuejsexamples.com/slim-dialog-for-vuejs/ */
<template>
  <transition name="show-dialog">
    <div class="dialog-container" v-if="this.showState" @click="hide">
      <div class="center-dialog-vertically">
        <div :style="windowWidth" class="dialog-window" v-on:click.stop>
          <div>

            <button class="close-button" @click="hide">
              <i class="fa fa-times"></i>
            </button>

            <h1>{{ this.title }}</h1>

            <slot></slot>

            </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      width: {
        default: 600,
        type: Number,
        required: false
      }
    },
    data () {
      return {
        showState: false
      }
    },
    computed: {
      windowWidth () {
        return 'width: ' + this.width + 'px;'
      }
    },
    methods: {
      hide () {
        this.showState = false
      },
      show () {
        this.showState = true
      }
    }
  }
</script>

<style scoped>
  .dialog-container {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    display: table;
    width: 100%;
    height: 100%;
    background-color: var(--Dialog-container-background);
    transition: opacity 0.3s ease;
  }

  .center-dialog-vertically {
    display: table-cell;
    vertical-align: middle;
    padding-bottom: 10%;
  }

  .dialog-window {
    margin: 0 auto;
    padding: 0;
    background-color: var(--Dialog-background);
    color: var(--Dialog-foreground);
    transition: all 0.3s ease;
  }

  .close-button {
    position: relative;
    bottom: -20px;
    left: -20px;
    float: right;
    background: none;
    color: var(--Dialog-close-button-foreground);
    font-size: 20px;
  }

  h1 {
    margin: 0;
    padding: 20px 0 14px 20px;
    background-color: var(--Dialog-heading-background);
    color: var(--Dialog-heading-foreground);
    font-size: 24px;
  }

  h1:first-letter {
    text-transform: capitalize;
  }

  /* Vue transition properties */

  .show-dialog-enter {
    opacity: 0;
  }

  .show-dialog-leave-active {
    opacity: 0;
  }
</style>
