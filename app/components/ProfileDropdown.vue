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
import { computed, ref } from "vue";
import { User, LogOut, ChevronUp, ChevronDown } from "lucide-vue-next";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { useSessionStore } from "@/stores/session.store";

const session = useSessionStore();

const isProfileDropdownOpen = ref(false);

const userData = computed(() => {
  const user = session.user;
  // Fallbacks if not logged in
  if (!user) {
    return {
      name: "Guest",
      email: "",
      profile_picture_url: "https://github.com/radix-vue.png",
      name_abbr: "G"
    };
  }
  // Try to get name from user_metadata or fallback to email prefix
  const name = user.user_metadata?.name 
    || (user.email ? user.email.split('@')[0] : "User");
  const email = user.email || "";
  const name_abbr = name
    .split(' ')
    .map(part => part)
    .join('')
    .toUpperCase()
    .substring(0,2); // e.g. JD
  // If you have a profile picture field, add it here; else fallback image
  const profile_picture_url =
    user.user_metadata?.avatar_url || "https://github.com/radix-vue.png";
  return { name, email, profile_picture_url, name_abbr };
});

const signOut = () => {
  session.logout();
  navigateTo("/", { replace: true });
};
</script>
