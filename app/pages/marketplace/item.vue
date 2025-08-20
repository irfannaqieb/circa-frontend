<template>
	<div class="min-h-screen bg-background">
		<div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="mb-8">
				<div class="flex items-center gap-4 mb-4">
					<Button
						variant="ghost"
						size="sm"
						@click="$router.back()"
						class="flex items-center gap-2"
					>
						<ArrowLeft class="w-4 h-4" />
						Back
					</Button>
				</div>
				<h1 class="text-3xl font-bold text-foreground">List Your Item</h1>
				<p class="text-muted-foreground mt-2">
					Fill out the details below to list your item for sale
				</p>
			</div>

			<!-- Form -->
			<Card>
				<CardContent class="p-4">
					<form @submit="onSubmit" class="space-y-10">
						<!-- Basic Information Section -->
						<div class="space-y-6">
							<div class="border-b pb-4">
								<h2 class="text-xl font-semibold flex items-center gap-2">
									<Package class="w-5 h-5" />
									Basic Information
								</h2>
								<p class="text-muted-foreground text-sm mt-1">
									Tell us about your item
								</p>
							</div>

							<FormField v-slot="{ componentField }" name="title">
								<FormItem>
									<FormLabel>Title *</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g., iPhone 14 Pro Max - 256GB Space Black"
											v-bind="componentField"
										/>
									</FormControl>
									<FormDescription>
										Be specific and descriptive
									</FormDescription>
									<FormMessage />
								</FormItem>
							</FormField>

							<FormField v-slot="{ componentField }" name="description">
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe your item's condition, features, and any other relevant details..."
											class="min-h-[120px] resize-none"
											v-bind="componentField"
										/>
									</FormControl>
									<FormDescription>
										Provide detailed information to help buyers make informed
										decisions
									</FormDescription>
									<FormMessage />
								</FormItem>
							</FormField>

							<FormField v-slot="{ componentField }" name="category">
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select v-bind="componentField" :disabled="categoriesLoading">
										<FormControl>
											<SelectTrigger>
												<SelectValue
													:placeholder="
														categoriesLoading
															? 'Loading categories...'
															: 'Select a category'
													"
												/>
											</SelectTrigger>
										</FormControl>
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
									<FormMessage />
								</FormItem>
							</FormField>
						</div>

						<!-- Pricing Section -->
						<div class="space-y-6">
							<div class="border-b pb-4">
								<h2 class="text-xl font-semibold flex items-center gap-2">
									<DollarSign class="w-5 h-5" />
									Pricing
								</h2>
								<p class="text-muted-foreground text-sm mt-1">
									Set your price or mark as giveaway
								</p>
							</div>

							<FormField v-slot="{ value, handleChange }" name="isGiveaway">
								<FormItem
									class="flex flex-row items-center justify-between rounded-lg border p-4"
								>
									<div class="space-y-0.5">
										<FormLabel class="text-base">Free Giveaway</FormLabel>
										<FormDescription>
											Mark this item as free for others
										</FormDescription>
									</div>
									<FormControl>
										<Switch :checked="value" @update:checked="handleChange" />
									</FormControl>
								</FormItem>
							</FormField>

							<FormField v-slot="{ componentField }" name="price">
								<FormItem v-if="!form.values.isGiveaway">
									<FormLabel>Price *</FormLabel>
									<FormControl>
										<div class="relative">
											<span
												class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
											>
												₩
											</span>
											<Input
												type="number"
												placeholder="0"
												class="pl-8"
												min="0"
												step="1000"
												v-bind="componentField"
											/>
										</div>
									</FormControl>
									<FormDescription>
										Enter amount in Korean Won (KRW)
									</FormDescription>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>

						<!-- Item Details Section -->
						<div class="space-y-6">
							<div class="border-b pb-4">
								<h2 class="text-xl font-semibold flex items-center gap-2">
									<Info class="w-5 h-5" />
									Item Details
								</h2>
								<p class="text-muted-foreground text-sm mt-1">
									Additional information about your item
								</p>
							</div>

							<FormField v-slot="{ componentField }" name="condition">
								<FormItem>
									<FormLabel>Condition</FormLabel>
									<Select v-bind="componentField">
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select condition" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="new">New</SelectItem>
											<SelectItem value="like-new">Like New</SelectItem>
											<SelectItem value="excellent">Excellent</SelectItem>
											<SelectItem value="good">Good</SelectItem>
											<SelectItem value="fair">Fair</SelectItem>
											<SelectItem value="poor">Poor</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							</FormField>

							<FormField v-slot="{ componentField }" name="location">
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g., Gangnam, Seoul"
											v-bind="componentField"
										/>
									</FormControl>
									<FormDescription>
										Where can buyers pick up or meet?
									</FormDescription>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>

						<!-- Photos Section -->
						<div class="space-y-6">
							<div class="border-b pb-4">
								<h2 class="text-xl font-semibold flex items-center gap-2">
									<ImageIcon class="w-5 h-5" />
									Photos
								</h2>
								<p class="text-muted-foreground text-sm mt-1">
									Add up to {{ maxImages }} photos to showcase your item
								</p>
							</div>

							<!-- Image Upload Area -->
							<div
								v-if="selectedImages.length === 0"
								class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
							>
								<ImageIcon
									class="w-12 h-12 mx-auto text-muted-foreground/50 mb-4"
								/>
								<p class="text-muted-foreground mb-2">
									Click to add photos or drag and drop
								</p>
								<p class="text-xs text-muted-foreground mb-4">
									High-quality photos help your item sell faster
								</p>
								<input
									type="file"
									multiple
									accept="image/*"
									@change="handleImageSelect"
									class="hidden"
									id="image-upload"
								/>
								<Button
									type="button"
									variant="outline"
									@click="triggerImageUpload"
								>
									<ImageIcon class="w-4 h-4 mr-2" />
									Choose Photos
								</Button>
							</div>

							<!-- Image Previews -->
							<div v-if="selectedImages.length > 0" class="space-y-4">
								<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
									<div
										v-for="(url, index) in imagePreviewUrls"
										:key="index"
										class="relative group"
									>
										<img
											:src="url"
											:alt="`Preview ${index + 1}`"
											class="w-full h-32 object-cover rounded-lg border"
										/>
										<button
											type="button"
											@click="removeImage(index)"
											class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
										>
											×
										</button>
										<div
											v-if="index === 0"
											class="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
										>
											Primary
										</div>
									</div>
								</div>

								<!-- Add More Button -->
								<div
									v-if="selectedImages.length < maxImages"
									class="text-center"
								>
									<input
										type="file"
										multiple
										accept="image/*"
										@change="handleImageSelect"
										class="hidden"
										id="image-upload-more"
									/>
									<Button
										type="button"
										variant="outline"
										@click="triggerMoreImageUpload"
									>
										<ImageIcon class="w-4 h-4 mr-2" />
										Add More Photos ({{ selectedImages.length }}/{{
											maxImages
										}})
									</Button>
								</div>
							</div>
						</div>

						<!-- Submit Button -->
						<div class="flex justify-end gap-4 pt-6 border-t">
							<Button type="button" variant="outline" @click="$router.back()">
								Cancel
							</Button>
							<Button type="submit" class="px-8" :disabled="isSubmitting">
								<template v-if="isSubmitting">
									<div
										class="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full"
									></div>
									Creating...
								</template>
								<template v-else>
									<Plus class="w-4 h-4 mr-2" />
									List Item
								</template>
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";
import {
	ArrowLeft,
	Package,
	DollarSign,
	Info,
	ImageIcon as ImageIcon,
	Plus,
} from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Card, CardContent } from "~/components/ui/card";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import {
	createItem,
	getCategories,
	uploadImage,
	createItemImage,
	type InsertItem,
	type Category,
} from "~/services/items.service";
import { useSessionStore } from "~/stores/session.store";
import { toast } from "vue-sonner";

