<template>
  <div>

    <div class="date-filter-container">
      <div class="headingDark">Filter by dates:</div>&nbsp 
      <date-picker class="datePicker" name="startDate" v-model="filterStartDate" :config="datePickerOptions" v-on:input="performDonationUpdate()" placeholder="Start date"></date-picker>
      <date-picker class="datePicker" name="endDate" v-model="filterEndDate" :config="datePickerOptions" v-on:input="performDonationUpdate()" placeholder="End date"></date-picker>
    </div>
   
    </br>

    <div>
     <b-card-group deck>
        <b-card
          border-variant="primary"
          header="Total Money Donated"
          header-bg-variant="primary"
          header-text-variant="white"
          align="center"
          style="max-width: 400px; font-size: 24px;"

         >
        <b-card-text>${{ totalMoney }}</b-card-text>
        </b-card>

        <b-card
          border-variant="warning"
          header="Highest Donation"
          header-bg-variant="warning"
          header-text-variant="white"
          align="center"
          style="max-width: 400px; font-size: 24px;"
        >
          <b-card-text>${{ maxDonation }}</b-card-text>
        </b-card>

        <b-card
          border-variant="danger"
          header="Total People Donated"
          header-bg-variant="danger"
          header-text-variant="white"
          align="center"
          style="max-width: 400px; font-size: 24px;"
        >
          <b-card-text>{{ totalDonations }}</b-card-text>
        </b-card>
     </b-card-group>
    </div>


  </div>
</template>
<script>

import axios from "axios";
import Vue from 'vue';

import io from 'socket.io-client'
var socket = io.connect('http://localhost:5555') //TODO: what port?
var totalMoney = 0;
var maxDonation = 0;
var totalDonations = 0;
var gameDonations = new Map();

export default {
  name: 'organizationAnalytics',
  created() {
    this.inspectUpdate()
  },
  data() {
    return {
      totalMoney: 0,
      totalDonations: 0,
      maxDonation: 0,
      gameDonations: null,
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
      })
    },
    inspectUpdate() {
      socket.on("updateAvailable", (updateData) => {
        if (updateData.orgId.toString() == this.getId().toString()) {
          this.performDonationUpdate()
        }
      })
    },
    getId() { 
      return this.$route.params.id
    },
    getDonations(orgId) {
      return new Promise((resolve, reject) => {
        axios.get(`donation/org/${orgId}`)
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
        var gameID = curDonation.gameID;

        // get total donation money
        this.totalMoney += curDonation.amount/100;

        // donation amount per game
        if(!this.gameDonations.has(gameID)) {
          this.gameDonations.set(gameID, curDonation.amount/100);
        }
        else {
          var curAmount = this.gameDonations.get(gameID);
          this.gameDonations.set(gameID, curAmount+(curDonation.amount/100));
        }

        // Max Donation of Org
        if(curDonation.amount/100 > this.maxDonation) {
          this.maxDonation = curDonation.amount/100;
        }
      }
    },
    fillData(analytics) {
      //TODO: have this set all the charts based on the data from input analytics
    },
    onStart() {
      this.gameDonations = new Map();
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
  },
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

 

/*Dark Gray Font & Light Blue background*/
.headingDark {
  border: none;
  border-radius: 1.5px;
  color: #2F353A;             /* Dark Gray on Admin Panel */
  display: inline-block;
  font-size: 30px;
  padding: 5px 5px;
  text-align: center;
  text-decoration: none;
}

/*Dark Gray Font & Light Blue Border $ "No" background*/
.datePicker {
  background-color: #E9ECEF;  /* Light Gray on Admin Panel */
  border: 2px solid #20A8D8;  /* Light Blue on Admin Panel */
  color: #2F353A;             /* Dark Gray on Admin Panel */
  display: inline-block;
  font-size: 30px;
  padding: 5px 5px;
  text-align: center;
  text-decoration: none;
}
</style>
