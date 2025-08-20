<template>
	<Dialog :open="isOpen" @update:open="updateOpen">
		<DialogContent class="sm:max-w-md">
			<DialogHeader>
				<DialogTitle>Sign in to Circa</DialogTitle>
				<DialogDescription>
					Sign in or create an account with email and password, or use Google.
				</DialogDescription>
			</DialogHeader>

			<Form
				@submit="onSubmit"
				:validation-schema="schema"
				v-slot="{ errors, isSubmitting }"
			>
				<FormField v-slot="{ componentField }" name="email">
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input
								type="email"
								placeholder="Enter your email address"
								v-bind="componentField"
								:disabled="isSubmitting"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="password">
					<FormItem>
						<div class="flex items-center justify-between">
							<FormLabel>Password</FormLabel>
							<button
								type="button"
								class="text-xs underline"
								@click="toggleMode"
							>
								{{
									isSignUp
										? "Have an account? Sign in"
										: "Don't have an account? Sign up"
								}}
							</button>
						</div>
						<FormControl>
							<Input
								type="password"
								placeholder="Enter your password"
								v-bind="componentField"
								:disabled="isSubmitting"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<DialogFooter class="mt-6">
					<div class="w-full space-y-3">
						<Button type="submit" class="w-full" :disabled="isSubmitting">
							{{
								isSubmitting
									? isSignUp
										? "Creating account..."
										: "Signing in..."
									: isSignUp
									? "Create account"
									: "Sign in"
							}}
						</Button>

						<!-- Placeholder for future Google sign-in -->
						<div class="relative">
							<div class="absolute inset-0 flex items-center">
								<span class="w-full border-t" />
							</div>
							<div class="relative flex justify-center text-xs uppercase">
								<span class="bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>

						<Button
							type="button"
							variant="outline"
							class="w-full"
							:disabled="isSubmitting || isOauthRedirecting"
							@click="onOAuth('google')"
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
							{{
								isOauthRedirecting
									? "Redirecting to Google..."
									: "Continue with Google"
							}}
						</Button>
					</div>
				</DialogFooter>
			</Form>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { Form } from "vee-validate";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/stores/session.store";
import { toast } from "vue-sonner";

interface Props {
	open?: boolean;
}

interface Emits {
	(e: "update:open", value: boolean): void;
	(e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
	open: false,
});

const emit = defineEmits<Emits>();

const isOpen = ref(props.open);
const session = useSessionStore();

const isSignUp = ref(false);
const isOauthRedirecting = ref(false);

const schema = toTypedSchema(
	z.object({
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
	})
);

// Watch for prop changes
watch(
	() => props.open,
	(newValue) => {
		isOpen.value = newValue;
	}
);

// Handle dialog open/close
const updateOpen = (open: boolean) => {
	isOpen.value = open;
	emit("update:open", open);
};

// Handle form submission
const toggleMode = () => {
	isSignUp.value = !isSignUp.value;
};

const onSubmit = async (values: any) => {
	try {
		const result = isSignUp.value
			? await session.signUpWithPassword(values.email, values.password)
			: await session.signInWithPassword(values.email, values.password);

                if (result.ok) {
                        if (process.client) {
                                toast.success(
                                        isSignUp.value
                                                ? "Account created. Check your email to confirm if required."
                                                : "Signed in successfully."
                                );
                        }
                        updateOpen(false);
                        emit("success");
                } else {
                        if (process.client) {
                                toast.error(
                                        session.error ||
                                                (isSignUp.value ? "Failed to create account" : "Failed to sign in")
                                );
                        }
                }
        } catch (error) {
                console.error("Auth error:", error);
                if (process.client) {
                        toast.error("An unexpected error occurred");
                }
        }
};

const onOAuth = async (provider: "google" | "github") => {
	isOauthRedirecting.value = true;
	try {
		const result = await session.signInWithProvider(provider);
                if (!result?.ok) {
                        console.error("OAuth sign-in initiation failed", {
                                provider,
                                error: (result as any)?.error,
                        });
                        if (process.client) {
                                toast.error("Unable to start OAuth sign-in, please try again");
                        }
                        isOauthRedirecting.value = false;
                }
		// On success, a redirect is likely to occur; keep redirecting state true.
	} catch (error) {
                console.error("OAuth sign-in initiation threw", { provider, error });
                if (process.client) {
                        toast.error("Unable to start OAuth sign-in, please try again");
                }
                isOauthRedirecting.value = false;
        }
};
</script>
