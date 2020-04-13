<template>
  <v-app id="inspire">
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>AoE II - Definitive Edition - Random Civilization Selector</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row>
          <v-col>
            <p>Welcome to the AoE II Random Civilization Generator. This tool is intended to help you pick a civilization at random before starting a new match, while also allowing you to exclude certain civilizations and automatically disregard already selected ones.</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center">
            <v-btn @click="generateRandomCiv()">Generate Random Civilization</v-btn>
          </v-col>
        </v-row>

        <v-row v-if="selectedCiv.name !== ''">
          <v-col align>
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline mb-4">{{ selectedCiv.dlc }}</div>
                  <v-list-item-title class="headline mb-1">
                    {{
                    selectedCiv.name
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-avatar tile size="80">
                  <v-img
                    :src="selectedCiv.icon"
                    :style="selectedCiv.isIncluded ? '' : 'filter: grayscale(100%);'"
                    height="80"
                    width="80"
                  ></v-img>
                </v-list-item-avatar>
              </v-list-item>

              <v-card-actions>
                <v-btn
                  icon
                  :title="'Play the ' + selectedCiv.name"
                  @click="selectedCiv.wasSelectedBefore = true"
                  :disabled="selectedCiv.wasSelectedBefore || !selectedCiv.isIncluded"
                >
                  <v-icon v-if="!selectedCiv.wasSelectedBefore">mdi-play</v-icon>
                  <v-icon v-else>mdi-play-protected-content</v-icon>
                </v-btn>
                <v-switch v-model="selectedCiv.isIncluded" dense></v-switch>
                <v-btn
                  icon
                  :href="'https://ageofempires.fandom.com/wiki/' + selectedCiv.name"
                  target="__new"
                  title="Open in AoE Wiki"
                >
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-10"></v-divider>

        <v-row>
          <v-col align="left">
            <v-btn class="mr-5" color="primary" @click="excludeAll()">Exclude all</v-btn>
            <v-btn class="mr-5" color="primary" @click="includeAll()">Include all</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col align="right">
            <Confirm
              label="Reset alrady selected"
              message="Do you want to reset the already selected civs?"
              color="error"
              @confirm="resetSelection()"
            ></Confirm>
            <Confirm
              label="Reset excluded"
              message="Do you want to reset the excluded civs?"
              color="error"
              @confirm="resetExcluded()"
            ></Confirm>
          </v-col>
        </v-row>

        <v-divider class="my-10"></v-divider>

        <v-row>
          <v-col v-for="(civs, index) in this.splitCivilizations" :key="index">
            <ul>
              <v-row dense v-for="civ in civs" :key="civ.name" justify="space-around">
                <v-col>
                  <v-switch v-model="civ.isIncluded" dense>
                    <template v-slot:label>
                      <span
                        :style="
                          civ.isIncluded ? '' : 'text-decoration: line-through'
                        "
                      >{{ civ.name }}</span>
                    </template>
                    <template v-slot:append>
                      <v-img
                        :src="civ.icon"
                        :style="civ.isIncluded ? '' : 'filter: grayscale(100%);'"
                        width="35"
                        height="35"
                      ></v-img>

                      <v-btn
                        icon
                        v-if="!civ.wasSelectedBefore"
                        :disabled="!civ.isIncluded"
                        class="mx-5"
                        title="Remove from rotation: mark as played"
                        @click="civ.wasSelectedBefore = !civ.wasSelectedBefore"
                        dense
                      >
                        <v-icon style="text-decoration: none !important">mdi-play</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        icon
                        :disabled="!civ.isIncluded"
                        class="mx-5"
                        style="text-decoration: none !important"
                        title="Take back into rotation"
                        @click="civ.wasSelectedBefore = !civ.wasSelectedBefore"
                        dense
                      >
                        <v-icon style="text-decoration: none !important">mdi-play-protected-content</v-icon>
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
            <h2>FAQ</h2>
            <p>
              <b>Interesting tool... but why?</b>
              <br />I recently started playing AoE II DE with my buddies. We usually play against each other or AI using random civilizations. However, sometimes we need to start again or cancel a match but still want to keep these civilizations in the rotation while excluding other civilizations. This is not possible with the built in random generator of AoE. With this tool, it is.
            </p>
            <p>
              <b>How do I get started?</b>
              <br />If you want to get started, click on the "Generate Random Civilization" button and, if you ultimately end up playing the civilization, click on the
              <v-btn icon>
                <v-icon>mdi-play</v-icon>
              </v-btn>button.
            </p>
            <p>
              <b>Where is my data stored?</b>
              <br />All your data is stored locally on your browser. Currently, no data leaves your browser.
              <em>Please note:</em> If you decide to delete your cookies, you might lose your previously played or excluded civilizations.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer app>
      <span class="mr-3">&copy; 2020</span>
      <span class="mr-3">|</span>
      <span class="mr-3">
        <a target="__new" href="http://blog.akammerer.de/impressum/">Impressum</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import civilizations from "./civ";
import Confirm from "./components/Confirm.vue";
import _ from "lodash";

export default {
  components: { Confirm },
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    civilizations: civilizations,
    selectedCiv: {
      name: "",
      wasSelectedBefore: false,
      isIncluded: true,
      dlc: ""
    }
  }),
  mounted() {
    this.load();
  },
  watch: {
    civilizations: {
      deep: true,
      handler: _.debounce(function(newCiv) {
        this.save(newCiv);
      }, 5000)
    }
  },
  methods: {
    generateRandomCiv() {
      let possibleCivilizations = this.civilizations.filter(
        civ => !civ.wasSelectedBefore && civ.isIncluded
      );
      if (possibleCivilizations.length == 0) {
        this.$toast.error(
          "No more civilizations available. Either reset or include additional ones.",
          { dismissible: true, timeout: 15000 }
        );
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
    resetExcluded() {
      // TODO: Ask for confirmation
      this.includeAll();
    },
    includeAll() {
      this.civilizations.map(civ => (civ.isIncluded = true));
    },
    excludeAll() {
      this.civilizations.map(civ => (civ.isIncluded = false));
    },
    load() {
      if (localStorage.civilizations !== undefined) {
        this.civilizations = JSON.parse(
          window.localStorage.getItem("civilizations")
        );
        this.$toast.info("Loaded your configuration.");
      }
    },
    save(civ) {
      window.localStorage.setItem("civilizations", JSON.stringify(civ));
      this.$toast.info("Saved your configuration.");
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
