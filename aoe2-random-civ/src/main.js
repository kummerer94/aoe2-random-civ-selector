import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

import ToastPlugin from "vue-toast-notification";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createApp } from "vue";
import App from "./App.vue";
import ConfirmSelection from "./components/ConfirmSelection.vue";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,

  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },

  theme: {
    defaultTheme: "dark",
  },
});

app.use(vuetify);
app.use(ToastPlugin);
app.component("ConfirmSelection", ConfirmSelection);

app.mount("#app");
