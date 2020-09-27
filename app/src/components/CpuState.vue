<template>
  <div class="component">
    <h1>{{ scopedStrings.title }}</h1>
    <div class="stage" v-for="stage in stages" :key="stage.id">
      <h2>{{ stage.name }}</h2>
      <div class="stage-indicators">
        <div class="Indicator" v-for="indicator in stage.indicators" :key="indicator.id">
          <div class="label">{{ indicator.name }}</div>
          <div class="value" v-if="indicator.value === undefined">
            {{ "---" }}
          </div>
          <div class="value" v-else>{{ indicator.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CpuState",
    props: {
      scopedStrings: {
        type: Object,
        required: true
      },
      initialValue: {
        required: true
      }
    },
    data() {
      return {
        stages: this.initialValue
      }
    },
    methods: {
      update (newStages) {
        this.stages = newStages;
      }
    }
  }
</script>

<style scoped>
  .stage-indicators {
    display: flex;
  }

  .Indicator {
    display: flex;
    padding-bottom: 8px;
    max-width: 450px;
  }
</style>
