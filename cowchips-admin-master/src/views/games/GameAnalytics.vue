<template>
  <div>

    <div class="date-filter-container">
      <date-picker name="startDate" v-model="filterStartDate" :config="datePickerOptions" placeholder="Start date"></date-picker>
      <date-picker name="endDate" v-model="filterEndDate" :config="datePickerOptions" placeholder="End date"></date-picker>
    </div>

   

    <span>Total Money: $</span>
    <span>{{ totalMoney }}</span>
    </br>
    <span>Max Donation: $</span>
    <span>{{ maxDonation }}</span>
    </br>
    <span>Total People Donated: </span>
    <span>{{ totalDonations }}</span>

    <!-- test url to inject:
  http://localhost:8080/games/analytics/5c7c4a32c0cdf2591d1b4b59
  -->
    <doughnut-example :chart-data="datacollection3" chartId="card-chart-01" class="chart-wrapper px-3" style="height:200px;" :height="70" />

  </div>
</template>

<script>
  import DoughnutExample from '../analytics/DoughnutExample'
  import axios from "axios";
  import Vue from 'vue';

  import io from 'socket.io-client'
  var socket = io.connect('http://localhost:5555') //TODO: what port?


  export default {
    name: 'gameAnalytics',
    components: {
      DoughnutExample
    },
    created() {
      this.inspectUpdate()
    },
    data() {
      return {
        datacollection3: null,
        totalMoney: 0,
        totalDonations: 0,
        maxDonation: 0,
        orgDonations: null,
        keys: null,
        values: null,
        datePickerOptions: {
          format: 'YYYY-MM-DD hh:mm:ss',
          useCurrent: false,
          showClear: true,
          showClose: true,
        },
        filterStartDate: null
      }
    },

    methods: {

      updateChart() {
        this.datacollection3 = {
          labels: this.keys,
          datasets: [
            {
              backgroundColor: ['#FF0000', '#fff000', '#000fff'],
              data: this.values
            }
          ]
        }
      },

      inspectUpdate() {
        socket.on("updateAvailable", (updateData) => {
          if (updateData.gameId.toString() == this.getId().toString()) {

            this.getDonations(updateData.gameId).then((donations) => {
              this.analyzeDonations(donations);
              this.updateChart();
            })
          }
        })
      },

      getId() { // TODO: Fix bad practice hack
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

      onStart() {
        var tempId = this.getId();
        this.orgDonations = new Map();
        this.keys = [];
        this.values = [];
        this.getDonations(tempId).then((donations) => {
          this.analyzeDonations(donations);
          this.updateChart();
        })
      },

      filterDonationsByDates(donations, startDate, endDate) {
        var filtered = donations.filter((donation) => {
          var date = new Date(donation.date)
          return (date > startDate) && (date < endDate)
        })
        return filtered
      },

    }, //methods

    beforeMount() {
      this.onStart();
    }
  }

</script>

<style scoped>
  .date-filter-container {
    position: relative;
  }

  .date-filter-container input {
    display: inline-block; width: 25%
  }

</style>
