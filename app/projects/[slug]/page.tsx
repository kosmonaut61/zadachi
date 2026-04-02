import Link from "next/link"
import { notFound } from "next/navigation"
import { AnimatedNoise } from "@/components/animated-noise"
import { getProjectBySlug } from "@/lib/projects"

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <main className="relative min-h-screen pb-20">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />
      <AnimatedNoise opacity={0.03} />

      <section className="relative z-10 min-h-screen py-24 pl-6 md:pl-28 pr-6 md:pr-12">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-[DotGothic16] text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <span>←</span> BACK TO HOME
          </Link>

          <header className="mt-12 border border-border/50 bg-black/20 p-8 md:p-10 rounded-sm">
            <p className="font-[DotGothic16] text-[11px] uppercase tracking-[0.3em] text-accent">{project.medium}</p>
            <h1 className="mt-5 font-[DotGothic16] text-5xl md:text-7xl tracking-tight">{project.title}</h1>
            <p className="mt-6 max-w-3xl font-[DotGothic16] text-lg text-white/70 leading-relaxed">{project.heroLine}</p>

            <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4 font-[DotGothic16] text-xs uppercase tracking-[0.14em]">
              <Meta label="Status" value={project.status} />
              <Meta label="Timeline" value={project.timeline} />
              <Meta label="Role" value={project.role} />
              <Meta label="Team" value={project.team} />
            </div>
          </header>

          <section className="mt-14 grid md:grid-cols-2 gap-8">
            <InfoBlock title="Overview" body={project.overview} />
            <div className="space-y-6">
              <InfoBlock title="Problem" body={project.problem} />
              <InfoBlock title="Goal" body={project.goal} />
            </div>
          </section>

          <section className="mt-14 grid md:grid-cols-2 gap-8">
            <ListBlock title="My Contribution" items={project.contribution} />
            <ListBlock title="Next Steps" items={project.nextSteps} />
          </section>

          <SectionTitle title="Process" />
          <div className="grid md:grid-cols-2 gap-4">
            {project.process.map((step) => (
              <Card key={step.title} title={step.title} body={step.body} />
            ))}
          </div>

          <SectionTitle title="Key Features" />
          <div className="grid md:grid-cols-3 gap-4">
            {project.features.map((feature) => (
              <Card key={feature.title} title={feature.title} body={feature.body} />
            ))}
          </div>

          <SectionTitle title="Challenges & Solutions" />
          <div className="space-y-4">
            {project.challenges.map((item, i) => (
              <article key={i} className="border border-border/50 bg-black/20 p-6 rounded-sm">
                <h3 className="font-[DotGothic16] text-sm uppercase tracking-[0.2em] text-accent">Challenge</h3>
                <p className="mt-2 font-[DotGothic16] text-white/80">{item.challenge}</p>
                <h3 className="mt-5 font-[DotGothic16] text-sm uppercase tracking-[0.2em] text-accent">Solution</h3>
                <p className="mt-2 font-[DotGothic16] text-white/80">{item.solution}</p>
                <h3 className="mt-5 font-[DotGothic16] text-sm uppercase tracking-[0.2em] text-accent">Outcome</h3>
                <p className="mt-2 font-[DotGothic16] text-white/80">{item.outcome}</p>
              </article>
            ))}
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <>
              <SectionTitle title="Key Metrics" />
              <div className="grid md:grid-cols-2 gap-4">
                {project.metrics.map((metric) => (
                  <MetricCard key={`${metric.label}-${metric.value}`} label={metric.label} value={metric.value} note={metric.note} />
                ))}
              </div>
            </>
          )}

          <section className="mt-14 grid md:grid-cols-2 gap-8">
            <ListBlock title="Results" items={project.results} />
            <article className="border border-border/50 bg-black/20 p-6 rounded-sm">
              <h2 className="font-[DotGothic16] text-sm uppercase tracking-[0.25em] text-accent">Tech Stack</h2>
              <StackGroup label="Frontend" items={project.stack.frontend} />
              <StackGroup label="Backend" items={project.stack.backend} />
              <StackGroup label="Tooling" items={project.stack.tooling} />
            </article>
          </section>
        </div>
      </section>
    </main>
  )
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="mt-14 mb-4 font-[DotGothic16] text-sm uppercase tracking-[0.25em] text-accent">{title}</h2>
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/40 rounded-sm px-3 py-3 bg-black/20">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-2 text-white/90 tracking-normal normal-case text-[11px] leading-relaxed">{value}</p>
    </div>
  )
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <article className="border border-border/50 bg-black/20 p-6 rounded-sm">
      <h2 className="font-[DotGothic16] text-sm uppercase tracking-[0.25em] text-accent">{title}</h2>
      <p className="mt-4 font-[DotGothic16] text-white/80 leading-relaxed">{body}</p>
    </article>
  )
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="border border-border/50 bg-black/20 p-6 rounded-sm">
      <h2 className="font-[DotGothic16] text-sm uppercase tracking-[0.25em] text-accent">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="font-[DotGothic16] text-white/80 leading-relaxed">
            <span className="text-accent mr-2">•</span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <article className="border border-border/50 bg-black/20 p-5 rounded-sm">
      <h3 className="font-[DotGothic16] text-[11px] uppercase tracking-[0.2em] text-accent">{title}</h3>
      <p className="mt-3 font-[DotGothic16] text-white/80 leading-relaxed text-sm">{body}</p>
    </article>
  )
}

function StackGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="font-[DotGothic16] text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="border border-border/50 px-2 py-1 text-[11px] font-[DotGothic16] text-white/80 bg-black/30 rounded-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function MetricCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <article className="border border-accent/30 bg-black/30 p-5 rounded-sm">
      <p className="font-[DotGothic16] text-[10px] uppercase tracking-[0.2em] text-accent-bright">{label}</p>
      <p className="mt-3 font-[DotGothic16] text-2xl md:text-3xl text-white">{value}</p>
      {note ? <p className="mt-2 font-[DotGothic16] text-sm text-white/60 leading-relaxed">{note}</p> : null}
    </article>
  )
}
