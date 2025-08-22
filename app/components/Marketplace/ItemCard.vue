<template>
	<Card class="overflow-hidden max-w-sm gap-4">
		<CardContent class="p-0 relative">
			<div
				v-if="isOwner"
				class="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md z-10"
			>
				Your listing
			</div>
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
					<CardTitle @click="viewDetails" class="cursor-pointer">{{
						title || "Apple Watch"
					}}</CardTitle>
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
				<Button
					variant="default"
					@click="startChat"
					:disabled="isOwner"
					v-if="!isOwner"
				>
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
import { useSessionStore } from "~/stores/session.store";
import { computed } from "vue";
import { getOrCreateConversation } from "~/services/conversations.service";

const router = useRouter();
const session = useSessionStore();

const isLoggedIn = computed(() => !!session.user);

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	owner_id: {
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
	isOwner: {
		type: Boolean,
		default: false,
	},
});

function viewDetails() {
	if (props.id) {
		if (isLoggedIn.value) {
			router.push(`/marketplace/items/${props.id}`);
		} else {
			router.push(`/login?redirect=/marketplace/items/${props.id}`);
		}
	}
}

async function startChat() {
	if (!isLoggedIn.value) {
		router.push(`/login?redirect=/marketplace/items/${props.id}`);
		return;
	}

	if (props.isOwner) {
		return;
	}

	const { data: conversationId, error } = await getOrCreateConversation(
		props.id,
		props.owner_id
	);

	if (error) {
		console.error("Failed to create or get conversation", error);
		// TODO: show a toast notification
		return;
	}

	if (conversationId) {
		router.push(`/marketplace/chat/${conversationId}`);
	}
}
</script>

<style scoped></style>
