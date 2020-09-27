<template>
  <div id="app">

    <link rel="stylesheet" type="text/css" :href="currentThemeFile">

    <Header
      :strings="strings"
      :settings="settings"
      :sim="simController"
      :yas-controller="yasController"
      :hcl-controller="hclController"
      @updateCurrentTab="updateCurrentTab"
      @showPromptDialog="showPromptDialog"
    />

    <Tabs
      ref="Tabs"
      :strings="strings"
      :currentTab="settings.current.tab"
      :tabs="settings.tabs"
      :kernelController="kernelController"
      :hclController="hclController"
      :yasController="yasController"
      :sim="simController"
      @updateCurrentTab="updateCurrentTab"
      @showPromptDialog="showPromptDialog"
    />

    <PromptDialog
      ref="PromptDialog"
      :scopedStrings="strings.PromptDialog"
    />

  </div>

</template>

<script>
  import Header from './components/Header.vue'
  import PromptDialog from './components/PromptDialog.vue'
  import Tabs from './components/Tabs.vue'

  import settings from '@/assets/json-data/settings.json'

  // Import Controller
  let KernelController = require('.///controllers/kernelController')
  let HclController = require('.///controllers/hclController')
  let YasController = require('.///controllers/yasController')
  let SimulatorController = require('.///controllers/simulatorController')

  let kernelController = new KernelController.KernelController()
  let hclController = new HclController.HclController(kernelController)
  let yasController = new YasController.YasController(kernelController)
  let simulatorController = new SimulatorController.SimulatorController(kernelController)

  export default {
    name: 'App',
    data () {
      return {
        settings,
        strings: {},
        hclController : hclController,
        kernelController : kernelController,
        yasController : yasController,
        simController: simulatorController
      }
    },
    components: {
      Header,
      PromptDialog,
      Tabs
    },
    computed: {
      currentKernel () {
        return settings.current.kernel
      },
      currentLanguage () {
        return settings.current.language
      },
      currentThemeFile () {
        return 'css/themes/' + settings.themes[settings.current.theme].filename
      }
    },
    methods: {
      isCurrentTab (tabName) {
        return this.$refs.Tabs.isCurrentTab(tabName)
      },
      getKernelDefault (type) {
        let kernelName = this.settings.kernels[this.currentKernel]
        if (type.localeCompare('instructionSet') === 0) {
          return require(`@/assets/per-kernel-defaults/${kernelName}/${type}.json`)
        } else {
          return require(`@/assets/per-kernel-defaults/${kernelName}/${type}.txt`).default
        }
      },
      getLanguageStrings (filename) {
        return require(`@/assets/json-data/strings/${filename}`)
      },
      getJsonInstructionSet () {
        return this.$refs.Tabs.getJsonInstructionSet()
      },
      setJsonInstructionSet (jsonFile) {
        this.$refs.Tabs.setJsonInstructionSet(jsonFile)
      },
      getHclCode () {
        return this.$refs.Tabs.getHclCode()
      },
      setHclCode (code) {
        this.$refs.Tabs.setHclCode(code)
      },
      getY86Code () {
        return this.$refs.Tabs.getY86Code()
      },
      setY86Code (code) {
        this.$refs.Tabs.setY86Code(code)
      },
      showPromptDialog (type, message, detail) {
        this.$refs.PromptDialog.show(type, message, detail)
      },
      updateKernel (newKernel) {
        this.kernelController.useKernel(settings.kernels[newKernel])
        this.setHclCode(this.getKernelDefault('hcl'))
        this.$refs.Tabs.changeDefaultInstructionSet(this.getKernelDefault('instructionSet'))
        this.setY86Code(this.getKernelDefault('y86'))
      },
      updateCurrentTab (newCurrentTab) {
        this.settings.current.tab = newCurrentTab
      },
      initObjCode (compilationResult) {
        this.$refs.Tabs.initObjCode(compilationResult)
      },
      updateObjCode (newValue) {
        this.$refs.Tabs.updateObjCode(newValue)
      },
      updateCpuState(newValue) {
        this.$refs.Tabs.updateCpuState(newValue)
      },
      updateRegisters(newValue) {
        this.$refs.Tabs.updateRegisters(newValue)
      },
      updateFlags(newValue) {
        this.$refs.Tabs.updateFlags(newValue)
      },
      updateStatus(newValue) {
        this.$refs.Tabs.updateStatus(newValue)
      },
      updateMemory(newValue) {
        this.$refs.Tabs.updateMemory(newValue)
      }
    },
    created () {
      settings.kernels = this.kernelController.getAvailableKernelNames()
      // Load all the languages
      for (let i = 0; i < settings.languages.length; i++) {
        settings.languages[i].strings = this.getLanguageStrings(settings.languages[i].filename)
      }
      // Load the current language in the app
      this.strings = settings.languages[settings.current.language].strings
      document.title = this.strings.documentTitle
    },
    mounted () {
      this.updateKernel(0)
    },
    watch: {
      currentKernel (newKernel) {
        this.updateKernel(newKernel)
      },
      currentLanguage (newLanguage) {
        this.strings = settings.languages[newLanguage].strings
        document.title = this.strings.documentTitle
      }
    }
  }
</script>

<style>
  #app {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--pane-background);
    color: var(--pane-foreground);
  }
</style>
