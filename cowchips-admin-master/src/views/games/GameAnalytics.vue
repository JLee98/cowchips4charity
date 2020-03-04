<template>
  <div>
    <p>GameAnalytics.vue yayy</p>
    <span>{{ totalMoney }}</span>

    <!-- test url to inject:
    http://localhost:8080/games/analytics/5c7c4a32c0cdf2591d1b4b59
    -->
    <button @click="dudsSuperUpdater()">dudsSuperUpdater</button>
    <button @click="getDonations()">getDonations</button>
    <dud-temp-example :chart-data="datacollection1" chartId="card-chart-01" class="chart-wrapper px-3" style="height:200px;" :height="70" />
    <dud-temp-example :chart-data="datacollection2" chartId="card-chart-01" class="chart-wrapper px-3" style="height:200px;" :height="70" />

  </div>
</template>

<script>
  import DudTempExample from '../analytics/DudTempExample'
  import axios from "axios";
  import Vue from 'vue';

  import io from 'socket.io-client'
  var socket = io.connect('http://localhost:5555') //TODO: what port?
  var totalMoney = 0;
  var totalDonations = 0;
  var maxDonation = 0;
  var orgDonations = new Map();

  export default {
    name: 'gameAnalytics',
    components: {
      DudTempExample,
    },
    created() {
      this.inspectUpdate()
    },
    data() {
      return {
        datacollection1: null,
        datacollection2: null,
        totalMoney: 0,
        totalDonation: 0,
        maxDonation: 0,
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
      },
      inspectUpdate() {
        socket.on("updateAvailable", (updateData) => {
          if (updateData.gameId.toString() == this.getId().toString()) {
            //TODO: accept update
            this.getDonations(updateData.gameId).then((donations) => {
              this.analyzeDonations(donations);
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
      },
      fillData(analytics) {
        //TODO: have this set all the charts based on the data from input analytics
      },
      onStart() {
        var tempId = this.getId();
        this.orgDonations = new Map();
        this.getDonations(tempId).then((donations) => {
          this.analyzeDonations(donations);
        })
      }
    },
    beforeMount() {
      this.onStart();
    }
  }

</script>
