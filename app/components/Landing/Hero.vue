<template>
	<div
		class="text-center py-16 md:py-24 bg-gradient-to-br from-muted to-secondary mt-4 rounded-4xl"
	>
		<h1 class="text-4xl md:text-6xl font-bold text-foreground mb-6">
			Your Localized Garage Sale in Foreign Lands
		</h1>
		<p class="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
			Buy, sell, or give away what you have — saving time and
			connecting with your local Malaysian community.
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
					<!-- Search Input and Button -->
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<div class="relative flex-1">
							<Input 
								v-model="searchQuery" 
								placeholder="Search for items..." 
								class="w-full" 
								@keyup.enter="handleSearch"
							/>
						</div>
						<Button
							class="bg-primary text-primary-foreground px-8 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
							@click="handleSearch"
						>
							Search
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSessionStore } from "~/stores/session.store";

const session = useSessionStore();
const searchQuery = ref("");

const isLoggedIn = computed(() => !!session.user);

const handleGetStarted = () => {
	if (isLoggedIn.value) {
		navigateTo("/marketplace");
	} else {
		navigateTo("/login?redirect=/marketplace");
	}
};

const handleSearch = () => {
	if (searchQuery.value.trim()) {
		navigateTo(`/marketplace?query=${encodeURIComponent(searchQuery.value)}`);
	} else {
		navigateTo("/marketplace");
	}
};
</script>
