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
} from "~/services/items.service";
import { toast } from "vue-sonner";

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
