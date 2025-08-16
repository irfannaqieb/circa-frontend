<template>
	<div class="flex">
		<MarketplaceSidebar />
		<main class="flex-1 p-4">
			<slot />
		</main>
	</div>
</template>
<script setup lang="ts">
import MarketplaceSidebar from "~/components/Marketplace/Sidebar.vue";
</script>
