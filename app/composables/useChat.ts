import { ref, onUnmounted, computed } from "vue";
import { useSessionStore } from "~/stores/session.store";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type MessageKind = "text" | "offer";

export type MessageRow = {
	id: string;
	conversation_id: string;
	sender_id: string;
	kind: MessageKind;
	body: string | null;
	offer_id: string | null;
	created_at: string;
	offers?: OfferRow | null;
};

export type OfferRow = {
	id: string;
	conversation_id: string;
	item_id: string;
	maker_id: string;
	price_cents: number;
	currency: string; // 'KRW'
	status: "pending" | "accepted" | "declined" | "expired";
	expires_at: string | null;
	created_at: string;
};

export function useChat(conversationId: string, itemId: string) {
	const { $supabase: supabase } = useNuxtApp();
	const sessionStore = useSessionStore();
	const user = computed(() => sessionStore.session?.user);

	const messages = ref<MessageRow[]>([]);
	const sending = ref(false);

	const fetchInitial = async (limit = 50) => {
		const { data, error } = await supabase
			.from("messages")
			.select("*, offers:offers!messages_offer_id_fkey(*)")
			.eq("conversation_id", conversationId)
			.order("created_at", { ascending: true })
			.limit(limit);

		if (error) {
			console.error("Error fetching messages:", error);
			return;
		}
		messages.value = data as MessageRow[];
	};

	// Alias for backward compatibility
	const fetchMessages = fetchInitial;

	const sendText = async (body: string) => {
		if (!user.value || sending.value) {
			return;
		}

		sending.value = true;

		const tempId = `temp-${Date.now()}`;
		const optimisticMessage: MessageRow = {
			id: tempId,
			conversation_id: conversationId,
			sender_id: user.value.id,
			kind: "text",
			body,
			offer_id: null,
			created_at: new Date().toISOString(),
		};

		messages.value.push(optimisticMessage);

		try {
			const { data, error } = await supabase
				.from("messages")
				.insert({
					conversation_id: conversationId,
					sender_id: user.value.id,
					kind: "text",
					body,
				})
				.select("*")
				.single();

			if (error) throw error;

			const index = messages.value.findIndex((m) => m.id === tempId);
			if (index !== -1) {
				messages.value[index] = data as MessageRow;
			}
		} catch (error) {
			messages.value = messages.value.filter((m) => m.id !== tempId);
			throw error;
		} finally {
			sending.value = false;
		}
	};

	const sendInquiry = async () => {
		if (!user.value || sending.value) {
			return;
		}
		sending.value = true;
		try {
			const { data, error } = await supabase
				.from("messages")
				.insert({
					conversation_id: conversationId,
					sender_id: user.value.id,
					kind: "item_inquiry",
				})
				.select("*")
				.single();

			if (error) throw error;
			// The realtime subscription will add the message to the array
		} catch (error) {
			console.error("Error sending inquiry:", error);
			throw error; // Re-throw to be caught in the component
		} finally {
			sending.value = false;
		}
	};

	const sendInquiryWithText = async (itemTitle: string) => {
		if (!user.value || sending.value) {
			return;
		}
		sending.value = true;

		// --- Optimistic Updates ---
		const tempCardId = `temp-card-${Date.now()}`;
		const tempTextId = `temp-text-${Date.now()}`;
		const now = new Date().toISOString();

		const optimisticCardMessage: MessageRow = {
			id: tempCardId,
			conversation_id: conversationId,
			sender_id: user.value.id,
			kind: "text",
			body: "[ITEM_CARD_INQUIRY]",
			offer_id: null,
			created_at: now,
		};

		const inquiryText = `I'd like to enquire about ${itemTitle}`;
		const optimisticTextMessage: MessageRow = {
			id: tempTextId,
			conversation_id: conversationId,
			sender_id: user.value.id,
			kind: "text",
			body: inquiryText,
			offer_id: null,
			created_at: new Date(new Date(now).getTime() + 1).toISOString(), // Slightly later
		};

		messages.value.push(optimisticCardMessage, optimisticTextMessage);
		// --- End Optimistic Updates ---

		try {
			const { data: cardData, error: cardError } = await supabase
				.from("messages")
				.insert({
					conversation_id: conversationId,
					sender_id: user.value.id,
					kind: "text",
					body: "[ITEM_CARD_INQUIRY]",
				})
				.select("*")
				.single();

			if (cardError) throw cardError;

			const { data: textData, error: textError } = await supabase
				.from("messages")
				.insert({
					conversation_id: conversationId,
					sender_id: user.value.id,
					kind: "text",
					body: inquiryText,
				})
				.select("*")
				.single();

			if (textError) throw textError;

			// Reconcile
			const cardIndex = messages.value.findIndex((m) => m.id === tempCardId);
			if (cardIndex !== -1) {
				messages.value[cardIndex] = cardData as MessageRow;
			}

			const textIndex = messages.value.findIndex((m) => m.id === tempTextId);
			if (textIndex !== -1) {
				messages.value[textIndex] = textData as MessageRow;
			}
		} catch (error) {
			// Rollback
			messages.value = messages.value.filter(
				(m) => m.id !== tempCardId && m.id !== tempTextId
			);
			throw error;
		} finally {
			sending.value = false;
		}
	};

	const makeOffer = async (priceKRW: number, expiresAt?: string) => {
		if (!user.value || sending.value) {
			console.error(
				"❌ Cannot make offer: User not authenticated or already sending"
			);
			return;
		}

		sending.value = true;

		// --- Optimistic Update ---
		const tempOfferId = `temp-offer-${Date.now()}`;
		const tempMessageId = `temp-message-${Date.now()}`;
		const now = new Date().toISOString();

		const optimisticOffer: OfferRow = {
			id: tempOfferId,
			conversation_id: conversationId,
			item_id: itemId,
			maker_id: user.value.id,
			price_cents: Math.round(priceKRW),
			currency: "KRW",
			status: "pending",
			expires_at: expiresAt || null,
			created_at: now,
		};

		const optimisticMessage: MessageRow = {
			id: tempMessageId,
			conversation_id: conversationId,
			sender_id: user.value.id,
			kind: "offer",
			body: null,
			offer_id: tempOfferId,
			created_at: now,
			offers: optimisticOffer,
		};

		messages.value.push(optimisticMessage);
		// --- End Optimistic Update ---

		try {
			// Step 1: Create the actual offer
			const { data: offer, error: offerError } = await supabase
				.from("offers")
				.insert({
					conversation_id: conversationId,
					item_id: itemId,
					maker_id: user.value.id,
					price_cents: Math.round(priceKRW),
					expires_at: expiresAt ?? null,
				})
				.select("*")
				.single();

			if (offerError) throw offerError;

			// Step 2: Create the message linking to the offer
			const { data: message, error: messageError } = await supabase
				.from("messages")
				.insert({
					conversation_id: conversationId,
					sender_id: user.value.id,
					kind: "offer",
					offer_id: offer.id,
				})
				.select("*")
				.single();

			if (messageError) throw messageError;

			// Step 3: Reconcile
			const index = messages.value.findIndex((m) => m.id === tempMessageId);
			if (index !== -1) {
				messages.value[index] = { ...message, offers: offer } as MessageRow;
			}
		} catch (error) {
			console.error(
				"Error sending offer, rolling back optimistic update:",
				error
			);
			// Rollback
			messages.value = messages.value.filter((m) => m.id !== tempMessageId);
		} finally {
			sending.value = false;
		}
	};

	const respondToOffer = async (
		offerId: string,
		status: "accepted" | "declined"
	) => {
		const { error } = await supabase.rpc("respond_to_offer", {
			p_offer_id: offerId,
			p_new_status: status,
		});

		if (error) {
			console.error("Error responding to offer:", error);
			throw error;
		}
	};

	const markRead = async () => {
		const { error } = await supabase.rpc("mark_conversation_read", {
			p_conv: conversationId,
		});

		if (error) {
			console.error("Error marking conversation as read:", error);
		}
	};

	const loadMore = async (beforeISO: string) => {
		const { data, error } = await supabase
			.from("messages")
			.select("*, offers:offers!messages_offer_id_fkey(*)")
			.eq("conversation_id", conversationId)
			.lt("created_at", beforeISO)
			.order("created_at", { ascending: false })
			.limit(50);

		if (error) {
			console.error("Error loading more messages:", error);
			return;
		}

		// Prepend older messages (reverse to maintain chronological order)
		messages.value = [...data.reverse(), ...messages.value];
	};

	const channel = supabase.channel(`chat:${conversationId}`);

	const subscribeRealtime = () => {
		channel
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${conversationId}`,
				},
				async (payload: RealtimePostgresChangesPayload<MessageRow>) => {
					const newMessage = payload.new as MessageRow;

					// De-dupe optimistic entries
					if (messages.value.some((x) => x.id === newMessage.id)) return;

					if (newMessage.kind === "offer" && newMessage.offer_id) {
						const { data: offer } = await supabase
							.from("offers")
							.select("*")
							.eq("id", newMessage.offer_id)
							.single();
						messages.value.push({ ...newMessage, offers: offer ?? undefined });
					} else {
						messages.value.push(newMessage);
					}
				}
			)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "offers",
					filter: `conversation_id=eq.${conversationId}`,
				},
				(payload: RealtimePostgresChangesPayload<OfferRow>) => {
					const updatedOffer = payload.new as OfferRow;
					if (!updatedOffer?.id) {
						return;
					}
					messages.value = messages.value.map((m) => {
						if (m.offer_id === updatedOffer.id) {
							return { ...m, offers: updatedOffer };
						}
						return m;
					});
				}
			)
			.subscribe();
	};

	const unsubscribe = () => {
		supabase.removeChannel(channel);
	};

	onUnmounted(() => {
		unsubscribe();
	});

	return {
		messages,
		sending,
		fetchInitial,
		fetchMessages, // Alias for backward compatibility
		sendText,
		sendInquiry,
		sendInquiryWithText,
		makeOffer,
		respondToOffer,
		markRead,
		loadMore,
		subscribeRealtime,
		unsubscribe,
	};
}
