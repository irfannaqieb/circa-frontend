import type { PostgrestError } from "@supabase/supabase-js";

export interface ItemImage {
	id: string;
	item_id: string;
	path: string;
	position: number;
	is_primary: boolean;
	created_at?: string;
	updated_at?: string;
}

export type ItemStatus =
	| "Available"
	| "Reserved"
	| "Sold"
	| "Draft"
	| "Archived";

export interface Item {
	id: string;
	owner_id: string;
	title: string;
	description?: string | null;
	category?: string | null;
	category_id?: string | null;
	condition?: string | null;
	is_giveaway?: boolean | null;
	location?: string | null;
	status?: ItemStatus | null;
	created_at?: string;
	updated_at?: string;
	original_currency: string;
	original_price_minor?: number | null;
	base_currency: string;
	base_price_minor?: number | null;
	// Additional fields for my-listings functionality
	primary_image_path?: string | null;
	images?: ItemImage[];
	is_boosted?: boolean | null;
	is_featured?: boolean | null;
	views?: number | null;
	saves?: number | null;
	messages?: number | null;
}

export type InsertItem = Omit<Item, "id" | "created_at" | "updated_at">;
export type UpdateItem = Partial<
	Omit<Item, "id" | "owner_id" | "created_at" | "updated_at">
>;

export interface ItemsQueryOptions {
	page?: number;
	pageSize?: number;
	category?: string;
	location?: string;
	search?: string;
	ownerId?: string;
	status?: ItemStatus;
	minPriceMinorKRW?: number; // e.g., 5000 for ₩5,000
	maxPriceMinorKRW?: number; // e.g., 20000 for ₩20,000
	sortBy?: "created_at" | "price"; // default created_at
	sortDir?: "asc" | "desc"; // default desc
}

function getClient() {
	const { $supabase } = useNuxtApp();
	return $supabase;
}

// get a paginated list of items
export async function getItems(options: ItemsQueryOptions = {}) {
	const client = getClient();
	const page = Math.max(1, options.page ?? 1);
	const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 20));
	const from = (page - 1) * pageSize;
	const to = from + pageSize - 1;

	let query = client
		.from("items")
		.select("*", { count: "exact" })
		.range(from, to);

	// sorting
	const sortBy = options.sortBy ?? "created_at";
	const sortDir = options.sortDir ?? "desc";
	if (sortBy === "price") {
		query = query.order("base_price_minor", {
			ascending: sortDir === "asc",
			nullsFirst: true,
		});
	} else {
		query = query.order("created_at", { ascending: sortDir === "asc" });
	}

	// filtering
	if (options.category) query = query.eq("category", options.category);
	if (options.location) query = query.eq("location", options.location);
	if (options.ownerId) query = query.eq("owner_id", options.ownerId);
	if (options.status) query = query.eq("status", options.status);

	if (options.search) {
		const term = `%${options.search}%`;
		query = query.or(`title.ilike.${term},description.ilike.${term}`);
	}

	if (options.minPriceMinorKRW != null) {
		query = query.gte("base_price_minor", options.minPriceMinorKRW);
	}
	if (options.maxPriceMinorKRW != null) {
		query = query.lte("base_price_minor", options.maxPriceMinorKRW);
	}

	const { data, error, count } = await query;
	return {
		data: data as Item[] | null,
		error: error as PostgrestError | null,
		count: count ?? null,
	};
}

// get a single item by id
export async function getItem(id: string) {
	const client = getClient();
	const { data, error } = await client
		.from("items")
		.select("*")
		.eq("id", id)
		.single();
	return { data: data as Item | null, error: error as PostgrestError | null };
}

function checkPriceConsistency(input: Partial<Item>) {
	const hasPriceFields =
		"is_giveaway" in input ||
		"original_price_minor" in input ||
		"base_price_minor" in input;

	if (!hasPriceFields) {
		return;
	}
	const isGiveaway = !!input.is_giveaway;
	const opm = input.original_price_minor ?? null;
	const bpm = input.base_price_minor ?? null;

        if (isGiveaway) {
                if (opm != null && opm !== 0)
                        throw new Error(
                                "Giveaway items must have original price minor = 0"
                        );
                if (bpm != null && bpm !== 0)
                        throw new Error(
                                "Giveaway items must have base price minor = 0"
                        );
        } else {
                if (opm == null || bpm == null)
                        throw new Error(
                                "Non-giveaway items must have both original and base price minor"
                        );
                if ((opm ?? 0) < 0 || (bpm ?? 0) < 0)
                        throw new Error(
                                "Price minor values cannot be negative"
                        );
        }
}
// insert a new row to the items table
export async function createItem(input: InsertItem) {
	checkPriceConsistency(input);
	const client = getClient();
	const { data, error } = await client
		.from("items")
		.insert(input)
		.select("*")
		.single();
	return { data: data as Item | null, error: error as PostgrestError | null };
}

