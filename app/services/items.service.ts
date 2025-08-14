import type { PostgrestError } from "@supabase/supabase-js";

export type ItemStatus = "available" | "reserved" | "unavailable";

export interface Item {
	id: string;
	owner_id: string;
	title: string;
	description?: string | null;
	category?: string | null;
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
	const isGiveaway = !!input.is_giveaway;
	const opm = input.original_price_minor ?? null;
	const bpm = input.base_price_minor ?? null;

	if (isGiveaway) {
		if (opm && opm !== 0)
			throw new Error("Giveaway items must have original price minor = 0");
		if (bpm && bpm !== 0)
			throw new Error("Giveaway items must have base price minor = 0");
	} else {
		if (opm == null || bpm == null) {
			throw new Error(
				"Non-giveaway items must have both original and base price minor"
			);
		}
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
