<template>
  <div>
    <table class="whole">
      <tr :key="row" v-for="row in 6">
        <td :key="col" v-for="col in 6">
          <tile :number=board[(row-1)+(col-1)+(row-1)*5] :selected="selected" @selected="handleSelected" class="game_tile"></tile>
        </td>
      </tr>
    </table>
    <div class="words">Price Per Tile: ${{this.price/100}}</div>
    <div class="words">Total Price: ${{this.amount/100}}</div>
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
      handleSelected(number) {
        if (this.selected.includes(number)) {
          this.selected = this.selected.filter(e => e !== number)
        }
        else {
          this.selected.push(number)
        }

        this.$localStorage.set(localStorageNames.amount, this.amount)
        this.$localStorage.set(localStorageNames.selected, JSON.stringify(this.selected))
      },
    },
    computed: {
      amount() {
        return this.selected.length * this.price
      }
    }
  }
</script>

<style scoped>

  .whole {
    height: 95%;
    width: 100%;
    background-image: url("../assets/grass_background.jpg");
  }

  table {
    padding: 20px;
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
