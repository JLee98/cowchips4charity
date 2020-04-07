<template>
  <div>

    <div class="date-filter-container">
      <div class="cowHeadDark">Filter by dates:</div>&nbsp
      <date-picker class="cowTime" name="startDate" v-model="filterStartDate" :config="datePickerOptions" v-on:input="performDonationUpdate()" placeholder="Start date"></date-picker>
      <date-picker class="cowTime" name="endDate" v-model="filterEndDate" :config="datePickerOptions" v-on:input="performDonationUpdate()" placeholder="End date"></date-picker>
    </div>
      </br>
    <span class="cowHeadDark">Total Money Donated: </span>
    <span class="cowHeadLight">${{ totalMoney }}</span>
      </br>
      </br>
    <span class="cowHeadDark">Highest Donation: </span>
    <span class="cowHeadLight">${{ maxDonation }}</span>
      </br>
      </br>
    <span class="cowHeadDark">Total People Donated: </span>
    <span class="cowHeadLight">{{ totalDonations }}</span>
      </br>
      </br>
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
          format: 'YYYY-MM-DD',
          useCurrent: false,
          showClear: true,
          showClose: true,
        },
        filterStartDate: null,
        filterEndDate: null
      }
    },

    methods: {

      performDonationUpdate() {
        this.getDonations(this.getId()).then((donations) => {
          donations = this.filterDonationsByDates(donations, this.filterStartDate, this.filterEndDate)
          this.analyzeDonations(donations);
          this.updateChart();
        })
      },

      updateChart() {
        this.datacollection3 = {
          labels: this.keys,
          datasets: [
            {
              /* Light Blue, Dark Gray, Light Gray: on Admin Pannel */
              backgroundColor: ['#20A8D8', '#2F353A', '#E9ECEF'], 
              data: this.values
            }
          ]
        }
      },

      inspectUpdate() {
        socket.on("updateAvailable", (updateData) => {
          if (updateData.gameId.toString() == this.getId().toString()) {
            this.performDonationUpdate()
          }
        })
      },

      getId() {
        return this.$route.params.id
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

        // force an update when this method is called with no donations
        if (donations.length == 0) {
          this.maxDonation = 0;
        }
      },

      getKeys() {
        this.keys = Array.from(this.orgDonations.keys());
      },

      getValues() {
        this.values = Array.from(this.orgDonations.values());
      },

      onStart() {
        this.orgDonations = new Map();
        this.keys = [];
        this.values = [];
        this.performDonationUpdate()
      },

      filterDonationsByDates(donations, startDateString, endDateString) {
        var filteredByStart = []
        var filtered = []

        if (startDateString) {
          var startDate = new Date(startDateString)
          filteredByStart = donations.filter((donation) => {
            var date = new Date(donation.date)
            return (date > startDate)
          })
        }
        else {
          filteredByStart = donations
        }

        if (endDateString) {
          var endDate = new Date(endDateString)
          filtered = filteredByStart.filter((donation) => {
            var date = new Date(donation.date)
            return (date < endDate)
          })
        }
        else {
          filtered = filteredByStart
        }

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
    display: inline-block;
    width: 25%
  }

  .date-filter-container div {
    display: inline-block;
  }

  .cowHeadLight {
  background-color: #20A8D8; /* Light Blue on Admin Panel */
  border: none;
  color: #E9ECEF;           /* Light Gray on Admin Panel */
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  border-radius: 1.5px;
}
.cowHeadDark {
  background-color: #20A8D8; /* Light Blue on Admin Panel */
  border: none;
  color: #2F353A;             /* Dark Gray on Admin Panel */
  padding: 5px 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  border-radius: 1.5px;
}
.cowTime {
  background-color: #E9ECEF;  /* Light Gray on Admin Panel */
  color: #2F353A;             /* Dark Gray on Admin Panel */
  border: 2px solid #20A8D8;  /* Light Blue on Admin Panel */
  padding: 5px 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
}
</style>
