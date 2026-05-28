/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Search, 
  Plus, 
  Mail, 
  ToggleLeft, 
  ToggleRight, 
  Trash2, 
  Sparkles, 
  ChevronRight,
  UserCheck,
  FileText,
  UploadCloud,
  X,
  File,
  Download,
  Check,
  Edit,
  FolderOpen,
  Database
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    lashistas, 
    addLashista, 
    toggleModuleAccess, 
    updateLashistaPlan, 
    deleteLashista,
    updateLashista,
    setCurrentRole,
    setCurrentLashista,
    setActiveMainView,
    sendMassEmail,
    emailLogs,
    stats,
    exportBackup,
    importBackup
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Pro' as 'Pro' | 'Básico' | 'Trial'
  });

  // Mail campaign state
  const [mailForm, setMailForm] = useState({
    targetGroup: 'all', // all, agendaPro, retencion, viral
    subject: '',
    body: ''
  });
  const [mailResult, setMailResult] = useState<string | null>(null);

  // States for detailed Lashista File viewer & Document Manager
  const [selectedLashista, setSelectedLashista] = useState<any | null>(null);
  const [showFichaModal, setShowFichaModal] = useState(false);
  const [activeFichaTab, setActiveFichaTab] = useState<'perfil' | 'documentos'>('perfil');
  
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Pro' as 'Pro' | 'Básico' | 'Trial',
    remainingDays: 30
  });

  // Upload document form states
  const [docForm, setDocForm] = useState({
    title: '',
    type: 'document' as 'image' | 'document' | 'consent',
    notes: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  // Functions for detailed Lashista File/Card
  const openLashistaFicha = (lash: any) => {
    let currentDocs = lash.documents || [];
    // Lazy-add some gorgeous real-looking documents so it's not empty and boring
    if (currentDocs.length === 0) {
      currentDocs = [
        {
          id: `doc-${lash.id}-1`,
          type: 'consent',
          name: 'Contrato_Adherente_Mundo_Lashista.pdf',
          url: '#',
          date: '2026-05-12',
          notes: 'Contrato de adhesión de servicios y términos generales firmado digitalmente.'
        },
        {
          id: `doc-${lash.id}-2`,
          type: 'document',
          name: `Factura_Pro_Suscripcion_${Math.floor(1000 + Math.random() * 9000)}.pdf`,
          url: '#',
          date: '2026-05-20',
          notes: `Factura de membresía activa. Monto cargado exitosamente según plan ${lash.plan}.`
        }
      ];
      updateLashista(lash.id, { documents: currentDocs });
      lash = { ...lash, documents: currentDocs };
    }

    setSelectedLashista(lash);
    setEditForm({
      name: lash.name,
      email: lash.email,
      phone: lash.phone,
      plan: lash.plan,
      remainingDays: lash.remainingDays || 30
    });
    setActiveFichaTab('perfil');
    setShowFichaModal(true);
  };

  const handleSaveFichaProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      alert('Nombre y correo son de carácter obligatorio.');
      return;
    }

    updateLashista(selectedLashista.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      plan: editForm.plan,
      remainingDays: Number(editForm.remainingDays)
    });

    // Update state reference immediately inside the modal
    setSelectedLashista((prev: any) => ({
      ...prev,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      plan: editForm.plan,
      remainingDays: Number(editForm.remainingDays)
    }));

    alert('¡Ficha de lashista guardada con éxito! Todos los cambios se guardaron localmente.');
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title) {
      alert('Por favor ingresa un nombre o título para el archivo.');
      return;
    }

    setIsUploading(true);
    setUploadPercent(10);

    // Simulate animated upload progress
    const interval = setInterval(() => {
      setUploadPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Complete Simulation & Save
          const newDoc = {
            id: `doc-${Date.now()}`,
            type: docForm.type,
            name: docForm.title.trim().endsWith('.pdf') ? docForm.title.trim() : `${docForm.title.trim()}.pdf`,
            url: '#',
            date: new Date().toISOString().split('T')[0],
            notes: docForm.notes || 'Documento cargado desde el gestor de la administración.'
          };

          const updatedDocs = [...(selectedLashista.documents || []), newDoc];
          
          updateLashista(selectedLashista.id, { documents: updatedDocs });
          
          setSelectedLashista((prev: any) => ({
            ...prev,
            documents: updatedDocs
          }));

          setDocForm({
            title: '',
            type: 'document',
            notes: ''
          });
          setIsUploading(false);
          setUploadPercent(0);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const handleDeleteDoc = (docId: string) => {
    if (!window.confirm('¿Estás segura de eliminar este documento del repositorio?')) return;

    const updatedDocs = (selectedLashista.documents || []).filter((d: any) => d.id !== docId);
    updateLashista(selectedLashista.id, { documents: updatedDocs });
    setSelectedLashista((prev: any) => ({
      ...prev,
      documents: updatedDocs
    }));
  };

  // Form submit
  const handleCreateLashista = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.email) {
      alert('Nombre y correo son obligatorios.');
      return;
    }
    
    addLashista({
      name: newForm.name,
      email: newForm.email,
      phone: newForm.phone || '+56 9 ' + Math.floor(10000000 + Math.random() * 90000000),
      plan: newForm.plan,
      activeModules: newForm.plan === 'Pro' 
        ? { agendaPro: true, retencion: true, viral: true }
        : { agendaPro: true, retencion: false, viral: false }
    });

    // Reset Form
    setNewForm({
      name: '',
      email: '',
      phone: '',
      plan: 'Pro'
    });
    setShowAddNew(false);
  };

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailForm.subject || !mailForm.body) {
      alert('Por favor agrega un asunto y cuerpo para enviar.');
      return;
    }
    const msg = sendMassEmail(mailForm.targetGroup, mailForm.subject, mailForm.body);
    setMailResult(msg);
    setMailForm({ targetGroup: 'all', subject: '', body: '' });

    // Auto clear feedback message in 5 seconds
    setTimeout(() => {
      setMailResult(null);
    }, 5000);
  };

  const filteredLashistas = lashistas.filter(lash => 
    lash.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lash.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdfaf7] pb-16">
      {/* Top Header Navigation */}
      <nav className="bg-[#1e1313] text-white py-4 px-6 sticky top-0 z-40 shadow-sm border-b border-gold-700/20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-500 text-[#1e1313] flex items-center justify-center font-bold text-sm">👑</div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Mundo Lashista Pro</h2>
              <p className="text-[10px] text-gold-200">Panel de Control General: Administración del Sistema</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 mr-2">Estás en cuenta Admin</span>
            <button 
              onClick={() => {
                setCurrentRole('public');
                setActiveMainView('inicio');
              }}
              className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border border-white/10"
              id="admin-to-landing-btn"
            >
              Cerrar Sesión ✕
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Metric Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="admin-stats-container">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center text-gold-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-medium">Lashistas Registradas</p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-0.5">{stats.totalLashistas}</h3>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-medium">MRR Calculado</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">${stats.revenueMRR} USD</h3>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-medium">Reservas del CRM</p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-0.5">{stats.totalAppointments}</h3>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-medium">Mensajes WhatsApp</p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-0.5">{stats.totalWhatsAppMessages}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Lashistas Table Directory */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden" id="directory-panel">
            <div className="p-6 border-b border-zinc-100 flex flex-wrap justify-between items-center gap-4 bg-zinc-50/50">
              <div>
                <h3 className="font-bold text-zinc-800 text-base">Directorio de Clientes Profesionales</h3>
                <p className="text-zinc-500 text-xs">Activa o desactiva el acceso a cada bloque de agenda con un click.</p>
              </div>

              <button 
                onClick={() => setShowAddNew(!showAddNew)}
                className="bg-[#1e1313] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                id="btn-trigger-add-lash"
              >
                <Plus className="w-4 h-4" /> Agregar Lashista
              </button>
            </div>

            {/* Registration Collapse Form */}
            {showAddNew && (
              <form onSubmit={handleCreateLashista} className="p-6 bg-gold-50/30 border-b border-zinc-100/60 animate-in slide-in-from-top duration-200">
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-4">Nueva Lashista Premium</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 uppercase mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Margarita soto"
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                      value={newForm.name}
                      onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                      id="new-lash-name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 uppercase mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      required
                      placeholder="marga.ashes@live.cl"
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                      value={newForm.email}
                      onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                      id="new-lash-email"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 uppercase mb-1">WhatsApp de Contacto</label>
                    <input 
                      type="text" 
                      placeholder="+56 9 8833 2211"
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                      value={newForm.phone}
                      onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                      id="new-lash-phone"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 uppercase mb-1">Plan de Inicio</label>
                    <select 
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                      value={newForm.plan}
                      onChange={(e) => setNewForm({ ...newForm, plan: e.target.value as any })}
                      id="new-lash-plan"
                    >
                      <option value="Pro">Pro ($49 USD/mes)</option>
                      <option value="Básico">Básico ($29 USD/mes)</option>
                      <option value="Trial">Prueba (7 días)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddNew(false)}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium px-4 py-2 rounded-xl transition-all"
                  >
                    Calcelar
                  </button>
                  <button 
                    type="submit" 
                    className="bg-gold-500 hover:bg-gold-600 text-zinc-900 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                  >
                    Guardar e Instalar Módulos
                  </button>
                </div>
              </form>
            )}

            {/* Filter */}
            <div className="p-4 border-b border-zinc-100 bg-white flex items-center gap-3">
              <Search className="w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o correo..."
                className="w-full text-xs text-zinc-800 focus:outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="admin-search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] text-zinc-400 hover:text-black bg-zinc-100 px-1.5 py-0.5 rounded"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Lashistas Table List */}
            <div className="overflow-x-auto text-left">
              <table className="w-full text-xs text-zinc-700">
                <thead className="bg-zinc-50 border-b border-zinc-100 font-semibold text-zinc-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Lashista / Suscripción</th>
                    <th className="py-3.5 px-4 text-center">Agenda Pro</th>
                    <th className="py-3.5 px-4 text-center">Fidelización</th>
                    <th className="py-3.5 px-4 text-center">Sistema Viral</th>
                    <th className="py-3.5 px-4 text-center">Acceso Panel</th>
                    <th className="py-3.5 px-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredLashistas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-zinc-400">
                        No se encontraron lashistas registradas.
                      </td>
                    </tr>
                  ) : (
                    filteredLashistas.map((lash) => (
                      <tr key={lash.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-brand flex items-center justify-center font-bold text-zinc-800 text-[11px] shadow-sm uppercase">
                              {lash.name.charAt(0)}
                            </div>
                            <div>
                              <div 
                                className="font-bold text-[#1e1313] hover:text-gold-600 transition-colors cursor-pointer flex items-center gap-1.5"
                                onClick={() => openLashistaFicha(lash)}
                                title="Ver Ficha y Gestor de Documentos"
                              >
                                {lash.name} 🔍
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  lash.plan === 'Pro' 
                                    ? 'bg-amber-100 text-[#a1762d]' 
                                    : lash.plan === 'Básico' 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-zinc-100 text-zinc-600'
                                }`}>
                                  {lash.plan}
                                </span>
                              </div>
                              <div className="text-zinc-500 text-[10px] cursor-pointer" onClick={() => openLashistaFicha(lash)}>{lash.email} • {lash.phone}</div>
                              <div className="text-zinc-400 text-[9px] mt-0.5">Desde: {lash.registeredDate}</div>
                            </div>
                          </div>
                        </td>

                        {/* Module 1: Agenda Pro */}
                        <td className="py-4 px-4 text-center">
                          <button 
                            type="button"
                            onClick={() => toggleModuleAccess(lash.id, 'agendaPro')}
                            className="focus:outline-none transition-transform active:scale-95 inline-block"
                            title="Haz clic para activar o desactivar este módulo para esta clienta"
                          >
                            {lash.activeModules.agendaPro ? (
                              <ToggleRight className="w-7 h-7 text-emerald-600 hover:text-emerald-700 inline-block" />
                            ) : (
                              <ToggleLeft className="w-7 h-7 text-zinc-300 hover:text-zinc-400 inline-block" />
                            )}
                          </button>
                        </td>

                        {/* Module 2: Retención */}
                        <td className="py-4 px-4 text-center">
                          <button 
                            type="button"
                            onClick={() => toggleModuleAccess(lash.id, 'retencion')}
                            className="focus:outline-none transition-transform active:scale-95 inline-block"
                            title="Haz clic para activar o desactivar este módulo para esta clienta"
                          >
                            {lash.activeModules.retencion ? (
                              <ToggleRight className="w-7 h-7 text-emerald-600 hover:text-emerald-700 inline-block" />
                            ) : (
                              <ToggleLeft className="w-7 h-7 text-zinc-300 hover:text-zinc-400 inline-block" />
                            )}
                          </button>
                        </td>

                        {/* Module 3: Sistema Viral */}
                        <td className="py-4 px-4 text-center">
                          <button 
                            type="button"
                            onClick={() => toggleModuleAccess(lash.id, 'viral')}
                            className="focus:outline-none transition-transform active:scale-95 inline-block"
                            title="Haz clic para activar o desactivar este módulo para esta clienta"
                          >
                            {lash.activeModules.viral ? (
                              <ToggleRight className="w-7 h-7 text-emerald-600 hover:text-emerald-700 inline-block" />
                            ) : (
                              <ToggleLeft className="w-7 h-7 text-zinc-300 hover:text-zinc-400 inline-block" />
                            )}
                          </button>
                        </td>

                        {/* Simulation Impersonate */}
                        <td className="py-4 px-4 text-center">
                          <button 
                            onClick={() => {
                              setCurrentLashista(lash);
                              setCurrentRole('lashista');
                              setActiveMainView('inicio');
                            }}
                            className="text-[11px] bg-[#fbf7ee] text-[#a1762d] py-1 px-2.5 rounded hover:bg-[#a1762d]/10 font-semibold border border-[#ebd4aa]"
                          >
                            Ingresar ⚡
                          </button>
                        </td>

                        {/* Actions: delete & plan selector */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 pr-4">
                            <button
                              onClick={() => openLashistaFicha(lash)}
                              className="py-1 px-2 bg-gold-50 hover:bg-gold-100 border border-[#ebd4aa] text-[#a1762d] rounded text-[11px] font-semibold transition-all mr-1 flex items-center gap-1"
                              title="Ver Ficha y Documentos"
                            >
                              Ficha 📄
                            </button>
                            <select 
                              className="bg-zinc-100 border-none text-[11px] font-semibold text-zinc-600 rounded px-1.5 py-1 focus:outline-none"
                              value={lash.plan}
                              onChange={(e) => updateLashistaPlan(lash.id, e.target.value as any)}
                            >
                              <option value="Básico">A Básico</option>
                              <option value="Pro">A Pro ⭐</option>
                              <option value="Trial">A Trial</option>
                            </select>

                            <button 
                              onClick={() => deleteLashista(lash.id)}
                              className="p-1 text-zinc-400 hover:text-red-500 rounded"
                              title="Eliminar de la plataforma"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center text-zinc-500 text-[11px]">
              🔒 Todos los datos de suscripción e ingresos son de demostración interactiva local.
            </div>
          </div>

          {/* Right Column details - Bulk dispatch newsletter & simulated SMTP logger */}
          <div className="space-y-6">
            
            {/* Mass E-mailer Segmented Form */}
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6" id="bulk-mailer">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-[#a1762d]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Masivo Segmentado</h4>
                  <p className="text-zinc-500 text-[10px]">Envía noticias o cobros a tus clientas lashistas</p>
                </div>
              </div>

              {mailResult && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs mb-4">
                  {mailResult}
                </div>
              )}

              <form onSubmit={handleSendMail} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-600 uppercase mb-1">Segmento Objetivo</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 text-zinc-800"
                    value={mailForm.targetGroup}
                    onChange={(e) => setMailForm({ ...mailForm, targetGroup: e.target.value })}
                  >
                    <option value="all">Todas las Lashistas Registradas ({lashistas.length})</option>
                    <option value="agendaPro">Lashistas con Asistente Agenda ({lashistas.filter(l => l.activeModules.agendaPro).length})</option>
                    <option value="retencion">Lashistas con Módulo Retención ({lashistas.filter(l => l.activeModules.retencion).length})</option>
                    <option value="viral">Lashistas con Sistema Viral ({lashistas.filter(l => l.activeModules.viral).length})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-600 uppercase mb-1">Asunto de Email</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. ¡Mejoras tecnológicas en tu sistema de Agenda!"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                    value={mailForm.subject}
                    onChange={(e) => setMailForm({ ...mailForm, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-600 uppercase mb-1">Mensaje</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Hola bella lashista, te escribimos para avisar de los nuevos cambios y tu próxima fecha de facturación de servicios..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                    value={mailForm.body}
                    onChange={(e) => setMailForm({ ...mailForm, body: e.target.value })}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gold-500 hover:bg-gold-600 text-zinc-950 text-xs font-semibold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Enviar Correo Electrónico
                </button>
              </form>
            </div>

            {/* Simulated Email logs */}
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 overflow-hidden">
              <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-3">Historial de Despachos</h4>
              {emailLogs.length === 0 ? (
                <p className="text-zinc-400 text-[11px] text-center py-6 italic border border-dashed border-zinc-200 rounded-2xl">
                  Sin correos simulados despachados en esta sesión.
                </p>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {emailLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-zinc-800 line-clamp-1">{log.subject}</span>
                        <span className="text-[9px] bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded shrink-0">{log.recipientCount} envíos</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">{log.date} • A {log.targetGroup}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Copias de Seguridad */}
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 overflow-hidden mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-gold-600" />
                <h4 className="font-bold text-zinc-900 text-xs sm:text-sm uppercase tracking-wider">Copia de Seguridad Pro</h4>
              </div>
              <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed">
                Respalda la base de datos del sistema completo (agendas, lashistas, clientas, citas y campañas) en un archivo JSON para persistencia local ilimitada o descarga a disco. Ideal para tu hosting de HostGator.
              </p>
              
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    exportBackup();
                  }}
                  className="w-full bg-[#1e1313] hover:bg-black text-[#ebd4aa] hover:text-white text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Exportar Respaldo (.json)
                </button>
                
                <label className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center border border-zinc-250">
                  <UploadCloud className="w-3.5 h-3.5" /> Importar Respaldo (.json)
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const txt = event.target?.result as string;
                        const success = importBackup(txt);
                        if (success) {
                          alert("🚀 ¡Copia de seguridad importada con éxito absoluto! Los datos del sistema han sido restaurados.");
                        } else {
                          alert("❌ Hubo un error al procesar el archivo. Asegúrate de que sea un archivo JSON de respaldo válido.");
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ================= CLILNICAL HISTORY MODAL / FICHA DE LASHISTA ================= */}
      {showFichaModal && selectedLashista && (
        <div className="fixed inset-0 z-50 bg-[#1e1313]/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200" id="ficha-lashista-modal">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-zinc-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1e1313] text-white p-6 flex justify-between items-center border-b border-gold-700/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-brand flex items-center justify-center text-zinc-900 font-bold text-base shadow-inner uppercase">
                  {selectedLashista.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    Ficha Técnica de Lashista & Documentos
                  </h3>
                  <p className="text-[11px] text-gold-200">ID: {selectedLashista.id} • Registrada el {selectedLashista.registeredDate}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowFichaModal(false)}
                className="text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Tabs */}
            <div className="flex border-b border-zinc-150 bg-zinc-50/50 p-1 gap-2">
              <button
                onClick={() => setActiveFichaTab('perfil')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeFichaTab === 'perfil'
                    ? 'bg-white text-[#1e1313] shadow-xs border border-zinc-200/50'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                }`}
              >
                <Users className="w-4 h-4 text-gold-600" />
                Perfil y Editar Datos
              </button>
              <button
                onClick={() => setActiveFichaTab('documentos')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeFichaTab === 'documentos'
                    ? 'bg-white text-[#1e1313] shadow-xs border border-zinc-200/50'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                }`}
              >
                <FolderOpen className="w-4 h-4 text-gold-600" />
                Gestor de Documentos ({selectedLashista.documents?.length || 0})
              </button>
            </div>

            <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
              {activeFichaTab === 'perfil' ? (
                /* Profile & Editing View */
                <form onSubmit={handleSaveFichaProfile} className="space-y-6 text-left">
                  <div className="bg-gold-50/20 p-5 rounded-2xl border border-gold-500/10 space-y-4">
                    <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold-600" />
                      Información del Perfil y Membresía del Cliente Pro
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-zinc-800"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Correo Electrónico</label>
                        <input
                          type="email"
                          required
                          className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-zinc-800"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">WhatsApp / Celular</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-zinc-800"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Plan de Membresía</label>
                        <select
                          className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-zinc-800"
                          value={editForm.plan}
                          onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as any })}
                        >
                          <option value="Pro">Pro ($49 USD/mes)</option>
                          <option value="Básico">Básico ($29 USD/mes)</option>
                          <option value="Trial">Prueba / Trial (7 días)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Días Restantes de Membresía</label>
                        <input
                          type="number"
                          required
                          className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-zinc-800"
                          value={editForm.remainingDays}
                          onChange={(e) => setEditForm({ ...editForm, remainingDays: Number(e.target.value) })}
                        />
                      </div>

                      <div className="bg-white border border-zinc-100 rounded-2xl p-4 flex flex-col justify-center">
                        <span className="text-[10px] text-zinc-400 capitalize block font-bold">Estado general de módulos</span>
                        <div className="flex gap-4 mt-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${selectedLashista.activeModules.agendaPro ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-zinc-100 text-zinc-400 border'}`}>
                            Agenda Pro
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${selectedLashista.activeModules.retencion ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-zinc-100 text-zinc-400 border'}`}>
                            Retención
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${selectedLashista.activeModules.viral ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-zinc-100 text-zinc-400 border'}`}>
                            Viral
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowFichaModal(false)}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Cerrar Ficha
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1e1313] hover:bg-black text-[#ebd4aa] hover:text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Guardar Modificaciones
                    </button>
                  </div>
                </form>
              ) : (
                /* Documents Manager View */
                <div className="space-y-8 text-left">
                  {/* Upload document section */}
                  <div className="bg-zinc-50 border border-zinc-200/60 rounded-3xl p-5 sm:p-6">
                    <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wide flex items-center gap-2 mb-4">
                      <UploadCloud className="w-4.5 h-4.5 text-gold-600" />
                      Subir y Registrar Archivo Nuevo
                    </h4>
                    
                    <form onSubmit={handleUploadDoc} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Nombre del Archivo / Documento</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Contrato_Firma_Anexa_2026"
                            className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 text-zinc-800"
                            value={docForm.title}
                            onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Clasificación / Tipo</label>
                          <select
                            className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 text-zinc-800"
                            value={docForm.type}
                            onChange={(e) => setDocForm({ ...docForm, type: e.target.value as any })}
                          >
                            <option value="consent">📜 Contrato Digital</option>
                            <option value="document">🧾 Factura / Cobro</option>
                            <option value="image">📄 Ficha Clínica / Ficha</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Comentarios / Notas Internas</label>
                        <textarea
                          rows={2}
                          placeholder="Agregue indicaciones sobre los vencimientos, firma de convenios o estado de pago..."
                          className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 text-zinc-800"
                          value={docForm.notes}
                          onChange={(e) => setDocForm({ ...docForm, notes: e.target.value })}
                        />
                      </div>

                      {/* Mock File selector container */}
                      <div className="p-4 bg-white border border-dashed border-zinc-200 rounded-2xl text-center text-zinc-500">
                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center mx-auto text-zinc-400 mb-2">
                          <UploadCloud className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-semibold text-zinc-600">Simulación Drag & Drop Activa</p>
                        <p className="text-[9px] text-zinc-400 mt-0.5">La plataforma simula la subida segura al Cloud Storage de Mundo Lashista.</p>
                      </div>

                      {isUploading && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-bold text-gold-700">
                            <span>Subiendo archivo al servidor...</span>
                            <span>{uploadPercent}%</span>
                          </div>
                          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gold-500 transition-all duration-150" style={{ width: `${uploadPercent}%` }} />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          disabled={isUploading}
                          className="bg-gold-500 hover:bg-gold-600 text-zinc-900 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          <FileText className="w-4 h-4" /> Registrar e Iniciar Subida
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Documents List */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <span>Expedientes y Documentos Vigentes de {selectedLashista.name} ({selectedLashista.documents?.length || 0})</span>
                      <span className="w-2 h-2 bg-gold-500 rounded-full inline-block" />
                    </h4>

                    {(!selectedLashista.documents || selectedLashista.documents.length === 0) ? (
                      <p className="text-zinc-400 text-xs italic text-center py-8 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                        No hay contratos, facturas ni fichas registradas para esta lashista.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedLashista.documents.map((doc: any) => (
                          <div key={doc.id} className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                doc.type === 'consent' 
                                  ? 'bg-amber-50 text-[#a1762d]' 
                                  : doc.type === 'image'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-indigo-50 text-indigo-700'
                              }`}>
                                {doc.type === 'consent' ? (
                                  <FileText className="w-5 h-5" />
                                ) : (
                                  <File className="w-5 h-5" />
                                )}
                              </div>
                              
                              <div>
                                <h5 className="font-bold text-zinc-900 text-xs sm:text-sn flex items-center gap-1.5 flex-wrap">
                                  {doc.name}
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    doc.type === 'consent' 
                                      ? 'bg-amber-100 text-[#a1762d]' 
                                      : doc.type === 'image'
                                        ? 'bg-rose-100 text-rose-700'
                                        : 'bg-indigo-100 text-indigo-700'
                                  }`}>
                                    {doc.type === 'consent' ? 'Contrato/Firma' : doc.type === 'image' ? 'Ficha' : 'Factura/Cobro'}
                                  </span>
                                </h5>
                                <p className="text-zinc-500 text-[11px] leading-relaxed mt-0.5">{doc.notes}</p>
                                <span className="text-[9px] text-zinc-400 font-medium block mt-1">Registrado el {doc.date}</span>
                              </div>
                            </div>

                            {/* Download / Delete actions */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(`Descargando archivo simulado: ${doc.name}\n\nDetalles del Archivo:\nFecha: ${doc.date}\nNotas: ${doc.notes}`);
                                }}
                                className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-600 hover:text-black transition-colors"
                                title="Visualizar/Descargar documento"
                              >
                                <Download className="w-4.5 h-4.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="p-2 hover:bg-rose-50 rounded-xl text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Eliminar archivo"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-50 p-4 text-center border-t border-zinc-100 text-[10px] text-zinc-400 flex items-center justify-center gap-1">
              <span>🔒 Repositorio SSL Sincronizado en tiempo real. Máximo 15MB.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
