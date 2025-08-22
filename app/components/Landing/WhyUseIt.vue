<template>
	<div
		class="py-16 md:py-24 bg-gradient-to-br from-muted to-secondary my-4 rounded-4xl"
	>
		<div class="max-w-[1550px] mx-auto px-6">
			<!-- Section Header -->
			<div class="text-center mb-12">
				<Badge variant="outline" class="mb-6"> Why Use Circa? </Badge>
				<h2 class="text-3xl md:text-4xl font-bold text-foreground mb-6">
					Your trusted community
				</h2>
				<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
					Join fellow Malaysian students secure transactional opportunities and
					build meaningful connections through our sharing platform.
				</p>
			</div>

			<!-- Value Props Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
				<!-- Free to Use -->
				<Card
					class="text-center p-6 bg-card/70 backdrop-blur-sm border-card/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
				>
					<div
						class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
					>
						<DollarSign class="w-8 h-8 text-green-600" />
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-3">
						Free to Use
					</h3>
					<p class="text-muted-foreground">
						No rental fees — just mutual goodwill. Save hundreds on items you
						only need occasionally.
					</p>
				</Card>

				<!-- Trusted Profiles -->
				<Card
					class="text-center p-6 bg-card/70 backdrop-blur-sm border-card/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
				>
					<div
						class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
					>
						<Shield class="w-8 h-8 text-primary" />
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-3">
						Trusted Profiles
					</h3>
					<p class="text-muted-foreground">
						Every lender is a member of a curated student organization that
						connects Malaysians together
					</p>
				</Card>

				<!-- Streamlined Selling -->
				<Card
					class="text-center p-6 bg-card/70 backdrop-blur-sm border-card/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
				>
					<div
						class="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center"
					>
						<Zap class="w-8 h-8 text-purple-600" />
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-3">
						Streamlined Selling
					</h3>
					<p class="text-muted-foreground">
						Ditch messy Telegram channels and the Instagram hustle of creating
						multiple posts. List your items in seconds.
					</p>
				</Card>
			</div>

			<!-- Trust Indicators -->
			<div
				class="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-card/50"
			>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
					<div class="space-y-2">
						<div class="text-3xl font-bold text-primary">1,200+</div>
						<p class="text-muted-foreground">Items listed</p>
					</div>
					<div class="space-y-2">
						<div class="text-3xl font-bold text-green-600">92%</div>
						<p class="text-muted-foreground">Successful transactions</p>
					</div>
					<div class="space-y-2">
						<div class="text-3xl font-bold text-purple-600">4.8★</div>
						<p class="text-muted-foreground">Our trust score</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Shield, Users, Award, Zap } from "lucide-vue-next";
import { useSessionStore } from "~/stores/session.store";

const session = useSessionStore();

const isLoggedIn = computed(() => !!session.user);

const handleJoinNow = () => {
	if (isLoggedIn.value) {
		navigateTo("/marketplace");
	} else {
		navigateTo("/login?redirect=/marketplace");
	}
};
</script>
