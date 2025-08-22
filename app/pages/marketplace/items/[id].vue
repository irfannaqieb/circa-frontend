<template>
	<div v-if="item" class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Media Gallery (Left Column) -->
			<div class="lg:col-span-2">
				<div v-if="item.images && item.images.length > 0" class="grid gap-4">
					<div class="relative overflow-hidden rounded-lg border">
						<img
							:src="
								getImageUrl(selectedImage?.path || item.images?.[0]?.path || '')
							"
							:alt="item.title"
							class="w-full h-[637px] object-cover"
						/>
						<Badge
							v-if="item.status !== 'Available'"
							class="absolute top-4 left-4"
							:variant="item.status === 'Sold' ? 'destructive' : 'default'"
						>
							{{ item.status }}
						</Badge>
					</div>
					<div v-if="item.images.length > 1" class="grid grid-cols-5 gap-2">
						<button
							v-for="image in item.images"
							:key="image.id"
							@click="selectedImage = image"
							class="rounded-lg overflow-hidden border-2"
							:class="{
								'border-primary': selectedImage?.id === image.id,
								'border-transparent': selectedImage?.id !== image.id,
							}"
						>
							<img
								:src="getImageUrl(image.path)"
								:alt="`Thumbnail for ${item.title}`"
								class="w-full h-20 object-cover"
							/>
						</button>
					</div>
				</div>
				<div
					v-else
					class="bg-muted rounded-lg h-[400px] flex items-center justify-center text-muted-foreground"
				>
					<ImageIcon class="w-16 h-16" />
				</div>
			</div>

			<!-- Item Info & Actions (Right Column) -->
			<div>
				<Breadcrumb class="mb-4">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/marketplace">Marketplace</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink
								v-if="item.category"
								:href="`/marketplace/category/${item.category.slug}`"
								>{{ item.category.name }}</BreadcrumbLink
							>
							<span v-else>Category</span>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{{ item.title }}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<h1 class="text-3xl font-bold mb-2">{{ item.title }}</h1>

				<div class="flex items-center gap-4 mb-4">
					<p class="text-2xl font-bold text-primary">
						{{ formatPrice(item.base_price_minor, item.is_giveaway) }}
					</p>
					<Badge v-if="item.condition" variant="outline">{{
						item.condition
					}}</Badge>
				</div>

				<div
					class="text-sm text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 mb-6"
				>
					<div class="flex items-center gap-2">
						<MapPin class="w-4 h-4" />
						<span>{{ item.location || "Not specified" }}</span>
					</div>
					<div class="flex items-center gap-2">
						<Calendar class="w-4 h-4" />
						<span>Posted {{ formatDate(item.created_at) }}</span>
					</div>
					<div class="flex items-center gap-2">
						<Eye class="w-4 h-4" />
						<span>{{ item.views || 0 }} views</span>
					</div>
					<div class="flex items-center gap-2">
						<Heart class="w-4 h-4" />
						<span>{{ item.saves || 0 }} saves</span>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<Badge variant="secondary" class="gap-1.5 pr-3">
						<ShieldCheck class="w-4 h-4 text-green-600" />
						Verified Student
					</Badge>
					<Badge variant="secondary" class="gap-1.5 pr-3">
						<Building class="w-4 h-4 text-blue-600" />
						Campus Verified
					</Badge>
				</div>

				<Separator class="my-6" />

				<!-- Primary Actions -->
				<div>
					<div class="mb-4">
						<p class="font-semibold mb-1">Availability</p>
						<div class="flex items-center gap-2">
							<span
								class="h-2.5 w-2.5 rounded-full"
								:class="{
									'bg-green-500': item.status === 'Available',
									'bg-yellow-500': item.status === 'Reserved',
									'bg-red-500': item.status === 'Sold',
									'bg-gray-400': !item.status,
								}"
							></span>
							<span class="text-sm text-muted-foreground">{{
								item.status || "Unknown"
							}}</span>
						</div>
					</div>
					<Button
						v-if="!isOwner"
						size="lg"
						class="w-full mb-2"
						:disabled="!canChat || chatLoading"
						@click="handleBuyNow"
					>
						<span v-if="chatLoading">Starting conversation...</span>
						<span v-else-if="item.is_giveaway">Claim Giveaway</span>
						<span v-else>Buy Now</span>
					</Button>
					<div v-if="!isOwner" class="grid grid-cols-2 gap-2">
						<Button
							variant="secondary"
							:disabled="!canChat || chatLoading"
							@click="handleChatWithSeller"
						>
							<MessageCircle class="w-4 h-4 mr-2" />
							<span v-if="chatLoading">Starting...</span>
							<span v-else>Chat with Seller</span>
						</Button>
						<Button
							variant="secondary"
							:disabled="!canChat || chatLoading || item.is_giveaway"
							@click="handleMakeOffer"
						>
							<Tag class="w-4 h-4 mr-2" />
							<span v-if="chatLoading">Starting...</span>
							<span v-else>Make Offer</span>
						</Button>
						<Button variant="secondary">
							<Heart class="w-4 h-4 mr-2" /> Save
						</Button>
						<Button variant="secondary">
							<Share2 class="w-4 h-4 mr-2" /> Share
						</Button>
					</div>
					<div v-else class="text-center py-4">
						<p class="text-muted-foreground">This is your listing</p>
						<Button variant="outline" class="mt-2"> Edit Listing </Button>
					</div>
				</div>

				<Separator class="my-6" />

				<!-- Seller Card -->
				<div class="border rounded-lg p-4">
					<div class="flex items-center gap-4">
						<Avatar>
							<AvatarImage
								v-if="sellerProfile?.photo_url"
								:src="sellerProfile.photo_url"
								:alt="sellerProfile.display_name || 'Seller Avatar'"
							/>
							<AvatarFallback>{{ sellerInitials }}</AvatarFallback>
						</Avatar>
						<div class="flex-1">
							<div class="flex justify-between items-center">
								<p class="font-semibold">
									{{ sellerProfile?.display_name || "Seller" }}
								</p>
								<NuxtLink :to="`/profile/${item.owner_id}`">
									<Button variant="secondary" size="sm">View Profile</Button>
								</NuxtLink>
							</div>
							<div
								class="flex items-center gap-1 text-sm text-muted-foreground"
							>
								<!-- Star rating placeholder -->
								<span v-if="sellerProfile"
									>⭐️
									{{
										sellerProfile.trust_score
											? sellerProfile.trust_score.toFixed(1)
											: "N/A"
									}}
									(123 sales)</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Item Details -->
		<div class="mt-12">
			<h2 class="text-2xl font-bold mb-4">About this item</h2>
			<div
				class="prose prose-stone dark:prose-invert max-w-none"
				v-html="item.description"
			></div>

			<div v-if="item.tags && item.tags.length > 0" class="mt-6">
				<h3 class="text-lg font-semibold mb-3">Tags</h3>
				<div class="flex flex-wrap gap-2">
					<Badge v-for="tag in item.tags" :key="tag" variant="secondary">{{
						tag
					}}</Badge>
				</div>
			</div>
		</div>
	</div>
	<div v-else-if="loading" class="flex justify-center items-center h-screen">
		<div
			class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"
		></div>
	</div>
	<div v-else class="text-center py-16">
		<h1 class="text-2xl font-semibold">Item not found</h1>
		<p class="text-muted-foreground mt-2">
			The item you are looking for does not exist or has been removed.
		</p>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import {
	getItem,
	getItemImages,
	type Item,
	type ItemImage,
	getImageUrl,
} from "~/services/items.service";
import { type Category } from "~/services/categories.service";
import { toast } from "vue-sonner";
import { Badge } from "~/components/ui/badge";
import {
	ImageIcon,
	MapPin,
	Calendar,
	Eye,
	Heart,
	ShieldCheck,
	Building,
	MessageCircle,
	Tag,
	Share2,
} from "lucide-vue-next";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getProfileById, type Profile } from "~/services/profiles.service";
import { getOrCreateConversation } from "~/services/conversations.service";
import { useSessionStore } from "~/stores/session.store";

