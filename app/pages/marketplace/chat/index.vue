<template>
	<div class="h-screen flex bg-white">
		<!-- Sidebar -->
		<div class="w-1/3 border-r border-gray-200 flex flex-col">
			<!-- Header -->
			<div class="p-4 border-b border-gray-200">
				<h1 class="text-xl font-semibold text-gray-900">Messages</h1>
				<!-- Optional: Search bar -->
				<div class="mt-3">
					<input
						type="text"
						placeholder="Search conversations..."
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						v-model="searchQuery"
					/>
				</div>
			</div>

			<!-- Conversations List -->
			<div class="flex-1 overflow-y-auto">
				<!-- Loading State -->
				<div v-if="loading" class="p-4">
					<div class="flex items-center justify-center">
						<div
							class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
						></div>
					</div>
				</div>

				<!-- Error State -->
				<div v-else-if="error" class="p-4">
					<div class="text-red-500 text-center">
						<p>Error loading conversations</p>
						<button
							@click="load()"
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
						class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
					>
						<div class="flex items-start space-x-3">
							<!-- Avatar -->
							<div class="flex-shrink-0">
								<img
									v-if="entry.peer_avatar"
									:src="entry.peer_avatar"
									:alt="entry.peer_name || 'User'"
									class="h-12 w-12 rounded-full object-cover"
								/>
								<div
									v-else
									class="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center"
								>
									<span class="text-gray-600 font-medium text-lg">
										{{ getInitials(entry.peer_name) }}
									</span>
								</div>
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center justify-between">
									<p class="text-sm font-medium text-gray-900 truncate">
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
							@click="loadMore()"
							:disabled="loading"
							class="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
						>
							{{ loading ? "Loading..." : "Load More" }}
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content Area -->
		<div class="flex-1 flex items-center justify-center bg-gray-50">
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
					No conversation selected
				</h3>
				<p class="mt-2 text-sm text-gray-500">
					Choose a conversation from the sidebar to start messaging
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
	useConversationsList,
	type SidebarEntry,
} from "~/composables/useConversationsList";

// Meta
definePageMeta({
	requiresAuth: true,
});

// State
const searchQuery = ref("");
const { entries, loading, error, load, subscribeRealtime } =
	useConversationsList();

// Computed
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
const navigateToConversation = (conversationId: string) => {
	navigateTo(`/marketplace/chat/${conversationId}`);
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

const loadMore = () => {
	load(30, entries.value.length);
};

// Lifecycle
onMounted(async () => {
	await load();
	subscribeRealtime();
});
</script>
