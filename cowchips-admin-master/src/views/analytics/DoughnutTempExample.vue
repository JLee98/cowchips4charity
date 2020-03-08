<!--INCLUDED GRAPH VUES MUST BE NAMED USING PascalCase-->

<script>
// STEP 1: to include the dependencies
import Vue from 'vue';
import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import Doughnut2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

Vue.use(VueFusionCharts, FusionCharts, Doughnut2D, FusionTheme);


// STEP 3: Configure your chart

  const dataSource = {
      chart: {
        caption: "Split of Revenue by Product Categories",
        subCaption: "Last year",
        numberPrefix: "$",
        bgColor: "#ffffff",
        startingAngle: "310",
        showLegend: "1",
        defaultCenterLabel: "Total revenue: $64.08K",
        centerLabel: "Revenue from $label: $value",
        centerLabelBold: "1",
        showTooltip: "0",
        decimals: "0",
        theme: "fusion"
      },
      data: [{
          label: "Food",
          value: "28504"
        },
        {
          label: "Apparels",
          value: "14633"
        },
        {
          label: "Electronics",
          value: "10507"
        },
        {
          label: "Household",
          value: "4910"
        }
      ]
    }

export default {
  name: 'app',
  data() {
    return {
      "type": "doughnut2d",
      "renderAt": "chart-container",
      "width": "750",
      "height": "550",
      "dataFormat": "json",
      dataSource
    }
  }
}
</script>


//STEP 4: Render the chart
<template>
  <div id="app">
    <div id="chart-container">
      <fusioncharts :type="type"
                    :width="width"
                    :height="height"
                    :dataformat="dataFormat"
                    :dataSource="dataSource">
      </fusioncharts>
    </div>
  </div>
</template>

