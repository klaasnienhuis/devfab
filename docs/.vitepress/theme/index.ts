// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from "vitepress/theme";
import "./style.css";
import "../../../src/index.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";

const vuetify = createVuetify({
  components,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});
export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.use(vuetify);
  },
};
