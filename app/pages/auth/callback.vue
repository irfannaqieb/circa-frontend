<template>
	<div class="flex min-h-[50vh] items-center justify-center">
		<div class="text-center space-y-2">
			<p class="text-sm text-muted-foreground">Completing sign-in…</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useSessionStore } from "@/stores/session.store";

const session = useSessionStore();

onMounted(async () => {
	await session.refresh();
	const route = useRoute();
	const redirect = (route.query.redirect as string) || "/";
	await navigateTo(redirect);
});
</script>
