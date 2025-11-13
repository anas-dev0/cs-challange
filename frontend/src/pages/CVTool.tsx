import React, { useRef, useState, DragEvent, ChangeEvent } from 'react'
import { FaUpload, FaCheckCircle, FaRegLightbulb } from 'react-icons/fa'
import API from '@/api'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ATSScore from './ATSScore'
import OverallScore from './OverallScore'
import ApplyChanges from './ApplyChanges'
import CVPreview from './CVPreview'
import CVStrengthIndicator from '@/components/CVStrengthIndicator'
import BackgroundShader from '@/components/BackgroundShader'

type Step = 1 | 2 | 3 | 4 | 5

type AnalyzeResponse = {
  summary?: string
  status?: 'success' | 'error'
  structured_cv?: any
  original_file?: {
    filename: string
    content_type: string
    data: string
    size: number
  } | null
  file_info?: any
  gemini_analysis?: any
  error?: string
}

export default function CVTool() {
  // Step flow state
  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showATS, setShowATS] = useState(false)
  const [showOverall, setShowOverall] = useState(false)
  const [appliedChanges, setAppliedChanges] = useState<Set<number>>(new Set())
  const [cvMarkdown, setCvMarkdown] = useState<string>('')

  // Inputs
  const [file, setFile] = useState<File | null>(null)
  const [cvText, setCvText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [useGemini, setUseGemini] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  // Results
  const [response, setResponse] = useState<AnalyzeResponse | null>(null)
  const [showRaw, setShowRaw] = useState(false)

  // Handlers
  const onFile = (f: File | undefined) => {
    if (!f) return
    setFile(f)
    // optional convenience: if plain text file, preload to textarea
    if (f.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = () => setCvText(String(reader.result || ''))
      reader.readAsText(f)
    }
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    onFile(e.dataTransfer.files?.[0])
  }

  const onBrowse = () => fileInputRef.current?.click()

  const resetAll = () => {
    setStep(1)
    setIsSubmitting(false)
    setError(null)
    setFile(null)
    setCvText('')
    setJobDescription('')
    setUseGemini(true)
    setResponse(null)
    setShowRaw(false)
  }

  const submitAnalysis = async () => {
    setError(null)
    if (!file && !cvText.trim()) {
      setError('Please upload a CV file or paste CV text to proceed.')
      setStep(1)
      return
    }

    try {
      setIsSubmitting(true)
      setStep(2) // progress page

      const form = new FormData()
      if (file) form.append('cv_file', file)
      if (cvText.trim()) form.append('cv_text', cvText.trim())
      form.append('job_description', jobDescription || '')
      form.append('use_gemini', String(useGemini))

      const { data } = await API.post<AnalyzeResponse>('/analyze-structured', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (data?.error) {
        setError(data.error)
        setIsSubmitting(false)
        setStep(1)
        return
      }

      setResponse(data)
      setIsSubmitting(false)
      setStep(3)
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Failed to analyze CV. Please try again.'
      setError(msg)
      setIsSubmitting(false)
      setStep(1)
    }
  }

  const applySuggestion = async (suggestion: any, index: number) => {
    if (!response?.structured_cv) return
    try {
      const { data } = await API.post('/apply-suggestion', {
        structured_cv: response.structured_cv,
        suggestion,
      })
      if (data?.status === 'success') {
        setResponse(prev => ({ ...(prev as AnalyzeResponse), structured_cv: data.updated_cv }))
        setAppliedChanges(prev => new Set(prev).add(index))
        // Convert updated CV to markdown
        convertCvToMarkdown(data.updated_cv)
      }
    } catch (e) {
      console.error('Apply suggestion failed', e)
    }
  }

  const applyAllSuggestions = async () => {
    const suggestions = response?.gemini_analysis?.suggestions || []
    for (let i = 0; i < suggestions.length; i++) {
      if (!appliedChanges.has(i)) {
        await applySuggestion(suggestions[i], i)
      }
    }
  }

  const convertCvToMarkdown = (cvData: any) => {
    // Convert structured CV to markdown format
    let markdown = ''
    
    const name = cvData?.name || cvData?.full_name || cvData?.personal_info?.name
    const title = cvData?.title || cvData?.headline
    const summary = cvData?.summary || cvData?.objective || cvData?.profile
    const skills = cvData?.skills || cvData?.technical_skills || []
    const experience = cvData?.experience || cvData?.work_experience || []
    const education = cvData?.education || []
    const projects = cvData?.projects || []
    
    if (name) markdown += `# ${name}\n\n`
    if (title) markdown += `**${title}**\n\n`
    if (summary) markdown += `## Summary\n\n${summary}\n\n`
    
    if (skills?.length > 0) {
      markdown += `## Skills\n\n`
      markdown += skills.map((s: any) => `- ${typeof s === 'string' ? s : s?.name}`).join('\n')
      markdown += '\n\n'
    }
    
    if (experience?.length > 0) {
      markdown += `## Experience\n\n`
      experience.forEach((e: any) => {
        markdown += `### ${e?.role || e?.position}\n`
        markdown += `**${e?.company || e?.organization}** | ${e?.start_date || e?.start} - ${e?.end_date || e?.end || 'Present'}\n\n`
        if (Array.isArray(e?.responsibilities)) {
          e.responsibilities.forEach((r: any) => {
            markdown += `- ${r}\n`
          })
        } else if (e?.description) {
          markdown += `${e.description}\n`
        }
        markdown += '\n'
      })
    }
    
    if (education?.length > 0) {
      markdown += `## Education\n\n`
      education.forEach((ed: any) => {
        markdown += `### ${ed?.degree || ed?.qualification}\n`
        markdown += `**${ed?.institution || ed?.school}** | ${ed?.year || ed?.start} - ${ed?.end || ''}\n\n`
        if (ed?.details) markdown += `${ed.details}\n\n`
      })
    }
    
    if (projects?.length > 0) {
      markdown += `## Projects\n\n`
      projects.forEach((p: any) => {
        markdown += `### ${p?.name || p?.title}\n\n`
        if (p?.description) markdown += `${p.description}\n\n`
        if (Array.isArray(p?.technologies)) {
          markdown += `**Technologies:** ${p.technologies.join(', ')}\n\n`
        }
      })
    }
    
    setCvMarkdown(markdown)
  }

  const downloadJson = () => {
    const payload = response?.structured_cv || response
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'structured-cv.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Shader with opacity */}
      <div className="absolute inset-0 opacity-30">
        <BackgroundShader />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Structured CV Intelligence</h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">Upload your CV, optionally provide a target job description, and let the system extract structured data and AI-driven improvement suggestions.</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 border ${useGemini ? 'border-indigo-400/40 bg-indigo-500/10 text-indigo-300' : 'border-slate-600 bg-slate-700/40 text-slate-300'}`}>{useGemini ? <FaRegLightbulb /> : null}{useGemini ? 'Gemini enabled' : 'Gemini disabled'}</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-10">
          <div className="relative">
            <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-slate-800 rounded-full" />
            <div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${((step - 1) / 4) * 100}%` }} />
            <div className="relative flex justify-between">
              {[1,2,3,4,5].map(s => (
                <div key={s} className="flex flex-col items-center" aria-current={step === s}>
                  <div className={`size-10 flex items-center justify-center rounded-full border-2 backdrop-blur-sm transition-colors ${step === s ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200' : step > s ? 'border-green-400 bg-green-500/20 text-green-200' : 'border-slate-600 bg-slate-800 text-slate-400'}`}>{step > s ? <FaCheckCircle /> : s}</div>
                  <span className={`mt-2 text-xs font-medium tracking-wide ${step === s ? 'text-indigo-300' : 'text-slate-400'}`}>{s === 1 ? 'Input' : s === 2 ? 'Processing' : s === 3 ? 'Results' : s === 4 ? 'Apply' : 'Preview'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border-slate-700/60 shadow-lg shadow-black/30">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-slate-100">CV Source</CardTitle>
                <CardDescription>Upload a file or paste your CV content below.</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onFile(e.target.files?.[0])}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onBrowse()}
                  onClick={onBrowse}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className={`group rounded-xl border-2 border-dashed p-8 text-center transition relative overflow-hidden cursor-pointer ${dragOver ? 'border-indigo-400 bg-indigo-950/40' : 'border-slate-700 hover:border-indigo-400 hover:bg-slate-800/60'}`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-indigo-500/10 to-pink-500/10" />
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-black/40 mb-4">
                    <FaUpload className="text-2xl" />
                  </div>
                  <p className="text-slate-200 font-medium">Drag & drop your CV</p>
                  <p className="text-slate-400 text-xs mt-1">or click to browse .pdf, .docx, .txt</p>
                  {file && (
                    <p className="mt-3 text-xs text-indigo-300">Selected: <strong>{file.name}</strong></p>
                  )}
                </div>
                <div className="mt-6">
                  <label className="block text-xs uppercase tracking-wide font-semibold mb-2 text-slate-300">Or paste CV text</label>
                  <textarea
                    className="w-full min-h-[180px] rounded-lg bg-slate-800/70 border border-slate-700 p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-0"
                    placeholder="Paste CV text..."
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/60 shadow-lg shadow-black/30">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-slate-100">Options</CardTitle>
                <CardDescription>Provide context and enable AI improvements.</CardDescription>
              </CardHeader>
              <CardContent>
                <label className="block text-xs uppercase tracking-wide font-semibold mb-2 text-slate-300">Optional job description</label>
                <textarea
                  className="w-full min-h-[140px] rounded-lg bg-slate-800/70 border border-slate-700 p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                  placeholder="Paste the job description to tailor analysis (optional)"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="flex items-center justify-between mt-5 p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                  <div>
                    <div className="font-semibold text-slate-200 text-sm">Gemini AI Analysis</div>
                    <div className="text-xs text-slate-400">Generates targeted suggestions.</div>
                  </div>
                  <Switch checked={useGemini} onCheckedChange={setUseGemini} />
                </div>
                {error && <div className="mt-4 p-3 rounded-md bg-red-900/30 text-red-300 text-sm border border-red-700/40">{error}</div>}
                <Button
                  onClick={submitAnalysis}
                  variant="default"
                  className="mt-6 w-full h-12 text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-black/40"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Analyze CV'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-md border-slate-700 shadow-xl">
            <CardContent className="py-14 text-center">
              <div className="mx-auto w-20 h-20 rounded-full border-[6px] border-slate-700 border-t-indigo-500 animate-spin" />
              <h2 className="mt-8 text-2xl font-medium text-slate-100">Analyzing your CV…</h2>
              <p className="text-slate-400 mt-3 text-sm max-w-md mx-auto">Extracting structured fields{useGemini ? ', matching to role criteria, and creating improvement suggestions' : ''}. Please wait.</p>
              <p className="mt-6 text-xs text-slate-500">Tip: Larger PDFs may take a bit longer.</p>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && response && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700 shadow-lg">
                <CardHeader className="border-b border-slate-800">
                  <CardTitle className="text-slate-100">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{response.summary || 'Structured CV generated successfully.'}</p>
                  
                  {/* Primary Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <Button 
                      onClick={() => {
                        convertCvToMarkdown(response.structured_cv)
                        setStep(4)
                      }} 
                      className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg"
                    >
                      Apply AI Suggestions →
                    </Button>
                    <Button 
                      onClick={() => {
                        convertCvToMarkdown(response.structured_cv)
                        setStep(5)
                      }} 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg"
                    >
                      Preview & Download CV →
                    </Button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" onClick={downloadJson} className="border-slate-600 text-slate-200 hover:border-indigo-500 hover:text-indigo-300">Download JSON</Button>
                    <Button variant="outline" size="sm" onClick={resetAll} className="border-slate-600 text-slate-200 hover:border-slate-400">New Analysis</Button>
                      <Button variant="outline" size="sm" onClick={() => setShowATS(true)} className="border-green-600 text-green-300 hover:border-green-500 hover:text-green-400">View ATS Score</Button>
                      <Button variant="outline" size="sm" onClick={() => setShowOverall(true)} className="border-blue-600 text-blue-300 hover:border-blue-500 hover:text-blue-400">View Overall Score</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700 shadow-lg">
                <CardHeader className="border-b border-slate-800">
                  <CardTitle className="text-slate-100">CV Strength</CardTitle>
                </CardHeader>
                <CardContent>
                  <CVStrengthIndicator
                    atsScore={response.gemini_analysis?.ats_score}
                    overallScore={response.gemini_analysis?.overall_score}
                    suggestionsCount={response.gemini_analysis?.suggestions?.length || 0}
                    appliedCount={appliedChanges.size}
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700 shadow-lg">
                <CardHeader className="border-b border-slate-800">
              {/* ATS Score Modal */}
              {showATS && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
                    <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-2xl" onClick={() => setShowATS(false)}>&times;</button>
                    <ATSScore score={response?.gemini_analysis?.ats_score} />
                  </div>
                </div>
              )}
              {/* Overall Score Modal */}
              {showOverall && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
                    <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-2xl" onClick={() => setShowOverall(false)}>&times;</button>
                    <OverallScore score={response?.gemini_analysis?.overall_score} />
                  </div>
                </div>
              )}
                  <CardTitle className="text-slate-100">Suggestions</CardTitle>
                  <CardDescription className="text-xs">Actionable improvements detected by AI.</CardDescription>
                </CardHeader>
                <CardContent>
                  {response.gemini_analysis?.suggestions?.length ? (
                    <ul className="space-y-4">
                      {response.gemini_analysis.suggestions.map((s: any, idx: number) => (
                        <li key={idx} className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                          <div className="text-xs font-semibold text-indigo-300 mb-1">{s?.targetField || s?.fieldPath?.join(' / ') || 'Field'}</div>
                          <div className="text-[13px] text-slate-300 leading-relaxed">{s?.improvedValue || s?.text}</div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => applySuggestion(s, idx)} className="border-slate-600 text-slate-200 hover:border-indigo-500 hover:text-indigo-300">Apply</Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500">No AI suggestions{useGemini ? '' : ' (Gemini disabled)'}.</p>
                  )}
                  {response.gemini_analysis?.suggestions?.length > 0 && (
                    <div className="mt-4 flex justify-center">
                      <Button onClick={() => setStep(4)} className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500">
                        View All Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border-slate-700 shadow-lg">
              <CardHeader className="border-b border-slate-800 flex items-center justify-between">
                <CardTitle className="text-slate-100">Structured CV</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowRaw(r => !r)} className="border-slate-600 text-slate-200 hover:border-indigo-500 hover:text-indigo-300">{showRaw ? 'Hide Raw JSON' : 'Show Raw JSON'}</Button>
              </CardHeader>
              <CardContent>
                {!showRaw ? (
                  <StructuredCvView data={response.structured_cv} />
                ) : (
                  <pre className="mt-3 bg-slate-800/70 rounded-lg p-4 text-[11px] text-slate-300 overflow-auto max-h-[600px] whitespace-pre-wrap">{JSON.stringify(response.structured_cv, null, 2)}</pre>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Apply Changes */}
        {step === 4 && response && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep(3)} className="border-slate-600 text-slate-200 hover:border-indigo-500">
                ← Back to Results
              </Button>
              <Button onClick={() => {
                // Convert CV to markdown and navigate to preview
                convertCvToMarkdown(response.structured_cv)
                setStep(5)
              }} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600">
                Continue to Preview
              </Button>
            </div>
            <ApplyChanges
              suggestions={response.gemini_analysis?.suggestions || []}
              onApply={applySuggestion}
              onApplyAll={applyAllSuggestions}
              appliedChanges={appliedChanges}
            />
          </div>
        )}

        {/* Step 5: CV Preview and Download */}
        {step === 5 && response && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep(4)} className="border-slate-600 text-slate-200 hover:border-indigo-500">
                ← Back to Changes
              </Button>
              <Button onClick={resetAll} className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600">
                Start New Analysis
              </Button>
            </div>
            <CVPreview cvData={response.structured_cv} markdown={cvMarkdown} />
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

// Present a friendly view for common structured CV fields; fallback to JSON for unknowns
function StructuredCvView({ data }: { data: any }) {
  if (!data) return <p className="text-sm text-gray-500">No structured data available.</p>

  const name = data?.name || data?.full_name || data?.personal_info?.name
  const title = data?.title || data?.headline
  const summary = data?.summary || data?.objective || data?.profile
  const skills = data?.skills || data?.technical_skills || []
  const experience = data?.experience || data?.work_experience || []
  const education = data?.education || []
  const projects = data?.projects || []

  return (
    <div className="space-y-8">
      {/* Header Section */}
      {(name || title) && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{name}</div>
          {title && <div className="text-lg text-indigo-600 font-medium">{title}</div>}
        </div>
      )}

      {/* Summary Section */}
      {summary && (
        <section className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold text-indigo-700 text-xl mb-2">Summary</h4>
          <p className="text-gray-700 text-base whitespace-pre-wrap">{summary}</p>
        </section>
      )}

      {/* Skills Section */}
      {skills?.length > 0 && (
        <section className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold text-indigo-700 text-xl mb-2">Skills</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((s: any, idx: number) => (
              <span key={idx} className="px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">{typeof s === 'string' ? s : s?.name || JSON.stringify(s)}</span>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {Array.isArray(experience) && experience.length > 0 && (
        <section className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold text-indigo-700 text-xl mb-2">Experience</h4>
          <ul className="mt-2 space-y-4">
            {experience.map((e: any, idx: number) => (
              <li key={idx} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="font-semibold text-gray-900 text-lg">{e?.role || e?.position || 'Role'}</div>
                <div className="text-sm text-gray-500 mb-2">{e?.company || e?.organization} • {e?.start_date || e?.start} - {e?.end_date || e?.end || 'Present'}</div>
                {Array.isArray(e?.responsibilities) ? (
                  <ul className="list-disc ml-5 mt-2 text-base text-gray-700">
                    {e.responsibilities.map((r: any, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                ) : e?.description ? (
                  <p className="text-base text-gray-700 mt-2 whitespace-pre-wrap">{e.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Education Section */}
      {Array.isArray(education) && education.length > 0 && (
        <section className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold text-indigo-700 text-xl mb-2">Education</h4>
          <ul className="mt-2 space-y-4">
            {education.map((ed: any, idx: number) => (
              <li key={idx} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="font-semibold text-gray-900 text-lg">{ed?.degree || ed?.qualification || 'Degree'}</div>
                <div className="text-sm text-gray-500 mb-2">{ed?.institution || ed?.school} • {ed?.year || ed?.start} - {ed?.end || ''}</div>
                {ed?.details && <p className="text-base text-gray-700 mt-2 whitespace-pre-wrap">{ed.details}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects Section */}
      {Array.isArray(projects) && projects.length > 0 && (
        <section className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold text-indigo-700 text-xl mb-2">Projects</h4>
          <ul className="mt-2 space-y-4">
            {projects.map((p: any, idx: number) => (
              <li key={idx} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="font-semibold text-gray-900 text-lg">{p?.name || p?.title || 'Project'}</div>
                {p?.description && <p className="text-base text-gray-700 mt-1 whitespace-pre-wrap">{p.description}</p>}
                {Array.isArray(p?.technologies) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.technologies.map((t: any, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 border border-indigo-200 font-medium">{t}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Fallback */}
      {!name && !summary && !skills?.length && !experience?.length && !education?.length && (
        <pre className="mt-3 bg-gray-50 rounded-lg p-3 text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  )
}
