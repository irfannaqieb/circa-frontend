<template>
	<div>
		<DropdownMenu v-model:open="isProfileDropdownOpen">
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
					class="cursor-pointer"
					@click="navigateTo('/profile')"
				>
					<User class="w-4 h-4 mr-2" />
					<span>My Profile</span>
				</DropdownMenuItem>
				<DropdownMenuItem class="cursor-pointer" @click="signOut">
					<LogOut class="w-4 h-4 mr-2" />
					<span>Sign Out</span>
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
import { ref } from "vue";
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
import { useSessionStore } from "@/stores/session.store";

const session = useSessionStore();

const userData = ref({
	name: "John Doe",
	email: "john.doe@example.com",
	profile_picture_url: "https://github.com/radix-vue.png",
	name_abbr: "JD",
});

const isProfileDropdownOpen = ref(false);

const signOut = () => {
	session.logout();
	navigateTo("/", { replace: true });
};
</script>
