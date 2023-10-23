<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useData } from "vitepress";
import { API, Annotation, Material, Node } from "./types";
const { isDark } = useData();

interface Toggle {
  objects: string[];
  title: string;
  state: boolean;
  ids: number[];
}
interface Step {
  title: string;
  status: string;
  align: string;
  text: string;
  src?: string;
  toggle?: Toggle;
  colors?: boolean;
}

interface State {
  steps: {
    [key: number]: Step;
  };
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

const colors = {
  silver: { rgb: [157, 157, 157], hex: "#c4c4c4" },
  sunrise: { rgb: [214, 164, 67], hex: "#d6a443" },
  lagoon: { rgb: [53, 113, 137], hex: "#357189" },
};

const backgrounds = {
  light: [255, 255, 255],
  dark: [97, 97, 100],
};

const state: State = reactive({
  steps: {
    0: {
      title: "4040X General Examination Table",
      status: "upcoming",
      align: "right",
      text: "A new, versatile general examination table. The all-new 4040X general examination table is suitable for general examinations in different healthcare facilities",
    },
    1: {
      title: "Side rails",
      status: "upcoming",
      align: "left",
      text: "",
      src: "./side-rails.jpg",
      toggle: {
        objects: ["handle"],
        title: "Side rails",
        state: true,
        ids: [],
      },
    },
    2: {
      title: "Foot control",
      status: "upcoming",
      align: "left",
      text: "A two-piece hands-free height adjustment bar is available as an option, enabling the table height and back section to be adjusted from both sides of the table by foot.",
    },
    3: {
      title: "Central locking castors",
      status: "upcoming",
      align: "left",
      text: "Central locking conductive twin castors Ø125 mm or Ø 150 mm",
    },
    4: {
      title: "Trendelenburg adjustment",
      status: "upcoming",
      align: "right",
      text: "Manual Trendelenburg adjustment (max. 12°) with lever at foot end",
      src: "./trendelenburg.jpg",
    },
    5: {
      title: "Paper roll stand",
      status: "upcoming",
      align: "right",
      text: "Paper roll stand and cutter",
      toggle: {
        objects: ["paper"],
        title: "Paper roll",
        state: true,
        ids: [],
      },
    },
    6: {
      title: "Upholstery",
      status: "upcoming",
      align: "right",
      text: "Featuring a slightly pearlescent finish, the stylish Future is an environmentally friendly and fire safety tested upholstery material in the Lojer upholstery range. Its antibacterial, antimicrobial and mold-proofing.",
      colors: true,
    },
  },
});

const viewerIframeRef = ref(null);
const api = ref<API | undefined>();
const annotationTitle = ref("");
const annotationText = ref("");
const annotationSrc = ref<string | undefined>();
const annotationToggle = ref<Toggle | undefined>();
const annotationColors = ref<boolean | undefined>();
const annotationList = ref<Annotation[]>([]);
const currentId = ref(0);
const maxId = ref(0);
const skaiMaterial = ref<Material | undefined>();
const productTour = ref<HTMLElement>();

const currentAlignment = computed(() => state.steps[currentId.value].align);
const clientWidth = computed(() => productTour.value?.clientWidth);

const showAnnotationDetails = (api, id) => {
  state.steps[id].status = "current";
  annotationTitle.value = state.steps[id].title;
  annotationText.value = state.steps[id].text;
  annotationSrc.value = state.steps[id].src;
  annotationToggle.value = state.steps[id].toggle;
  annotationColors.value = state.steps[id].colors;
};

const gotoAnnotation = (api, annotationIndex) => {
  const settings = {
    usePanConstraints: true,
    target: JSON.parse(
      JSON.stringify(annotationList.value[annotationIndex].target),
    ),
  };
  showAnnotationDetails(api, annotationIndex);
  api.setEnableCameraConstraints(false, {}, () => {
    api.setCameraLookAt(
      JSON.parse(JSON.stringify(annotationList.value[annotationIndex].eye)),
      JSON.parse(JSON.stringify(annotationList.value[annotationIndex].target)),
      1,
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

const nextAnnotation = () => {
  state.steps[currentId.value].status = "complete";
  currentId.value = currentId.value === maxId.value ? 0 : currentId.value + 1;
  gotoAnnotation(api.value, currentId.value);
};

const previousAnnotation = () => {
  state.steps[currentId.value].status = "complete";
  currentId.value = currentId.value === 0 ? maxId.value : currentId.value - 1;
  gotoAnnotation(api.value, currentId.value);
};

const setAnnotationsTexture = () => {
  const settings = {
    url: `${location.origin}/images/hotspot-blue.png`,
    colNumber: 0,
    padding: 0,
    iconSize: 126,
  };
  api.value?.setAnnotationsTexture(settings);
};

function gammaCorrectRgb(rgb) {
  return rgb.map((v) => Math.pow(v / 255, 2.2));
}

const applyColors = async (colorname) => {
  // gamma correct colors and load texture
  const maincolor = gammaCorrectRgb(colors[colorname].rgb);
  if (skaiMaterial.value)
    skaiMaterial.value.channels.AlbedoPBR.color = maincolor;
  // apply the adjusted materials to the scene
  api.value?.setMaterial(JSON.parse(JSON.stringify(skaiMaterial.value)));
};

const filterNodes = (nodemap: Node[], name) => {
  return Object.values(nodemap).filter((node) => {
    return node.name === name && node.type === "MatrixTransform";
  });
};

const setBackground = () => {
  const color = gammaCorrectRgb(backgrounds[isDark.value ? "dark" : "light"]);
  const backgroundSetting = { color };
  api.value?.setBackground(backgroundSetting, function (err) {});
};

const toggleStep = () => {
  const toggle = state.steps[currentId.value].toggle;
  if (!toggle) return;
  if (toggle.state) {
    toggle.ids.forEach((id) => {
      api.value?.hide(id);
    });
  } else {
    toggle.ids.forEach((id) => {
      api.value?.show(id);
    });
  }
  toggle.state = !toggle.state;
};

watch(isDark, () => {
  setBackground();
});

onMounted(() => {
  import("@sketchfab/viewer-api").then((module) => {
    const client = new module.default("1.12.1", viewerIframeRef.value);
    client.init("e6266e421d354273b46452a189ed66b3", {
      success: (_api) => {
        api.value = _api;
        _api.addEventListener("viewerready", () => {
          _api.getAnnotationList((err, annotations) => {
            annotationList.value = annotations;
            maxId.value = annotations.length - 1;
            gotoAnnotation(_api, 0);
          });

          _api.getMaterialList((err, materials) => {
            skaiMaterial.value = materials.find((m) => m.name === "Skai");
            applyColors("silver");
          });

          _api.getNodeMap(function (err, nodeMap: Node[]) {
            Object.keys(state.steps).forEach((key) => {
              if (state.steps[key].toggle) {
                state.steps[key].toggle.objects.forEach((object) => {
                  const nodes = filterNodes(nodeMap, object);
                  if (nodes) {
                    nodes.forEach((node) => {
                      state.steps[key].toggle.ids.push(node.instanceID);
                    });
                  }
                });
              }
            });
          });

          setAnnotationsTexture();

          _api.setAnnotationCameraTransition(false, true);

          setBackground();
        });
        _api.addEventListener("annotationSelect", (index) => {
          if (index >= 0) {
            state.steps[currentId.value].status = "complete";
            currentId.value = index;
            gotoAnnotation(_api, currentId.value);
          }
        });
      },
      error: () => console.error("Sketchfab API error"),
      ...playersettings,
    });
  });
});
</script>

<template>
  <v-responsive :aspect-ratio="4 / 3" class="w-100">
    <iframe
      style="border: 0"
      id="api-iframe"
      ref="viewerIframeRef"
      class="w-100 h-100 absolute"
    ></iframe>
    <div
      class="absolute h-100 w-100 pointer-events-none flex flex-col"
      ref="productTour"
    >
      <div
        class="h-full w-full pa-4 flex"
        :class="[{ 'items-center': clientWidth > 900 }]"
      >
        <v-scale-transition>
          <div
            class="border border-gray-200 rounded-2xl shadow-lg pointer-events-auto"
            :class="[
              isDark
                ? 'bg-gray-800 ring-white/10'
                : 'bg-gray-100 ring-black/10',
              currentAlignment === 'left' ? 'mr-auto' : 'ml-auto',
              clientWidth < 900 ? 'w-56 h-full' : 'w-96 h-96 mx-12',
            ]"
          >
            <h3 class="my-0 p-4">
              {{ annotationTitle }}
            </h3>
            <p class="px-4 my-0 text-sm">
              {{ annotationText }}
            </p>
            <v-img
              v-if="annotationSrc"
              :src="annotationSrc"
              class="w-full"
            ></v-img>
            <v-switch
              v-if="annotationToggle"
              v-model="annotationToggle.state"
              class="m-4"
              color="indigo"
              hide-details
              inset
              @click="toggleStep()"
              :label="annotationToggle.title"
            ></v-switch>
            <div v-if="annotationColors" class="flex justify-evenly">
              <v-btn
                v-for="(color, index) in colors"
                :key="index"
                :color="color.hex"
                variant="flat"
                width="64"
                height="64"
                @click="applyColors(index)"
              >
              </v-btn>
            </div>
          </div>
        </v-scale-transition>
      </div>

      <nav
        class="h-16 mt-auto pointer-events-auto flex items-center border-t border-gray-200 px-2"
        :class="[
          isDark ? 'bg-gray-800 ring-white/10' : 'bg-gray-100 ring-black/10',
        ]"
        aria-label="Pagination"
      >
        <div
          role="list"
          class="ml-8 w-full flex items-center justify-center space-x-5"
        >
          <div v-for="step in state.steps" :key="step.title">
            <a
              v-if="step.status === 'complete'"
              class="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900"
            >
            </a>
            <a
              v-else-if="step.status === 'current'"
              class="relative flex items-center justify-center"
              aria-current="step"
            >
              <span class="absolute flex h-5 w-5 p-px" aria-hidden="true">
                <span class="h-full w-full rounded-full bg-indigo-200" />
              </span>
              <span
                class="relative block h-2.5 w-2.5 rounded-full bg-indigo-600"
                aria-hidden="true"
              />
            </a>
            <a
              v-else
              class="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400"
            >
            </a>
          </div>
        </div>
        <div class="flex flex-1 justify-end ml-auto space-x-2">
          <v-btn variant="outlined" size="small" @click="previousAnnotation"
            >Previous</v-btn
          >
          <v-btn variant="outlined" size="small" @click="nextAnnotation"
            >Next</v-btn
          >
        </div>
      </nav>
    </div>
  </v-responsive>
</template>
