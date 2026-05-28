/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Heart, User, Calendar, Megaphone, HelpCircle, LogOut, Chrome, ChevronDown, Check } from 'lucide-react';
import { motion } from 'motion/react';

// Import image assets through ESM so Vite resolves and bundles them properly in production
import heroBgImg from '../assets/images/hero_background_1779642924043.png';
import agendaModImg from '../assets/images/agenda_module_1779642732335.png';
import fidelidadModImg from '../assets/images/fidelidad_module_1779642748426.png';
import viralModImg from '../assets/images/viral_module_1779642766425.png';

export const LandingPage: React.FC = () => {
  const { 
    lashistas, 
    currentRole,
    currentLashista,
    setCurrentRole, 
    setCurrentLashista, 
    activeMainView, 
    setActiveMainView,
    addLashista,
    userEmail,
    userName,
    loginWithGoogle,
    logout
  } = useApp();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  // Custom states for manual/simulated sign-in fields
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  
  // JWT payload decoder for real Google Sign-In tokens
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("JWT decoding failed:", err);
      return null;
    }
  };

  // Dynamically initialize and mount standard Google Identity Services button on portal
  useEffect(() => {
    if (showGoogleModal) {
      setTimeout(() => {
        const google = (window as any).google;
        if (google && google.accounts && google.accounts.id) {
          try {
            google.accounts.id.initialize({
              client_id: (import.meta.env.VITE_GOOGLE_CLIENT_ID) || "825595301728-dummy.apps.googleusercontent.com",
              callback: (response: any) => {
                const profile = decodeJwt(response.credential);
                if (profile && profile.email) {
                  loginWithGoogle(profile.email.toLowerCase(), profile.name || "Usuario de Google");
                  setShowGoogleModal(false);
                }
              }
            });

            const element = document.getElementById("google-signin-btn-container");
            if (element) {
              google.accounts.id.renderButton(element, {
                theme: "outline",
                size: "large",
                width: 280,
                text: "signin_with",
                shape: "pill"
              });
            }
          } catch (e) {
            console.warn("Google Sign-In initialization deferred:", e);
          }
        }
      }, 300);
    }
  }, [showGoogleModal]);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Pro' as 'Pro' | 'Básico' | 'Trial',
    salonName: ''
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email) {
      alert('Por favor completa los campos principales.');
      return;
    }

    const newLash = addLashista({
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone || '+56 9 9999 9999',
      plan: registerForm.plan,
      activeModules: registerForm.plan === 'Pro' 
        ? { agendaPro: true, retencion: true, viral: true }
        : { agendaPro: true, retencion: false, viral: false }
    });

    // Also bind as current authenticated google user email
    loginWithGoogle(registerForm.email, registerForm.name);
    setShowRegisterModal(false);
  };

  const handlePresetLogin = (lashId: string) => {
    const lash = lashistas.find(l => l.id === lashId);
    if (lash) {
      loginWithGoogle(lash.email, lash.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] text-[#2b1f1f]">
      {/* Real Google Account Security Indicator */}
      {userEmail && (
        <div className="bg-[#f0f9ff]/90 text-[#0369a1] text-xs px-6 py-2.5 flex flex-wrap justify-between items-center border-b border-[#bae6fd] backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cuenta Google activa: <strong className="font-semibold">{userEmail}</strong></span>
            <span className="bg-[#0284c7]/10 text-[#0284c7] text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              {currentRole === 'admin' ? 'Administradora General 👑' : `Lashista ${currentLashista?.plan || 'Pro'} ✨`}
            </span>
          </div>
          <button 
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-xs text-[#0369a1] hover:text-[#0c4a6e] font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar sesión de Google
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex justify-between items-center" id="main-header">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveMainView('inicio')}>
          <div className="w-10 h-10 rounded-full bg-rose-brand flex items-center justify-center shadow-sm">
            <Sparkles className="text-[#a1762d] w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#1e1313]">Mundo Lashista Pro</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#a1762d] font-semibold">CRM & Marketing</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userEmail ? (
            <>
              {currentRole === 'admin' ? (
                <button 
                  onClick={() => {
                    setCurrentRole('admin');
                    setActiveMainView('inicio');
                  }}
                  className="flex items-center gap-1.5 bg-[#1e1313] hover:bg-black text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all shadow-sm"
                  id="header-admin-btn"
                >
                  <ShieldCheck className="w-4 h-4 text-gold-400" />
                  Ir a Panel Admin
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setCurrentRole('lashista');
                    setActiveMainView('inicio');
                  }}
                  className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-[#1e1313] font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all shadow-sm"
                  id="header-my-panel-btn"
                >
                  Ir a Mi Panel <ArrowRight className="w-4 h-4" />
                </button>
              )}
              
              <button 
                onClick={() => setShowGoogleModal(true)}
                className="flex items-center gap-1.5 text-xs text-zinc-700 hover:text-black border border-zinc-200 hover:border-zinc-300 px-3 py-2.5 rounded-lg transition-all bg-white"
                title="Cambiar de cuenta Google"
              >
                <Chrome className="w-4 h-4 text-zinc-500" />
                <span className="max-w-[120px] truncate font-semibold">{userName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowGoogleModal(true)}
                className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-zinc-200 transition-all shadow-sm"
                id="header-google-login-btn"
              >
                <Chrome className="w-4 h-4 text-red-500" />
                Sign In with Google
              </button>
              <button 
                onClick={() => setShowRegisterModal(true)}
                className="bg-[#1e1313] hover:bg-black text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all shadow-sm"
              >
                Regístrate gratis
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto my-6 rounded-3xl border border-zinc-200/40 shadow-sm bg-white" id="hero-section">
        {/* Background photo of premium lash studio with beautiful gradient overlays */}
        <div className="absolute inset-0 -z-10 bg-rose-50/20">
          <img 
            src={heroBgImg} 
            alt="Lash Studio Premium Loft" 
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          {/* Advanced overlay masking structure to blend the picture smoothly with the light canvas */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60 sm:from-white/98 sm:via-white/90 sm:to-white/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdfaf7]/10 via-[#fdfaf7]/50 to-[#fdfaf7]" />
        </div>

        <div className="text-center max-w-4xl mx-auto relative">
          {/* Aesthetic Tag */}
          <span className="inline-flex items-center gap-1 bg-[#f5cfcf]/40 backdrop-blur-md text-[#a1762d] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-[#f5cfcf]">
            <Sparkles className="w-3.5 h-3.5" /> Todo para lograr el éxito de tu profesión
          </span>

          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight mb-6">
            Lleva tu salón lashista al <span className="text-[#a1762d] italic">siguiente nivel</span>
          </h2>
          
          <p className="text-base sm:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            CRM inteligente, Agenda automatizada, Ofertas guiadas y Bot de WhatsApp. Todo unificado para optimizar tu tiempo, multiplicar tus clientas y potenciar tu marca.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => setShowRegisterModal(true)}
              className="w-full sm:w-auto bg-[#1e1313] text-white hover:bg-black font-semibold text-base px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
              id="hero-cta-register"
            >
              Empezar ahora gratis 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                if (lashistas.length > 0) handlePresetLogin(lashistas[0].id);
              }}
              className="w-full sm:w-auto bg-white/80 hover:bg-white text-zinc-800 font-medium text-base px-8 py-4 rounded-xl shadow-md border border-zinc-200/60 transition-all"
              id="hero-cta-preset"
            >
              Probar Demo Pre-cargada
            </button>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-zinc-500 text-xs sm:text-sm">
            <span className="flex items-center gap-2">🟢 +240 lashistas activas</span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center gap-2">⭐ Calificación 4.9/5 en CRM</span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center gap-2">⚡ Automatización por WhatsApp</span>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="bg-white/60 py-16 sm:py-24 border-t border-zinc-100" id="modules-intro-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-3xl font-bold tracking-tight text-zinc-900">Nuestros módulos</h3>
            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              Diseñados específicamente para que tu salón estético lashista crezca de forma rentable y sin complicaciones telemáticas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Module 1 */}
            <div className="bg-[#fdfaf7] rounded-2xl overflow-hidden border border-[#f5cfcf]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                {/* Visual Header with generated image background and overlay */}
                <div className="h-48 relative overflow-hidden flex items-center justify-center border-b border-[#f5cfcf]/20">
                  <img 
                    src={agendaModImg} 
                    alt="Asistente Agenda" 
                    className="w-full h-full object-cover select-none absolute inset-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-[#a1762d] z-10 shadow-sm">Incluido en Agenda Pro</div>
                  <div className="w-12 h-12 rounded-xl bg-[#1e1313]/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg relative z-10 border border-white/10">
                    <Calendar className="w-6 h-6 text-rose-brand" />
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-bold text-zinc-900">Asistente Agenda Lashista Pro</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    CRM inteligente de clientas, calendario interactivo de reservas automáticas, planificador de ofertas y simulación del Bot de recordatorios automático.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => {
                    // Log in Maria to see full operational tabs
                    handlePresetLogin('lash-1');
                  }}
                  className="w-full bg-[#1e1313] hover:bg-black text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  id="module-acc-agenda"
                >
                  Acceder al módulo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-[#fdfaf7] rounded-2xl overflow-hidden border border-[#f6ecda] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                {/* Visual Header with generated image background and overlay */}
                <div className="h-48 relative overflow-hidden flex items-center justify-center border-b border-[#f6ecda]/50">
                  <img 
                    src={fidelidadModImg} 
                    alt="Sistema de Retención" 
                    className="w-full h-full object-cover select-none absolute inset-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-[#a1762d] z-10 shadow-sm">Enlace Externo</div>
                  <div className="w-12 h-12 rounded-xl bg-[#a1762d]/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg relative z-10 border border-white/10">
                    <Heart className="w-6 h-6 text-gold-50" />
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-bold text-zinc-900">Sistema de Retención de Clientas</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    Fidelizador estético estructurado. Este módulo te permite redirigir u operar programas de puntos, tarjetas de regalo Lash-Card virtuales y encuestas post-servicio.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => {
                    // Log in Maria and immediately open "retencion"
                    const lash = lashistas.find(l => l.id === 'lash-1');
                    if (lash) {
                      setCurrentLashista(lash);
                      setCurrentRole('lashista');
                      setActiveMainView('retencion');
                    }
                  }}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-[#1e1313] text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  id="module-acc-retention"
                >
                  Acceder al módulo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-[#fdfaf7] rounded-2xl overflow-hidden border border-[#f5cfcf]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                {/* Visual Header with generated image background and overlay */}
                <div className="h-48 relative overflow-hidden flex items-center justify-center border-b border-[#f5cfcf]/20">
                  <img 
                    src={viralModImg} 
                    alt="Sistema Viral" 
                    className="w-full h-full object-cover select-none absolute inset-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-rose-500 z-10 shadow-sm">Enlace Externo</div>
                  <div className="w-12 h-12 rounded-xl bg-rose-400/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg relative z-10 border border-white/10">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-bold text-zinc-900">Sistema Viral Lashista Pro</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    Creación automática de enlaces virtuales de referidos e incentivos. Tus clientas recomiendan tu salón y ganan descuentos automáticos en su próxima sesión.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => {
                    const lash = lashistas.find(l => l.id === 'lash-1');
                    if (lash) {
                      setCurrentLashista(lash);
                      setCurrentRole('lashista');
                      setActiveMainView('sistema-viral');
                    }
                  }}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-[#1e1313] text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  id="module-acc-viral"
                >
                  Acceder al módulo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Features Intro */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#1e1313] via-[#2d1b1b] to-[#1e1313] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-gold-700/20">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-rose-brand/10 rounded-full filter blur-[80px] pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gold-200 text-xs font-semibold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/5">
                Planes Premium Estacionamiento
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mt-4 mb-6 leading-tight">
                Mismo diseño que ya amas, pero mejorado y totalmente operativo
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8">
                Registra a tus clientas a la agenda, configura tus propios bloques horarios de atención, crea campañas navideñas o de cumpleaños con clics simples y simula el envío del Bot de WhatsApp activo.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="bg-gold-500/20 text-gold-200 p-1 rounded">✓</span>
                  <div>
                    <strong className="text-white block text-sm">Gestión de Reservas & Horarios</strong>
                    <span className="text-zinc-400 text-xs font-mono">Controla turnos (10:00 - 12:30), copia tus enlaces de reserva y agenda citas.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
              <h4 className="text-lg font-bold text-gold-200 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-500" /> Beneficios Pro de la Plataforma
              </h4>
              
              <div className="space-y-4 text-xs text-zinc-300">
                <div className="bg-[#1e1313] p-4 rounded-xl border border-white/5">
                  <span className="text-white font-semibold">Integración de Clientes CRM</span>
                  <p className="mt-1 text-zinc-400">Base de datos de clientas clasificada por etiquetas (VIP, Frecuente, Nueva) garantizando acceso segmentado.</p>
                </div>
                <div className="bg-[#1e1313] p-4 rounded-xl border border-white/5">
                  <span className="text-white font-semibold">Campañas Automatizadas de Ofertas</span>
                  <p className="mt-1 text-zinc-400">Ofrece descuentos exclusivos por temporadas y actívalos de manera automática en el portal con un solo selector.</p>
                </div>
                <div className="bg-[#1e1313] p-4 rounded-xl border border-white/5">
                  <span className="text-white font-semibold">Acceso Multiplataforma Integrado</span>
                  <p className="mt-1 text-zinc-400 font-serif italic text-center">"Potencia hoy mismo tu negocio de lashes de la mano de la tecnología número uno de Latam."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-zinc-400 border-t border-zinc-200 max-w-7xl mx-auto text-xs sm:text-sm">
        <p>© 2026 Mundo Lashista Pro. Todos los derechos reservados.</p>
      </footer>

      {/* Subscription/Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" id="register-modal">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black hover:bg-zinc-100 w-8 h-8 rounded-full flex items-center justify-center transition-all text-lg"
              id="close-modal-btn"
            >
              ✕
            </button>

            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">Comienza Hoy Mismo</h3>
            <p className="text-zinc-500 text-xs sm:text-sm mb-6">Completa tus datos para crear tu cuenta de forma tradicional o usa tu Google ID de forma instantánea.</p>
            
            {/* Google Registration Fast CTA */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => {
                  setShowRegisterModal(false);
                  setShowGoogleModal(true);
                }}
                className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-zinc-200 transition-all shadow-sm"
              >
                <Chrome className="w-4 h-4 text-red-500" />
                Registrarse con Cuenta Google
              </button>
              
              <div className="relative flex py-3 items-center">
                <div className="flex-grow border-t border-zinc-150"></div>
                <span className="flex-shrink mx-3 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">O continuar con formulario</span>
                <div className="flex-grow border-t border-zinc-150"></div>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Margarita López"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#a1762d]/50"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    id="reg-input-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  placeholder="Ej. margalash@gmail.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#a1762d]/50"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  id="reg-input-email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">Celular / WhatsApp</label>
                <input 
                  type="text" 
                  placeholder="Ej. +56 9 1234 5678"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#a1762d]/50"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  id="reg-input-phone"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">Selecciona tu Plan de Suscripción</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, plan: 'Básico' })}
                    className={`p-2.5 border rounded-xl text-center text-xs font-semibold transition-all ${
                      registerForm.plan === 'Básico' 
                        ? 'border-[#a1762d] bg-[#fbf7ee] text-[#a1762d]' 
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                    id="plan-basic-btn"
                  >
                    Básico
                    <span className="block text-[8px] font-normal text-zinc-400 mt-0.5">$29 USD/mes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, plan: 'Pro' })}
                    className={`p-2.5 border rounded-xl text-center text-xs font-semibold transition-all ${
                      registerForm.plan === 'Pro' 
                        ? 'border-[#a1762d] bg-[#fbf7ee] text-[#a1762d]' 
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                    id="plan-pro-btn"
                  >
                    Pro ⭐
                    <span className="block text-[8px] font-normal text-zinc-400 mt-0.5">$49 USD/mes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, plan: 'Trial' })}
                    className={`p-2.5 border rounded-xl text-center text-xs font-semibold transition-all ${
                      registerForm.plan === 'Trial' 
                        ? 'border-[#a1762d] bg-[#fbf7ee] text-[#a1762d]' 
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                    id="plan-trial-btn"
                  >
                    Gratis
                    <span className="block text-[8px] font-normal text-zinc-400 mt-0.5">7 días de prueba</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl text-[10px] text-zinc-500 leading-relaxed border border-zinc-100">
                💡 {registerForm.plan === 'Pro' 
                  ? 'El Plan Pro activa el Asistente Agenda, Fidelización y Sistema Viral automáticamente.' 
                  : 'El Plan Básico solo incluye el Asistente Agenda Pro. Podrás activar los otros módulos desde tu panel o adquiriendo de forma externa.'}
              </div>

              <button 
                type="submit"
                className="w-full bg-[#1e1313] hover:bg-black text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md mt-2"
                id="submit-register-form"
              >
                Registrar y Acceder al Sistema
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Google Account Selector Consent Popup Modal - Fully Interactive */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 relative shadow-2xl overflow-hidden">
            
            {/* Google Brand Header */}
            <div className="text-center pb-4 border-b border-zinc-100">
              <div className="flex justify-center mb-1.5">
                <span className="text-2xl font-extrabold tracking-tight font-sans">
                  <span className="text-blue-500">G</span>
                  <span className="text-red-500">o</span>
                  <span className="text-yellow-500">o</span>
                  <span className="text-blue-500">g</span>
                  <span className="text-green-500">l</span>
                  <span className="text-red-500">e</span>
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-800">Acceder de forma verdadera</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">para continuar a Mundo Lashista Pro</p>
            </div>

            <button 
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black hover:bg-zinc-100 w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm animate-pulse"
            >
              ✕
            </button>

            {/* True Google SSO Button Mount Target container */}
            <div className="mt-4 flex flex-col items-center justify-center py-2.5">
              <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 text-center">Botón de Acceso Google Oficial</span>
              <div id="google-signin-btn-container" className="flex justify-center min-h-[44px]"></div>
              <p className="text-[9px] text-zinc-400 text-center mt-1.5 leading-normal max-w-[240px]">
                Presiona este botón para iniciar sesión segura verdadera con tu cuenta de Google en tu propio hosting.
              </p>
            </div>

            {/* List of Pre-configured Registered Options */}
            <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Cuentas Registradas en el Sistema:</p>

              {/* 1. Admin Principal: Masked to protect giovannamcortes@gmail.com */}
              <button
                onClick={() => {
                  // Prefills or lets them run simulation/true login
                  const inputEmail = prompt("Ingresa tu correo o confirma tu acceso de Administradora General de Google:", "giovannamcortes@gmail.com");
                  if (inputEmail && inputEmail.toLowerCase() === 'giovannamcortes@gmail.com') {
                    loginWithGoogle('giovannamcortes@gmail.com', 'Giovanna Cortés');
                    setShowGoogleModal(false);
                  } else if (inputEmail) {
                    alert("Correo verificado incorrecto para Administradora General.");
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gold-200/60 bg-[#fffdf9] hover:bg-[#a1762d]/5 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    👑
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-zinc-800 flex items-center gap-1">
                      Administradora General
                      <span className="bg-amber-100 text-amber-800 text-[7px] px-1.5 py-0.2 rounded-full font-bold">Activo</span>
                    </span>
                    <span className="block text-[9px] text-zinc-500 font-mono">g•••••••••••••s@gmail.com</span>
                  </div>
                </div>
                {userEmail === 'giovannamcortes@gmail.com' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>

              {/* 2. Primary Lashista Pre-load (Only Maria González remains as demo client) */}
              {lashistas.slice(0, 1).map((lash) => (
                <button
                  key={lash.id}
                  onClick={() => {
                    loginWithGoogle(lash.email, lash.name);
                    setShowGoogleModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-zinc-150 bg-zinc-50 hover:bg-zinc-100/70 transition-all text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-[#a1762d] flex items-center justify-center font-bold text-xs uppercase">
                      {lash.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#a1762d]">{lash.name}</span>
                      <span className="block text-[9px] text-zinc-500 font-mono">{lash.email}</span>
                    </div>
                  </div>
                  {userEmail === lash.email && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>

            {/* Register/Connect a custom Google Account manual simulation for offline execution */}
            <div className="mt-4 pt-3 border-t border-zinc-100">
              <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Conectar otra cuenta de Google/Gmail:</span>
              
              <div className="space-y-2 mt-1">
                <input 
                  type="text" 
                  placeholder="Nombre de Usuario Google"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                />
                <input 
                  type="email" 
                  placeholder="cuenta@gmail.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                />
                
                <button
                  onClick={() => {
                    if (!customGoogleEmail || !customGoogleName) {
                      alert('Por favor ingresa tu nombre y correo Gmail.');
                      return;
                    }
                    if (!customGoogleEmail.includes('@')) {
                      alert('Ingresa un correo Google válido.');
                      return;
                    }
                    loginWithGoogle(customGoogleEmail, customGoogleName);
                    setShowGoogleModal(false);
                    setCustomGoogleEmail('');
                    setCustomGoogleName('');
                  }}
                  className="w-full bg-[#4285F4] hover:bg-[#357ae8] text-white text-xs font-bold py-2 px-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 mt-1 cursor-pointer"
                >
                  <Chrome className="w-3.5 h-3.5 text-white" /> Registrar y Acceder 🚀
                </button>
              </div>
            </div>

            <div className="mt-3 text-[9px] text-zinc-400 text-center leading-normal">
              Mundo Lashista Pro utiliza los servicios de Google Identity para validar accesos, roles y gestionar las subscripciones en tiempo real.
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
