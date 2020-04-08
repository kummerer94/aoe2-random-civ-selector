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
          <v-col>
            <ul>
              <v-row dense v-for="civ in civilizations" :key="civ.name" justify="space-around">
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
                        @click="civ.wasSelectedBefore = !civ.wasSelectedBefore"
                      >&times;</v-btn>
                      <v-btn
                        class="mx-5"
                        style="text-decoration: none !important"
                        v-else
                        dense
                        @click="civ.wasSelectedBefore = !civ.wasSelectedBefore"
                      >+</v-btn>
                      <v-chip>{{ civ.dlc }}</v-chip>
                    </template>
                  </v-switch>
                </v-col>
              </v-row>
            </ul>
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
    civilizations: civilizations
  }),
  created() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
