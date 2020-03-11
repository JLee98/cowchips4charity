<template>
   <b-container class="bv-example-row">
     <b-row class="justify-content-left">
       <b-col>
         <b-button variant="primary" @click.prevent="back">Back</b-button>
       </b-col>
       <b-col>
         Game Board For:
         <p> {{gameName}} </p>
       </b-col>
       <b-col>
         <b-button variant="primary" @click.prevent="randomize">Random Layout</b-button>
       </b-col>
     </b-row>

     <b-row class="justify-content-center">
       <table>
         <tr>
           <td><b-form-input id ="0" ref="0" type="number" v-model="board[0]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="1" ref="1" type="number" v-model="board[1]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="2" ref="2" type="number" v-model="board[2]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="3" ref="3" type="number" v-model="board[3]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="4" ref="4" type="number" v-model="board[4]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="5" ref="5" type="number" v-model="board[5]" :min="1" :max="36"></b-form-input></td>
         </tr>
         <tr>
           <td><b-form-input id ="6" ref="6" type="number" v-model="board[6]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="7" ref="7" type="number" v-model="board[7]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="8" ref="8" type="number" v-model="board[8]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="9" ref="9" type="number" v-model="board[9]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="10" ref="10" type="number" v-model="board[10]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="11" ref="11" type="number" v-model="board[11]" :min="1" :max="36"></b-form-input></td>
         </tr>
         <tr>
           <td><b-form-input id ="12" ref="12" type="number" v-model="board[12]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="13" ref="13" type="number" v-model="board[13]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="14" ref="14" type="number" v-model="board[14]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="15" ref="15" type="number" v-model="board[15]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="16" ref="16" type="number" v-model="board[16]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="17" ref="17" type="number" v-model="board[17]" :min="1" :max="36"></b-form-input></td>
         </tr>
         <tr>
           <td><b-form-input id ="18" ref="18" type="number" v-model="board[18]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="19" ref="19" type="number" v-model="board[19]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="20" ref="20" type="number" v-model="board[20]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="21" ref="21" type="number" v-model="board[21]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="22" ref="22" type="number" v-model="board[22]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="23" ref="23" type="number" v-model="board[23]" :min="1" :max="36"></b-form-input></td>
         </tr>
         <tr>
           <td><b-form-input id ="24" ref="24" type="number" v-model="board[24]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="25" ref="25" type="number" v-model="board[25]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="26" ref="26" type="number" v-model="board[26]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="27" ref="27" type="number" v-model="board[27]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="28" ref="28" type="number" v-model="board[28]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="29" ref="29" type="number" v-model="board[29]" :min="1" :max="36"></b-form-input></td>
         </tr>
         <tr>
           <td><b-form-input id ="30" ref="30" type="number" v-model="board[30]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="31" ref="31" type="number" v-model="board[31]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="32" ref="32" type="number" v-model="board[32]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="33" ref="33" type="number" v-model="board[33]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="34" ref="34" type="number" v-model="board[34]" :min="1" :max="36"></b-form-input></td>
           <td><b-form-input id ="35" ref="35" type="number" v-model="board[35]" :min="1" :max="36"></b-form-input></td>
         </tr>
       </table>
     </b-row>
     <b-row>
       <p> {{duplicateError}} </p>
     </b-row>
     <b-row>
       <p> {{invalidInputError}} </p>
     </b-row>
     <b-row>
       <b-button variant="success" @click.prevent="handleSubmit">Submit</b-button>
     </b-row>
   </b-container>
</template>

<script>
  import path from 'path'
  import axios from 'axios'

  export default {
    name: "GameBoard",
    created() {
      this.getGameBoard()
    },
    data() {
      return {
        board: [],
        duplicateError: null,
        invalidInputError: null,
        gameName: String,
      }
    },
    methods: {
      back() {
        this.$router.push('/games')
      },
      getGameBoard() {
        axios.get(path.join('/admin/games', this.$route.params.id))
          .then(res => {
            if(res.data.board.length !== 36) {
              for(let i=0; i<36; i++) {
                this.board[i] = i + 1;
              }
            }
            else {
              this.board = res.data.board
            }
            this.gameName = res.data.name
            this.duplicateError = "";
            this.invalidInputError = "";
            this.updateView()
          })
          .catch(err => {
            console.log(err)
          })
      },
      randomize() {
        let allowedTiles = [...Array(36).keys()].map(i => i + 1);
        let randomCap = 36
        for(let i=0; i<36; i++) {
          let random = Math.floor((Math.random() * randomCap));
          this.board[i] = allowedTiles.splice(random, 1)[0];
          randomCap--;
        }
        this.prepareForSubmit()
        this.updateView()
      },
      updateView(){
        this.$forceUpdate()
      },
      prepareForSubmit(){
        //Convert all values to numbers. The input does not read them in as numbers for some reason
        for(let i = 0; i < this.board.length; i++)
        {
          this.board[i] = Number(this.board[i])
          let resetColor = document.getElementById(i.toString());
          if (resetColor !== null)
          {
            resetColor.style.backgroundColor = "White";
          }
        }
      },
      validateInput(){
        //Pt 1 Validate no duplicates and no invalid inputs
        let duplicates = [];
        let invalidInput = [];

        for(let i = 0; i < this.board.length; i++)
        {
          if(this.board[i] > 36)
          {
            invalidInput.push(i);
          }
          for(let j = 0; j < this.board.length; j++)
          {
            if(this.board[i] == this.board[j] && i !== j)
            {
              duplicates.push(i);
              break;
            }
          }
        }
        //Pt 2 Return boolean and flag possible errors
        if(duplicates.length === 0 && invalidInput.length === 0)
        {
          this.duplicateError = "";
          this.invalidInputError = ""

          return true;
        }
        else
        {
          this.duplicateError = "";
          this.invalidInputError = ""

          if(duplicates.length !== 0)
          {
            for(let d = 0; d < duplicates.length; d++)
            {
              let flagColor = document.getElementById(duplicates[d].toString());
              flagColor.style.backgroundColor="Red";
            }
            this.duplicateError = "Error: Duplicate values found at Tiles: " + duplicates;
          }

          if(invalidInput.length !== 0)
          {
            for(let e = 0; e < invalidInput.length; e++)
            {
              let flagColor1 = document.getElementById(invalidInput[e].toString());
              flagColor1.style.backgroundColor="Red";
            }
            this.invalidInputError = "Error: Invalid input values found at Tiles: " + invalidInput + ". Values must be less than or equal to 36";
          }

          return false;
        }
      },
      handleSubmit() {
        this.prepareForSubmit();
        this.updateView()
        if(this.validateInput())
        {
          axios.put(path.join('/admin/games', this.$route.params.id), {
            board: this.board
          })
          this.$router.push('/games')
        }

      },
    }
  }
</script>

<style scoped>
  td {
    text-align: center;
    width: 5em;
    padding-bottom: 5px;
    padding-right: 5px;
    padding-left: 5px;
  }
  table {
    margin-top: 20px;
  }
</style>
