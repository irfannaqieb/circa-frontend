<template>
	<Card class="overflow-hidden hover:shadow-md transition-shadow">
		<!-- Boost/Feature Badge -->
		<div
			v-if="item.is_boosted || item.is_featured"
			class="absolute top-3 right-3 z-10"
		>
			<Badge variant="secondary" class="bg-yellow-100 text-yellow-800">
				{{ item.is_featured ? "Featured" : "Boosted" }}
			</Badge>
		</div>

		<CardContent class="p-0">
			<!-- Image Carousel -->
			<Carousel
				v-if="item.images && item.images.length > 1"
				class="relative w-full"
			>
				<CarouselContent>
					<CarouselItem v-for="image in item.images" :key="image.id">
						<div class="p-0">
							<div class="relative group h-48 w-full">
								<img
									:src="getImageUrl(image.path)"
									:alt="item.title"
									class="h-full w-full object-cover"
								/>
								<div
									class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
								>
									<div class="flex gap-2">
										<Button
											size="sm"
											variant="secondary"
											@click="$emit('action', 'view', item.id)"
										>
											<Eye class="w-4 h-4" />
										</Button>
										<Button
											size="sm"
											variant="secondary"
											@click="$emit('action', 'edit', item.id)"
										>
											<Edit class="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious class="absolute left-2 top-1/2 -translate-y-1/2" />
				<CarouselNext class="absolute right-2 top-1/2 -translate-y-1/2" />
			</Carousel>
			<!-- Fallback for single image or no image -->
			<div v-else class="relative group h-48 w-full">
				<img
					v-if="item.primary_image_path"
					:src="getImageUrl(item.primary_image_path)"
					:alt="item.title"
					class="h-full w-full object-cover"
				/>
				<div
					v-else
					class="h-full w-full bg-muted flex items-center justify-center text-sm text-muted-foreground"
				>
					No image available
				</div>
				<!-- Quick Actions Overlay -->
				<div
					class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
				>
					<div class="flex gap-2">
						<Button
							size="sm"
							variant="secondary"
							@click="$emit('action', 'view', item.id)"
						>
							<Eye class="w-4 h-4" />
						</Button>
						<Button
							size="sm"
							variant="secondary"
							@click="$emit('action', 'edit', item.id)"
						>
							<Edit class="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</CardContent>

		<CardHeader class="p-4">
			<div class="flex justify-between items-start mb-2">
				<div class="flex-1 min-w-0">
					<CardTitle class="text-base truncate">{{ item.title }}</CardTitle>
					<p class="text-xs text-muted-foreground">
						{{ formatDate(item.created_at) }}
					</p>
				</div>
				<BadgeItemStatus :status="item.status || 'Available'" />
			</div>

			<div class="flex justify-between items-center">
				<p class="text-lg font-semibold">
					{{ formatPrice(item.base_price_minor, item.is_giveaway) }}
				</p>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm">
							<MoreVertical class="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem @click="$emit('action', 'view', item.id)">
							<Eye class="w-4 h-4 mr-2" />
							View
						</DropdownMenuItem>
						<DropdownMenuItem @click="$emit('action', 'edit', item.id)">
							<Edit class="w-4 h-4 mr-2" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />

						<!-- Status Actions -->
						<DropdownMenuItem
							v-if="item.status === 'Available'"
							@click="$emit('action', 'mark-reserved', item.id)"
						>
							<Clock class="w-4 h-4 mr-2" />
							Mark as Reserved
						</DropdownMenuItem>
						<DropdownMenuItem
							v-if="item.status === 'Available' || item.status === 'Reserved'"
							@click="$emit('action', 'mark-sold', item.id)"
						>
							<CheckCircle class="w-4 h-4 mr-2" />
							Mark as Sold
						</DropdownMenuItem>
						<DropdownMenuItem
							v-if="item.status === 'Reserved'"
							@click="$emit('action', 'mark-available', item.id)"
						>
							<RotateCcw class="w-4 h-4 mr-2" />
							Mark as Available
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<!-- Other Actions -->
						<DropdownMenuItem
							@click="isDeleteDialogOpen = true"
							class="text-destructive focus:text-destructive"
						>
							<Trash2 class="w-4 h-4 mr-2" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<!-- Metrics -->
			<div class="flex items-center justify-between pt-3 border-t mt-3">
				<div class="flex items-center gap-4 text-sm text-muted-foreground">
					<div class="flex items-center gap-1">
						<Eye class="w-3 h-3" />
						<span>{{ item.views || 0 }}</span>
					</div>
					<div class="flex items-center gap-1">
						<Heart class="w-3 h-3" />
						<span>{{ item.saves || 0 }}</span>
					</div>
					<div class="flex items-center gap-1">
						<MessageSquare class="w-3 h-3" />
						<span>{{ item.messages || 0 }}</span>
					</div>
				</div>
				<span class="text-xs text-muted-foreground">
					Updated {{ formatTimeAgo(item.updated_at) }}
				</span>
			</div>
		</CardHeader>
	</Card>

	<!-- Delete Confirmation Dialog -->
	<Dialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Are you absolutely sure?</DialogTitle>
				<DialogDescription> This action cannot be undone. </DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					variant="outline"
					@click="isDeleteDialogOpen = false"
					class="mt-2 sm:mt-0"
				>
					Cancel
				</Button>
				<Button variant="destructive" @click="confirmDelete"> Delete </Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
	Eye,
	Edit,
	MoreVertical,
	Clock,
	CheckCircle,
	RotateCcw,
	Copy,
	Share,
	Trash2,
	Heart,
	MessageSquare,
} from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import BadgeItemStatus from "~/components/BadgeItemStatus.vue";
import { getImageUrl } from "~/services/items.service";
import type { Item } from "~/services/items.service";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "~/components/ui/carousel";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";

interface Props {
	item: Item;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	action: [action: string, itemId: string];
}>();

const isDeleteDialogOpen = ref(false);

function confirmDelete() {
	emit("action", "delete", props.item.id);
	isDeleteDialogOpen.value = false;
}

// Helper functions
function getItemImageUrl(item: Item): string {
	// Return first image or placeholder
	return item.primary_image_path ? getImageUrl(item.primary_image_path) : "";
}

function formatPrice(
	priceMinor: number | null | undefined,
	isGiveaway: boolean | null | undefined
): string {
	if (isGiveaway) return "Free";
	if (!priceMinor) return "Price not set";
	return `₩${priceMinor.toLocaleString()}`;
}

function formatDate(dateString: string | undefined): string {
	if (!dateString) return "Unknown date";
	return new Date(dateString).toLocaleDateString();
}

function formatTimeAgo(dateString: string | undefined): string {
	if (!dateString) return "Unknown";

	const now = new Date();
	const date = new Date(dateString);
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "1 day ago";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	return `${Math.floor(diffDays / 30)} months ago`;
}
</script>
