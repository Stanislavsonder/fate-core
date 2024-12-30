<script setup lang="ts">
import { Stunt } from "@/types";
import {IonIcon} from '@ionic/vue'
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
    class="border-1 border-primary/25 rounded p-4 text-left"
    @click="isModalOpen = true"
  >
    <h3 class="font-bold text-lg">{{ stunt.name }}</h3>
    <h4 class="opacity-70 mb-2">{{ $t(`skills.${stunt.skill}.name`) }}</h4>
    <p>{{ stunt.description }}</p>
    <p v-if="stunt.priceInTokens" class="flex mt-4 gap-2">
      <ion-icon
        v-for="index in stunt.priceInTokens"
        :key="index"
        :icon="TOKEN_ICON"
				class="text-3xl"
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
