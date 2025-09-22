import DefaultTheme from 'vitepress/theme'
import HeroAnimation from '../components/HeroAnimation.vue'
import HeroInteractive from '../components/HeroInteractive.vue'
import CustomHeroSection from '../components/CustomHeroSection.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HeroAnimation', HeroAnimation)
    app.component('HeroInteractive', HeroInteractive)
    app.component('CustomHeroSection', CustomHeroSection)
  }
}