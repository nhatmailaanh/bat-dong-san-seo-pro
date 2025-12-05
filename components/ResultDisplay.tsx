
import React from 'react';
import { GeneratedContent, HFAnalysisResult } from '../types';
import TemplateSection from './TemplateSection';
import CopyButton from './CopyButton';

interface ResultDisplayProps {
  result: GeneratedContent;
  hfAnalysis: HFAnalysisResult | null;
  hfLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, hfAnalysis, hfLoading }) => {
  
  // Helper to color code strategies
  const getStrategyColor = (strategy: string) => {
    const s = strategy.toLowerCase();
    if (s.includes('price') || s.includes('giá')) return 'bg-green-100 text-green-800 border-green-200';
    if (s.includes('location') || s.includes('vị trí')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s.includes('urgency') || s.includes('gấp')) return 'bg-red-100 text-red-800 border-red-200';
    if (s.includes('luxury') || s.includes('sang')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (s.includes('invest') || s.includes('đầu tư')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderHFAnalysis = () => {
    if (hfLoading) {
        return (
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="animate-spin w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span className="font-bold text-purple-800">Đang phân tích chuyên sâu với Hugging Face AI...</span>
                </div>
                <div className="h-2 bg-purple-200 rounded w-full mb-2"></div>
                <div className="h-2 bg-purple-200 rounded w-3/4"></div>
            </div>
        );
    }

    if (!hfAnalysis) return null;

    return (
        <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl shadow-sm border border-purple-100 space-y-4">
             <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Phân tích Chuyên sâu (Hugging Face)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quality Score */}
                <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-600">Điểm Chất Lượng</span>
                        <span className={`text-lg font-bold ${hfAnalysis.quality?.score! >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                            {hfAnalysis.quality?.score}/100
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className={`h-2 rounded-full ${hfAnalysis.quality?.score! >= 80 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${hfAnalysis.quality?.score}%` }}></div>
                    </div>
                    <ul className="text-xs text-gray-500 list-disc ml-4 space-y-1">
                        {hfAnalysis.quality?.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>

                {/* Readability */}
                <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-600">Độ Dễ Đọc</span>
                        <span className="text-lg font-bold text-blue-600">{hfAnalysis.readability?.score}/100</span>
                    </div>
                     <ul className="text-xs text-gray-500 list-disc ml-4 space-y-1">
                        {hfAnalysis.readability?.improvements.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            </div>

            {/* SEO Keywords Analysis */}
            <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Từ Khóa & Mật Độ</h4>
                 <div className="flex flex-wrap gap-2 mb-2">
                    {hfAnalysis.seo?.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {kw} <span className="text-purple-400 text-[10px]">({hfAnalysis.seo?.density[kw] || 1})</span>
                        </span>
                    ))}
                 </div>
                 {hfAnalysis.seo?.recommendations.length! > 0 && (
                     <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                        <strong>Gợi ý:</strong> {hfAnalysis.seo?.recommendations.join(' ')}
                     </div>
                 )}
            </div>

             {/* Errors */}
             {hfAnalysis.grammar?.errors.length! > 0 && (
                 <div className="bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm">
                    <h4 className="text-sm font-bold text-red-800 mb-2">Phát hiện Lỗi Chính Tả / Ngữ Pháp</h4>
                    <ul className="space-y-1">
                        {hfAnalysis.grammar?.errors.map((err, i) => (
                            <li key={i} className="text-xs text-red-600 flex gap-2">
                                <span className="line-through opacity-70">{err.original}</span>
                                <span className="font-bold">→ {err.suggestion}</span>
                            </li>
                        ))}
                    </ul>
                 </div>
             )}
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 0. Market Analysis */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm border border-blue-100">
        <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Phân tích Chiến lược Đăng tin (Insight từ Batdongsan.com.vn)
        </h3>
        <ul className="space-y-2">
          {result.marketAnalysis && result.marketAnalysis.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
              <span className="mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* 0.5 Hugging Face Analysis Section */}
      {renderHFAnalysis()}

      {/* 1. Hook Titles */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
            10 Hook Titles (Theo Chiến Lược)
          </h3>
          {result.titleErrors.length > 0 && (
             <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               Cảnh báo
             </span>
          )}
        </div>
        
        {result.titleErrors.length > 0 && (
          <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-100">
            {result.titleErrors.join(', ')}
          </div>
        )}

        <div className="space-y-3">
          {result.hookTitles.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200 group gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStrategyColor(item.strategy)}`}>
                    {item.strategy}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800">{item.title}</span>
              </div>
              <div className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 self-end sm:self-center">
                <CopyButton text={item.title} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Facebook Short Content */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-3">
             <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook Short ({'<'}200 chars)
            </h3>
            <CopyButton text={result.fbContent} />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-800 h-full">
            {result.fbContent}
          </div>
        </div>

        {/* 3. Meta Description */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              Meta Description ({'<'}160 chars)
            </h3>
             <CopyButton text={result.metaDescription} />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-800 h-full">
            {result.metaDescription}
          </div>
        </div>
      </div>

      {/* 4. Keywords */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
         <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              10+ Keywords SEO
            </h3>
            <CopyButton text={result.keywords.join(', ')} />
         </div>
         <div className="flex flex-wrap gap-2">
           {result.keywords.map((kw, idx) => (
             <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
               #{kw}
             </span>
           ))}
         </div>
      </div>

       {/* 5. Hot Description */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
         <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
              Mô tả "ĐÃO MỘA" (HOT) ~200 từ
            </h3>
            <CopyButton text={result.hotDescription} />
         </div>
         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
           {result.hotDescription}
         </div>
      </div>

      {/* 6. Template Section */}
      <TemplateSection template={result.bestTemplate} steps={result.postingSteps} />

    </div>
  );
};

export default ResultDisplay;
