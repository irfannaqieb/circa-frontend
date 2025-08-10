<template>
	<div
		class="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100 m-4 rounded-xl"
	>
		<div class="max-w-[1550px] mx-auto px-6">
			<!-- Section Header -->
			<div class="text-center mb-12">
				<Badge variant="secondary" class="mb-6"> Why Use Circa? </Badge>
				<h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
					Your trusted campus community
				</h2>
				<p class="text-lg text-slate-600 max-w-2xl mx-auto">
					Join thousands of students saving money, reducing waste, and building
					meaningful connections through our secure sharing platform.
				</p>
			</div>

			<!-- Value Props Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
				<!-- Free to Use -->
				<Card
					class="text-center p-6 bg-white/70 backdrop-blur-sm border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
				>
					<div
						class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
					>
						<DollarSign class="w-8 h-8 text-green-600" />
					</div>
					<h3 class="text-xl font-semibold text-slate-900 mb-3">Free to Use</h3>
					<p class="text-slate-600">
						No rental fees — just mutual goodwill. Save hundreds on items you
						only need occasionally.
					</p>
				</Card>

				<!-- Trusted Profiles -->
				<Card
					class="text-center p-6 bg-white/70 backdrop-blur-sm border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
				>
					<div
						class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"
					>
						<Shield class="w-8 h-8 text-blue-600" />
					</div>
					<h3 class="text-xl font-semibold text-slate-900 mb-3">
						Trusted Profiles
					</h3>
					<p class="text-slate-600">
						Every lender has a trust score & verified reviews. Know who you're
						borrowing from.
					</p>
				</Card>

				<!-- Campus-Only -->
				<Card
					class="text-center p-6 bg-white/70 backdrop-blur-sm border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
				>
					<div
						class="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center"
					>
						<Users class="w-8 h-8 text-purple-600" />
					</div>
					<h3 class="text-xl font-semibold text-slate-900 mb-3">Campus-Only</h3>
					<p class="text-slate-600">
						Your student community, not random strangers. Build connections with
						fellow students.
					</p>
				</Card>

				<!-- Sustainability Points -->
				<Card
					class="text-center p-6 bg-white/70 backdrop-blur-sm border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
				>
					<div
						class="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center"
					>
						<Award class="w-8 h-8 text-yellow-600" />
					</div>
					<h3 class="text-xl font-semibold text-slate-900 mb-3">
						Sustainability Points
					</h3>
					<p class="text-slate-600">
						Earn rewards for helping others. Get recognized for building a
						sustainable community.
					</p>
				</Card>
			</div>

			<!-- Trust Indicators -->
			<div
				class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50"
			>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
					<div class="space-y-2">
						<div class="text-3xl font-bold text-blue-600">1,200+</div>
						<p class="text-slate-600">Items shared this semester</p>
					</div>
					<div class="space-y-2">
						<div class="text-3xl font-bold text-green-600">92%</div>
						<p class="text-slate-600">On-time returns</p>
					</div>
					<div class="space-y-2">
						<div class="text-3xl font-bold text-purple-600">4.8★</div>
						<p class="text-slate-600">Average trust score</p>
					</div>
				</div>
			</div>

			<!-- CTA Section -->
			<div class="text-center mt-12">
				<h3 class="text-2xl font-bold text-slate-900 mb-4">
					Ready to join the community?
				</h3>
				<p class="text-slate-600 mb-6">
					Start sharing, saving, and connecting today.
				</p>
				<Button
					class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mr-4"
				>
					Join Now
				</Button>
				<Button
					class="border border-slate-300 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
				>
					Learn More
				</Button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Shield, Users, Award } from "lucide-vue-next";
</script>
