<script setup lang="ts">
import { computed, watch, defineProps, useId } from "vue";
import { Validator } from "@/types";

const id = useId();

defineOptions({
	inheritAttrs: false,
});

const { type = "text", validators = [] } = defineProps<{
	label?: string;
	validators?: Validator[];
	type?: "text" | "number";
	placeholder?: string;
}>();

const inputType = computed(() => (type === "number" ? "number" : "text"));

const value = defineModel<string | number>({
	default: "",
});
const errors = defineModel<string[]>("errors", {
	default: [],
});

watch(value, (val) => {
	errors.value = [];
	if (validators?.length > 0) {
		for (const validate of validators) {
			const msg = validate(val);
			if (msg) {
				errors.value.push(msg);
			}
		}
	}
});
</script>

<template>
	<div class="flex flex-col space-y-1 w-full">
		<input
			:id="id"
			:type="inputType"
			:placeholder="placeholder"
			v-model="value"
			class="px-2 bg-secondary focus:outline-none focus:border-b-1"
			:class="$attrs.class"
		/>
		<p v-if="errors?.length" class="text-red-600 text-sm mt-1">
			{{ errors[0] }}
		</p>
	</div>
</template>
