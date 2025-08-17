<template>
	<div>
		<!-- Filter Header -->
		<div class="flex justify-between items-center">
			<h3 class="text-lg font-semibold text-slate-900">Filters</h3>
			<div class="flex space-x-2">
				<Button variant="outline" size="sm" @click="clearFilters">
					Clear All
				</Button>
				<Button variant="outline" size="sm">
					<ArrowUpDown class="mr-2 h-4 w-4" />
					Sort
				</Button>
			</div>
		</div>

		<!-- Main Filters Row -->
		<div class="flex flex-col lg:flex-row gap-4 flex-wrap">
			<!-- Transaction Type Filter -->
			<div class="space-y-2 w-full lg:w-[200px]">
				<Label class="text-sm font-medium text-slate-700"
					>Transaction Type</Label
				>
				<Select v-model="filters.transactionType" class="w-full">
					<SelectTrigger>
						<SelectValue placeholder="All Types" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
						<SelectItem value="sell">For Sale</SelectItem>
						<SelectItem value="borrow">For Borrowing</SelectItem>
						<SelectItem value="giveaway">Free (Giveaway)</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Location Filter -->
			<div class="space-y-2 w-full lg:w-[160px]">
				<Label class="text-sm font-medium text-slate-700">Location</Label>
				<Select v-model="filters.location" class="w-full">
					<SelectTrigger>
						<SelectValue placeholder="All Locations" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Locations</SelectItem>
						<SelectItem value="campus">Campus</SelectItem>
						<SelectItem value="north">North</SelectItem>
						<SelectItem value="south">South</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Availability Filter -->
			<div class="space-y-2 w-full lg:w-[160px]">
				<Label class="text-sm font-medium text-slate-700">Availability</Label>
				<Select v-model="filters.availability" class="w-full">
					<SelectTrigger>
						<SelectValue placeholder="Any Time" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="any">Any Time</SelectItem>
						<SelectItem value="now">Available Now</SelectItem>
						<SelectItem value="24h">Next 24 hours</SelectItem>
						<SelectItem value="week">This Week</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Price Range Dropdown -->
			<div class="space-y-2 w-full lg:w-[160px]">
				<Label class="text-sm font-medium text-slate-700">Price Range</Label>
				<DropdownMenu>
					<DropdownMenuTrigger as-child>
						<Button variant="outline" class="w-full justify-between">
							<span class="text-sm">
								${{ filters.priceRange[0] ?? 0 }} - ${{
									(filters.priceRange[1] ?? 1000) === 1000
										? "1000+"
										: filters.priceRange[1] ?? 1000
								}}
							</span>
							<ChevronDown class="h-4 w-4 opacity-50" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-80 p-4">
						<div class="space-y-4">
							<div class="flex justify-between items-center">
								<span class="text-sm font-medium">Set Price Range</span>
								<span class="text-xs text-slate-500">
									${{ filters.priceRange[0] ?? 0 }} - ${{
										(filters.priceRange[1] ?? 1000) === 1000
											? "1000+"
											: filters.priceRange[1] ?? 1000
									}}
								</span>
							</div>
							<div class="px-1">
								<Slider
									v-model="filters.priceRange"
									:max="1000"
									:min="0"
									:step="10"
									class="w-full"
								/>
								<div class="flex justify-between text-xs text-slate-400 mt-2">
									<span>$0</span>
									<span>$250</span>
									<span>$500</span>
									<span>$750</span>
									<span>$1000+</span>
								</div>
							</div>
							<div class="flex justify-between gap-2 pt-2">
								<Button
									variant="outline"
									size="sm"
									@click="filters.priceRange = [0, 1000]"
									class="flex-1"
								>
									Reset
								</Button>
								<Button
									variant="outline"
									size="sm"
									@click="filters.priceRange = [0, 0]"
									class="flex-1"
								>
									Free Only
								</Button>
							</div>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>

		<!-- Quick Filters Row -->
		<div
			class="flex items-center justify-between pt-4 border-t border-slate-100 mt-4"
		>
			<div class="flex items-center gap-4">
				<Label class="text-sm font-medium text-slate-700">Quick Filters:</Label>
				<div class="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						:class="{
							'bg-blue-50 border-blue-200 text-blue-700': filters.onlyAvailable,
						}"
						@click="filters.onlyAvailable = !filters.onlyAvailable"
					>
						Available Only
					</Button>
					<Button
						variant="outline"
						size="sm"
						:class="{
							'bg-green-50 border-green-200 text-green-700': filters.onlyFree,
						}"
						@click="filters.onlyFree = !filters.onlyFree"
					>
						Free Items
					</Button>
				</div>
			</div>

			<div class="text-xs text-slate-500">{{ totalItems }} items found</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const props = defineProps<{
	totalItems: number;
}>();

const filters = defineModel<{
	transactionType: string;
	location: string;
	availability: string;
	priceRange: [number, number];
	onlyAvailable: boolean;
	onlyFree: boolean;
}>({
	default: () => ({
		transactionType: "all",
		location: "all",
		availability: "any",
		priceRange: [0, 1000] as [number, number],
		onlyAvailable: false,
		onlyFree: false,
	}),
});

// Clear filters function
const clearFilters = () => {
	filters.value = {
		transactionType: "all",
		location: "all",
		availability: "any",
		priceRange: [0, 1000],
		onlyAvailable: false,
		onlyFree: false,
	};
};
</script>