// Load categories from database
const categories = ref<Category[]>([]);
const categoriesLoading = ref(true);

// Image handling
const selectedImages = ref<File[]>([]);
const imagePreviewUrls = ref<string[]>([]);
const maxImages = 5;

// Form validation schema
const formSchema = toTypedSchema(
	z
		.object({
			title: z
				.string()
				.min(1, "Title is required")
				.min(3, "Title must be at least 3 characters"),
			description: z.string().optional(),
			category: z.string().optional(),
			condition: z.string().optional(),
			isGiveaway: z.boolean().default(false),
			price: z.union([z.string(), z.number()]).optional(),
			location: z.string().optional(),
		})
		.refine(
			(data) => {
				// If not a giveaway, price is required and must be a positive number
				if (!data.isGiveaway) {
					const priceValue =
						typeof data.price === "string" ? Number(data.price) : data.price;
					return priceValue != null && priceValue > 0;
				}
				return true;
			},
			{
				message:
					"Price is required for non-giveaway items and must be greater than 0",
				path: ["price"],
			}
		)
);

// Initialize form
const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		title: "",
		description: "",
		category: "",
		condition: "",
		isGiveaway: false,
		price: undefined,
		location: "",
	},
});

// Initialize session store and reactive state
const sessionStore = useSessionStore();

// Initialize session and load categories on page load
onMounted(async () => {
	await sessionStore.initialize();
	await loadCategories();
});

