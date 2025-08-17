<template>
	<div
		class="text-center py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100 mt-4 rounded-4xl"
	>
		<h1 class="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
			Your Home's Treasure Chest
		</h1>
		<p class="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
			Lend, borrow, and give away what you have — save money, reduce waste, and
			connect with your community.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
			<Button
				class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
			>
				Get Started
			</Button>
			<NuxtLink to="/marketplace">
				<Button
					class="border border-slate-300 px-8 py-3 rounded-lg font-medium transition-colors"
				>
					Browse Items
				</Button>
			</NuxtLink>
		</div>

		<div class="max-w-4xl mx-auto px-4">
			<div class="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
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
								<SelectValue placeholder="Zone" />
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
							class="bg-blue-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
						>
							Search
						</Button>
					</div>

					<!-- Search Button -->
					<div class="flex justify-center"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Select options are now defined directly in the template
</script>
