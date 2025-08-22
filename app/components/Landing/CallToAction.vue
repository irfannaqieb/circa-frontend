<template>
  <div
    class="py-16 md:py-24 bg-gradient-to-br from-muted to-secondary my-4 rounded-4xl"
  >
    <div class="max-w-4xl mx-auto px-6 text-center">
      <!-- Headline -->
      <h2 class="text-3xl md:text-5xl font-bold text-foreground mb-6">
        Join the Circa Waitlist to Empower Your Community!
      </h2>

      <!-- Form -->
      <form @submit.prevent="handleWaitlistSubmit" class="mb-6 flex justify-center gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="px-4 py-2 rounded-full border border-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-md"
          required
        />
        <Button
          type="submit"
          size="lg"
          class="px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          :disabled="isSubmitting || !isValidEmail"
        >
          {{ isSubmitting ? 'Submitting...' : 'Join Waitlist' }}
        </Button>
      </form>

      <!-- Subtext -->
      <p class="text-muted-foreground text-lg">
        Be among the first to shape Circa’s future with early access!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { useWaitlistStore } from '@/stores/waitlist.store'; // Adjust path if needed

const waitlist = useWaitlistStore();

const email = ref('');
const isSubmitting = ref(false);

// Basic email validation
const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));

const handleWaitlistSubmit = async () => {
  if (!isValidEmail.value) {
    alert('Please enter a valid email address.');
    return;
  }
  isSubmitting.value = true;
  try {
    const result = await waitlist.joinWaitlist(email.value);
    if (result.ok) {
      alert('Successfully joined the waitlist!');
      email.value = '';
    } else {
      alert(result.error || 'Failed to join waitlist.');
    }
  } catch (error) {
    console.error('Waitlist error:', error);
    alert('An unexpected error occurred.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

