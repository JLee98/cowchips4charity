<template>
  <div class="v-content">

    <div class="background column left">
    <v-btn
        icon
        large
        to="/"
        slot="activator">
      <v-icon x-large dark>arrow_back</v-icon>
    </v-btn>
      <v-img
          :src="require('../assets/grass_background.jpg')">
      </v-img>

    </div>

    <div class="column middle">

    <v-img :src="require('../assets/boo_radley.png')" ></v-img>

    <font size=5>

      <b><p align ="center">The Boo Radley Foundation supports cancer research in dogs which also benefits human cancer research.  Donations are used to support clinical trials, individual cases of dog cancer victims, and other organizations that forward the understanding and treatment of canine cancer.</p></b>
    </font>


        <font size=4><p>The Boo Radley Foundation is a first of its kind 501 (c)(3) not-for-profit corporation established to promote medical research for diseases that are common to humans and our companion animals. Unfortunately, our companion animals develop and die from many of the same diseases that afflict humans. These diseases include numerous forms of cancer, muscular dystrophy, cystic fibrosis, influenza, metabolic storage diseases, such as lysosomal storage disorders, and many, many others. Scientists have discovered that many of these diseases respond to treatment in animals in the same way that these diseases respond to treatment in humans. Because these diseases spontaneously occur in companion animals in the same manner that they occur in humans, studying and treating the diseases in a companion animal offers researchers a faster and more reliable path to new treatments for humans than the traditional murine (mouse) model where diseases are "cultivated" in mice. Studying and treating these diseases in companion animals as a way to find new treatments for humans is referred to as translational or comparative medicine and is a part of the One Health and One Medicine philosophies of medicine.</p></font>

    </div>
    <div class="background column right">
      <v-img
          :src="require('../assets/grass_background.jpg')">
      </v-img>
    </div>
  </div>
</template>



<style scoped>
  .whole {
    height: 90px;
    width: 100%;
  }

  .column {
    float: left;
  }

  .left, .right {
    width: 20%;
  }

  .middle {
    width: 70%;
  }

  .row:after {
    content: "";
    display: table;
    clear: both;
  }

  .logo {
    margin: auto;
  }
  .background {
    background-image: url("../assets/grass_background.jpg");
  }



</style>
