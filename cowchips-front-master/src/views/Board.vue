<template>
  <div>
    <table class="whole">
      <div class="header">
        <img src="../assets/boo_radley.png">
      </div>
      <table class="grid">
        <tr :key="row" v-for="row in 6">
          <td :key="col" v-for="col in 6">
            <tile :number=board[(row-1)+(col-1)+(row-1)*5] :selected="selected" @selected="handleSelected" class="game_tile"></tile>
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
    height: 74vh;
    align-content: center;
    justify-content: center;
    align-items: center;
    padding-top: 50px;

    width: 100%;
    background-image: url("../assets/grass_background.jpg");
  }

  .table {
    padding: 20px;

  }

  .header {
    width: 400px;
    align-content: center;
    margin: auto;
    padding-bottom: 30px;
  }

  .grid {
    margin: auto;
  }

  .game_tile {
    text-align: center;
    width: 5em;
    padding: 5px;
    font-size: 22px;
    color: black;
    background-color: white;
    border-style: solid;
    border-width: 3px;
    border-radius: 10px;
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
