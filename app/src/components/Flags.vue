<template>
  <div class="component" >
    <h2>{{ scopedStrings.title }}</h2>
    <table class="flags">
      <tr class="flag" v-for="flag in flags" :key="flag.id">
        <td class="label">{{ flag.name }}</td>
        <td class="value">{{ flag.value }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    props: {
      scopedStrings: {
        type: Object,
        required: true
      },
      initialValue: {
        required: true
      }
    },
    data () {
      return {
        flags: this.initialValue
      }
    },
    methods: {
      update (newValue) {
        this.flags = newValue
      }
    }
  }
</script>

<style scoped>
  .component table {
    border-collapse: collapse;
  }
</style>
