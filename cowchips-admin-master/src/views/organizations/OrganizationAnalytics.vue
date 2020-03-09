<template>
  <div>
    <p>OrganizationAnalytics.vue yay</p>
    <span> {{ totalMoney }} </span>
    <!-- test url to inject: http://localhost:8080/organizations/analytics/5c7c4a32c0cdf2591d1b4b48
      -->

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
      gameDonations: null
    }
  },
  methods: {
    inspectUpdate() {
      socket.on("updateAvailable", (updateData) => {

        if (updateData.orgId.toString() == this.getId().toString()) {
          this.getDonations(updateData.orgId).then((donations) => {
            this.analyzeDonations(donations);
          })

          // var analytics = this.analyzeDonations(donations)
          //this.fillData(analytics)
        }
      })
    },
    getId() { // TODO: fix this absolute hack
      var url = window.location.pathname
      return url.replace("/organizations/analytics/", "")
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
      var tempId = this.getId();
      this.gameDonations = new Map();
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
