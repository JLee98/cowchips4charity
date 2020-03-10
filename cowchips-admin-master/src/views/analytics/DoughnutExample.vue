<!-- Doughnut Graph Example-->
<script>
import { Doughnut, mixins } from 'vue-chartjs'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'
const { reactiveProp } = mixins

const options = {
  responsive: true, 
  maintainAspectRatio: false, 
  animation: {
    animateRotate: false
  },
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
 
}

  export default {
    extends: Doughnut,
    mixins: [reactiveProp],
    props: ['chartData', 'options'],



    methods: {
      update() {
        this.$data._chart.update()
      }
    },



    mounted() {
      this.renderChart(

        {

          labels: ['ISU', 'Iowa'],
          datasets: [
            {
              backgroundColor: ['#FF0000', '#fff000'],
              data: [1, 1]
            }
          ]
        }


        , options)
    }


};
</script>
