<template>
	<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
		<!-- Header -->
		<header class="bg-white shadow-sm border-b">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center h-16">
					<div class="flex items-center">
						<h1 class="text-2xl font-bold text-slate-900">Circa</h1>
					</div>
					<nav class="hidden md:flex space-x-8">
						<a
							href="#"
							class="text-slate-600 hover:text-slate-900 transition-colors"
							>Home</a
						>
						<a
							href="#"
							class="text-slate-600 hover:text-slate-900 transition-colors"
							>About</a
						>
						<a
							href="#"
							class="text-slate-600 hover:text-slate-900 transition-colors"
							>Contact</a
						>
					</nav>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<!-- Hero Section -->
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
					Welcome to <span class="text-blue-600">Circa</span>
				</h2>
				<p class="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
					This is a foundation page. Built with Nuxt 3, Tailwind CSS, and modern
					web technologies.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
					>
						Get Started
					</button>
					<button
						class="border border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
					>
						Learn More
					</button>
				</div>
			</div>

			<!-- Features Grid -->
			<div class="grid md:grid-cols-3 gap-8 mb-16">
				<div class="bg-white p-6 rounded-xl shadow-sm border">
					<div
						class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
					>
						<svg
							class="w-6 h-6 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-slate-900 mb-2">
						Fast & Modern
					</h3>
					<p class="text-slate-600">
						Built with Nuxt 3 and Vue 3 for optimal performance and developer
						experience.
					</p>
				</div>

				<div class="bg-white p-6 rounded-xl shadow-sm border">
					<div
						class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"
					>
						<svg
							class="w-6 h-6 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
							></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-slate-900 mb-2">
						Responsive Design
					</h3>
					<p class="text-slate-600">
						Tailwind CSS ensures your application looks great on all devices and
						screen sizes.
					</p>
				</div>

				<div class="bg-white p-6 rounded-xl shadow-sm border">
					<div
						class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"
					>
						<svg
							class="w-6 h-6 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
							></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-slate-900 mb-2">
						Ready to Scale
					</h3>
					<p class="text-slate-600">
						Component-based architecture with shadcn/ui components for rapid
						development.
					</p>
				</div>
			</div>

			<!-- Technology Stack -->
			<div class="bg-white rounded-xl shadow-sm border p-8">
				<h3 class="text-2xl font-bold text-slate-900 mb-6 text-center">
					Technology Stack
				</h3>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div class="text-center">
						<div
							class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3"
						>
							<span class="text-2xl font-bold text-green-600">N</span>
						</div>
						<h4 class="font-medium text-slate-900">Nuxt 3</h4>
						<p class="text-sm text-slate-600">Full-stack framework</p>
					</div>
					<div class="text-center">
						<div
							class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"
						>
							<span class="text-2xl font-bold text-blue-600">V</span>
						</div>
						<h4 class="font-medium text-slate-900">Vue 3</h4>
						<p class="text-sm text-slate-600">Progressive framework</p>
					</div>
					<div class="text-center">
						<div
							class="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3"
						>
							<span class="text-2xl font-bold text-cyan-600">T</span>
						</div>
						<h4 class="font-medium text-slate-900">Tailwind</h4>
						<p class="text-sm text-slate-600">Utility-first CSS</p>
					</div>
					<div class="text-center">
						<div
							class="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3"
						>
							<span class="text-2xl font-bold text-slate-600">S</span>
						</div>
						<h4 class="font-medium text-slate-900">Shadcn/ui</h4>
						<p class="text-sm text-slate-600">Component library</p>
					</div>
				</div>
			</div>
		</main>

		<!-- Footer -->
		<footer class="bg-white border-t mt-20">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div class="text-center text-slate-600">
					<p>&copy; 2024 Circa. Built with ❤️ using modern web technologies.</p>
				</div>
			</div>
		</footer>
	</div>
</template>

<script setup>
// You can add any component logic here
// For example: reactive data, computed properties, methods, etc.
</script>
