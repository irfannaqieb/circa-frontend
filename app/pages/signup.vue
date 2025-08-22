<template>
	<div
		class="flex items-center justify-center min-h-screen bg-background text-foreground"
	>
		<Card class="relative w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg">
			<Button
				variant="ghost"
				size="icon"
				class="absolute top-4 left-4"
				@click="goBack"
			>
				<ArrowLeft class="h-6 w-6" />
			</Button>
			<CardHeader class="text-center pt-12">
				<CardTitle class="text-3xl font-bold">Create an account</CardTitle>
				<CardDescription class="text-muted-foreground"
					>Enter your details to get started.</CardDescription
				>
			</CardHeader>
			<CardContent>
				<form @submit.prevent="handleSignUp" class="space-y-4">
					<div>
						<div class="relative">
							<User
								class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
							/>
							<Input
								v-model="name"
								type="text"
								placeholder="Full Name"
								class="pl-10"
								required
								@blur="validate"
							/>
						</div>
						<p v-if="errors.name" class="mt-1 text-sm text-destructive">
							{{ errors.name[0] }}
						</p>
					</div>
					<div>
						<div class="relative">
							<Building2
								class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
							/>
							<Input
								v-model="campus"
								type="text"
								placeholder="University"
								class="pl-10"
								required
								@blur="validate"
							/>
						</div>
						<p v-if="errors.campus" class="mt-1 text-sm text-destructive">
							{{ errors.campus[0] }}
						</p>
					</div>
					<div>
						<div class="relative">
							<Mail
								class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
							/>
							<Input
								v-model="email"
								type="email"
								placeholder="Email"
								class="pl-10"
								required
								@blur="validate"
							/>
						</div>
						<p v-if="errors.email" class="mt-1 text-sm text-destructive">
							{{ errors.email[0] }}
						</p>
					</div>
					<div>
						<div class="relative">
							<Lock
								class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
							/>
							<Input
								v-model="password"
								:type="showPassword ? 'text' : 'password'"
								placeholder="Password"
								class="pl-10"
								required
								@blur="validate"
							/>
							<button
								type="button"
								@click="showPassword = !showPassword"
								class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
							>
								<Eye v-if="!showPassword" />
								<EyeOff v-if="showPassword" />
							</button>
						</div>
						<p v-if="errors.password" class="mt-1 text-sm text-destructive">
							{{ errors.password[0] }}
						</p>
					</div>
					<Button type="submit" class="w-full !mt-6" :disabled="loading">
						<span v-if="!loading">Sign Up</span>
						<span v-else>Signing up...</span>
					</Button>
				</form>
			</CardContent>
			<CardFooter class="flex flex-col space-y-4">
				<div class="relative w-full">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t"></span>
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-card px-2 text-muted-foreground"
							>Or continue with</span
						>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-4 w-full">
					<Button
						variant="outline"
						@click="handleOAuthLogin('google')"
						:disabled="loading"
						class="flex items-center justify-center gap-2"
					>
						<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Google
					</Button>
				</div>
				<div class="text-center text-sm text-muted-foreground">
					Already have an account?
					<NuxtLink
						to="/login"
						class="font-semibold text-primary hover:underline"
						>Sign In</NuxtLink
					>
				</div>
			</CardFooter>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	ArrowLeft,
	User,
	Building2,
} from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { useSessionStore } from "~/stores/session.store";
import { toast } from "vue-sonner";

definePageMeta({
	layout: false,
});

const sessionStore = useSessionStore();

const name = ref("");
const campus = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errors = ref<{
	name?: string[];
	campus?: string[];
	email?: string[];
	password?: string[];
}>({});

const router = useRouter();

const goBack = () => {
	router.back();
};

const signupSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, { message: "Name must be at least 2 characters long." }),
	campus: z
		.string()
		.trim()
		.min(2, { message: "University must be at least 2 characters long." }),
	email: z
		.string()
		.trim()
		.email({ message: "Please enter a valid email address." }),
	password: z
		.string()
		.trim()
		.min(8, { message: "Password must be at least 8 characters long." }),
});

const validate = () => {
	const result = signupSchema.safeParse({
		name: name.value,
		campus: campus.value,
		email: email.value,
		password: password.value,
	});

	if (!result.success) {
		errors.value = result.error.flatten().fieldErrors;
		return false;
	}
	errors.value = {};
	return true;
};

const handleSignUp = async () => {
	if (!validate()) {
		return;
	}
	loading.value = true;
	const { ok, error } = await sessionStore.signUpWithPassword(
		email.value,
		password.value,
		{
			display_name: name.value,
			campus: campus.value,
		}
	);
	loading.value = false;

	if (ok) {
		toast.success("Sign up successful!", {
			description: "Please check your email to verify your account.",
		});
	} else {
		toast.error("Sign up failed", {
			description: error || "An unknown error occurred.",
		});
	}
};

const handleOAuthLogin = async (provider: "google" | "github") => {
	loading.value = true;
	const route = useRoute();
	const redirect = route.query.redirect as string;
	const { ok, error } = await sessionStore.signInWithProvider(
		provider,
		redirect
	);
	loading.value = false;

	if (!ok) {
		toast.error(`Sign in with ${provider} failed`, {
			description: error || "An unknown error occurred.",
		});
	}
};
</script>
