<template>
	<div
		class="container mx-auto max-w-2xl px-4 py-12 text-center md:px-6 lg:py-16"
	>
		<h1
			class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl"
		>
			We’re here to help
		</h1>
		<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
			Circa is built for students, by students. Together we can make it better.
		</p>

		<div class="mt-12 space-y-8">
			<!-- Bug Reporting -->
			<div>
				<h2 class="flex items-center justify-center text-2xl font-semibold">
					<span class="mr-2">🐞</span> Found a Bug?
				</h2>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Let us know on our GitHub Issues page so we can fix it.
				</p>
				<a
					href="#"
					class="mt-4 inline-block text-blue-500 underline hover:text-blue-600"
				>
					Report a Bug
				</a>
			</div>

			<!-- Open Source Contribution -->
			<div>
				<h2 class="flex items-center justify-center text-2xl font-semibold">
					<Icon name="lucide:github" class="mr-2 h-6 w-6" />
					Contribute to Circa
				</h2>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Our project is open source. We welcome all contributions!
				</p>
				<a
					href="https://github.com/irfannaqieb/circa-frontend"
					target="_blank"
					class="mt-4 inline-block text-blue-500 underline hover:text-blue-600"
				>
					Contribute on GitHub
				</a>
			</div>

			<!-- Contact Section -->
			<div>
				<h2 class="flex items-center justify-center text-2xl font-semibold">
					<span class="mr-2">✉️</span> Need direct support?
				</h2>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					For any inquiries or feedback, feel free to reach out.
				</p>
				<a
					href="mailto:irfannaqieb@gmail.com"
					class="mt-4 inline-block text-blue-500 underline hover:text-blue-600"
				>
					irfannaqieb@gmail.com
				</a>
			</div>
		</div>

		<div class="mt-16 text-gray-600 dark:text-gray-400">
			<p>Thanks for supporting Circa!</p>
		</div>
	</div>
</template>