// Helper functions
function formatPrice(
	priceMinor: number | null | undefined,
	isGiveaway: boolean | null | undefined
): string {
	if (isGiveaway) return "Free";
	if (!priceMinor) return "Price not set";
	return `₩${priceMinor.toLocaleString()}`;
}

function formatDate(dateString: string | undefined): string {
	if (!dateString) return "Unknown date";
	const date = new Date(dateString);
	// format as "Month Day, Year"
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

const route = useRoute();
const sessionStore = useSessionStore();
const router = useRouter();

const item = ref<
	| (Item & {
			images?: ItemImage[];
			category?: Category;
			tags?: string[];
	  })
	| null
>(null);
const loading = ref(true);
const sellerProfile = ref<Profile | null>(null);

const selectedImage = ref<ItemImage | null>(null);

// Chat functionality
const chatLoading = ref(false);

const currentUser = computed(() => sessionStore.session?.user);

const isOwner = computed(() => {
	return currentUser.value?.id === item.value?.owner_id;
});

const canChat = computed(() => {
	return (
		currentUser.value &&
		item.value &&
		!isOwner.value &&
		item.value.status === "Available"
	);
});

// Handler functions
const handleChatWithSeller = async () => {
	if (!currentUser.value || !item.value || !item.value.owner_id) {
		toast.error("Please log in to chat with the seller.");
		return;
	}

	if (isOwner.value) {
		toast.error("You cannot chat with yourself.");
		return;
	}

	chatLoading.value = true;
	try {
		const { data: conversationId, error } = await getOrCreateConversation(
			item.value.id,
			item.value.owner_id
		);

		if (error) {
			if (error.message?.includes("self")) {
				toast.error("You cannot start a conversation with yourself.");
			} else {
				toast.error("Failed to start conversation. Please try again.");
			}
			return;
		}

		if (conversationId) {
			await router.push(`/chat/${conversationId}?itemId=${item.value.id}`);
		}
	} catch (err) {
		console.error("Error starting chat:", err);
		toast.error("An unexpected error occurred. Please try again.");
	} finally {
		chatLoading.value = false;
	}
};

const handleBuyNow = async () => {
	// For now, this will start a conversation.
	// In a real app, this might go to a checkout flow.
	await handleChatWithSeller();
};

const handleMakeOffer = async () => {
	if (!currentUser.value || !item.value || !item.value.owner_id) {
		toast.error("Please log in to make an offer.");
		return;
	}

	if (isOwner.value) {
		toast.error("You cannot make an offer on your own item.");
		return;
	}

	chatLoading.value = true;
	try {
		const { data: conversationId, error } = await getOrCreateConversation(
			item.value.id,
			item.value.owner_id
		);

		if (error) {
			if (error.message?.includes("self")) {
				toast.error("You cannot start a conversation with yourself.");
			} else {
				toast.error("Failed to start conversation. Please try again.");
			}
			return;
		}

		if (conversationId) {
			// Navigate to chat page with a special flag to open offer dialog
			await router.push(
				`/chat/${conversationId}?itemId=${item.value.id}&openOffer=true`
			);
		}
	} catch (err) {
		console.error("Error starting chat for offer:", err);
		toast.error("An unexpected error occurred. Please try again.");
	} finally {
		chatLoading.value = false;
	}
};

watch(
	() => item.value?.images,
	(newImages) => {
		if (newImages && newImages.length > 0) {
			const primary = newImages.find((img) => img.is_primary);
			if (primary) {
				selectedImage.value = primary;
			} else {
				selectedImage.value = newImages[0] ?? null;
			}
		} else {
			selectedImage.value = null;
		}
	}
);

onMounted(async () => {
	const itemId = route.params.id as string;
	if (!itemId) {
		toast.error("No item ID provided.");
		loading.value = false;
		return;
	}

	try {
		const [
			{ data: itemData, error: itemError },
			{ data: imageData, error: imageError },
		] = await Promise.all([getItem(itemId), getItemImages(itemId)]);

		if (itemError || !itemData) {
			console.error("Error fetching item:", itemError);
			toast.error("Failed to load item details.");
			item.value = null;
		} else {
			item.value = itemData as Item & {
				images?: ItemImage[];
				category?: Category;
				tags?: string[];
			};
			if (imageError) {
				console.error("Error fetching images:", imageError);
				toast.error("Failed to load item images.");
				item.value.images = [];
			} else {
				item.value.images = imageData || [];
			}

			// Fetch seller profile using owner_id
			if (item.value?.owner_id) {
				const { data: profileData, error: profileError } = await getProfileById(
					item.value.owner_id
				);
				if (profileError) {
					console.error("Error fetching seller profile:", profileError);
				} else {
					sellerProfile.value = profileData;
				}
			}
		}
	} catch (err) {
		console.error("An unexpected error occurred:", err);
		toast.error("An unexpected error occurred while fetching item details.");
		item.value = null;
	} finally {
		loading.value = false;
	}
});

const sellerInitials = computed(() => {
	const name = (sellerProfile.value?.display_name || "").trim();
	if (!name) return "SL";
	const parts = name.split(/\s+/);
	const initials = parts
		.slice(0, 2)
		.map((p) => p.charAt(0).toUpperCase())
		.join("");
	return initials || "SL";
});
</script>
