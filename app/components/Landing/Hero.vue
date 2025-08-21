<template>
	<div
		class="text-center py-16 md:py-24 bg-gradient-to-br from-muted to-secondary mt-4 rounded-4xl"
	>
		<h1 class="text-4xl md:text-6xl font-bold text-foreground mb-6">
			Your Home's Treasure Chest
		</h1>
		<p class="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
			Lend, borrow, and give away what you have — save money, reduce waste, and
			connect with your community.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
			<Button
				class="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
				@click="handleGetStarted"
			>
				Get Started
			</Button>
			<NuxtLink to="/marketplace">
				<Button
					variant="outline"
					class="px-8 py-3 rounded-lg font-medium transition-colors"
				>
					Browse Items
				</Button>
			</NuxtLink>
		</div>

		<div class="max-w-4xl mx-auto px-4">
			<div class="bg-card rounded-xl shadow-lg border border-border p-6">
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
							class="bg-primary text-primary-foreground px-8 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSessionStore } from "~/stores/session.store";

const session = useSessionStore();

const isLoggedIn = computed(() => !!session.user);

const handleGetStarted = () => {
	if (isLoggedIn.value) {
		navigateTo("/marketplace");
	} else {
		navigateTo("/login?redirect=/marketplace");
	}
};
</script>
