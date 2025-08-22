<template>
	<div class="p-4">
		<ChatWindow
			v-if="conversationId && itemId && !loading"
			:conversation-id="conversationId"
			:item-id="itemId"
		/>
		<div v-else-if="loading" class="text-center py-8">
			<div
				class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"
			></div>
			<p class="mt-2 text-muted-foreground">Loading chat...</p>
		</div>
		<div v-else class="text-center py-8">
			<p class="text-muted-foreground">
				Unable to load chat. Please try again.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import ChatWindow from "~/components/chat/ChatWindow.vue";
import { getConversation } from "~/services/conversations.service";
import { toast } from "vue-sonner";

const route = useRoute();
const conversationId = computed(() => route.params.id as string);

// Get itemId from query params or fetch from conversation
const itemId = ref<string | null>(null);
const loading = ref(true);

onMounted(async () => {
	// First try to get itemId from query params
	const queryItemId = route.query.itemId as string;

	if (queryItemId) {
		itemId.value = queryItemId;
		loading.value = false;
		return;
	}

	// If not in query params, fetch from conversation
	try {
		const { data: conversation, error } = await getConversation(
			conversationId.value
		);

		if (error || !conversation) {
			console.error("Error fetching conversation:", error);
			toast.error("Failed to load conversation details.");
			return;
		}

		itemId.value = conversation.item_id;
	} catch (err) {
		console.error("Unexpected error fetching conversation:", err);
		toast.error("An unexpected error occurred.");
	} finally {
		loading.value = false;
	}
});
</script>
