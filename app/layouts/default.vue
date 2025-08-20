<template>
	<div class="min-h-dvh flex flex-col">
		<Navbar />
		<main class="flex-1">
			<NuxtPage />
		</main>
		<Footer />
                <Toaster position="bottom-right" />
	</div>
</template>

<script setup>
import { Toaster } from "vue-sonner";
</script>
