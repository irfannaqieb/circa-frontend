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
								.map((n: string) => n[0])
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
			<div v-for="message in messages" :key="message.id">
				<div
					v-if="message.kind === 'system'"
					class="text-center text-sm text-gray-500 my-2 italic"
				>
					{{ formatSystemMessage(message) }}
				</div>
				<div
					v-else
					:key="message.id"
					class="flex"
					:class="[
						message.sender_id === user?.id ? 'justify-end' : 'justify-start',
					]"
				>
					<div class="flex items-start gap-3 max-w-md">
						<Avatar v-if="message.sender_id !== user?.id" class="w-8 h-8">
							<AvatarImage
								v-if="peer?.peer_avatar"
								:src="peer.peer_avatar ?? ''"
								:alt="peer?.peer_name ?? 'User'"
							/>
							<AvatarFallback>
								{{ peer?.peer_name ? getInitials(peer.peer_name) : "" }}
							</AvatarFallback>
						</Avatar>
						<div class="flex-grow">
							<!-- Item Inquiry or Offer Card -->
							<div
								v-if="
									(message.body === '[ITEM_CARD_INQUIRY]' ||
										message.kind === 'offer') &&
									item
								"
								class="w-full max-w-xs mb-2"
							>
								<div
									class="rounded-lg overflow-hidden"
									:class="[
										message.sender_id === user?.id
											? 'bg-blue-500 text-white'
											: 'bg-gray-200 dark:bg-gray-800 text-black',
										message.kind === 'offer' ||
										message.body === '[ITEM_CARD_INQUIRY]'
											? 'border border-gray-300 dark:border-gray-600'
											: '',
									]"
								>
									<NuxtLink
										:to="`/marketplace/items/${item.id}`"
										class="block bg-white dark:bg-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-black dark:text-white"
									>
										<div class="flex gap-3">
											<img
												v-if="item.images && item.images.length > 0"
												:src="getImageUrl(item.images[0]!.path)"
												alt="item.title"
												class="w-16 h-16 object-cover rounded-md"
											/>
											<div
												v-else
												class="w-16 h-16 rounded-md bg-gray-100 dark:bg-gray-600 flex items-center justify-center"
											>
												<ImageIcon class="w-8 h-8 text-gray-400" />
											</div>
											<div class="flex-1">
												<p
													class="font-semibold text-gray-800 dark:text-gray-200"
												>
													{{ item.title }}
												</p>
												<p class="text-primary font-bold">
													{{
														formatPrice(item.base_price_minor, item.is_giveaway)
													}}
												</p>
											</div>
										</div>
									</NuxtLink>
								</div>
							</div>
							<!-- Standard Message Bubble -->
							<div
								v-if="
									(message.kind === 'text' &&
										message.body !== '[ITEM_CARD_INQUIRY]') ||
									message.kind === 'offer'
								"
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
														? 'success'
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
											@click="
												handleRespondToOffer(message.offers!.id, 'accepted')
											"
										>
											Accept
										</Button>
										<Button
											size="sm"
											variant="destructive"
											@click="
												handleRespondToOffer(message.offers!.id, 'declined')
											"
										>
											Decline
										</Button>
									</CardFooter>
								</Card>
							</div>
							<p
								v-if="message.body !== '[ITEM_CARD_INQUIRY]'"
								class="text-xs opacity-70 mt-1 text-right"
							>
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
		</div>

		<!-- Composer -->
		<div class="p-4 border-t bg-white dark:bg-gray-950">
			<div v-if="user" class="space-y-4">
				<div class="flex items-start gap-2">
					<Input
						v-model="newMessage"
						placeholder="Type a message..."
						:disabled="sending"
						class="flex-1"
						@keyup.enter="handleSendText"
					/>

					<Popover>
						<PopoverTrigger as-child>
							<Button variant="outline">
								Make an Offer
								<ChevronDownIcon class="h-4 w-4 ml-2" />
							</Button>
						</PopoverTrigger>
						<PopoverContent class="w-80">
							<div class="grid gap-4">
								<div class="space-y-2">
									<h4 class="font-medium leading-none">Make an Offer</h4>
									<p class="text-sm text-muted-foreground">
										Enter your offer amount.
									</p>
								</div>
								<div class="flex items-center gap-2">
									<Input
										v-model="offerPriceModel"
										type="text"
										inputmode="numeric"
										placeholder="Offer amount"
										:disabled="sending"
									/>
									<Button
										@click="handleMakeOffer"
										:disabled="sending || !newOfferPrice"
									>
										{{ sending ? "Making..." : "Submit Offer" }}
									</Button>
								</div>
							</div>
						</PopoverContent>
					</Popover>

					<Button
						@click="handleSendText"
						:disabled="sending || !newMessage.trim()"
					>
						{{ sending ? "Sending..." : "Send" }}
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "vue-sonner";
import type { SidebarEntry } from "~/composables/useConversationsList";
import {
	getItem,
	getItemImages,
	getImageUrl,
	type Item,
	type ItemImage,
} from "~/services/items.service";
import { ImageIcon, ChevronDownIcon } from "lucide-vue-next";

const props = defineProps<{
	conversationId: string;
	itemId: string;
	peer?: SidebarEntry;
}>();

