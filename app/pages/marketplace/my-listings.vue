<template>
	<div class="min-h-screen bg-background">
		<div class="container mx-auto px-4 py-6 lg:py-8">
			<!-- Header Section -->
			<div
				class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
			>
				<div>
					<h1 class="text-3xl font-bold text-foreground">My Listings</h1>
					<p class="text-muted-foreground mt-1">
						Manage your marketplace items and track performance
					</p>
				</div>
				<div class="flex items-center gap-3">
					<!-- Primary CTA -->
					<Button
						@click="$router.push('/marketplace/item')"
						class="flex items-center gap-2"
					>
						<Plus class="w-4 h-4" />
						New Listing
					</Button>
				</div>
			</div>

			<!-- Seller Overview Stats -->
			<Card class="mb-8">
				<CardHeader>
					<div class="flex items-center gap-2">
						<BarChart3 class="w-5 h-5" />
						<CardTitle>Seller Dashboard</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
						<div
							v-for="stat in statusStats"
							:key="stat.status"
							class="p-4 rounded-lg border bg-card cursor-pointer hover:bg-accent transition-colors"
							:class="{
								'bg-accent border-primary':
									selectedStatusFilter === stat.status,
							}"
							@click="toggleStatusFilter(stat.status)"
						>
							<div class="flex flex-col">
								<span class="text-2xl font-bold">{{ stat.count }}</span>
								<span class="text-sm text-muted-foreground">{{
									stat.label
								}}</span>
							</div>
							<Badge :class="stat.badgeClass" class="mt-2 w-fit">
								{{ stat.status }}
							</Badge>
						</div>
					</div>

					<!-- Performance Metrics -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
						<div class="flex items-center gap-3">
							<div class="p-2 rounded-lg bg-blue-100">
								<Eye class="w-4 h-4 text-blue-600" />
							</div>
							<div>
								<p class="text-sm text-muted-foreground">7d Views</p>
								<p class="font-semibold">{{ performanceStats.views }}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<div class="p-2 rounded-lg bg-green-100">
								<MessageSquare class="w-4 h-4 text-green-600" />
							</div>
							<div>
								<p class="text-sm text-muted-foreground">7d Inquiries</p>
								<p class="font-semibold">{{ performanceStats.inquiries }}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<div class="p-2 rounded-lg bg-purple-100">
								<TrendingUp class="w-4 h-4 text-purple-600" />
							</div>
							<div>
								<p class="text-sm text-muted-foreground">7d Conversion</p>
								<p class="font-semibold">{{ performanceStats.conversion }}%</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Filters and Search -->
			<Card class="mb-6">
				<CardContent class="p-4">
					<div class="flex flex-col lg:flex-row gap-4">
						<!-- Search -->
						<div class="flex-1">
							<div class="relative">
								<Search
									class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
								/>
								<Input
									v-model="searchQuery"
									placeholder="Search by title or ID..."
									class="pl-10"
								/>
							</div>
						</div>

						<!-- Filter Controls -->
						<div class="flex flex-wrap gap-2">
							<!-- Status Filter -->
							<Select v-model="selectedStatusFilter">
								<SelectTrigger class="w-[140px]">
									<SelectValue placeholder="All Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="Available">Available</SelectItem>
									<SelectItem value="Reserved">Reserved</SelectItem>
									<SelectItem value="Sold">Sold</SelectItem>
									<SelectItem value="Draft">Draft</SelectItem>
									<SelectItem value="Archived">Archived</SelectItem>
								</SelectContent>
							</Select>

							<!-- Category Filter -->
							<Select v-model="selectedCategoryFilter">
								<SelectTrigger class="w-[140px]">
									<SelectValue placeholder="All Categories" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									<SelectItem
										v-for="category in categories"
										:key="category.id"
										:value="category.slug"
									>
										{{ category.name }}
									</SelectItem>
								</SelectContent>
							</Select>

							<!-- Sort Options -->
							<Select v-model="sortOption">
								<SelectTrigger class="w-[140px]">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="created_at-desc">Newest</SelectItem>
									<SelectItem value="created_at-asc">Oldest</SelectItem>
									<SelectItem value="price-asc">Price ↑</SelectItem>
									<SelectItem value="price-desc">Price ↓</SelectItem>
									<SelectItem value="title-asc">Title A-Z</SelectItem>
									<SelectItem value="title-desc">Title Z-A</SelectItem>
								</SelectContent>
							</Select>

							<!-- View Toggle -->
							<div class="flex border rounded-md">
								<Button
									variant="ghost"
									size="sm"
									:class="{ 'bg-accent': viewMode === 'grid' }"
									@click="viewMode = 'grid'"
								>
									<Grid3X3 class="w-4 h-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									:class="{ 'bg-accent': viewMode === 'list' }"
									@click="viewMode = 'list'"
								>
									<List class="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Loading State -->
			<div v-if="loading" class="flex justify-center py-12">
				<div
					class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
				></div>
			</div>

			<!-- Empty States -->
			<div v-else-if="!items.length && !loading" class="text-center py-12">
				<div v-if="!hasFilters" class="max-w-md mx-auto">
					<Package class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
					<h3 class="text-xl font-semibold mb-2">No listings yet</h3>
					<p class="text-muted-foreground mb-6">
						Create your first listing to start selling on the marketplace
					</p>
					<Button
						@click="$router.push('/marketplace/item')"
						class="flex items-center gap-2 mx-auto"
					>
						<Plus class="w-4 h-4" />
						Create your first listing
					</Button>
				</div>
				<div v-else class="max-w-md mx-auto">
					<Search class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
					<h3 class="text-xl font-semibold mb-2">No matches found</h3>
					<p class="text-muted-foreground mb-6">
						Try adjusting your filters or search terms
					</p>
					<Button @click="clearFilters" variant="outline"
						>Clear all filters</Button
					>
				</div>
			</div>

			<!-- Items Grid/List -->
			<div v-else>
				<!-- Grid View -->
				<div
					v-if="viewMode === 'grid'"
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
				>
					<MarketplaceMyListingCard
						v-for="item in items"
						:key="item.id"
						:item="item"
						@action="handleItemAction"
					/>
				</div>

				<!-- List View -->
				<div v-else class="space-y-4">
					<MarketplaceMyListingRow
						v-for="item in items"
						:key="item.id"
						:item="item"
						@action="handleItemAction"
					/>
				</div>

				<!-- Pagination -->
				<div class="mt-8 flex justify-center">
					<Pagination
						:page="currentPage"
						:total="totalItems"
						:items-per-page="itemsPerPage"
						@update:page="handlePageChange"
					/>
				</div>
			</div>
		</div>
	</div>
	<ModalEditMyItem
		:item="selectedItemForEdit"
		:open="isEditModalOpen"
		@update:open="isEditModalOpen = $event"
		@item-updated="handleItemUpdated"
	/>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { watchDebounced } from "@vueuse/core";
