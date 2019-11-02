<template>
  <b-container class="bv-example-row">
    <b-row class="justify-content-left">
        <b-button variant="primary" @click.prevent="back">Back</b-button>
    </b-row>

    <b-row class="justify-content-center">
      Select Winning Tile
    </b-row>

    <b-row class="justify-content-center">
      <table>
        <td><b-form-input id ="winningTile" ref="winningTile" type="number" v-model="winningTile" :min="1" :max="36"></b-form-input></td>
      </table>
    </b-row>

    <b-row class="justify-content-center">
      <p> {{invalidInputError}} </p>
    </b-row>

    <b-row class="justify-content-center">
      <b-button id="submitButton" variant="success" @click.prevent="prepareSubmit">Submit</b-button>
    </b-row>

    <b-modal ref="confirmation" id="confirmation" @ok.prevent="handleSubmit">
      Are you sure you want to select {{winningTile}} as the winning tile?
      <template slot="modal-ok">
        Confirm
      </template>

    </b-modal>

  </b-container>
</template>

<script>
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

</script>

<style scoped>
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
</style>
