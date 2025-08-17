<template>
	<div class="mb-8">
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-slate-900 mb-2">Browse Categories</h1>
			<p class="text-lg text-slate-600">
				Find exactly what you're looking for by exploring our categories.
			</p>
		</div>

		<!-- Categories Grid -->
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
		>
			<NuxtLink
				v-for="category in categories"
				:key="category.slug"
				:to="`/marketplace/category/${category.slug}`"
				class="group"
			>
				<div
					class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 group-hover:scale-[1.02]"
				>
					<div class="flex items-center space-x-4 mb-4">
						<div
							class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors"
						>
							<component :is="category.icon" class="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<h3 class="text-lg font-semibold text-slate-900">
								{{ category.name }}
							</h3>
							<p class="text-sm text-slate-500">
								{{ category.itemCount }} items
							</p>
						</div>
					</div>
					<p class="text-sm text-slate-600">{{ category.description }}</p>
				</div>
			</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	Smartphone,
	Shirt,
	Backpack,
	Home,
	Watch,
	Book,
	Car,
} from "lucide-vue-next";

definePageMeta({
	layout: "marketplace",
});

const categories = [
	{
		name: "Electronics & Gadgets",
		slug: "electronics-gadgets",
		icon: Smartphone,
		itemCount: 24,
		description:
			"Phones, laptops, accessories, and more tech gear for sale or rent.",
	},
	{
		name: "Clothing & Accessories",
		slug: "clothing-accessories",
		icon: Shirt,
		itemCount: 18,
		description:
			"Fashion items, shoes, bags, and accessories from your wardrobe.",
	},
	{
		name: "Sports & Outdoor",
		slug: "sports-outdoor",
		icon: Backpack,
		itemCount: 15,
		description: "Sports equipment, outdoor gear, and fitness accessories.",
	},
	{
		name: "Home & Garden",
		slug: "home-garden",
		icon: Home,
		itemCount: 32,
		description:
			"Furniture, decor, tools, and everything for your living space.",
	},
	{
		name: "Toys & Games",
		slug: "toys-games",
		icon: Watch,
		itemCount: 12,
		description: "Board games, video games, toys, and entertainment items.",
	},
	{
		name: "Books & Magazines",
		slug: "books-magazines",
		icon: Book,
		itemCount: 28,
		description: "Textbooks, novels, magazines, and educational materials.",
	},
	{
		name: "Cars & Motorcycles",
		slug: "cars-motorcycles",
		icon: Car,
		itemCount: 8,
		description: "Vehicles, car parts, and automotive accessories.",
	},
];
</script>

<style scoped></style>
