<template>
  <div>
    <span>{{ totalMoney }}</span>

    <!-- test url to inject:
    http://localhost:8080/games/analytics/5c7c4a32c0cdf2591d1b4b59
    -->
    <doughnut-example :chart-data="datacollection3" chartId="card-chart-01" class="chart-wrapper px-3" style="height:200px;" :height="70" />

  </div>
</template>

<script>
  import DudTempExample from '../analytics/DudTempExample'
  import DoughnutExample from '../analytics/DoughnutExample'
  import axios from "axios";
  import Vue from 'vue';

  import io from 'socket.io-client'
  var socket = io.connect('http://localhost:5555') //TODO: what port?
  var totalMoney = 0;
  var totalDonations = 0;
  var maxDonation = 0;
  var orgDonations = new Map();
  var keys = [];
  var values = [];

  console.log(keys)

  export default {
    name: 'gameAnalytics',
    components: {
      DudTempExample,
      DoughnutExample
    },
    created() {
      this.inspectUpdate()
    },
    data() {
      return {
        datacollection1: null,
        datacollection2: null,
        datacollection3: null,
        totalMoney: 0,
        totalDonation: 0,
        maxDonation: 0,
        orgDonations: null,
        keys: null,
        values: null
      }
    },

    methods: {

      dudsSuperUpdater() {

        this.datacollection3 = {
        //fill with live data
          labels: this.keys,
          datasets: [
            {
              backgroundColor: ['#FF0000', '#fff000', '#000fff'],
              data: this.values
            }
          ]


        }

      }, //dudsSuperUpdater


      inspectUpdate() {
        socket.on("updateAvailable", (updateData) => {
          if (updateData.gameId.toString() == this.getId().toString()) {
            //TODO: accept update

            this.getDonations(updateData.gameId).then((donations) => {
              this.analyzeDonations(donations);
              this.dudsSuperUpdater();
            })

            // var analytics = this.analyzeDonations(donations)
            //this.fillData(analytics)
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

      analyzeDonations(donations) {
        this.totalMoney = 0;
        this.totalDonations = donations.length;
        this.orgDonations = new Map();
        for(var i in donations) {
          var curDonation = donations[i];
          var orgID = curDonation.organizationID;

          // get total donation money
          this.totalMoney += curDonation.amount/100;

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
        this.getKeys();
        this.getValues();
      },
      getKeys() {
        this.keys = Array.from(this.orgDonations.keys());
      },
      getValues() {
        this.values = Array.from(this.orgDonations.values());
      },

      fillData(analytics) {
        //TODO: have this set all the charts based on the data from input analytics
      },
      onStart() {
        var tempId = this.getId();
        this.orgDonations = new Map();
        this.keys = [];
        this.values = [];
        this.getDonations(tempId).then((donations) => {
          this.analyzeDonations(donations);
          this.dudsSuperUpdater();
        })
      }

    }, //methods

    beforeMount() {
      this.onStart();
    }
  }

</script>
