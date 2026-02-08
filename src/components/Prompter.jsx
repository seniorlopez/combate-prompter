import { useState } from 'react';
import fullData from '../data/fullData.json';

export default function Prompter({ role }) {
    const isHost = role === 'host';
    const [showResearch, setShowResearch] = useState(false);
    const [activeSegmentId, setActiveSegmentId] = useState(null);
    const [activeBlockIndex, setActiveBlockIndex] = useState(null);

    // Helper to get research content.
    // Now we can be more granular.
    const getResearchContent = () => {
        if (!activeSegmentId) return "Selecciona un bloque para ver el research.";
        const segment = fullData.segments.find(s => s.id === activeSegmentId);
        if (!segment) return "Segmento no encontrado.";

        // If a specific block is active, we could scroll to it, 
        // but for now let's show the whole segment text or the block text?
        // User said: "veo la seccion completa del documento correspondiente"
        // Let's show the whole segment text, but maybe highlight the block?
        // Actually, fullData stores 'content' per block. 
        // Let's construct the full text from blocks for the sidebar.
        return segment.blocks.map(b => `### ${b.title}\n${b.content}`).join('\n\n');
    };

    return (
        <div className="flex min-h-screen bg-combate-dark text-slate-200 font-sans">
            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ${showResearch ? 'mr-96' : ''}`}>
                <header className="fixed top-0 left-0 right-0 bg-combate-dark/95 backdrop-blur border-b border-slate-800 p-4 z-40 flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                            {fullData.title} <span className={isHost ? "text-combate-orange" : "text-combate-green"}>
                                [{isHost ? "HOST" : "CO-HOST"}]
                            </span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowResearch(!showResearch)}
                            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border transition-all ${showResearch
                                ? 'bg-slate-700 text-white border-slate-500'
                                : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'
                                }`}
                        >
                            {showResearch ? 'Cerrar Research' : 'Ver Research'}
                        </button>
                        <a href="/" className="text-xs text-slate-500 hover:text-white">SALIR</a>
                    </div>
                </header>

                <div className="mt-20 p-4 md:p-8 pb-32 max-w-4xl mx-auto">
                    {fullData.segments.map((seg) => (
                        <section key={seg.id} className="space-y-6 mb-24 scroll-mt-24" id={seg.id}>
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <h2 className="text-xl font-black text-slate-500 uppercase tracking-tight">
                                    {seg.title}
                                </h2>
                                <button
                                    onClick={() => {
                                        setActiveSegmentId(seg.id);
                                        setShowResearch(true);
                                    }}
                                    className="text-xs text-slate-600 hover:text-combate-orange uppercase tracking-wider"
                                >
                                    Abrir Research
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* BLOCKS FOR HOST (AND CONTEXT FOR CO-HOST) */}
                                <div className="space-y-6">
                                    {seg.blocks.map((block, idx) => {
                                        const isNote = block.title.includes("NOTA") || block.content.includes("Nota para el Host");
                                        return (
                                            <div
                                                key={`block-${idx}`}
                                                onClick={() => {
                                                    setActiveSegmentId(seg.id);
                                                    setActiveBlockIndex(idx);
                                                    setShowResearch(true);
                                                }}
                                                className={`p-6 rounded-lg border cursor-pointer hover:bg-slate-800/50 transition-all ${isHost
                                                        ? (isNote ? 'bg-yellow-900/10 border-yellow-700/50' : 'bg-slate-900 border-slate-800')
                                                        : 'bg-slate-900/10 border-slate-800/20 opacity-40'
                                                    }`}
                                            >
                                                <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase">{block.title}</h3>

                                                {/* HOST SEES EVERYTHING. CO-HOST SEES ONLY TITLES (REDUCED LIST) */}
                                                {isHost && (
                                                    <div className="leading-relaxed whitespace-pre-wrap text-lg text-slate-200">
                                                        {block.content.replace(block.title, '').trim()}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* FICHAS FOR CO-HOST (AND CUE REFERENCE FOR HOST) */}
                                {seg.fichas && Object.keys(seg.fichas).length > 0 && (
                                    <div className={`mt-8 pt-8 border-t-2 border-dashed ${isHost ? 'border-slate-800' : 'border-combate-green'}`}>
                                        <h3 className={`text-sm font-black uppercase tracking-widest mb-6 ${isHost ? 'text-slate-600' : 'text-combate-green'}`}>
                                            {isHost ? "Fichas Disponibles (Co-Host)" : "TUS FICHAS DE COMBATE"}
                                        </h3>
                                        <div className="grid gap-6">
                                            {Object.values(seg.fichas).map((ficha, idx) => (
                                                <div
                                                    key={`ficha-${idx}`}
                                                    className={`p-6 rounded-xl border-l-4 shadow-lg ${isHost
                                                        ? 'bg-slate-900/50 border-slate-700 opacity-75'
                                                        : 'bg-green-900/20 border-combate-green ring-1 ring-green-500/20'
                                                        }`}
                                                >
                                                    <h4 className={`text-lg font-bold mb-3 ${isHost ? 'text-slate-400' : 'text-green-400'}`}>
                                                        {ficha.title}
                                                    </h4>
                                                    <div className={`leading-relaxed whitespace-pre-line font-serif ${isHost ? 'text-sm text-slate-500' : 'text-lg text-slate-200'}`}>
                                                        {ficha.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* Research Sidebar */}
            <div className={`fixed right-0 top-16 bottom-0 w-96 bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 transform ${showResearch ? 'translate-x-0' : 'translate-x-full'} z-30 flex flex-col`}>
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm">Research Mode</h3>
                    <button onClick={() => setShowResearch(false)} className="text-slate-500 hover:text-white">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 font-mono text-sm text-slate-400 space-y-8 bg-slate-950">
                    {activeSegmentId ? (
                        <div>
                            <div className="mb-4 pb-2 border-b border-slate-800">
                                <span className="text-xs text-slate-500 uppercase">Segmento Activo</span>
                                <h4 className="text-lg text-combate-orange font-bold">{activeSegmentId.toUpperCase()}</h4>
                            </div>
                            {/* Render refined blocks in sidebar for reading */}
                            {fullData.segments.find(s => s.id === activeSegmentId)?.blocks.map((b, i) => (
                                <div key={i} className={`mb-8 ${activeBlockIndex === i ? 'ring-1 ring-combate-orange p-2 rounded bg-combate-orange/5' : ''}`}>
                                    <h5 className="text-xs font-bold text-slate-500 mb-1">{b.title}</h5>
                                    <p className="whitespace-pre-wrap text-slate-300">{b.content.replace(b.title, '').trim()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-20 text-slate-600">
                            <p>Selecciona un bloque para ver su contenido.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
