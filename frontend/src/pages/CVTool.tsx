import React, { useRef, useState, DragEvent, ChangeEvent } from 'react'
import { useServices } from '../ServiceContext'
import { FaUpload, FaSearch, FaMagic } from 'react-icons/fa'

type Mode = 'review' | 'rewrite'

export default function CVTool() {
  const [mode, setMode] = useState<Mode>('review')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const { addHistory } = useServices()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const onFile = (f: File | undefined) => {
    if (!f) return
    setFile(f)
    if (f.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = () => setText(String(reader.result || ''))
      reader.readAsText(f)
    }
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    onFile(e.dataTransfer.files?.[0])
  }

  const onBrowse = () => fileInputRef.current?.click()

  const process = () => {
    // Demo processing: mock review/rewritten text
    if (!text && !file) {
      alert('Please upload a CV or paste text to proceed')
      return
    }
    const base = text || (file ? `CV: ${file.name}` : '')
    if (mode === 'review') {
      setResult(`Review summary:\n- Clarity: Good\n- Keywords: Add role-specific terms\n- Suggestions: Quantify achievements\n\nExcerpt:\n${base.slice(0, 300)}...`)
    } else {
      setResult(`Rewritten CV (sample):\n${base.toUpperCase()}\n\nNote: In production, an AI would rewrite and format a polished PDF.`)
    }

    // Log in history
    addHistory({
      type: mode === 'review' ? 'cv-review' : 'cv-rewrite',
      title: file ? file.name : 'CV text',
      meta: { length: base.length }
    })
  }

  const downloadPdf = () => {
    const blob = new Blob([result || 'CV Output'], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cv-output.txt' // For demo; replace with PDF in production
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-foreground mb-6">CV Reviewer & Rewriter</h1>

      {/* Mode selection - modern segmented cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 max-w-xl">
        <button
          type="button"
          onClick={() => setMode('review')}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${mode === 'review' ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'}`}
        >
          <span className={`p-2 rounded-lg ${mode === 'review' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
            <FaSearch />
          </span>
          <div className="text-left">
            <div className="font-semibold">Review only</div>
            <div className="text-xs text-gray-500">Quality checks and suggestions</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMode('rewrite')}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${mode === 'rewrite' ? 'border-primary-700 bg-primary-50 text-primary-700 shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'}`}
        >
          <span className={`p-2 rounded-lg ${mode === 'rewrite' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
            <FaMagic />
          </span>
          <div className="text-left">
            <div className="font-semibold">Review + Rewrite</div>
            <div className="text-xs text-gray-500">Get an improved version</div>
          </div>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload */}
        <div>
          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => onFile(e.target.files?.[0])}
          />
          {/* Modern dropzone */}
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onBrowse()}
            onClick={onBrowse}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all bg-white cursor-pointer ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
          >
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md mb-4">
              <FaUpload className="text-xl" />
            </div>
            <p className="text-gray-900 font-semibold">Drag & drop your CV</p>
            <p className="text-gray-500 text-sm">or click to upload .pdf, .docx, .txt</p>
            {file && (
              <p className="mt-3 text-sm text-gray-700">Selected: <strong>{file.name}</strong></p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Or paste CV text</label>
            <textarea className="w-full min-h-[160px] rounded-xl border-2 border-gray-200 p-3 focus:border-primary-500"
              placeholder="Paste CV text..." value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <button onClick={process} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold">
            {mode === 'review' ? 'Run Review' : 'Review & Rewrite'}
          </button>
        </div>

        {/* Output */}
        <div>
          <h2 className="font-semibold text-foreground mb-2">Output</h2>
          <pre className="bg-white rounded-2xl p-4 border border-gray-200 whitespace-pre-wrap min-h-[220px]">{result || 'Output will appear here...'}</pre>
          {result && (
            <button onClick={downloadPdf} className="mt-4 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:text-primary-600 bg-white">Download as file</button>
          )}
        </div>
      </div>
    </div>
  )
}
