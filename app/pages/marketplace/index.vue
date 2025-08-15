<template>
	<div>
		<h1>Marketplace Home</h1>
		<div class="p-4 flex space-x-4">
			<MarketplaceItemCard status="Available" />
			<MarketplaceItemCard status="Reserved" />
			<MarketplaceItemCard status="Sold" />
			<MarketplaceItemCard status="Available" />
			<MarketplaceItemCard status="Reserved" />
			<MarketplaceItemCard status="Sold" />
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
