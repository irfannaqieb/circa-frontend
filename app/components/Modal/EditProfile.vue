<template>
	<Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Edit Profile</DialogTitle>
				<DialogDescription>
					Make changes to your profile here. Click save when you're done.
				</DialogDescription>
			</DialogHeader>
			<div v-if="profile" class="space-y-4 py-4">
				<div class="flex flex-col items-center gap-4">
					<button @click="triggerFileInput" class="relative group rounded-full">
						<Avatar class="w-24 h-24">
							<AvatarImage :src="avatarPreviewUrl" alt="Profile Picture" />
							<AvatarFallback>{{ initials }}</AvatarFallback>
						</Avatar>
						<div
							class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<Camera class="w-8 h-8" />
						</div>
					</button>
					<input
						type="file"
						@change="onFileChange"
						accept="image/*"
						ref="fileInput"
						class="hidden"
					/>
				</div>
				<div class="space-y-2">
					<Label for="displayName">Display Name</Label>
					<Input id="displayName" v-model="(profile.display_name as string)" />
				</div>
				<div class="space-y-2">
					<Label for="campus">Campus</Label>
					<Input id="campus" v-model="(profile.campus as string)" />
				</div>
				<div class="space-y-2">
					<Label for="bio">Bio</Label>
					<Textarea
						id="bio"
						v-model="(profile.bio as string)"
						placeholder="Tell us a little about yourself"
					/>
				</div>
			</div>
			<DialogFooter>
				<Button @click="handleUpdateProfile" :disabled="loading">
					<span v-if="loading">Saving...</span>
					<span v-else>Save Changes</span>
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
	updateProfileForUser,
	uploadAvatar,
	type Profile,
	type UpdateProfilePayload,
} from "~/services/profiles.service";
import { useSessionStore } from "~/stores/session.store";
import { Camera } from "lucide-vue-next";

const props = defineProps<{
	modelValue: boolean;
	profileData: Profile | null;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "profile-updated", newProfileData: UpdateProfilePayload): void;
}>();

const session = useSessionStore();
const loading = ref(false);
const profile = ref<Partial<Profile>>({});
const avatarFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

watch(
	() => props.profileData,
	(newProfile) => {
		if (newProfile) {
			profile.value = {
				...newProfile,
				display_name: newProfile.display_name || "",
				campus: newProfile.campus || "",
				bio: newProfile.bio || "",
			};
		}
	},
	{ immediate: true, deep: true }
);

const avatarPreviewUrl = ref<string>(profile.value?.photo_url || "");

let lastObjectUrl: string | null = null;

watch(
	[avatarFile, () => profile.value?.photo_url],
	([file, url]) => {
		// Clean up old blob URL
		if (lastObjectUrl) {
			URL.revokeObjectURL(lastObjectUrl);
			lastObjectUrl = null;
		}

		if (file) {
			const blobUrl = URL.createObjectURL(file);
			lastObjectUrl = blobUrl;
			avatarPreviewUrl.value = blobUrl;
		} else {
			avatarPreviewUrl.value = url || "";
		}
	},
	{ immediate: true }
);

onUnmounted(() => {
	if (lastObjectUrl) {
		URL.revokeObjectURL(lastObjectUrl);
	}
});

const initials = computed(() => {
	const name = profile.value?.display_name || "";
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

function triggerFileInput() {
	fileInput.value?.click();
}

function onFileChange(event: Event) {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		if (file.size > 1024 * 1024) {
			toast.error("File is too large. Max 1MB.");
			return;
		}
		avatarFile.value = file;
	}
}

async function handleUpdateProfile() {
	if (!session.user) return;
	loading.value = true;

	let publicAvatarUrl = profile.value.photo_url;

	if (avatarFile.value) {
		const { publicUrl, error } = await uploadAvatar(
			session.user.id,
			avatarFile.value
		);
		if (error) {
			toast.error("Error uploading avatar", { description: error.message });
			loading.value = false;
			return;
		}
		publicAvatarUrl = publicUrl;
	}

	const updates: UpdateProfilePayload = {
		display_name: profile.value.display_name,
		campus: profile.value.campus,
		bio: profile.value.bio,
		photo_url: publicAvatarUrl,
	};

	const { error } = await updateProfileForUser(updates);

	if (error) {
		toast.error("Error updating profile", {
			description: (error as Error).message,
		});
	} else {
		toast.success("Profile updated successfully!");
		emit("profile-updated", updates);
		emit("update:modelValue", false);

		avatarFile.value = null;
		avatarPreviewUrl.value = profile.value?.photo_url || "";
	}

	loading.value = false;
}
</script>
