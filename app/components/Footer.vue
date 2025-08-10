<template>
	<footer class="px-4 py-8">
		<div class="max-w-7xl mx-auto">
			<div class="flex flex-col items-center space-y-4">
				<!-- Links -->
				<div class="flex flex-wrap justify-center space-x-6 text-sm">
					<a
						href="#"
						class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
						>About</a
					>
					<span class="text-slate-400">•</span>
					<a
						href="#"
						class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
						>FAQ</a
					>
					<span class="text-slate-400">•</span>
					<a
						href="#"
						class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
						>Campus Rules</a
					>
					<span class="text-slate-400">•</span>
					<a
						href="#"
						class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
						>Contact</a
					>
				</div>

				<!-- Social Icons -->
				<div class="flex items-center space-x-4">
					<a
						href="#"
						class="text-gray-700 hover:text-gray-900 transition-colors"
						aria-label="Instagram"
					>
						<Instagram class="w-5 h-5" />
					</a>
					<a
						href="#"
						class="text-gray-700 hover:text-gray-900 transition-colors"
						aria-label="TikTok"
					>
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"
							/>
						</svg>
					</a>
				</div>
			</div>

			<!-- Badge -->
			<div class="mt-6 pt-4 border-t border-slate-200 text-center">
				<div class="inline-flex items-center space-x-2 text-xs text-slate-600">
					<span>Powered by</span>
					<Badge variant="secondary" class="text-slate-700">
						Supabase + Nuxt
					</Badge>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { Badge } from "@/components/ui/badge";
import { Instagram } from "lucide-vue-next";
</script>