import {
	Plus,
	Package,
	BarChart3,
	Eye,
	MessageSquare,
	TrendingUp,
	Search,
	Grid3X3,
	List,
} from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Pagination } from "~/components/ui/pagination";

import {
	getItems,
	updateItem,
	deleteItem,
	getImagesForItemIds,
	type Item,
	type ItemsQueryOptions,
	type ItemStatus,
} from "~/services/items.service";
import { useSessionStore } from "~/stores/session.store";
import { useCategoriesStore } from "~/stores/categories.store";
import { toast } from "vue-sonner";
import { storeToRefs } from "pinia";

// Page metadata
definePageMeta({
	layout: "marketplace",
	requiresAuth: true,
});

// Store and reactive state
const sessionStore = useSessionStore();
const router = useRouter();

// Data state
const items = ref<Item[]>([]);
const categoriesStore = useCategoriesStore();
const { categories } = storeToRefs(categoriesStore);
const loading = ref(true);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(12);

// UI state
const viewMode = ref<"grid" | "list">("grid");
const isEditModalOpen = ref(false);
const selectedItemForEdit = ref<Item | null>(null);

// Filter state
const searchQuery = ref("");
const selectedStatusFilter = ref("all");
const selectedCategoryFilter = ref("all");
const sortOption = ref("created_at-desc");

