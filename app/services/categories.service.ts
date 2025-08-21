import type { PostgrestError } from "@supabase/supabase-js";

export interface Category {
	id: string;
	name: string;
	slug: string;
	icon_key: string;
	created_at?: string;
	updated_at?: string;
}

function getClient() {
	const { $supabase } = useNuxtApp();
	return $supabase;
}

export async function getCategories() {
	const client = getClient();
	const { data, error } = await client
		.from("categories")
		.select("*")
		.order("name", { ascending: true });
	return {
		data: data as Category[] | null,
		error: error as PostgrestError | null,
	};
}
