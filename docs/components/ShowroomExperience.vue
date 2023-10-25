<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useData } from "vitepress";
import { API, Annotation } from "./types";
const { isDark } = useData();

interface State {
  tabs: any[];
  annotationList: Annotation[];
}
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
  startannotation: {
    name: "start",
  },
  tabs: [
    {
      name: "Project",
      current: true,
      steps: [
        {
          name: "Laptop",
          annotation: {
            name: "laptop",
          },
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Space Divider",
          annotation: {
            name: "space divider",
          },
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Flipchart Easel",
          annotation: {
            name: "flipchart easel",
          },
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
          name: "Plants",
          annotation: {
            name: "plants",
          },
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Copier",
          annotation: {
            name: "copier",
          },
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Desk Divider",
          annotation: {
            name: "desk divider",
          },
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
          name: "Conference Table",
          annotation: {
            name: "conference table",
          },
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Beamer Screen",
          annotation: {
            name: "beamer screen",
          },
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Neat Chair",
          annotation: {
            name: "neat chair",
          },
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
          name: "Bar",
          annotation: {
            name: "bar",
          },
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Stool",
          annotation: {
            name: "stool",
          },
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
        {
          name: "Sofa",
          isFinal: true,
          annotation: {
            name: "sofa",
          },
          body: "asdfasdf",
          img: "trendelenburg.jpg",
          href: "https://archyi-inspiration.com/en/collections/angolo",
        },
      ],
    },
  ],
  annotationList: [],
});

const viewerIframeRef = ref(null);
const api = ref<API | undefined>();
const currentstepindex = ref(0);
const currenttabindex = ref(0);
const isStartposition = ref(true);
const isEndposition = ref(false);

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
  gotoAnnotation(
    api.value,
    state.tabs[currenttabindex.value].steps[currentstepindex.value].annotation,
  );
};

const nextStep = () => {
  if (currentstep.value.isFinal) {
    wrapupExperience();
  } else {
    currentstepindex.value++;
    if (currentstepindex.value >= currenttab.value.steps.length) {
      currenttabindex.value++;
      currentstepindex.value = 0;
    }
    if (currenttabindex.value >= state.tabs.length) {
      currenttabindex.value = 0;
    }
    gotoAnnotation(
      api.value,
      state.tabs[currenttabindex.value].steps[currentstepindex.value]
        .annotation,
    );
  }
};
const parseAnnotations = (api: API): Promise<void> => {
  return new Promise((resolve) => {
    api.getAnnotationList((err, annotations) => {
      state.tabs.forEach((tab) => {
        tab.steps.forEach((step) => {
          const annotation = annotations.find(
            (annotation) => annotation.name === step.annotation.name,
          );
          if (annotation) {
            step.annotation.payload = annotation;
          }
        });
      });
      state.startannotation.payload = annotations.find(
        (annotation) => annotation.name === state.startannotation.name,
      );
      resolve();
    });
  });
};
const gotoAnnotation = (api, annotation) => {
  console.log("annotation", annotation);
  const settings = {
    usePanConstraints: true,
    target: JSON.parse(JSON.stringify(annotation.payload.target)),
  };
  // showAnnotationDetails(api, annotationIndex);
  api.setEnableCameraConstraints(false, {}, () => {
    api.setCameraLookAt(
      JSON.parse(JSON.stringify(annotation.payload.eye)),
      JSON.parse(JSON.stringify(annotation.payload.target)),
      2,
      (err, id) => {
        api.setCameraLookAtEndAnimationCallback(() => {
          api.setCameraConstraints(settings, () => {
            api.setEnableCameraConstraints(true, {});
          });
        });
      },
    );
  });
};

const startExperience = () => {
  isStartposition.value = false;
  isEndposition.value = false;
  gotoAnnotation(
    api.value,
    state.tabs[currenttabindex.value].steps[currentstepindex.value].annotation,
  );
};

const restartExperience = () => {
  isEndposition.value = false;
  isStartposition.value = true;
  currenttabindex.value = 0;
  currentstepindex.value = 0;
  gotoAnnotation(api.value, state.startannotation);
};

const wrapupExperience = () => {
  isStartposition.value = false;
  isEndposition.value = true;
  currenttabindex.value = 0;
  currentstepindex.value = 0;
  gotoAnnotation(api.value, state.startannotation);
};

onMounted(() => {
  import("@sketchfab/viewer-api").then((module) => {
    const client = new module.default("1.12.1", viewerIframeRef.value);
    client.init("e3d3549bae1f4d7e9d0821713b47ea56", {
      success: (_api) => {
        api.value = _api;
        _api.addEventListener("viewerready", () => {
          parseAnnotations(_api).then(() => {
            gotoAnnotation(api.value, state.startannotation);
          });
        });
      },
      error: () => console.error("Sketchfab API error"),
      ...playersettings,
    });
  });
});
</script>

<template>
  <div>
    <div class="border-b border-gray-200">
      <nav class="-mb-px h-14" aria-label="Tabs">
        <v-fade-transition>
          <div v-if="!isStartposition && !isEndposition" class="flex">
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
          </div>
        </v-fade-transition>
      </nav>
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
      <div
        v-if="isStartposition"
        class="absolute left-0 bottom-0 w-[32rem] m-4"
      >
        <div
          class="text-4xl font-extrabold drop-shadow-md bg-clip-text text-transparent bg-pink-500"
        >
          Welcome
        </div>
        <div class="flex align-end">
          <div
            class="rounded-md shadow-lg h-32 w-[26rem] flex"
            :class="[isDark ? 'bg-black' : 'bg-white']"
          >
            <div class="m-4">
              Welcome to the workplace design showroom. Take a stroll through
              four different workplace scenarios and discover the products that
              make up each space.
            </div>
          </div>
          <button
            type="button"
            class="ml-2 w-24 rounded-full bg-pink-600 pl-4 p-2 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="startExperience"
          >
            Start
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
      <div
        v-else-if="isEndposition"
        class="absolute left-0 bottom-0 w-[32rem] m-4"
      >
        <div class="flex align-end">
          <div
            class="rounded-md shadow-lg h-32 w-[26rem] flex"
            :class="[isDark ? 'bg-black' : 'bg-white']"
          >
            <div class="m-4">
              You've now seen all the products in these four spaces. To learn
              more about creating these experiences, sign up for the devfab.io
              newsletter
              <a
                class="underline decoration-4 decoration-solid decoration-pink-600"
                href="https://subscribepage.io/Rcju8g"
                >here</a
              >.
            </div>
          </div>
          <button
            type="button"
            class="ml-2 w-36 rounded-full bg-pink-600 pl-4 p-2 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="restartExperience"
          >
            Start Over
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
      <div v-else class="absolute left-0 bottom-0 w-[32rem] m-4">
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
            class="ml-2 w-28 rounded-full bg-pink-600 pl-4 p-2 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="nextStep"
          >
            {{ currentstep.isFinal ? "Finish" : "Next" }}
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
    </v-scale-transition>
  </v-responsive>
</template>