// Load categories from database
async function loadCategories() {
	try {
		const { data, error } = await getCategories();
		if (error) {
			console.error("Error loading categories:", error);
			toast.error("Failed to load categories");
			return;
		}
		if (data) {
			categories.value = data;
		}
	} catch (error) {
		console.error("Unexpected error loading categories:", error);
		toast.error("Failed to load categories");
	} finally {
		categoriesLoading.value = false;
	}
}

// Handle image selection
function handleImageSelect(event: Event) {
	const target = event.target as HTMLInputElement;
	const files = Array.from(target.files || []);

	// Check if adding these files would exceed the limit
	if (selectedImages.value.length + files.length > maxImages) {
		toast.error(`You can only upload up to ${maxImages} images`);
		return;
	}

	// Add new files
	selectedImages.value.push(...files);

	// Create preview URLs
	files.forEach((file) => {
		const url = URL.createObjectURL(file);
		imagePreviewUrls.value.push(url);
	});

	// Clear the input
	target.value = "";
}

// Click handlers for file inputs
function triggerImageUpload() {
	if (process.client) {
		const input = document.getElementById("image-upload") as HTMLInputElement;
		input?.click();
	}
}

function triggerMoreImageUpload() {
	if (process.client) {
		const input = document.getElementById(
			"image-upload-more"
		) as HTMLInputElement;
		input?.click();
	}
}

// Remove image
function removeImage(index: number) {
	// Revoke the URL to free memory
	const url = imagePreviewUrls.value[index];
	if (url) {
		URL.revokeObjectURL(url);
	}

	// Remove from arrays
	selectedImages.value.splice(index, 1);
	imagePreviewUrls.value.splice(index, 1);
}

// Upload images for an item
async function uploadItemImages(itemId: string) {
	const uploadPromises = selectedImages.value.map(async (file, index) => {
		try {
			// Upload file to storage
			const { data: filePath, error: uploadError } = await uploadImage(
				file,
				itemId
			);
			if (uploadError) throw uploadError;
			if (!filePath) throw new Error("No file path returned");

			// Save reference to database
			const { error: dbError } = await createItemImage(
				itemId,
				filePath,
				index + 1,
				index === 0 // First image is primary
			);
			if (dbError) throw dbError;

			return filePath;
		} catch (error) {
			console.error(`Error uploading image ${index + 1}:`, error);
			throw error;
		}
	});

	return Promise.all(uploadPromises);
}

// Reactive state for form submission
const isSubmitting = ref(false);

// Form submission handler
const onSubmit = form.handleSubmit(async (values) => {
	// Check if user is authenticated
	if (!sessionStore.isAuthenticated || !sessionStore.user) {
		toast.error("You must be logged in to create an item");
		// Redirect to login with return URL
		await navigateTo({
			path: "/",
			query: { login: "1", redirect: "/marketplace/item" },
		});
		return;
	}

	isSubmitting.value = true;

	try {
		// Find the selected category to get both ID and slug
		const selectedCategory = categories.value.find(
			(cat) => cat.id === values.category
		);

		// Convert form values to the format expected by the service
		const itemData: InsertItem = {
			owner_id: sessionStore.user.id,
			title: values.title,
			description: values.description || null,
			category: selectedCategory?.slug || null, // Store category slug for backward compatibility
			category_id: values.category || null,
			condition: values.condition || null,
			is_giveaway: values.isGiveaway,
			location: values.location || null,
			status: "Available",
			original_currency: "KRW",
			base_currency: "KRW",
			// Handle pricing based on whether it's a giveaway
			original_price_minor: values.isGiveaway
				? 0
				: values.price
				? typeof values.price === "string"
					? parseInt(values.price)
					: values.price
				: null,
			base_price_minor: values.isGiveaway
				? 0
				: values.price
				? typeof values.price === "string"
					? parseInt(values.price)
					: values.price
				: null,
		};

		// Call the service to create the item
		const { data, error } = await createItem(itemData);

		if (error) {
			console.error("Error creating item:", error);
			toast.error(error.message || "Failed to create item");
			return;
		}

		if (data) {
			// Upload images if any were selected
			if (selectedImages.value.length > 0) {
				try {
					await uploadItemImages(data.id);
					toast.success(
						`Item created successfully with ${selectedImages.value.length} image(s)!`
					);
				} catch (imageError) {
					console.error("Error uploading images:", imageError);
					toast.success(
						"Item created successfully, but some images failed to upload"
					);
				}
			} else {
				toast.success("Item created successfully!");
			}

			await navigateTo("/marketplace");
		}
	} catch (error: any) {
		console.error("Unexpected error:", error);
		toast.error(error.message || "An unexpected error occurred");
	} finally {
		isSubmitting.value = false;
	}
});

// Set page layout and require authentication
definePageMeta({
	layout: "default",
	requiresAuth: true,
});
</script>
