import React, { useState } from 'react'
import { useServices } from '../ServiceContext'

interface Job {
  title: string
  company: string
  location: string
  tags: string[]
}

const exampleJobs = (keywords: string[] = []): Job[] => {
  const base: Job[] = [
    { title: 'Frontend Developer', company: 'TechNova', location: 'Remote', tags: ['React', 'JavaScript', 'UI'] },
    { title: 'Full-Stack Engineer', company: 'DataCraft', location: 'Paris', tags: ['Node', 'React', 'API'] },
    { title: 'React Developer', company: 'Skyline Labs', location: 'Berlin', tags: ['React', 'TypeScript', 'Tailwind'] },
    { title: 'Software Engineer', company: 'BlueOrbit', location: 'Remote', tags: ['Algorithms', 'Systems'] },
  ]
  if (!keywords.length) return base
  return base.filter(j => keywords.some(k => j.tags.join(' ').toLowerCase().includes(k)))
}

export default function JobMatcher() {
  const [text, setText] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const { addHistory } = useServices()

  const match = () => {
    const keys = text.toLowerCase().split(/[^a-zA-Z]+/).filter(Boolean)
    const uniq = Array.from(new Set(keys))
    const matched = exampleJobs(uniq)
    setJobs(matched)
    addHistory({ type: 'job-match', title: 'Job match', meta: { keywords: uniq.slice(0, 5), results: matched.length } })
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-foreground mb-6">Job Matcher</h1>
      <p className="text-muted-foreground mb-4">Paste your CV text to get tailored job suggestions (demo)</p>
      <textarea className="w-full min-h-[160px] rounded-xl border-2 border-gray-200 p-3 focus:border-primary-500" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your CV here..." />
      <button onClick={match} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold">Find jobs</button>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {jobs.map((j, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{j.title}</div>
                <div className="text-sm text-gray-600">{j.company} — {j.location}</div>
              </div>
              <button className="text-sm px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:text-primary-600">Apply</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {j.tags.map(t => <span key={t} className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
