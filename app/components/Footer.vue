<template>
	<footer class="px-4 py-8">
		<div class="max-w-7xl mx-auto">
			<div class="flex flex-col items-center space-y-4">
				<!-- Links -->
				<div class="flex flex-wrap justify-center space-x-6 text-sm">
					<NuxtLink
						to="/about"
						class="text-muted-foreground hover:text-foreground font-medium transition-colors"
						>About</NuxtLink
					>
					<span class="text-muted-foreground">•</span>
					<NuxtLink
						to="/support"
						class="text-muted-foreground hover:text-foreground font-medium transition-colors"
						>Contact</NuxtLink
					>
				</div>
			</div>

			<!-- Badge -->
			<div class="mt-6 pt-4 border-t border-border text-center">
				<div
					class="inline-flex items-center space-x-2 text-xs text-muted-foreground"
				>
					<span>Made by team</span>
					<Badge variant="secondary" class="text-muted-foreground">
						git good :D</Badge
					>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { Badge } from "@/components/ui/badge";
</script>
