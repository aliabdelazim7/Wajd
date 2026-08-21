import { Component, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './v2/App.jsx'
import { AppProvider } from './v2/context/AppContext.jsx'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

class AppErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Wajd application render error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main dir="rtl" className="min-h-screen bg-[#070707] px-6 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gold-500">WAJD CMS</p>
          <h1 className="mb-4 font-serif text-3xl">تعذر تحميل هذه الصفحة مؤقتاً</h1>
          <p className="mb-8 text-sm leading-7 text-white/55">حدث خطأ غير متوقع أثناء عرض البيانات. أعد تحميل الصفحة، وإذا استمرت المشكلة تواصل مع فريق وجد.</p>
          <button type="button" onClick={() => window.location.reload()} className="rounded-xl bg-gold-500 px-6 py-3 font-bold text-obsidian-950">إعادة تحميل الصفحة</button>
        </div>
      </main>
    )
  }
}

const Root = () => {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothWheel: !isMobile, // Disable smooth scroll on mobile for better native performance
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    // Use GSAP ticker for a single unified animation loop
    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(raf);

    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy()
    }
  }, [])

  return (
    <StrictMode>
      <AppErrorBoundary>
        <AppProvider>
          <App />
        </AppProvider>
      </AppErrorBoundary>
    </StrictMode>
  )
}

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(<Root />);
}
