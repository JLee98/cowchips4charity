<template>
  <div>
  <html>
  <head>
  </head>
    <body>
      <div id="container">
        <div id="header">
          <img src="../assets/boo_radley.png">
          </div>
          <div id="content">
          <table id="bingotable">
            <tr>
              <td id="square0"> &nbsp;</td>
              <td id="square1"> &nbsp;</td>
              <td id="square2"> &nbsp;</td>
              <td id="square3"> &nbsp;</td>
              <td id="square4"> &nbsp;</td>
              <td id="square5"> &nbsp;</td>
            </tr>
            <tr>
              <td id="square6"> &nbsp;</td>
              <td id="square7"> &nbsp;</td>
              <td id="square8"> &nbsp;</td>
              <td id="square9"> &nbsp;</td>
              <td id="square10"> &nbsp;</td>
              <td id="square11"> &nbsp;</td>
            </tr>
            <tr>
              <td id="square12"> &nbsp;</td>
              <td id="square13"> &nbsp;</td>
              <td id="square14"> &nbsp;</td>
              <td id="square15"> &nbsp;</td>
              <td id="square16"> &nbsp;</td>
              <td id="square17"> &nbsp;</td>
            </tr>
            <tr>
              <td id="square18"> &nbsp;</td>
              <td id="square19"> &nbsp;</td>
              <td id="square20"> &nbsp;</td>
              <td id="square21"> &nbsp;</td>
              <td id="square22"> &nbsp;</td>
              <td id="square23"> &nbsp;</td>
            </tr>
            <tr>
              <td id="square24"> &nbsp;</td>
              <td id="square25"> &nbsp;</td>
              <td id="square26"> &nbsp;</td>
              <td id="square27"> &nbsp;</td>
              <td id="square28"> &nbsp;</td>
              <td id="square29"> &nbsp;</td>
            </tr>
            <tr>
              <td id="square30"> &nbsp;</td>
              <td id="square31"> &nbsp;</td>
              <td id="square32"> &nbsp;</td>
              <td id="square33"> &nbsp;</td>
              <td id="square34"> &nbsp;</td>
              <td id="square35"> &nbsp;</td>
            </tr>
          </table>
        </div>

      <div id="sb_content">
        <table id="scoreboard">
          <tr id="orgNames">
            <td class="orgName" id="orgName1">Team 1</td>
            <td class="orgName" id="orgName2">Team 2</td>
          </tr>
          <tr id="scores">
            <td>
              <h1 class="score" id="score1">71</h1>
            </td>
            <td>
              <h1 class="score" id="score2">14</h1>
            </td>
          </tr>
        </table>
      </div>

    </div>

  </body>

  </html>

  </div>
</template>



<style scoped>
body {
  background-image: url(../assets/grass_background.jpg);
  display: flex;
  height: 90vh;
  align-content: center;
  justify-content: center;
  align-items: center;
}

img {
  width: 350px;
}

#bingotable {
  margin: 0 auto;
  text-align: center;
  width:400px;
  height:400px;
  border-collapse: collapse;
  background: white;
}

#bingotable td {
  font-family: serif;
  font-weight: 600;
  font-size: 25px;
  color: green;
  margin: 0 auto;
  text-align: center;
  border: 3px solid black;
  width: 16.667%;
}

#scoreboard {
  margin: auto;
  margin-top: 20px;
  text-align: center;
  width:300px;
  height:100px;
  border-collapse: collapse;
  background: #333333;
}

#scoreboard td {
  font-family: serif;
  font-weight: 600;
  font-size: 20px;
  color: white;
  margin: 0 auto;
  text-align: center;
  border: 3px solid white;
  width: 50%;
}

h1{
  font-family: 'Play', sans-serif;
  font-weight: 600;
  margin: 0 auto;
  text-align: center;
  padding: 10px;
  color: red;
}

</style>

<script>

</script>
