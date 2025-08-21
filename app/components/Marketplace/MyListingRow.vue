<template>
	<Card class="hover:shadow-sm transition-shadow">
		<CardContent class="p-4">
			<div class="flex items-center gap-4">
				<!-- Image -->
				<div class="relative w-20 h-20 flex-shrink-0">
					<img
						v-if="item.primary_image_path"
						:src="getImageUrl(item.primary_image_path)"
						:alt="item.title"
						class="w-full h-full object-cover rounded-md"
					/>
					<div
						v-else
						class="w-full h-full bg-muted flex items-center justify-center text-center text-xs text-muted-foreground rounded-md p-2"
					>
						No image available
					</div>
					<!-- Boost/Feature Badge -->
					<Badge
						v-if="item.is_boosted || item.is_featured"
						variant="secondary"
						class="absolute -top-1 -right-1 text-xs bg-yellow-100 text-yellow-800"
					>
						{{ item.is_featured ? "F" : "B" }}
					</Badge>
				</div>

				<!-- Item Details -->
				<div class="flex-1 min-w-0">
					<div class="flex items-start justify-between">
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-base truncate">{{ item.title }}</h3>
							<p class="text-sm text-muted-foreground">
								ID: {{ item.id.slice(0, 8) }}... •
								{{ item.category || "Uncategorized" }}
							</p>
							<p class="text-sm text-muted-foreground">
								Created: {{ formatDate(item.created_at) }} • Updated:
								{{ formatTimeAgo(item.updated_at) }}
							</p>
						</div>

						<!-- Status and Price -->
						<div class="flex flex-col items-end gap-2 ml-4">
							<BadgeItemStatus :status="item.status || 'Available'" />
							<p class="text-lg font-semibold">
								{{ formatPrice(item.base_price_minor, item.is_giveaway) }}
							</p>
						</div>
					</div>
				</div>

				<!-- Metrics -->
				<div class="hidden md:flex flex-col items-center gap-2 px-4 border-l">
					<div class="text-sm text-muted-foreground">Performance</div>
					<div class="flex items-center gap-4 text-sm">
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
				</div>

				<!-- Actions -->
				<div class="flex items-center gap-2">
					<!-- Quick Actions -->
					<div class="hidden lg:flex items-center gap-1">
						<Button
							size="sm"
							variant="outline"
							@click="$emit('action', 'view', item.id)"
						>
							<Eye class="w-4 h-4" />
						</Button>
						<Button
							size="sm"
							variant="outline"
							@click="$emit('action', 'edit', item.id)"
						>
							<Edit class="w-4 h-4" />
						</Button>

						<!-- Status Quick Actions -->
						<Button
							v-if="item.status === 'Available'"
							size="sm"
							variant="outline"
							@click="$emit('action', 'mark-reserved', item.id)"
							title="Mark as Reserved"
						>
							<Clock class="w-4 h-4" />
						</Button>
						<Button
							v-if="item.status === 'Available' || item.status === 'Reserved'"
							size="sm"
							variant="outline"
							@click="$emit('action', 'mark-sold', item.id)"
							title="Mark as Sold"
						>
							<CheckCircle class="w-4 h-4" />
						</Button>
					</div>

					<!-- More Actions Dropdown -->
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="outline">
								<MoreVertical class="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" class="w-48">
							<DropdownMenuItem @click="$emit('action', 'view', item.id)">
								<Eye class="w-4 h-4 mr-2" />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem @click="$emit('action', 'edit', item.id)">
								<Edit class="w-4 h-4 mr-2" />
								Edit Listing
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
							<DropdownMenuItem
								v-if="item.status === 'Reserved'"
								@click="$emit('action', 'message-buyer', item.id)"
							>
								<MessageSquare class="w-4 h-4 mr-2" />
								Message Buyer
							</DropdownMenuItem>
							<DropdownMenuItem
								v-if="item.status === 'Sold'"
								@click="$emit('action', 'rate-buyer', item.id)"
							>
								<Star class="w-4 h-4 mr-2" />
								Rate Buyer
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<!-- Promotion Actions -->
							<DropdownMenuItem
								v-if="item.status === 'Available' && !item.is_boosted"
								@click="$emit('action', 'boost', item.id)"
							>
								<Zap class="w-4 h-4 mr-2" />
								Boost Listing
							</DropdownMenuItem>
							<DropdownMenuItem
								v-if="item.status === 'Available' && !item.is_featured"
								@click="$emit('action', 'feature', item.id)"
							>
								<Crown class="w-4 h-4 mr-2" />
								Feature Listing
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<!-- Other Actions -->
							<DropdownMenuItem @click="$emit('action', 'duplicate', item.id)">
								<Copy class="w-4 h-4 mr-2" />
								Duplicate
							</DropdownMenuItem>
							<DropdownMenuItem @click="$emit('action', 'share', item.id)">
								<Share class="w-4 h-4 mr-2" />
								Share Link
							</DropdownMenuItem>
							<DropdownMenuItem @click="$emit('action', 'copy-id', item.id)">
								<Hash class="w-4 h-4 mr-2" />
								Copy ID
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<!-- Archive/Restore -->
							<DropdownMenuItem
								v-if="item.status !== 'Archived'"
								@click="$emit('action', 'archive', item.id)"
							>
								<Archive class="w-4 h-4 mr-2" />
								Archive
							</DropdownMenuItem>
							<DropdownMenuItem
								v-if="item.status === 'Archived'"
								@click="$emit('action', 'restore', item.id)"
							>
								<RotateCcw class="w-4 h-4 mr-2" />
								Restore
							</DropdownMenuItem>

							<DropdownMenuItem
								@click="$emit('action', 'delete', item.id)"
								class="text-destructive focus:text-destructive"
							>
								<Trash2 class="w-4 h-4 mr-2" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</CardContent>
	</Card>
</template>

<script setup lang="ts">
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
	Star,
	Zap,
	Crown,
	Hash,
	Archive,
} from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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

interface Props {
	item: Item;
}

defineProps<Props>();

defineEmits<{
	action: [action: string, itemId: string];
}>();

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
