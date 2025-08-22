<template>
	<div class="bg-gray-50 dark:bg-gray-900">
		<!-- 1. Hero Section -->
		<section class="py-20">
			<div class="container mx-auto px-4 text-center">
				<h1
					class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
				>
					Giving items a second life, one click at a time.
				</h1>
				<p
					class="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"
				>
					Circa is a student-focused marketplace designed to make it easy to
					buy, sell, and give away items within your university community.
				</p>
				<!-- Illustration placeholder -->
				<div class="mt-8">
					<img
						src="/1.png"
						alt="Illustration of a person with items"
						class="mx-auto h-auto w-auto"
					/>
				</div>
			</div>
		</section>

		<!-- 2. Our Story (Split Layout) -->
		<section class="py-16 bg-white dark:bg-gray-800">
			<div class="container mx-auto px-4">
				<div class="grid md:grid-cols-2 gap-12 items-center">
					<!-- Illustration placeholder -->
					<div class="flex justify-end">
						<img src="/2.png" alt="unboxing" class="w-auto h-auto" />
					</div>
					<div>
						<h2 class="text-3xl font-bold text-gray-900 dark:text-white">
							Our Story
						</h2>
						<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
							Circa was born from a simple need. As two senior undergrad
							students on the brink of graduation, we found ourselves with a
							collection of items we cherished but couldn't take with us. We
							wanted to pass them on to fellow students who could give them a
							new home, not just throw them away.
						</p>
						<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
							Fueled by caffeine and a shared passion, we built Circa in just a
							<strong>two-week hackathon</strong>. What started as a small
							project is now a production-ready platform, ready to serve the
							community.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- 3. Our Mission -->
		<section class="py-16">
			<div class="container mx-auto px-4 text-center">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white">
					Our Mission
				</h2>
				<p
					class="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400"
				>
					The end of the semester is stressful enough. Figuring out what to do
					with your belongings shouldn't be. Our mission is to solve the
					perennial problem of giving or selling away items after graduation. We
					provide a streamlined, focused, and community-driven marketplace for
					students.
				</p>
				<div class="mt-12 grid sm:grid-cols-3 gap-8">
					<!-- Sustainable -->
					<div class="flex flex-col items-center">
						<div
							class="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-6 w-6"
							>
								<path
									d="M12 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
								/>
								<path
									d="M12 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"
								/>
								<path
									d="M12 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
								/>
							</svg>
						</div>
						<div class="mt-4">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
								Sustainable
							</h3>
							<p class="mt-2 text-gray-600 dark:text-gray-400">
								Reduce waste by passing items on.
							</p>
						</div>
					</div>
					<!-- Community-driven -->
					<div class="flex flex-col items-center">
						<div
							class="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-6 w-6"
							>
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
						</div>
						<div class="mt-4">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
								Community-Driven
							</h3>
							<p class="mt-2 text-gray-600 dark:text-gray-400">
								Built by students, for students.
							</p>
						</div>
					</div>
					<!-- Effortless -->
					<div class="flex flex-col items-center">
						<div
							class="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-6 w-6"
							>
								<path d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
						<div class="mt-4">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
								Effortless
							</h3>
							<p class="mt-2 text-gray-600 dark:text-gray-400">
								Sell or give away items in just a few clicks.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 4. Pain Points vs Circa -->
		<section class="py-16 bg-white dark:bg-gray-800">
			<div class="container mx-auto px-4">
				<h2
					class="text-3xl font-bold text-center text-gray-900 dark:text-white"
				>
					A Better Way to Share
				</h2>
				<p
					class="mt-4 max-w-2xl mx-auto text-center text-lg text-gray-600 dark:text-gray-400"
				>
					We've been there. The hassle of creating separate accounts or getting
					lost in chaotic group chats. Circa is our answer.
				</p>
				<div class="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					<!-- Problems -->
					<div class="p-6 rounded-lg border border-red-200 dark:border-red-800">
						<h3 class="text-xl font-semibold text-red-500">The Old Way</h3>
						<ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
							<li class="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-red-500"
								>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
								<span>Instagram resale accounts get messy.</span>
							</li>
							<li class="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-red-500"
								>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
								<span>Telegram groups are chaotic and distracting.</span>
							</li>
						</ul>
					</div>
					<!-- Solution -->
					<div
						class="p-6 rounded-lg border border-green-200 dark:border-green-800"
					>
						<h3 class="text-xl font-semibold text-green-500">The Circa Way</h3>
						<ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
							<li class="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-green-500"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
								<span>Effortless listings in a focused environment.</span>
							</li>
							<li class="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-green-500"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
								<span>Organized, distraction-free marketplace.</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- 5. Call to Action (CTA) -->
		<section class="py-20">
			<div class="container mx-auto px-4 text-center">
				<h2
					class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
				>
					Ready to join?
				</h2>
				<p
					class="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400"
				>
					We built Circa so you can focus on what matters: enjoying student
					life, not stressing about stuff.
				</p>
				<div class="mt-8">
					<NuxtLink
						to="/marketplace"
						class="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary/80 transition-colors"
					>
						Join Circa Today
					</NuxtLink>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
useHead({
	title: "About Circa",
	meta: [
		{
			name: "description",
			content:
				"Learn about the story and mission behind Circa, the marketplace for students.",
		},
	],
});
</script>
