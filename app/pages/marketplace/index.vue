<template>
	<div class="mb-8">
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-foreground mb-2">
				Explore the Marketplace
			</h1>
			<p class="text-lg text-muted-foreground">
				Discover hidden gems and connect with your community.
			</p>
		</div>
		<div class="my-8">
			<div class="bg-card rounded-xl shadow-sm border border-border p-6">
				<div class="space-y-4">
					<!-- Search Input and Filter Buttons -->
					<div class="flex flex-col sm:flex-row gap-4 items-center">
						<div class="relative flex-1 w-full">
							<Input
								v-model="searchQuery"
								placeholder="Search for items..."
								class="w-full"
							/>
						</div>
						<div class="flex gap-2">
							<Button
								@click="toggleFilters"
								class="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
							>
								Filters
							</Button>
						</div>
					</div>

					<!-- Quick Filters -->
					<div class="flex items-center gap-4">
						<span class="text-sm font-medium text-foreground">Quick Search:</span>
						<Button
							:variant="filters.onlyAvailable ? 'default' : 'outline'"
							@click="filters.onlyAvailable = !filters.onlyAvailable"
							class="px-4 py-2 rounded-lg font-medium"
						>
							Available Only
						</Button>
						<Button
							:variant="filters.onlyFree ? 'default' : 'outline'"
							@click="filters.onlyFree = !filters.onlyFree"
							class="px-4 py-2 rounded-lg font-medium"
						>
							Free Items
						</Button>
						<span class="text-sm text-muted-foreground">
							{{ formattedItems.length }} items found
						</span>
					</div>

					<!-- Filter Dropdown -->
					<div
						v-if="showFilters"
						class="absolute z-10 bg-card rounded-xl shadow-sm border border-border p-6 mt-2 w-full sm:w-[400px] right-0 sm:right-6"
					>
						<MarketplaceItemFilter
							:total-items="formattedItems.length"
							v-model="filters"
							:hide-quick-filters="true"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">For You</h1>
		</div>
		<div
			v-if="loading"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			<div v-for="n in 8" :key="n" class="space-y-2">
				<Skeleton class="h-48 w-full" />
				<Skeleton class="h-4 w-3/4" />
				<Skeleton class="h-4 w-1/2" />
			</div>
		</div>
		<div
			v-else-if="formattedItems.length > 0"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			<MarketplaceItemCard
				v-for="item in formattedItems"
				:key="item.id"
				:id="item.id"
				:status="item.status"
				:title="item.title"
				:price="item.price"
				:location="item.location"
				:images="item.images"
				:timeAgo="item.timeAgo"
			/>
		</div>
		<div v-else class="text-center py-12 text-muted-foreground">
			No items found.
		</div>

		<!-- Pagination -->
		<div class="mt-12 space-y-6">
			<div class="text-sm text-muted-foreground text-center">
				<span v-if="totalItems > 0" class="font-medium">
					Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} items
				</span>
				<span v-else class="text-muted-foreground">No items found</span>
			</div>

			<div v-if="totalItems > pageSize" class="flex justify-center">
				<Pagination
					:page="currentPage"
					:items-per-page="pageSize"
					:total="totalItems"
					:sibling-count="1"
					@update:page="handlePageChange"
				>
					<PaginationContent class="gap-1">
						<PaginationItem :value="currentPage - 1" class="mr-10">
							<PaginationPrevious
								:href="currentPage > 1 ? '#' : undefined"
								:class="{
									'pointer-events-none opacity-50': currentPage === 1,
									'hover:bg-accent transition-colors': currentPage > 1,
								}"
								class="px-4 py-2 text-sm font-medium"
								@click="currentPage > 1 && currentPage--"
							/>
						</PaginationItem>

						<template v-for="page in totalPages" :key="page">
							<PaginationItem :value="page" class="mx-1">
								<Button
									:variant="page === currentPage ? 'default' : 'outline'"
									class="w-10 h-10 text-sm font-medium transition-all duration-200"
									@click="currentPage = page"
								>
									{{ page }}
								</Button>
							</PaginationItem>
						</template>

						<PaginationItem :value="currentPage + 1" class="ml-8">
							<PaginationNext
								:href="currentPage < totalPages ? '#' : undefined"
								:class="{
									'pointer-events-none opacity-50': currentPage === totalPages,
									'hover:bg-accent transition-colors': currentPage < totalPages,
								}"
								class="px-4 py-2 text-sm font-medium"
								@click="currentPage < totalPages && currentPage++"
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "~/components/ui/pagination";
import { useItemsStore } from "~/stores/items.store";
import { useCategoriesStore } from "~/stores/categories.store";
import { storeToRefs } from "pinia";
import { watchDebounced } from "@vueuse/core";
import { getImageUrl } from "~/services/items.service";
import type { ItemsQueryOptions } from "~/stores/items.store";
import MarketplaceItemFilter from "~/components/Marketplace/ItemFilter.vue";
import { useRoute } from "vue-router";

