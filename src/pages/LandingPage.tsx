import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HowItWorks } from '../components/HowItWorks'

export function LandingPage() {
  useEffect(() => {
    if (window.location.hash !== '#how-it-works') return
    const id = window.setTimeout(() => {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
    return () => window.clearTimeout(id)
  }, [])
  return (
    <div className="landing-page">
      <section className="landing-hero-screen">
        <div className="landing-bg" aria-hidden />

        <div className="landing-hero">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow">
              Pre-flight feasibility, checked in seconds
            </p>

            <h1 className="landing-title">Know before it flies</h1>

            <p className="landing-sub">
              Gagan checks your drone delivery route against{' '}
              <span className="landing-tag">no-fly zones</span>, battery limits,
              and weather, then gives you an instant go or no-go verdict, with a
              safe <span className="landing-tag">alternate route</span> if you
              need one.
            </p>
          </div>

          <div className="landing-cards">
            <Link to="/planner" className="landing-card">
              <span className="landing-card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill="white"/>
                  <path d="M9 21V12h6v9" fill="white"/>
                </svg>
              </span>
              <span className="landing-card-copy">
                <p className="landing-card-title">Route Planner</p>
                <p className="landing-card-sub">
                  Set a pickup and drop-off in seconds
                </p>
              </span>
              <span className="landing-card-chevron" aria-hidden>
                ›
              </span>
            </Link>

            <Link to="/planner" className="landing-card">
              <span className="landing-card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" fill="white"/>
                  <circle cx="12" cy="12" r="3.5" fill="white"/>
                </svg>
              </span>
              <span className="landing-card-copy">
                <p className="landing-card-title">Instant Verdict</p>
                <p className="landing-card-sub">
                  Go or no-go, with every check explained
                </p>
              </span>
              <span className="landing-card-chevron" aria-hidden>
                ›
              </span>
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />
    </div>
  )
}
