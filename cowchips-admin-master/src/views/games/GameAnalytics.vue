<template>
  <div>
    <p>GameAnalytics.vue yayy</p>
    <!-- test url to inject:
    http://localhost:8080/games/analytics/5c7c4a32c0cdf2591d1b4b59
    -->
    <button @click="dudsSuperUpdater()">dudsSuperUpdater</button>
    <dud-temp-example :chart-data="datacollection1" chartId="card-chart-01" class="chart-wrapper px-3" style="height:200px;" :height="70" />
    <dud-temp-example :chart-data="datacollection2" chartId="card-chart-01" class="chart-wrapper px-3" style="height:200px;" :height="70" />
    <bui-temp-example :chart-data="datacollection3" chartId="card-chart-01" class="chart-wrapper px-3" style="height:300px;" :height="80" />
  </div>
</template>

<script>
  import DudTempExample from '../analytics/DudTempExample'
  import BuiTempExample from '../analytics/BuiTempExample'

  export default {
    name: 'gameAnalytics',
    components: {
      DudTempExample,
      BuiTempExample
    },
    data() {
      return {
        datacollection1: null,
        datacollection2: null,
        datacollaction3: null
      }
    },
    methods: {
      dudsSuperUpdater() {

        this.datacollection1 = {
          labels: ['Cake Present', 'Cake Required'],
          datasets: [
            {
              label: 'Cakes',
              backgroundColor: '#f87979',
              data: [40, 300]
            }
          ]
        }

        this.datacollection2 = {
          labels: ['Cake Present', 'Cake Required'],
          datasets: [
            {
              label: 'Cakes',
              backgroundColor: '#f87979',
              data: [45, 350]
            }
          ]
        }

          this.datacollection3 = {
          labels: ['Total People', 'Total Dollars'],
          datasets: [
            {
              label: 'Donations',
              backgroundColor: '#0000FF',
              data: [69, 100]
            }
          ]
        }

      }

    }

  }</script>
