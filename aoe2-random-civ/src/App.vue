<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Random Selector</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        AoE II - Definitive Edition - Random Civilization
        Selector
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row>
          <v-col align="center">
            <v-btn @click="generateRandomCiv()">Generate Random Civilization</v-btn>
          </v-col>
          <v-col align="center" v-if="selectedCiv.name !== ''">
            <v-btn @click="chooseSelectedCiv()">Play this civilization</v-btn>
          </v-col>
        </v-row>

        <v-row v-if="selectedCiv.name !== ''">
          <v-col align="center">
            <v-chip color="primary" large class="mx-5">{{ selectedCiv.name }}</v-chip>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(civs, index) in this.splitCivilizations" :key="index">
            <ul>
              <v-row dense v-for="civ in civs" :key="civ.name" justify="space-around">
                <v-col>
                  <v-switch
                    :style="civ.isExcluded ? 'text-decoration: line-through' : ''"
                    v-model="civ.isExcluded"
                    :label="civ.name"
                    dense
                  >
                    <template v-slot:append>
                      <v-btn
                        v-if="!civ.wasSelectedBefore"
                        dense
                        class="mx-5"
                        style="text-decoration: none !important"
                        title="Remove from rotation: mark as played"
                        @click="civ.wasSelectedBefore = !civ.wasSelectedBefore"
                      >
                        <v-icon>mdi-play</v-icon>
                      </v-btn>
                      <v-btn
                        class="mx-5"
                        style="text-decoration: none !important"
                        v-else
                        dense
                        title="Take back into rotation"
                        @click="civ.wasSelectedBefore = !civ.wasSelectedBefore"
                      >
                        <v-icon>mdi-play-protected-content</v-icon>
                      </v-btn>
                      <v-chip :color="civ.name == selectedCiv.name ? 'primary' : ''">{{ civ.dlc }}</v-chip>
                    </template>
                  </v-switch>
                </v-col>
              </v-row>
            </ul>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn color="error" @click="resetSelection()">Reset</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import civilizations from "./civ";

export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    civilizations: civilizations,
    selectedCiv: {
      name: "",
      wasSelectedBefore: false,
      isExcluded: false,
      dlc: ""
    }
  }),
  methods: {
    generateRandomCiv() {
      let possibleCivilizations = this.civilizations.filter(
        civ => !civ.wasSelectedBefore && !civ.isExcluded
      );
      if (possibleCivilizations.length == 0) {
        // TODO: Better error message (use modal window)
        alert("No more available civs.");
      } else {
        this.selectedCiv =
          possibleCivilizations[
            Math.floor(Math.random() * possibleCivilizations.length)
          ];
      }
    },
    chooseSelectedCiv() {
      this.selectedCiv.wasSelectedBefore = true;
    },
    resetSelection() {
      // TODO: Ask for confirmation
      this.civilizations.map(civ => (civ.wasSelectedBefore = false));
    },
    load() {
      // TODO: load from local storage
    },
    save() {
      // TODO: save to local storage
    }
  },
  created() {
    this.$vuetify.theme.dark = true;
  },
  computed: {
    splitCivilizations() {
      let cols = 3;
      let N = Math.ceil(this.civilizations.length / cols);
      let splitCiv = [];
      for (let index = 0; index < this.civilizations.length; index += N) {
        splitCiv.push(this.civilizations.slice(index, index + N));
      }
      return splitCiv;
    }
  }
};
</script>
