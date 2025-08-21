<template>
	<div class="mb-8">
		<!-- Category Header -->
		<div v-if="isLoading" class="mb-8">
			<div class="flex items-center space-x-4 mb-4">
				<Skeleton class="w-16 h-16 rounded-xl" />
				<div class="space-y-2">
					<Skeleton class="h-10 w-64" />
					<Skeleton class="h-6 w-96" />
				</div>
			</div>
		</div>
		<div v-else-if="categoryData" class="mb-8">
			<div class="flex items-center space-x-4 mb-4">
				<div
					class="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center"
				>
					<component
						:is="ICONS[categoryData.icon_key!]"
						v-if="categoryData.icon_key"
						class="w-8 h-8 text-primary"
					/>
				</div>
				<div>
					<h1 class="text-4xl font-bold text-foreground">
						{{ categoryData?.name }}
					</h1>
				</div>
			</div>

			<!-- Breadcrumb -->
			<nav class="flex items-center space-x-2 text-sm text-muted-foreground">
				<NuxtLink to="/marketplace" class="hover:text-foreground"
					>Marketplace</NuxtLink
				>
				<span>/</span>
				<NuxtLink to="/marketplace/category" class="hover:text-foreground"
					>Categories</NuxtLink
				>
				<span>/</span>
				<span class="text-foreground font-medium">{{
					categoryData?.name
				}}</span>
			</nav>
		</div>

		<!-- Filters Section -->
		<div class="my-8">
			<div class="bg-card rounded-xl shadow-sm border border-border p-6">
				<MarketplaceItemFilter
					:total-items="filteredItems.length"
					v-model="filters"
				/>
			</div>
		</div>

		<!-- Items Grid -->
		<div class="mb-6">
			<h2 class="text-2xl font-bold">{{ categoryData?.name }} Items</h2>
		</div>

		<div
			v-if="isLoading"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			<div v-for="n in 8" :key="n" class="space-y-2">
				<Skeleton class="h-48 w-full" />
				<Skeleton class="h-4 w-3/4" />
				<Skeleton class="h-4 w-1/2" />
			</div>
		</div>
		<div
			v-else-if="paginatedItems.length"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			<MarketplaceItemCard
				v-for="item in paginatedItems"
				:key="item.id"
				:status="item.status"
				:title="item.title"
				:price="item.price"
				:location="item.location"
				:images="item.images"
				:timeAgo="item.timeAgo"
			/>
		</div>
		<div v-else class="text-center py-12 text-muted-foreground">
			No items found in this category.
		</div>

		<!-- Pagination -->
		<div class="mt-12 space-y-6">
			<div class="text-sm text-muted-foreground text-center">
				<span class="font-medium">
					Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} items
				</span>
			</div>

			<div
				v-if="!isLoading && totalItems > pageSize"
				class="flex justify-center"
			>
				<Pagination
					:page="currentPage"
					:items-per-page="pageSize"
					:total="totalItems"
					:sibling-count="1"
					@update:page="currentPage = $event"
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
import { ref, computed, onMounted, watch } from "vue";
import {
	Smartphone,
	Shirt,
	Backpack,
	Home,
	Watch,
	Book,
	Car,
} from "lucide-vue-next";
import MarketplaceItemFilter from "~/components/Marketplace/ItemFilter.vue";
import { Button } from "~/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "~/components/ui/pagination";
import { useCategoriesStore } from "~/stores/categories.store";
import { useItemsStore } from "~/stores/items.store";
import { ICONS } from "~/lib/icon.map";
import { Skeleton } from "~/components/ui/skeleton";
import type { Item } from "~/services/items.service";
import { getImageUrl } from "~/services/items.service";

definePageMeta({
	layout: "marketplace",
});

const route = useRoute();
const slug = route.params.slug as string;

const categoriesStore = useCategoriesStore();
const itemsStore = useItemsStore();

onMounted(() => {
	categoriesStore.fetch();
});

const categoryData = computed(() => {
	return categoriesStore.categories.find((c) => c.slug === slug);
});

watch(
	categoryData,
	(newCategory) => {
		if (newCategory) {
			itemsStore.setFilters({ categoryId: newCategory.id });
		}
	},
	{ immediate: true }
);

// Filter state
const filters = ref({
	transactionType: "all",
	location: "all",
	availability: "any",
	priceRange: [0, 10000000] as [number, number],
	onlyAvailable: false,
	onlyFree: false,
});

const categoryItems = computed((): Item[] => {
	return itemsStore.items;
});

const formattedItems = computed(() => {
	return categoryItems.value.map((item) => {
		const priceValue = item.is_giveaway ? 0 : item.base_price_minor || 0;
		const transactionType = item.is_giveaway ? "giveaway" : "sell";
		const images =
			Array.isArray(item.images) && item.images.length > 0
				? item.images
						.sort((a, b) => a.position - b.position)
						.map((img) => getImageUrl(img.path))
				: [];

		return {
			id: item.id,
			title: item.title,
			price: priceValue === 0 ? "Free" : `₩${priceValue.toLocaleString()}`,
			priceValue: priceValue,
			location: item.location || "N/A",
			status: item.status || "Available",
			transactionType: transactionType,
			images: images,
			timeAgo: new Date(item.created_at!).toLocaleDateString(),
		};
	});
});

// Get items for current category with filters applied
const filteredItems = computed(() => {
	let items = formattedItems.value;

	// Apply transaction type filter
	if (filters.value.transactionType !== "all") {
		items = items.filter(
			(item) => item.transactionType === filters.value.transactionType
		);
	}

	// Apply location filter
	if (filters.value.location !== "all") {
		items = items.filter(
			(item) => item.location.toLowerCase() === filters.value.location
		);
	}

	// Apply availability filter (status-based)
	if (filters.value.availability === "now") {
		items = items.filter((item) => item.status === "Available");
	}

	// Apply price range filter
	items = items.filter(
		(item) =>
			item.priceValue >= filters.value.priceRange[0] &&
			item.priceValue <= filters.value.priceRange[1]
	);

	// Apply quick filters
	if (filters.value.onlyAvailable) {
		items = items.filter((item) => item.status === "Available");
	}

	if (filters.value.onlyFree) {
		items = items.filter((item) => item.transactionType === "giveaway");
	}

	return items;
});

// Pagination state
const currentPage = ref(1);
const pageSize = ref(8); // Reduced page size to show pagination more easily

const totalItems = computed(() => filteredItems.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const startItem = computed(() =>
	filteredItems.value.length === 0
		? 0
		: (currentPage.value - 1) * pageSize.value + 1
);
const endItem = computed(() =>
	filteredItems.value.length === 0
		? 0
		: Math.min(currentPage.value * pageSize.value, totalItems.value)
);

const paginatedItems = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	const end = start + pageSize.value;
	return filteredItems.value.slice(start, end);
});

const isLoading = computed(() => categoriesStore.loading || itemsStore.loading);
</script>

<style scoped></style>
