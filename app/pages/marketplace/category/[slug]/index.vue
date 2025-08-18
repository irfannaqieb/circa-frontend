<template>
	<div class="mb-8">
		<!-- Category Header -->
		<div class="mb-8">
			<div class="flex items-center space-x-4 mb-4">
				<div
					class="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center"
				>
					<component :is="categoryData?.icon" class="w-8 h-8 text-primary" />
				</div>
				<div>
					<h1 class="text-4xl font-bold text-foreground">
						{{ categoryData?.name }}
					</h1>
					<p class="text-lg text-muted-foreground">
						{{ categoryData?.description }}
					</p>
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
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			<MarketplaceItemCard
				v-for="item in paginatedItems"
				:key="item.id"
				:status="item.status"
				:title="item.title"
				:price="item.price"
				:location="item.location"
				:image="item.image"
				:timeAgo="item.timeAgo"
			/>
		</div>

		<!-- Pagination -->
		<div class="mt-12 space-y-6">
			<div class="text-sm text-muted-foreground text-center">
				<span class="font-medium">
					Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} items
				</span>
			</div>

			<div class="flex justify-center" v-if="totalItems > pageSize">
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
import { ref, computed } from "vue";
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
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "~/components/ui/pagination";

definePageMeta({
	layout: "marketplace",
});

const route = useRoute();
const slug = route.params.slug as string;

// Category data mapping
const categoryMap = {
	"electronics-gadgets": {
		name: "Electronics & Gadgets",
		icon: Smartphone,
		description:
			"Phones, laptops, accessories, and more tech gear for sale or rent.",
	},
	"clothing-accessories": {
		name: "Clothing & Accessories",
		icon: Shirt,
		description:
			"Fashion items, shoes, bags, and accessories from your wardrobe.",
	},
	"sports-outdoor": {
		name: "Sports & Outdoor",
		icon: Backpack,
		description: "Sports equipment, outdoor gear, and fitness accessories.",
	},
	"home-garden": {
		name: "Home & Garden",
		icon: Home,
		description:
			"Furniture, decor, tools, and everything for your living space.",
	},
	"toys-games": {
		name: "Toys & Games",
		icon: Watch,
		description: "Board games, video games, toys, and entertainment items.",
	},
	"books-magazines": {
		name: "Books & Magazines",
		icon: Book,
		description: "Textbooks, novels, magazines, and educational materials.",
	},
	"cars-motorcycles": {
		name: "Cars & Motorcycles",
		icon: Car,
		description: "Vehicles, car parts, and automotive accessories.",
	},
};

const categoryData = computed(
	() => categoryMap[slug as keyof typeof categoryMap]
);

// Filter state
const filters = ref({
	transactionType: "all",
	location: "all",
	availability: "any",
	priceRange: [0, 1000] as [number, number],
	onlyAvailable: false,
	onlyFree: false,
});

// Sample data for different categories
const mockItems = {
	"electronics-gadgets": [
		{
			id: "1",
			title: "iPhone 14 Pro",
			price: "$800",
			priceValue: 800,
			location: "Campus",
			status: "Available",
			transactionType: "sell",
			image:
				"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
			timeAgo: "2 hours ago",
		},
		{
			id: "2",
			title: "MacBook Air M2",
			price: "$1200",
			priceValue: 1200,
			location: "North",
			status: "Reserved",
			transactionType: "sell",
			image:
				"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
			timeAgo: "5 hours ago",
		},
		{
			id: "3",
			title: 'iPad Pro 11"',
			price: "$600",
			priceValue: 600,
			location: "South",
			status: "Available",
			transactionType: "borrow",
			image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
			timeAgo: "1 day ago",
		},
		{
			id: "4",
			title: "AirPods Pro",
			price: "Free",
			priceValue: 0,
			location: "Campus",
			status: "Available",
			transactionType: "giveaway",
			image:
				"https://images.unsplash.com/photo-1606841837239-c5a1c32d4e0a?w=400",
			timeAgo: "2 days ago",
		},
		{
			id: "5",
			title: "Gaming Headset",
			price: "$120",
			priceValue: 120,
			location: "North",
			status: "Available",
			transactionType: "borrow",
			image:
				"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
			timeAgo: "3 hours ago",
		},
	],
	"clothing-accessories": [
		{
			id: "6",
			title: "Designer Handbag",
			price: "$150",
			priceValue: 150,
			location: "Campus",
			status: "Available",
			transactionType: "sell",
			image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
			timeAgo: "3 hours ago",
		},
		{
			id: "7",
			title: "Vintage Leather Jacket",
			price: "$120",
			priceValue: 120,
			location: "North",
			status: "Available",
			transactionType: "sell",
			image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
			timeAgo: "6 hours ago",
		},
		{
			id: "8",
			title: "Running Shoes Nike",
			price: "Free",
			priceValue: 0,
			location: "South",
			status: "Available",
			transactionType: "giveaway",
			image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
			timeAgo: "1 day ago",
		},
	],
	"sports-outdoor": [
		{
			id: "9",
			title: "Mountain Bike",
			price: "$300",
			priceValue: 300,
			location: "Campus",
			status: "Available",
			transactionType: "borrow",
			image: "https://images.unsplash.com/photo-1544191696-15693072b41b?w=400",
			timeAgo: "4 hours ago",
		},
		{
			id: "10",
			title: "Tennis Racket",
			price: "$45",
			priceValue: 45,
			location: "North",
			status: "Available",
			transactionType: "sell",
			image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
			timeAgo: "8 hours ago",
		},
	],
	"home-garden": [
		{
			id: "11",
			title: "Desk Lamp",
			price: "$25",
			priceValue: 25,
			location: "Campus",
			status: "Available",
			transactionType: "sell",
			image:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
			timeAgo: "1 hour ago",
		},
		{
			id: "12",
			title: "Office Chair",
			price: "Free",
			priceValue: 0,
			location: "South",
			status: "Available",
			transactionType: "giveaway",
			image:
				"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
			timeAgo: "3 hours ago",
		},
	],
	"toys-games": [
		{
			id: "13",
			title: "Board Game Collection",
			price: "$60",
			priceValue: 60,
			location: "Campus",
			status: "Available",
			transactionType: "borrow",
			image:
				"https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400",
			timeAgo: "2 hours ago",
		},
	],
	"books-magazines": [
		{
			id: "14",
			title: "Computer Science Textbook",
			price: "$40",
			priceValue: 40,
			location: "Campus",
			status: "Available",
			transactionType: "sell",
			image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
			timeAgo: "1 hour ago",
		},
		{
			id: "15",
			title: "Science Fiction Novels",
			price: "Free",
			priceValue: 0,
			location: "North",
			status: "Available",
			transactionType: "giveaway",
			image:
				"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
			timeAgo: "4 hours ago",
		},
	],
	"cars-motorcycles": [
		{
			id: "16",
			title: "Used Honda Civic",
			price: "$8500",
			priceValue: 8500,
			location: "North",
			status: "Available",
			transactionType: "sell",
			image:
				"https://images.unsplash.com/photo-1494976688202-2094b06f5b72?w=400",
			timeAgo: "1 day ago",
		},
	],
};

// Get items for current category with filters applied
const filteredItems = computed(() => {
	let items = mockItems[slug as keyof typeof mockItems] || [];

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
</script>

<style scoped></style>
