<!--INCLUDED GRAPH VUES MUST BE NAMED USING PascalCase-->

<script>
// STEP 1: to include the dependencies
import Vue from 'vue';
import axios from "axios";
import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import Doughnut2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

Vue.use(VueFusionCharts, FusionCharts, Doughnut2D, FusionTheme);


// STEP 3: Configure your chart

  
    const dataSource = {
      chart: {
        caption: "Iowa State vs Iowa: 10/11/2020",
        subCaption: "Total in Dollars",
        numberPrefix: "$",
        bgColor: "#ffffff",
        startingAngle: "310",
        showLegend: "1",
        defaultCenterLabel: "ISU v IOWA Total: $64.08K",
        centerLabel: "Revenue from $label: $value",
        centerLabelBold: "1",
        showTooltip: "0",
        decimals: "0",
        theme: "fusion"
      },
      data: [{
        label: "ISU",
        value: "28504"
      },
      {
        label: "Iowa",
        value: "14633"
      },
      ]
    }
   
  

export default {
  name: 'doughnut',

  data() {
    return {
      "type": "doughnut2d",
      "renderAt": "chart-container",
      "width": "550",
      "height": "550",
      "dataFormat": "json",
      dataSource
    };
  }
}
</script>


//STEP 4: Render the chart
<template>
  <div id="doughnut">
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

