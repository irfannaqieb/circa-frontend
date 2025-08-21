<template>
	<div class="mb-8">
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-slate-900 mb-2">Browse Categories</h1>
			<p class="text-lg text-slate-600">
				Find exactly what you're looking for by exploring our categories.
			</p>
		</div>

		<!-- Loading Skeletons -->
		<div
			v-if="loading"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
		>
			<div
				v-for="n in 8"
				:key="n"
				class="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
			>
				<div class="flex items-center space-x-4 mb-4">
					<Skeleton class="w-12 h-12 rounded-lg" />
					<div class="space-y-2">
						<Skeleton class="h-4 w-32" />
						<Skeleton class="h-3 w-20" />
					</div>
				</div>
			</div>
		</div>

		<!-- Categories Grid -->
		<div
			v-else
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
							<component
								:is="ICONS[category.icon_key!]"
								class="w-6 h-6 text-blue-600"
							/>
						</div>
						<div>
							<h3 class="text-lg font-semibold text-slate-900">
								{{ category.name }}
							</h3>
							<p class="text-sm text-slate-500">
								<span v-if="!countsLoading"
									>{{ itemCounts[category.id] }} items</span
								>
								<span v-else>...</span>
							</p>
						</div>
					</div>
				</div>
			</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCategoriesStore } from "~/stores/categories.store";
import { storeToRefs } from "pinia";
import { getItemsCount } from "~/services/items.service";
import { ICONS } from "~/lib/icon.map";
import { Skeleton } from "~/components/ui/skeleton";

definePageMeta({
	layout: "marketplace",
});

const categoriesStore = useCategoriesStore();
const { categories, loading } = storeToRefs(categoriesStore);
const itemCounts = ref<Record<string, number>>({});
const countsLoading = ref(true);

onMounted(async () => {
	await categoriesStore.fetch();
	if (categories.value.length > 0) {
		countsLoading.value = true;
		const countPromises = categories.value.map(async (category) => {
			const { count } = await getItemsCount({ categoryId: category.id });
			itemCounts.value[category.id] = count || 0;
		});
		await Promise.all(countPromises);
		countsLoading.value = false;
	}
});
</script>

<style scoped></style>
