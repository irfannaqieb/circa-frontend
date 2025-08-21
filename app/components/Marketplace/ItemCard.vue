<template>
	<Card class="overflow-hidden max-w-sm gap-4">
		<CardContent class="p-0 relative">
			<Carousel v-if="images && images.length > 0">
				<CarouselContent>
					<CarouselItem v-for="(image, index) in images" :key="index">
						<img
							:src="image"
							:alt="`${title || 'Product image'} ${index + 1}`"
							class="h-48 w-full object-cover"
						/>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious v-if="images.length > 1" class="absolute left-2" />
				<CarouselNext v-if="images.length > 1" class="absolute right-2" />
			</Carousel>
			<img
				v-else
				src="https://placehold.co/400x400.png?text=No+Image"
				:alt="title || 'Product image'"
				class="h-48 w-full object-cover"
			/>
		</CardContent>
		<CardHeader>
			<div class="flex justify-between">
				<div>
					<CardTitle>{{ title || "Apple Watch" }}</CardTitle>
					<p class="text-xs text-muted-foreground">
						{{ timeAgo || "6 months ago" }}
					</p>
				</div>
				<BadgeItemStatus :status="status" />
			</div>
			<p class="text-lg font-semibold">{{ price || "$500" }}</p>
			<div class="flex items-center text-sm text-muted-foreground">
				<MapPin class="mr-1 h-4 w-4" />
				<span>{{ location || "New York, NY" }}</span>
			</div>
		</CardHeader>
		<CardContent>
			<Separator class="my-2" />
		</CardContent>
		<CardFooter>
			<div class="flex w-full gap-4">
				<Button variant="outline" @click="viewDetails">
					<Eye class="h-4 w-4" />
					View details
				</Button>
				<Button variant="default">
					<ShoppingCart class="h-4 w-4" />
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
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "~/components/ui/carousel";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: "Available",
	},
	title: {
		type: String,
		default: "Apple Watch",
	},
	price: {
		type: String,
		default: "$500",
	},
	location: {
		type: String,
		default: "New York, NY",
	},
	images: {
		type: Array as () => string[],
		default: () => [],
	},
	timeAgo: {
		type: String,
		default: "6 months ago",
	},
});

function viewDetails() {
	if (props.id) {
		router.push(`/marketplace/items/${props.id}`);
	}
}
</script>

<style scoped></style>
