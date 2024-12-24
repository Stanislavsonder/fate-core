<script setup lang="ts">
import { CharacterAspect } from "@/types";
import { computed, ref } from "vue";
import { ASPECT_ICONS } from "@/constants";
import AspectFrom from "./AspectFrom.vue";
import ModalWindow from "../../../ui/ModalWindow.vue";

const { aspect } = defineProps<{
  aspect: CharacterAspect;
}>();

const emit = defineEmits<{
  edit: [newAspect: CharacterAspect];
  remove: [];
}>();

const aspectIcon = computed<string | null>(() => ASPECT_ICONS[aspect.type]);

const isModalOpen = ref<boolean>(false);

function edit(newAspect: CharacterAspect) {
  isModalOpen.value = false;
  emit("edit", newAspect);
}

function remove() {
  isModalOpen.value = false;
  emit("remove");
}
</script>

<template>
  <button
    class="rounded p-2 border-1 border-black/30 text-left"
    @click="isModalOpen = true"
  >
    <h3 class="text-lg font-bold mb-2">
      <img
        v-if="aspectIcon"
        class="float-left mr-2"
        :src="aspectIcon"
        width="24"
        :alt="aspect.name"
      />
      {{ aspect.name }}
    </h3>
    <p>{{ aspect.description }}</p>
    <ModalWindow v-model="isModalOpen" :title="$t('aspects.edit')">
      <AspectFrom :aspect="aspect" mode="edit" @save="edit" @remove="remove" />
    </ModalWindow>
  </button>
</template>
