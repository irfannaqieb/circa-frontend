<template>
	<div class="flex">
		<MarketplaceSidebar />
		<main class="flex-1 px-14 pt-28">
			<div>
				<slot />
			</div>
		</main>
	</div>
</template>
<script setup lang="ts"></script>
