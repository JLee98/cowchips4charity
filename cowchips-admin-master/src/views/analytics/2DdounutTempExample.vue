<!--INCLUDED GRAPH VUES MUST BE NAMED USING PascalCase-->

<script>
// STEP 1: to include the dependencies
import Vue from 'vue';
import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import Doughnut2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);

// STEP 2: Prepare the data
const chartData = [
    {
      label: "Iowa State",
      value: "290"
    },
    {
      label: "Iowa",
      value: "260"
    },
    {
      label: "Kansas",
      value: "180"
    },
    {
      label: "Kansas State",
      value: "140"
    },
    {
      label: "Michigan",
      value: "115"
    },
    {
      label: "UCLA",
      value: "100"
    },
    {
      label: "Standford",
      value: "30"
    },
    {
      label: "Hogwarts",
      value: "30"
    }
  ];

// STEP 3: Configure your chart
const dataSource = {
  chart: {
    caption: "Highest Total Donations",
    subcaption: "In Dollars",
    xaxisname: "School",
    yaxisname: "Dollars",
    numbersuffix: ".00",
    theme: "fusion"
  },
  data: chartData
  };

export default {
  name: 'app',
  data() {
    return {
      "type": "doughnut2D",
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

