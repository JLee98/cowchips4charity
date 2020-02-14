<script>
import { Bar } from 'vue-chartjs'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'

export default {
  extends: Bar,
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(
      {
        labels: ['Cake Present', 'Cake Required'],
        datasets: [
          {
            label: 'Cakes',
            backgroundColor: '#f87979',
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

  function incrementRequired() {

  }

</script>
