/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AgendaProModule } from './AgendaProModule';
import { 
  Sparkles, 
  Calendar, 
  Gift, 
  Share2, 
  Lock, 
  Home, 
  Settings, 
  LogOut, 
  ChevronRight, 
  VolumeX, 
  TrendingUp, 
  MessageSquare,
  Sparkle,
  Copy,
  ExternalLink,
  Crown,
  User,
  Bell,
  HelpCircle,
  Send,
  Check,
  Database,
  UploadCloud,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LashistaPanel: React.FC = () => {
  const { 
    currentLashista, 
    setCurrentRole, 
    setCurrentLashista, 
    activeMainView, 
    setActiveMainView,
    updateLashistaPlan,
    updateLashista,
    clientas,
    appointments,
    exportBackup,
    importBackup
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('crm'); // Default agenda-pro views: 'crm' | 'agenda' | 'ofertas' | 'whatsapp'
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  // Custom external links customizers
  const [retencionUrl, setRetencionUrl] = useState('https://lash-pros-planner.lovable.app/');
  const [viralUrl, setViralUrl] = useState('https://referidoslashes.com/margarita');
  const [isCopiedRet, setIsCopiedRet] = useState(false);
  const [isCopiedViral, setIsCopiedViral] = useState(false);

  // States for Personal Profile, Sender Email and Bot WhatsApp Number Configuration
  const [profileForm, setProfileForm] = useState({
    name: currentLashista?.name || '',
    email: currentLashista?.email || '',
    phone: currentLashista?.phone || '',
    senderEmail: currentLashista?.notificationSenderEmail || 'notificaciones@estudiolash.com',
    whatsappBot: currentLashista?.whatsappBotNumber || '+56 9 8765 4321'
  });
  const [isSaving, setIsSaving] = useState(false);

  // Sync state values if currentLashista updates
  useEffect(() => {
    if (currentLashista) {
      setProfileForm({
        name: currentLashista.name,
        email: currentLashista.email,
        phone: currentLashista.phone,
        senderEmail: currentLashista.notificationSenderEmail || 'notificaciones@estudiolash.com',
        whatsappBot: currentLashista.whatsappBotNumber || '+56 9 8765 4321'
      });
    }
  }, [currentLashista]);

  // Integrated IA Lashista Support Assistant State
  const [panelChatInput, setPanelChatInput] = useState('');
  const [panelChatHistory, setPanelChatHistory] = useState<any[]>([
    {
      id: 'l-welcome',
      sender: 'bot',
      text: `¡Hola bella lashista! 💖 Me alegra saludarte. Soy tu asistente personal de **Soporte IA Pro** para soporte rápido.\n\nPuedo asesorarte sobre cómo operar la agenda, sacarle provecho al WhatsApp bot o resolver tus inquietudes operativas.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [panelChatLoading, setPanelChatLoading] = useState(false);
  const panelChatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll integrated chat
  useEffect(() => {
    if (activeMainView === 'perfil-personal') {
      panelChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [panelChatHistory, activeMainView]);

  const handlePanelSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || panelChatLoading) return;

    const userMsgId = `panel-msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPanelChatHistory(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: textToSend,
        time: timestamp
      }
    ]);

    setPanelChatInput('');
    setPanelChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: `Lashista ${currentLashista?.name || 'Desconocida'} pregunta: ${textToSend}` 
        })
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      setPanelChatHistory(prev => [
        ...prev,
        {
          id: `panel-bot-${Date.now()}`,
          sender: 'bot',
          text: data.text || 'Entendido. ¿Tienes alguna otra consulta?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      // Fallback
      setPanelChatHistory(prev => [
        ...prev,
        {
          id: `panel-bot-fallback-${Date.now()}`,
          sender: 'bot',
          text: `🤖 **[Modo Soporte Sin Conexión]**\n\nNo pudimos procesar la consulta con la API de Gemini en tiempo real. \n\nNo te preocupes, puedes seguir configurando tu correo remitente, cambiar tu WhatsApp del bot o editar tus datos. ¡Todo se guardará instantáneamente!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setPanelChatLoading(false);
    }
  };

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email || !profileForm.phone) {
      alert('Por favor complete todos los datos personales.');
      return;
    }

    setIsSaving(true);
    
    setTimeout(() => {
      if (currentLashista) {
        updateLashista(currentLashista.id, {
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          notificationSenderEmail: profileForm.senderEmail,
          whatsappBotNumber: profileForm.whatsappBot
        });
      }
      setIsSaving(false);
      alert('¡Tus ajustes de perfil, correo de remisión y número del canal WhatsApp del bot se guardaron correctamente!');
    }, 600);
  };

  if (!currentLashista) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl max-w-md w-full border border-zinc-100 shadow-sm">
          <p className="text-zinc-500 mb-4">No se ha detectado una sesión activa para esta Lashista.</p>
          <button 
            onClick={() => setCurrentRole('public')}
            className="bg-[#1e1313] text-white py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold inline-block"
          >
            Volver a la Página Principal
          </button>
        </div>
      </div>
    );
  }

  // Check if current module is active based on Admin configuration or plan
  const hasAccessTo = (module: 'agendaPro' | 'retencion' | 'viral') => {
    return currentLashista.activeModules[module];
  };

  const handleSimulatedUpgrade = () => {
    updateLashistaPlan(currentLashista.id, 'Pro');
    alert('¡Suscripción actualizada a Pro con éxito! Se han activado todos los módulos en tiempo real.');
  };

  const todayAppointments = appointments.filter(app => app.date === '2026-05-24');

  return (
    <div className="min-h-screen bg-[#fdfaf7] text-[#2b1f1f] flex flex-col md:flex-row">
      
      {/* Sidebar Layout */}
      <aside className="w-full md:w-64 bg-[#1e1313] text-white shrink-0 flex flex-col justify-between border-r border-gold-700/20" id="lashista-sidebar">
        
        {/* Sidebar Header */}
        <div>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-brand flex items-center justify-center">
                <Sparkles className="text-[#a1762d] w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight">Mundo Lashista Pro</h1>
                <p className="text-[9px] text-zinc-400 capitalize">Portal Miembros</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setCurrentRole('public');
                setCurrentLashista(null);
              }}
              className="p-1 text-zinc-400 hover:text-white rounded"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* User profile brief */}
          <div className="p-5 border-b border-white/5 bg-white/2">
            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">¡Hola, hermosa! 💝</p>
            <h2 className="text-sm font-bold text-white mt-1">{currentLashista.name}</h2>
            <p className="text-[10px] text-zinc-500 font-mono inline-block">{currentLashista.phone}</p>
            
            <div className="mt-3 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                currentLashista.plan === 'Pro' 
                  ? 'bg-amber-500/10 text-gold-200 border border-gold-500/20' 
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                Plan {currentLashista.plan} {currentLashista.plan === 'Pro' && '⭐'}
              </span>
              
              {currentLashista.plan !== 'Pro' && (
                <button 
                  onClick={handleSimulatedUpgrade}
                  className="text-[9px] bg-gold-500 hover:bg-gold-600 text-[#1e1313] px-2 py-0.5 rounded font-bold transition-all flex items-center gap-0.5"
                >
                  <Crown className="w-2.5 h-2.5" /> Subir a Pro
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1" id="sidebar-nav">
            
            {/* Inicio Dashboard */}
            <button 
              onClick={() => {
                setActiveMainView('inicio');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainView === 'inicio' ? 'bg-[#ebd4aa]/10 text-gold-200' : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Panel de Inicio</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* Asistente Agenda Pro */}
            <button 
              onClick={() => {
                if (hasAccessTo('agendaPro')) {
                  setActiveMainView('agenda-pro');
                } else {
                  alert('El módulo de Agenda Pro ha sido pausado. Comunícate con la Administradora del Sistema.');
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainView === 'agenda-pro' ? 'bg-[#ebd4aa]/10 text-gold-200' : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Asistente Agenda Pro</span>
              </div>
              <span className="bg-[#ebd4aa]/25 text-gold-200 rounded px-1 text-[9px]">4 tabs</span>
            </button>

            {/* Módulo Retención (External Direct Link) */}
            <button 
              onClick={() => {
                setActiveMainView('retencion');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainView === 'retencion' ? 'bg-[#ebd4aa]/10 text-gold-200' : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <span>Sistema de Retención</span>
              </div>
              {!hasAccessTo('retencion') ? (
                <Lock className="w-3 h-3 text-gold-500/80" />
              ) : (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded px-1.5 py-0.2 text-[8px]">Link</span>
              )}
            </button>

            {/* Módulo Viral (External Direct Link) */}
            <button 
              onClick={() => {
                setActiveMainView('sistema-viral');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainView === 'sistema-viral' ? 'bg-[#ebd4aa]/10 text-gold-200' : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>Sistema Viral Lashista</span>
              </div>
              {!hasAccessTo('viral') ? (
                <Lock className="w-3 h-3 text-gold-500/80" />
              ) : (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded px-1.5 py-0.2 text-[8px]">Link</span>
              )}
            </button>

            {/* Mi Perfil y Ajustes Pro */}
            <button 
              onClick={() => {
                setActiveMainView('perfil-personal');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainView === 'perfil-personal' ? 'bg-[#ebd4aa]/10 text-gold-200' : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Mi Perfil y Ajustes</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-white/5 text-[11px] text-zinc-400">
          <div className="bg-white/2 p-2 rounded-lg border border-white/5">
            <span className="text-zinc-500 block text-[9px]">DIRECCIÓN COMERCIAL</span>
            <span className="text-white block font-medium">Beauty Lash Studio SCL</span>
          </div>

          <button 
            onClick={() => {
              setCurrentRole('public');
              setCurrentLashista(null);
            }}
            className="w-full mt-4 py-2 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            ← Volver a Landing
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8" id="lashista-main-workspace">
        
        {/* State Banner Warn / Info */}
        {currentLashista.plan === 'Trial' && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold">⏱</span>
              <div>
                <strong className="text-xs text-orange-900 block font-semibold">Período de Prueba Activo</strong>
                <span className="text-xs text-orange-700">Te quedan {currentLashista.remainingDays} días de prueba gratuita. Tu plan básico no tiene enlace viral.</span>
              </div>
            </div>
            <button 
              onClick={handleSimulatedUpgrade}
              className="bg-gold-500 hover:bg-gold-600 text-[#1e1313] font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm"
            >
              Actualizar a Pro ⭐
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* Dashboard INICIO Layout */}
          {activeMainView === 'inicio' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Profile welcome */}
              <div className="bg-gradient-to-r from-[#ebd4aa]/20 to-[#f5cfcf]/20 p-6 sm:p-8 rounded-3xl border border-[#ebd4aa]/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[#a1762d] text-xs font-bold uppercase tracking-wider">Espacio de Trabajo Autorizado</span>
                    <h3 className="text-2xl font-bold text-zinc-900 mt-1">¡Bienvenida de vuelta, {currentLashista.name}! ✨</h3>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-1">Gestiona las reservas de tus clientas, el bot de WhatsApp y la fidelización en un solo lugar.</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 mt-2 sm:mt-0">
                    <a 
                      href={`${window.location.origin}${window.location.pathname}?booking=${currentLashista.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-amber-500/10 hover:bg-amber-500/20 text-[#a1762d] border border-[#ebd4aa]/50 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Share2 className="w-4 h-4" /> Probar mi Link de Reservas ↗
                    </a>
                    <button 
                      onClick={() => {
                        if (hasAccessTo('agendaPro')) {
                          setActiveMainView('agenda-pro');
                        }
                      }}
                      className="bg-[#1e1313] hover:bg-black text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Calendar className="w-4 h-4" /> Programar Nueva Cita
                    </button>
                  </div>
                </div>
              </div>

              {/* CRM Brief counters & widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
                  <span className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">Mis Clientas en CRM</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-zinc-900">{clientas.length}</span>
                    <span className="text-zinc-400 text-[10px] font-medium">Lash-Studio activas</span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveMainView('agenda-pro');
                      setActiveSubTab('crm');
                    }}
                    className="text-xs text-[#a1762d] font-semibold hover:underline mt-4 block"
                  >
                    Ver listado completo →
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
                  <span className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">Citas Totales Agendadas</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-[#a1762d]">{appointments.length}</span>
                    <span className="text-zinc-400 text-[10px]">reservas registradas</span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveMainView('agenda-pro');
                      setActiveSubTab('agenda');
                    }}
                    className="text-xs text-[#a1762d] font-semibold hover:underline mt-4 block"
                  >
                    Ir al Calendario →
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
                  <span className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">Campañas Operativas</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-zinc-900">1 Activa</span>
                    <span className="text-zinc-400 text-[11px] font-mono">2 creadas</span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveMainView('agenda-pro');
                      setActiveSubTab('ofertas');
                    }}
                    className="text-xs text-[#a1762d] font-semibold hover:underline mt-4 block"
                  >
                    Controlar Ofertas automáticas →
                  </button>
                </div>

              </div>

              {/* Appointments List for Today */}
              <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm small-caption">Próximas Reservas de Hoy (24 de Mayo 2026)</h4>
                    <p className="text-zinc-500 text-[11px]">Lista de reservas ingresadas.</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono bg-zinc-100 py-1 px-3 rounded-full text-zinc-600 font-semibold">Hoy</span>
                </div>

                {todayAppointments.length === 0 ? (
                  <p className="text-zinc-400 text-xs text-center py-6 border border-zinc-100 rounded-xl bg-zinc-50/50">
                    No tienes citas estimadas para hoy. ¡Aprovecha de añadir nuevas clientas!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {todayAppointments.map((app) => (
                      <div key={app.id} className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-wrap justify-between items-center gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="bg-gold-500 text-zinc-950 font-bold px-2 py-1 rounded text-[11px] shrink-0">{app.time}</span>
                          <div>
                            <span className="font-bold text-zinc-800 block text-xs">{app.clientaName}</span>
                            <span className="text-[10px] text-zinc-500">{app.service} • {app.duration} min</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                          <button 
                            onClick={() => {
                              setActiveMainView('agenda-pro');
                              setActiveSubTab('agenda');
                            }}
                            className="bg-white hover:bg-zinc-100 text-[11px] text-zinc-700 font-semibold border border-zinc-200 px-2.5 py-1 rounded-md"
                          >
                            Ver en Agenda
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct access to modules visual guide */}
              <div className="bg-[#1e1313] text-white p-6 rounded-3xl border border-white/5">
                <h4 className="font-bold text-sm text-gold-200 mb-2">💡 Guía Rápida de Módulos Externos</h4>
                <p className="text-zinc-300 text-xs leading-relaxed max-w-3xl mb-4">
                  Por instrucción comercial, "Sistema de Retención" y "Sistema Viral" están creados y enlazados externamente. Aquí puedes configurar su redireccionador, auditar clics, ver estadísticas estimadas y copiar enlaces comerciales.
                </p>
              </div>

            </motion.div>
          )}

          {/* Agenda Pro Module Container */}
          {activeMainView === 'agenda-pro' && (
            <motion.div 
              key="agenda" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-4"
            >
              <AgendaProModule initialTab={activeSubTab} onTabChange={setActiveSubTab} />
            </motion.div>
          )}

          {/* RETENCION VIEW (DIRECT REDIRECT ACCESS EXPERIENCE) */}
          {activeMainView === 'retencion' && (
            <motion.div 
              key="retencion"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {!hasAccessTo('retencion') ? (
                // Lock screen if not part of active permissions
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 text-center border border-zinc-200/60 max-w-xl mx-auto shadow-sm">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-gold-600 mx-auto mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">Módulo Bloqueado: Retención de Clientas</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    El sistema de fidelización y encuestas no está habilitado en tu suscripción Básica. Solicítale a tu administradora activarlo o sube a Plan Pro.
                  </p>
                  
                  <div className="mt-8 flex justify-center gap-3">
                    <button 
                      onClick={() => setActiveMainView('inicio')}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs py-2.5 px-6 rounded-xl transition-all"
                    >
                      Volver
                    </button>
                    <button 
                      onClick={handleSimulatedUpgrade}
                      className="bg-gold-500 hover:bg-gold-600 text-[#1e1313] font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-sm"
                    >
                      Subir a Plan Pro ⭐
                    </button>
                  </div>
                </div>
              ) : (
                // Retención Module Dashboard
                <div className="space-y-6">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-[#a1762d] text-xs font-bold uppercase tracking-wider">Acceso Directo</span>
                      <h3 className="text-2xl font-bold text-zinc-900 mt-1">Sistema de Retención de Clientas ❤️</h3>
                      <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">Controla encuestas automáticas post-cita y cupones de fidelización.</p>
                    </div>

                    <a 
                      href={retencionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#1e1313] hover:bg-black text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm"
                      id="btn-ext-fideliza"
                    >
                      Abrir Plataforma Externa <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Operational Settings Widget */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Fidelity settings */}
                    <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 md:col-span-2">
                      <h4 className="font-bold text-zinc-800 text-sm mb-4">Configurar URL de Enrutamiento</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-600 uppercase mb-1">Enlace de Fidelización Personalizada</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#a1762d] font-mono text-zinc-700"
                              value={retencionUrl}
                              onChange={(e) => setRetencionUrl(e.target.value)}
                            />
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(retencionUrl);
                                setIsCopiedRet(true);
                                setTimeout(() => setIsCopiedRet(false), 2000);
                              }}
                              className="bg-zinc-100 text-zinc-700 text-xs px-3 rounded-xl border border-zinc-200 hover:bg-zinc-200 transition-all flex items-center justify-center gap-1 shrink-0"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{isCopiedRet ? 'Copiado' : 'Copiar'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Customer points rule simulation */}
                        <div className="p-4 bg-gold-50/40 rounded-2xl border border-gold-100/50">
                          <h5 className="font-bold text-xs text-zinc-800">Regla Estándar de Retención:</h5>
                          <p className="text-zinc-500 text-[11px] mt-1 leading-relaxed">
                            Las clientas acumulan 1 punto por cada $10 USD gastados en tu salón lashista. Al llegar a 10 puntos, el sistema genera automáticamente un cupón virtual de 15% de descuento enviado por WhatsApp.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats side */}
                    <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6">
                      <h4 className="font-bold text-zinc-800 text-xs uppercase tracking-wider mb-4">Auditoría Retención Pro</h4>
                      
                      <div className="space-y-4 text-xs">
                        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 flex justify-between items-center">
                          <span className="text-zinc-500 font-medium">Tasa de Fidelidad:</span>
                          <span className="font-bold text-emerald-600 font-mono">82.4%</span>
                        </div>
                        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 flex justify-between items-center">
                          <span className="text-zinc-500 font-medium font-sans">Cupones Otorgados:</span>
                          <span className="font-bold text-zinc-800 font-mono">24</span>
                        </div>
                        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 flex justify-between items-center">
                          <span className="text-zinc-500 font-medium">Encuestas Enviadas:</span>
                          <span className="font-bold text-[#a1762d] font-mono">118</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* VIRAL VIEW (DIRECT REDIRECT VIRAL SYSTEM ACCESSIBILITY) */}
          {activeMainView === 'sistema-viral' && (
            <motion.div 
              key="sistema-viral"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {!hasAccessTo('viral') ? (
                // Lock screen
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 text-center border border-zinc-200/60 max-w-xl mx-auto shadow-sm">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-gold-600 mx-auto mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">Módulo Bloqueado: Sistema Viral</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    El sistema viral de referidos automáticos no está habilitado en tu cuenta actual de Lashista. Solicítale a tu administradora activarlo o sube a Plan Pro.
                  </p>
                  
                  <div className="mt-8 flex justify-center gap-3">
                    <button 
                      onClick={() => setActiveMainView('inicio')}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs py-2.5 px-6 rounded-xl transition-all"
                    >
                      Volver
                    </button>
                    <button 
                      onClick={handleSimulatedUpgrade}
                      className="bg-gold-500 hover:bg-gold-600 text-[#1e1313] font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-sm"
                    >
                      Subir a Plan Pro ⭐
                    </button>
                  </div>
                </div>
              ) : (
                // Viral system active view
                <div className="space-y-6">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-[#a1762d] text-xs font-bold uppercase tracking-wider">Acceso Directo</span>
                      <h3 className="text-2xl font-bold text-zinc-900 mt-1">Sistema Viral Lashista Pro 📣</h3>
                      <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">Potencia referidos dándole cupones dinámicos a amigas recomendadas.</p>
                    </div>

                    <a 
                      href={viralUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#1e1313] hover:bg-black text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm"
                      id="btn-ext-viral"
                    >
                      Abrir Portal Viral <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Settings URL */}
                    <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 md:col-span-2">
                      <h4 className="font-bold text-zinc-800 text-sm mb-4">Configurar URL de Referidos Cosméticos</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-600 uppercase mb-1">Manejo Enlace Viral Base</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#a1762d] font-mono text-zinc-700"
                              value={viralUrl}
                              onChange={(e) => setViralUrl(e.target.value)}
                            />
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(viralUrl);
                                setIsCopiedViral(true);
                                setTimeout(() => setIsCopiedViral(false), 2000);
                              }}
                              className="bg-zinc-100 text-zinc-700 text-xs px-3 rounded-xl border border-zinc-200 hover:bg-zinc-200 transition-all flex items-center justify-center gap-1 shrink-0"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{isCopiedViral ? 'Copiado' : 'Copiar'}</span>
                            </button>
                          </div>
                        </div>

                        {/* referral reward rule summary */}
                        <div className="p-4 bg-pink-50/40 rounded-2xl border border-[#f5cfcf]/50">
                          <h5 className="font-bold text-xs text-zinc-800">Incentivo de Viralización:</h5>
                          <ul className="mt-2 text-zinc-500 text-[11px] space-y-1.5 list-disc list-inside">
                            <li><strong>Para la referida:</strong> Obtiene un cupón inmediato de $5 USD en su primer servicio.</li>
                            <li><strong>Para la patrocinadora (tu cliente):</strong> Recibe un código de $5 USD por cada recomendada efectiva que concrete su cita.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Referral log list */}
                    <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 text-xs">
                      <h4 className="font-bold text-zinc-800 text-xs uppercase tracking-wider mb-3">Recomendaciones del Mes</h4>
                      
                      <div className="space-y-2.5">
                        <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl flex justify-between">
                          <div>
                            <span className="font-bold text-zinc-800 block">Isidora Valenzuela</span>
                            <span className="text-[10px] text-zinc-400">Referido por Camila Rojas</span>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px] h-fit">Consumido</span>
                        </div>

                        <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl flex justify-between">
                          <div>
                            <span className="font-bold text-zinc-800 block">Javiera Torres</span>
                            <span className="text-[10px] text-zinc-400">Referido por Valentina Soto</span>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded text-[9px] h-fit">Pendiente</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeMainView === 'perfil-personal' && (
            <motion.div 
              key="perfil-personal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-left"
            >
              <div>
                <span className="text-[#a1762d] text-xs font-bold uppercase tracking-wider">Ajustes de Cuenta y Automatización</span>
                <h3 className="text-2xl font-bold text-zinc-900 mt-1">Mi Perfil y Canales de Comunicación 🛠️</h3>
                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">Controla tus datos, define el correo remitente y gestiona el número de WhatsApp para el bot de reservas.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Column 1: Config (6 spans) */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-zinc-150 shadow-sm p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                  <form onSubmit={handleSaveProfileSettings} className="space-y-6 text-left">
                    
                    {/* Sección 1: Datos Personales */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-[#1e1313] uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                        <User className="w-4 h-4 text-gold-600 animate-pulse" />
                        Datos del Perfil Lashista
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nombre Completo</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 font-medium text-zinc-800"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Teléfono Principal</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 font-medium text-zinc-800"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Correo Electrónico de Contacto</label>
                        <input
                          type="email"
                          required
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 font-medium text-zinc-800"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Sección 2: Canales y Automatización (Remitente Correo & WhatsApp Bot) */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-extrabold text-[#1e1313] uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                        <Bell className="w-4 h-4 text-gold-600" />
                        Canales de Envío y Notificaciones
                      </h4>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Correo Remitente para Notificaciones</label>
                        <input
                          type="email"
                          required
                          placeholder="ejemplo@tu-estudio.com"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 font-mono text-zinc-700 font-semibold"
                          value={profileForm.senderEmail}
                          onChange={(e) => setProfileForm({ ...profileForm, senderEmail: e.target.value })}
                        />
                        <p className="text-[10px] text-zinc-400 mt-1">Dirección de correo personalizada utilizada para despachar avisos automáticos y facturación a tus clientas.</p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Número de WhatsApp del Bot</label>
                        <input
                          type="text"
                          required
                          placeholder="ej. +34 600 000 000"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 font-mono text-zinc-700 font-semibold"
                          value={profileForm.whatsappBot}
                          onChange={(e) => setProfileForm({ ...profileForm, whatsappBot: e.target.value })}
                        />
                        <p className="text-[10px] text-zinc-400 mt-1">Línea telefónica asignada y validada para que tu asistente de reservas virtual despache mensajes en tu nombre.</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#1e1313] hover:bg-black text-[#ebd4aa] hover:text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>Guardando cambios...</>
                        ) : (
                          <>
                            <Check className="w-4.5 h-4.5" /> Guardar Todos los Ajustes
                          </>
                        )}
                      </button>
                    </div>

                  </form>

                  {/* Personal Account Backup and Recovery */}
                  <div className="mt-8 pt-6 border-t border-zinc-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-gold-600" />
                      <h4 className="font-bold text-zinc-900 text-xs sm:text-sm uppercase tracking-wider">Respaldo y Guardado de Datos Personal</h4>
                    </div>
                    <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed">
                      Descarga un archivo local conteniendo todas tus clientas, notas de diseño lashista, consentimientos digitales y citas agendadas, o restáuralas en cualquier momento para mantener tus datos 100% persistentes y seguros.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          exportBackup();
                        }}
                        className="bg-[#fcf7ee] hover:bg-[#ebd4aa]/20 border border-[gold-500]/30 text-zinc-800 text-xs font-bold py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#a1762d]" /> Exportar Respaldo
                      </button>
                      
                      <label className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-250 text-zinc-700 text-xs font-bold py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center">
                        <UploadCloud className="w-4 h-4 text-zinc-500" /> Importar Respaldo
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
                                alert("🚀 ¡Copia de seguridad importada con éxito absoluto! Tu agenda, clientes y fichas clínicas han sido restauradas en el navegador.");
                                window.location.reload();
                              } else {
                                alert("❌ Hubo un error al procesar el archivo. Asegúrate de que sea un archivo JSON válido exportado previamente.");
                              }
                            };
                            reader.readAsText(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Column 2: IA Support Chat (6 spans) */}
                <div className="lg:col-span-6 bg-[#1e1313] text-white rounded-3xl border border-gold-900/10 shadow-xl overflow-hidden flex flex-col h-[580px]" id="lashista-integrated-support">
                  {/* Chat header */}
                  <div className="bg-[#150c0c] p-4 border-b border-gold-800/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold-500/15 text-gold-300 flex items-center justify-center border border-gold-600/20">
                        <Sparkles className="w-4.5 h-4.5 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                          Soporte IA Mundo Lashista 24/7
                          <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse" />
                        </h4>
                        <p className="text-[9px] text-zinc-400">Canal exclusivo para lashistas certificadas</p>
                      </div>
                    </div>
                    <span className="bg-[#ebd4aa]/15 text-[#ebd4aa] text-[9px] px-2 py-0.5 rounded-full border border-[#ebd4aa]/10">Gemini 3.5 AI</span>
                  </div>

                  {/* Messages container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1e1313]/98">
                    {panelChatHistory.map((msg, i) => (
                      <div
                        key={msg.id || i}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap text-left ${
                            msg.sender === 'user'
                              ? 'bg-[#ebd4aa] text-zinc-950 rounded-br-none shadow-sm'
                              : 'bg-white/5 text-zinc-100 border border-white/5 rounded-bl-none shadow-xs'
                          }`}
                        >
                          {/* Simplistic formatting support */}
                          {msg.text.split('\n').map((line: string, lineIdx: number) => {
                            let formattedLine = line;
                            
                            // Simple replacement of Markdown bold values
                            if (formattedLine.includes('**')) {
                              const parts = formattedLine.split('**');
                              return (
                                <p key={lineIdx} className="mb-1">
                                  {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-white">{p}</strong> : p)}
                                </p>
                              );
                            }

                            // Bullets itemizer
                            if (formattedLine.startsWith('* ')) {
                              return (
                                <div key={lineIdx} className="flex gap-1.5 pl-1.5 py-0.5 text-left">
                                  <span className="text-gold-400">•</span>
                                  <span>{formattedLine.substring(2)}</span>
                                </div>
                              );
                            }

                            return <p key={lineIdx} className={lineIdx !== 0 ? "mt-1 text-left" : "text-left"}>{formattedLine}</p>;
                          })}
                        </div>
                        <span className={`text-[9px] text-zinc-500 mt-1 px-1 font-mono ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>{msg.time}</span>
                      </div>
                    ))}

                    {/* Chat loader */}
                    {panelChatLoading && (
                      <div className="flex flex-col items-start">
                        <div className="bg-white/5 text-zinc-400 border border-white/5 rounded-2xl rounded-bl-none p-3 text-xs shadow-xs flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-[#ebd4aa] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-[#ebd4aa] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-[#ebd4aa] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="italic text-[10px] text-zinc-400 font-medium">Buscando respuesta experta...</span>
                        </div>
                      </div>
                    )}

                    <div ref={panelChatEndRef} />
                  </div>

                  {/* Suggestions quick answers pills */}
                  <div className="px-4 py-2 bg-[#170e0e] border-t border-white/5 text-left">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Inquietudes operativas comunes:</span>
                    <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
                      {[
                        '¿Cómo activo la Agenda en WhatsApp?',
                        '¿Cómo funciona el remitente personalizado?',
                        'Mi clienta no recibió confirmación, ¿cómo resolverlo?',
                        '¿Cómo programar horas bloqueadas?'
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePanelSendMessage(item)}
                          disabled={panelChatLoading}
                          className="bg-white/5 hover:bg-[#ebd4aa]/15 text-zinc-200 hover:text-[#ebd4aa] border border-white/5 hover:border-[#ebd4aa]/20 text-[9px] sm:text-[10px] py-1 px-2.5 rounded-full transition-all cursor-pointer truncate max-w-[240px]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input bar */}
                  <div className="p-3 bg-[#130b0b] border-t border-white/5 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-white/5 text-white placeholder-zinc-500 text-xs py-2.5 px-3 rounded-2xl border border-white/10 focus:outline-none focus:border-gold-500 text-left"
                      placeholder="Escribe tu consulta de soporte aquí..."
                      value={panelChatInput}
                      onChange={(e) => setPanelChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePanelSendMessage(panelChatInput);
                      }}
                      disabled={panelChatLoading}
                    />
                    <button
                      onClick={() => handlePanelSendMessage(panelChatInput)}
                      disabled={!panelChatInput.trim() || panelChatLoading}
                      className="p-2.5 bg-[#ebd4aa] hover:bg-[#ffeccb] text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl transition-all shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>
    </div>
  );
};
