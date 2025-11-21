import React from 'react';
import Navbar from '../components/Navbar';
import VoiceAgentDemo from '../components/VoiceAgentDemo';
import { useAuth } from '../context/AuthContext';
import { BarChart, Users, Phone, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">Dashboard</h1>
          <p className="text-slate-600">Benvenuto, {user?.email}. Ecco il pannello di controllo della tua agenzia AI.</p>
        </div>

        {/* Stats Grid (Mockup for SaaS feel) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Chiamate Totali</h3>
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-slate-900">124</p>
            <p className="text-xs text-green-600 mt-1">+12% questa settimana</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Lead Generati</h3>
              <Users className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-slate-900">48</p>
            <p className="text-xs text-green-600 mt-1">+5% questa settimana</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Tasso Conversione</h3>
              <BarChart className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">38%</p>
            <p className="text-xs text-slate-400 mt-1">Stabile</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Configurazione</h3>
              <Settings className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">Piano Pro Attivo</p>
            <button className="text-xs text-primary font-semibold mt-2 hover:underline">Gestisci</button>
          </div>
        </div>

        {/* Main App Area - The Voice Agent */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-xl font-bold text-secondary">Simulatore Agente Live</h2>
            <p className="text-slate-500 text-sm">Testa e configura il comportamento dei tuoi agenti vocali.</p>
          </div>
          <div className="-mt-16">
             {/* Reuse the existing demo component, slightly adjusted via CSS if needed, 
                 but here we just embed it. The component has its own padding so we might
                 need to adjust container or pass props for 'compact' mode in future. 
                 For now, we render it as the main tool. */}
             <VoiceAgentDemo />
          </div>
        </div>

        {/* Recent Activity Table (Mockup) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-secondary">Attività Recente</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3">ID Chiamata</th>
                  <th className="px-6 py-3">Agente</th>
                  <th className="px-6 py-3">Stato</th>
                  <th className="px-6 py-3">Durata</th>
                  <th className="px-6 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">#CALL-8921</td>
                  <td className="px-6 py-4">Sara (Reception)</td>
                  <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completata</span></td>
                  <td className="px-6 py-4">2m 15s</td>
                  <td className="px-6 py-4">Oggi, 14:30</td>
                </tr>
                <tr className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">#CALL-8920</td>
                  <td className="px-6 py-4">Michele (Emergenza)</td>
                  <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">In Corso</span></td>
                  <td className="px-6 py-4">45s</td>
                  <td className="px-6 py-4">Oggi, 14:28</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">#CALL-8919</td>
                  <td className="px-6 py-4">Sara (Reception)</td>
                  <td className="px-6 py-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Persa</span></td>
                  <td className="px-6 py-4">0s</td>
                  <td className="px-6 py-4">Oggi, 12:10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;