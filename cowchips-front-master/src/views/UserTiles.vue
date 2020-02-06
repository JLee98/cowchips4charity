<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12 shadow">
                <v-toolbar dark color="#4B7634">
                  <v-toolbar-title>My Tiles</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <v-btn
                        icon
                        large
                        to="/account"
                        slot="activator"
                    >
                      <v-icon large>arrow_back</v-icon>
                    </v-btn>
                  </v-tooltip>
                </v-toolbar>
                <v-card-text>
                  <template v-for="donation in donations">
                    <game-history :key="donation.gameID.id" :date="donation.date" :tiles="donation.tiles" :amount="donation.amount" :winning-tile="donation.gameID.winningTile"></game-history>
                  </template>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import GameHistory from '@/components/GameHistory'
  import axios from 'axios'

  export default {
    name: 'UserTiles',
    components: {
      GameHistory
    },
    created() {
      axios.get('/account/tiles')
        .then(res => {
          this.donations = res.data
          this.donations = this.donations.sort((donation1, donation2) => {
            if(donation1.date > donation2.date)
              return -1
            if(donation1.date < donation2.date)
              return 1
            else
              return 0
          })
        })
        .catch(err => {
          console.log(err)
          console.log(err.response)
        })

      // this.donations = [
      //   {
      //     date: new Date('2019-04-09 19:00:08.814Z'),
      //     tiles: [1,2,3,4,5,6,7,8,9,10,11],
      //     amount: 8000,
      //     gameID: {
      //       id: "5c7c4052a4681530547c4027",
      //       winningTile: 1
      //     }
      //   },
      //   {
      //     date: new Date('2019-04-07 19:00:08.814Z'),
      //     tiles: [21,22,23],
      //     amount: 400,
      //     gameID: {
      //       id: "5c7c4052a4681530547c4025",
      //       winningTile: 23
      //     }
      //   },
      //   {
      //     date: new Date('2019-04-08 19:00:08.814Z'),
      //     tiles: [10,11,12],
      //     amount: 6000,
      //     gameID: {
      //       id: "5c7c4052a4681530547c4026",
      //       winningTile: 2
      //     }
      //   }
      // ]
    },
    data() {
      return {
        donations: []
      }
    }
  }
</script>

<style scoped>

</style>
