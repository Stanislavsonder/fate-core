<script setup lang="ts">
import { CharacterAspect, CharacterAspectType } from "@/types";
import { ref } from "vue";
import Button from "../../ui/Button.vue";

const { aspect } = defineProps<{
  aspect?: CharacterAspect;
  mode?: "edit" | "create";
}>();

const newAspect = ref<CharacterAspect>(
  aspect || {
    name: "",
    description: "",
    type: CharacterAspectType.Other,
  },
);

const emit = defineEmits<{
  remove: [];
  save: [aspect: CharacterAspect];
}>();
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="emit('save', newAspect)">
    <input
      v-model="newAspect.name"
      type="text"
      class="w-full border-1 rounded p-2"
      :placeholder="$t('aspects.form.name.placeholder')"
    />
    <textarea
      v-model="newAspect.description"
      :placeholder="$t('aspects.form.description.placeholder')"
      cols="30"
      rows="10"
      class="w-full border-1 rounded p-2 min-h-10"
    />
    <select class="w-full border-1 rounded p-2" v-model="newAspect.type">
      <option v-for="type in CharacterAspectType" :key="type" :value="type">
        {{ $t(`aspects.type.${type}.name`) }}
      </option>
    </select>
    <div class="flex gap-4">
      <Button
        class="grow"
        v-if="mode === 'edit'"
        @click.prevent="emit('remove')"
      >
        {{ $t(`actions.remove`) }}
      </Button>
      <Button class="grow">
        {{ $t(`actions.${mode === "edit" ? "edit" : "add"}`) }}
      </Button>
    </div>
  </form>
</template>
