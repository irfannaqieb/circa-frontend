import { defineStore } from "pinia";
import {
	getItems,
	type Item,
	type ItemsQueryOptions,
} from "@/services/items.service";

// We can export the query options from here to be used in components
export type { ItemsQueryOptions };

export interface ItemsState {
	items: Item[];
	total: number;
	page: number;
	pageSize: number;
	filters: Partial<ItemsQueryOptions>;
	loading: boolean;
	error: string | null;
}

export const useItemsStore = defineStore("items", {
	state: (): ItemsState => ({
		items: [],
		total: 0,
		page: 1,
		pageSize: 20, // Default page size
		filters: {},
		loading: false,
		error: null,
	}),
	actions: {
		async fetch() {
			this.loading = true;
			this.error = null;
			try {
				const { data, error, count } = await getItems({
					page: this.page,
					pageSize: this.pageSize,
					...this.filters,
				});

				if (error) {
					throw error;
				}

				this.items = data ?? [];
				this.total = count ?? 0;
			} catch (err: any) {
				this.items = [];
				this.total = 0;
				this.error = err?.message ?? "An unknown error occurred";
			} finally {
				this.loading = false;
			}
		},

		setFilters(newFilters: Partial<ItemsQueryOptions>) {
			// Reset page to 1 when filters change
			this.page = 1;
			this.filters = { ...this.filters, ...newFilters };
			return this.fetch(); // refetch with new filters
		},

		setPage(newPage: number) {
			this.page = Math.max(1, newPage);
			return this.fetch(); // refetch for the new page
		},

		setPageSize(newPageSize: number) {
			this.pageSize = Math.min(100, Math.max(1, newPageSize));
			this.page = 1; // reset to first page
			return this.fetch(); // refetch with new page size
		},

		reset() {
			this.items = [];
			this.total = 0;
			this.page = 1;
			this.pageSize = 20;
			this.filters = {};
			this.loading = false;
			this.error = null;
		},
	},
});
