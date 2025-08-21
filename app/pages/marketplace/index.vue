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
					<!-- Search Input -->
					<div class="relative">
						<Input
							v-model="searchQuery"
							placeholder="Search for items..."
							class="w-full"
						/>
					</div>

					<!-- Filter Dropdowns -->
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<Select v-model="selectedCategory" class="w-full sm:w-[200px]">
							<SelectTrigger>
								<SelectValue placeholder="Categories" />
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

						<Select v-model="selectedLocation" class="w-full sm:w-[200px]">
							<SelectTrigger>
								<SelectValue placeholder="Location" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Locations</SelectItem>
								<SelectItem value="Sinchon">Sinchon</SelectItem>
								<SelectItem value="Yonsei">Yonsei</SelectItem>
								<SelectItem value="Hongdae">Hongdae</SelectItem>
							</SelectContent>
						</Select>

						<Button
							class="bg-primary text-primary-foreground px-8 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto"
						>
							Search
						</Button>
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
import { ListFilter, ArrowUpDown } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
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

// Filters
const searchQuery = ref("");
const selectedCategory = ref("all");
const selectedLocation = ref("all");

// Fetch initial data
onMounted(() => {
	categoriesStore.fetch();
});

// Watch for filter changes
watchDebounced(
	[searchQuery, selectedCategory, selectedLocation],
	() => {
		const filters: Partial<ItemsQueryOptions> = {
			search: searchQuery.value || undefined,
			categoryId:
				selectedCategory.value !== "all"
					? categories.value.find((c) => c.slug === selectedCategory.value)?.id
					: undefined,
			location:
				selectedLocation.value !== "all" ? selectedLocation.value : undefined,
		};
		itemsStore.setFilters(filters);
	},
	{ debounce: 300, immediate: true }
);

// Pagination and formatted items
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const endItem = computed(() =>
	Math.min(currentPage.value * pageSize.value, totalItems.value)
);

const formattedItems = computed(() =>
	items.value.map((item) => {
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
		};
	})
);

function handlePageChange(page: number) {
	itemsStore.setPage(page);
}
</script>

<style scoped></style>
