<template>
	<div class="flex flex-col h-full w-full">
		<!-- Header -->
		<div class="p-4 border-b flex items-center gap-4">
			<template v-if="peer">
				<Avatar>
					<AvatarImage :src="peer.peer_avatar ?? ''" :alt="peer.peer_name" />
					<AvatarFallback>
						{{
							peer.peer_name
								?.split(" ")
								.map((n) => n[0])
								.join("")
						}}
					</AvatarFallback>
				</Avatar>
				<h2 class="text-xl font-bold">{{ peer.peer_name }}</h2>
			</template>
			<template v-else>
				<h2 class="text-xl font-bold">Chat</h2>
			</template>
			<!-- Placeholder for item/user info -->
		</div>

		<!-- Message List -->
		<div ref="chatContainer" class="flex-1 p-4 overflow-y-auto space-y-4">
			<div
				v-for="message in messages"
				:key="message.id"
				class="flex"
				:class="[
					message.sender_id === user?.id ? 'justify-end' : 'justify-start',
				]"
			>
				<div class="flex items-start gap-3 max-w-md">
					<Avatar v-if="message.sender_id !== user?.id" class="w-8 h-8">
						<!-- <AvatarImage src="/placeholder-avatar.jpg" /> -->
						<AvatarFallback> O </AvatarFallback>
					</Avatar>
					<div
						:class="[
							'rounded-lg p-3',
							message.sender_id === user?.id
								? 'bg-blue-500 text-white'
								: 'bg-gray-200 dark:bg-gray-800',
						]"
					>
						<!-- Text Message -->
						<p v-if="message.kind === 'text'" class="text-sm">
							{{ message.body }}
						</p>

						<!-- Offer Card -->
						<Card
							v-if="message.kind === 'offer' && message.offers"
							class="w-full text-black"
						>
							<CardHeader>
								<CardTitle class="flex items-center justify-between">
									<span>Offer</span>
									<Badge
										:variant="
											message.offers.status === 'pending'
												? 'secondary'
												: message.offers.status === 'accepted'
												? 'default'
												: 'destructive'
										"
									>
										{{ message.offers.status }}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p class="text-2xl font-bold">
									{{ (message.offers.price_cents / 1).toLocaleString() }}
									{{ message.offers.currency }}
								</p>
							</CardContent>
							<CardFooter
								v-if="
									message.offers.status === 'pending' &&
									message.offers.maker_id !== user?.id
								"
								class="flex gap-2"
							>
								<Button
									size="sm"
									@click="handleRespondToOffer(message.offers!.id, 'accepted')"
								>
									Accept
								</Button>
								<Button
									size="sm"
									variant="destructive"
									@click="handleRespondToOffer(message.offers!.id, 'declined')"
								>
									Decline
								</Button>
							</CardFooter>
						</Card>
						<p class="text-xs opacity-70 mt-1 text-right">
							{{ new Date(message.created_at).toLocaleTimeString() }}
						</p>
					</div>
					<Avatar v-if="message.sender_id === user?.id" class="w-8 h-8">
						<!-- <AvatarImage src="/my-avatar.jpg" /> -->
						<AvatarFallback> Me </AvatarFallback>
					</Avatar>
				</div>
			</div>
		</div>

		<!-- Composer -->
		<div class="p-4 border-t bg-white dark:bg-gray-950">
			<div v-if="user" class="space-y-4">
				<!-- Text Input -->
				<div class="flex gap-2">
					<Input
						v-model="newMessage"
						placeholder="Type a message..."
						:disabled="sending"
						@keyup.enter="handleSendText"
					/>
					<Button
						@click="handleSendText"
						:disabled="sending || !newMessage.trim()"
					>
						{{ sending ? "Sending..." : "Send" }}
					</Button>
				</div>
				<!-- Offer Input -->
				<div class="flex items-center gap-2">
					<Input
						v-model="offerPriceModel"
						type="number"
						placeholder="Make an offer (KRW)"
						class="w-1/2"
						:disabled="sending"
					/>
					<Button
						@click="handleMakeOffer"
						:disabled="sending || !newOfferPrice"
					>
						{{ sending ? "Making..." : "Make Offer" }}
					</Button>
				</div>
			</div>
			<div v-else>
				<p class="text-center text-gray-500">
					Please <NuxtLink to="/login" class="underline"> log in </NuxtLink> to
					chat.
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from "vue";
import { useChat, type MessageRow, type OfferRow } from "~/composables/useChat";
import { useSessionStore } from "~/stores/session.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "vue-sonner";
import type { ConversationEntry } from "~/composables/useConversationsList";

const props = defineProps<{
	conversationId: string;
	itemId: string;
	peer?: ConversationEntry;
}>();

const {
	messages,
	sending,
	fetchInitial,
	sendText,
	makeOffer,
	respondToOffer,
	markRead,
	loadMore,
	subscribeRealtime,
	unsubscribe,
} = useChat(props.conversationId, props.itemId);
const sessionStore = useSessionStore();
const user = computed(() => sessionStore.session?.user);

const newMessage = ref("");
const newOfferPrice = ref<number | null>(null);
const chatContainer = ref<HTMLElement | null>(null);

const offerPriceModel = computed({
	get: () => newOfferPrice.value?.toString() ?? "",
	set: (val: string | number) => {
		if (val === "" || val === null || val === undefined) {
			newOfferPrice.value = null;
		} else {
			newOfferPrice.value = Number(val);
		}
	},
});

const scrollToBottom = () => {
	nextTick(() => {
		if (chatContainer.value) {
			chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
		}
	});
};

onMounted(async () => {
	await fetchInitial();
	await markRead();
	subscribeRealtime();
	scrollToBottom();

	// Check if we should auto-focus the offer input
	const route = useRoute();
	if (route.query.openOffer === "true") {
		// Small delay to ensure the component is fully rendered
		setTimeout(() => {
			const offerInput = document.querySelector(
				'input[type="number"][placeholder*="offer"]'
			) as HTMLInputElement;
			if (offerInput) {
				offerInput.focus();
			}
		}, 100);
	}
});

onUnmounted(() => {
	unsubscribe();
});

watch(
	messages,
	() => {
		scrollToBottom();
	},
	{ deep: true }
);

const handleSendText = async () => {
	if (newMessage.value.trim() && user.value && !sending.value) {
		try {
			await sendText(newMessage.value.trim());
			newMessage.value = "";
		} catch (error) {
			console.error("Failed to send message:", error);
			toast.error("Failed to send message");
		}
	}
};

const handleMakeOffer = async () => {
	if (
		newOfferPrice.value &&
		newOfferPrice.value > 0 &&
		user.value &&
		!sending.value
	) {
		try {
			await makeOffer(newOfferPrice.value);
			newOfferPrice.value = null;
		} catch (error) {
			console.error("Failed to make offer:", error);
			toast.error("Failed to make offer");
		}
	}
};

const handleRespondToOffer = async (
	offerId: string,
	status: "accepted" | "declined"
) => {
	try {
		await respondToOffer(offerId, status);
		toast.success(`Offer ${status}`);
	} catch (error) {
		console.error("Failed to respond to offer:", error);
		toast.error("Failed to respond to offer");
	}
};
</script>
