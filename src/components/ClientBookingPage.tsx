/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment, Clienta } from '../types';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  User, 
  Phone, 
  Mail,
  Gift, 
  CheckCircle, 
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Sparkle
} from 'lucide-react';

interface ClientBookingPageProps {
  lashistaId: string;
  onClose?: () => void;
}

export const ClientBookingPage: React.FC<ClientBookingPageProps> = ({ lashistaId, onClose }) => {
  const { 
    lashistas, 
    appointments, 
    addAppointment, 
    addClienta, 
    clientas,
    workHours 
  } = useApp();

  // Find the lashista this link belongs to
  const lashista = lashistas.find(l => l.id === lashistaId) || lashistas[0];

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDate, setSelectedDate] = useState('2026-05-24'); // Default base date matching the app's timeline
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Form fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientBirthday, setClientBirthday] = useState('');
  const [selectedService, setSelectedService] = useState('Lifting de pestañas');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // List of professional services
  const services = [
    { name: 'Lifting de pestañas', duration: 60, price: '$22.000', desc: 'Arqueado natural y nutrición extrema para tus pestañas.' },
    { name: 'Volumen clásico', duration: 90, price: '$35.000', desc: 'Efecto rímel perfecto con postura uno a uno.' },
    { name: 'Volumen ruso', duration: 120, price: '$48.000', desc: 'Máxima densidad y volumen glamuroso hecho a mano.' },
    { name: 'Pestañas pelo a pelo', duration: 90, price: '$30.000', desc: 'Longitud y elegancia natural con fibras premium.' },
    { name: 'Diseño de cejas', duration: 45, price: '$15.000', desc: 'Depilación precisa, visajismo y perfilado profesional.' },
  ];

  // Generating a realistic array of days for the picker (May 24 to May 30, 2026)
  const availableDates = [
    { date: '2026-05-24', dayName: 'Domingo', label: '24 Mayo', closed: false },
    { date: '2026-05-25', dayName: 'Lunes', label: '25 Mayo', closed: false },
    { date: '2026-05-26', dayName: 'Martes', label: '26 Mayo', closed: false },
    { date: '2026-05-27', dayName: 'Miércoles', label: '27 Mayo', closed: false },
    { date: '2026-05-28', dayName: 'Jueves', label: '28 Mayo', closed: false },
    { date: '2026-05-29', dayName: 'Viernes', label: '29 Mayo', closed: false },
    { date: '2026-05-30', dayName: 'Sábado', label: '30 Mayo', closed: false },
  ];

  // Preset time slots
  const genericTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Helper check if a slot is already taken on that date
  const isSlotOccupied = (time: string, date: string) => {
    return appointments.some(app => app.date === date && app.time === time);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !selectedTime) {
      alert('Por favor, completa todos los campos del formulario.');
      return;
    }

    const duration = services.find(s => s.name === selectedService)?.duration || 60;

    // 1. Add appointment to database
    addAppointment({
      clientaName: clientName,
      time: selectedTime,
      duration: duration,
      service: selectedService,
      date: selectedDate,
      status: 'Pendiente' // Self booking starts as Pending for confirmation
    });

    // 2. Add client to CRM if they don't already exist
    const clientExists = clientas.some(cli => cli.phone === clientPhone);
    if (!clientExists) {
      addClienta({
        name: clientName,
        phone: clientPhone,
        email: clientEmail || undefined,
        birthday: clientBirthday || 'No especifica',
        type: 'Nueva',
        lastService: selectedService,
        whatsAppStatus: 'Pendiente'
      });
    }

    setIsSubmitted(true);
  };

  if (!lashista) {
    return <div className="p-12 text-center text-zinc-500">Sesión de reservas inválida.</div>;
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] text-[#2b1f1f] flex flex-col justify-between">
      
      {/* Client Header bar */}
      <header className="bg-white border-b border-zinc-100 shadow-sm sticky top-0 z-50 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-brand flex items-center justify-center">
              <Sparkles className="text-[#a1762d] w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-900 tracking-tight">Portal de Reservas Autónomas</h1>
              <p className="text-[10px] text-[#a1762d] uppercase tracking-wider font-semibold">Desarrollado por Mundo Lashista Pro</p>
            </div>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="text-xs font-semibold text-zinc-500 hover:text-black hover:bg-zinc-100 py-1.5 px-3 rounded-lg transition-all flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Portal
            </button>
          )}
        </div>
      </header>

      {/* Main Reservation Canvas */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-8 flex-1">
        
        {/* Banner Card displaying Lashista details */}
        <div className="bg-[#1e1313] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-gold-700/20 mb-8">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-rose-brand/10 rounded-full filter blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div>
              <span className="text-gold-200 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/5">
                👑 Estilista Certificada Pro
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-3 text-white">Haz tu Reserva con {lashista?.name}</h2>
              <p className="text-zinc-300 text-xs sm:text-sm mt-1 max-w-xl">
                Selecciona tu servicio de pestañas o cejas premium, escoge el día y hora ideal, y el sistema agendará tu bloque de forma instantánea.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0 font-mono text-center">
              <span className="text-[9px] text-zinc-400 block uppercase">Canal de WhatsApp</span>
              <span className="text-gold-200 text-xs font-semibold block mt-0.5">{lashista?.phone}</span>
              <span className="text-[9px] text-emerald-400 block mt-1">🟢 Enlace Activo Autónomo</span>
            </div>
          </div>
        </div>

        {/* Dynamic Success Mode */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-xl p-8 max-w-lg mx-auto text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-bold text-zinc-900 mb-1">¡Cita Solicitada con Éxito! 🎉</h3>
            <p className="text-zinc-500 text-xs sm:text-xs mb-6 max-w-md mx-auto leading-relaxed">
              Hola, <span className="font-semibold text-zinc-950">{clientName}</span>. Hemos agendado tu turno de manera autónoma en el sistema de <span className="font-semibold text-[#a1762d]">{lashista.name}</span>.
            </p>

            {/* Simulated Email Voucher / Comprobante de Reserva */}
            <div className="border-2 border-dashed border-[#ebd4aa] bg-[#fbf7ee]/40 rounded-2xl p-5 text-left mb-6 relative">
              <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#a1762d] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Comprobante de Reserva #LASH-{Math.floor(1000 + Math.random() * 9000)}
              </div>

              <div className="flex justify-between items-start border-b border-[#ebd4aa]/30 pb-3 mb-3">
                <div>
                  <h4 className="font-bold text-xs text-zinc-800">Servicio de Belleza</h4>
                  <span className="text-[#a1762d] text-sm font-extrabold block mt-0.5">{selectedService}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block font-normal">Estado de Alerta</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sistema Activo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs mb-3">
                <div>
                  <span className="text-zinc-400 text-[10px] block uppercase">Fecha Elegida</span>
                  <span className="font-bold text-zinc-800">{selectedDate}</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] block uppercase">Bloque Horario</span>
                  <span className="font-bold text-[#a1762d] font-mono">{selectedTime} hrs</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] block uppercase">Celular Cliente</span>
                  <span className="font-bold text-zinc-800 font-mono">{clientPhone}</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] block uppercase">Estilista Pro</span>
                  <span className="font-semibold text-zinc-800">{lashista.name}</span>
                </div>
              </div>

              <div className="border-t border-[#ebd4aa]/20 pt-3 bg-white/65 -mx-5 -mb-5 p-4 rounded-b-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#a1762d]" />
                </div>
                <div className="leading-tight">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase block tracking-wider">Comprobante enviado a:</span>
                  <span className="text-xs font-bold text-zinc-900 font-mono break-all">{clientEmail || 'francisca@correo.cl'}</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-left text-xs text-emerald-800 leading-relaxed mb-6 space-y-2">
              <div className="flex gap-2">
                <span className="shrink-0 bg-emerald-500/10 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">1</span>
                <span><strong>Comprobante Digital:</strong> Un correo informativo con tu ticket PDF se ha generado automáticamente y se encuentra de camino a tu inbox.</span>
              </div>
              <div className="flex gap-2 pt-1 border-t border-emerald-100">
                <span className="shrink-0 bg-emerald-500/10 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">2</span>
                <span><strong>Recordatorio de Cita (Mañana):</strong> El motor del sistema te enviará una notificación por WhatsApp el día de mañana para reconfirmar tu bloque antes de la atención.</span>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setClientName('');
                  setClientPhone('');
                  setClientEmail('');
                  setSelectedTime(null);
                  setStep(1);
                }}
                className="w-full bg-[#1e1313] hover:bg-black text-white font-semibold text-xs py-3 px-4 rounded-xl transition-all"
              >
                Reservar otra hora
              </button>
              
              {onClose && (
                <button 
                  onClick={onClose}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all"
                >
                  Volver al Panel Administrativo
                </button>
              )}
            </div>
          </div>
        ) : (
          <div id="booking-workflow-box">
            
            {/* Steps Indicator */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${step === 1 ? 'bg-[#1e1313] text-white shadow-sm' : 'bg-zinc-200/60 text-zinc-500'}`}>
                1. Agenda & Tratamiento
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${step === 2 ? 'bg-[#1e1313] text-white shadow-sm' : 'bg-zinc-200/60 text-zinc-500'}`}>
                2. Datos de Contacto
              </span>
            </div>

            {/* Step 1: Services, Calendar & Availability */}
            {step === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Services selection */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6">
                    <h3 className="font-bold text-zinc-900 text-sm mb-4 flex items-center gap-1.5">
                      <Sparkle className="w-4 h-4 text-[#a1762d]" /> Selecciona tu Tratamiento
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {services.map((serv) => (
                        <label 
                          key={serv.name}
                          onClick={() => setSelectedService(serv.name)}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all flex justify-between items-center ${
                            selectedService === serv.name 
                              ? 'bg-amber-50/40 border-[#ebd4aa] shadow-sm' 
                              : 'bg-white border-zinc-200/60 hover:bg-zinc-50/40'
                          }`}
                        >
                          <div className="text-left">
                            <span className="font-bold text-xs sm:text-sm text-zinc-900 block">{serv.name}</span>
                            <span className="text-[10px] text-zinc-400 block mt-0.5 leading-relaxed">{serv.desc}</span>
                            <span className="text-[10px] text-zinc-500 font-medium font-mono mt-1 inline-block">⏱ Duración: {serv.duration} min</span>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-[#a1762d]">{serv.price}</span>
                            <div className={`w-4 h-4 rounded-full border mt-1.5 flex items-center justify-center mx-auto ${
                              selectedService === serv.name ? 'border-[#a1762d] bg-[#a1762d]' : 'border-zinc-300 bg-white'
                            }`}>
                              {selectedService === serv.name && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Calendar Dates & Hour slots choosing template */}
                <div className="space-y-6">
                  {/* Select date */}
                  <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 text-center">
                    <h3 className="font-bold text-zinc-900 text-sm mb-3">Escoge la Fecha</h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                      {availableDates.map((day) => (
                        <button 
                          key={day.date}
                          onClick={() => {
                            setSelectedDate(day.date);
                            setSelectedTime(null); // Reset choice upon switching dates safely
                          }}
                          className={`p-2.5 border rounded-xl text-center transition-all ${
                            selectedDate === day.date 
                              ? 'bg-[#1e1313] text-white border-[#1e1313] shadow-md' 
                              : 'bg-zinc-50 border-zinc-200/60 text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <span className="block text-[8px] uppercase tracking-wider text-opacity-80 font-semibold">{day.dayName}</span>
                          <span className="block text-xs font-bold mt-0.5">{day.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hour Selection slots */}
                  <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 text-center">
                    <h3 className="font-bold text-zinc-900 text-sm mb-1">Horas Disponibles</h3>
                    <p className="text-[10px] text-zinc-400 mb-4 font-normal">Sincronizado en tiempo real</p>
                    
                    <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {genericTimeSlots.map((time) => {
                        const occupied = isSlotOccupied(time, selectedDate);
                        const isChosenSinceNow = selectedTime === time;

                        return (
                          <button 
                            key={time}
                            disabled={occupied}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2.5 text-xs rounded-xl font-semibold border transition-all flex flex-col items-center justify-center ${
                              occupied 
                                ? 'bg-zinc-100 border-zinc-100 text-zinc-300 cursor-not-allowed line-through' 
                                : isChosenSinceNow 
                                  ? 'bg-[#a1762d] text-white border-[#a1762d] shadow-sm'
                                  : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                            }`}
                          >
                            <span>{time}</span>
                            <span className="text-[8px] opacity-75 mt-0.5">
                              {occupied ? 'Ocupado' : 'Disponible'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions to next step */}
                  <button 
                    disabled={!selectedTime}
                    onClick={() => setStep(2)}
                    className="w-full bg-[#1e1313] hover:bg-black text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ingresar mis Datos <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* Step 2: Contact Form Registration */}
            {step === 2 && (
              <div className="bg-white rounded-3xl border border-zinc-100 shadow-md max-w-xl mx-auto p-6 sm:p-8">
                
                <h3 className="font-bold text-zinc-900 text-lg mb-2">Paso 2: Completa tu Inscripción</h3>
                <p className="text-zinc-500 text-xs sm:text-sm mb-6">
                  Por favor, ingresa tus datos auténticos para registrar tu hora en la agenda del salón y garantizar la confirmación automática por WhatsApp.
                </p>

                {/* Reservation briefing */}
                <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-4 text-xs space-y-2 mb-6 text-zinc-700">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tratamiento:</span>
                    <span className="font-bold text-zinc-950">{selectedService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Fecha:</span>
                    <span className="font-bold text-zinc-950">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Horario Bloque:</span>
                    <span className="font-[#a1762d] font-bold">{selectedTime} hrs</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-zinc-200/60 font-semibold">
                    <span className="text-zinc-400">Valor Estimado:</span>
                    <span className="text-[#a1762d] font-bold">
                      {services.find(s => s.name === selectedService)?.price}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Client name */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Francisca Pérez"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-10 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:bg-white transition-all text-zinc-800 font-semibold"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Client Email */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">Correo Electrónico (para tu Comprobante Digital 📧)</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="email" 
                        required
                        placeholder="Ej. francisca@correo.cl"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-10 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:bg-white transition-all text-zinc-800 font-semibold"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-400 block mt-1">El sistema enviará de inmediato tu comprobante y ticket de atención en formato PDF.</span>
                  </div>

                  {/* Client Whatsapp */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">WhatsApp de Contacto</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="tel" 
                        required
                        placeholder="Ej. +56 9 8271 2818"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-10 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:bg-white transition-all text-zinc-800 font-mono"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-400 block mt-1">Ingresa el WhatsApp con el código de país.</span>
                  </div>

                  {/* Client Birthday */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1 flex justify-between">
                      <span>Tu Fecha de Cumpleaños</span>
                      <span className="text-[10px] text-rose-500 uppercase font-bold tracking-wide">¡Descuento de Trato VIP! 🎁</span>
                    </label>
                    <div className="relative">
                      <Gift className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
                      <input 
                        type="text" 
                        placeholder="Ej. 15 Mar (Día y Mes)"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-10 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:bg-white transition-all text-zinc-800"
                        value={clientBirthday}
                        onChange={(e) => setClientBirthday(e.target.value)}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-400 block mt-1">Utilizamos esta fecha para enviarte ofertas automatizadas en tu mes especial.</span>
                  </div>

                  {/* Submission and back controls */}
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="w-3/12 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs py-3 rounded-xl transition-all"
                    >
                      Atrás
                    </button>
                    
                    <button 
                      type="submit" 
                      className="w-9/12 bg-gold-500 hover:bg-gold-600 text-zinc-950 font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-4 h-4" /> Confirmar Reserva Autónoma
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Decorative Brand footer */}
      <footer className="bg-white border-t border-zinc-100 text-center py-6 text-zinc-400 text-[11px] leading-snug mt-12 bg-rose-50/5">
        <p className="font-semibold text-zinc-800 font-serif italic text-sm">"Potenciado hoy mismo con Mundo Lashista Pro"</p>
        <p className="mt-1 font-mono uppercase tracking-widest text-[9px] text-[#a1762d] font-bold">Base de Datos de Citas y Clientes Automatizada SCL</p>
      </footer>

    </div>
  );
};
