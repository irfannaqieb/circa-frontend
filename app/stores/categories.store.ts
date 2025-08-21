import { defineStore } from "pinia";
import { getCategories, type Category } from "@/services/categories.service";

export interface CategoriesState {
	categories: Category[];
	loading: boolean;
	error: string | null;
}

export const useCategoriesStore = defineStore("categories", {
	state: (): CategoriesState => ({
		categories: [],
		loading: false,
		error: null,
	}),
	actions: {
		async fetch() {
			if (this.categories.length) return; // Avoid refetching
			this.loading = true;
			this.error = null;
			try {
				const { data, error } = await getCategories();

				if (error) {
					throw error;
				}

				this.categories = data ?? [];
			} catch (err: any) {
				this.categories = [];
				this.error = err?.message ?? "An unknown error occurred";
			} finally {
				this.loading = false;
			}
		},
	},
});
