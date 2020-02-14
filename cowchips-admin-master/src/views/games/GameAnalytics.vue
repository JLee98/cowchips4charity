<template>
  <div>
    <p>GameAnalytics.vue yayy</p>
    <!-- test url to inject:
      http://localhost:8080/games/analytics/5c7c4a32c0cdf2591d1b4b59
      -->
    <card-line1-chart-example chartId="card-chart-01" class="chart-wrapper px-3" style="height:70px;" :height="70" />
  </div>
</template>

<script>
  import CardLine1ChartExample from '../dashboard/CardLine1ChartExample'

  export default {
    name: 'gameAnalytics',
    components: {
      CardLine1ChartExample,
    },
  }
</script>
