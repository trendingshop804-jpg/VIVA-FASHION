import React from 'react';
import { X, Smartphone, Tablet, Monitor, ExternalLink } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export const DevicePreviewModal: React.FC = () => {
  const { isPreviewModalOpen, setIsPreviewModalOpen, previewDevice, setPreviewDevice } = useCMS();

  if (!isPreviewModalOpen) return null;

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-[390px] h-[800px] rounded-[40px] border-[10px] border-[#191E28]';
      case 'tablet': return 'max-w-[768px] h-[900px] rounded-[28px] border-[10px] border-[#191E28]';
      case 'desktop':
      default:
        return 'w-full max-w-[1360px] h-[85vh] rounded-2xl border border-[#DEC3B5]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="bg-[#191E28] text-white px-4 py-2.5 rounded-t-xl flex items-center justify-between border-b border-[#28303F] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-serif uppercase tracking-wider text-[#C27D6E]">
            Storefront Live Preview
          </span>
          <span className="text-[10px] bg-[#28303F] text-gray-300 px-2 py-0.5 rounded-full font-mono">
            {previewDevice.toUpperCase()}
          </span>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-[#28303F] p-1 rounded-lg gap-1">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              previewDevice === 'desktop' ? 'bg-[#C27D6E] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Monitor size={14} />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              previewDevice === 'tablet' ? 'bg-[#C27D6E] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Tablet size={14} />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              previewDevice === 'mobile' ? 'bg-[#C27D6E] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-[#28303F] px-2.5 py-1 rounded transition-colors"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Open New Tab</span>
          </a>
          <button
            onClick={() => setIsPreviewModalOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#28303F]"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-[#232936] p-4 flex items-center justify-center overflow-auto rounded-b-xl">
        <div className={`transition-all duration-300 bg-white overflow-hidden shadow-2xl flex flex-col ${getDeviceWidth()}`}>
          {previewDevice !== 'desktop' && (
            <div className="bg-[#191E28] h-4 w-28 mx-auto rounded-b-lg shrink-0 mb-1" />
          )}
          <iframe
            src="/"
            title="Storefront Preview"
            className="w-full flex-1 border-0 rounded-b-xl"
          />
        </div>
      </div>
    </div>
  );
};