const item = ref<(Item & { images?: ItemImage[] }) | null>(null);

const {
	messages,
	sending,
	fetchInitial,
	sendText,
	sendInquiry,
	sendInquiryWithText,
	makeOffer,
	respondToOffer,
	sendSystemMessage,
	markRead,
	loadMore,
	subscribeRealtime,
	unsubscribe,
} = useChat(props.conversationId, props.itemId);
const sessionStore = useSessionStore();
const user = computed(() => sessionStore.session?.user);
const router = useRouter();
const route = useRoute();

const newMessage = ref("");
const newOfferPrice = ref<number | null>(null);
const chatContainer = ref<HTMLElement | null>(null);

const offerPriceModel = computed({
	get: () => newOfferPrice.value?.toLocaleString() ?? "",
	set: (val: string) => {
		if (val === "" || val === null || val === undefined) {
			newOfferPrice.value = null;
		} else {
			const numericValue = Number(String(val).replace(/,/g, ""));
			if (!isNaN(numericValue)) {
				newOfferPrice.value = numericValue;
			}
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
	const [{ data: itemData }, { data: imageData }] = await Promise.all([
		getItem(props.itemId),
		getItemImages(props.itemId),
	]);

	if (itemData) {
		item.value = { ...itemData, images: imageData || [] };
	}

	await fetchInitial();

	// Check if we should send an inquiry (only if no existing inquiry in this session)
	const hasExistingInquiry = messages.value.some(
		(m) => m.body === "[ITEM_CARD_INQUIRY]"
	);

	if (route.query.inquire === "true" && !hasExistingInquiry) {
		try {
			if (item.value?.title) {
				await sendInquiryWithText(item.value.title);
			} else {
				await sendInquiry();
			}
		} catch (error) {
			toast.error("Failed to send item inquiry.");
		}
	}

	if (route.query.action === "makeOffer" && route.query.price) {
		const price = Number(route.query.price);
		if (!isNaN(price) && price > 0) {
			try {
				await makeOffer(price);
				toast.success("Your offer has been sent!");
			} catch (error) {
				toast.error("Failed to submit your offer.");
			}
		}
	}

	// Clean up query params to prevent re-triggering actions on refresh
	if (route.query.action || route.query.inquire) {
		const newQuery = { ...route.query };
		delete newQuery.action;
		delete newQuery.price;
		delete newQuery.inquire;
		router.replace({ query: newQuery });
	}

	await markRead();
	subscribeRealtime();
	scrollToBottom();

	// Check if we should auto-focus the offer input
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

function formatPrice(
	priceMinor: number | null | undefined,
	isGiveaway: boolean | null | undefined
): string {
	if (isGiveaway) return "Free";
	if (!priceMinor) return "Price not set";
	return `₩${priceMinor.toLocaleString()}`;
}

const formatSystemMessage = (message: MessageRow): string => {
	if (!message.body) return "";

	const formatOfferMessage = (status: "accepted" | "declined") => {
		const offerId = message.body!.split(":")[1];
		const offerMessage = messages.value.find((m) => m.offer_id === offerId);
		if (!offerMessage || !offerMessage.offers || !item.value)
			return `Offer ${status}.`;

		const offer = offerMessage.offers;
		const price = `₩${offer.price_cents.toLocaleString()}`;
		const itemName = item.value.title;

		const isSellerPerspective = message.sender_id === user.value?.id;

		if (status === "accepted") {
			return isSellerPerspective
				? `You have accepted the offer of ${price} for "${itemName}".`
				: `Seller has accepted your offer of ${price} for "${itemName}".`;
		} else {
			// declined
			return isSellerPerspective
				? `You have declined the offer of ${price} for "${itemName}".`
				: `Seller has declined your offer of ${price} for "${itemName}".`;
		}
	};

	if (message.body.startsWith("[OFFER_ACCEPTED]")) {
		return formatOfferMessage("accepted");
	}

	if (message.body.startsWith("[OFFER_DECLINED]")) {
		return formatOfferMessage("declined");
	}

	if (message.body === "[ITEM_MARKED_SOLD]") {
		if (message.sender_id === user.value?.id) {
			return "You have marked this item as sold.";
		} else {
			return "The seller has marked this item as sold.";
		}
	}

	return message.body;
};

function getInitials(name: string): string {
	return name
		.split(" ")
		.filter((n) => n)
		.map((n) => n[0]!)
		.join("")
		.toUpperCase();
}

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
	// First, respond to the offer. If this fails, we stop.
	try {
		await respondToOffer(offerId, status);
		toast.success(`Offer ${status}`);
	} catch (error) {
		console.error("Failed to respond to offer:", error);
		toast.error("Failed to update offer status. Please try again.");
		return; // Stop execution
	}

	// If successful, then send the system message.
	try {
		const messageBody =
			status === "accepted"
				? `[OFFER_ACCEPTED]:${offerId}`
				: `[OFFER_DECLINED]:${offerId}`;
		await sendSystemMessage(messageBody);
	} catch (error) {
		console.error("Failed to send system message:", error);
		toast.error("Offer status updated, but failed to send chat confirmation.");
	}
};
</script>
