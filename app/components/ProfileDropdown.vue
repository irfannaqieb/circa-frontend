<template>
	<div>
		<div
			v-if="session.loading"
			class="px-3 py-1 flex h-full items-center border font-medium rounded-md shadow-sm"
		>
			<Skeleton class="h-10 w-10 rounded-full" />

			<div class="flex flex-col ml-2 space-y-2 mr-8">
				<Skeleton class="h-4 w-[100px]" />
				<Skeleton class="h-3 w-[120px]" />
			</div>
			<Skeleton class="h-4 w-4" />
		</div>
		<DropdownMenu v-else v-model:open="isProfileDropdownOpen">
			<DropdownMenuTrigger as-child>
				<div
					class="px-3 py-1 flex h-full items-center border hover:bg-secondary font-medium rounded-md cursor-pointer shadow-sm"
				>
					<Avatar>
						<AvatarImage
							:src="userData.profile_picture_url"
							alt="profile-picture"
						/>
						<AvatarFallback>{{ userData.name_abbr }}</AvatarFallback>
					</Avatar>
					<div class="flex flex-col ml-2 leading-none text-start mr-8">
						<span class="text-sm">{{ userData.name }}</span>
						<span class="text-xs text-muted-foreground">{{
							userData.email
						}}</span>
					</div>
					<ChevronUp v-if="isProfileDropdownOpen" class="w-4 h-4 ml-auto" />
					<ChevronDown v-else class="w-4 h-4 ml-auto" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" class="w-56">
				<DropdownMenuItem
					v-if="isLoggedIn"
					class="cursor-pointer"
					@click="navigateTo('/profile')"
				>
					<User class="w-4 h-4 mr-2" />
					<span>My Profile</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					v-if="isLoggedIn"
					class="cursor-pointer"
					@click="signOut"
				>
					<LogOut class="w-4 h-4 mr-2" />
					<span>Sign Out</span>
				</DropdownMenuItem>
				<DropdownMenuItem v-else class="cursor-pointer" @click="signIn">
					<LogOut class="w-4 h-4 mr-2" />
					<span>Sign In</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem class="cursor-pointer">
					<span>Privacy Policy</span>
				</DropdownMenuItem>
				<DropdownMenuItem class="cursor-pointer">
					<span>About</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { User, LogOut, ChevronUp, ChevronDown } from "lucide-vue-next";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Switch } from "~/components/ui/switch";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSessionStore } from "~/stores/session.store";
import { Skeleton } from "~/components/ui/skeleton";

const session = useSessionStore();

const isLoggedIn = computed(() => !!session.user);

const userData = computed(() => {
	const user = session.user;
	if (user) {
		const name =
			user.user_metadata?.display_name ||
			user.user_metadata?.name ||
			user.email?.split("@")[0] ||
			"User";

		let initials = "U";
		const nameParts = (
			user.user_metadata?.display_name ||
			user.user_metadata?.name ||
			""
		).split(" ");

		if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
			initials = (
				nameParts[0][0] + nameParts[nameParts.length - 1][0]
			).toUpperCase();
		} else if (nameParts[0]) {
			initials = nameParts[0].substring(0, 2).toUpperCase();
		} else if (user.email) {
			initials = user.email.substring(0, 2).toUpperCase();
		}

		return {
			name: name,
			email: user.email || "",
			profile_picture_url: user.user_metadata?.avatar_url || "",
			name_abbr: initials,
		};
	}

	return {
		name: "Not Logged In",
		email: "",
		profile_picture_url: "",
		name_abbr: "??",
	};
});

const isProfileDropdownOpen = ref(false);

const signOut = async () => {
	await session.logout();
	navigateTo("/", { replace: true });
};

const signIn = () => {
	navigateTo("/login?redirect=/marketplace", { replace: true });
};
</script>
