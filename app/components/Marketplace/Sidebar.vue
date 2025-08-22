<template>
	<!-- the logo row -->
	<div class="w-64 p-4 border-r flex flex-col sticky top-0 h-screen">
		<NuxtLink to="/" class="mb-6">
			<div class="flex items-center space-x-3">
				<div
					class="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
				>
					<span class="text-primary-foreground font-bold text-lg">c.</span>
				</div>
				<span class="text-xl font-bold text-foreground">circa</span>
			</div>
		</NuxtLink>

		<ProfileDropdown />

		<NuxtLink to="/marketplace" class="text-lg font-semibold text-muted-foreground mt-6 mb-2 hover:text-primary transition-colors">
			Marketplace
		</NuxtLink>
		<Button asChild variant="outline" class="mb-2 justify-start shadow-md">
			<NuxtLink to="/marketplace/item">
				<Plus class="w-4 h-4" />
				Add Item
			</NuxtLink>
		</Button>
		<ul>
			<li class="mt-2">
				<NuxtLink
					to="/marketplace/my-listings"
					class="flex items-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
				>
					<List class="w-5 h-5 mr-3" />
					<span>My Listings</span>
				</NuxtLink>
			</li>
			<li class="mt-2">
				<NuxtLink
					to="/marketplace/chat"
					class="flex items-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
				>
					<MessageSquare class="w-5 h-5 mr-3" />
					<span>Messages</span>
				</NuxtLink>
			</li>
		</ul>

		<Separator class="my-2" />

		<h1 class="text-lg font-semibold text-muted-foreground mt-2 mb-2">
			Categories
		</h1>
		<ul>
			<li
				v-for="category in categories"
				:key="category.id ?? category.slug"
				class="mt-2"
			>
				<NuxtLink
					:to="`/marketplace/category/${encodeURIComponent(category.slug)}`"
					class="flex items-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
				>
					<component
						:is="resolveIcon(category.icon_key)"
						class="w-5 h-5 mr-3"
					/>
					<span>{{ category.name }}</span>
				</NuxtLink>
			</li>
			<li class="mt-2">
				<NuxtLink
					to="/marketplace/category"
					class="flex items-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
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
						class="flex items-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
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
import { List, MessageSquare, Ellipsis, LifeBuoy, Plus } from "lucide-vue-next";
import { useCategoriesStore } from "~/stores/categories.store";
import { ICONS } from "~/lib/icon.map";

import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { storeToRefs } from "pinia";

const categoriesStore = useCategoriesStore();
categoriesStore.fetch();

const { categories } = storeToRefs(categoriesStore);

const resolveIcon = (key?: string): Component => {
	return ICONS[key as keyof typeof ICONS] ?? Ellipsis;
};
</script>