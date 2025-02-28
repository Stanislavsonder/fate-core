<script setup lang="ts">
import { ref } from 'vue'
import { bug } from 'ionicons/icons'
import { IonButton, IonIcon } from '@ionic/vue'
import useDebug from '@/composables/useDebug'

const {
	collapsed = true,
	position = 'top',
	title = 'Debug'
} = defineProps<{
	collapsed?: boolean
	position?: 'top' | 'bottom'
	title?: string
}>()

defineOptions({
	inheritAttrs: false
})

const { isDebug } = useDebug()

const isCollapsed = ref(collapsed ?? false)
</script>

<template>
	<div
		v-if="isDebug"
		:class="`fixed ${position === 'top' ? 'top-10' : 'bottom-10'} flex flex-col gap-2 start-0 m-2 z-10000 bg-background-2 text-xs rounded-md`"
	>
		<ion-button
			v-if="position === 'top'"
			size="small"
			color="warning"
			@click="isCollapsed = !isCollapsed"
		>
			<ion-icon
				slot="start"
				:icon="bug"
			/>
			{{ title }}
		</ion-button>
		<div
			v-show="!isCollapsed"
			class="p-2"
			v-bind="$attrs"
		>
			<slot />
		</div>
		<ion-button
			v-if="position === 'bottom'"
			size="small"
			color="warning"
			@click="isCollapsed = !isCollapsed"
		>
			<ion-icon
				slot="start"
				:icon="bug"
			/>
			{{ title }}
		</ion-button>
	</div>
</template>
