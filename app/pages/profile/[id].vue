<template>
	<div class="container mx-auto py-8">
		<!-- Loading state -->
		<div v-if="loading && !profile" class="text-center py-16">
			<p>Loading profile...</p>
		</div>

		<!-- Profile content -->
		<div v-else-if="profile" class="space-y-8">
			<!-- Header -->
			<Card>
				<CardContent class="pt-6">
					<div
						class="flex flex-col items-center md:flex-row md:items-start md:space-x-8"
					>
						<Avatar class="w-24 h-24 md:w-32 md:h-32">
							<AvatarImage
								:src="profile.photo_url || ''"
								alt="Profile Picture"
							/>
							<AvatarFallback>{{ initials }}</AvatarFallback>
						</Avatar>

						<div class="flex-1 text-center md:text-left mt-4 md:mt-0">
							<h1 class="text-3xl font-bold">{{ profile.display_name }}</h1>
							<p class="text-muted-foreground">Joined on {{ joinDate }}</p>

							<!-- Badges -->
							<div
								class="flex justify-center md:justify-start flex-wrap gap-2 mt-4"
							>
								<Badge variant="secondary"
									><ShieldCheck class="w-4 h-4 mr-1" /> Verified ID</Badge
								>
								<Badge variant="secondary"
									><Star class="w-4 h-4 mr-1" /> Trusted Seller</Badge
								>
								<Badge variant="secondary"
									><Trophy class="w-4 h-4 mr-1" /> Top Seller</Badge
								>
								<Badge variant="secondary"
									><Building class="w-4 h-4 mr-1" />
									{{ profile.campus || "Campus Member" }}</Badge
								>
							</div>

							<!-- Rating -->
							<div
								class="flex items-center justify-center md:justify-start gap-1 mt-4"
							>
								<Star class="w-5 h-5 text-yellow-400" />
								<span class="font-bold">4.9</span>
								<span class="text-muted-foreground">(123 reviews)</span>
							</div>
						</div>

						<div class="mt-4 md:mt-0">
							<Button><MessageSquare class="mr-2 h-4 w-4" /> Message</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- About and Stats -->
			<div class="grid md:grid-cols-3 gap-8">
				<div class="md:col-span-2">
					<Card>
						<CardHeader><CardTitle>About</CardTitle></CardHeader>
						<CardContent>
							<p class="text-muted-foreground whitespace-pre-wrap">
								{{ profile.bio || "No bio provided." }}
							</p>
						</CardContent>
					</Card>
				</div>
				<div class="md:col-span-1">
					<Card>
						<CardHeader><CardTitle>Stats</CardTitle></CardHeader>
						<CardContent class="space-y-3">
							<div class="flex items-center gap-3">
								<Package class="w-5 h-5 text-muted-foreground" />
								<span><span class="font-bold">150</span> Items Sold</span>
							</div>
							<div class="flex items-center gap-3">
								<List class="w-5 h-5 text-muted-foreground" />
								<span><span class="font-bold">25</span> Active Listings</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<!-- Tabs for Listings and Reviews -->
			<div>
				<h2 class="text-2xl font-bold mb-4">Listings</h2>
				<p class="text-center text-muted-foreground py-8">
					This user's listings will be displayed here.
				</p>

				<Separator class="my-8" />

				<h2 class="text-2xl font-bold mb-4">Reviews</h2>
				<p class="text-center text-muted-foreground py-8">
					Reviews for this user will be displayed here.
				</p>
			</div>
		</div>

		<!-- Not found state -->
		<div v-else class="text-center py-16">
			<h1 class="text-2xl font-semibold">Profile not found</h1>
			<p class="text-muted-foreground mt-2">
				We couldn't find a profile for this user.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { getProfileById, type Profile } from "~/services/profiles.service";
import {
	ShieldCheck,
	Star,
	Trophy,
	Building,
	MessageSquare,
	Package,
	List,
} from "lucide-vue-next";

const route = useRoute();
const loading = ref(true);
const profile = ref<Profile | null>(null);

const profileId = computed(() => route.params.id as string);

async function fetchProfile() {
	if (!profileId.value) return;

	loading.value = true;
	const { data, error } = await getProfileById(profileId.value);

	if (error || !data) {
		toast.error("Error fetching profile", {
			description: (error as Error)?.message || "Profile not found.",
		});
		profile.value = null;
	} else {
		profile.value = data;
	}
	loading.value = false;
}

const initials = computed(() => {
	const name = profile.value?.display_name || "";
	if (!name) return "??";
	const parts = name.split(" ").filter(Boolean);
	if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
		return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
	}
	if (parts.length === 1 && parts[0]) {
		return parts[0].substring(0, 2).toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
});

const joinDate = computed(() => {
	// Supabase returns ISO 8601 string from created_at, which is part of the user object, not profile.
	// For this example, we'll just return a placeholder.
	// In a real app, you'd want to fetch the user's creation date.
	return "October 2023";
});

onMounted(() => {
	fetchProfile();
});
</script>
