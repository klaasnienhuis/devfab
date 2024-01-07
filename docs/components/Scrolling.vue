<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useData } from "vitepress";
import { API, Annotation, Material, Node } from "./types";
const { isDark } = useData();
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { marked } from "marked";

gsap.registerPlugin(ScrollTrigger);

interface ScrollableAnnotation {
  ex: number;
  ey: number;
  ez: number;
  tx: number;
  ty: number;
  tz: number;
  lat: number;
  lon: number;
  radius: number;
  index: number;
  duration?: number;
}

const playersettings = {
  autostart: 1,
  annotation_tooltip_visible: 0,
  scrollwheel: 0,
  ui_controls: 0,
  ui_infos: 0,
  ui_watermark: 0,
  ui_stop: 0,
  double_click: 0,
  ui_hint: 0,
  camera: 0,
  annotations_visible: 0,
};
const viewerIframeRef = ref(null);
const api = ref<API | undefined>();
const annotationList = ref<Annotation[]>([]);

const state = reactive({
  annotation: {} as Annotation,
  hotspot: {
    x: -100,
    y: -100,
  },
  progress: 0,
});

const hotspotStyle = computed(() => {
  return {
    transform: `translate(${state.hotspot.x.toFixed(
      0,
    )}px, ${state.hotspot.y.toFixed(0)}px)`,
  };
});

const markdownToHtml = (markdown: string) => {
  return marked.parse(markdown);
};

const getHotspotPosition = (api: API, pos: number[]) => {
  // const pos = [position3d.X, position3d.Y, position3d.Z]
  return new Promise((resolve, reject) => {
    api.getWorldToScreenCoordinates(
      JSON.parse(JSON.stringify(pos)),
      (coord: any) => {
        if (coord.canvasCoord === undefined) {
          resolve({ x: -100, y: -100 });
        } else {
          resolve({ x: coord.canvasCoord[0], y: coord.canvasCoord[1] });
        }
      },
    );
  });
};
const subtractPositions = (position1: number[], position2: number[]) => {
  const dx = position2[0] - position1[0];
  const dy = position2[1] - position1[1];
  const dz = position2[2] - position1[2];
  return [dx, dy, dz];
};

const toLatLon = (position: number[], target: number[]) => {
  const vector = subtractPositions(target, position);
  const lat = Math.atan2(
    vector[2],
    Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]),
  );
  const lon = Math.atan2(vector[1], vector[0]);
  return [lat, lon];
};