definePageMeta({
	layout: "marketplace",
});

// Stores
const itemsStore = useItemsStore();
const categoriesStore = useCategoriesStore();
const {
	items,
	loading,
	total: totalItems,
	page: currentPage,
	pageSize,
} = storeToRefs(itemsStore);
const { categories } = storeToRefs(categoriesStore);

// Read query parameter from URL
const route = useRoute();
const searchQuery = ref(route.query.query?.toString() || "");

// Filters
const filters = ref({
	transactionType: "all",
	location: "all",
	availability: "any",
	priceRange: [0, 10000000] as [number, number],
	onlyAvailable: false,
	onlyFree: false,
});

// Dropdown state
const showFilters = ref(false);

// Fetch initial data
onMounted(() => {
	categoriesStore.fetch();
	// Apply initial search query from URL
	const queryFilters: Partial<ItemsQueryOptions> = {
		search: searchQuery.value || undefined,
		transactionType: filters.value.transactionType !== "all" ? filters.value.transactionType : undefined,
		location: filters.value.location !== "all" ? filters.value.location : undefined,
		availability: filters.value.availability !== "any" ? filters.value.availability : undefined,
		priceRange: filters.value.priceRange,
		onlyAvailable: filters.value.onlyAvailable,
		onlyFree: filters.value.onlyFree,
	};
	itemsStore.setFilters(queryFilters);
});

// Toggle filters dropdown
function toggleFilters() {
	showFilters.value = !showFilters.value;
}

// Clear all filters
function clearFilters() {
	filters.value = {
		transactionType: "all",
		location: "all",
		availability: "any",
		priceRange: [0, 10000000],
		onlyAvailable: false,
		onlyFree: false,
	};
	searchQuery.value = "";
	showFilters.value = false; // Close dropdown after clearing
}

// Watch for filter changes
watchDebounced(
	[searchQuery, filters],
	() => {
		const queryFilters: Partial<ItemsQueryOptions> = {
			search: searchQuery.value || undefined,
			transactionType: filters.value.transactionType !== "all" ? filters.value.transactionType : undefined,
			location: filters.value.location !== "all" ? filters.value.location : undefined,
			availability: filters.value.availability !== "any" ? filters.value.availability : undefined,
			priceRange: filters.value.priceRange,
			onlyAvailable: filters.value.onlyAvailable,
			onlyFree: filters.value.onlyFree,
		};
		itemsStore.setFilters(queryFilters);
	},
	{ debounce: 300, immediate: true }
);

// Pagination and formatted items
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const endItem = computed(() =>
	Math.min(currentPage.value * pageSize.value, totalItems.value)
);

const formattedItems = computed(() => {
	let formatted = items.value.map((item) => {
		const priceValue = item.is_giveaway ? 0 : item.base_price_minor || 0;
		const images =
			Array.isArray(item.images) && item.images.length > 0
				? item.images
						.sort((a, b) => a.position - b.position)
						.map((img) => getImageUrl(img.path))
				: [];

		return {
			...item,
			price:
				priceValue === 0 ? `Free` : `₩${(priceValue || 0).toLocaleString()}`,
			timeAgo: new Date(item.created_at!).toLocaleDateString(),
			images,
			status: item.status || "Available",
			location: item.location || "N/A",
			transactionType: item.is_giveaway ? "giveaway" : "sell",
			priceValue: priceValue,
		};
	});

	// Apply quick filters locally
	if (filters.value.onlyAvailable) {
		formatted = formatted.filter((item) => item.status === "Available");
	}
	if (filters.value.onlyFree) {
		formatted = formatted.filter((item) => item.transactionType === "giveaway");
	}

	return formatted;
});

function handlePageChange(page: number) {
	itemsStore.setPage(page);
}
</script>

<style scoped>
/* Ensure dropdown is positioned correctly */
.absolute {
	position: absolute;
}
</style>
