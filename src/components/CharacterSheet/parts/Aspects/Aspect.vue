<template>
	<button
		class="rounded p-2 border-1 border-primary/25 text-left bg-secondary text-primary"
		@click="isModalOpen = true"
	>
		<h3 class="text-lg font-bold my-0 mb-5 ">
			<ion-icon
				v-if="aspectIcon"
				class="float-left mr-4 mt-0.5 text-2xl"
				:icon="aspectIcon"
				:alt="aspect.name"
			/>
			{{ aspect.name }}
		</h3>
		<p class="leading-5 text-primary/80">{{ aspect.description }}</p>
		<ModalWindow v-model="isModalOpen" :title="$t('aspects.edit')">
			<AspectFrom :aspect="aspect" mode="edit" @save="edit" @remove="remove" />
		</ModalWindow>
	</button>
</template>

<script setup lang="ts">
import { IonIcon} from '@ionic/vue'
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

