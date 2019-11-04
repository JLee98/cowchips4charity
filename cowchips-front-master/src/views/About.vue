<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12 shadow">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>About</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <v-btn
                        icon
                        large
                        to="/"
                        slot="activator"
                    >
                      <v-icon large>arrow_back</v-icon>
                    </v-btn>
                  </v-tooltip>
                </v-toolbar>
                <v-card-text class="scroll" style="white-space: pre-wrap;">
                  <div style="width: 90%">
                    <p><b>The Boo Radley Foundation</b> supports cancer research in dogs which also benefits human cancer research.  Donations are used to support clinical trials, individual cases of dog cancer victims, and other organizations that forward the understanding and treatment of canine cancer.</p>
                    <hr>
                    <p>The Boo Radley Foundation is a first of its kind 501 (c)(3) not-for-profit corporation established to promote medical research for diseases that are common to humans and our companion animals. Unfortunately, our companion animals develop and die from many of the same diseases that afflict humans. These diseases include numerous forms of cancer, muscular dystrophy, cystic fibrosis, influenza, metabolic storage diseases, such as lysosomal storage disorders, and many, many others. Scientists have discovered that many of these diseases respond to treatment in animals in the same way that these diseases respond to treatment in humans. Because these diseases spontaneously occur in companion animals in the same manner that they occur in humans, studying and treating the diseases in a companion animal offers researchers a faster and more reliable path to new treatments for humans than the traditional murine (mouse) model where diseases are "cultivated" in mice. Studying and treating these diseases in companion animals as a way to find new treatments for humans is referred to as translational or comparative medicine and is a part of the One Health and One Medicine philosophies of medicine.</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>
