import { Link } from 'react-router-dom';

export default function Welcome() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-combate-dark p-6">
            <h1 className="text-4xl md:text-6xl font-black text-slate-100 mb-8 tracking-tighter uppercase">
                COMBATE <span className="text-combate-orange">PROMPTER</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <Link to="/host" className="group relative block p-8 bg-slate-800 rounded-xl border border-slate-700 hover:border-combate-orange transition-all">
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-combate-orange">HOST (Narrador)</h2>
                    <p className="text-slate-400 text-sm">Ver guion completo con marcas de entrada.</p>
                </Link>

                <Link to="/cohost" className="group relative block p-8 bg-slate-800 rounded-xl border border-slate-700 hover:border-combate-green transition-all">
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-combate-green">CO-HOST (Incerciones)</h2>
                    <p className="text-slate-400 text-sm">Ver contexto y Fichas de Combate.</p>
                </Link>
            </div>

            <p className="mt-12 text-slate-500 text-xs uppercase tracking-widest">S11E03 - Venustiano Carranza</p>
        </div>
    );
}
