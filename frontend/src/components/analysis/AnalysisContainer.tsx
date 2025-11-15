/**
 * AnalysisContainer Component
 * Main container for analysis view with tabs
 */
import { useState } from 'react';
import {
  Sparkles, Target,
  FileText, TrendingUp, Layers, Clock, AlertCircle,
  CheckCircle, XCircle
} from 'lucide-react';
import AnalysisTab from './tabs/AnalysisTab';
import StatisticsTab from './tabs/StatisticsTab';
import FieldSuggestions from './FieldSuggestions';
import type { Analysis, FieldSuggestion, StructuredCV, OriginalFile } from '../../types';
import {Button} from "../ui/button"
 
interface AnalysisContainerProps {
  analysis: Analysis;
  cvFile: File | null;
  cvText: string;
  structuredCV: StructuredCV | null;
  originalFile: OriginalFile | null;
  onNewAnalysis: () => void;
  onApplySuggestion: (suggestion: FieldSuggestion) => Promise<StructuredCV>;
}

export default function AnalysisContainer({
  analysis,
  cvFile,
  structuredCV,
  onNewAnalysis,
  onApplySuggestion
}: AnalysisContainerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const fieldSuggestions = analysis.field_suggestions || [];
  const sectionAnalysis = analysis.section_analysis || [];
  const jobMatch = analysis.job_match_analysis || {
    relevance_score: 0,
    keyword_matches: [],
    missing_keywords: [],
    recommendations: []
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-transparent shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">AI CV Analysis</h1>
                <p className="text-sm text-[#D1D5DB]">{cvFile?.name}</p>
              </div>
            </div>

            {/* Score Display */}
            <div className="flex items-center gap-6 backdrop-blur-xl">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.overall_score || 0)}`}>
                  {analysis.overall_score || 0}
                </div>
                <div className="text-xs text-white uppercase font-semibold">Overall</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.ats_score || 0)}`}>
                  {analysis.ats_score || 0}
                </div>
                <div className="text-xs text-white uppercase font-semibold">ATS</div>
              </div>

              <Button
                onClick={onNewAnalysis}
                variant="outline"
              >
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="col-span-2">
            <div className="backdrop-blur-xl bg-black/40 rounded-lg shadow-sm p-4 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'overview', icon: Target, label: 'Overview' },
                  { id: 'field-suggestions', icon: Layers, label: 'Apply Changes', count: fieldSuggestions.length },
                  { id: 'sections', icon: FileText, label: 'Sections', count: sectionAnalysis.length },
                  { id: 'ats', icon: TrendingUp, label: 'ATS Match' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </div>
                    {tab.count !== undefined && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-7">
            {activeTab === 'overview' && <AnalysisTab analysis={analysis} />}

            {activeTab === 'field-suggestions' && (
              <div>
                <div className="backdrop-blur-xl rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Layers className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Field-Targeted Improvements</h3>
                      <p className="text-sm text-gray-700">
                        These suggestions target specific fields in your CV structure. Click "Apply" to automatically
                        update the field with the improved text. Each change is made directly to your structured CV data.
                      </p>
                    </div>
                  </div>
                </div>
                <FieldSuggestions
                  suggestions={fieldSuggestions}
                  onApplySuggestion={onApplySuggestion}
                  structuredCV={structuredCV}
                />
              </div>
            )}

            {activeTab === 'sections' && <StatisticsTab analysis={analysis} />}

            {activeTab === 'ats' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    ATS Compatibility Score
                  </h2>

                  <div className="flex items-center justify-center mb-6">
                    <div className={`text-6xl font-bold ${getScoreColor(jobMatch.relevance_score || 0)}`}>
                      {jobMatch.relevance_score || 0}
                    </div>
                    <div className="text-2xl text-gray-500 ml-2">/100</div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                    <div
                      className={`h-4 rounded-full transition-all ${(jobMatch.relevance_score || 0) >= 80 ? 'bg-green-500' :
                          (jobMatch.relevance_score || 0) >= 60 ? 'bg-yellow-500' :
                            (jobMatch.relevance_score || 0) >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${jobMatch.relevance_score || 0}%` }}
                    />
                  </div>

                  <p className="text-sm text-gray-600 text-center">
                    {(jobMatch.relevance_score || 0) >= 80 ? 'Excellent! Your CV is well-optimized for ATS systems.' :
                      (jobMatch.relevance_score || 0) >= 60 ? 'Good. Some improvements can increase your ATS score.' :
                        (jobMatch.relevance_score || 0) >= 40 ? 'Fair. Consider addressing the recommendations below.' :
                          'Needs improvement. Follow the recommendations to optimize for ATS.'}
                  </p>
                </div>

                {jobMatch.keyword_matches && jobMatch.keyword_matches.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Matching Keywords ({jobMatch.keyword_matches.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {jobMatch.keyword_matches.map((keyword, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {jobMatch.missing_keywords && jobMatch.missing_keywords.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Missing Keywords ({jobMatch.missing_keywords.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {jobMatch.missing_keywords.map((keyword, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {jobMatch.recommendations && jobMatch.recommendations.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h3 className="font-bold text-blue-900 mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                      {jobMatch.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-blue-800">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Top Priorities */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-24">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Top Priorities
              </h3>

              <div className="space-y-3">
                {(analysis.top_priorities || []).slice(0, 5).map((priority, idx) => (
                  <div key={idx} className="border-l-4 border-orange-500 pl-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-orange-600">#{priority.priority}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priority.impact === 'High' ? 'bg-red-100 text-red-800' :
                          priority.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {priority.impact}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {priority.action}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {priority.time_estimate}
                      </span>
                      <span className="text-gray-500">{priority.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
