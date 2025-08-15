<template>
	<div>
		<Badge
			v-if="status === 'Available'"
			class="w-fit bg-emerald-100 hover:bg-emerald-100 text-emerald-800 flex items-center"
		>
			<span class="truncate">Available</span>
		</Badge>
		<Badge
			v-else-if="status === 'Reserved'"
			class="w-fit bg-amber-100 hover:bg-amber-100 text-amber-800 flex items-center"
		>
			<span class="truncate">Reserved</span>
		</Badge>
		<Badge
			v-else-if="status === 'Sold'"
			class="w-fit bg-rose-100 hover:bg-rose-100 text-rose-800 flex items-center"
		>
			<span class="truncate">Sold</span>
		</Badge>
	</div>
</template>

<script setup lang="ts">
import { Badge } from "~/components/ui/badge";

defineProps({
	status: {
		type: String,
		required: true,
	},
});
</script>

<style scoped></style>
