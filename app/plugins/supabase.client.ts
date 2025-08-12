import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const supabaseUrl = config.public.supabaseUrl as string | undefined;
	const supabaseAnonKey = config.public.supabaseAnonKey as string | undefined;

	if (!supabaseUrl || !supabaseAnonKey) {
		// Create a no-op client placeholder to avoid runtime crashes if env is missing
		// Consumers should ensure env vars are set
		const placeholder = {
			from: () => ({
				select: async () => ({
					data: null,
					error: new Error("Supabase env not set"),
				}),
			}),
		} as unknown as SupabaseClient;

		return {
			provide: { supabase: placeholder },
		};
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	return {
		provide: {
			supabase,
		},
	};
});

