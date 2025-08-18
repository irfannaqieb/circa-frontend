<template>
	<footer class="px-4 py-8">
		<div class="max-w-7xl mx-auto">
			<div class="flex flex-col items-center space-y-4">
				<!-- Links -->
				<div class="flex flex-wrap justify-center space-x-6 text-sm">
					<a
						href="#"
						class="text-muted-foreground hover:text-foreground font-medium transition-colors"
						>About</a
					>
					<span class="text-muted-foreground">•</span>
					<a
						href="#"
						class="text-muted-foreground hover:text-foreground font-medium transition-colors"
						>FAQ</a
					>
					<span class="text-muted-foreground">•</span>
					<a
						href="#"
						class="text-muted-foreground hover:text-foreground font-medium transition-colors"
						>Campus Rules</a
					>
					<span class="text-muted-foreground">•</span>
					<a
						href="#"
						class="text-muted-foreground hover:text-foreground font-medium transition-colors"
						>Contact</a
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
