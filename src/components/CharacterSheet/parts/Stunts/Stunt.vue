<script setup lang="ts">
import { Stunt } from "@/types";
import StuntModal from "./StuntModal.vue";
import { ref } from "vue";
import { TOKEN_ICON } from "@/constants";

defineProps<{
  stunt: Stunt;
}>();

const emit = defineEmits<{
  edit: [newStunt: Stunt];
  remove: [];
}>();

const isModalOpen = ref<boolean>(false);

function edit(newStunt: Stunt) {
  isModalOpen.value = false;
  emit("edit", newStunt);
}

function remove() {
  isModalOpen.value = false;
  emit("remove");
}
</script>

<template>
  <button
    class="border-1 border-black/20 rounded p-2 text-left"
    @click="isModalOpen = true"
  >
    <h3 class="font-bold text-lg">{{ stunt.name }}</h3>
    <h4 class="opacity-70 mb-2">{{ $t(`skills.${stunt.skill}.name`) }}</h4>
    <p>{{ stunt.description }}</p>
    <p v-if="stunt.priceInTokens" class="flex mt-4 gap-2">
      <img
        v-for="index in stunt.priceInTokens"
        :key="index"
        :src="TOKEN_ICON"
        class="w-7"
      />
    </p>
  </button>
  <StuntModal
    v-model="isModalOpen"
    mode="edit"
    :stunt="stunt"
    @save="edit"
    @remove="remove"
  />
</template>
