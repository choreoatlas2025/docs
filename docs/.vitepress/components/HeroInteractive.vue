<template>
  <div class="hero-interactive">
    <div class="demo-container">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 450"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Interactive validation demo"
      >
        <!-- Reuse defs from HeroAnimation -->
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1"/>
          </pattern>

          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.9" />
          </linearGradient>

          <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#22c55e;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#16a34a;stop-opacity:0.9" />
          </linearGradient>

          <linearGradient id="failGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#dc2626;stop-opacity:0.9" />
          </linearGradient>

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
        </defs>

        <!-- Grid background -->
        <rect width="800" height="450" fill="url(#grid)" />

        <!-- Service Orchestration DAG -->
        <g id="dag">
          <!-- Connections -->
          <path
            d="M 150 150 L 250 150"
            :stroke="connectionColors[0]"
            stroke-width="2"
            :stroke-dasharray="isValidating ? '5,3' : 'none'"
            :opacity="connectionOpacity[0]"
            :class="{ 'animating': isValidating }"
          />
          <path
            d="M 350 150 L 450 150"
            :stroke="connectionColors[1]"
            stroke-width="2"
            :stroke-dasharray="isValidating ? '5,3' : 'none'"
            :opacity="connectionOpacity[1]"
            :class="{ 'animating': isValidating }"
          />
          <path
            d="M 550 150 L 650 150"
            :stroke="connectionColors[2]"
            stroke-width="2"
            :stroke-dasharray="isValidating ? '5,3' : 'none'"
            :opacity="connectionOpacity[2]"
            :class="{ 'animating': isValidating }"
          />

          <!-- Service Nodes -->
          <g v-for="(node, idx) in nodes" :key="idx" :transform="`translate(${node.x}, 150)`">
            <rect
              :x="-node.width/2"
              y="-25"
              :width="node.width"
              height="50"
              rx="8"
              fill="url(#nodeGradient)"
              filter="url(#shadow)"
              :opacity="node.opacity"
            />
            <text x="0" y="5" text-anchor="middle" fill="white" font-size="12" font-weight="500">
              {{ node.name }}
            </text>
          </g>

          <!-- Status Badges -->
          <g v-for="(node, idx) in nodes" :key="'badge-' + idx" :transform="`translate(${node.x}, 115)`">
            <rect
              v-if="node.status !== 'pending'"
              x="-20"
              y="-10"
              width="40"
              height="20"
              rx="10"
              :fill="node.status === 'pass' ? 'url(#successGradient)' : 'url(#failGradient)'"
              filter="url(#shadow)"
            />
            <text
              v-if="node.status !== 'pending'"
              x="0"
              y="4"
              text-anchor="middle"
              fill="white"
              font-size="10"
              font-weight="600"
            >
              {{ node.status === 'pass' ? 'PASS' : 'FAIL' }}
            </text>
          </g>
        </g>

        <!-- Issue Counter -->
        <g id="issues" transform="translate(100, 250)">
          <rect x="0" y="0" width="180" height="50" rx="8" fill="white" stroke="#e2e8f0" stroke-width="1" filter="url(#shadow)"/>
          <text x="90" y="25" text-anchor="middle" font-size="14" :fill="issueCount > 0 ? '#ef4444' : '#22c55e'" font-weight="600">
            {{ issueCount }} {{ issueCount === 1 ? 'issue' : 'issues' }} detected
          </text>
          <text x="90" y="42" text-anchor="middle" font-size="11" fill="#94a3b8">
            {{ validationState }}
          </text>
        </g>

        <!-- Command Line Preview -->
        <g id="terminal" transform="translate(350, 250)" v-if="showTerminal">
          <rect x="0" y="0" width="350" height="50" rx="8" fill="#1e293b" filter="url(#shadow)"/>
          <text x="10" y="30" font-family="monospace" font-size="11" fill="#22d3ee">
            $ choreoatlas validate --spec flow.yaml
          </text>
        </g>

        <!-- Report Status -->
        <g id="report" transform="translate(500, 350)" v-if="reportReady">
          <rect x="0" y="0" width="200" height="60" rx="8" fill="white" stroke="#22c55e" stroke-width="2" filter="url(#shadow)"/>
          <text x="100" y="25" text-anchor="middle" font-size="12" fill="#475569" font-weight="500">
            ✓ Report Generated
          </text>
          <text x="100" y="45" text-anchor="middle" font-size="11" fill="#94a3b8">
            validation-report.html
          </text>
        </g>
      </svg>

      <!-- Control Buttons (overlay, fixed position) -->
      <div class="controls">
        <button
          v-if="!validationComplete"
          @click="runValidation"
          :disabled="isValidating"
          class="btn-primary btn-small"
        >
          {{ buttonText }}
        </button>
        <a
          v-if="reportReady"
          :href="reportSampleHref"
          target="_blank"
          class="btn-link"
          aria-label="Open sample validation report"
        >
          View Sample Report →
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroInteractive',
  data() {
    return {
      nodes: [
        { name: 'Gateway', x: 100, width: 80, status: 'fail', opacity: 1 },
        { name: 'Create Order', x: 300, width: 90, status: 'fail', opacity: 1 },
        { name: 'Payment', x: 500, width: 80, status: 'fail', opacity: 1 },
        { name: 'Ship', x: 700, width: 80, status: 'pending', opacity: 0.5 }
      ],
      connectionColors: ['#ef4444', '#ef4444', '#94a3b8'],
      connectionOpacity: [0.7, 0.7, 0.3],
      isValidating: false,
      validationComplete: false,
      showTerminal: false,
      reportReady: false,
      issueCount: 3,
      validationState: 'Click to validate',
      buttonText: 'Run Validation',
      reportSampleHref: '/docs/samples/validation-report.html'
    }
  },
  methods: {
    async runValidation() {
      if (this.isValidating) return;

      this.isValidating = true;
      this.buttonText = 'Validating...';
      this.showTerminal = true;
      this.validationState = 'Running validation...';

      // Simulate validation process
      const steps = [
        { delay: 500, action: () => {
          this.nodes[0].status = 'pass';
          this.connectionColors[0] = '#22c55e';
          this.issueCount = 2;
        }},
        { delay: 1000, action: () => {
          this.nodes[1].status = 'pass';
          this.connectionColors[1] = '#22c55e';
          this.issueCount = 1;
        }},
        { delay: 1500, action: () => {
          this.nodes[2].status = 'pass';
          this.connectionColors[2] = '#22c55e';
          this.connectionOpacity[2] = 0.7;
          this.issueCount = 0;
        }},
        { delay: 2000, action: () => {
          this.nodes[3].status = 'pass';
          this.nodes[3].opacity = 1;
          this.validationState = 'All checks passed!';
        }},
        { delay: 2500, action: () => {
          this.reportReady = true;
          this.isValidating = false;
          this.validationComplete = true;
        }}
      ];

      for (const step of steps) {
        await this.delay(step.delay);
        step.action();
      }
    },

    reset() {
      this.nodes = [
        { name: 'Gateway', x: 100, width: 80, status: 'fail', opacity: 1 },
        { name: 'Create Order', x: 300, width: 90, status: 'fail', opacity: 1 },
        { name: 'Payment', x: 500, width: 80, status: 'fail', opacity: 1 },
        { name: 'Ship', x: 700, width: 80, status: 'pending', opacity: 0.5 }
      ];
      this.connectionColors = ['#ef4444', '#ef4444', '#94a3b8'];
      this.connectionOpacity = [0.7, 0.7, 0.3];
      this.isValidating = false;
      this.validationComplete = false;
      this.showTerminal = false;
      this.reportReady = false;
      this.issueCount = 3;
      this.validationState = 'Click to validate';
      this.buttonText = 'Run Validation';
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
}
</script>

<style scoped>
.hero-interactive {
  width: 100%;
  padding: 1rem;
}

.demo-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 1rem;
  padding: 1rem; /* align with animation padding */
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  height: var(--hero-media-h, 360px);
  overflow: hidden;
  position: relative;
}

.controls {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
  display: flex;
  gap: .75rem;
  align-items: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-small { padding: .5rem .9rem; font-size: .9rem; }

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
}

.btn-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.btn-link:hover {
  color: #1e40af;
}

.animating {
  animation: dash 2s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -8;
  }
}

@media (max-width: 768px) {
  .demo-container {
    padding: 1rem;
    height: 300px;
  }

  .controls {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 250px;
  }
}

/* Dark theme for interactive container */
:root.dark .hero-interactive .demo-container {
  background: linear-gradient(135deg, #0b1220 0%, #0f172a 100%);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}
</style>
