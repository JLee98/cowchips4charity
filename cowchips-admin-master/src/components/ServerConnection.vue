<template>
  <span :class="{ dot: true, online: isOnline, offline: isOffline }"></span>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "ServerConnection",
    created() {
      this.offline()
      this.checkOnline()
    },
    data() {
      return {
        isOnline: false,
        isOffline: true
      }
    },
    methods: {
      online() {
        this.isOnline = true
        this.isOffline = false
      },
      offline() {
        this.isOnline = false
        this.isOffline = true
      },
      checkOnline() {
        axios.get('/')
          .then(res => {
            if (res.status === 200) {
              this.online()
            }
            else {
              this.offline()
            }
          })
          .catch(err => {
            this.offline()
            console.error(err)
          })
      }
    }
  }
</script>

<style scoped>
  .dot {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    display: inline-block;
  }
  .online {
    background-color: green;
  }
  .offline {
    background-color: red;
  }
</style>
