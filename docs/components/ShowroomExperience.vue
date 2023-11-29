<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useData } from "vitepress";
import { API, Annotation } from "./types";
const { isDark } = useData();

interface Step {
  name: string;
  annotationname: string;
  body: string;
  button: string;
  img?: string;
  href?: string;
  tab: string;
  branding?: {
    src: string;
    materialname: string;
    uid?: number | null;
  };
  cta?: {
    text: string;
    href: string;
  };
}

interface State {
  annotations: { [key: string]: Annotation };
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

const steps: Step[] = [
  {
    name: "Welcome",
    annotationname: "start",
    body: "Welcome to the workplace design showroom. Take a stroll through four different workplace scenarios and discover the products that make up each space.",
    // img: null,
    // href: null,
    tab: "",
    button: "Start",
  },
  {
    name: "MacBook Pro",
    annotationname: "laptop",
    body: "The new M2 chip makes the 13-inch MacBook Pro more capable than ever.",
    img: "/images/macbook.jpg",
    // href: "https://www.apple.com/macbook-pro-13/",
    tab: "Project",
    branding: {
      src: "https://assets.codepen.io/2407400/macbook-screen.jpg",
      materialname: "screen-macbook",
    },
    button: "Next",
  },
  {
    name: "Space Divider",
    annotationname: "space divider",
    body: "Sculpo Free Standing divides spaces while improving modern visual layout and sound comfort.",
    img: "/images/space-divider.jpg",
    // href: "https://archyi-inspiration.com/en/products/acoustic-solutions/free-standing-sculpo",
    tab: "Project",
    branding: {
      src: "https://assets.codepen.io/2407400/space-divider-screen.jpg",
      materialname: "screen-spacedivider",
    },
    button: "Next",
  },
  {
    name: "Tripod Easel",
    annotationname: "flipchart easel",
    body: "Tripod Easel Angolo is a smart, practical and playful presentation tool inspired in the classic artistic painting easel stand.",
    img: "/images/flipchart-easel.png",
    // href: "https://archyi-inspiration.com/en/collections/angolo",
    tab: "Project",
    branding: {
      src: "https://assets.codepen.io/2407400/easel-screen.png",
      materialname: "screen-easel",
    },
    button: "Next",
  },
  {
    name: "Plants",
    annotationname: "plants",
    body: "Research has shown that plants increase wellbeing, creativity and productivity in the workplace.",
    img: "/images/plants.png",
    // href: "https://www.ikea.com/gb/en/ideas/office-plant-ideas-for-a-greener-workspace-pub1eb570e1",
    tab: "Open Plan",
    button: "Next",
  },
  {
    name: "Copier",
    annotationname: "copier",
    body: "Xerox® ConnectKey® technology enabled Workplace Assistant that can do it all.",
    img: "/images/copier.png",
    // href: "https://www.xerox.co.uk/en-gb/office/multifunction-printers/versalink-c7120-c7125-c7130",
    tab: "Open Plan",
    button: "Next",
  },
  {
    name: "Desk Divider",
    annotationname: "desk divider",
    body: "Desk Sculpo is an ideal solution to divide work spaces creating a visual barrier and acoustic comfort.",
    img: "/images/desk-divider.png",
    // href: "https://archyi-inspiration.com/en/products/acoustic-solutions/desk-sculpo",
    tab: "Open Plan",
    branding: {
      src: "https://assets.codepen.io/2407400/desk-divider-screen.png",
      materialname: "screen-deskdivider",
    },
    button: "Next",
  },
  {
    name: "Meeting Table",
    annotationname: "conference table",
    body: "The Ark white conference table is crafted from a 5 mm solid laminate top on a powder-coated steel base.",
    img: "/images/conference-table.jpg",
    // href: "https://www.spaceist.co.uk/ark-meeting-table-new-detail/",
    tab: "Conference",
    button: "Next",
  },
  {
    name: "Projection Screen",
    annotationname: "beamer screen",
    body: "Acumen® V, an attractive below-the-ceiling projection screen, blends seamlessly in today's elegant interiors.",
    img: "/images/screen.jpg",
    // href: "https://www.draperinc.com/projectionscreens/productdetail/1054/acumen-v",
    tab: "Conference",
    branding: {
      src: "https://assets.codepen.io/2407400/projector-screen.jpg",
      materialname: "screen-projector",
    },
    button: "Next",
  },
  {
    name: "Desk Chair",
    annotationname: "neat chair",
    body: "The Ester leather desk chair is an elegant choice for modern offices providing quintessential style along with comfort.",
    img: "/images/chair.jpg",
    // href: "https://www.spaceist.co.uk/ester-desk-chair-detail/",
    tab: "Conference",
    button: "Next",
  },
  {
    name: "Bar",
    annotationname: "bar",
    body: "Commercial modern canteen table suitable for office break rooms and staff kitchens.",
    img: "/images/bar.jpg",
    // href: "https://www.spaceist.co.uk/camp-canteen-high-table-with-wood-top/",
    tab: "Casual",
    branding: {
      src: "https://assets.codepen.io/2407400/bar-screen.jpg",
      materialname: "screen-bar",
    },
    button: "Next",
  },
  {
    name: "Stool",
    annotationname: "stool",
    body: "5-year warranty, Steel powder coated frame, Matching chair + bench, Modern cafe stool design",
    img: "/images/stool.jpg",
    // href: "https://www.spaceist.co.uk/tea-office-stool/",
    tab: "Casual",
    button: "Next",
  },
  {
    name: "Sofa",
    annotationname: "sofa",
    body: "This designer 2 seater office sofa is part of the popular Buddy wholesale range.",
    img: "/images/sofa.jpg",
    // href: "https://www.spaceist.co.uk/buddy-2-seater-sofa/",
    tab: "Casual",
    branding: {
      src: "https://assets.codepen.io/2407400/sofa-screen.jpg",
      materialname: "screen-sofa",
    },
    button: "Finish",
  },
  {
    name: "End",
    annotationname: "end",
    body: "You've now seen all the products in these four spaces. To learn more about creating these experiences, sign up for the devfab.io newsletter.",
    cta: {
      text: "Sign up",
      href: "https://subscribepage.io/Rcju8g",
    },
    tab: "",
    button: "Again",
  },
];

const tabs = ["Project", "Open Plan", "Conference", "Casual"];

const state: State = reactive({
  annotations: {},
});

const viewerIframeRef = ref(null);
const api = ref<API | undefined>();
const currentstepindex = ref(0);
const currenttabindex = ref(0);
const viewerready = ref(false);

const currenttab = computed(() => {
  return tabs[currenttabindex.value];
});

const currentstep = computed(() => {
  return steps[currentstepindex.value];
});

const currentAnnotation = computed(() => {
  return state.annotations[currentstep.value.annotationname];
});

const setTab = (tabName: string) => {
  currenttabindex.value = tabs.findIndex((tab) => tab === tabName);
  currentstepindex.value = steps.findIndex((step) => step.tab === tabName);
  gotoAnnotation(api.value, currentAnnotation.value);
};

const incrementStepIndex = () => {
  currentstepindex.value++;
  currenttabindex.value = tabs.findIndex(
    (tab) => tab === currentstep.value.tab,
  );
};

const setStep = (doRestart: boolean) => {
  // Manage the step index and state
  if (currentstep.value.annotationname === "start") {
    currenttabindex.value = 0;
    currentstepindex.value = 1;
  } else if (currentstep.value.annotationname === "end" || doRestart === true) {
    currentstepindex.value = 0;
  } else incrementStepIndex();

  // Set the annotation
  const annotation = currentAnnotation.value;
  gotoAnnotation(api.value, annotation);
};

const parseAnnotations = (api: API | undefined): Promise<void> => {
  return new Promise((resolve) => {
    if (!api) return;
    api.getAnnotationList((error, annotationlist) => {
      steps.forEach((step) => {
        const annotation = annotationlist.find(
          (annotation) => annotation.name === step.annotationname,
        );
        if (annotation) {
          state.annotations[step.annotationname] = annotation;
        }
      });
      resolve();
    });
  });
};

const gotoAnnotation = (api: API | undefined, annotation: Annotation) => {
  const settings = {
    usePanConstraints: true,
    target: JSON.parse(JSON.stringify(annotation.target)),
  };
  if (!api) return;
  api.setEnableCameraConstraints(false, {}, () => {
    api.setCameraLookAt(
      JSON.parse(JSON.stringify(annotation.eye)),
      JSON.parse(JSON.stringify(annotation.target)),
      2,
      (err: Error, id: number) => {
        api.setCameraLookAtEndAnimationCallback(() => {
          api.setCameraConstraints(settings, () => {
            api.setEnableCameraConstraints(true, {}, () => {});
          });
        });
      },
    );
  });
};

const brandSpace = (api: API | undefined) => {
  if (!api) return;
  api.getMaterialList((err, materials) => {
    steps.forEach((step) => {
      if (step.branding) {
        api.addTexture(step.branding.src, (err, uid) => {
          const material = materials.find(
            (material) => material.name === step.branding?.materialname,
          );
          if (material) {
            material.channels.AlbedoPBR.texture = { uid };
            material.channels.EmitColor.texture = { uid };
            material.channels.EmitColor.enable = true;
            material.channels.EmitColor.factor = 1;
            api.setMaterial(material, () => {});
          }
        });
      }
    });
  });
};

function gammaCorrectRgb(rgb) {
  return rgb.map((v) => Math.pow(v / 255, 2.2));
}
const setBackground = (api: API | undefined) => {
  if (!api) return;
  const color = gammaCorrectRgb(backgrounds[isDark.value ? "dark" : "light"]);
  const backgroundSetting = { color };
  api.setBackground(backgroundSetting, function (err) {});
};

watch(isDark, () => {
  setBackground(api.value);
});

onMounted(() => {
  import("@sketchfab/viewer-api").then((module) => {
    const client = new module.default("1.12.1", viewerIframeRef.value);
    client.init("e3d3549bae1f4d7e9d0821713b47ea56", {
      success: (_api: API) => {
        api.value = _api;
        _api.addEventListener("viewerready", () => {
          brandSpace(_api);
          parseAnnotations(_api).then(() => {
            gotoAnnotation(_api, currentAnnotation.value);
            viewerready.value = true;
          });
          setBackground(_api);
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
        v-if="
          currentstep.annotationname !== 'start' &&
          currentstep.annotationname !== 'end'
        "
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
              v-for="tab in tabs"
              :key="tab"
              :class="[
                tab === currenttab
                  ? isDark
                    ? 'border-sky-400 text-sky-400'
                    : 'border-sky-700 text-sky-700'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700',

                'w-1/4 border-b-4 py-2.5 px-1 text-center text-md font-normal cursor-pointer',
              ]"
              :aria-current="tab === currenttab ? 'page' : undefined"
              @click="setTab(tab)"
            >
              {{ tab }}
            </div>
          </div>
        </nav>
      </div>
    </v-fade-transition>
    <v-scale-transition>
      <div
        class="absolute left-0 bottom-0 w-[33rem]"
        :class="[
          currentstep.annotationname === 'start'
            ? 'w-100 h-100  flex justify-center items-center bg-gradient-to-t from-black/60 to-neutral-600/40'
            : 'm-4',
        ]"
      >
        <div class="flex align-end">
          <div>
            <div
              v-if="currentstep.annotationname !== 'end'"
              class="text-4xl font-extrabold drop-shadow text-sky-400"
            >
              {{
                currentstep.annotationname === "start"
                  ? "Welcome"
                  : currentstep.name
              }}
            </div>
            <div
              class="rounded-md shadow-lg h-32 w-[26rem]"
              :class="[isDark ? 'bg-neutral-900' : 'bg-neutral-50']"
            >
              <div class="flex">
                <img
                  v-if="currentstep.img"
                  :src="currentstep.img"
                  class="object-contain h-32 w-32"
                />
                <div class="m-2">
                  {{ currentstep.body }}
                  <div v-if="currentstep.cta">
                    <a
                      class="underline decoration-4 decoration-solid decoration-sky-500"
                      :href="currentstep.cta.href"
                      >{{ currentstep.cta.text }}</a
                    >
                  </div>
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
            {{ currentstep.button }}
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
    </v-scale-transition>
  </v-responsive>
</template>
