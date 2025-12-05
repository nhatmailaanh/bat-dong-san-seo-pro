import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { PropertyData, GeneratedContent, LoadingState, HFAnalysisResult } from './types';
import {
  checkContentQuality,
  analyzeSEOKeywords,
  detectAndFixErrors,
  improveReadability
} from './services/hfInferenceService';

const initialData: PropertyData = {
  type: '',
  area: '',
  price: '',
  location: '',
  project: '',
  amenities: '',
  legal: '',
  contact: '',
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<PropertyData>(initialData);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [hfAnalysis, setHfAnalysis] = useState<HFAnalysisResult | null>(null);
  
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [hfLoading, setHfLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PropertyData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.price || !formData.location) {
      setError("Vui lòng điền ít nhất Loại hình, Giá và Vị trí.");
      return;
    }

    setLoadingState(LoadingState.LOADING);
    setHfLoading(false);
    setHfAnalysis(null);
    setError(null);

    try {
      // 1. Generate Content with Gemini via API
      const response = await fetch('/api/generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const generatedContent: GeneratedContent = await response.json();
      setResult(generatedContent);
      setLoadingState(LoadingState.SUCCESS);

      // 2. Trigger Hugging Face Analysis (Async)
      setHfLoading(true);
      const contentToAnalyze = generatedContent.hotDescription;
      const titleToAnalyze = generatedContent.hookTitles[0]?.title || "";

      // Run parallel
      const [quality, seo, grammar, readability] = await Promise.all([
        checkContentQuality(contentToAnalyze),
        analyzeSEOKeywords(titleToAnalyze, contentToAnalyze),
        detectAndFixErrors(contentToAnalyze),
        improveReadability(contentToAnalyze)
      ]);

      setHfAnalysis({ quality, seo, grammar, readability });
      setHfLoading(false);
    } catch (err: any) {
      setError("Đã có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại. " + (err.message || ''));
      setLoadingState(LoadingState.ERROR);
      setHfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Bất Động Sản <span className="text-blue-600">SEO Pro</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              AI Analysis (HuggingFace)
            </span>
            <div className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Powered by Gemini 2.5
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input (Sticky on Desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <InputForm 
              data={formData} 
              onChange={handleInputChange} 
              onSubmit={handleSubmit}
              loadingState={loadingState}
            />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8">
            {loadingState === LoadingState.IDLE && (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-lg font-medium">Nhập thông tin và nhấn "Tạo Nội Dung SEO"</p>
                <p className="text-sm">AI sẽ giúp bạn tạo tin đăng chuẩn SEO trong vài giây.</p>
              </div>
            )}
            {loadingState === LoadingState.LOADING && (
              <div className="space-y-6">
                {/* Skeleton Loaders */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                ))}
              </div>
            )}
            {loadingState === LoadingState.SUCCESS && result && (
              <ResultDisplay 
                result={result} 
                hfAnalysis={hfAnalysis} 
                hfLoading={hfLoading}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
