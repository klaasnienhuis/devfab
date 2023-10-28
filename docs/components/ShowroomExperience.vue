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
  annotations_visible: 0,
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
          name: "MacBook Pro",
          annotation: {
            name: "laptop",
          },
          body: "The new M2 chip makes the 13-inch MacBook Pro more capable than ever.",
          img: "macbook.jpg",
          href: "https://www.apple.com/macbook-pro-13/",
        },
        {
          name: "Space Divider",
          annotation: {
            name: "space divider",
          },
          body: "Sculpo Free Standing divides spaces while improving modern visual layout and sound comfort.",
          img: "space-divider.jpg",
          href: "https://archyi-inspiration.com/en/products/acoustic-solutions/free-standing-sculpo",
        },
        {
          name: "Tripod Easel",
          annotation: {
            name: "flipchart easel",
          },
          body: "Tripod Easel Angolo is a smart, practical and playful presentation tool inspired in the classic artistic painting easel stand.",
          img: "flipchart-easel.png",
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
          body: "Research has shown that plants increase wellbeing, creativity and productivity in the workplace.",
          img: "plants.png",
          href: "https://www.ikea.com/gb/en/ideas/office-plant-ideas-for-a-greener-workspace-pub1eb570e1",
        },
        {
          name: "Copier",
          annotation: {
            name: "copier",
          },
          body: "Xerox® ConnectKey® technology enabled Workplace Assistant that can do it all.",
          img: "copier.png",
          href: "https://www.xerox.co.uk/en-gb/office/multifunction-printers/versalink-c7120-c7125-c7130",
        },
        {
          name: "Desk Divider",
          annotation: {
            name: "desk divider",
          },
          body: "Desk Sculpo is an ideal solution to divide work spaces creating a visual barrier and acoustic comfort.",
          img: "desk-divider.png",
          href: "https://archyi-inspiration.com/en/products/acoustic-solutions/desk-sculpo",
        },
      ],
    },
    {
      name: "Conference",
      current: false,
      steps: [
        {
          name: "Meeting Table",
          annotation: {
            name: "conference table",
          },
          body: "The Ark white conference table is crafted from a 5 mm solid laminate top on a powder-coated steel base.",
          img: "conference-table.jpg",
          href: "https://www.spaceist.co.uk/ark-meeting-table-new-detail/",
        },
        {
          name: "Projection Screen",
          annotation: {
            name: "beamer screen",
          },
          body: "Acumen® V, an attractive below-the-ceiling projection screen, blends seamlessly in today's elegant interiors.",
          img: "screen.jpg",
          href: "https://www.draperinc.com/projectionscreens/productdetail/1054/acumen-v",
        },
        {
          name: "Desk Chair",
          annotation: {
            name: "neat chair",
          },
          body: "The Ester leather desk chair is an elegant choice for modern offices providing quintessential style along with comfort.",
          img: "chair.jpg",
          href: "https://www.spaceist.co.uk/ester-desk-chair-detail/",
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
          body: "Commercial modern canteen table suitable for office break rooms and staff kitchens.",
          img: "bar.jpg",
          href: "https://www.spaceist.co.uk/camp-canteen-high-table-with-wood-top/",
        },
        {
          name: "Stool",
          annotation: {
            name: "stool",
          },
          body: "5-year warranty, Steel powder coated frame, Matching chair + bench, Modern cafe stool design",
          img: "stool.jpg",
          href: "https://www.spaceist.co.uk/tea-office-stool/",
        },
        {
          name: "Sofa",
          isFinal: true,
          annotation: {
            name: "sofa",
          },
          body: "This designer 2 seater office sofa is part of the popular Buddy wholesale range.",
          img: "sofa.jpg",
          href: "https://www.spaceist.co.uk/buddy-2-seater-sofa/",
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
const viewerready = ref(false);

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
            viewerready.value = true;
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
  <v-responsive aspect-ratio="1.2" class="w-100">
    <iframe
      style="border: 0"
      id="api-iframe"
      ref="viewerIframeRef"
      class="w-100 h-100 absolute"
    ></iframe>
    <v-fade-transition>
      <div
        v-if="!isStartposition && !isEndposition"
        class="absolute w-100 border-b border-gray-200"
        :class="[isDark ? 'bg-neutral-900' : 'bg-neutral-50']"
      >
        <nav class="-mb-px h-12" aria-label="Tabs">
          <div class="flex">
            <v-icon
              color="grey-darken-2"
              class="w-12 mt-3 mx-3"
              @click="restartExperience"
              >mdi-home</v-icon
            >
            <div
              v-for="tab in state.tabs"
              :key="tab.name"
              :class="[
                tab.name === currenttab.name
                  ? isDark
                    ? 'border-sky-400 text-sky-400'
                    : 'border-sky-700 text-sky-700'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700',

                'w-1/4 border-b-4 py-2.5 px-1 text-center text-md font-normal cursor-pointer',
              ]"
              :aria-current="tab.name === currenttab.name ? 'page' : undefined"
              @click="setTab(tab.name)"
            >
              {{ tab.name }}
            </div>
          </div>
        </nav>
      </div>
    </v-fade-transition>
    <v-scale-transition>
      <div
        v-if="isStartposition"
        class="absolute w-100 h-100 flex justify-center items-center bg-gradient-to-t from-black/50 to-neutral-500/50"
      >
        <div>
          <div
            class="text-4xl font-extrabold drop-shadow-md bg-clip-text text-transparent bg-neutral-50"
          >
            Welcome
          </div>
          <div class="flex align-end">
            <div
              class="rounded-md shadow-lg h-32 w-[26rem] flex flex-col"
              :class="[isDark ? 'bg-neutral-900' : 'bg-neutral-50']"
            >
              <div class="m-3">
                Welcome to the workplace design showroom. Take a stroll through
                four different workplace scenarios and discover the products
                that make up each space.
              </div>
              <v-progress-linear
                v-if="!viewerready"
                indeterminate
                height="8"
                color="light-blue-lighten-1"
              ></v-progress-linear>
            </div>
            <button
              v-if="viewerready"
              type="button"
              class="ml-2 w-24 rounded-full bg-sky-500 pl-4 p-2 text-white shadow-sm hover:bg-sky-400"
              @click="startExperience"
            >
              Start
              <v-icon>mdi-chevron-right</v-icon>
            </button>
          </div>
        </div>
      </div>
      <div
        v-else-if="isEndposition"
        class="absolute left-0 bottom-0 w-[32rem] m-4"
      >
        <div class="flex align-end">
          <div
            class="rounded-md shadow-lg h-32 w-[26rem] flex"
            :class="[isDark ? 'bg-neutral-900' : 'bg-white']"
          >
            <div class="m-4">
              You've now seen all the products in these four spaces. To learn
              more about creating these experiences, sign up for the devfab.io
              newsletter
              <a
                class="underline decoration-4 decoration-solid decoration-sky-500"
                href="https://subscribepage.io/Rcju8g"
                >here</a
              >.
            </div>
          </div>
          <button
            type="button"
            class="ml-2 w-36 rounded-full bg-sky-500 pl-4 p-2 text-white shadow-sm hover:bg-sky-400"
            @click="restartExperience"
          >
            Start Over
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
      <div v-else class="absolute left-0 bottom-0 w-[33rem] m-4">
        <div class="flex align-end">
          <div>
            <div class="text-4xl font-extrabold drop-shadow text-sky-400">
              {{ currentstep.name }}
            </div>
            <div
              class="rounded-md shadow-lg h-32 w-[26rem] flex"
              :class="[isDark ? 'bg-neutral-900' : 'bg-neutral-50']"
            >
              <img :src="currentstep.img" class="object-contain h-32 w-32" />
              <div class="m-2">
                {{ currentstep.body }}
              </div>
            </div>
          </div>
          <button
            type="button"
            class="ml-2 w-32 rounded-full bg-sky-500 pl-4 p-2 text-white shadow-sm hover:bg-sky-400"
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
