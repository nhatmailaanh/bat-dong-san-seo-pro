import React from 'react';
import CopyButton from './CopyButton';

interface TemplateSectionProps {
  template: {
    rationale: string;
    finalContent: string;
  };
  steps: string[];
}

const TemplateSection: React.FC<TemplateSectionProps> = ({ template, steps }) => {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-200 rounded-xl p-6 shadow-md relative overflow-hidden">
      {/* Decorative background icon */}
      <svg className="absolute -right-6 -bottom-6 w-32 h-32 text-orange-100 opacity-50 transform rotate-12 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
            Khuyên dùng
          </span>
          <h3 className="text-xl font-bold text-orange-900">TEMPLATE CHUẨN ĐĂNG TIN</h3>
        </div>

        <div className="mb-4 bg-white/60 p-3 rounded-lg border border-orange-100">
          <p className="text-sm text-orange-800 italic">
            <span className="font-semibold">Tại sao chọn mẫu này:</span> {template.rationale}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-orange-200 shadow-inner mb-6 relative group">
           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={template.finalContent} />
          </div>
          <pre className="p-4 text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
            {template.finalContent}
          </pre>
        </div>

        <div>
          <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            Hướng dẫn đăng tin (Step-by-step)
          </h4>
          <ul className="space-y-2">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 bg-white/80 p-2 rounded border border-orange-100">
                <span className="flex-shrink-0 bg-orange-200 text-orange-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TemplateSection;