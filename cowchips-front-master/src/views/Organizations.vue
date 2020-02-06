<template>
  <div class="background">
    <h1>Select an Organization to Support</h1>
    <v-list>
      <template v-for="org in this.organizations">
        <v-list-tile
            @click="handleTeamSelection(org.id)"
            :key="org.id"
        >
          <v-list-tile-content>{{org.name}}</v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </div>
</template>

<script>
  import axios from 'axios'
  import localStorageNames from '@/config/localStorageNames'

  export default {
    name: 'Organizations',
    created() {
      this.getOrganizations()
    },
    data() {
      return {
        organizations: []
      }
    },
    methods: {
      getOrganizations() {
        axios.get('/game/active?populate=true')
          .then(res => {
            const games = res.data
            games.forEach(game => {
              game.organizations.forEach(org => {
                org.gameId = game._id
                org.id = org._id
                this.organizations.push(org)
              })
            })
          })
      },
      handleTeamSelection(id) {
        console.log('handleTeamSelection: ' + id)
        const orgRecord = this.organizations.find((org) => org.id === id)
        this.$localStorage.set(localStorageNames.gameId, orgRecord.gameId)
        this.$localStorage.set(localStorageNames.orgId, id)
        this.$emit('next')
      }
    },
  }
</script>

<style scoped>

h1 {
  padding-top: 15px;
  padding-left: 10px;
  text-align: center;
  color: white;
}

.background {
  background-image: url("../assets/grass_background.jpg");
}

.v-list__tile__content {
width: 30%;
border-radius: 15px;
padding-left: 5px;
text-align: center;
font-size: 22px;
color: white;
background-color: #4e3b25;
border-style: solid;
border-width: 2px;
border-color: black;
overflow-x: hidden;
}

</style>
