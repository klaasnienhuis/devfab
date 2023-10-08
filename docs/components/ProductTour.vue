<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();

const playersettings = {
  autostart: 1,
  annotation_tooltip_visible: 0,
  scrollwheel: 0,
  ui_controls: 0,
  ui_infos: 0,
  ui_watermark: 0,
  ui_stop: 0,
};

const state = reactive({
  steps: {
    0: { name: "Step 1", status: "upcoming", align: "left" },
    1: { name: "Step 2", status: "upcoming", align: "left" },
    2: { name: "Step 3", status: "upcoming", align: "left" },
    3: { name: "Step 4", status: "upcoming", align: "right" },
    4: { name: "Step 5", status: "upcoming", align: "right" },
    5: { name: "Step 5", status: "upcoming", align: "right" },
  },
});

const viewerIframeRef = ref(null);
const viewerready = ref(false);
const api = ref(null);
const annotationTitle = ref("");
const currentId = ref(0);
const maxId = ref(0);

const currentAlignment = computed(() => state.steps[currentId.value].align);
const showAnnotationDetails = (api, id) => {
  state.steps[id].status = "current";
  api.getAnnotation(id, (err, info) => {
    annotationTitle.value = info.name;
    // elData.innerHTML = info.content.raw;
    // elImage.src = info.preview;
  });
};

const gotoAnnotation = (api, annotationIndex) => {
  api.gotoAnnotation(annotationIndex, {}, (err, id) => {
    showAnnotationDetails(api, id);
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

onMounted(() => {
  import("@sketchfab/viewer-api").then((module) => {
    const client = new module.default("1.12.1", viewerIframeRef.value);
    client.init("e6266e421d354273b46452a189ed66b3", {
      success: (_api) => {
        _api.addEventListener("viewerready", () => {
          _api.getAnnotationList((err, annotations) => {
            maxId.value = annotations.length - 1;
            gotoAnnotation(_api, 0);
          });
          viewerready.value = true;
        });

        _api.addEventListener("annotationSelect", (index) => {
          if (index >= 0) {
            state.steps[currentId.value].status = "complete";
            currentId.value = index;
            showAnnotationDetails(_api, index);
          }
        });
        api.value = _api;
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
    <div class="absolute h-100 w-100 pointer-events-none flex flex-col">
      <div class="h-full w-full pa-4">
        <v-scale-transition>
          <div
            class="bg-white border border-gray-200 h-full w-56 rounded-2xl shadow-lg pointer-events-auto mr-auto"
            v-if="currentAlignment === 'left'"
          >
            <h3 class="mt-0 p-4">
              {{ annotationTitle }}
            </h3>
          </div>
        </v-scale-transition>
        <v-scale-transition>
          <div
            class="bg-white border border-gray-200 h-full w-56 rounded-2xl shadow-lg pointer-events-auto ml-auto"
            v-if="currentAlignment === 'right'"
          >
            <h3 class="mt-0 p-4">
              {{ annotationTitle }}
            </h3>
          </div>
        </v-scale-transition>
      </div>

      <nav
        class="h-16 mt-auto pointer-events-auto flex items-center border-t border-gray-200 bg-white px-2"
        aria-label="Pagination"
      >
        <div
          role="list"
          class="ml-8 w-full flex items-center justify-center space-x-5"
        >
          <div v-for="step in state.steps" :key="step.name">
            <a
              v-if="step.status === 'complete'"
              :href="step.href"
              class="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900"
            >
            </a>
            <a
              v-else-if="step.status === 'current'"
              :href="step.href"
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
              :href="step.href"
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
