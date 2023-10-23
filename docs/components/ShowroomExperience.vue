<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useData } from "vitepress";
import { API } from "./types";
const { isDark } = useData();

const playersettings = {
  autostart: 1,
  annotation_tooltip_visible: 0,
  scrollwheel: 0,
  ui_controls: 0,
  ui_infos: 0,
  ui_watermark: 0,
  ui_stop: 0,
  camera: 0,
};
const state = reactive({
  tabs: [
    {
      name: "Project",
      current: true,
      steps: [
        {
          name: "Flipchart Easel",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Space Divider",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Stool",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
      ],
    },
    {
      name: "Conference",
      current: false,
      steps: [
        {
          name: "Beamer Screen",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Conference Table",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Neat Chair",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
      ],
    },
    {
      name: "Casual",
      current: false,
      steps: [
        {
          name: "Sofa",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Bar",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Laptop",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
      ],
    },
    {
      name: "Open Plan",
      current: false,
      steps: [
        {
          name: "Desk Divider",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Copier",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Plants",
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
      ],
    },
  ],
});

const viewerIframeRef = ref(null);
const api = ref<API | undefined>();
const currentstepindex = ref(0);
const currenttabindex = ref(0);

const currenttab = computed(() => {
  return state.tabs[currenttabindex.value];
});

const currentstep = computed(() => {
  return currenttab.value.steps[currentstepindex.value];
});

const setTab = (tabName: string) => {
  const index = state.tabs.findIndex((tab) => tab.name === tabName);
  currenttabindex.value = index;
  currentstepindex.value = 0;
};

const nextStep = () => {
  currentstepindex.value++;
  if (currentstepindex.value >= currenttab.value.steps.length) {
    currenttabindex.value++;
    currentstepindex.value = 0;
  }
  if (currenttabindex.value >= state.tabs.length) {
    currenttabindex.value = 0;
  }
};

onMounted(() => {
  import("@sketchfab/viewer-api").then((module) => {
    const client = new module.default("1.12.1", viewerIframeRef.value);
    client.init("aebbd23023c74fac840a00fc5374015d", {
      success: (_api) => {
        api.value = _api;
        _api.addEventListener("viewerready", () => {});
      },
      error: () => console.error("Sketchfab API error"),
      ...playersettings,
    });
  });
});
</script>

<template>
  <div>
    <div class="sm:hidden">
      <select
        id="tabs"
        name="tabs"
        class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option
          v-for="tab in state.tabs"
          :key="tab.name"
          :selected="tab.name === currenttab.name"
        >
          {{ tab.name }}
        </option>
      </select>
    </div>
    <div class="hidden sm:block">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex" aria-label="Tabs">
          <div
            v-for="tab in state.tabs"
            :key="tab.name"
            :class="[
              tab.name === currenttab.name
                ? 'border-pink-700 text-pink-700'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700',
              'w-1/4 border-b-4 py-4 px-1 text-center text-sm font-medium cursor-pointer',
            ]"
            :aria-current="tab.name === currenttab.name ? 'page' : undefined"
            @click="setTab(tab.name)"
          >
            {{ tab.name }}
          </div>
        </nav>
      </div>
    </div>
  </div>
  <v-responsive :aspect-ratio="4 / 3" class="w-100">
    <iframe
      style="border: 0"
      id="api-iframe"
      ref="viewerIframeRef"
      class="w-100 h-100 absolute"
    ></iframe>
    <v-scale-transition>
      <div class="absolute left-0 bottom-0 w-[32rem] m-4">
        <div
          class="text-4xl font-extrabold drop-shadow-md bg-clip-text text-transparent bg-pink-500"
        >
          {{ currentstep.name }}
        </div>
        <div class="flex align-end">
          <div
            class="rounded-md shadow-lg h-32 w-[26rem] flex"
            :class="[isDark ? 'bg-black' : 'bg-white']"
          >
            <img :src="currentstep.img" class="object-contain h-32 w-32" />
            <div class="m-2">
              {{ currentstep.body }}
            </div>
          </div>
          <button
            type="button"
            class="ml-2 rounded-full bg-pink-600 pl-4 p-2 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="nextStep"
          >
            Next
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
    </v-scale-transition>
  </v-responsive>
</template>