// Performance stats (mock data for now)
const performanceStats = ref({
	views: 247,
	inquiries: 18,
	conversion: 12.5,
});

// Computed properties
const statusStats = computed(() => {
	const stats = [
		{
			status: "Available",
			label: "Active",
			count: 0,
			badgeClass: "bg-emerald-100 text-emerald-800",
		},
		{
			status: "Draft",
			label: "Drafts",
			count: 0,
			badgeClass: "bg-gray-100 text-gray-800",
		},
		{
			status: "Reserved",
			label: "Reserved",
			count: 0,
			badgeClass: "bg-amber-100 text-amber-800",
		},
		{
			status: "Sold",
			label: "Sold",
			count: 0,
			badgeClass: "bg-rose-100 text-rose-800",
		},
		{
			status: "Archived",
			label: "Archived",
			count: 0,
			badgeClass: "bg-slate-100 text-slate-800",
		},
	];

	// Count items by status (this would be calculated from all user items, not just current filtered items)
	items.value.forEach((item) => {
		const stat = stats.find((s) => s.status === item.status);
		if (stat) stat.count++;
	});

	return stats;
});

const hasFilters = computed(() => {
	return !!(
		searchQuery.value ||
		(selectedStatusFilter.value && selectedStatusFilter.value !== "all") ||
		(selectedCategoryFilter.value && selectedCategoryFilter.value !== "all")
	);
});

// Methods
async function loadItems() {
	if (!sessionStore.user?.id) return;

	loading.value = true;
	try {
		const [sortBy, sortDir] = sortOption.value.split("-") as [
			string,
			"asc" | "desc"
		];

		const options: ItemsQueryOptions = {
			page: currentPage.value,
			pageSize: itemsPerPage.value,
			ownerId: sessionStore.user.id,
			sortBy:
				sortBy === "title" ? "created_at" : (sortBy as "created_at" | "price"),
			sortDir,
		};

		if (searchQuery.value) options.search = searchQuery.value;
		if (selectedStatusFilter.value && selectedStatusFilter.value !== "all")
			options.status = selectedStatusFilter.value as any;
		if (
			selectedCategoryFilter.value &&
			selectedCategoryFilter.value !== "all"
		) {
			const category = categories.value.find(
				(c) => c.slug === selectedCategoryFilter.value
			);
			if (category) options.categoryId = category.id;
		}

		const { data, error, count } = await getItems(options);

		if (error) {
			console.error("Error loading items:", error);
			toast.error("Failed to load your listings");
			return;
		}

		if (data && data.length > 0) {
			const itemIds = data.map((item) => item.id);
			const { data: images, error: imageError } = await getImagesForItemIds(
				itemIds
			);

			if (imageError) {
				console.error("Error loading images:", imageError);
			}

			if (images) {
				// Group images by item_id
				const imageMap = new Map<string, any[]>();
				images.forEach((image) => {
					if (!imageMap.has(image.item_id)) {
						imageMap.set(image.item_id, []);
					}
					imageMap.get(image.item_id)!.push(image);
				});

				data.forEach((item) => {
					item.images = imageMap.get(item.id) || [];
					const primaryImage =
						item.images.find((img) => img.is_primary) || item.images[0];
					item.primary_image_path = primaryImage ? primaryImage.path : null;
				});
			}
		}

		items.value = data || [];
		totalItems.value = count || 0;

		// Sort by title if needed (since API doesn't support title sorting)
		if (sortBy === "title") {
			items.value.sort((a, b) => {
				const comparison = a.title.localeCompare(b.title);
				return sortDir === "desc" ? -comparison : comparison;
			});
		}
	} catch (error) {
		console.error("Unexpected error loading items:", error);
		toast.error("Failed to load your listings");
	} finally {
		loading.value = false;
	}
}

