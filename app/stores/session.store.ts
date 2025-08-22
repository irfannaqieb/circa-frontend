import { defineStore } from "pinia";
import type { Session, User, Subscription } from "@supabase/supabase-js";

type AuthSubscription = Subscription | null;

interface SessionState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	error: string | null;
	_subscribed: boolean;
	_authSub: AuthSubscription;
}

export const useSessionStore = defineStore("session", {
	state: (): SessionState => ({
		user: null,
		session: null,
		loading: false,
		error: null,
		_subscribed: false,
		_authSub: null,
	}),
	getters: {
		isAuthenticated: (state) => Boolean(state.user),
	},
	actions: {
		async initialize() {
			if (this._subscribed) return;
			const { $supabase } = useNuxtApp();
			// Load current session once
			this.loading = true;
			try {
				const { data, error } = await $supabase.auth.getSession();
				if (error) throw error;
				this.session = data.session;
				this.user = data.session?.user ?? null;
			} catch (err: any) {
				this.error = err?.message ?? "Failed to load session";
			} finally {
				this.loading = false;
			}

			// Subscribe to auth changes (client only)
			if (process.client && !this._subscribed) {
				const {
					data: { subscription },
				} = $supabase.auth.onAuthStateChange((_event, session) => {
					this.session = session;
					this.user = session?.user ?? null;
				});
				this._authSub = subscription;
				this._subscribed = true;
			}
		},

		async refresh() {
			const { $supabase } = useNuxtApp();
			this.loading = true;
			try {
				const { data, error } = await $supabase.auth.getSession();
				if (error) throw error;
				this.session = data.session;
				this.user = data.session?.user ?? null;
			} catch (err: any) {
				this.error = err?.message ?? "Failed to refresh session";
			} finally {
				this.loading = false;
			}
		},

		async signInWithPassword(email: string, password: string) {
			const { $supabase } = useNuxtApp();
			this.loading = true;
			this.error = null;
			try {
				const { data, error } = await $supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
				this.session = data.session ?? null;
				this.user = data.user ?? null;
				return { ok: true as const };
			} catch (err: any) {
				this.error = err?.message ?? "Sign in failed";
				return { ok: false as const, error: this.error };
			} finally {
				this.loading = false;
			}
		},

		async signUpWithPassword(
			email: string,
			password: string,
			metadata: { display_name: string; campus: string },
			redirectTo?: string
		) {
			const { $supabase } = useNuxtApp();
			this.loading = true;
			this.error = null;
			try {
				const callback =
					redirectTo ||
					(process.client
						? `${window.location.origin}/auth/callback`
						: undefined);
				const { data, error } = await $supabase.auth.signUp({
					email,
					password,
					options: { emailRedirectTo: callback, data: metadata },
				});
				if (error) throw error;
				this.session = data.session ?? null;
				this.user = data.user ?? null;
				return { ok: true as const };
			} catch (err: any) {
				this.error = err?.message ?? "Sign up failed";
				return { ok: false as const, error: this.error };
			} finally {
				this.loading = false;
			}
		},

		async signInWithProvider(
			provider: "google" | "github",
			redirectTo?: string
		) {
			const { $supabase } = useNuxtApp();
			this.loading = true;
			this.error = null;
			try {
				let callbackUrl = process.client
					? `${window.location.origin}/auth/callback`
					: "";

				if (redirectTo) {
					const redirectUrl = new URL(callbackUrl);
					redirectUrl.searchParams.set("redirect", redirectTo);
					callbackUrl = redirectUrl.toString();
				}
				const { error } = await $supabase.auth.signInWithOAuth({
					provider,
					options: { redirectTo: callbackUrl },
				});
				if (error) throw error;
				return { ok: true as const };
			} catch (err: any) {
				this.error = err?.message ?? "OAuth sign-in failed";
				return { ok: false as const, error: this.error };
			} finally {
				this.loading = false;
			}
		},

		async logout() {
			const { $supabase } = useNuxtApp();
			this.loading = true;
			this.error = null;
			try {
				const { error } = await $supabase.auth.signOut();
				if (error) throw error;
			} catch (err: any) {
				this.error = err?.message ?? "Logout failed";
			} finally {
				this.session = null;
				this.user = null;
				this.loading = false;
			}
		},
	},
});
