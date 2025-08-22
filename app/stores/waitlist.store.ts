import { defineStore } from "pinia";

interface WaitlistState {
  loading: boolean;
  error: string | null;
}

export const useWaitlistStore = defineStore("waitlist", {
  state: (): WaitlistState => ({
    loading: false,
    error: null,
  }),
  actions: {
    async joinWaitlist(email: string) {
      const { $supabase } = useNuxtApp();
      this.loading = true;
      this.error = null;
      try {
        const { error } = await $supabase
          .from('waitlist')
          .insert({ email });
        if (error) throw error;
        return { ok: true };
      } catch (err: any) {
        this.error = err?.message ?? "Failed to join waitlist";
        return { ok: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});


