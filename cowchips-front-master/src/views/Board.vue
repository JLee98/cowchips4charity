<template>
  <div>

    <table class="whole">
      <div class="header">
        <img src="../assets/boo_radley.png">
      </div>
      <tr :key="row" v-for="row in 6">
        <td :key="col" v-for="col in 6">
          <tile :number=board[(row-1)+(col-1)+(row-1)*5] :selected="selected" @selected="handleSelected" class="game_tile"></tile>
        </td>
      </tr>
      <table class="scoreboard">
      <tr class="orgNames">
        <td class="orgName" id="orgName1">Team 1</td>
        <td class="orgName" id="orgName2">Team 2</td>
      </tr>
      <tr class="scores">
        <td>
          <h1 class="score" id="score1">71</h1>
        </td>
        <td>
          <h1 class="score" id="score2">14</h1>
        </td>
      </tr>
    </table>
    </table>
  </div>

</template>

<script>
  import path from 'path'
  import axios from 'axios'
  import Tile from '@/components/Tile'
  import localStorageNames from '@/config/localStorageNames'

  export default {
    name: "Game",
    components: {
      Tile
    },
    mounted() {
      this.getGameBoard()
    },
    data() {
      return {
        board: [],
        selected: [],
        price: 0
      }
    },
    methods: {
      getGameBoard() {
        let gameId = this.$localStorage.get(localStorageNames.gameId)
        if(!gameId)
          return

        axios.get(path.join('/game', gameId))
          .then(res => {
            // console.log(res.data)
            this.board = res.data.board
            this.price = res.data.price
          })
          .catch(err => {
            console.log(err)
          })
      },
    }
  }
</script>
<style scoped>

  .whole {
    display: block;
    height: 100vh;
    align-content: center;
    justify-content: center;
    align-items: center;

    width: 100%;
    background-image: url("../assets/grass_background.jpg");
  }

  .table {
    padding: 20px;
  }

  .header {
    width: 400px;
    align-content:center;
  }

  .scoreboard {
    margin: auto;
    margin-top: 20px;
    text-align: center;
    width:300px;
    height:100px;
    border-collapse: collapse;
    background: #333333;
  }

  .scoreboard td {
    font-family: serif;
    font-weight: 600;
    font-size: 20px;
    color: white;
    margin: 0 auto;
    text-align: center;
    border: 3px solid white;
    width: 50%;
  }

  .game_tile {
    text-align: center;
    width: 5em;
    padding: 5px;
    border-radius: 15px;
    font-size: 22px;
    color: white;
    background-color: #4e3b25;
    border-style: solid;
    border-width: 2px;
    border-color: black;
    overflow-x: hidden;
  }

  .words {
  text-align: center;
  padding-top: 10px;
  font-size: 22px;
  color: green;
  }

</style>
