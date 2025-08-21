import type { PostgrestError } from "@supabase/supabase-js";

export interface Profile {
	id: string;
	display_name?: string | null;
	campus?: string | null;
	photo_url?: string | null;
	bio?: string | null;
	trust_score: number;
	points: number;
}

export type UpdateProfilePayload = Pick<
	Profile,
	"display_name" | "campus" | "bio" | "photo_url"
>;

function getClient() {
	const { $supabase } = useNuxtApp();
	return $supabase;
}

export async function getProfileForUser() {
	const client = getClient();
	const {
		data: { user },
	} = await client.auth.getUser();
	if (!user) return { data: null, error: { message: "No user logged in" } };

	const { data, error } = await client
		.from("profiles")
		.select("id, display_name, photo_url, campus, bio, trust_score, points")
		.eq("id", user.id)
		.single();

	if (error && error.code !== "PGRST116") {
		// PGRST116 is "Not a single row was found"
		return { data: null, error };
	}

	if (data) {
		return { data: data as Profile, error: null };
	}

	// No profile found, return default from auth metadata
	const defaultProfile: Profile = {
		id: user.id,
		display_name:
			user.user_metadata.display_name || user.user_metadata.name || "",
		photo_url: user.user_metadata.avatar_url || "",
		campus: "",
		bio: "",
		trust_score: 0,
		points: 0,
	};
	return { data: defaultProfile, error: null };
}

export async function updateProfileForUser(updates: UpdateProfilePayload) {
	const client = getClient();
	const {
		data: { user },
	} = await client.auth.getUser();
	if (!user) return { error: { message: "No user logged in" } };

	const profileData = {
		...updates,
		id: user.id,
		updated_at: new Date().toISOString(),
	};

	const { error } = await client.from("profiles").upsert(profileData);

	if (error) {
		return { error };
	}

	// Also update user_metadata in auth.users for quick access
	const { error: metaError } = await client.auth.updateUser({
		data: {
			display_name: updates.display_name,
			avatar_url: updates.photo_url, // Supabase auth metadata uses avatar_url
		},
	});

	return { error: metaError };
}

export async function uploadAvatar(userId: string, file: File) {
	const client = getClient();
	const fileExt = file.name.split(".").pop();
	const filePath = `${userId}/avatar.${fileExt}`;

	// First, remove any existing avatars in the user's folder
	const { data: files, error: listError } = await client.storage
		.from("avatars")
		.list(userId);

	if (listError) {
		console.error("Error listing files:", listError);
	} else if (files && files.length > 0) {
		const filesToRemove = files.map((f) => `${userId}/${f.name}`);
		const { error: removeError } = await client.storage
			.from("avatars")
			.remove(filesToRemove);
		if (removeError) {
			console.error("Error removing files:", removeError);
		}
	}

	const { error: uploadError } = await client.storage
		.from("avatars")
		.upload(filePath, file, { upsert: true });

	if (uploadError) {
		return { publicUrl: null, error: uploadError };
	}

	const { data } = client.storage.from("avatars").getPublicUrl(filePath);
	return { publicUrl: data.publicUrl, error: null };
}

export async function getProfileById(id: string) {
	const client = getClient();

	const { data, error } = await client
		.from("profiles")
		.select("id, display_name, photo_url, campus, bio, trust_score, points")
		.eq("id", id)
		.single();

	if (error) {
		return { data: null, error };
	}

	return { data: data as Profile, error: null };
}
