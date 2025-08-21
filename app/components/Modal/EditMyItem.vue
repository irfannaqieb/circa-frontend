<template>
	<Dialog :open="open" @update:open="emit('update:open', $event)">
		<DialogContent class="sm:max-w-[600px]">
			<DialogHeader>
				<DialogTitle>Edit Listing</DialogTitle>
				<DialogDescription>
					Update the details of your item. Click save when you're done.
				</DialogDescription>
			</DialogHeader>

			<div v-if="item" class="grid gap-6 py-4">
				<!-- Form Fields -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Title -->
					<div class="space-y-2">
						<Label for="title">Title</Label>
						<Input id="title" v-model="form.title" />
					</div>

					<!-- Category -->
					<div class="space-y-2">
						<Label for="category">Category</Label>
						<Select v-model="form.category_id">
							<SelectTrigger>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									v-for="category in categories"
									:key="category.id"
									:value="category.id"
								>
									{{ category.name }}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<!-- Photos Section -->
				<div class="space-y-4 pt-4 border-t">
					<div class="space-y-2">
						<Label>Photos</Label>
						<p class="text-sm text-muted-foreground">
							Manage images for your item. The first image is the primary one.
						</p>
					</div>

					<!-- Loading Skeleton -->
					<div v-if="loadingImages" class="grid grid-cols-3 gap-4">
						<Skeleton class="h-24 w-full" v-for="i in 3" :key="i" />
					</div>

					<!-- Image Previews -->
					<div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
						<!-- Existing Images -->
						<div
							v-for="image in itemImages"
							:key="image.id"
							class="relative group"
						>
							<img
								:src="getImageUrl(image.path)"
								:alt="`Item image ${image.position}`"
								class="w-full h-24 object-cover rounded-lg border"
							/>
							<button
								type="button"
								@click="handleRemoveImage(image)"
								class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
							>
								×
							</button>
							<div
								v-if="image.is_primary"
								class="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded"
							>
								Primary
							</div>
						</div>

						<!-- New Image Uploads -->
						<div
							v-if="itemImages.length < maxImages"
							class="border-2 border-dashed border-muted-foreground/25 rounded-lg h-24 flex items-center justify-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
							@click="triggerImageUpload"
						>
							<div class="text-center">
								<ImageIcon
									class="w-8 h-8 mx-auto text-muted-foreground/50 mb-1"
								/>
								<span class="text-xs text-muted-foreground">Add Photo</span>
							</div>
						</div>
					</div>
					<input
						type="file"
						multiple
						accept="image/*"
						@change="handleImageSelect"
						class="hidden"
						id="edit-image-upload"
						:disabled="isUploading"
					/>
					<p v-if="isUploading" class="text-sm text-muted-foreground">
						Uploading images...
					</p>
				</div>

				<!-- Description -->
				<div class="space-y-2">
					<Label for="description">Description</Label>
					<Textarea
						id="description"
						:model-value="form.description ?? ''"
						@update:model-value="form.description = String($event)"
						class="min-h-[100px]"
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Price -->
					<div class="space-y-2">
						<Label for="price">Price (in KRW)</Label>
						<Input
							id="price"
							:model-value="form.original_price_minor ?? 0"
							@update:model-value="form.original_price_minor = Number($event)"
							type="number"
							:disabled="form.is_giveaway"
						/>
					</div>

					<!-- Giveaway -->
					<div class="flex items-center space-x-2 pt-8">
						<Switch id="is_giveaway" v-model:checked="form.is_giveaway" />
						<Label for="is_giveaway">This is a giveaway (free item)</Label>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Condition -->
					<div class="space-y-2">
						<Label for="condition">Condition</Label>
						<Select v-model="form.condition">
							<SelectTrigger>
								<SelectValue placeholder="Select condition" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="New">New</SelectItem>
								<SelectItem value="Used - Like New">Used - Like New</SelectItem>
								<SelectItem value="Used - Good">Used - Good</SelectItem>
								<SelectItem value="Used - Fair">Used - Fair</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<!-- Status -->
					<div class="space-y-2">
						<Label for="status">Status</Label>
						<Select v-model="form.status">
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									v-for="s in itemStatuses"
									:key="s"
									:value="s"
									class="capitalize"
								>
									{{ s }}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<DialogFooter>
				<Button variant="outline" @click="emit('update:open', false)">
					Cancel
				</Button>
				<Button @click="handleSave" :disabled="loading">
					<span v-if="loading" class="animate-spin mr-2">⏳</span>
					{{ loading ? "Saving..." : "Save Changes" }}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	type Item,
	type UpdateItem,
	type Category,
	type ItemStatus,
	updateItem,
	getCategories,
	getImagesForItemIds,
	deleteItemImage,
	updateItemImage,
	uploadImage,
	createItemImage,
	getImageUrl,
	type ItemImage,
} from "~/services/items.service";
import { toast } from "vue-sonner";
import { ImageIcon } from "lucide-vue-next";
import { Skeleton } from "~/components/ui/skeleton";

