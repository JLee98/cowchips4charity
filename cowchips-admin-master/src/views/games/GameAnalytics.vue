<template>
  <div>
    <p>GameAnalytics.vue yayy</p>
    
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

  import io from 'socket.io-client'
  var socket = io.connect('http://localhost:5000') //TODO: what port?

  export default {
    name: 'gameAnalytics',
    components: {
      DudTempExample,
    },
    data() {
      return {
        datacollection1: null,
        datacollection2: null
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
              data: [40, 300]
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
          if (updateData.gameId.toString() == getId().toString) {
            //TODO: accept update
            var donations = this.getDonations
            console.log(donations)

            //var analytics = this.analyzeDonations(donations)
            //this.fillData(analytics)
          }
        })
      },
      getId() { // TODO: fix this absolute hack
        var url = window.location.pathname
        return url.replace("/games/analytics/", "")
      },
      getDonations() {
        //TODO: sent filter parameter instead of doing it client side
        //TODO: this may need to return a promise since it uses a .then
        axios.get('/admin/donations')
          .then(res => {
            var donations = res.data
            donations = donations.filter(donation => {
              return donation.gameID == this.getId()
            })
            console.log(donations)
            return donations
          })
      },
      analyzeDonations(donations) {
        //TODO: have this preform analytics
        // like count how many per donations per team, biggest donation, etc.
        // then put it in an object to return
        // ex {DonationsTeam1: 33, DonationsTeam2: 45, BiggestDonation: 8800, ...}
      },
      fillData(analytics) {
        //TODO: have this set all the charts based on the data from input analytics
      }
    }
  }
  
</script>
