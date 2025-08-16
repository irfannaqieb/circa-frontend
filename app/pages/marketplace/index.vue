<template>
	<div class="mb-8">
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-slate-900 mb-2">
				Explore the Marketplace
			</h1>
			<p class="text-lg text-slate-600">
				Discover hidden gems and connect with your community.
			</p>
		</div>
		<div class="my-8">
			<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
							class="bg-blue-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
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
	</div>
</template>

<script setup lang="ts">
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

definePageMeta({
	layout: "marketplace",
});
</script>

<style scoped></style>
