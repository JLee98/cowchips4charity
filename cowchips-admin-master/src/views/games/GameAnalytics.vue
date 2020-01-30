<template>
  <p>GameAnalytics.vue yay</p>
  <!-- test url to inject: 
      http://localhost:8080/games/analytics/5c7c4a32c0cdf2591d1b4b59
      -->
</template>

<!--<script>
  import axios from 'axios'
  import path from 'path'

  export default {
    name: "GameWinningTile",
    created() {

    },
    data(){
      return{
        winningTile: null,
        invalidInputError: null
      }
    },
    methods: {
      back() {
        this.$router.push('/games')
      },
      prepareSubmit(){
        if(this.winningTile === null || this.winningTile > 36 || this.winningTile <= 0)
        {
          this.invalidInputError = "Please enter a value between 1 and 36"
        }
        else
        {
          this.invalidInputError = null
          this.showConfirmation()
        }
      },
      showConfirmation(){
        this.$refs.confirmation.show()
      },
      handleSubmit(){
        const url = path.join('/admin/games', this.$route.params.id, 'set-winning-tile');
        axios.post(url, {
          tile: this.winningTile
        })
        .then( () => {
          this.$router.push('/games');
        })
        .catch(err => {
          console.log(err)
          console.log(err.response)
        })
      }
    }
  }

</script>-->

<!--<style scoped>
  td {
    text-align: center;
    padding-bottom: 5px;
    padding-right: 5px;
    padding-left: 5px;
  }
  table {
    margin-top: 20px;
  }
  #winningTile
  {
    height:200px;
    width:210px;
    font-size:100pt;
  }
  #submitButton
  {
    margin-top: 20px;
  }
</style>-->
