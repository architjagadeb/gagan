import { useEffect, useRef, useState } from 'react'
import { CheckDeliveryCta } from './CheckDeliveryCta'

const steps = [
  {
    n: '01',
    icon: 'route',
    title: 'Set Your Route',
    body: 'Drop a pickup and delivery point, or pick from a preset route. Gagan calculates distance and flight time instantly.',
  },
  {
    n: '02',
    icon: 'fact_check',
    title: 'Run the Check',
    body: 'Gagan checks your route against no-fly zones, drone battery and payload limits, and current weather conditions, all in seconds.',
  },
  {
    n: '03',
    icon: 'task_alt',
    title: 'Get Your Verdict',
    body: 'See a clear go or no-go decision with a full checklist. If the direct route fails, Gagan suggests a safe alternate path automatically.',
  },
]

export function HowItWorks() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="how-it-works" className="how-section">
      <div className="how-inner">
        <header className="how-header">
          <p className="how-eyebrow">How It Works</p>
          <h2 className="how-title">From route to verdict, in three steps</h2>
          <p className="how-sub">
            No manual checks, no guesswork. Just a clear answer before your drone
            takes off.
          </p>
        </header>

        <div ref={gridRef} className={`how-steps ${inView ? 'is-in' : ''}`}>
          <div className="how-connector" aria-hidden />
          {steps.map((step) => (
            <article key={step.n} className="how-step">
              <span className="how-step-num">{step.n}</span>
              <span className="how-step-icon material-symbols-rounded" aria-hidden>
                {step.icon}
              </span>
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-body">{step.body}</p>
            </article>
          ))}
        </div>

        <div className="how-cta">
          <p className="how-cta-copy">Ready to check your first route?</p>
          <CheckDeliveryCta />
        </div>
      </div>
    </section>
  )
}
