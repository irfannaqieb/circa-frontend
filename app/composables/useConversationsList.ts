import { ref, onUnmounted } from "vue";
import { useSessionStore } from "~/stores/session.store";
import type {
	RealtimePostgresChangesPayload,
	RealtimeChannel,
} from "@supabase/supabase-js";

type MessageKind = "text" | "offer";

export type SidebarEntry = {
	conversation_id: string;
	item_id: string;
	peer_id: string;
	peer_name: string | null;
	peer_avatar: string | null;
	last_message_body: string | null;
	last_message_kind: MessageKind | null;
	last_message_created_at: string | null;
	unread_count: number;
};

export function useConversationsList() {
	const { $supabase: supabase } = useNuxtApp();
	const sessionStore = useSessionStore();
	const user = sessionStore.session?.user;

	const entries = ref<SidebarEntry[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const load = async (p_limit = 30, p_offset = 0) => {
		loading.value = true;
		error.value = null;
		try {
			const { data, error: rpcError } = await supabase.rpc(
				"list_conversations_with_unread",
				{ p_limit, p_offset }
			);

			if (rpcError) throw rpcError;

			entries.value = data;
		} catch (e: any) {
			error.value = e.message;
			console.error("Error loading conversations:", e);
		} finally {
			loading.value = false;
		}
	};

	let channel: RealtimeChannel | null = null;

	const subscribeRealtime = () => {
		if (process.server) return; // Prevent running on server

		channel = supabase.channel("conversations-list");

		channel
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "conversations",
				},
				(payload: RealtimePostgresChangesPayload<any>) => {
					const newConversation = payload.new;
					if (
						newConversation.user_a_id === user?.id ||
						newConversation.user_b_id === user?.id
					) {
						// This is a simplified version. The RPC returns more data.
						// A full implementation might need another RPC call to get the sidebar entry shape.
						// Or, the INSERT can be augmented with the required data.
						// For now, we just add what we have.
						const isUserA = newConversation.user_a_id === user?.id;
						const peerId = isUserA
							? newConversation.user_b_id
							: newConversation.user_a_id;

						// A proper implementation would need to fetch peer_name and peer_avatar.
						// This is a placeholder.
						const placeholderEntry: SidebarEntry = {
							conversation_id: newConversation.id,
							item_id: newConversation.item_id,
							peer_id: peerId,
							peer_name: "New User", // Placeholder
							peer_avatar: null, // Placeholder
							last_message_body: "No messages yet",
							last_message_kind: "text",
							last_message_created_at: newConversation.created_at,
							unread_count: 0,
						};
						entries.value.unshift(placeholderEntry);
					}
				}
			)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
				},
				(payload: RealtimePostgresChangesPayload<any>) => {
					const newMessage = payload.new;
					const conversationId = newMessage.conversation_id;

					const entryIndex = entries.value.findIndex(
						(e) => e.conversation_id === conversationId
					);

					if (entryIndex !== -1) {
						const entry = entries.value[entryIndex];
						if (entry) {
							entry.last_message_body = newMessage.body;
							entry.last_message_kind = newMessage.kind;
							entry.last_message_created_at = newMessage.created_at;

							const route = useRoute();
							const isViewingThisChat =
								route.path === `/marketplace/chat/${conversationId}`;

							if (newMessage.sender_id !== user?.id && !isViewingThisChat) {
								entry.unread_count += 1;
							}

							// Move updated conversation to the top
							entries.value.splice(entryIndex, 1);
							entries.value.unshift(entry);
						}
					}
				}
			)
			.subscribe();
	};

	const unsubscribe = () => {
		if (channel) {
			supabase.removeChannel(channel);
			channel = null;
		}
	};

	onUnmounted(() => {
		unsubscribe();
	});

	return {
		entries,
		loading,
		error,
		load,
		subscribeRealtime,
		unsubscribe,
	};
}
