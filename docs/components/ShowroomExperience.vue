<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useData } from "vitepress";
import { API, Annotation } from "./types";
const { isDark } = useData();

interface AnnotationWrapper {
  name: string;
  payload?: Annotation;
}
interface Tab {
  name: string;
  current: boolean;
}
interface Step {
  name: string;
  annotation: AnnotationWrapper;
  body: string;
  img: string;
  href: string;
  tab: string;
}
interface State {
  bookendannotation: AnnotationWrapper;
  tabs: Tab[];
  steps: Step[];
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

const backgrounds = {
  light: [255, 255, 255],
  dark: [97, 97, 100],
};
const state: State = reactive({
  bookendannotation: {
    name: "start",
  },
  tabs: [
    {
      name: "Project",
      current: true,
    },
    {
      name: "Open Plan",
      current: false,
    },
    {
      name: "Conference",
      current: false,
    },
    {
      name: "Casual",
      current: false,
    },
  ],
  steps: [
    {
      name: "MacBook Pro",
      annotation: {
        name: "laptop",
      },
      body: "The new M2 chip makes the 13-inch MacBook Pro more capable than ever.",
      img: "macbook.jpg",
      href: "https://www.apple.com/macbook-pro-13/",
      tab: "Project",
    },
    {
      name: "Space Divider",
      annotation: {
        name: "space divider",
      },
      body: "Sculpo Free Standing divides spaces while improving modern visual layout and sound comfort.",
      img: "space-divider.jpg",
      href: "https://archyi-inspiration.com/en/products/acoustic-solutions/free-standing-sculpo",
      tab: "Project",
    },
    {
      name: "Tripod Easel",
      annotation: {
        name: "flipchart easel",
      },
      body: "Tripod Easel Angolo is a smart, practical and playful presentation tool inspired in the classic artistic painting easel stand.",
      img: "flipchart-easel.png",
      href: "https://archyi-inspiration.com/en/collections/angolo",
      tab: "Project",
    },
    {
      name: "Plants",
      annotation: {
        name: "plants",
      },
      body: "Research has shown that plants increase wellbeing, creativity and productivity in the workplace.",
      img: "plants.png",
      href: "https://www.ikea.com/gb/en/ideas/office-plant-ideas-for-a-greener-workspace-pub1eb570e1",
      tab: "Open Plan",
    },
    {
      name: "Copier",
      annotation: {
        name: "copier",
      },
      body: "Xerox® ConnectKey® technology enabled Workplace Assistant that can do it all.",
      img: "copier.png",
      href: "https://www.xerox.co.uk/en-gb/office/multifunction-printers/versalink-c7120-c7125-c7130",
      tab: "Open Plan",
    },
    {
      name: "Desk Divider",
      annotation: {
        name: "desk divider",
      },
      body: "Desk Sculpo is an ideal solution to divide work spaces creating a visual barrier and acoustic comfort.",
      img: "desk-divider.png",
      href: "https://archyi-inspiration.com/en/products/acoustic-solutions/desk-sculpo",
      tab: "Open Plan",
    },
    {
      name: "Meeting Table",
      annotation: {
        name: "conference table",
      },
      body: "The Ark white conference table is crafted from a 5 mm solid laminate top on a powder-coated steel base.",
      img: "conference-table.jpg",
      href: "https://www.spaceist.co.uk/ark-meeting-table-new-detail/",
      tab: "Conference",
    },
    {
      name: "Projection Screen",
      annotation: {
        name: "beamer screen",
      },
      body: "Acumen® V, an attractive below-the-ceiling projection screen, blends seamlessly in today's elegant interiors.",
      img: "screen.jpg",
      href: "https://www.draperinc.com/projectionscreens/productdetail/1054/acumen-v",
      tab: "Conference",
    },
    {
      name: "Desk Chair",
      annotation: {
        name: "neat chair",
      },
      body: "The Ester leather desk chair is an elegant choice for modern offices providing quintessential style along with comfort.",
      img: "chair.jpg",
      href: "https://www.spaceist.co.uk/ester-desk-chair-detail/",
      tab: "Conference",
    },
    {
      name: "Bar",
      annotation: {
        name: "bar",
      },
      body: "Commercial modern canteen table suitable for office break rooms and staff kitchens.",
      img: "bar.jpg",
      href: "https://www.spaceist.co.uk/camp-canteen-high-table-with-wood-top/",
      tab: "Casual",
    },
    {
      name: "Stool",
      annotation: {
        name: "stool",
      },
      body: "5-year warranty, Steel powder coated frame, Matching chair + bench, Modern cafe stool design",
      img: "stool.jpg",
      href: "https://www.spaceist.co.uk/tea-office-stool/",
      tab: "Casual",
    },
    {
      name: "Sofa",
      annotation: {
        name: "sofa",
      },
      body: "This designer 2 seater office sofa is part of the popular Buddy wholesale range.",
      img: "sofa.jpg",
      href: "https://www.spaceist.co.uk/buddy-2-seater-sofa/",
      tab: "Casual",
    },
  ],
});

const viewerIframeRef = ref(null);
const api = ref<API | undefined>();
const currentstepindex = ref(0);
const currenttabindex = ref(0);
const stepType = ref("start");
const viewerready = ref(false);

const currenttab = computed(() => {
  return state.tabs[currenttabindex.value];
});

const currentstep = computed(() => {
  return state.steps[currentstepindex.value];
});

const ctaButtonText = computed(() => {
  return stepType.value === "start"
    ? "Start"
    : stepType.value === "end"
    ? "Again"
    : currentstepindex.value === state.steps.length - 1
    ? "Finish"
    : "Next";
});

const setTab = (tabName: string) => {
  currenttabindex.value = state.tabs.findIndex((tab) => tab.name === tabName);
  currentstepindex.value = state.steps.findIndex(
    (step) => step.tab === tabName,
  );
  gotoAnnotation(api.value, state.steps[currentstepindex.value].annotation);
};

const incrementStepIndex = () => {
  currentstepindex.value++;
  currenttabindex.value = state.tabs.findIndex(
    (tab) => tab.name === currentstep.value.tab,
  );
};

const setStep = (doRestart: boolean) => {
  // Manage the step index and state
  if (stepType.value === "start") {
    currenttabindex.value = 0;
    currentstepindex.value = 0;
    stepType.value = "step";
  } else if (stepType.value === "end" || doRestart === true)
    stepType.value = "start";
  else if (currentstepindex.value === state.steps.length - 1)
    stepType.value = "end";
  else incrementStepIndex();

  // Set the annotation
  const annotation =
    stepType.value === "step"
      ? state.steps[currentstepindex.value].annotation
      : state.bookendannotation;
  gotoAnnotation(api.value, annotation);
};

const parseAnnotations = (api: API): Promise<void> => {
  return new Promise((resolve) => {
    api.getAnnotationList((err, annotations) => {
      state.steps.forEach((step) => {
        const annotation = annotations.find(
          (annotation) => annotation.name === step.annotation.name,
        );
        if (annotation) {
          step.annotation.payload = annotation;
        }
      });

      state.bookendannotation.payload = annotations.find(
        (annotation) => annotation.name === state.bookendannotation.name,
      );
      resolve();
    });
  });
};

const gotoAnnotation = (api, annotation) => {
  const settings = {
    usePanConstraints: true,
    target: JSON.parse(JSON.stringify(annotation.payload.target)),
  };
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
function gammaCorrectRgb(rgb) {
  return rgb.map((v) => Math.pow(v / 255, 2.2));
}
const setBackground = () => {
  const color = gammaCorrectRgb(backgrounds[isDark.value ? "dark" : "light"]);
  const backgroundSetting = { color };
  if (api.value) api.value.setBackground(backgroundSetting, function (err) {});
};
watch(isDark, () => {
  setBackground();
});
onMounted(() => {
  import("@sketchfab/viewer-api").then((module) => {
    const client = new module.default("1.12.1", viewerIframeRef.value);
    client.init("e3d3549bae1f4d7e9d0821713b47ea56", {
      success: (_api) => {
        api.value = _api;
        _api.addEventListener("viewerready", () => {
          parseAnnotations(_api).then(() => {
            gotoAnnotation(api.value, state.bookendannotation);
            viewerready.value = true;
          });
          setBackground();
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
        v-if="stepType === 'step'"
        class="absolute w-100 border-b border-gray-200"
        :class="[isDark ? 'bg-neutral-900' : 'bg-neutral-50']"
      >
        <nav class="-mb-px h-12" aria-label="Tabs">
          <div class="flex">
            <v-icon
              color="grey-darken-2"
              class="w-12 mt-3 mx-3"
              @click="setStep(true)"
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
        class="absolute left-0 bottom-0 w-[33rem]"
        :class="[
          stepType === 'start'
            ? 'w-100 h-100  flex justify-center items-center bg-gradient-to-t from-black/60 to-neutral-600/40'
            : 'm-4',
        ]"
      >
        <div class="flex align-end">
          <div>
            <div
              v-if="stepType !== 'end'"
              class="text-4xl font-extrabold drop-shadow text-sky-400"
            >
              {{ stepType === "start" ? "Welcome" : currentstep.name }}
            </div>
            <div
              class="rounded-md shadow-lg h-32 w-[26rem]"
              :class="[isDark ? 'bg-neutral-900' : 'bg-neutral-50']"
            >
              <div v-if="stepType === 'start'" class="p-3">
                Welcome to the workplace design showroom. Take a stroll through
                four different workplace scenarios and discover the products
                that make up each space.
              </div>
              <div v-else-if="stepType === 'end'" class="p-3">
                You've now seen all the products in these four spaces. To learn
                more about creating these experiences, sign up for the devfab.io
                newsletter
                <a
                  class="underline decoration-4 decoration-solid decoration-sky-500"
                  href="https://subscribepage.io/Rcju8g"
                  >here</a
                >.
              </div>
              <div v-else class="flex">
                <img :src="currentstep.img" class="object-contain h-32 w-32" />
                <div class="m-2">
                  {{ currentstep.body }}
                </div>
              </div>
            </div>
          </div>
          <button
            v-if="viewerready"
            type="button"
            class="ml-2 rounded-full bg-sky-500 pl-4 p-2 text-white shadow-sm hover:bg-sky-400"
            @click="setStep(false)"
          >
            {{ ctaButtonText }}
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
    </v-scale-transition>
  </v-responsive>
</template>
