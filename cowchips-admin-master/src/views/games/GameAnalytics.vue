<template>
  <div>
    <p>GameAnalytics.vue yayy</p>
    <span>{{ totalMoney }}</span>

    <!-- test url to inject:
  http://localhost:8080/games/analytics/5c7c4a32c0cdf2591d1b4b59
  -->
    <button @click="dudsSuperUpdater()">dudsSuperUpdater</button>
    <button @click="getDonations()">getDonations</button>
    <h1>{{ maxDonation }}</h1>
    <dud-temp-example :chart-data="datacollection5" chartId="card-chart-01" class="chart-wrapper px-3" style="height: 200px;" :height="70" />
    <doughnut-temp-example :dataSource="datacollection5"/>
 
    <br> </br>
    <br> </br>
    <br> </br>
    <br> </br>
     <br> </br>
     <br> </br>
     <br> </br>
     <br> </br>
     <br> </br>
     <br> </br>

    <bui-temp-example :chart-data="datacollection4" chartId="card-chart-01" class="chart-wrapper px-3" style="height: 200px;" :height="70" />
    

  </div>
</template>

<script>
  import DudTempExample from '../analytics/DudTempExample';
  import BudTempExample from '../analytics/BudTempExample';
  import BuiTempExample from '../analytics/BuiTempExample';
  import DoughnutTempExample from '../analytics/DoughnutTempExample';

  import axios from "axios";
  import Vue from 'vue';

  //imports for BuiTempExample
  import VueFusionCharts from 'vue-fusioncharts';
  import FusionCharts from 'fusioncharts';
  import Column2D from 'fusioncharts/fusioncharts.charts';
  import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

  //imoprt for Doughnut2D chart
  import Doughnut2D from 'fusioncharts/fusioncharts.charts';

  Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);
  Vue.use(VueFusionCharts, FusionCharts, Doughnut2D, FusionTheme);

  import io from 'socket.io-client'
  var socket = io.connect('http://localhost:5555') //TODO: what port?
  var totalMoney = 0;
  var maxDonation = 0;
  var orgDonations = new Map();

  export default {
    name: 'gameAnalytics',
    components: {
      DudTempExample,
      BudTempExample,
      BuiTempExample,
      DoughnutTempExample
    },
    created() {
      this.inspectUpdate()
      //this.getRealTimeData()
    },
    data() {
      return {
        datacollection1: null,
        datacollection3: null,
        datacollection4: null,
        datacollection5: null,
        totalMoney: 0,
        maxDonation: 5,
        orgDonations: null
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
              data: [100, 300]
            }
          ]
        }


        this.datacollection3 = {
          labels: ['Cake Present', 'Cake Required'],
          datasets: [
            {
              label: 'Cakes',
              backgroundColor: '#f87979',
              data: [45, 350]
            }
          ]
        }

        //BuiTempExample Data
        this.datacollection4 = {
          datasets: [
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
          ],
        }

        //DoughnutTempExmaple
        this.datacollection5 = {
          chart: {
          caption: "Ioba State vs Iowa: 10/11/2020",
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
          data: [
            {
            label: "ISb",
            value: "28504"
            },
            {
            label: "Iowa",
            value: "14633"
            }, 
          ]
        }
       
      this.maxDonation = this.maxDonation + 1;
      },

      inspectUpdate() {
        socket.on("updateAvailable", (updateData) => {
          if (updateData.gameId.toString() == this.getId().toString()) {
            //TODO: accept update
            this.getDonations(updateData.gameId).then((donations) => {
              this.getDonationAmount(donations);
              this.analyzeDonations(donations);
            })

            //undid comment for live data doughnut
           // var analytics = this.analyzeDonations(donations)
           // this.fillData(analytics)
          }
        })
      },

      getId() { // TODO: fix this absolute hack
        var url = window.location.pathname
        return url.replace("/games/analytics/", "")
      },

      getDonations(gameId) {
        return new Promise((resolve, reject) => {
          axios.get(`donation/game/${gameId}`)
            .then(res => {
              var donations = res.data
              return resolve(donations)
            })
        })
      },

      getDonationAmount(donations) {
        this.totalMoney = 0;
        for(var i in donations) {
          this.totalMoney += donations[i].amount/100;
        }
      },

      analyzeDonations(donations) {
        for(var i in donations) {
          var curDonation = donations[i];
          var orgID = curDonation.organizationID;

          // donation amount per team

          if(!this.orgDonations.has(orgID)) {
            this.orgDonations.set(orgID, curDonation.amount/100);
          }
          else {
            var curAmount = this.orgDonations.get(orgID);
            this.orgDonations.set(orgID, curAmount+(curDonation.amount/100));
          }

          // Max Donation of Game
          if(curDonation.amount/100 > this.maxDonation) {
            this.maxDonation = curDonation.amount/100;
          }
        }
      },

      fillData(analytics) {
        //TODO: have this set all the charts based on the data from input analytics
        


      },

      onStart() {
        var tempId = this.getId();
        this.orgDonations = new Map();
        this.getDonations(tempId).then((donations) => {
          this.getDonationAmount(donations);
          this.analyzeDonations(donations);
        })
      }
    },
    beforeMount() {
      this.onStart();
    }
  }</script>
