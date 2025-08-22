<template>
	<div class="h-full flex bg-white">
		<!-- Sidebar -->
		<div class="w-96 border-r border-gray-200 flex flex-col">
			<!-- Header -->
			<div class="p-4 border-b border-gray-200">
				<div class="relative">
					<input
						type="text"
						placeholder="Search"
						class="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						v-model="searchQuery"
					/>
					<div
						class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
					>
						<svg
							class="h-5 w-5 text-gray-400"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Conversations List -->
			<div class="flex-1 overflow-y-auto">
				<!-- Loading State -->
				<div v-if="conversationsLoading" class="p-4">
					<div class="flex items-center justify-center">
						<div
							class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
						></div>
					</div>
				</div>

				<!-- Error State -->
				<div v-else-if="conversationsError" class="p-4">
					<div class="text-red-500 text-center">
						<p>Error loading conversations</p>
						<button
							@click="loadConversations()"
							class="mt-2 text-blue-500 hover:text-blue-700 underline"
						>
							Try Again
						</button>
					</div>
				</div>

				<!-- Empty State -->
				<div
					v-else-if="filteredEntries.length === 0"
					class="p-4 text-center text-gray-500"
				>
					<div class="flex flex-col items-center justify-center h-32">
						<svg
							class="w-12 h-12 text-gray-300 mb-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.011-.235l-3.989 1.994c-.441.221-.847-.054-.847-.543V15.81A8.002 8.002 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z"
							/>
						</svg>
						<p>No conversations yet</p>
						<p class="text-sm mt-1">Start a conversation from an item page</p>
					</div>
				</div>

				<!-- Conversations -->
				<div v-else>
					<div
						v-for="entry in filteredEntries"
						:key="entry.conversation_id"
						@click="navigateToConversation(entry.conversation_id)"
						:class="[
							'p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors',
							entry.conversation_id === conversationId
								? 'bg-blue-50 border-l-4 border-blue-500'
								: '',
						]"
					>
						<div class="flex items-start space-x-4">
							<!-- Avatar -->
							<div class="flex-shrink-0">
								<img
									v-if="entry.peer_avatar"
									:src="entry.peer_avatar"
									:alt="entry.peer_name || 'User'"
									class="h-10 w-10 rounded-full object-cover"
								/>
								<div
									v-else
									class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
								>
									<span class="text-gray-600 font-medium text-sm">
										{{ getInitials(entry.peer_name) }}
									</span>
								</div>
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center justify-between">
									<p class="text-sm font-semibold text-gray-800 truncate">
										{{ entry.peer_name || "Unknown User" }}
									</p>
									<div class="flex items-center space-x-2">
										<!-- Unread Badge -->
										<span
											v-if="entry.unread_count > 0"
											class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full"
										>
											{{ entry.unread_count }}
										</span>
										<!-- Time -->
										<p class="text-xs text-gray-500">
											{{ formatTime(entry.last_message_created_at) }}
										</p>
									</div>
								</div>

								<!-- Last Message Preview -->
								<p class="text-sm text-gray-500 truncate mt-1">
									{{ formatLastMessage(entry) }}
								</p>
							</div>
						</div>
					</div>

					<!-- Load More Button -->
					<div v-if="entries.length >= 30" class="p-4">
						<button
							@click="loadMoreConversations()"
							:disabled="conversationsLoading"
							class="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
						>
							{{ conversationsLoading ? "Loading..." : "Load More" }}
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Chat Area -->
		<div class="flex-1 flex flex-col">
			<ChatWindow
				v-if="conversationId && itemId && !loading"
				:conversation-id="conversationId"
				:item-id="itemId"
				:peer="currentConversation"
				:key="conversationId"
			/>
			<div v-else-if="loading" class="flex-1 flex items-center justify-center">
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"
					></div>
					<p class="mt-2 text-gray-500">Loading chat...</p>
				</div>
			</div>
			<div v-else class="flex-1 flex items-center justify-center bg-gray-50">
				<div class="text-center">
					<svg
						class="mx-auto h-24 w-24 text-gray-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.011-.235l-3.989 1.994c-.441.221-.847-.054-.847-.543V15.81A8.002 8.002 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z"
						/>
					</svg>
					<h3 class="mt-4 text-lg font-medium text-gray-900">
						Unable to load chat
					</h3>
					<p class="mt-2 text-sm text-gray-500">Please try again later</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import ChatWindow from "~/components/chat/ChatWindow.vue";
import { getConversation } from "~/services/conversations.service";
import {
	useConversationsList,
	type SidebarEntry,
} from "~/composables/useConversationsList";
import { toast } from "vue-sonner";

// Meta
definePageMeta({
	requiresAuth: true,
});

const route = useRoute();
const router = useRouter();
const conversationId = computed(() => route.params.id as string);

// Conversations list for sidebar
const searchQuery = ref("");
const {
	entries,
	loading: conversationsLoading,
	error: conversationsError,
	load: loadConversations,
	subscribeRealtime,
} = useConversationsList();

// Current conversation data
const itemId = ref<string | null>(null);
const loading = ref(true);

// Computed
const currentConversation = computed(() => {
	return entries.value.find((e) => e.conversation_id === conversationId.value);
});

const filteredEntries = computed(() => {
	if (!searchQuery.value) return entries.value;

	const query = searchQuery.value.toLowerCase();
	return entries.value.filter(
		(entry) =>
			entry.peer_name?.toLowerCase().includes(query) ||
			entry.last_message_body?.toLowerCase().includes(query)
	);
});

// Methods
const navigateToConversation = (newConversationId: string) => {
	if (newConversationId !== conversationId.value) {
		navigateTo(`/marketplace/chat/${newConversationId}`);
	}
};

const formatLastMessage = (entry: SidebarEntry): string => {
	if (entry.last_message_kind === "offer") return "💰 Offer";
	if (!entry.last_message_body) return "No messages yet";

	if (entry.last_message_kind === "system") {
		if (entry.last_message_body.startsWith("[OFFER_ACCEPTED]")) {
			return "✅ Offer Accepted";
		}
		if (entry.last_message_body.startsWith("[OFFER_DECLINED]")) {
			return "❌ Offer Declined";
		}
		if (entry.last_message_body === "[ITEM_MARKED_SOLD]") {
			return "📦 Item Sold";
		}
	}

	return entry.last_message_body;
};

const getInitials = (name: string | null) => {
	if (!name) return "?";
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.slice(0, 2)
		.toUpperCase();
};

const formatTime = (timestamp: string | null) => {
	if (!timestamp) return "";

	const date = new Date(timestamp);
	const now = new Date();
	const diffInHours =
		Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

	if (diffInHours < 24) {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	} else if (diffInHours < 24 * 7) {
		return date.toLocaleDateString([], { weekday: "short" });
	} else {
		return date.toLocaleDateString([], { month: "short", day: "numeric" });
	}
};

const loadMoreConversations = () => {
	loadConversations(30, entries.value.length);
};

const fetchConversationData = async () => {
	loading.value = true;

	try {
		// First try to get itemId from query params
		const queryItemId = route.query.itemId as string;

		if (queryItemId) {
			itemId.value = queryItemId;
			loading.value = false;
			return;
		}

		// If not in query params, fetch from conversation
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
};

// Watch for route changes
watch(
	() => conversationId.value,
	async (newId) => {
		if (newId) {
			await fetchConversationData();
		}
	},
	{ immediate: true }
);

// Lifecycle
onMounted(async () => {
	await loadConversations();
	subscribeRealtime();
});
</script>
