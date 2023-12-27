<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useData } from "vitepress";
import { API, Annotation, Material, Node } from "./types";
const { isDark } = useData();
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { marked } from "marked";

gsap.registerPlugin(ScrollTrigger);

interface ScrollableAnnotation {
  ex: number;
  ey: number;
  ez: number;
  tx: number;
  ty: number;
  tz: number;
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
const scrollerRef = ref(null);
const afterText = ref(null);
const captionRef = ref(null);
const api = ref<API | undefined>();
const annotationList = ref<Annotation[]>([]);
const state = reactive({
  annotation: {} as Annotation,
});
const setCaption = (annotation: Annotation) => {
  // if (captionRef.value) {
  //   captionRef.value.querySelector("h4").innerHTML = annotation.name;
  //   captionRef.value.querySelector("p").innerHTML = annotation.content.raw;
  // }
};
const markdownToHtml = (markdown: string) => {
  return marked.parse(markdown);
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
            const scrollableAnnotation: ScrollableAnnotation = {
              ex: annotations[0].eye[0],
              ey: annotations[0].eye[1],
              ez: annotations[0].eye[2],
              tx: annotations[0].target[0],
              ty: annotations[0].target[1],
              tz: annotations[0].target[2],
              index: 0,
            };
            _api.setCameraLookAt(
              annotations[0].eye,
              annotations[0].target,
              0,
              (_err: Error) => {},
            );
            //   // setTimeout(() => {
            //   //   console.log("setUserInteraction");
            //   //   _api.setUserInteraction(false);
            //   // }, 1500);
            //   setCaption(annotations[0]);
            state.annotation = annotations[0];
            const timeline = gsap.timeline({});
            annotationList.value.forEach(
              (annotation: Annotation, n: number) => {
                if (n !== 0) {
                  // _api.hideAnnotation(n);
                  timeline.to(scrollableAnnotation, {
                    duration: 1,
                    ex: annotation.eye[0],
                    ey: annotation.eye[1],
                    ez: annotation.eye[2],
                    tx: annotation.target[0],
                    ty: annotation.target[1],
                    tz: annotation.target[2],
                    index: n,
                    ease: "power3.inOut",
                  });
                }
              },
            );
            //   let displayed = true;
            //   // Setup the ScrollTrigger with the animation timeline
            const bib = ScrollTrigger.create({
              trigger: scrollerRef.value,
              start: "top bottom",
              end: "bottom bottom",
              // pin: "#api-iframe",
              // end: "+=3000px",
              snap: {
                snapTo: 1 / (annotationList.value.length - 1),
                duration: {
                  min: 0.2,
                  max: 1,
                },
                delay: 1,
                ease: "power1.inOut",
              },
              markers: true,
              scrub: true,
              animation: timeline,
              toggleActions: "play none reverse none",
              // Set the camera look-at position on every update and set the caption text
              onUpdate: (self) => {
                const currentIndex =
                  self.direction === 1
                    ? Math.floor(scrollableAnnotation.index)
                    : Math.ceil(scrollableAnnotation.index);
                console.log("currentIndex", currentIndex);
                state.annotation = annotationList.value[currentIndex];
                if (currentIndex < annotationList.value.length - 2) {
                  _api.setUserInteraction(false);
                } else {
                  _api.setUserInteraction(true);
                }
                const eye = [
                  scrollableAnnotation.ex,
                  scrollableAnnotation.ey,
                  scrollableAnnotation.ez,
                ];
                const target = [
                  scrollableAnnotation.tx,
                  scrollableAnnotation.ty,
                  scrollableAnnotation.tz,
                ];
                _api.setCameraLookAt(eye, target, 0, (_err: Error) => {});
              },
            });
            // ScrollTrigger.create({
            //   trigger: afterText.value,
            //   start: "-=2999px",
            //   end: "bottom bottom",
            //   pin: "#text-block",
            //   markers: true,
            // });
            // setTimeout(() => {
            //   annotationList.value.forEach(
            //     (annotation: Annotation, n: number) => {
            //       ScrollTrigger.create({
            //         trigger: `#annotation_${n}`,
            //         start: "top center",
            //         end: "bottom 40%",
            //         pin: "#content_" + n,
            //       });
            //     },
            //   );
            // }, 1500);
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
    <a class="back ml-4 mt-4 mr-auto" href="../"> &larr; Back to main page </a>
    <div class="text-4xl my-12">Statue of A'a</div>
    <div class="w-1/3 min-w-[500px] mb-12 mt-4">
      <p class="mb-6 text-white/80">
        The Asahi Shimbun Displays: Containing the divine a sculpture of the
        Pacific god A'a
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
    <div class="text-xl mb-8 animate-bounce">
      Scroll down to explore the statue
    </div>
  </div>

  <div class="relative">
    <div class="iframe-wrapper w-screen h-screen bg-pink-500 sticky top-0">
      <iframe
        id="api-iframe"
        allow="autoplay; fullscreen; vr"
        ref="viewerIframeRef"
        class="w-screen h-screen z-10"
        allowvr
        allowfullscreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
      ></iframe>
      <div
        class="caption bg-neutral-800/80 max-w-[350px] p-6 absolute bottom-0 left-0 m-6 rounded-2xl"
        ref="captionRef"
      >
        <div class="text-2xl text-white font-semibold mb-4">
          {{ state.annotation.name }}
        </div>
        <div
          v-if="state.annotation?.content"
          class="text-neutral-200 relative"
          v-html="markdownToHtml(state.annotation.content?.raw)"
        ></div>
      </div>
    </div>
    <div class="scroller w-screen top-0" ref="scrollerRef">
      <div
        v-for="(annotation, index) in annotationList"
        :key="index"
        class="h-screen"
      ></div>
    </div>
  </div>
  <div ref="afterText" class="">
    <div
      id="text-block"
      class="flex flex-col place-items-center bg-neutral-900 text-white"
    >
      <div class="w-1/3 min-w-[500px] mb-16 mt-16">
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
          In November 2015, wood samples taken from inside the figure were
          tested by British Museum scientists and found to be Sandalwood. The
          wood was too deteriorated to be definitive about the species but it is
          likely to be Santalum insulare. This information was fed back to the
          island of Rurutu and the Council of Elders met to discuss it. The
          Elders chose not to accept the Sandalwood finding, preferring to
          uphold their own histories which state that A'a was carved from pua
          wood (Fagraea berteriana). At the same time wood samples from inside
          the figure's cavity were radiocarbon dated by the Socttish
          Universities Environmental Research Centre. The results suggest that
          A'a was carved at some point between 1591 and 1647.
        </p>
      </div>
      <a class="back ml-4 mb-4 mr-auto" href="../">
        &larr; Back to main page
      </a>
    </div>
  </div>
</template>
