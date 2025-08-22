<template>
	<div class="py-16 md:py-24">
		<div class="max-w-[1550px] mx-auto px-6">
			<!-- Section Header -->
			<div class="text-center mb-12">
				<Badge variant="secondary" class="mb-6"> Student Testimonials </Badge>
				<h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
					By students, for students
				</h2>
				<p class="text-lg text-slate-600 max-w-2xl mx-auto">
					See what students are saying about their experience with our community
					sharing platform.
				</p>
			</div>

			<!-- Carousel -->
			<div class="max-w-4xl mx-auto relative">
				<Carousel
					class="w-full"
					:opts="{
						align: 'center',
						loop: true,
						containScroll: 'trimSnaps',
						startIndex: 1,
						skipSnaps: false,
						inViewThreshold: 0.7,
					}"
				>
					<CarouselContent class="flex items-center" data-carousel-content>
						<!-- Testimonial 1 - Baby Blue -->
						<CarouselItem class="basis-5/6 md:basis-3/4 lg:basis-4/5 pl-2 pr-2">
							<Card class="bg-blue-50 border-blue-100 h-full">
								<CardContent class="p-6 text-center space-y-4">
									<!-- University Logo -->
									<div
										class="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center p-2 border border-blue-200"
									>
										<img
											src="/yonsei logo.png"
											alt="Yonsei University"
											class="w-full h-full object-contain"
										/>
									</div>

									<!-- Review -->
									<div class="space-y-3">
										<div class="flex justify-center mb-2">
											<div class="flex space-x-1">
												<Star
													v-for="i in 5"
													:key="i"
													class="w-4 h-4 fill-yellow-400 text-yellow-400"
												/>
											</div>
										</div>
										<p class="text-slate-700 italic leading-relaxed">
											"Got my System Design Prep book for free from my senior!
											Gotta say it came in clutch in the last minute. Now
											chasing the bag at Google! All thanks to Circa!"
										</p>
									</div>

									<!-- User Info -->
									<div class="pt-4 border-t border-blue-200">
										<div
											class="w-12 h-12 mx-auto bg-blue-300 rounded-full flex items-center justify-center mb-3"
										>
											<User class="w-6 h-6 text-blue-700" />
										</div>
										<h4 class="font-semibold text-slate-900">Irfan B.</h4>
										<p class="text-sm text-slate-600">
											CS Senior at Yonsei University
										</p>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>

						<!-- Testimonial 2 - Soft Green -->
						<CarouselItem class="basis-5/6 md:basis-3/4 lg:basis-4/5 pl-2 pr-2">
							<Card class="bg-green-50 border-green-100 h-full">
								<CardContent class="p-6 text-center space-y-4">
									<!-- University Logo -->
									<div
										class="w-16 h-16 mx-auto bg-green-200 rounded-full flex items-center justify-center"
									>
										<GraduationCap class="w-8 h-8 text-green-600" />
									</div>

									<!-- Review -->
									<div class="space-y-3">
										<div class="flex justify-center mb-2">
											<div class="flex space-x-1">
												<Star
													v-for="i in 5"
													:key="i"
													class="w-4 h-4 fill-yellow-400 text-yellow-400"
												/>
											</div>
										</div>
										<p class="text-slate-700 italic leading-relaxed">
											"Amazing community! I've met so many great people through
											lending and borrowing. It's made my college experience so
											much better."
										</p>
									</div>

									<!-- User Info -->
									<div class="pt-4 border-t border-green-200">
										<div
											class="w-12 h-12 mx-auto bg-green-300 rounded-full flex items-center justify-center mb-3"
										>
											<User class="w-6 h-6 text-green-700" />
										</div>
										<h4 class="font-semibold text-slate-900">Muhammad Ali</h4>
										<p class="text-sm text-slate-600">Student at Korea University</p>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>

						<!-- Testimonial 3 - Soft Purple/Pink -->
						<CarouselItem class="basis-5/6 md:basis-3/4 lg:basis-4/5 pl-2 pr-2">
							<Card class="bg-purple-50 border-purple-100 h-full">
								<CardContent class="p-6 text-center space-y-4">
									<!-- University Logo -->
									<div
										class="w-16 h-16 mx-auto bg-purple-200 rounded-full flex items-center justify-center"
									>
										<img
											src="/hanyang logo.png"
											alt="Hanyang University"
											class="w-full h-full object-contain"
										/>
									</div>

									<!-- Review -->
									<div class="space-y-3">
										<div class="flex justify-center mb-2">
											<div class="flex space-x-1">
												<Star
													v-for="i in 5"
													:key="i"
													class="w-4 h-4 fill-yellow-400 text-yellow-400"
												/>
											</div>
										</div>
										<p class="text-slate-700 italic leading-relaxed">
											"I was able to successfully sell my old tech gear without the stress
											of having to use translation applications"
										</p>
									</div>

									<!-- User Info -->
									<div class="pt-4 border-t border-purple-200">
										<div
											class="w-12 h-12 mx-auto bg-purple-300 rounded-full flex items-center justify-center mb-3"
										>
											<User class="w-6 h-6 text-purple-700" />
										</div>
										<h4 class="font-semibold text-slate-900">Amzar Syahmi</h4>
										<p class="text-sm text-slate-600">Student at Hanyang University</p>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>
					</CarouselContent>

					<!-- Navigation -->
					<CarouselPrevious class="left-0" />
					<CarouselNext class="right-0" />
				</Carousel>
			</div>
		</div>
	</div>
</template>

<script setup>
// Vue imports not needed for this component
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { GraduationCap, Star, User } from "lucide-vue-next";

// Simple carousel with edge previews - no JavaScript needed
</script>

<style scoped>
/* Clean carousel with edge previews */
:deep(.embla__viewport) {
	overflow: visible;
}

:deep(.embla__container) {
	display: flex;
	align-items: center;
}

:deep(.embla__slide) {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
}

/* Add padding to show edge previews */
:deep([data-carousel-content]) {
	padding: 0 1rem;
}

/* Smooth transitions */
.carousel-item {
	transition: all 0.3s ease-in-out;
}
</style>
