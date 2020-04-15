<template>
  <div>
    <div class="sitemap-title">Sitemap</div>

    <div class="sitemap-section">
      <div class="sitemap-section-title">Users</div>
      <select class="sitemap-section-element-selector" @change="setCurUser(users.filter(user => user._id == $event.target.value)[0])">
        <option v-for="user in this.users" :value=user._id >{{ user.name }}</option>
      </select>
      <div class="sitemap-section-buttons-container">
        <button>tset</button>
        <button>tset</button>
        <button>tset</button>
      </div>
      <b-table striped hover :items="curUser" :fields="userFields"></b-table>
    </div>

  </div>

  
</template>

<script>
  import axios from "axios";

  export default {
    data: function() {
      return {
        users: [],
        games: [],
        orgs: [],
        donations: [],
        admins: [],
        curUser: [{}],
        userFields: ['Name', 'Email', 'Phone'],
      }
    },
    methods: {
      startHandler() {
        this.getUsers().then((users) => {
          this.users = users
          this.setCurUser(users[0])
        })
        this.getGames().then((games) => {
          this.games = games
        })
        this.getOrgs().then((orgs) => {
          this.orgs = orgs
        })
        this.getDonations().then((donations) => {
          this.donations = donations
        })
        this.getAdmins().then((admins) => {
          this.admins = admins
        })
      },
      getUsers() {
        return new Promise((resolve, reject) => {
          axios.get(`/admin/users`)
            .then(res => {
              var donations = res.data
              return resolve(donations)
            })
        })
      },
      getGames() {
        return new Promise((resolve, reject) => {
          axios.get(`/admin/games`)
            .then(res => {
              var games = res.data
              return resolve(games)
            })
        })
      },
      getDonations() {
        return new Promise((resolve, reject) => {
          axios.get(`/admin/donations`)
            .then(res => {
              var donations = res.data
              return resolve(donations)
            })
        })
      },
      getOrgs() {
        return new Promise((resolve, reject) => {
          axios.get(`/admin/organizations`)
            .then(res => {
              var orgs = res.data
              return resolve(orgs)
            })
        })
      },
      getAdmins() {
        return new Promise((resolve, reject) => {
          axios.get(`/admin/admins`)
            .then(res => {
              var orgs = res.data
              return resolve(orgs)
            })
        })
      },
      setCurUser(user) {
        console.log(user)
        this.curUser = [{ "Name": user.name, "Email": user.email, "Phone": user.phone }]
      },
      doChange(event) {
        this.setCurUser(this.users.filter(user => user._id == event.target.value)[0])
      }
    },
    beforeMount() {
      this.startHandler();
    }
  }
</script>


<style scoped>
  .sitemap-section {
    border: black 1px solid;
  }
  .sitemap-section *:not(table) {
    /* children of sitemap-section except the table */
    display: inline-block;
    padding: 5px;
  }


</style>
