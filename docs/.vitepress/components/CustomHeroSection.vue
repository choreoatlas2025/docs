<template>
  <section class="custom-hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">ChoreoAtlas CLI</span>
        </h1>
        <p class="hero-subtitle">Contract-as-Code Orchestration</p>
        <p class="hero-tagline">
          Map, Verify, Steer your choreography
        </p>

        <div class="hero-features">
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span>Service-level Semantic Verification</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span>Orchestration-level Temporal Verification</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span>Trace-driven Validation</span>
          </div>
        </div>

        <div class="hero-actions">
          <a href="/docs/guide/getting-started" class="btn-primary">
            Get Started →
          </a>
          <a href="https://github.com/choreoatlas2025/cli" class="btn-secondary" target="_blank">
            <svg class="github-icon" viewBox="0 0 16 16" width="16" height="16">
              <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View on GitHub
          </a>
        </div>

      </div>

      <div class="hero-media">
        <div class="media-frame">
          <transition name="fade" mode="out-in">
            <HeroAnimation v-if="currentDemo === 'animation'" key="animation" />
            <HeroInteractive v-else key="interactive" />
          </transition>
        </div>
        <div class="demo-selector">
          <button
            @click="currentDemo = 'animation'"
            :class="{ active: currentDemo === 'animation' }"
            class="demo-tab"
          >
            Animated View
          </button>
          <button
            @click="currentDemo = 'interactive'"
            :class="{ active: currentDemo === 'interactive' }"
            class="demo-tab"
          >
            Interactive Demo
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import HeroAnimation from './HeroAnimation.vue'
import HeroInteractive from './HeroInteractive.vue'

export default {
  name: 'CustomHeroSection',
  components: {
    HeroAnimation,
    HeroInteractive
  },
  data() {
    return {
      currentDemo: 'animation'
    }
  }
}
</script>

<style scoped>
.custom-hero {
  padding: 2.5rem 1rem;
  background: linear-gradient(180deg,
    rgba(248, 250, 252, 0.6) 0%,
    rgba(241, 245, 249, 0.7) 50%,
    rgba(248, 250, 252, 0.6) 100%
  );
  /* tighter height like original hero */
  min-height: 480px;
  display: flex;
  align-items: center;
}

.hero-container {
  --hero-media-h: 360px; /* consistent media height */
  max-width: 1024px; /* align with requested narrower width */
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr; /* balanced columns */
  gap: 1rem; /* tighter gap */
  align-items: center;
  justify-content: center;
  width: 100%;
}

.hero-content {
  padding: 0.5rem;
  max-width: 500px; /* control text line length */
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 1rem;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.hero-tagline {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0 0 2rem;
  max-width: 480px;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 2rem 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 44px;
  box-sizing: border-box;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.github-icon {
  width: 18px;
  height: 18px;
}

.demo-selector {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.25rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  width: fit-content;
}

.demo-tab {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  height: 36px;
  display: flex;
  align-items: center;
}

.demo-tab:hover {
  color: #1e293b;
}

.demo-tab.active {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.hero-media {
  padding: 1rem;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.media-frame {
  height: var(--hero-media-h);
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dark mode support */
:root.dark .custom-hero {
  background: linear-gradient(180deg,
    rgba(15, 23, 42, 0.7) 0%,
    rgba(30, 41, 59, 0.8) 50%,
    rgba(15, 23, 42, 0.7) 100%
  );
}

:root.dark .hero-subtitle {
  color: #e2e8f0;
}

:root.dark .hero-tagline {
  color: #94a3b8;
}

:root.dark .feature-item {
  color: #cbd5e1;
}

:root.dark .btn-secondary {
  background: #1e293b;
  color: #e2e8f0;
  border-color: #334155;
}

:root.dark .btn-secondary:hover {
  background: #334155;
}

:root.dark .demo-selector {
  background: #1e293b;
}

:root.dark .demo-tab {
  color: #94a3b8;
}

:root.dark .demo-tab:hover {
  color: #e2e8f0;
}

/* Responsive design */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }

  .hero-content {
    order: 2;
  }

  .hero-media {
    order: 1;
  }

  .media-controls {
    justify-content: center;
  }

  .hero-tagline {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-features {
    align-items: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .demo-selector {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 640px) {
  .custom-hero {
    padding: 2rem 1rem;
    min-height: 460px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .demo-selector {
    width: 100%;
  }

  .demo-tab {
    flex: 1;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .btn-primary:hover,
  .btn-secondary:hover {
    transform: none;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
