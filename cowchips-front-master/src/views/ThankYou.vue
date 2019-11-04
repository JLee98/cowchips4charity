<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12 shadow">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Thank You!</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="scroll" style="white-space: pre-wrap;">
                  <div style="width: 90%">
                    <span>Thank you for playing the game!</span>
                    <span>All money received will go towards funding research into diseases shared by domesticated animals and humans</span>
                    <hr>
                    <div style="text-align: center">
                      <v-btn to="/">Take Me Home!</v-btn>
                    </div>
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
