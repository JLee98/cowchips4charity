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

  </br>


    <doughnut-example :chart-data="datacollection3" chartId="card-chart-01" class="chart-wrapper px-3" style="height:200px;" :height="70" />
    <div v-if="winnerChosen">
      <h1>Winners</h1>
      <b-table striped hover :items="winnersInfo" :fields="fields"></b-table>
    </div>
  </div>
</template>

<script>
  import DoughnutExample from '../analytics/DoughnutExample'
  import axios from "axios";
  import Vue from 'vue';

  import io from 'socket.io-client'
  var socket = io.connect(process.env.VUE_APP_WEBSOCKET_URL)


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
        winnerCount: 0,
        winnerChosen: false,
        fields:['Name', 'Organization', 'Email'],
        winnersInfo: [{}],
        winners: 0,
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
          this.getGameWinners();
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

      getOrganizationName(orgId) {
        return new Promise((resolve, reject) => {
          axios.get(`organization/${orgId}`)
          .then(res => {
            var orgName = res.data;
            return resolve(orgName);
          })
        })
      },

      getKeys() {
        var orgNames = [];
        var mapToOrgArr = Array.from(this.orgDonations.keys());
        for(var curIndex in mapToOrgArr) {
          this.getOrganizationName(mapToOrgArr[curIndex]).then((orgObject) => {
            orgNames.push(orgObject.name);
          })
        }
        this.keys = orgNames;
      },

      getValues() {
        this.values = Array.from(this.orgDonations.values());
      },

      onStart() {
        this.orgDonations = new Map();
        this.keys = [];
        this.values = [];
        this.performDonationUpdate()
        this.getGameWinners();
      },

      getGameWinners() {
        var curGameId = this.getId();
        axios.get('/admin/games/' + curGameId + '/winners')
          .then(res => {
            var winningTiles = res.data
            var winningUsers= new Map();
            for(var i in winningTiles) {
              var curWinner = winningTiles[i];
              var userInfo = new Map();
              if(!winningUsers.has(curWinner.userID.name)) {
                userInfo.set("email", curWinner.userID.email);
                userInfo.set("organization", curWinner.organizationID.name);
                winningUsers.set(curWinner.userID.name, userInfo);
              }
            }
            this.winners = winningUsers
            this.updateWinners()
          })
      },

      updateWinners() {
        this.winnersInfo = [];
        this.winnerChosen = true;
        for(let [k, v] of this.winners) {
          var curName = k;
          var curEmail = v.get("email");
          var curOrg = v.get("organization");
          var curObject = {"Name": curName, "Organization": curOrg, "Email": curEmail};
          this.winnersInfo.push(curObject)
        }
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
