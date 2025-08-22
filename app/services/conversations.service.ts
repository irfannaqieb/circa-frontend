export interface Conversation {
	id: string;
	item_id: string;
	user_a_id: string;
	user_b_id: string;
	created_at: string;
}

/**
 * Get or create a conversation between current user and another user for a specific item
 * @param itemId - The item ID to chat about
 * @param otherUserId - The other user ID (seller if buyer is chatting, buyer if seller is chatting)
 * @returns Promise with conversation ID
 */
export async function getOrCreateConversation(
	itemId: string,
	otherUserId: string
): Promise<{ data: string | null; error: any }> {
	const { $supabase } = useNuxtApp();

	try {
		const { data, error } = await $supabase.rpc("get_or_create_conversation", {
			p_item: itemId,
			p_other_user: otherUserId,
		});

		if (error) {
			console.error("Error creating conversation:", error);
			return { data: null, error };
		}

		return { data, error: null };
	} catch (err) {
		console.error("Unexpected error creating conversation:", err);
		return { data: null, error: err };
	}
}

/**
 * Get conversation details by ID
 * @param conversationId - The conversation ID
 * @returns Promise with conversation data
 */
export async function getConversation(
	conversationId: string
): Promise<{ data: Conversation | null; error: any }> {
	const { $supabase } = useNuxtApp();

	try {
		const { data, error } = await $supabase
			.from("conversations")
			.select("*")
			.eq("id", conversationId)
			.single();

		if (error) {
			console.error("Error fetching conversation:", error);
			return { data: null, error };
		}

		return { data, error: null };
	} catch (err) {
		console.error("Unexpected error fetching conversation:", err);
		return { data: null, error: err };
	}
}
