<template>
	<div class="py-16 md:py-24 bg-background">
		<div class="max-w-[1550px] mx-auto px-6">
			<div class="grid lg:grid-cols-2 gap-8 items-center">
				<!-- Text Section on the Right -->
				<div class="lg:order-2">
					<Badge variant="secondary" class="mb-6"> How It Works </Badge>
					<h2 class="text-3xl md:text-4xl font-bold text-foreground mb-6">
						Stress free used-goods market
					</h2>
					<p class="text-lg text-muted-foreground mb-8 leading-relaxed">
						If you've ever tried selling your used goods abroad, you'll realize
						how daunting the process can feel. Not being familiar with the
						foreign environment is intimidating and results in a myriad of
						unexplore transactional opportuninites. Circa opens doors through
						it's simple and intuitive user flow.
					</p>
				</div>

				<!-- Steps Cards on the Left -->
				<div class="lg:order-1">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<!-- Step 1: List or Search -->
						<Card
							class="relative hover:shadow-lg transition-shadow min-h-[240px] flex flex-col bg-card border-border shadow-xl"
						>
							<div
								class="absolute top-4 left-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold"
							>
								1
							</div>
							<CardHeader class="pt-16 text-center flex-1">
								<div
									class="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
								>
									<Search class="w-8 h-8 text-primary" />
								</div>
								<CardTitle class="text-xl mb-2">List or Search</CardTitle>
							</CardHeader>
							<CardContent class="text-center pb-8">
								<p class="text-muted-foreground">
									Post something yourself, or search what you need. Browse
									through items by the community.
								</p>
							</CardContent>
						</Card>

						<!-- Step 2: Reserve -->
						<Card
							class="relative hover:shadow-lg transition-shadow min-h-[240px] flex flex-col bg-card border-border shadow-xl"
						>
							<div
								class="absolute top-4 left-4 w-8 h-8 bg-green-600 text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold"
							>
								2
							</div>
							<CardHeader class="pt-16 text-center flex-1">
								<div
									class="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
								>
									<CalendarCheck class="w-8 h-8 text-green-600" />
								</div>
								<CardTitle class="text-xl mb-2"
									>Negotiate and Reserve</CardTitle
								>
							</CardHeader>
							<CardContent class="text-center pb-8">
								<p class="text-muted-foreground">
									Offer your competitive, honest prices. Accept offers and set
									reservations.
								</p>
							</CardContent>
						</Card>

						<!-- Step 3: Meet & Exchange -->
						<Card
							class="relative hover:shadow-lg transition-shadow min-h-[240px] flex flex-col bg-card border-border shadow-xl"
						>
							<div
								class="absolute top-4 left-4 w-8 h-8 bg-purple-600 text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold"
							>
								3
							</div>
							<CardHeader class="pt-16 text-center flex-1">
								<div
									class="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"
								>
									<Handshake class="w-8 h-8 text-purple-600" />
								</div>
								<CardTitle class="text-xl mb-2">Meet & Exchange</CardTitle>
							</CardHeader>
							<CardContent class="text-center pb-8">
								<p class="text-muted-foreground">
									Message to plan your transaction process. Build trust and
									connectivty amongst community members.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, CalendarCheck, Handshake } from "lucide-vue-next";
import { useSessionStore } from "~/stores/session.store";

const session = useSessionStore();

const isLoggedIn = computed(() => !!session.user);

const handleTryNow = () => {
	if (isLoggedIn.value) {
		navigateTo("/marketplace");
	} else {
		navigateTo("/login?redirect=/marketplace");
	}
};
</script>
