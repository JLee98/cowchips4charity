<template>
  <div>
    <p>GameAnalytics.vue yayy</p>
    <!-- test url to inject:
      http://localhost:8080/games/analytics/5c7c4a32c0cdf2591d1b4b59
      -->
    <button @click="dudTest()">dudTest</button>
    <dud-temp-example chartId="card-chart-01" class="chart-wrapper px-3" style="height:70px;" :height="70" />
  </div>
</template>

<script>
  import DudTempExample from '../analytics/DudTempExample'

  export default {
    name: 'gameAnalytics',
    components: {
      DudTempExample,
    },
    methods: {
      dudTest() {
        console.log('lmao')
      }
    }
  }
</script>
