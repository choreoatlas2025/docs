<template>
  <div class="hero-animation" :class="{ 'reduced-motion': reducedMotion }">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 450"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Service orchestration validation diagram"
    >
      <!-- Background Grid -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1"/>
        </pattern>

        <!-- Gradient for nodes -->
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.9" />
        </linearGradient>

        <!-- Success gradient -->
        <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#22c55e;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#16a34a;stop-opacity:0.9" />
        </linearGradient>

        <!-- Fail gradient -->
        <linearGradient id="failGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#dc2626;stop-opacity:0.9" />
        </linearGradient>

        <!-- Drop shadow filter -->
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feFlood flood-color="#000000" flood-opacity="0.15"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Pulse animation marker -->
        <circle id="pulseMarker" r="3" fill="#3b82f6">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </defs>

      <!-- Grid background -->
      <rect width="800" height="450" fill="url(#grid)" />

      <!-- Service Orchestration DAG -->
      <g id="dag">
        <!-- Connections (CSS animated) -->
        <path d="M 150 150 L 250 150" class="link anim-dash" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,3" opacity="0.5" />
        <path d="M 350 150 L 450 150" class="link anim-dash" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,3" opacity="0.5" />
        <path d="M 550 150 L 650 150" class="link anim-dash" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,3" opacity="0.5" />

        <!-- Flow particle (CSS animated translateX) -->
        <g class="particle">
          <circle r="2" fill="#3b82f6" transform="translate(150,150)" />
        </g>

        <!-- Service Nodes -->
        <g id="node1" transform="translate(100, 150)">
          <rect x="-40" y="-25" width="80" height="50" rx="8" fill="url(#nodeGradient)" filter="url(#shadow)"/>
          <text x="0" y="5" text-anchor="middle" fill="white" font-size="12" font-weight="500">Gateway</text>
        </g>

        <g id="node2" transform="translate(300, 150)">
          <rect x="-45" y="-25" width="90" height="50" rx="8" fill="url(#nodeGradient)" filter="url(#shadow)"/>
          <text x="0" y="5" text-anchor="middle" fill="white" font-size="12" font-weight="500">Create Order</text>
        </g>

        <g id="node3" transform="translate(500, 150)">
          <rect x="-40" y="-25" width="80" height="50" rx="8" fill="url(#nodeGradient)" filter="url(#shadow)"/>
          <text x="0" y="5" text-anchor="middle" fill="white" font-size="12" font-weight="500">Payment</text>
        </g>

        <g id="node4" transform="translate(700, 150)">
          <rect x="-40" y="-25" width="80" height="50" rx="8" fill="url(#nodeGradient)" filter="url(#shadow)"/>
          <text x="0" y="5" text-anchor="middle" fill="white" font-size="12" font-weight="500">Ship</text>
        </g>

        <!-- Status Badges (CSS fade-in with delays) -->
        <g id="badge1" transform="translate(100, 115)">
          <rect x="-20" y="-10" width="40" height="20" rx="10" fill="url(#successGradient)" filter="url(#shadow)" class="fade-in" style="--delay: .5s"/>
          <text x="0" y="4" text-anchor="middle" fill="white" font-size="10" font-weight="600" class="fade-in" style="--delay: .5s">PASS</text>
        </g>

        <g id="badge2" transform="translate(300, 115)">
          <rect x="-20" y="-10" width="40" height="20" rx="10" fill="url(#successGradient)" filter="url(#shadow)" class="fade-in" style="--delay: 1s"/>
          <text x="0" y="4" text-anchor="middle" fill="white" font-size="10" font-weight="600" class="fade-in" style="--delay: 1s">PASS</text>
        </g>

        <g id="badge3" transform="translate(500, 115)">
          <!-- Fail underlay -->
          <rect x="-20" y="-10" width="40" height="20" rx="10" fill="url(#failGradient)" filter="url(#shadow)"/>
          <!-- Success overlay fades in -->
          <rect x="-20" y="-10" width="40" height="20" rx="10" fill="url(#successGradient)" filter="url(#shadow)" class="fade-in" style="--delay: 1.5s"/>
          <text x="0" y="4" text-anchor="middle" fill="white" font-size="10" font-weight="600" class="fade-in" style="--delay: 1.5s">PASS</text>
        </g>

        <g id="badge4" transform="translate(700, 115)">
          <rect x="-20" y="-10" width="40" height="20" rx="10" fill="url(#successGradient)" filter="url(#shadow)" class="fade-in" style="--delay: 2s"/>
          <text x="0" y="4" text-anchor="middle" fill="white" font-size="10" font-weight="600" class="fade-in" style="--delay: 2s">PASS</text>
        </g>
      </g>

      <!-- Trace Timeline -->
      <g id="timeline" transform="translate(100, 280)">
        <text x="0" y="-10" font-size="12" fill="#64748b">Trace Timeline</text>

        <!-- Timeline background -->
        <rect x="0" y="0" width="600" height="40" rx="4" class="timeline-bg" fill="#f1f5f9" opacity="0.5"/>

        <!-- Timeline segments (CSS grow-x with delays) -->
        <g class="seg grow-x" style="--delay: .5s">
          <rect x="0" y="10" width="100" height="20" fill="#22c55e" opacity="0.7"/>
        </g>
        <g class="seg grow-x" style="--delay: 1s">
          <rect x="100" y="10" width="150" height="20" fill="#22c55e" opacity="0.7"/>
        </g>
        <g class="seg grow-x" style="--delay: 1.5s">
          <rect x="250" y="10" width="120" height="20" fill="#f59e0b" opacity="0.7"/>
        </g>
        <g class="seg grow-x" style="--delay: 2s">
          <rect x="370" y="10" width="180" height="20" fill="#22c55e" opacity="0.7"/>
        </g>

        <!-- Time markers (CSS pulse) -->
        <g id="markers">
          <circle cx="0" cy="20" r="3" fill="#3b82f6" class="pulse"/>
          <circle cx="100" cy="20" r="3" fill="#3b82f6" class="pulse"/>
          <circle cx="250" cy="20" r="3" fill="#3b82f6" class="pulse"/>
          <circle cx="370" cy="20" r="3" fill="#3b82f6" class="pulse"/>
          <circle cx="550" cy="20" r="3" fill="#3b82f6" class="pulse"/>
        </g>

        <!-- Timeline labels -->
        <text x="570" y="25" font-size="10" fill="#64748b">100ms</text>
      </g>

      <!-- Validation Report Indicator -->
      <g id="report" transform="translate(500, 350)">
        <rect x="0" y="0" width="200" height="60" rx="8" fill="white" stroke="#e2e8f0" stroke-width="1" filter="url(#shadow)" class="fade-in" style="--delay: 2.5s"/>
        <text x="100" y="25" text-anchor="middle" font-size="12" fill="#475569" font-weight="500" class="fade-in" style="--delay: 2.5s">Report Generated</text>
        <text x="100" y="45" text-anchor="middle" font-size="11" fill="#94a3b8" class="fade-in" style="--delay: 2.5s">validation-report.html</text>
      </g>

      <!-- Contract Verification Label -->
      <g id="label" transform="translate(100, 50)">
        <text x="0" y="0" font-size="14" fill="#1e293b" font-weight="600">Contract-as-Code Verification</text>
        <text x="0" y="20" font-size="12" fill="#64748b">Service → Orchestration → Temporal</text>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'HeroAnimation',
  data() {
    return {
      reducedMotion: false
    }
  },
  mounted() {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });
  }
}
</script>

