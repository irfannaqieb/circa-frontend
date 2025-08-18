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
						<Input placeholder="Search for items..." class="w-full" />
					</div>

					<!-- Filter Dropdowns -->
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<Select class="w-full sm:w-[200px]">
							<SelectTrigger>
								<SelectValue placeholder="Categories" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="electronics">Electronics</SelectItem>
								<SelectItem value="furniture">Furniture</SelectItem>
								<SelectItem value="books">Books</SelectItem>
							</SelectContent>
						</Select>

						<Select class="w-full sm:w-[200px]">
							<SelectTrigger>
								<SelectValue placeholder="Location" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="campus">Campus</SelectItem>
								<SelectItem value="north">North</SelectItem>
								<SelectItem value="south">South</SelectItem>
							</SelectContent>
						</Select>

						<Select class="w-full sm:w-[200px]">
							<SelectTrigger>
								<SelectValue placeholder="Availability" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="now">Available Now</SelectItem>
								<SelectItem value="24h">Next 24 hours</SelectItem>
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
			<div class="flex space-x-2">
				<Button variant="outline">
					<ListFilter class="mr-2 h-4 w-4" />
					Filter
				</Button>
				<Button variant="outline">
					<ArrowUpDown class="mr-2 h-4 w-4" />
					Sort
				</Button>
			</div>
		</div>
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			<MarketplaceItemCard status="Available" />
			<MarketplaceItemCard status="Reserved" />
			<MarketplaceItemCard status="Sold" />
			<MarketplaceItemCard status="Available" />
			<MarketplaceItemCard status="Reserved" />
			<MarketplaceItemCard status="Sold" />
		</div>

		<!-- Pagination -->
		<div class="mt-12 space-y-6">
			<div class="text-sm text-muted-foreground text-center">
				<span v-if="totalItems > 0" class="font-medium">
					Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} items
				</span>
				<span v-else class="text-muted-foreground">No items found</span>
			</div>

			<div class="flex justify-center">
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
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "~/components/ui/pagination";

definePageMeta({
	layout: "marketplace",
});

// Pagination state
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(120); // This will come from backend later

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const endItem = computed(() =>
	Math.min(currentPage.value * pageSize.value, totalItems.value)
);
</script>

<style scoped></style>
