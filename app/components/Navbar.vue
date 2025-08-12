<template>
	<nav class="m-4 mb-0 rounded-t-xl px-4 py-3">
		<div class="max-w-7xl mx-auto flex items-center justify-between">
			<!-- Left side - Logo and brand name -->
			<div class="flex items-center space-x-3">
				<div
					class="w-10 h-10 bg-black rounded-full flex items-center justify-center"
				>
					<span class="text-white font-bold text-lg">c.</span>
				</div>
				<span class="text-xl font-bold text-gray-900">circa</span>
			</div>

			<!-- Middle - Navigation links -->
			<div class="hidden md:flex items-center space-x-8">
				<NuxtLink
					to="/"
					class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
				>
					Home
				</NuxtLink>
				<NuxtLink
					to="/marketplace"
					class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
				>
					Marketplace
				</NuxtLink>
				<!-- <NuxtLink
					to="/about"
					class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
				>
					About
				</NuxtLink>
				<NuxtLink
					to="/contact"
					class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
				>
					Contact
				</NuxtLink> -->
			</div>

			<!-- Right side - Action buttons -->
			<div class="flex items-center space-x-4">
				<Button variant="outline" size="sm"> Become a seller </Button>
				<template v-if="!session.isAuthenticated">
					<Button size="sm" :disabled="session.loading" @click="openLoginModal">
						{{ session.loading ? "Signing in…" : "Sign in" }}
					</Button>
				</template>
				<template v-else>
					<Button
						size="sm"
						variant="secondary"
						:disabled="session.loading"
						@click="handleLogout"
					>
						{{ session.loading ? "Signing out…" : "Sign out" }}
					</Button>
				</template>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					@click="toggleMobileMenu"
					class="text-gray-700 hover:text-gray-900"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile navigation menu -->
		<div v-if="isMobileMenuOpen" class="md:hidden mt-4 pb-4 pt-4">
			<div class="flex flex-col space-y-4">
				<NuxtLink to="/" class="text-gray-700 hover:text-gray-900 font-medium">
					Home
				</NuxtLink>
				<NuxtLink
					to="/about"
					class="text-gray-700 hover:text-gray-900 font-medium"
				>
					About
				</NuxtLink>
				<NuxtLink
					to="/contact"
					class="text-gray-700 hover:text-gray-900 font-medium"
				>
					Contact
				</NuxtLink>
				<div class="flex flex-col space-y-2 pt-4">
					<Button variant="outline" size="sm" class="w-full">
						Become a seller
					</Button>
					<template v-if="!session.isAuthenticated">
						<Button
							size="sm"
							class="w-full"
							:disabled="session.loading"
							@click="openLoginModal"
						>
							{{ session.loading ? "Signing in…" : "Sign in" }}
						</Button>
					</template>
					<template v-else>
						<Button
							size="sm"
							variant="secondary"
							class="w-full"
							:disabled="session.loading"
							@click="handleLogout"
						>
							{{ session.loading ? "Signing out…" : "Sign out" }}
						</Button>
					</template>
				</div>
			</div>
		</div>

		<ModalLogin
			:open="isLoginModalOpen"
			@update:open="isLoginModalOpen = $event"
			@success="onLoginSuccess"
		/>
	</nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "~/components/ui/button/Button.vue";
import { useSessionStore } from "@/stores/session.store";

const isMobileMenuOpen = ref(false);
const isLoginModalOpen = ref(false);

const toggleMobileMenu = () => {
	isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const openLoginModal = () => {
	isLoginModalOpen.value = true;
};

const onLoginSuccess = () => {
	console.log("Login successful");
};

const session = useSessionStore();
onMounted(() => {
	session.initialize();
});

const handleLogout = async () => {
	await session.logout();
};
</script>
