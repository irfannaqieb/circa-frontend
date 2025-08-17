<template>
	<div class="w-64 p-4 border-r flex flex-col sticky top-0 h-screen">
		<div class="flex items-center space-x-3 mb-6">
			<div
				class="w-10 h-10 bg-black rounded-full flex items-center justify-center"
			>
				<span class="text-white font-bold text-lg">c.</span>
			</div>
			<span class="text-xl font-bold text-gray-900">circa</span>
		</div>

		<ProfileDropdown />

		<h1 class="text-lg font-semibold text-gray-500 mt-6 mb-2">Marketplace</h1>
		<ul>
			<li class="mt-2">
				<a
					href="#"
					class="flex items-center text-gray-600 hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
				>
					<List class="w-5 h-5 mr-3" />
					<span>My Listings</span>
				</a>
			</li>
			<li class="mt-2">
				<a
					href="#"
					class="flex items-center text-gray-600 hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
				>
					<MessageSquare class="w-5 h-5 mr-3" />
					<span>Messages</span>
				</a>
			</li>
		</ul>

		<Separator class="my-2" />

		<h1 class="text-lg font-semibold text-gray-500 mt-2 mb-2">Categories</h1>
		<ul>
			<li v-for="category in categories" :key="category.name" class="mt-2">
				<NuxtLink
					:to="`/marketplace/category/${category.slug}`"
					class="flex items-center text-gray-600 hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
				>
					<component :is="category.icon" class="w-5 h-5 mr-3" />
					<span>{{ category.name }}</span>
				</NuxtLink>
			</li>
			<li class="mt-2">
				<NuxtLink
					to="/marketplace/category"
					class="flex items-center text-gray-600 hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
				>
					<Ellipsis class="w-5 h-5 mr-3" />
					<span>Show all categories</span>
				</NuxtLink>
			</li>
		</ul>

		<div class="mt-auto">
			<Separator class="my-2" />
			<ul>
				<li class="mt-2">
					<NuxtLink
						to="/support"
						class="flex items-center text-gray-600 hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
					>
						<LifeBuoy class="w-5 h-5 mr-3" />
						<span>Help & Support</span>
					</NuxtLink>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	Smartphone,
	Watch,
	Shirt,
	Backpack,
	Home,
	Book,
	Car,
	List,
	MessageSquare,
	Ellipsis,
	LifeBuoy,
} from "lucide-vue-next";

import { Separator } from "~/components/ui/separator";

const categories = [
	{
		name: "Electronics & Gadgets",
		slug: "electronics-gadgets",
		icon: Smartphone,
	},
	{ name: "Clothing & Accessories", slug: "clothing-accessories", icon: Shirt },
	{ name: "Sports & Outdoor", slug: "sports-outdoor", icon: Backpack },
	{ name: "Home & Garden", slug: "home-garden", icon: Home },
	{ name: "Toys & Games", slug: "toys-games", icon: Watch },
	{ name: "Books & Magazines", slug: "books-magazines", icon: Book },
	{ name: "Cars & Motorcycles", slug: "cars-motorcycles", icon: Car },
];
</script>