function toggleStatusFilter(status: string) {
	selectedStatusFilter.value =
		selectedStatusFilter.value === status ? "all" : status;
}

function clearFilters() {
	searchQuery.value = "";
	selectedStatusFilter.value = "all";
	selectedCategoryFilter.value = "all";
	sortOption.value = "created_at-desc";
}

function handlePageChange(page: number) {
	currentPage.value = page;
	loadItems();
}

async function handleItemAction(action: string, itemId: string) {
	const item = items.value.find((i) => i.id === itemId);
	if (!item) return;

	try {
		switch (action) {
			case "edit":
				selectedItemForEdit.value = item;
				isEditModalOpen.value = true;
				break;
			case "view":
				router.push(`/marketplace/items/${itemId}`);
				break;
			case "mark-sold":
				{
					const { error } = await updateItem(itemId, { status: "Sold" });
					if (error) {
						toast.error("Failed to mark item as sold.");
						console.error("Error marking as sold:", error);
					} else {
						toast.success("Item marked as sold");
						loadItems();
					}
				}
				break;
			case "mark-reserved":
				{
					const { error } = await updateItem(itemId, {
						status: "Reserved",
					});
					if (error) {
						toast.error("Failed to mark item as reserved.");
						console.error("Error marking as reserved:", error);
					} else {
						toast.success("Item marked as reserved");
						loadItems();
					}
				}
				break;
			case "mark-available":
				{
					const { error } = await updateItem(itemId, {
						status: "Available",
					});
					if (error) {
						toast.error("Failed to mark item as available.");
						console.error("Error marking as available:", error);
					} else {
						toast.success("Item marked as available");
						loadItems();
					}
				}
				break;
			case "duplicate":
				router.push(`/marketplace/item?duplicate=${itemId}`);
				break;
			case "share":
				await navigator.clipboard.writeText(
					`${window.location.origin}/marketplace/items/${itemId}`
				);
				toast.success("Link copied to clipboard");
				break;
			case "copy-id":
				await navigator.clipboard.writeText(itemId);
				toast.success("Item ID copied to clipboard");
				break;
			case "boost":
				// Placeholder for boost functionality
				toast.info("Boost functionality coming soon");
				break;
			case "feature":
				// Placeholder for feature functionality
				toast.info("Feature functionality coming soon");
				break;
			case "message-buyer":
				// Placeholder for messaging functionality
				toast.info("Messaging functionality coming soon");
				break;
			case "rate-buyer":
				// Placeholder for rating functionality
				toast.info("Rating functionality coming soon");
				break;
			case "archive":
				{
					const { error } = await updateItem(itemId, {
						status: "Archived" as ItemStatus,
					});
					if (error) {
						toast.error("Failed to archive item.");
						console.error("Error archiving item:", error);
					} else {
						toast.success("Item archived");
						loadItems();
					}
				}
				break;
			case "restore":
				{
					const { error } = await updateItem(itemId, {
						status: "Available" as ItemStatus,
					});
					if (error) {
						toast.error("Failed to restore item.");
						console.error("Error restoring item:", error);
					} else {
						toast.success("Item restored");
						loadItems();
					}
				}
				break;
			case "delete":
				try {
					await deleteItem(itemId);
					toast.success("Item deleted");
					loadItems();
				} catch (error) {
					toast.error("Failed to delete item.");
					console.error("Error deleting item:", error);
				}
				break;
		}
	} catch (error) {
		console.error("Error handling item action:", error);
		toast.error("Failed to perform action");
	}
}

function handleItemUpdated() {
	loadItems();
	selectedItemForEdit.value = null;
}

// Watchers
watchDebounced(
	[searchQuery, selectedStatusFilter, selectedCategoryFilter, sortOption],
	() => {
		currentPage.value = 1;
		loadItems();
	},
	{ debounce: 300 }
);

// Initialize
onMounted(async () => {
	await sessionStore.initialize();
	if (sessionStore.isAuthenticated) {
		await Promise.all([categoriesStore.fetch(), loadItems()]);
	}
});
</script>
