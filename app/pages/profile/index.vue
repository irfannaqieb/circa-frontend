<template>
	<div class="container mx-auto py-8">
		<!-- Loading state -->
		<div v-if="loading && !profile" class="text-center py-16">
			<p>Loading profile...</p>
		</div>

		<!-- Profile content -->
		<div v-else-if="profile" class="max-w-2xl mx-auto">
			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center space-x-6">
						<Avatar class="w-24 h-24">
							<AvatarImage
								:src="profile.photo_url || ''"
								alt="Profile Picture"
							/>
							<AvatarFallback>{{ initials }}</AvatarFallback>
						</Avatar>
						<div class="space-y-1">
							<h1 class="text-3xl font-bold">{{ profile.display_name }}</h1>
							<p class="text-muted-foreground">{{ session.user?.email }}</p>
						</div>
					</div>

					<div class="mt-8">
						<h2 class="text-lg font-semibold border-b pb-2">About Me</h2>
						<p class="text-muted-foreground mt-4 whitespace-pre-wrap">
							{{ profile.bio || "No bio provided." }}
						</p>
					</div>

					<Button class="mt-8 w-full" @click="isEditModalOpen = true">
						<User class="mr-2 h-4 w-4" /> Edit Profile
					</Button>
				</CardContent>
			</Card>
		</div>

		<!-- Error state -->
		<div v-else class="text-center py-16">
			<h1 class="text-2xl font-semibold">Could not load profile</h1>
			<p class="text-muted-foreground mt-2">
				There was an issue fetching your profile. Please try again later.
			</p>
		</div>

		<!-- Edit Profile Modal -->
		<EditProfile
			v-if="profile"
			v-model="isEditModalOpen"
			:profile-data="profile"
			@profile-updated="handleProfileUpdate"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSessionStore } from "~/stores/session.store";
import { toast } from "vue-sonner";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { User } from "lucide-vue-next";
import EditProfile from "~/components/Modal/EditProfile.vue";
import {
	getProfileForUser,
	type Profile,
	type UpdateProfilePayload,
} from "~/services/profiles.service";

definePageMeta({
	requiresAuth: true,
});

const session = useSessionStore();
const loading = ref(true);
const profile = ref<Profile | null>(null);
const isEditModalOpen = ref(false);

async function fetchProfile() {
	loading.value = true;
	const { data, error } = await getProfileForUser();

	if (error) {
		toast.error("Error fetching profile", {
			description: (error as Error).message,
		});
		profile.value = null;
	} else {
		profile.value = data;
	}
	loading.value = false;
}

function handleProfileUpdate(newProfileData: UpdateProfilePayload) {
	if (profile.value) {
		profile.value = { ...profile.value, ...newProfileData };
	}
	// Re-sync with session store in case display name was changed
	session.refresh();
}

const initials = computed(() => {
	const name = profile.value?.display_name || session.user?.email || "";
	if (!name) return "??";
	const parts = name.split(" ").filter(Boolean);
	if (parts.length > 1) {
		const firstInitial = parts[0]?.substring(0, 1);
		const lastInitial = parts[parts.length - 1]?.substring(0, 1);
		if (firstInitial && lastInitial) {
			return (firstInitial + lastInitial).toUpperCase();
		}
	}
	if (parts.length > 0 && parts[0]) {
		return parts[0].substring(0, 2).toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
});

watch(
	() => session.user,
	(newUser) => {
		if (newUser) {
			fetchProfile();
		} else {
			profile.value = null;
		}
	},
	{ immediate: true }
);
</script>
