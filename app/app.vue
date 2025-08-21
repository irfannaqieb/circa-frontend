<template>
	<NuxtLayout>
		<NuxtPage />
		<Toaster
			class="pointer-events-auto"
			position="bottom-right"
			:expand="false"
		/>
	</NuxtLayout>
</template>

<script setup>
import { Toaster } from "~/components/ui/sonner";
import { useSessionStore } from "~/stores/session.store";

const sessionStore = useSessionStore();
sessionStore.initialize();
</script>
