import { useState } from "react"
import { Upload, ArrowLeft, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface UploadViewProps {
  onUploadComplete: () => void
  onBack: () => void
  loading: boolean
}

export default function UploadView({ onUploadComplete, onBack, loading }: UploadViewProps) {
  const { t } = useTranslation()
  const [fileName, setFileName] = useState("")
  const [uploaded, setUploaded] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setUploaded(true)

      // Simulate upload to server
      setTimeout(() => {
        console.log("File uploaded:", file.name)
      }, 500)
    }
  }

  const handleContinue = () => {
    if (uploaded) {
      onUploadComplete()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-8 relative">
      {/* Back button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="absolute top-8 left-8 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md rounded-full w-12 h-12"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">{t('upload.title')}</CardTitle>
          <CardDescription className="text-base mt-2">
            {t('upload.subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              uploaded
                ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                : "border-gray-300 bg-gray-50 dark:bg-gray-900/20 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20"
            }`}
          >
            <Input
              id="cv-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {!uploaded ? (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('upload.dragDrop')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('upload.fileTypes')}
                  </p>
                </div>
                <Label htmlFor="cv-upload">
                  <Button
                    type="button"
                    onClick={() => document.getElementById("cv-upload")?.click()}
                    className="bg-gradient-to-r from-purple-600 to-indigo-800 hover:from-purple-700 hover:to-indigo-900"
                  >
                    {t('upload.browseFiles')}
                  </Button>
                </Label>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <p className="text-base font-semibold text-green-600 dark:text-green-400 mb-2">
                    {t('upload.uploadSuccess')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {fileName}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploaded(false)
                      setFileName("")
                    }}
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  >
                    {t('upload.uploadDifferent')}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> {t('upload.note')}
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!uploaded || loading}
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-800 hover:from-purple-700 hover:to-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('upload.starting') : t('upload.continue')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
