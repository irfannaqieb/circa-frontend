export default defineNuxtRouteMiddleware(async (to) => {
	// Only guard routes that explicitly require auth
	const requiresAuth = Boolean(to.meta?.requiresAuth);
	if (!requiresAuth) return;

	// Avoid SSR false-negatives; perform auth check client-side
	if (process.server) return;

	const { useSessionStore } = await import("@/stores/session.store");
	const session = useSessionStore();

	await session.initialize();

	if (!session.isAuthenticated) {
		return navigateTo({
			path: "/login",
			query: { redirect: to.fullPath },
		});
	}
});
