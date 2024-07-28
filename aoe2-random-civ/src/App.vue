<template>
  <v-app id="inspire">
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>AoE II - Definitive Edition - Random Civilization Selector</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="userDialog = true">{{ this.user !== "" ? this.user : "Store in browser" }}</v-btn>
    </v-app-bar>

    <v-dialog v-model="userDialog">
      <v-card>
        <v-card-title class="headline">What is your username?</v-card-title>

        <v-card-text>
          <p>
            If you specify a username here, we will save your configuration in
            our database. You can come back to this site and use your username
            to retrieve this configuration again.
          </p>
          <p>
            If you choose to not specify a username, we will save your
            configuration in your browser. However, this may get lost when the
            cache is deleted or when you are switching your browser.
          </p>
          <v-form
            @submit.prevent="
              userDialog = false;
              load();
            "
          >
            <v-text-field label="Username" v-model="user"></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="
              userDialog = false;
              user = '';
            "
          >Store in browser</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="
              userDialog = false;
              load();
            "
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <p>
              Welcome to the AoE II Random Civilization Generator. This tool is
              intended to help you pick a civilization at random before starting
              a new match, while also allowing you to exclude certain
              civilizations and automatically disregard already selected ones.
            </p>
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
                    selectedCiv.altName === undefined ? selectedCiv.name : selectedCiv.name + " (" + selectedCiv.altName + ")"
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-avatar tile size="80">
                  <a :href="selectedCiv.wikiLink" target="__new">
                    <v-img
                      :src="selectedCiv.icon"
                      :style="
                        selectedCiv.isIncluded ? '' : 'filter: grayscale(100%);'
                      "
                      height="80"
                      width="80"
                    ></v-img>
                  </a>
                </v-list-item-avatar>
              </v-list-item>

              <v-card-actions>
                <v-btn
                  icon
                  :title="'Play the ' + selectedCiv.name"
                  @click="selectCiv(selectedCiv)"
                  :disabled="
                    selectedCiv.wasSelectedBefore || !selectedCiv.isIncluded
                  "
                >
                  <v-icon v-if="!selectedCiv.wasSelectedBefore">mdi-play</v-icon>
                  <v-icon v-else>mdi-play-protected-content</v-icon>
                </v-btn>
                <v-switch v-model="selectedCiv.isIncluded" dense></v-switch>
                <v-btn icon :href="selectedCiv.wikiLink" target="__new" title="Open in AoE Wiki">
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-10"></v-divider>

        <v-row>
          <v-col align="left">
            <v-btn class="mr-5 mb-5" color="primary" @click="excludeAll()">Exclude all</v-btn>
            <v-btn class="mr-5 mb-5" color="primary" @click="includeAll()">Include all</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col align="right">
            <ConfirmSelection
              label="Reset already selected"
              message="Do you want to reset the already selected civs?"
              color="error"
              @confirm="resetSelection()"
            ></ConfirmSelection>
            <ConfirmSelection
              label="Reset excluded"
              message="Do you want to reset the excluded civs?"
              color="error"
              @confirm="resetExcluded()"
            ></ConfirmSelection>
          </v-col>
        </v-row>
        <v-divider class="my-10"></v-divider>
        <v-row>
            <v-col>
              <v-btn v-for="unit in unitStrategies" :key="unit" class="mr-5 mb-5" color="primary" @click="includeUnitStrats(unit)">Include {{unit}} civs</v-btn>
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
                      >{{ civ.altName === undefined ? civ.name : civ.name + " ("+ civ.altName + ")" }}{{ civ.wasSelectedBefore && civ.lastPicked !== null ? ' (last picked '+ makeDateHumanReadable(civ.lastPicked) +')' : ''}}</span>
                    </template>
                    <template v-slot:append>
                      <v-img
                      :src="civ.icon"
                      :style="
                          civ.isIncluded ? '' : 'filter: grayscale(100%);'
                        "
                        width="35"
                        height="35"
                        ></v-img>
                        <v-btn
                        icon
                        v-if="!civ.wasSelectedBefore"
                        :disabled="!civ.isIncluded"
                        class="mx-5"
                        title="Remove from rotation: mark as played"
                        @click="selectCiv(civ)"
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
                        @click="resetCiv(civ)"
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
              <br />I recently started playing AoE II DE with my buddies. We
              usually play against each other or AI using random civilizations.
              However, sometimes we need to start again or cancel a match but
              still want to keep these civilizations in the rotation while
              excluding other civilizations. This is not possible with the built
              in random generator of AoE. With this tool, it is.
            </p>
            <p>
              <b>How do I get started?</b>
              <br />If you want to get started, click on the "Generate Random
              Civilization" button and, if you ultimately end up playing the
              civilization, click on the
              <v-btn icon>
                <v-icon>mdi-play</v-icon>
              </v-btn>button.
            </p>
            <p>
              <b>Where is my data stored?</b>
              <br />All your data is stored locally on your browser. Currently,
              no data leaves your browser
              <em>if you do not want it to</em>.
              <em>Please note:</em> If you decide to
              delete your cookies, you might lose your previously played or
              excluded civilizations.
            </p>

            <h2>Privacy</h2>The next paragraph describes the way that I handle and save your
            data. In short:
            <ul>
              <li>
                If you do not want me to, I will not save any of your data on my
                servers.
              </li>
              <li>
                If you do opt to save your data on my servers by choosing a
                username, I will save your configuration, the current date, and
                your chosen username. This allows me to later retrieve this data
                if you want to use this tool on another PC by filtering for the username.
              </li>
            </ul>

            <h2>Datenschutzerklärung</h2>
            <p>
              Als Betreiber dieser Seiten nehmen wir den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              Im Folgenden informieren wir über die Erhebung personenbezogener Daten bei Nutzung unserer Webseite. Personenbezogene Daten sind alle Daten, die auf Sie persönlich beziehbar sind, z. B. Bestandsdaten (Name, Adresse, etc.), Kontaktdaten (E-Mail-Adressen, Telefon- und Faxnummer etc. ), Inhaltsdaten (Bilder, Videos, Text etc.), Nutzungsdaten (Besuchte Webseite, Zugriffszeiten, etc.) und Kommunikationsdaten (IP-Adresse, Geräte- und Browserinformationen, etc.).
              Verantwortlicher gem. Art. 4 Abs. 7 EU-Datenschutz-Grundverordnung (DSGVO) ist Alexander Kammerer.
              Wir speichern, sofern Sie dies explizit durch die Angabe eines Nutzernamens ("Username") bestätigen, auf unseren Servern diesen Nutzernamen, sowie die aktuell konfigurierten und angezeiten Daten zu der Selektion von Völkern bei Age of Empires. Weiterhin hinterlegen wir den Zeitpunkt, zu dem Sie diese Daten an uns geschickt haben.
              Sie können uns jederzeit veranlassen diese Daten zu löschen, indem Sie sich an die im Impressum angegebenen Kontaktdaten wenden.
            </p>

            <h2>Copyright</h2>
            <p>
              Age of Empires II DE © Microsoft Corporation. aoe-rcs.com was created under Microsoft's <a href="https://www.xbox.com/en-us/developers/rules">"Game Content Usage Rules"</a> using assets from Age of Empires II DE, and it is not endorsed by or affiliated with Microsoft.
             </p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      <span class="mr-3">&copy; 2024</span>
      <span class="mr-3">|</span>
      <span class="mr-3">
        <a target="__new" href="http://blog.akammerer.de/impressum/">Impressum</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import { civilizations, unitStrategies } from "./civ";
