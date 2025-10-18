import { useState } from "react";
import { Maximize2, Minimize2, Monitor } from "lucide-react";

export default function LiveView({ liveViewLink }: { liveViewLink: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Preview</h1>
              <p className="text-sm text-gray-600">Real-time application view</p>
            </div>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shadow-sm"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Fullscreen</span>
              </>
            )}
          </button>
        </div>

        {/* Preview Container */}
        <div
          className={`bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden transition-all duration-300 ${
            isFullscreen ? "fixed inset-4 z-50 rounded-2xl" : "relative"
          }`}
        >
          {/* Browser-style header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
              <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer"></div>
            </div>
            <div className="flex-1 ml-4">
              <div className="bg-white rounded-lg px-4 py-1.5 border border-gray-300 shadow-sm max-w-2xl">
                <p className="text-xs text-gray-500 truncate font-mono">{liveViewLink}</p>
              </div>
            </div>
          </div>

          {/* iframe container */}
          <div
            className={`bg-white ${
              isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[800px]"
            }`}
          >
            <iframe
              src={liveViewLink}
              sandbox="allow-same-origin allow-scripts"
              allow="clipboard-read; clipboard-write"
              className="w-full h-full border-0"
              style={{ pointerEvents: "none" }}
              title="Live Preview"
            />
          </div>

          {/* Footer info */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
              <div className="text-xs text-gray-500">
                Interactions disabled in preview mode
              </div>
            </div>
          </div>
        </div>
        {/* Info card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a live preview with interactions disabled. 
            Open the link directly to interact with the application.
          </p>
        </div>
      </div>
    </div>
  );
}