<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useData } from "vitepress";
import { API, Annotation, Material, Node } from "./types";
const { isDark } = useData();
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

const setCaption = (annotation: Annotation) => {
  // if (captionRef.value) {
  //   captionRef.value.querySelector("h4").innerHTML = annotation.name;
  //   captionRef.value.querySelector("p").innerHTML = annotation.content.raw;
  // }
};

onMounted(() => {
  import("@sketchfab/viewer-api").then((module) => {
    const client = new module.default("1.12.1", viewerIframeRef.value);
    client.init("e4dd6d342fa044b99732b484985797b6", {
      success: (_api: API) => {
        api.value = _api;
        _api.addEventListener("viewerready", () => {
          _api.getAnnotationList((_err, annotations: Annotation[]) => {
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
              annotations[4].eye,
              annotations[4].target,
              0,
              (_err: Error) => {},
            );
            //   // setTimeout(() => {
            //   //   console.log("setUserInteraction");
            //   //   _api.setUserInteraction(false);
            //   // }, 1500);
            //   setCaption(annotations[0]);
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
                  });
                }
              },
            );
            //   let displayed = true;
            //   // Setup the ScrollTrigger with the animation timeline
            const bib = ScrollTrigger.create({
              trigger: scrollerRef.value,
              start: "top top",
              // end: "bottom -1800px",
              // pin: "#api-iframe",
              end: "+=3000px",
              // markers: true,
              // scrub: true,
              animation: timeline,
              toggleActions: "play none reverse none",
              // Set the camera look-at position on every update and set the caption text
              onUpdate: (self) => {
                const currentIndex =
                  self.direction === 1
                    ? Math.floor(scrollableAnnotation.index)
                    : Math.ceil(scrollableAnnotation.index);
                console.log("currentIndex", currentIndex);
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
                console.log("eye", eye);
                _api.setCameraLookAt(eye, target, 0, (err: Error) => {
                  console.log("err", err);
                });
              },
            });
            ScrollTrigger.create({
              trigger: afterText.value,
              start: "-=2999px",
              end: "bottom bottom",
              pin: "#text-block",
              markers: true,
            });
            //   // setTimeout(() => {
            //   //   annotationList.value.forEach(
            //   //     (annotation: Annotation, n: number) => {
            //   //       ScrollTrigger.create({
            //   //         trigger: `#annotation_${n}`,
            //   //         start: "top center",
            //   //         end: "bottom bottom",
            //   //         pin: "#content_" + n,
            //   //       });
            //   //     },
            //   //   );
            //   // }, 1500);
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
    <div class="text-4xl font-extrabold mt-12">Title</div>
    <div class="w-1/2 mb-16 mt-4">
      <p>
        Amet id elit et labore cillum elit sit deserunt do reprehenderit
        occaecat. Enim ipsum sit do sunt aliqua in est. Exercitation consectetur
        est anim excepteur dolor. Sit qui deserunt proident excepteur aliquip
        sunt esse ullamco ex ipsum Lorem minim consectetur. Dolor nostrud amet
        ad irure qui ea. Fugiat cupidatat anim aliqua duis cupidatat cupidatat
        nisi.
      </p>
      <p>
        Amet id elit et labore cillum elit sit deserunt do reprehenderit
        occaecat. Enim ipsum sit do sunt aliqua in est. Exercitation consectetur
        est anim excepteur dolor. Sit qui deserunt proident excepteur aliquip
        sunt esse ullamco ex ipsum Lorem minim consectetur. Dolor nostrud amet
        ad irure qui ea. Fugiat cupidatat anim aliqua duis cupidatat cupidatat
        nisi.
      </p>
      <p>
        Amet id elit et labore cillum elit sit deserunt do reprehenderit
        occaecat. Enim ipsum sit do sunt aliqua in est. Exercitation consectetur
        est anim excepteur dolor. Sit qui deserunt proident excepteur aliquip
        sunt esse ullamco ex ipsum Lorem minim consectetur. Dolor nostrud amet
        ad irure qui ea. Fugiat cupidatat anim aliqua duis cupidatat cupidatat
        nisi.
      </p>
      <p>
        Amet id elit et labore cillum elit sit deserunt do reprehenderit
        occaecat. Enim ipsum sit do sunt aliqua in est. Exercitation consectetur
        est anim excepteur dolor. Sit qui deserunt proident excepteur aliquip
        sunt esse ullamco ex ipsum Lorem minim consectetur. Dolor nostrud amet
        ad irure qui ea. Fugiat cupidatat anim aliqua duis cupidatat cupidatat
        nisi.
      </p>
      <p>
        Amet id elit et labore cillum elit sit deserunt do reprehenderit
        occaecat. Enim ipsum sit do sunt aliqua in est. Exercitation consectetur
        est anim excepteur dolor. Sit qui deserunt proident excepteur aliquip
        sunt esse ullamco ex ipsum Lorem minim consectetur. Dolor nostrud amet
        ad irure qui ea. Fugiat cupidatat anim aliqua duis cupidatat cupidatat
        nisi.
      </p>
    </div>
  </div>

  <!-- <div class="relative"> -->
  <div class="iframe-wrapper w-screen h-screen bg-pink-500" ref="scrollerRef">
    <iframe
      id="api-iframe"
      allow="autoplay; fullscreen; vr"
      ref="viewerIframeRef"
      class="w-full h-full z-10"
      allowvr
      allowfullscreen
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
    ></iframe>
  </div>
  <div ref="afterText" class="h-screen">
    <div
      id="text-block"
      class="flex flex-col place-items-center bg-neutral-900 text-white"
    >
      <div class="w-1/2 my-16">
        <p>
          Amet id elit et labore cillum elit sit deserunt do reprehenderit
          occaecat. Enim ipsum sit do sunt aliqua in est. Exercitation
          consectetur est anim excepteur dolor. Sit qui deserunt proident
          excepteur aliquip sunt esse ullamco ex ipsum Lorem minim consectetur.
          Dolor nostrud amet ad irure qui ea. Fugiat cupidatat anim aliqua duis
          cupidatat cupidatat nisi.
        </p>
        <p>
          Occaecat eu magna id aliqua. Amet cupidatat officia enim eu sunt
          pariatur tempor consequat culpa ullamco proident. In voluptate ad sit
          enim ipsum dolore. Aliquip laboris ea non ex incididunt tempor. Ad
          incididunt esse duis occaecat proident nostrud. Minim non est proident
          consequat excepteur nulla ad esse exercitation amet id.
        </p>
        <p>
          Dolor consectetur sint excepteur officia quis do mollit commodo
          deserunt dolor adipisicing. Minim adipisicing aliqua ipsum voluptate
          elit amet do do ullamco Lorem Lorem consectetur. Amet cillum do
          laboris nulla.
        </p>
        <p>
          Amet id elit et labore cillum elit sit deserunt do reprehenderit
          occaecat. Enim ipsum sit do sunt aliqua in est. Exercitation
          consectetur est anim excepteur dolor. Sit qui deserunt proident
          excepteur aliquip sunt esse ullamco ex ipsum Lorem minim consectetur.
          Dolor nostrud amet ad irure qui ea. Fugiat cupidatat anim aliqua duis
          cupidatat cupidatat nisi.
        </p>
        <p>
          Occaecat eu magna id aliqua. Amet cupidatat officia enim eu sunt
          pariatur tempor consequat culpa ullamco proident. In voluptate ad sit
          enim ipsum dolore. Aliquip laboris ea non ex incididunt tempor. Ad
          incididunt esse duis occaecat proident nostrud. Minim non est proident
          consequat excepteur nulla ad esse exercitation amet id.
        </p>
        <p>
          Dolor consectetur sint excepteur officia quis do mollit commodo
          deserunt dolor adipisicing. Minim adipisicing aliqua ipsum voluptate
          elit amet do do ullamco Lorem Lorem consectetur. Amet cillum do
          laboris nulla.
        </p>
      </div>
      <a class="back ml-4 mb-4 mr-auto" href="../">
        &larr; Back to main page
      </a>
    </div>
  </div>
  <!-- <div class="scroller w-screen h-[12000px] top-0" ref="scrollerRef"></div> -->
  <!-- </div> -->

  <!-- <div class="scroller w-screen h-full top-0" ref="scrollerRef">
        <div
          v-for="(annotation, index) in annotationList"
          :key="index"
          :id="`annotation_${index}`"
          class="w-full h-full"
        >
          <div
            class="caption relative bg-neutral-800/80 w-100 max-w-[350px] p-2"
            :id="`content_${index}`"
            ref="captionRef"
          >
            <h4 class="text-white">{{ annotation.name }}</h4>
            <p class="text-neutral-200 relative">
              {{ annotation.content.raw }}
            </p>
          </div>
        </div>
      </div> -->

  <!-- <v-responsive :aspect-ratio="4 / 3" class="w-100">
    <iframe
      style="border: 0"
      id="api-iframe"
      ref="viewerIframeRef"
      class="w-100 h-100 absolute"
    ></iframe>
  </v-responsive> -->
</template>
