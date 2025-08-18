<template>
	<div
		class="py-16 md:py-24 bg-gradient-to-br from-muted to-secondary my-4 rounded-4xl"
	>
		<div class="max-w-4xl mx-auto px-6 text-center">
			<!-- Headline -->
			<h2 class="text-3xl md:text-5xl font-bold text-foreground mb-6">
				Circa Has Everything You Need. Just Ask.
			</h2>

			<!-- CTA Button -->
			<div class="mb-6">
				<Button
					size="lg"
					class="px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
				>
					Sign Up Free
				</Button>
			</div>

			<!-- Subtext -->
			<p class="text-muted-foreground text-lg">
				Takes less than 30 seconds with your student email.
			</p>
		</div>
	</div>
</template>

<script setup>
import { Button } from "@/components/ui/button";
</script>
