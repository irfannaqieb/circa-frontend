<template>
	<div>
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">For You</h1>
			<div class="flex space-x-2">
				<Button variant="outline">
					<ListFilter class="mr-2 h-4 w-4" />
					Filter
				</Button>
				<Button variant="outline">
					<ArrowUpDown class="mr-2 h-4 w-4" />
					Sort
				</Button>
			</div>
		</div>
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			<MarketplaceItemCard status="Available" />
			<MarketplaceItemCard status="Reserved" />
			<MarketplaceItemCard status="Sold" />
			<MarketplaceItemCard status="Available" />
			<MarketplaceItemCard status="Reserved" />
			<MarketplaceItemCard status="Sold" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ListFilter, ArrowUpDown } from "lucide-vue-next";
import { Button } from "~/components/ui/button";

definePageMeta({
	layout: "marketplace",
});
</script>

<style scoped></style>