<style scoped>
.hero-animation {
  width: 100%;
  height: var(--hero-media-h, 360px);
  min-height: var(--hero-media-h, 360px);
  border-radius: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  /* subtle grid color */
  color: #64748b;
}

/* CSS animations (Safari-friendly) */
.anim-dash { animation: dash 2s linear infinite; }
@keyframes dash { to { stroke-dashoffset: -8; } }

.fade-in { opacity: 0; animation: fadeIn .8s ease forwards; animation-delay: var(--delay, 0s); }
@keyframes fadeIn { to { opacity: 1; } }

.grow-x { transform-origin: left center; transform: scaleX(0); animation: growX .5s ease forwards; animation-delay: var(--delay, 0s); }
@keyframes growX { to { transform: scaleX(1); } }

.pulse { animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

.particle { animation: moveParticle 3s linear infinite; }
@keyframes moveParticle { from { transform: translate(150px,150px); } to { transform: translate(650px,150px); } }

.hero-animation.reduced-motion svg * {
  animation: none !important;
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

.hero-animation.reduced-motion .grow-x { transform: scaleX(1) !important; }
.hero-animation.reduced-motion .fade-in { opacity: 1 !important; }
.hero-animation.reduced-motion .anim-dash { animation: none !important; }
.hero-animation.reduced-motion .pulse { animation: none !important; }

@media (max-width: 768px) {
  .hero-animation {
    height: 300px;
    min-height: 300px;
  }
}

/* Dark theme adjustments */
:root.dark .hero-animation {
  background: linear-gradient(135deg, #0b1220 0%, #0f172a 100%);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  color: #334155; /* grid color darker */
}

/* Timeline background fill overrides for themes */
.hero-animation .timeline-bg { fill: #f1f5f9; opacity: .5; }
:root.dark .hero-animation .timeline-bg { fill: #0b1220; opacity: .7; }
</style>
