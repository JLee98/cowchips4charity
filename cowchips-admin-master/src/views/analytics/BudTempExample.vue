<!--INCLUDED GRAPH VUES MUST BE NAMED USING PascalCase-->

<script>
import { Bar, mixins } from 'vue-chartjs'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'
const { reactiveProp } = mixins


export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['chartData','options'],

  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(
      {
        labels: ['Bui Present', 'Bui Required'],
        datasets: [
          {
            label: 'Bui',
            backgroundColor: '#0000ff',
            data: [40, 200]
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          enabled: false,
          custom: CustomTooltips,
          intersect: true,
          mode: 'index',
          position: 'nearest',
          callbacks: {
            labelColor: function (tooltipItem, chart) {
              return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].backgroundColor }
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 250,
              stepSize: 10
            }
          }]
        }
      },
    )
  },
}
</script>
