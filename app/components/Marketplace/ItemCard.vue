<template>
	<Card class="overflow-hidden max-w-sm gap-4">
		<CardContent class="p-0">
			<img
				src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="watch"
				class="h-48 w-full object-cover"
			/>
		</CardContent>
		<CardHeader>
			<div class="flex justify-between">
				<div>
					<CardTitle>Apple Watch</CardTitle>
					<p class="text-xs text-gray-500">6 months ago</p>
				</div>
				<BadgeItemStatus :status="status" />
			</div>
			<p class="text-lg font-semibold">$500</p>
			<div class="flex items-center text-sm text-gray-500">
				<MapPin class="mr-1 h-4 w-4" />
				<span>New York, NY</span>
			</div>
		</CardHeader>
		<CardContent>
			<Separator class="my-2" />
		</CardContent>
		<CardFooter>
			<div class="flex w-full gap-4">
				<Button variant="outline">
					<Eye class="mr-2 h-4 w-4" />
					View details
				</Button>
				<Button variant="default" class="bg-black text-white">
					<ShoppingCart class="mr-2 h-4 w-4" />
					Buy
				</Button>
			</div>
		</CardFooter>
	</Card>
</template>

<script setup lang="ts">
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import BadgeItemStatus from "~/components/BadgeItemStatus.vue";
import { Eye, ShoppingCart, MapPin } from "lucide-vue-next";

const props = defineProps({
	status: {
		type: String,
		default: "Available",
	},
});
</script>

<style scoped></style>