import ConfirmSelection from "./components/ConfirmSelection.vue";
import _ from "lodash";
import moment from "moment";
import { LocalStorageEngine, APIStorageEngine } from "./storageEngine";

let localStorageEngine = new LocalStorageEngine();
let apiStorageEngine = new APIStorageEngine();

export default {
  components: { ConfirmSelection },
  props: {
    source: String
  },
  data: () => {
    return {
      user: localStorage.getItem("user") || "",
      userDialog: false,
      drawer: null,
      civilizations: civilizations,
      unitStrategies: unitStrategies,
      selectedCiv: {
        name: "",
        wasSelectedBefore: false,
        isIncluded: true,
        dlc: ""
      }
    };
  },
  mounted() {
    this.load();
  },
  watch: {
    civilizations: {
      deep: true,
      handler: _.debounce(function(newCiv) {
        this.save(newCiv);
      }, 1000)
    },
    user: function (u) {
      localStorage.setItem("user", u)
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
          { dismissible: true, duration: 15000 }
        );
      } else {
        this.selectedCiv =
          possibleCivilizations[
            Math.floor(Math.random() * possibleCivilizations.length)
          ];
      }
    },
    selectCiv(civ) {
      civ.wasSelectedBefore = true;
      civ.lastPicked = new Date().toISOString();
    },
    resetCiv(civ) {
      civ.wasSelectedBefore = false;
      civ.lastPicked = null;
    },
    resetSelection() {
      // TODO: Ask for confirmation
      this.civilizations.map(civ => this.resetCiv(civ));
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
    includeUnitStrats(unit) {
      for (let c of this.civilizations) {
        if(c.gotoUnit.includes(unit)) {
          c.isIncluded = true;
        }
      }
    },
    setupCivilizations(civilizations) {
      // Instead of simply loading the stored configuration, update
      // the attributes of the default configuration with the values
      // for these attributes in the stored configuration.
      civilizations.map(storedCiv => {
        const standardCiv = this.civilizations.find(civ => civ.name === storedCiv.name);
        // do not use stored info for icon, gotoUnit, and dlc
        storedCiv.icon = standardCiv.icon;
        storedCiv.gotoUnit = standardCiv.gotoUnit;
        storedCiv.dlc = standardCiv.dlc;
        // update the civ in the app with the info from storage
        Object.assign( standardCiv, storedCiv);
      });
    },
    load() {
      if (this.user === "") {
        localStorageEngine.load().then(storedCivilizations => {
          this.setupCivilizations(storedCivilizations);
          this.$toast.info("Loaded your configuration.");
        });
      } else {
        apiStorageEngine
          .load(this.user)
          .then(storedCivilizations => {
            this.setupCivilizations(storedCivilizations);
            this.$toast.info("Loaded your configuration.");
          })
          .catch(error => this.$toast.warning(error));
      }
    },
    save(civ) {
      if (civ === undefined || civ === null) {
        return;
      }
      if (this.user !== "") {
        apiStorageEngine
          .save(civ, this.user)
          .then(() => this.$toast.info("Saved your configuration."));
      } else {
        localStorageEngine
          .save(civ)
          .then(() => this.$toast.info("Saved your configuration."));
      }
    },
    makeDateHumanReadable(date) {
      if (date !== null) {
        return moment(date).fromNow();
      }
      return "";
    }
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
