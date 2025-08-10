import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],
	modules: ["shadcn-nuxt", "@nuxtjs/google-fonts"],
	vite: {
		plugins: [tailwindcss()],
	},
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./components/ui",
	},
	googleFonts: {
		families: {
			Urbanist: [400, 500, 600, 700, 800], // choose weights you need
		},
		display: "swap", // prevents layout shifts
		preconnect: true, // faster load
		download: true, // self-host font files
		inject: true, // auto inject <link> or @font-face
	},
});