// update a row in the items table
export async function updateItem(id: string, input: UpdateItem) {
	checkPriceConsistency(input);
	const client = getClient();
	const { data, error } = await client
		.from("items")
		.update(input)
		.eq("id", id)
		.select("*")
		.single();
	return { data: data as Item | null, error: error as PostgrestError | null };
}

// delete a row from the items table
export async function deleteItem(id: string) {
	const client = getClient();
	const { error } = await client.from("items").delete().eq("id", id);
	return { ok: !error, error: error as PostgrestError | null };
}

// upload image to Supabase Storage
export async function uploadImage(
	file: File,
	itemId: string
): Promise<{ data: string | null; error: any }> {
	const client = getClient();

	// Create unique filename
	const fileExt = file.name.split(".").pop() || "jpg";
	const fileName = `${itemId}/${Date.now()}.${fileExt}`;

	const { data, error } = await client.storage
		.from("item-images")
		.upload(fileName, file);

	if (error) {
		return { data: null, error };
	}

	return { data: fileName, error: null };
}

// save image reference to database
export async function createItemImage(
	itemId: string,
	path: string,
	position: number,
	isPrimary: boolean = false
) {
	const client = getClient();

	const { data, error } = await client
		.from("item_images")
		.insert({
			item_id: itemId,
			path: path,
			position: position,
			is_primary: isPrimary,
		})
		.select("*")
		.single();

	return {
		data: data as ItemImage | null,
		error: error as PostgrestError | null,
	};
}

// get images for an item
export async function getItemImages(itemId: string) {
	const client = getClient();

	const { data, error } = await client
		.from("item_images")
		.select("*")
		.eq("item_id", itemId)
		.order("position", { ascending: true });

	return {
		data: data as ItemImage[] | null,
		error: error as PostgrestError | null,
	};
}

// update a row in the item_images table
export async function updateItemImage(
	imageId: string,
	updates: Partial<{ is_primary: boolean; position: number }>
) {
	const client = getClient();
	const { data, error } = await client
		.from("item_images")
		.update(updates)
		.eq("id", imageId)
		.select()
		.single();
	return {
		data: data as ItemImage | null,
		error: error as PostgrestError | null,
	};
}

// delete an image, from storage and database
export async function deleteItemImage(imageId: string) {
	const client = getClient();

	// First, get the image path to delete it from storage
	const { data: image, error: getError } = await client
		.from("item_images")
		.select("path, item_id")
		.eq("id", imageId)
		.single();

	if (getError || !image) {
		console.error("Could not retrieve image to delete", getError);
		return { ok: false, error: getError };
	}

	// Delete from storage
	const { error: storageError } = await client.storage
		.from("item-images")
		.remove([image.path]);
	if (storageError) {
		// Log error but continue to delete from database
		console.error("Error deleting image from storage:", storageError);
	}

	// Delete from database
	const { error: dbError } = await client
		.from("item_images")
		.delete()
		.eq("id", imageId);

	if (dbError) {
		return { ok: false, error: dbError };
	}

	return { ok: true, error: null };
}

// get public URL for an image
export function getImageUrl(path: string): string {
	const client = getClient();
	const { data } = client.storage.from("item-images").getPublicUrl(path);

	return data.publicUrl;
}

// get all images for a list of item IDs
export async function getImagesForItemIds(itemIds: string[]) {
	if (!itemIds || itemIds.length === 0) {
		return { data: [], error: null };
	}

	const client = getClient();
	const { data, error } = await client
		.from("item_images")
		.select("id, item_id, path, is_primary, position")
		.in("item_id", itemIds)
		.order("position", { ascending: true });

	return {
		data: data as ItemImage[] | null,
		error: error as PostgrestError | null,
	};
}