const getDistance = (position1: number[], position2: number[]) => {
  const dx = position2[0] - position1[0];
  const dy = position2[1] - position1[1];
  const dz = position2[2] - position1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const toPosition = (
  lat: number,
  lon: number,
  distance: number,
  target: number[],
) => {
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const sinLon = Math.sin(lon);
  const cosLon = Math.cos(lon);

  const x = cosLat * cosLon;
  const y = cosLat * sinLon;
  const z = sinLat;

  return [
    target[0] + x * distance,
    target[1] + y * distance,
    target[2] + z * distance,
  ];
};

onMounted(() => {
  import("@sketchfab/viewer-api").then((module) => {
    const client = new module.default("1.12.1", viewerIframeRef.value);
    client.init("e4dd6d342fa044b99732b484985797b6", {
      success: (_api: API) => {
        api.value = _api;
        _api.addEventListener("viewerready", () => {
          _api.getAnnotationList((_err, annotations: Annotation[]) => {
            console.log("annotations", annotations);
            annotationList.value = annotations;
            const latlon = toLatLon(annotations[0].eye, annotations[0].target);
            const radius = getDistance(
              annotations[0].eye,
              annotations[0].target,
            );
            const scrollableAnnotation: ScrollableAnnotation = {
              ex: annotations[0].eye[0],
              ey: annotations[0].eye[1],
              ez: annotations[0].eye[2],
              tx: annotations[0].target[0],
              ty: annotations[0].target[1],
              tz: annotations[0].target[2],
              lat: latlon[0],
              lon: latlon[1],
              radius,
              index: 0,
            };
            _api.setCameraLookAt(
              annotations[0].eye,
              annotations[0].target,
              0,
              (_err: Error) => {},
            );
            state.annotation = annotations[0];
            const timeline = gsap.timeline({});
            annotationList.value.forEach(
              (annotation: Annotation, n: number) => {
                if (n !== 0) {
                  const latlon = toLatLon(annotation.eye, annotation.target);
                  const radius = getDistance(annotation.eye, annotation.target);
                  timeline.to(scrollableAnnotation, {
                    duration: 1,
                    ex: annotation.eye[0],
                    ey: annotation.eye[1],
                    ez: annotation.eye[2],
                    tx: annotation.target[0],
                    ty: annotation.target[1],
                    tz: annotation.target[2],
                    lat: latlon[0],
                    lon: latlon[1],
                    radius,
                    index: n,
                    ease: "power3.inOut",
                  });
                }
              },
            );
            // Setup the ScrollTrigger with the animation timeline
            ScrollTrigger.create({
              trigger: "#scroller",
              start: "top top",
              end: "+=6000px bottom",
              pin: "#iframe-wrapper",
              pinSpacer: "#pin-spacer",
              scrub: true,
              animation: timeline,
              toggleActions: "play none reverse reset",
              // Set the camera look-at position on every update and set the caption text
              onUpdate: (self) => {
                state.progress = self.progress * 100;
                const currentIndex =
                  self.direction === 1
                    ? Math.floor(scrollableAnnotation.index + 0.2)
                    : Math.ceil(scrollableAnnotation.index - 0.2);
                state.annotation = annotationList.value[currentIndex];
                if (currentIndex < annotationList.value.length - 1) {
                  _api.setUserInteraction(false);
                  const hotSpotPos = state.annotation.position;
                  getHotspotPosition(_api, hotSpotPos).then((pos) => {
                    state.hotspot = pos;
                  });
                } else {
                  _api.setUserInteraction(false);
                  state.hotspot = {
                    x: -100,
                    y: -100,
                  };
                }
                const target = [
                  scrollableAnnotation.tx,
                  scrollableAnnotation.ty,
                  scrollableAnnotation.tz,
                ];
                const pos = toPosition(
                  scrollableAnnotation.lat,
                  scrollableAnnotation.lon,
                  scrollableAnnotation.radius,
                  target,
                );
                _api.setCameraLookAt(pos, target, 0, (_err: Error) => {});
              },
            });
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
  <div class="flex flex-col place-items-center bg-neutral-900 text-white">
    <a class="back ml-4 mt-4 mr-auto" href="./scrolling">
      &larr; Back to main page
    </a>
    <div class="text-4xl my-12">Statue of A'a</div>
    <div class="text-xl mb-8 animate-bounce">
      Scroll down to explore the project
      <v-icon :dark="true" icon="mdi-arrow-down"></v-icon>
    </div>
    <div class="sm:w-96 lg:w-[40rem] mb-12 mt-4 mx-12">
      <p class="mb-6 text-white/80">
        The Asahi Shimbun Displays: Containing the divine a sculpture of the
        Pacific god A'a
      </p>
      <p class="mb-6 text-white/80">
        This example project on devfab.io uses the annotations that are stored
        in the Sketchfab model and presents them in a scrollable format.
      </p>
      <p class="mb-6 text-white/80">
        One of the Pacific's most famous sculptures, this is a figure of a
        creator god, probably A'a, of the island of Rurutu in the Austral
        Islands. Its features are formed of thirty small human figures -
        appropriate for a god of creation. A'a was carved with a hollow head and
        torso covered by a panel at the back. The cavity may have been designed
        to hold the skull and bones of a deified ancestor. The British Museum
        acknowledges contemporary cultural perspectives associated with the
        objects in its collection. Please note: cultural rights may apply to
        this object.
      </p>
    </div>
  </div>

  <div id="scroller" class="bg-neutral-900">
    <div id="pin-spacer" class="">
      <div id="iframe-wrapper" class="pointer-events-auto w-screen h-screen">
        <div
          id="hotspot-wrapper"
          class="absolute w-full h-full top-0 left-0 pointer-events-none"
        >
          <div
            class="absolute w-12 h-12 -left-6 -top-6 rounded-full bg-yellow-600/90 ring-4 ring-white animate-pulse"
            :style="hotspotStyle"
          ></div>
        </div>
        <div
          class="caption bg-neutral-800/80 p-2 sm:p-6 absolute bottom-1 left-0 sm:m-6 sm:rounded-2xl sm:max-w-sm"
        >
          <div
            class="text-lg sm:text-2xl text-white font-semibold mb-2 sm:mb-4"
          >
            {{ state.annotation.name }}
          </div>
          <div
            v-if="state.annotation.content"
            class="text-sm sm:text-base text-neutral-200 relative max-h-48 sm:max-h-80 overflow-y-auto"
            v-html="markdownToHtml(state.annotation.content.raw)"
          ></div>
        </div>
        <div class="absolute w-full bottom-0 bg-neutral-900">
          <v-progress-linear
            height="4"
            color="yellow-darken-3"
            :model-value="state.progress"
          ></v-progress-linear>
        </div>
        <iframe
          allow="autoplay; fullscreen; vr"
          ref="viewerIframeRef"
          class="w-screen h-screen pointer-events-none"
          allowvr
          allowfullscreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        ></iframe>
      </div>
    </div>
  </div>
  <div
    id="text-block"
    class="flex flex-col place-items-center bg-neutral-900 text-white"
  >
    <div class="sm:w-96 lg:w-[40rem] my-16 mx-12">
      <p class="mb-6 text-white/80">
        3D model by Thomas Flynn, Canon G7x + Agisoft Photoscan
      </p>
      <div class="text-2xl mb-2">Description</div>
      <p class="mb-6 text-white/80">
        God figure known as A'a, carved in anthropomorphic form with 30 small
        figures over surface of the body and making up the facial features. A
        lidded cavity in back.
      </p>
      <div class="text-2xl mb-2">Production date</div>
      <p class="mb-6 text-white/80">
        17thC (before 1821 (see curatorial comments)) (before 1821 (see
        curatorial comments))
      </p>
      <div class="text-2xl mb-2">Dimensions</div>
      <div class="mb-6 text-white/80">
        <p>Height: 116.80 centimetres</p>
        <p>Width: 36 centimetres</p>
        <p>Depth: 36 centimetres</p>
      </div>
      <div class="text-2xl mb-2">Curator's comments</div>
      <p class="mb-6 text-white/80">
        In November 2015, wood samples taken from inside the figure were tested
        by British Museum scientists and found to be Sandalwood. The wood was
        too deteriorated to be definitive about the species but it is likely to
        be Santalum insulare. This information was fed back to the island of
        Rurutu and the Council of Elders met to discuss it. The Elders chose not
        to accept the Sandalwood finding, preferring to uphold their own
        histories which state that A'a was carved from pua wood (Fagraea
        berteriana). At the same time wood samples from inside the figure's
        cavity were radiocarbon dated by the Socttish Universities Environmental
        Research Centre. The results suggest that A'a was carved at some point
        between 1591 and 1647.
      </p>
    </div>
    <a class="back ml-4 mb-4 mr-auto" href="./scrolling">
      &larr; Back to main page
    </a>
  </div>
</template>

<style scoped>
.pin-spacer {
  pointer-events: none;
}
</style>
