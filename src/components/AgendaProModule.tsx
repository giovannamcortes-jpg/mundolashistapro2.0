/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clienta, Appointment, Campaign } from '../types';
import { 
  Users, 
  Calendar, 
  Sparkles, 
  MessageSquare, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  UserPlus, 
  Phone, 
  Check, 
  Copy, 
  Settings,
  Bell,
  Send,
  Sparkle,
  Zap,
  Mail,
  Gift,
  FileText,
  Edit,
  Upload,
  X,
  Camera,
  Shield,
  Download,
  User,
  AlertTriangle
} from 'lucide-react';

interface AgendaProModuleProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AgendaProModule: React.FC<AgendaProModuleProps> = ({ 
  initialTab = 'crm', 
  onTabChange 
}) => {
  const { 
    clientas, 
    addClienta, 
    updateClienta,
    deleteClienta,
    appointments, 
    addAppointment, 
    toggleAppointmentStatus, 
    deleteAppointment,
    campaigns, 
    addCampaign, 
    toggleCampaignActive, 
    deleteCampaign,
    workHours,
    updateWorkHours,
    currentLashista
  } = useApp();

  const customBookingUrl = currentLashista 
    ? `${window.location.origin}${window.location.pathname}?booking=${currentLashista.id}`
    : `${window.location.origin}${window.location.pathname}?booking=lash-1`;

  const [activeTab, setActiveTabState] = useState(initialTab);
  
  const handleTabClick = (tabToSet: string) => {
    setActiveTabState(tabToSet);
    if (onTabChange) {
      onTabChange(tabToSet);
    }
  };

  // State handlers for "Clientas CRM"
  const [crmSearch, setCrmSearch] = useState('');
  const [crmFilter, setCrmFilter] = useState<'All' | 'VIP' | 'Frecuente' | 'Nueva'>('All');
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    birthday: '',
    type: 'Nueva' as 'VIP' | 'Frecuente' | 'Nueva',
    lastService: 'Lifting de pestañas',
    whatsAppStatus: 'Activo' as 'Activo' | 'Pendiente'
  });

  // State handlers for "Agenda / Calendario"
  const [selectedDate, setSelectedDate] = useState('2026-05-24'); // Default date mockup focal point
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [booking, setBooking] = useState({
    clientaName: '',
    time: '11:00',
    duration: 90,
    service: 'Volumen clásico',
    status: 'Confirmado' as 'Confirmado' | 'Pendiente'
  });

  // State handlers for "Ofertas"
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [newCamp, setNewCamp] = useState({
    name: '',
    service: 'Diseño de cejas',
    dateRange: '01/06 → 30/06',
    discount: '-10%',
    active: true
  });

  // State handlers for "Bot WhatsApp"
  const [customReminderTemplate, setCustomReminderTemplate] = useState('Hola {clienta}, te recordamos tu cita de {servicio} mañana a las {hora}. Por favor responde CONFIRMAR para reservar tu bloque con nosotros 💖');
  const [simulatedAppointmentId, setSimulatedAppointmentId] = useState<string>('');
  const [chatLog, setChatLog] = useState<{ sender: 'bot' | 'client'; text: string; time: string }[]>([]);
  const [bookingLinkCopied, setBookingLinkCopied] = useState(false);

  // Clinical Record (Ficha de Historial Clinico) State handlers
  const [selectedClinicalClientId, setSelectedClinicalClientId] = useState<string | null>(null);
  const [clinicalTab, setClinicalTab] = useState<'info' | 'consent' | 'design' | 'resources'>('design');

  // Local edit states inside Clinical modal
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBirthday, setEditBirthday] = useState('');
  const [editType, setEditType] = useState<'VIP' | 'Frecuente' | 'Nueva'>('Nueva');
  const [editLastService, setEditLastService] = useState('');
  const [editAllergies, setEditAllergies] = useState('');
  const [editMedicalConditions, setEditMedicalConditions] = useState('');
  const [editClinicalNotes, setEditClinicalNotes] = useState('');
  const [editMappingStyle, setEditMappingStyle] = useState('Efecto Rímel');
  const [editMappingCurvature, setEditMappingCurvature] = useState('D');
  const [editMappingThickness, setEditMappingThickness] = useState('0.07 mm');
  const [editMappingLengths, setEditMappingLengths] = useState('9-10-11-12-11 mm');

  const activeClinicalClient = clientas.find(c => c.id === selectedClinicalClientId);

  // Sync edit states on active client changes
  React.useEffect(() => {
    if (activeClinicalClient) {
      setEditName(activeClinicalClient.name || '');
      setEditPhone(activeClinicalClient.phone || '');
      setEditEmail(activeClinicalClient.email || '');
      setEditBirthday(activeClinicalClient.birthday || '');
      setEditType(activeClinicalClient.type || 'Nueva');
      setEditLastService(activeClinicalClient.lastService || '');
      setEditAllergies(activeClinicalClient.allergies || '');
      setEditMedicalConditions(activeClinicalClient.medicalConditions || '');
      setEditClinicalNotes(activeClinicalClient.clinicalNotes || '');
      setEditMappingStyle(activeClinicalClient.mapping?.style || 'Efecto Rímel');
      setEditMappingCurvature(activeClinicalClient.mapping?.curvature || 'D');
      setEditMappingThickness(activeClinicalClient.mapping?.thickness || '0.07 mm');
      setEditMappingLengths(activeClinicalClient.mapping?.lengths || '9-10-11-12-11 mm');
    }
  }, [selectedClinicalClientId]);

  // Append new photo or document to client
  const addClinicalResource = (resource: Omit<any, 'id' | 'date'>) => {
    if (!selectedClinicalClientId || !activeClinicalClient) return;
    const newRes = {
      ...resource,
      id: `res-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    const currentResources = activeClinicalClient.resources || [];
    updateClienta(selectedClinicalClientId, {
      resources: [newRes, ...currentResources]
    });
  };

  const deleteClinicalResource = (resId: string) => {
    if (!selectedClinicalClientId || !activeClinicalClient) return;
    const currentResources = activeClinicalClient.resources || [];
    updateClienta(selectedClinicalClientId, {
      resources: currentResources.filter(r => r.id !== resId)
    });
  };

  const injectDemoPhoto = (title: string, mockUrl: string) => {
    addClinicalResource({
      type: 'image',
      name: title,
      url: mockUrl,
      notes: 'Foto cargada desde portafolio de servicio'
    });
  };

  // State handlers for "Centro de Automatizaciones"
  const [autoToggles, setAutoToggles] = useState({
    receipts: true,
    reminders: true,
    birthday: true,
    anniversary: true,
  });
  const [selectedSimClient, setSelectedSimClient] = useState('');
  const [selectedSimApp, setSelectedSimApp] = useState('');
  const [activeOverlay, setActiveOverlay] = useState<'receipt' | 'reminder' | 'birthday' | 'anniversary' | null>(null);
  const [simAlertMessage, setSimAlertMessage] = useState<string | null>(null);

  // CRM client listing handlers
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.phone) {
      alert('Por favor agrega el nombre y teléfono de tu clienta.');
      return;
    }
    
    addClienta(newClient);
    
    // Auto populate booking name picker
    setBooking(prev => ({ ...prev, clientaName: newClient.name }));
    
    // Reset CRM form and scroll
    setNewClient({
      name: '',
      phone: '',
      birthday: '15 Mar',
      type: 'Nueva',
      lastService: 'Lifting de pestañas',
      whatsAppStatus: 'Activo'
    });
    setShowAddClientForm(false);
  };

  const filteredCrm = clientas.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(crmSearch.toLowerCase()) || c.phone.includes(crmSearch);
    const matchesFilter = crmFilter === 'All' ? true : c.type === crmFilter;
    return matchesSearch && matchesFilter;
  });

  // Booking handlers
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback clientaName if none is chosen
    const resolvedName = booking.clientaName || (clientas[0] ? clientas[0].name : 'Clienta nueva');
    
    addAppointment({
      clientaName: resolvedName,
      time: booking.time,
      duration: Number(booking.duration),
      service: booking.service,
      date: selectedDate,
      status: booking.status
    });

    setBooking(prev => ({
      ...prev,
      time: '12:00',
      duration: 90
    }));
    setShowBookingForm(false);
  };

  const activeDayAppointments = appointments.filter(app => app.date === selectedDate);

  // Campaign handlers
  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamp.name) return;
    addCampaign(newCamp);
    setNewCamp({
      name: '',
      service: 'Diseño de cejas',
      dateRange: '01/06 → 30/06',
      discount: '-10%',
      active: true
    });
    setShowCampaignForm(false);
  };

  // WhatsApp Alert simulator triggers
  const triggerWhatsAppSimulation = (app: Appointment) => {
    // Replace reminder placeholders with actual citation info
    const textStr = customReminderTemplate
      .replace('{clienta}', app.clientaName)
      .replace('{servicio}', app.service)
      .replace('{hora}', app.time);

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSimulatedAppointmentId(app.id);
    setChatLog([
      {
        sender: 'bot',
        text: textStr,
        time: timeString
      }
    ]);

    // Simulate an auto confirmation reply after 1.5 seconds! Great feedback loops!
    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        {
          sender: 'client',
          text: '¡Hola hermosa! Sí, confirmo la cita para mañana sin falta. ¡Muchas gracias por recordarme! Nos vemos 💖✨',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden" id="agenda-pro-container">
      
      {/* Dynamic Sub Navigation Tab Headers */}
      <div className="bg-zinc-50 border-b border-zinc-100 p-4 sm:p-5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#a1762d]" /> Asistente Agenda Lashista Pro
          </h3>
          <p className="text-zinc-500 text-xs">Maneja tu agenda, realiza recordatorios por WhatsApp y fideliza clientas en un click.</p>
        </div>

        {/* Tab Switchers */}
        <div className="flex gap-1.5 bg-zinc-200/60 p-1 rounded-xl">
          <button 
            onClick={() => handleTabClick('crm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'crm' ? 'bg-[#1e1313] text-white shadow-sm' : 'text-zinc-600 hover:text-black'
            }`}
            id="tab-btn-crm"
          >
            Clientas CRM ({clientas.length})
          </button>
          
          <button 
            onClick={() => handleTabClick('agenda')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'agenda' ? 'bg-[#1e1313] text-white shadow-sm' : 'text-zinc-600 hover:text-black'
            }`}
            id="tab-btn-calendar"
          >
            Agenda ({appointments.length})
          </button>

          <button 
            onClick={() => handleTabClick('ofertas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ofertas' ? 'bg-[#1e1313] text-white shadow-sm' : 'text-zinc-600 hover:text-black'
            }`}
            id="tab-btn-campaigns"
          >
            Ofertas
          </button>

          <button 
            onClick={() => handleTabClick('whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'whatsapp' ? 'bg-[#1e1313] text-white shadow-sm' : 'text-zinc-600 hover:text-black'
            }`}
            id="tab-btn-whats"
          >
            Bot WhatsApp
          </button>

          <button 
            onClick={() => handleTabClick('automatizaciones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'automatizaciones' ? 'bg-[#1e1313] text-white shadow-sm' : 'text-zinc-600 hover:text-black'
            }`}
            id="tab-btn-auto"
          >
            Automatizaciones ⚡
          </button>
        </div>
      </div>

      {/* Main Tab operations */}
      <div className="p-4 sm:p-6 text-left">
        
        {/* =============== TAB MODULE 1: CLIENTAS CRM =============== */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-zinc-100 rounded-lg p-2 text-zinc-700">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Base de Datos de Clientas (CRM)</h4>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">Fidelización inteligente</p>
                </div>
              </div>

              <button 
                onClick={() => setShowAddClientForm(!showAddClientForm)}
                className="bg-[#1e1313] hover:bg-black text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                id="btn-trigger-add-client"
              >
                <UserPlus className="w-4 h-4" /> Agregar Nueva Clienta
              </button>
            </div>

            {/* Collapse add client form */}
            {showAddClientForm && (
              <form onSubmit={handleCreateClient} className="p-5 bg-[#fbf7ee] rounded-2xl border border-[#ebd4aa]/50 space-y-4 animate-in slide-in-from-top duration-200">
                <span className="text-[10px] uppercase font-bold text-[#a1762d] tracking-wider block">Registrar Ficha de Belleza Lashlista</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Nombre y Apellido</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Francisca Silva"
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#a1762d]"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      id="crm-new-name"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">WhatsApp Celular</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. +56 9 8832 9182"
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#a1762d]"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      id="crm-new-phone"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Fecha de Cumpleaños</label>
                    <input 
                      type="text" 
                      placeholder="Ej. 14 Oct"
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#a1762d]"
                      value={newClient.birthday}
                      onChange={(e) => setNewClient({ ...newClient, birthday: e.target.value })}
                      id="crm-new-bday"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Etiqueta de Cliente</label>
                    <select 
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={newClient.type}
                      onChange={(e) => setNewClient({ ...newClient, type: e.target.value as any })}
                      id="crm-new-tag"
                    >
                      <option value="Nueva">Nueva (Primer servicio)</option>
                      <option value="Frecuente">Frecuente (Agenda regular)</option>
                      <option value="VIP">VIP (Lashista recurrente preferencial)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Último Servicio Realizado</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Extensión volumen híbrido con diseño de cejas"
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#a1762d]"
                      value={newClient.lastService}
                      onChange={(e) => setNewClient({ ...newClient, lastService: e.target.value })}
                      id="crm-new-service"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddClientForm(false)}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                  >
                    Calcelar
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#1e1313] text-white hover:bg-black text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                    id="submit-crm-btn"
                  >
                    Guardar Ficha
                  </button>
                </div>
              </form>
            )}

            {/* Filter controls and Search directory */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100/60">
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-zinc-200 max-w-xs w-full">
                <Search className="w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Buscar clienta por nombre..."
                  className="w-full text-xs text-zinc-700 focus:outline-none bg-transparent"
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  id="crm-search"
                />
              </div>

              {/* Tag Filters list */}
              <div className="flex gap-1.5 text-xs">
                <span className="text-zinc-500 font-medium self-center mr-1">Filtrar:</span>
                {(['All', 'VIP', 'Frecuente', 'Nueva'] as const).map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => setCrmFilter(tag)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      crmFilter === tag 
                        ? 'bg-zinc-900 text-white' 
                        : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {tag === 'All' ? 'Todas' : tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CRM List grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCrm.length === 0 ? (
                <div className="sm:col-span-2 text-center py-10 text-zinc-400 text-xs border border-dashed border-zinc-200 rounded-3xl">
                  No se encontraron clientas en esta búsqueda. ¡Prueba agregando una nueva arriba!
                </div>
              ) : (
                filteredCrm.map((cli) => (
                  <div key={cli.id} className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between" id={`client-card-${cli.id}`}>
                    <div 
                      className="cursor-pointer group text-left" 
                      onClick={() => {
                        setSelectedClinicalClientId(cli.id);
                        setClinicalTab('design'); // Open directly into design mapping tab
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-rose-brand flex items-center justify-center font-bold text-[#1e1313] tracking-tight shrink-0 transition-transform group-hover:scale-105">
                            {cli.name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="font-bold text-zinc-900 text-xs sm:text-sm group-hover:text-[#a1762d] transition-colors">{cli.name}</h5>
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{cli.phone}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${
                            cli.type === 'VIP' 
                              ? 'bg-amber-100 text-[#a1762d]' 
                              : cli.type === 'Frecuente' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {cli.type}
                          </span>
                          
                          {/* Clinic indicators */}
                          {cli.allergies && (
                            <span className="bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider animate-pulse">
                              ⚠️ Alergia
                            </span>
                          )}

                          {cli.hasConsentSigned && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase">
                              ✓ Consentido
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-xs border-t border-zinc-100 pt-3">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-500">Último Tratamiento realizado:</span>
                          <span className="text-zinc-800 font-medium text-right font-serif italic">{cli.lastService}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-500">Cumpleaños registrado:</span>
                          <span className="text-[#a1762d] font-bold">{cli.birthday || 'No registrado'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button 
                        onClick={() => {
                          setSelectedClinicalClientId(cli.id);
                          setClinicalTab('design');
                        }}
                        className="w-full bg-zinc-50 hover:bg-[#ebd4aa]/20 border border-zinc-200 hover:border-[#ebd4aa]/50 rounded-xl py-2 px-3 text-xs text-zinc-700 font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs mb-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#a1762d]" /> Ver Ficha de Salud y Consentimiento
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px]">
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <span className={`w-2 h-2 rounded-full ${cli.whatsAppStatus === 'Activo' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        WhatsApp reminders: {cli.whatsAppStatus}
                      </span>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            // Quick select this client to schedule appointment
                            setBooking(prev => ({ ...prev, clientaName: cli.name }));
                            setSelectedDate('2026-05-24');
                            setActiveTabState('agenda');
                            setShowBookingForm(true);
                          }}
                          className="text-[#a1762d] font-bold hover:underline"
                        >
                          Agendar Cita
                        </button>
                        <span className="text-zinc-300">|</span>
                        <button 
                          onClick={() => deleteClienta(cli.id)}
                          className="text-zinc-400 hover:text-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* =============== TAB MODULE 2: AGENDA / CALENDARIO =============== */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-zinc-100 rounded-lg p-2 text-zinc-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Calendario de Turnos Lashistas</h4>
                  <p className="text-zinc-500 text-[10px] uppercase font-semibold">Agenda interactiva</p>
                </div>
              </div>

              <button 
                onClick={() => setShowBookingForm(!showBookingForm)}
                className="bg-[#1e1313] hover:bg-black text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                id="btn-trigger-booking"
              >
                <Plus className="w-4 h-4" /> Agendar Nueva Cita
              </button>
            </div>

            {/* Collapse add appointment booking form */}
            {showBookingForm && (
              <form onSubmit={handleBookingSubmit} className="p-5 bg-gold-50/40 rounded-2xl border border-gold-100 text-xs space-y-4 animate-in slide-in-from-top duration-200">
                <strong className="text-[10px] uppercase block tracking-wider text-amber-900 font-bold">Bloquear Agenda de Estética</strong>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Client picker */}
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Buscar Clienta Registrada</label>
                    <select 
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={booking.clientaName}
                      onChange={(e) => setBooking({ ...booking, clientaName: e.target.value })}
                    >
                      <option value="" disabled>Selecciona una clienta...</option>
                      {clientas.map((c) => (
                        <option key={c.id} value={c.name}>{c.name} ({c.type})</option>
                      ))}
                    </select>
                    <p className="text-[9px] text-zinc-400 mt-1">¿Cita nueva? Primero regístrala en la pestaña CRM.</p>
                  </div>

                  {/* Time picker */}
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Hora de Comienzo</label>
                    <select 
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={booking.time}
                      onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="12:30">12:30 PM</option>
                      <option value="13:30">13:30 PM</option>
                      <option value="14:00">14:00 PM</option>
                      <option value="15:00">15:00 PM</option>
                      <option value="16:00">16:00 PM</option>
                      <option value="17:00">17:00 PM</option>
                      <option value="18:30">18:30 PM</option>
                    </select>
                  </div>

                  {/* Duration picker */}
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Duración de Sesión</label>
                    <select 
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={booking.duration}
                      onChange={(e) => setBooking({ ...booking, duration: Number(e.target.value) })}
                    >
                      <option value={60}>1 Hora (Lifting / Retiro)</option>
                      <option value={90}>1 Hora y Media (Volumen clásico)</option>
                      <option value={120}>2 Horas (Volumen Ruso Completo)</option>
                    </select>
                  </div>

                  {/* Service chosen */}
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Servicio Lash / Cejas</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Volumen Ruso completo"
                      required
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={booking.service}
                      onChange={(e) => setBooking({ ...booking, service: e.target.value })}
                      id="booking-service"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Fecha de Cita</label>
                    <input 
                      type="date" 
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Estado Inicial</label>
                    <select 
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none font-semibold text-zinc-700"
                      value={booking.status}
                      onChange={(e) => setBooking({ ...booking, status: e.target.value as any })}
                      id="booking-status"
                    >
                      <option value="Confirmado">🟢 Confirmado</option>
                      <option value="Pendiente">🟡 Pendiente por Confirmar</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowBookingForm(false)}
                    className="bg-zinc-100 text-zinc-600 px-4 py-2 rounded-xl font-semibold"
                  >
                    Calcelar
                  </button>
                  <button 
                    type="submit" 
                    className="bg-gold-500 hover:bg-gold-600 text-zinc-950 px-4 py-2 rounded-xl font-semibold"
                    id="submit-booking-btn"
                  >
                    Crear Turno en Calendario
                  </button>
                </div>
              </form>
            )}

            {/* Beautiful visual calendar bar */}
            <div>
              <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Selecciona un día para ver turnos:</span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {[
                  { label: 'Dom 24', yyyymmdd: '2026-05-24', isToday: true },
                  { label: 'Lun 25', yyyymmdd: '2026-05-25', isToday: false },
                  { label: 'Mar 26', yyyymmdd: '2026-05-26', isToday: false },
                  { label: 'Mié 27', yyyymmdd: '2026-05-27', isToday: false },
                  { label: 'Jue 28', yyyymmdd: '2026-05-28', isToday: false },
                  { label: 'Vie 29', yyyymmdd: '2026-05-29', isToday: false },
                  { label: 'Sáb 30', yyyymmdd: '2026-05-30', isToday: false }
                ].map((day) => (
                  <button
                    key={day.yyyymmdd}
                    onClick={() => setSelectedDate(day.yyyymmdd)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      selectedDate === day.yyyymmdd 
                        ? 'bg-[#1e1313] text-white shadow-md' 
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">{day.label}</span>
                    <span className="block text-[9px] text-[#a1762d] font-semibold mt-0.5">
                      {appointments.filter(app => app.date === day.yyyymmdd).length} citas
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* List appointments for selected date */}
            <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block tracking-wider mb-4">
                Bloques horarios agendados el {selectedDate}:
              </span>

              {activeDayAppointments.length === 0 ? (
                <div className="text-center py-8 text-zinc-400 text-xs">
                  Libre. No hay citas programadas para esta fecha en particular.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeDayAppointments.map((app) => (
                    <div key={app.id} className="bg-white p-4 rounded-xl border border-zinc-200/60 flex flex-wrap justify-between items-center gap-3 text-xs" id={`appt-block-${app.id}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold-50 border border-gold-200/50 flex flex-col justify-center items-center text-zinc-800 font-mono font-bold">
                          <span>{app.time}</span>
                        </div>
                        <div>
                          <span className="font-bold text-zinc-950 text-xs sm:text-sm block">{app.clientaName}</span>
                          <span className="text-[11px] text-[#a1762d] font-medium font-serif italic">{app.service} ({app.duration} minutos)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`} id={`status-badge-${app.id}`}>
                          {app.status}
                        </span>

                        <button 
                          onClick={() => toggleAppointmentStatus(app.id)}
                          className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold px-2.5 py-1.5 rounded text-[11px] border border-zinc-200"
                          id={`btn-toggle-status-${app.id}`}
                        >
                          Cambiar Estado
                        </button>

                        <button 
                          onClick={() => deleteAppointment(app.id)}
                          className="text-zinc-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Simulated Business hours widget */}
            <div className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100 text-xs">
              <strong className="block text-zinc-800 font-bold mb-2">Simulación de Horarios de Sucursal (Lash Store)</strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                {workHours.map((wh) => (
                  <div key={wh.day} className="p-2.5 bg-white rounded-lg border border-zinc-100 flex justify-between items-center">
                    <span className="font-bold text-zinc-700">{wh.day}</span>
                    <span className="text-zinc-500 font-mono">{wh.closed ? 'Cerrado' : wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =============== TAB MODULE 3: OFERTAS =============== */}
        {activeTab === 'ofertas' && (
          <div className="space-y-6">
            
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-zinc-100 rounded-lg p-2 text-zinc-700">
                  <Sparkle className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Campaña de Ofertas Activas</h4>
                  <p className="text-zinc-500 text-[10px] uppercase font-semibold">Integrada al bot whatsapp</p>
                </div>
              </div>

              <button 
                onClick={() => setShowCampaignForm(!showCampaignForm)}
                className="bg-[#1e1313] hover:bg-black text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                id="btn-trigger-campaign"
              >
                <Plus className="w-4 h-4" /> Crear Oferta Nueva
              </button>
            </div>

            {/* Campaign Form */}
            {showCampaignForm && (
              <form onSubmit={handleCampaignSubmit} className="p-5 bg-pink-50/40 rounded-2xl border border-[#f5cfcf]/45 text-xs space-y-4 animate-in slide-in-from-top duration-200">
                <strong className="text-[10px] uppercase block tracking-wider text-pink-900 font-bold">Nueva Campaña de Fidelidad Lash</strong>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Nombre de Promo</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Promo CyberLash"
                      required
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={newCamp.name}
                      onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
                      id="camp-new-name"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Tratamiento Vinculado</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Lifting de cejas"
                      required
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={newCamp.service}
                      onChange={(e) => setNewCamp({ ...newCamp, service: e.target.value })}
                      id="camp-new-service"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Rango de Fechas</label>
                    <input 
                      type="text" 
                      placeholder="Ej. 01/06 → 30/06"
                      required
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={newCamp.dateRange}
                      onChange={(e) => setNewCamp({ ...newCamp, dateRange: e.target.value })}
                      id="camp-new-range"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-600 mb-1 uppercase">Porcentaje Descuento</label>
                    <input 
                      type="text" 
                      placeholder="Ej. -25%"
                      required
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      value={newCamp.discount}
                      onChange={(e) => setNewCamp({ ...newCamp, discount: e.target.value })}
                      id="camp-new-disc"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCampaignForm(false)}
                    className="bg-zinc-100 text-zinc-600 px-4 py-2 rounded-xl"
                  >
                    Calcelar
                  </button>
                  <button 
                    type="submit" 
                    className="bg-zinc-900 text-white hover:bg-black px-4 py-2 rounded-xl"
                    id="submit-campaign-btn"
                  >
                    Lanzar Campaña Automática
                  </button>
                </div>
              </form>
            )}

            {/* Campaign Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {campaigns.map((camp) => (
                <div key={camp.id} className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between" id={`camp-card-${camp.id}`}>
                  {/* Cosmetic background accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-[#f5cfcf]/20 rounded-full filter blur-xl"></div>
                  
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-zinc-900 text-sm sm:text-base">{camp.name}</h5>
                        <p className="text-[#a1762d] text-xs font-semibold uppercase mt-0.5">{camp.service}</p>
                      </div>

                      <span className="text-xl font-black text-rose-600 font-mono tracking-tighter bg-pink-50 px-2.5 py-1 rounded-xl">
                        {camp.discount}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-500">
                      <div className="flex justify-between">
                        <span>Vigencia Campaña:</span>
                        <span className="font-bold text-zinc-800">{camp.dateRange}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1.5">
                        <span>Estado Oferta:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${camp.active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-500'}`}>
                          {camp.active ? 'Activa y Emitible' : 'Pausada'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-zinc-100 flex justify-between items-center">
                    <button 
                      onClick={() => toggleCampaignActive(camp.id)}
                      className={`text-[11px] font-bold ${camp.active ? 'text-zinc-600' : 'text-emerald-600'}`}
                      id={`btn-toggle-camp-${camp.id}`}
                    >
                      {camp.active ? 'Pausar Campaña' : 'Activar Campaña'}
                    </button>

                    <button 
                      onClick={() => deleteCampaign(camp.id)}
                      className="text-zinc-400 hover:text-red-500 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =============== TAB MODULE 4: BOT WHATSAPP =============== */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            
            <div className="flex items-center gap-2.5">
              <div className="bg-zinc-100 rounded-lg p-2 text-zinc-700">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">Bot de Alertas de WhatsApp Integrado</h4>
                <p className="text-zinc-500 text-[10px] uppercase font-semibold">Simulación de notificaciones activas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Template editor & selector */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Remainder edit container */}
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                  <h5 className="font-semibold text-zinc-800 text-xs uppercase mb-3 text-left">Plantilla de Recordatorio</h5>
                  
                  <textarea 
                    rows={4}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                    value={customReminderTemplate}
                    onChange={(e) => setCustomReminderTemplate(e.target.value)}
                  />

                  <div className="mt-3 space-y-1.5 text-[9px] text-zinc-500 leading-none">
                    <span className="block font-bold">ETIQUETAS REEMPLAZABLES:</span>
                    <span className="block font-mono bg-zinc-100 p-1 rounded inline-block">{"{clienta}"}</span> <span className="text-zinc-400">Nombre</span>
                    <br />
                    <span className="block font-mono bg-zinc-100 p-1 rounded inline-block mt-1">{"{servicio}"}</span> <span className="text-zinc-400">Tratamiento</span>
                    <br />
                    <span className="block font-mono bg-zinc-100 p-1 rounded inline-block mt-1">{"{hora}"}</span> <span className="text-zinc-400">Bloque horario</span>
                  </div>
                </div>

                {/* Agenda Link Copier for Clients Booking */}
                <div className="bg-[#fbf7ee] text-left rounded-2xl p-5 border border-[#ebd4aa]/50 text-xs">
                  <span className="font-bold text-[#a1762d] block text-xs mb-1">🔗 Tu Enlace de Reservas Autónomas</span>
                  <p className="text-zinc-500 text-[11px] leading-relaxed mb-4">
                    Comparte este link por Instagram o WhatsApp para que tus clientas agenden de forma autónoma.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={customBookingUrl} 
                      className="flex-1 bg-white border border-zinc-200 rounded-xl py-2 px-3 text-[10px] font-mono focus:outline-none min-w-0"
                    />

                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(customBookingUrl);
                          setBookingLinkCopied(true);
                          setTimeout(() => setBookingLinkCopied(false), 2000);
                        }}
                        className="flex-1 sm:flex-initial bg-[#1e1313] hover:bg-black text-white font-semibold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1 transition-all"
                      >
                        {bookingLinkCopied ? '✓ Copiado' : 'Copiar'}
                      </button>

                      <a 
                        href={customBookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-initial bg-gold-500 hover:bg-gold-600 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1 transition-all"
                      >
                        Probar ↗
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Live interactive mock WhatsApp chat simulation logs */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5">
                  <span className="font-bold text-zinc-800 text-xs uppercase block mb-3">Paso 1: Elige una cita para simular el recordatorio</span>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {appointments.map((app) => (
                      <div key={app.id} className="p-3 bg-white rounded-xl border border-zinc-200/60 flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-zinc-800 block">{app.clientaName}</strong>
                          <span className="text-zinc-500 block text-[10px]">{app.service} • {app.time} ({app.date})</span>
                        </div>

                        <button 
                          onClick={() => triggerWhatsAppSimulation(app)}
                          className="text-[11px] bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100/60 font-semibold px-2.5 py-1.5 rounded-lg"
                        >
                          Simular WhatsApp Envío ⚡
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time chat log simulator window */}
                {chatLog.length > 0 && (
                  <div className="bg-[#ebd4aa]/10 rounded-2xl border border-gold-200 p-5 mt-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center border-b border-gold-200/50 pb-2">
                      <span className="text-[10px] uppercase font-bold text-[#a1762d] tracking-wider">Pantalla de Chat Telefónico WhatsApp</span>
                      <span className="text-[10px] text-zinc-500">Remitente: Bot de Alertas</span>
                    </div>

                    <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                      {chatLog.map((chat, idx) => (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs ${
                            chat.sender === 'bot' 
                              ? 'bg-emerald-600 text-white mr-auto rounded-tl-none' 
                              : 'bg-zinc-800 text-white ml-auto rounded-tr-none'
                          }`}
                        >
                          <p className="leading-relaxed">{chat.text}</p>
                          <span className="text-[9px] text-zinc-300 block text-right mt-1.5 font-mono">{chat.time}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-zinc-500 py-2 text-center bg-white/40 border border-[#f5cfcf]/20 rounded-xl leading-relaxed">
                      💡 <strong>Estado de simulación:</strong> La clienta ha respondido positivamente. Puedes volver a la pestaña de Agenda para cambiar el estado de la cita a <strong>Confirmado</strong>.
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* =============== TAB MODULE 5: AUTOMATIZACIONES =============== */}
        {activeTab === 'automatizaciones' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#ebd4aa]/30 rounded-lg p-2 text-[#a1762d]">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Centro de Automatizaciones Inteligentes</h4>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Comprobantes, Recordatorios & Fidelización Pro</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Servidor de Correos de Clientes Activo SCL
              </div>
            </div>

            {/* Simulated Live Automated Counter cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-zinc-100 rounded-2xl p-4.5 shadow-sm text-left">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase">Total Correos Enviados</span>
                <span className="text-lg font-extrabold text-[#1e1313] block mt-1">1.482 <span className="text-[10px] text-emerald-500 font-bold font-mono">↑ 18%</span></span>
                <p className="text-[9px] text-zinc-400 mt-0.5">Tasa de apertura de 98.4%</p>
              </div>

              <div className="bg-white border border-zinc-100 rounded-2xl p-4.5 shadow-sm text-left">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase">Comprobantes Emitidos</span>
                <span className="text-lg font-extrabold text-[#1e1313] block mt-1">824 <span className="text-[10px] text-emerald-500 font-bold font-mono">Instantáneos</span></span>
                <p className="text-[9px] text-zinc-400 mt-0.5">Vía canal autónomo y manual</p>
              </div>

              <div className="bg-white border border-zinc-100 rounded-2xl p-4.5 shadow-sm text-left">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase">Cupones de Cumpleaños</span>
                <span className="text-lg font-extrabold text-[#1e1313] block mt-1">142 <span className="text-[10px] text-rose-500 font-bold">VIP Activos</span></span>
                <p className="text-[9px] text-zinc-400 mt-0.5">Tasa de canje de 42.8%</p>
              </div>

              <div className="bg-white border border-zinc-100 rounded-2xl p-4.5 shadow-sm text-left">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase">Premios 1 Año Inscrita</span>
                <span className="text-lg font-extrabold text-[#a1762d] block mt-1">74 <span className="text-[10px] text-[#a1762d] font-bold font-mono">Fidelizadas</span></span>
                <p className="text-[9px] text-zinc-400 mt-0.5">25% de regalo para recurrentes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Rules switches & configurations */}
              <div className="lg:col-span-1 space-y-5">
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/50 space-y-4">
                  <h5 className="font-bold text-zinc-800 text-xs uppercase tracking-wide border-b border-zinc-200 pb-2 flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" /> Configurar Reglas de Envío
                  </h5>

                  {/* Toggle 1 */}
                  <div className="flex items-center justify-between gap-4 p-1.5 bg-white rounded-xl border border-zinc-100 shadow-sm">
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-zinc-900 block leading-tight">Comprobantes instantáneos</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">Enviar recibo por correo al reservar</span>
                    </div>
                    <button 
                      onClick={() => setAutoToggles(p => ({ ...p, receipts: !p.receipts }))}
                      className={`w-11 h-6 rounded-full p-0.5 transition-all outline-none ${autoToggles.receipts ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all ${autoToggles.receipts ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex items-center justify-between gap-4 p-1.5 bg-white rounded-xl border border-zinc-100 shadow-sm">
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-zinc-900 block leading-tight">Recordatorio (Día Anterior)</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">Aviso por WhatsApp y Email 24h antes</span>
                    </div>
                    <button 
                      onClick={() => setAutoToggles(p => ({ ...p, reminders: !p.reminders }))}
                      className={`w-11 h-6 rounded-full p-0.5 transition-all outline-none ${autoToggles.reminders ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all ${autoToggles.reminders ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Toggle 3 */}
                  <div className="flex items-center justify-between gap-4 p-1.5 bg-white rounded-xl border border-zinc-100 shadow-sm">
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-zinc-900 block leading-tight">Regalo de Cumpleaños VIP</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">Cupón del 20% el mes de cumpleaños</span>
                    </div>
                    <button 
                      onClick={() => setAutoToggles(p => ({ ...p, birthday: !p.birthday }))}
                      className={`w-11 h-6 rounded-full p-0.5 transition-all outline-none ${autoToggles.birthday ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all ${autoToggles.birthday ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Toggle 4 */}
                  <div className="flex items-center justify-between gap-4 p-1.5 bg-white rounded-xl border border-zinc-100 shadow-sm">
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-zinc-900 block leading-tight">Premio Anual (1 Año)</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">Cupón de 25% al cumplir 1 año registrada</span>
                    </div>
                    <button 
                      onClick={() => setAutoToggles(p => ({ ...p, anniversary: !p.anniversary }))}
                      className={`w-11 h-6 rounded-full p-0.5 transition-all outline-none ${autoToggles.anniversary ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all ${autoToggles.anniversary ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {/* Developer Info Box */}
                <div className="bg-blue-50/50 border border-blue-100 text-blue-900 rounded-2xl p-4.5 text-xs text-left">
                  <span className="font-bold flex items-center gap-1.5 text-blue-800 uppercase text-[10px] tracking-wide mb-1">
                    ℹ️ Proceso Autónomo e Integrado
                  </span>
                  <p className="leading-snug text-zinc-600 text-[11px]">
                    El motor de <strong>Mundo Lashista Pro</strong> corre revisiones automáticas cronometradas periódicamente cada 6 horas para buscar clientas de cumpleaños, aniversarios activos y citas para el día de mañana, asegurando una comunicación oportuna sin intervención de tu parte.
                  </p>
                </div>
              </div>

              {/* Right Column: Simulated Triggers & Visual Overlays */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Simulated alert popups */}
                {simAlertMessage && (
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-xl p-3.5 text-xs font-semibold flex justify-between items-center animate-in fade-in zoom-in-95 duration-200 text-left">
                    <span>{simAlertMessage}</span>
                    <button onClick={() => setSimAlertMessage(null)} className="text-zinc-400 hover:text-black font-bold font-mono ml-4 text-xs">Aceptar</button>
                  </div>
                )}

                <div className="bg-[#fcfbf9] border border-zinc-250/20 rounded-3xl p-6 shadow-sm">
                  <h4 className="font-bold text-zinc-900 text-sm mb-1.5 flex items-center gap-1">
                    🚀 Consola de Simulación y Pruebas
                  </h4>
                  <p className="text-zinc-550 text-xs">
                    Selecciona una acción y una clienta para presenciar exactamente el flujo interactivo de correos informativos.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    
                    {/* Trigger 1: Comprobante */}
                    <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex flex-col justify-between shadow-xs">
                      <div className="text-left">
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded-full mb-1">
                          <Mail className="w-2.5 h-2.5" /> E-MAIL CONFIRMACIÓN
                        </span>
                        <h5 className="font-bold text-xs text-zinc-950 block">Comprobante de Reserva</h5>
                        <p className="text-zinc-500 text-[10px] leading-relaxed mt-1">Genera un recibo digital en tiempo real con código de seguridad para la clienta seleccionada.</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2.5">
                        <select 
                          className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-1.5 px-3 text-xs text-zinc-800 font-semibold focus:outline-none"
                          value={selectedSimClient}
                          onChange={(e) => setSelectedSimClient(e.target.value)}
                        >
                          <option value="">Selecciona una Clienta...</option>
                          {clientas.map(cli => (
                            <option key={cli.id} value={cli.id}>{cli.name} ({cli.email || 'Sin correo'})</option>
                          ))}
                        </select>

                        <button 
                          disabled={!selectedSimClient || !autoToggles.receipts}
                          onClick={() => {
                            setActiveOverlay('receipt');
                            const match = clientas.find(c => c.id === selectedSimClient);
                            setSimAlertMessage(`📫 ¡Comprobante digital enviado! Revisa la maqueta interactiva del correo abajo enviada a ${match?.name}.`);
                          }}
                          className="w-full bg-[#1e1313] hover:bg-black font-semibold text-white text-xs py-2 rounded-xl transition-all disabled:opacity-50"
                        >
                          Probar Envío Comprobante ⚡
                        </button>
                      </div>
                    </div>

                    {/* Trigger 2: Recordatorio Día Anterior */}
                    <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex flex-col justify-between shadow-xs">
                      <div className="text-left">
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[9px] font-bold px-2 py-0.5 rounded-full mb-1">
                          <Clock className="w-2.5 h-2.5" /> EMAIL + WHATSAPP ALERTA
                        </span>
                        <h5 className="font-bold text-xs text-zinc-950 block">Recordatorio 24 horas antes</h5>
                        <p className="text-zinc-500 text-[10px] leading-relaxed mt-1">Simula el recordatorio del día anterior al turno para que la clienta reconfirme.</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2.5">
                        <select 
                          className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-1.5 px-3 text-xs text-zinc-800 font-semibold focus:outline-none"
                          value={selectedSimApp}
                          onChange={(e) => setSelectedSimApp(e.target.value)}
                        >
                          <option value="">Selecciona una Cita...</option>
                          {appointments.map(app => (
                            <option key={app.id} value={app.id}>{app.clientaName} - {app.service} ({app.date} {app.time})</option>
                          ))}
                        </select>

                        <button 
                          disabled={!selectedSimApp || !autoToggles.reminders}
                          onClick={() => {
                            setActiveOverlay('reminder');
                            const match = appointments.find(a => a.id === selectedSimApp);
                            setSimAlertMessage(`⏰ Recordatorio automatizado generado y listo para enviar a ${match?.clientaName} por correo y Whatsapp.`);
                          }}
                          className="w-full bg-[#1e1313] hover:bg-black font-semibold text-white text-xs py-2 rounded-xl transition-all disabled:opacity-50"
                        >
                          Probar Envío Recordatorio ⚡
                        </button>
                      </div>
                    </div>

                    {/* Trigger 3: Cumpleaños */}
                    <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex flex-col justify-between shadow-xs">
                      <div className="text-left">
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-full mb-1">
                          <Gift className="w-2.5 h-2.5" /> CUPÓN CUMPLEAÑOS VIP
                        </span>
                        <h5 className="font-bold text-xs text-zinc-950 block">Fidelización de Cumpleaños</h5>
                        <p className="text-zinc-500 text-[10px] leading-relaxed mt-1">
                          Escanea el registro. Valentina tiene fecha <strong>24 Mayo</strong> (¡cumpleaños HOY!). Presiona para despachar su cupón del 20%.
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-zinc-100">
                        <button 
                          disabled={!autoToggles.birthday}
                          onClick={() => {
                            setActiveOverlay('birthday');
                            setSimAlertMessage('🎈 ¡Cupón de Cumpleaños enviado exitosamente a Valentina Soto (vale.soto.beauty@gmail.com)!');
                          }}
                          className="w-full bg-rose-600 hover:bg-rose-700 font-semibold text-white text-xs py-2 rounded-xl transition-all disabled:opacity-50"
                        >
                          Disparar Cupón de Cumpleaños 🎁
                        </button>
                      </div>
                    </div>

                    {/* Trigger 4: Aniversario 1 año */}
                    <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex flex-col justify-between shadow-xs">
                      <div className="text-left">
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full mb-1">
                          <Sparkles className="w-2.5 h-2.5" /> ANIVERSARIO 1 AÑO
                        </span>
                        <h5 className="font-bold text-xs text-zinc-950 block">Aniversario de Registro Pro</h5>
                        <p className="text-zinc-500 text-[10px] leading-relaxed mt-1">
                          María González cumple exactamente <strong>1 año activa</strong> desde su registro (2025-05-24). Despacha su cupón premium de 25%.
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-zinc-100">
                        <button 
                          disabled={!autoToggles.anniversary}
                          onClick={() => {
                            setActiveOverlay('anniversary');
                            setSimAlertMessage('👑 ¡Cupón de Aniversario de 1 Año despachado a María González (maria.gonzalez@correo.cl)!');
                          }}
                          className="w-full bg-gold-500 hover:bg-gold-600 font-extrabold text-[#111] text-xs py-2 rounded-xl transition-all disabled:opacity-50"
                        >
                          Disparar Cupón 1 Año Activa 👑
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Simulated Email overlay mock view container */}
                {activeOverlay && (
                  <div className="bg-white border-2 border-zinc-200 shadow-xl rounded-2xl p-6 relative animate-in zoom-in-95 duration-200 text-left">
                    <button 
                      onClick={() => setActiveOverlay(null)}
                      className="absolute top-4 right-4 text-xs font-bold text-zinc-400 hover:text-red-500 px-2 py-1 rounded-md transition-all"
                    >
                      Cerrar Vista Maqueta ×
                    </button>

                    {/* RECEIPT LOG OVERLAY */}
                    {activeOverlay === 'receipt' && (() => {
                      const client = clientas.find(c => c.id === selectedSimClient) || clientas[0];
                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 text-xs">
                            <span className="text-zinc-400 font-mono text-[10px]">De: <strong>noreply@mundolashistapro.com</strong></span>
                            <span className="text-zinc-400 font-mono text-[10px]">Para: <strong>{client?.email || 'cliente@correo.cl'}</strong></span>
                          </div>

                          <div className="bg-[#1e1313] p-4 text-center rounded-2xl text-white">
                            <Sparkles className="w-6 h-6 text-gold-500 mx-auto mb-1" />
                            <h3 className="font-serif italic font-semibold text-sm">Tu Reserva ha sido Confirmada</h3>
                            <p className="text-[10px] text-zinc-350">Gracias por preferir nuestros servicios premium</p>
                          </div>

                          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2 text-xs text-zinc-700">
                            <div className="flex justify-between font-bold">
                              <span>Cliente:</span>
                              <span className="text-zinc-900">{client?.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Servicio:</span>
                              <span className="text-zinc-900">{client?.lastService || 'Lifting de pestañas'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fecha Cita:</span>
                              <span className="text-zinc-900">2026-05-24</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estilista Responsable:</span>
                              <span className="text-zinc-900">{currentLashista?.name || 'María González'}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-zinc-200 font-semibold">
                              <span>Canal de Confirmación:</span>
                              <span className="text-emerald-600">WhatsApp & Correo Integrado ✓</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* REMINDER EMAIL OVERLAY */}
                    {activeOverlay === 'reminder' && (() => {
                      const app = appointments.find(a => a.id === selectedSimApp) || appointments[0];
                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 text-xs">
                            <span className="text-zinc-400 font-mono text-[10px]">De: <strong>alerts@mundolashistapro.com</strong></span>
                            <span className="text-zinc-400 font-mono text-[10px]">Para: <strong>{clientas.find(c => c.name === app?.clientaName)?.email || 'cliente@gmail.com'}</strong></span>
                          </div>

                          <div className="bg-amber-500 text-zinc-950 p-4 rounded-2xl text-center">
                            <Clock className="w-6 h-6 mx-auto mb-1" />
                            <h3 className="font-bold text-sm uppercase tracking-wider">⏱ Mañana es tu Cita de Belleza</h3>
                            <p className="text-xs text-zinc-800">No olvides asistir a tu bloque agendado</p>
                          </div>

                          <div className="text-xs text-zinc-700 space-y-2 leading-relaxed">
                            <p>Hola, <strong>{app?.clientaName}</strong>.</p>
                            <p>Te recordamos que tienes una reserva de <strong>{app?.service}</strong> programada para el día de mañana <strong>{app?.date}</strong> a las <strong>{app?.time} hrs</strong> con nuestra profesional <strong>{currentLashista?.name || 'María González'}</strong>.</p>
                            <p>La duración estimada de tu bloque es de <strong>{app?.duration} minutos</strong>.</p>
                            
                            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-amber-800 text-[11px] font-semibold text-center">
                              ⚠️ Para garantizar el bloque por favor pulsa CONFIRMAR en el mensaje de Whatsapp enviado a tu celular.
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* BIRTHDAY GREETING EMAIL OVERLAY */}
                    {activeOverlay === 'birthday' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-100 pb-2 text-xs">
                          <span className="text-zinc-400 font-mono text-[10px]">De: <strong>vip-club@mundolashistapro.com</strong></span>
                          <span className="text-zinc-400 font-mono text-[10px]">Para: <strong>vale.soto.beauty@gmail.com</strong></span>
                        </div>

                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-5 rounded-3xl text-center relative overflow-hidden">
                          <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/10 rounded-full filter blur-sm"></div>
                          <span className="text-[28px] block">🎈</span>
                          <h3 className="font-serif italic font-extrabold text-lg mt-1">¡Feliz Cumpleaños Valentina! 💝</h3>
                          <p className="text-xs text-rose-100">De parte de {currentLashista?.name || 'María González'}</p>
                        </div>

                        <div className="text-xs text-zinc-700 leading-relaxed text-center space-y-3">
                          <p>Querida Valentina, en tu día especial queremos consentirte como te lo mereces.</p>
                          <p className="font-semibold text-zinc-950">Por ser nuestra clienta VIP preferencial, te obsequiamos un cupón de:</p>
                          
                          <div className="bg-rose-50 border-2 border-dashed border-rose-300 rounded-2xl p-4.5 max-w-xs mx-auto text-center">
                            <span className="text-3xl font-black text-rose-600 block">-20% OFF</span>
                            <span className="text-[10px] text-zinc-400 block uppercase mt-0.5">En cualquier Lifting de pestañas o Volumen</span>
                            <span className="font-mono bg-white border border-rose-200 text-rose-700 font-bold block mt-3 px-3 py-1.5 rounded-lg text-sm">
                              CUMPLELASH-VALE20
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-zinc-400">Válido durante todo el mes de tu cumpleaños. Presenta este cupón en tu próxima sesión.</p>
                        </div>
                      </div>
                    )}

                    {/* ANNIVERSARY EMAIL OVERLAY */}
                    {activeOverlay === 'anniversary' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-100 pb-2 text-xs">
                          <span className="text-zinc-400 font-mono text-[10px]">De: <strong>loyalty@mundolashistapro.com</strong></span>
                          <span className="text-zinc-400 font-mono text-[10px]">Para: <strong>maria.gonzalez@correo.cl</strong></span>
                        </div>

                        <div className="bg-gradient-to-r from-zinc-900 to-amber-950 text-white p-5 rounded-3xl text-center relative overflow-hidden border border-[#ebd4aa]/30">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-200/10 rounded-full filter blur-md"></div>
                          <span className="text-[28px] block">👑</span>
                          <h3 className="font-serif font-extrabold text-gold-200 text-lg mt-1">¡Feliz 1° Año de Belleza, María!</h3>
                          <p className="text-xs text-zinc-350">Celebrando 1 año inscrita como nuestra clienta</p>
                        </div>

                        <div className="text-xs text-zinc-700 leading-relaxed text-center space-y-3">
                          <p>Querida María,</p>
                          <p>Hoy se cumple exactamente <strong>1 año entero</strong> desde tu primer registro con nosotros. Queremos agradecer infinitamente tu fidelidad y compañía constante.</p>
                          <p className="font-semibold text-zinc-900">Tu lealtad es nuestra mayor felicidad, por eso te premiamos con un:</p>
                          
                          <div className="bg-[#fbf7ee]/60 border-2 border-dashed border-[#ebd4aa] rounded-2xl p-4.5 max-w-xs mx-auto text-center">
                            <span className="text-3xl font-black text-[#a1762d] block">25% DE REGALO</span>
                            <span className="text-[10px] text-zinc-500 block uppercase mt-0.5">Válido en cualquier servicio de pestañas estilizadas</span>
                            <span className="font-mono bg-white border border-gold-200 text-zinc-900 font-bold block mt-3 px-3 py-1.5 rounded-lg text-sm">
                              FIDELIDAD-MARIA1ANIO
                            </span>
                          </div>

                          <p className="text-[10px] text-zinc-400">Gracias por caminar este año embelleciendo tu mirada con {currentLashista?.name || 'María'}.</p>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* =============== CLINICAL HISTORY & CONSENT MODAL =============== */}
        {selectedClinicalClientId && activeClinicalClient && (
          <div className="fixed inset-0 z-50 bg-[#1e1313]/65 backdrop-blur-xs flex items-center justify-center p-4" id="clinical-history-modal">
            <div className="bg-white rounded-3xl shadow-2xl border border-zinc-150 w-full max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="bg-[#fcfbf9] border-b border-zinc-150 p-5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#ebd4aa]/20 border border-[#ebd4aa]/40 flex items-center justify-center font-bold text-[#1e1313] shrink-0">
                    <FileText className="w-5 h-5 text-[#a1762d]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-900 text-sm sm:text-base">Ficha de Historial Clínico Lash</h3>
                      <span className="bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">ID: {activeClinicalClient.id}</span>
                      {activeClinicalClient.hasConsentSigned ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[9px] font-bold uppercase">✓ Consentido</span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[9px] font-bold uppercase">⚠ Sin Firmar</span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs mt-0.5 font-semibold">Ficha oficial de {activeClinicalClient.name} • {activeClinicalClient.phone}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedClinicalClientId(null)}
                  className="bg-zinc-100 p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-250 transition-all cursor-pointer"
                  id="close-clinical-modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Patient Allergies Alert Banner (Visible only if allergies exist) */}
              {activeClinicalClient.allergies && (
                <div className="bg-red-50 border-b border-red-100 px-5 py-2.5 flex items-center gap-2 text-xs text-red-800 font-semibold text-left">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-650 animate-pulse" />
                  <span>ALERTA MÉDICA: Alergias detectadas: <strong className="underline">{activeClinicalClient.allergies}</strong></span>
                </div>
              )}

              {/* Main Body Grid */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
                
                {/* Left/Sidebar Navigation Panel */}
                <div className="w-full md:w-56 bg-zinc-50 border-r border-zinc-100 p-4.5 flex flex-row md:flex-col gap-2 overflow-x-auto shrink-0 md:overflow-y-auto">
                  
                  {/* Selector 1 */}
                  <button 
                    onClick={() => setClinicalTab('design')}
                    className={`w-full text-left shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      clinicalTab === 'design' 
                        ? 'bg-[#1e1313] text-white shadow-sm' 
                        : 'text-zinc-600 hover:bg-zinc-200/50 hover:text-black'
                    }`}
                  >
                    <Settings className="w-4 h-4" /> Diagnóstico y Mapping
                  </button>

                  {/* Selector 2 */}
                  <button 
                    onClick={() => setClinicalTab('consent')}
                    className={`w-full text-left shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      clinicalTab === 'consent' 
                        ? 'bg-[#1e1313] text-white shadow-sm' 
                        : 'text-zinc-600 hover:bg-zinc-200/50 hover:text-black'
                    }`}
                  >
                    <Shield className="w-4 h-4" /> Consentimiento Legal
                  </button>

                  {/* Selector 3 */}
                  <button 
                    onClick={() => setClinicalTab('resources')}
                    className={`w-full text-left shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      clinicalTab === 'resources' 
                        ? 'bg-[#1e1313] text-white shadow-sm' 
                        : 'text-zinc-600 hover:bg-zinc-200/50 hover:text-black'
                    }`}
                  >
                    <Camera className="w-4 h-4" /> Fotos y Documentos
                  </button>

                  {/* Selector 4 */}
                  <button 
                    onClick={() => setClinicalTab('info')}
                    className={`w-full text-left shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      clinicalTab === 'info' 
                        ? 'bg-[#1e1313] text-white shadow-sm' 
                        : 'text-zinc-600 hover:bg-zinc-200/50 hover:text-black'
                    }`}
                  >
                    <User className="w-4 h-4" /> Datos de Contacto
                  </button>

                  <div className="hidden md:block mt-auto border-t border-zinc-200/60 pt-4.5 text-[10px] text-zinc-400 text-left">
                    <p className="font-semibold uppercase tracking-wider text-zinc-500">Mundo Lashista CRM</p>
                    <p className="mt-1 leading-snug">Los datos se almacenan de forma local y segura encriptados en el navegador SCL.</p>
                  </div>
                </div>

                {/* Right/Content panel */}
                <div className="flex-1 p-6 overflow-y-auto bg-white text-left text-xs">
                  
                  {/* TAB 1 CONTENT: DESIGN & MAPPING & SYSTEM HEALTH */}
                  {clinicalTab === 'design' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      
                      <div>
                        <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                          📋 Ficha Técnica de Diseño y Diagnóstico Eyelash
                        </h4>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wide mt-1">Configuración personalizada de pestañas</p>
                      </div>

                      {/* Lash Mapping inputs */}
                      <div className="bg-zinc-50 border border-zinc-150/80 rounded-2xl p-4.5 space-y-4">
                        <span className="text-[10px] uppercase font-extrabold text-[#a1762d] tracking-wider block">Esquema de Diseño (Lash Map)</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 block text-left">
                          
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase">Diseño de Efecto Estético</label>
                            <select 
                              value={editMappingStyle}
                              onChange={(e) => setEditMappingStyle(e.target.value)}
                              className="w-full bg-white border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none"
                            >
                              <option value="Efecto Rímel">Efecto Rímel (Clásicas naturales)</option>
                              <option value="Ojo de Gato (Cat Eye)">Ojo de Gato (Cat Eye - foxy look)</option>
                              <option value="Efecto Muñeca (Doll Eye)">Efecto Muñeca (Doll Eye - ojo abierto)</option>
                              <option value="Híbrido Natural">Híbrido Natural (Textura y volumen)</option>
                              <option value="Volumen Ruso Glam">Volumen Ruso Glam (Espesura 3D/5D)</option>
                              <option value="Efecto Wispy / Kim K">Efecto Wispy / Kim K (Espigas desordenadas)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase">Curvatura de Fibra</label>
                            <select 
                              value={editMappingCurvature} 
                              onChange={(e) => setEditMappingCurvature(e.target.value)}
                              className="w-full bg-white border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none"
                            >
                              <option value="C">C (Curva natural estándar)</option>
                              <option value="D">D (Curva pronunciada rizada)</option>
                              <option value="CC">CC (Curva extra dramática)</option>
                              <option value="L">L (Curva L ideal párpados caídos)</option>
                              <option value="M">M (Look foxy angular)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase">Grosor de Hebra</label>
                            <select 
                              value={editMappingThickness}
                              onChange={(e) => setEditMappingThickness(e.target.value)}
                              className="w-full bg-white border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none"
                            >
                              <option value="0.05 mm">0.05 mm (Volumen ultra liviano / mega volumen)</option>
                              <option value="0.07 mm">0.07 mm (Volumen ruso estándar)</option>
                              <option value="0.10 mm">0.10 mm (Pelo a pelo liviano)</option>
                              <option value="0.15 mm">0.15 mm (Pelo a pelo clásico natural)</option>
                              <option value="0.20 mm">0.20 mm (Pelo a pelo grueso rímel)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase font-serif">Lengths (Largo mapa secuencia en mm)</label>
                            <input 
                              type="text"
                              value={editMappingLengths}
                              onChange={(e) => setEditMappingLengths(e.target.value)}
                              placeholder="Ej. 8-9-10-11-12-11 mm"
                              className="w-full bg-white border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none"
                            />
                            <span className="text-[9px] text-zinc-400 mt-1 block">Especificar desde lagrimal a comisura exterior.</span>
                          </div>

                        </div>
                      </div>

                      {/* Clinical warnings inputs */}
                      <div className="space-y-4">
                        <strong className="text-[10px] uppercase font-extrabold text-red-650 tracking-wider block">Historial y Sensibilidades Clínicas</strong>
                        
                        <div className="grid grid-cols-1 gap-4 block text-left">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase">Síntomas / Alergias Oculares (Cianoacrilato, parches, látex)</label>
                            <input 
                              type="text"
                              value={editAllergies}
                              onChange={(e) => setEditAllergies(e.target.value)}
                              placeholder="Ej. Alérgica a parches hidrogel o vapores de pegamento tradicionales."
                              className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-red-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase">Condiciones Médicas Pre-existentes (Embarazo, ojo seco, blefaritis)</label>
                            <input 
                              type="text"
                              value={editMedicalConditions}
                              onChange={(e) => setEditMedicalConditions(e.target.value)}
                              placeholder="Ej. Dermatitis ocasional o embarazo en periodo de gestación de 5 meses"
                              className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase">Notas Diagnósticas y Evolución de Filtraje Clínico</label>
                            <textarea 
                              value={editClinicalNotes}
                              onChange={(e) => setEditClinicalNotes(e.target.value)}
                              placeholder="Ingresa notas detalladas del estado de la pestaña natural de tu clienta (ej. pestañas cortas, ciclo telógeno activo, parches con cinta micropore, etc.)"
                              className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs h-24 focus:ring-1 focus:ring-[#a1762d] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Buttons */}
                      <div className="flex justify-end pt-3 border-t border-zinc-100">
                        <button 
                          onClick={() => {
                            updateClienta(activeClinicalClient.id, {
                              allergies: editAllergies || undefined,
                              medicalConditions: editMedicalConditions || undefined,
                              clinicalNotes: editClinicalNotes || undefined,
                              mapping: {
                                style: editMappingStyle,
                                curvature: editMappingCurvature,
                                thickness: editMappingThickness,
                                lengths: editMappingLengths
                              }
                            });
                            alert('📋 Ficha técnica de diagnóstico guardada correctamente ✓');
                          }}
                          className="bg-[#1e1313] hover:bg-black text-white font-bold py-2 px-6 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          Guardar Ficha Técnica Lashistas ✓
                        </button>
                      </div>

                    </div>
                  )}

                  {/* TAB 2 CONTENT: LIABILITY CONSENT FORM & CANVAS SIGNATURE */}
                  {clinicalTab === 'consent' && (() => {
                    const canvasRefLocal = React.createRef<HTMLCanvasElement>();
                    return (
                      <div className="space-y-6 animate-in fade-in duration-200 text-left">
                        <div>
                          <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                            ✍️ Consentimiento Libre e Informado de Eyelash
                          </h4>
                          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-1">Acuerdo Legal y Liberación de Responsabilidad</p>
                        </div>

                        {/* Scrollable legal text content */}
                        <div className="border border-zinc-200 bg-zinc-50 rounded-2xl p-4 max-h-48 overflow-y-auto text-[11px] text-zinc-600 space-y-3 leading-relaxed font-sans text-left">
                          <p className="font-bold text-zinc-800">CARTA DE CONSENTIMIENTO INFORMADO DE EXTENSIONES DE PESTAÑAS</p>
                          <p>
                            Yo, <strong>{activeClinicalClient.name}</strong>, de manera totalmente voluntaria, autorizo a la profesional de estética acreditada de <strong>Mundo Lashista Pro</strong> a realizar en mi persona la colocación de extensiones de pestañas semipermanentes puestas hebra por hebra.
                          </p>
                          <p>
                            <strong>1. Declaración de salud:</strong> Declaro bajo juramento no presentar orzuelos, queratitis, blefaritis, conjuntivitis activa ni cirugías populares oculares de menos de 12 semanas. Además consiento que me han explicado la conveniencia de realizar un test de parche previo en mi piel para acrilatos si tengo antecedentes severos de dermatitis cutánea.
                          </p>
                          <p>
                            <strong>2. Entendimiento de Riesgo:</strong> Conozco que el pegamento médico genera vapores mínimos que podrían irritar momentáneamente ojos sensibles de color rojo, u originar hinchazón menor y picazón cutánea. Si bien son inusuales, acepto dichos términos.
                          </p>
                          <p>
                            <strong>3. Compromiso de cuidados:</strong> Reconozco que las pestañas requieren mantención libre de frotación, evitar agua o sudor excesivo las primeras 24 horas, no cepillarlas bruscamente en estado mojado, y retirar rímel o aceites no compatibles.
                          </p>
                        </div>

                        {/* Signature block */}
                        {activeClinicalClient.hasConsentSigned ? (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-4">
                            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                              ✓ Consentimiento Firmado Exitosamente
                            </div>
                            <p className="text-zinc-600 text-xs">Este documento fue aprobado y firmado digitalmente el día <strong className="text-emerald-700">{activeClinicalClient.consentSignedDate}</strong> por la clienta.</p>
                            
                            {activeClinicalClient.consentSignature && (
                              <div className="bg-white border border-zinc-200 rounded-xl p-3 max-w-[300px] mx-auto shadow-inner">
                                <span className="text-[9px] text-zinc-400 block uppercase mb-1">Firma Registrada:</span>
                                <img 
                                  src={activeClinicalClient.consentSignature} 
                                  alt="Firma Digital Consentimiento" 
                                  className="h-16 object-contain mx-auto"
                                />
                              </div>
                            )}

                            <button 
                              onClick={() => {
                                updateClienta(activeClinicalClient.id, {
                                  hasConsentSigned: false,
                                  consentSignedDate: undefined,
                                  consentSignature: undefined
                                });
                              }}
                              className="text-red-500 hover:text-red-700 font-bold hover:underline block mx-auto text-xs cursor-pointer"
                            >
                              Revocar Firma y Volver a Firmar
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 text-center">
                            <span className="block text-zinc-700 text-xs font-bold text-left">Dibuja la firma digital a continuación:</span>
                            
                            {/* Interactive Draw Canvas box */}
                            <div className="bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-2xl p-2 max-w-[450px] mx-auto">
                              <canvas 
                                width={400}
                                height={150}
                                ref={(el) => {
                                  if (el) {
                                    (canvasRefLocal as any).current = el;
                                  }
                                }}
                                onMouseDown={(e) => {
                                  const canvas = canvasRefLocal.current;
                                  if (!canvas) return;
                                  const ctx = canvas.getContext('2d');
                                  if (!ctx) return;
                                  ctx.strokeStyle = '#1e1313';
                                  ctx.lineWidth = 3;
                                  ctx.lineCap = 'round';
                                  const r = canvas.getBoundingClientRect();
                                  ctx.beginPath();
                                  ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
                                  (canvasRefLocal as any).drawing = true;
                                }}
                                onMouseMove={(e) => {
                                  const canvas = canvasRefLocal.current;
                                  if (!canvas || !(canvasRefLocal as any).drawing) return;
                                  const ctx = canvas.getContext('2d');
                                  if (!ctx) return;
                                  const r = canvas.getBoundingClientRect();
                                  ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
                                  ctx.stroke();
                                }}
                                onMouseUp={() => {
                                  (canvasRefLocal as any).drawing = false;
                                }}
                                onMouseLeave={() => {
                                  (canvasRefLocal as any).drawing = false;
                                }}
                                onTouchStart={(e) => {
                                  const canvas = canvasRefLocal.current;
                                  if (!canvas) return;
                                  const ctx = canvas.getContext('2d');
                                  if (!ctx) return;
                                  ctx.strokeStyle = '#1e1313';
                                  ctx.lineWidth = 3;
                                  ctx.lineCap = 'round';
                                  const r = canvas.getBoundingClientRect();
                                  const t = e.touches[0];
                                  ctx.beginPath();
                                  ctx.moveTo(t.clientX - r.left, t.clientY - r.top);
                                  (canvasRefLocal as any).drawing = true;
                                }}
                                onTouchMove={(e) => {
                                  const canvas = canvasRefLocal.current;
                                  if (!canvas || !(canvasRefLocal as any).drawing) return;
                                  const ctx = canvas.getContext('2d');
                                  if (!ctx) return;
                                  const r = canvas.getBoundingClientRect();
                                  const t = e.touches[0];
                                  ctx.lineTo(t.clientX - r.left, t.clientY - r.top);
                                  ctx.stroke();
                                  e.preventDefault();
                                }}
                                onTouchEnd={() => {
                                  (canvasRefLocal as any).drawing = false;
                                }}
                                className="w-full bg-white rounded-xl cursor-crosshair shadow-2xs h-[150px] touch-none"
                              />

                              <div className="flex justify-between items-center mt-2 px-1">
                                <span className="text-[10px] text-zinc-450 font-mono">Firma digital interactiva</span>
                                <button 
                                  onClick={() => {
                                    const canvas = canvasRefLocal.current;
                                    if (canvas) {
                                      const ctx = canvas.getContext('2d');
                                      ctx?.clearRect(0, 0, canvas.width, canvas.height);
                                    }
                                  }}
                                  className="text-zinc-500 hover:text-zinc-950 font-bold font-mono text-[10px] uppercase cursor-pointer"
                                >
                                  Limpiar Lienzo ×
                                </button>
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                const canvas = canvasRefLocal.current;
                                if (canvas) {
                                  const base64 = canvas.toDataURL('image/png');
                                  updateClienta(activeClinicalClient.id, {
                                    hasConsentSigned: true,
                                    consentSignedDate: new Date().toLocaleDateString('es-CL'),
                                    consentSignature: base64
                                  });
                                  alert('✍️ ¡Ficha de Consentimiento aprobada y firmada con éxito por la clienta! ✓');
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm block w-full max-w-[450px] mx-auto text-center cursor-pointer"
                            >
                              Guardar Firma & Consentir Tratamiento ✓
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* TAB 3 CONTENT: PHOTO GALLERY & ATTACHMENTS */}
                  {clinicalTab === 'resources' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                        <div className="text-left">
                          <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                            📷 Fichas de Recursos & Fotografías de Servicio
                          </h4>
                          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-1">Carpeta de imágenes del Historial de Pestañas</p>
                        </div>

                        {/* File Upload Trigger */}
                        <div className="relative overflow-hidden cursor-pointer select-none">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                addClinicalResource({
                                  type: 'image',
                                  name: file.name,
                                  url: ev.target?.result as string,
                                  notes: 'Foto cargada desde archivo local'
                                });
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <button className="bg-zinc-900 hover:bg-black text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer">
                            <Upload className="w-4 h-4" /> Subir Fotografía Real
                          </button>
                        </div>
                      </div>

                      {/* simulated stock resources tool choices */}
                      <div className="bg-amber-50 border border-amber-250/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                        <div>
                          <strong className="block text-amber-900 text-[11px] font-bold uppercase mb-1">💡 Caja de Recursos rápidos</strong>
                          <p className="text-zinc-600 text-[11px]">Agrega fotos de portafolio simuladas de forma instantánea para poblar tu maqueta clínica:</p>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <button 
                            onClick={() => injectDemoPhoto('Volumen Ruso Imperial 5D - Antes/Después', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=85')}
                            className="bg-white hover:bg-zinc-100 text-[#121] border border-[#ebd4aa] shadow-2xs rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold cursor-pointer"
                          >
                            + Demo Volumen 5D 👁️
                          </button>
                          <button 
                            onClick={() => injectDemoPhoto('Lifting Curvo Superior Queratina - Resultados', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=85')}
                            className="bg-white hover:bg-zinc-100 text-[#121] border border-[#ebd4aa] shadow-2xs rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold cursor-pointer"
                          >
                            + Demo Lifting Plus ✨
                          </button>
                        </div>
                      </div>

                      {/* Display resources in grid card layout */}
                      {!activeClinicalClient.resources || activeClinicalClient.resources.length === 0 ? (
                        <div className="text-center py-10 text-zinc-400 border border-dashed border-zinc-200 rounded-3xl space-y-2">
                          <Camera className="w-8 h-8 text-zinc-350 mx-auto" />
                          <p className="text-xs font-semibold">No se han cargado fotos u opiniones clínicas de sesión aún.</p>
                          <p className="text-[10px] px-4">Utiliza el botón de subida para registrar fotos de antes y después de tu clienta.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {activeClinicalClient.resources.map(res => (
                            <div key={res.id} className="bg-white border border-zinc-150 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs">
                              {res.type === 'image' ? (
                                <div className="h-32 bg-zinc-100 relative group overflow-hidden">
                                  <img 
                                    referrerPolicy="no-referrer"
                                    src={res.url} 
                                    alt={res.name} 
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <span className="text-white text-[10px] font-extrabold流量 uppercase">Eyelash Portfolio</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-32 bg-zinc-50 flex items-center justify-center border-b border-zinc-100">
                                  <FileText className="w-10 h-10 text-zinc-400" />
                                </div>
                              )}

                              <div className="p-3.5 space-y-2 text-left">
                                <div className="flex justify-between items-start">
                                  <strong className="text-zinc-900 block text-[11px] truncate w-4/5 leading-tight">{res.name}</strong>
                                  <button 
                                    onClick={() => deleteClinicalResource(res.id)}
                                    className="text-zinc-400 hover:text-red-500 font-bold shrink-0 text-xs px-1 cursor-pointer"
                                    title="Eliminar Recurso"
                                  >
                                    ×
                                  </button>
                                </div>
                                
                                <div className="flex justify-between items-center text-[10px] text-zinc-400">
                                  <span className="font-mono">{res.date}</span>
                                  <span className="bg-zinc-100 text-zinc-650 px-1.5 py-0.5 rounded font-bold uppercase text-[8px]">{res.type}</span>
                                </div>

                                <input 
                                  type="text" 
                                  value={res.notes || ''}
                                  placeholder="Agrega comentarios técnicos del servicio..."
                                  onChange={(e) => {
                                    const updatedRes = activeClinicalClient.resources?.map(r => 
                                      r.id === res.id ? { ...r, notes: e.target.value } : r
                                    ) || [];
                                    updateClienta(activeClinicalClient.id, { resources: updatedRes });
                                  }}
                                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-1 px-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-[#a1762d]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4 CONTENT: EDIT GENERAL CONTACT BIO DATA */}
                  {clinicalTab === 'info' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div>
                        <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                          ⚙️ Modificación de Datos Personales y de Contacto
                        </h4>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-1">Información de Perfil de la Clienta</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 block text-left">
                        
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase font-semibold">Nombre y Apellido completo</label>
                          <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase font-semibold">Celular WhatsApp</label>
                          <input 
                            type="text" 
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase font-semibold text-zinc-600">Correo de Facturación o Descuentos</label>
                          <input 
                            type="email" 
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="Ej. clienta@correo.cl"
                            className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase font-semibold">Categoría / Etiqueta de Cliente</label>
                          <select 
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as any)}
                            className="w-full bg-white border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none"
                          >
                            <option value="Nueva">Nueva</option>
                            <option value="Frecuente">Frecuente</option>
                            <option value="VIP">VIP</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase font-semibold">Fecha de Cumpleaños preferente</label>
                          <input 
                            type="text" 
                            value={editBirthday}
                            onChange={(e) => setEditBirthday(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-1 uppercase font-semibold">Último Servicio del Registro</label>
                          <input 
                            type="text" 
                            value={editLastService}
                            onChange={(e) => setEditLastService(e.target.value)}
                            className="w-full bg-white border border-[#ebd4aa]/35 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#a1762d] focus:outline-none font-serif italic"
                          />
                        </div>

                      </div>

                      {/* Update button */}
                      <div className="flex justify-end pt-3 border-t border-zinc-150">
                        <button 
                          onClick={() => {
                            if (!editName || !editPhone) {
                              alert('Se requiere el Nombre y Teléfono obligatoriamente.');
                              return;
                            }
                            updateClienta(activeClinicalClient.id, {
                              name: editName,
                              phone: editPhone,
                              email: editEmail,
                              type: editType,
                              birthday: editBirthday,
                              lastService: editLastService
                            });
                            alert('🔒 ¡Datos de contacto actualizados exitosamente! ✓');
                          }}
                          className="bg-[#1e1313] hover:bg-black text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          Actualizar Datos Personales ✓
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </div>

              {/* Modal Footer bottom actions info */}
              <div className="bg-[#fcfbf9] border-t border-zinc-150 py-3 px-6 flex justify-between items-center text-[10px] text-zinc-400 shrink-0 select-none">
                <span>Sesión activa de Lashista: <strong>{currentLashista?.name || 'María González'}</strong></span>
                <span className="font-mono text-[9px] text-[#a1762d] font-bold uppercase">Mundo Lashista Clínico Pro ✓</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