// Props and Emits
const props = defineProps<{
	item: Item | null;
	open: boolean;
}>();

const emit = defineEmits<{
	(e: "update:open", value: boolean): void;
	(e: "item-updated"): void;
}>();

// Component State
const form = ref<Partial<UpdateItem>>({});
const categories = ref<Category[]>([]);
const loading = ref(false);
const itemStatuses: ItemStatus[] = [
	"Available",
	"Reserved",
	"Sold",
	"Draft",
	"Archived",
];
const itemImages = ref<ItemImage[]>([]);
const loadingImages = ref(false);
const isUploading = ref(false);
const maxImages = 5;

// Watch for prop changes to initialize form
watch(
	() => props.item,
	(newItem) => {
		if (newItem) {
			form.value = {
				title: newItem.title,
				description: newItem.description,
				category_id: newItem.category_id,
				original_price_minor: newItem.original_price_minor,
				is_giveaway: newItem.is_giveaway,
				condition: newItem.condition,
				status: newItem.status,
			};
			loadItemImages();
		} else {
			itemImages.value = [];
		}
	},
	{ immediate: true }
);

// Watch for giveaway switch to update price
watch(
	() => form.value.is_giveaway,
	(isGiveaway) => {
		if (isGiveaway) {
			form.value.original_price_minor = 0;
			form.value.base_price_minor = 0;
		}
	}
);

// Methods
async function loadItemImages() {
	if (!props.item) return;
	loadingImages.value = true;
	try {
		const { data, error } = await getImagesForItemIds([props.item.id]);
		if (error) {
			toast.error("Failed to load item images.");
		} else {
			itemImages.value = data || [];
		}
	} finally {
		loadingImages.value = false;
	}
}

function triggerImageUpload() {
	document.getElementById("edit-image-upload")?.click();
}

async function handleImageSelect(event: Event) {
	const target = event.target as HTMLInputElement;
	const files = Array.from(target.files || []);
	if (files.length === 0) return;

	if (itemImages.value.length + files.length > maxImages) {
		toast.error(`You can only upload up to ${maxImages} images.`);
		return;
	}

	isUploading.value = true;
	try {
		for (const file of files) {
			await uploadAndCreateImage(file);
		}
		toast.success(`${files.length} image(s) uploaded successfully.`);
	} catch (error) {
		toast.error("An error occurred during upload.");
	} finally {
		isUploading.value = false;
		target.value = "";
		await loadItemImages();
	}
}

async function uploadAndCreateImage(file: File) {
	if (!props.item) return;

	const { data: filePath, error: uploadError } = await uploadImage(
		file,
		props.item.id
	);
	if (uploadError || !filePath) {
		throw new Error("Failed to upload image to storage.");
	}

	const nextPosition =
		itemImages.value.length > 0
			? Math.max(...itemImages.value.map((img) => img.position)) + 1
			: 1;

	const isPrimary = itemImages.value.length === 0;

	const { error: dbError } = await createItemImage(
		props.item.id,
		filePath,
		nextPosition,
		isPrimary
	);
	if (dbError) {
		throw new Error("Failed to save image reference.");
	}
}

async function handleRemoveImage(image: ItemImage) {
	if (!props.item) return;

	const { ok, error } = await deleteItemImage(image.id);
	if (!ok || error) {
		toast.error("Failed to delete image.");
		console.error("Error deleting image:", error);
		return;
	}

	toast.success("Image deleted.");

	const remainingImages = itemImages.value.filter((i) => i.id !== image.id);

	if (image.is_primary && remainingImages.length > 0) {
		remainingImages.sort((a, b) => a.position - b.position);
		const newPrimary = remainingImages[0];

		const { error: updateError } = await updateItemImage(newPrimary.id, {
			is_primary: true,
		});
		if (updateError) {
			toast.error("Failed to set new primary image. Please set one manually.");
		}
	}

	await loadItemImages();
}

async function loadCategories() {
	const { data, error } = await getCategories();
	if (error) {
		console.error("Failed to load categories", error);
		toast.error("Failed to load categories.");
	} else {
		categories.value = data || [];
	}
}

async function handleSave() {
	if (!props.item) return;

	loading.value = true;
	try {
		// Temporary workaround for price consistency check
		if (!form.value.is_giveaway) {
			form.value.base_price_minor = form.value.original_price_minor;
		}

		const { error } = await updateItem(props.item.id, form.value);

		if (error) {
			toast.error(`Failed to update item: ${error.message}`);
		} else {
			toast.success("Item updated successfully!");
			emit("item-updated");
			emit("update:open", false);
		}
	} catch (err: any) {
		console.error("Error saving item:", err);
		toast.error(err.message || "An unexpected error occurred.");
	} finally {
		loading.value = false;
	}
}

// Lifecycle Hooks
onMounted(() => {
	loadCategories();
});
</script>
