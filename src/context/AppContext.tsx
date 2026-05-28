/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Lashista, 
  Clienta, 
  Appointment, 
  Campaign, 
  WorkHour, 
  SystemStats 
} from '../types';

interface AppContextType {
  // Authentication & View States
  currentRole: 'public' | 'admin' | 'lashista';
  currentLashista: Lashista | null;
  setCurrentRole: (role: 'public' | 'admin' | 'lashista') => void;
  setCurrentLashista: (lashista: Lashista | null) => void;
  userEmail: string | null;
  userName: string | null;
  loginWithGoogle: (email: string, name: string) => void;
  logout: () => void;
  
  // App navigation
  activeMainView: string; // 'inicio' | 'agenda-pro' | 'servicios' | 'retencion' | 'sistema-viral'
  setActiveMainView: (view: string) => void;

  // Lashistas (Admin view)
  lashistas: Lashista[];
  addLashista: (lashista: Omit<Lashista, 'id' | 'registeredDate'>) => Lashista;
  toggleModuleAccess: (lashistaId: string, module: 'agendaPro' | 'retencion' | 'viral') => void;
  updateLashistaPlan: (lashistaId: string, plan: 'Básico' | 'Pro' | 'Trial') => void;
  deleteLashista: (lashistaId: string) => void;
  updateLashista: (lashistaId: string, updatedFields: Partial<Lashista>) => void;

  // CRM Clientas (Lashista dynamic CRM)
  clientas: Clienta[];
  addClienta: (clienta: Omit<Clienta, 'id'>) => void;
  updateClienta: (id: string, updatedFields: Partial<Clienta>) => void;
  deleteClienta: (id: string) => void;

  // Booking / Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  toggleAppointmentStatus: (id: string) => void;
  deleteAppointment: (id: string) => void;

  // Campaigns / Offers
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  toggleCampaignActive: (id: string) => void;
  deleteCampaign: (id: string) => void;

  // Work Hours
  workHours: WorkHour[];
  updateWorkHours: (day: string, hours: string, closed: boolean) => void;

  // Mass Email Log Simulation
  emailLogs: { id: string; date: string; subject: string; targetGroup: string; recipientCount: number }[];
  sendMassEmail: (targetGroup: string, subject: string, body: string) => string;

  // Global Analytics State
  stats: SystemStats;
  triggerStatsRefresh: () => void;

  // File-based state backup structures
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Static Data
const INITIAL_LASHISTAS: Lashista[] = [
  {
    id: 'lash-1',
    name: 'María González',
    email: 'maria@lashstudio.cl',
    phone: '+56 9 8765 4321',
    plan: 'Pro',
    registeredDate: '12 May 2026',
    activeModules: { agendaPro: true, retencion: true, viral: true },
    remainingDays: 30
  }
];

const INITIAL_CLIENTAS: Clienta[] = [
  {
    id: 'cli-1',
    name: 'María González',
    phone: '+56 9 8765 4311',
    email: 'maria.gonzalez@correo.cl',
    birthday: '15 Mar',
    type: 'VIP',
    lastService: 'Lifting de pestañas',
    whatsAppStatus: 'Activo',
    registrationDate: '2025-05-24' // Exactly 1 year ago (May 24, 2025 relative to today May 24, 2026)
  },
  {
    id: 'cli-2',
    name: 'Camila Rojas',
    phone: '+56 9 1234 5678',
    email: 'camila.rojas@gmail.com',
    birthday: '22 Jul',
    type: 'Frecuente',
    lastService: 'Volumen ruso',
    whatsAppStatus: 'Activo',
    registrationDate: '2025-11-12'
  },
  {
    id: 'cli-3',
    name: 'Sofía Pérez',
    phone: '+56 9 9988 7766',
    email: 'sofia.perezz@outlook.com',
    birthday: '03 Sep',
    type: 'Nueva',
    lastService: 'Diseño de cejas',
    whatsAppStatus: 'Pendiente',
    registrationDate: '2026-02-01'
  },
  {
    id: 'cli-4',
    name: 'Valentina Soto',
    phone: '+56 9 5544 3322',
    email: 'vale.soto.beauty@gmail.com',
    birthday: '24 May', // Birthday TODAY! (May 24 relative to May 24, 2026)
    type: 'VIP',
    lastService: 'Pestañas pelo a pelo',
    whatsAppStatus: 'Activo',
    registrationDate: '2025-08-15'
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    clientaName: 'María González',
    time: '10:00',
    duration: 60,
    service: 'Lifting de pestañas',
    date: '2026-05-24',
    status: 'Confirmado'
  },
  {
    id: 'app-2',
    clientaName: 'Camila Rojas',
    time: '12:30',
    duration: 120,
    service: 'Volumen ruso',
    date: '2026-05-24',
    status: 'Pendiente'
  },
  {
    id: 'app-3',
    clientaName: 'Sofía Pérez',
    time: '15:00',
    duration: 90,
    service: 'Diseño de cejas',
    date: '2026-05-25',
    status: 'Confirmado'
  },
  {
    id: 'app-4',
    clientaName: 'Valentina Soto',
    time: '11:00',
    duration: 60,
    service: 'Pestañas pelo a pelo',
    date: '2026-05-26',
    status: 'Confirmado'
  },
  {
    id: 'app-5',
    clientaName: 'Cynthia Alarcón',
    time: '09:00',
    duration: 90,
    service: 'Volumen clásico',
    date: '2026-05-26',
    status: 'Pendiente'
  }
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Promo Cumple',
    service: 'Lifting',
    dateRange: '01/03 → 31/03',
    discount: '-20%',
    active: true
  },
  {
    id: 'camp-2',
    name: 'Mes de Mamá',
    service: 'Volumen ruso',
    dateRange: '01/05 → 31/05',
    discount: '-15%',
    active: false
  }
];

const INITIAL_WORK_HOURS: WorkHour[] = [
  { day: 'Lun', hours: '09:00-19:00', closed: false },
  { day: 'Mar', hours: '09:00-19:00', closed: false },
  { day: 'Mié', hours: '09:00-19:00', closed: false },
  { day: 'Jue', hours: '09:00-19:00', closed: false },
  { day: 'Vie', hours: '09:00-20:00', closed: false },
  { day: 'Sáb', hours: '10:00-18:00', closed: false },
  { day: 'Dom', hours: 'Cerrado', closed: true }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasLoadedServer, setHasLoadedServer] = useState(false);
  
  // Try loading from localStorage, otherwise keep default initial lists
  const [lashistas, setLashistas] = useState<Lashista[]>(() => {
    const saved = localStorage.getItem('m_lash_lashistas');
    return saved ? JSON.parse(saved) : INITIAL_LASHISTAS;
  });

  const [clientas, setClientas] = useState<Clienta[]>(() => {
    const saved = localStorage.getItem('m_lash_clientas');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTAS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('m_lash_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('m_lash_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [workHours, setWorkHours] = useState<WorkHour[]>(() => {
    const saved = localStorage.getItem('m_lash_workHours');
    return saved ? JSON.parse(saved) : INITIAL_WORK_HOURS;
  });

  const [emailLogs, setEmailLogs] = useState<{ id: string; date: string; subject: string; targetGroup: string; recipientCount: number }[]>(() => {
    const saved = localStorage.getItem('m_lash_emailLogs');
    return saved ? JSON.parse(saved) : [];
  });

  // Google User authenticated parameters - default to null (logged out) on launch
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    const saved = localStorage.getItem('m_lash_userEmail');
    return saved || null;
  });

  const [userName, setUserName] = useState<string | null>(() => {
    const saved = localStorage.getItem('m_lash_userName');
    return saved || null;
  });

  // Current Auth Roles
  const [currentRole, setCurrentRole] = useState<'public' | 'admin' | 'lashista'>(() => {
    const savedRole = localStorage.getItem('m_lash_role');
    if (savedRole) return savedRole as any;
    
    // Default based on active user log
    const email = localStorage.getItem('m_lash_userEmail');
    if (email === 'giovannamcortes@gmail.com') {
      return 'admin';
    }
    return 'public';
  });

  const [currentLashista, setCurrentLashistaState] = useState<Lashista | null>(() => {
    const saved = localStorage.getItem('m_lash_currentLashista');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeMainView, setActiveMainView] = useState<string>('inicio');

  // Handle active user updates sync
  const setCurrentLashista = (lash: Lashista | null) => {
    setCurrentLashistaState(lash);
    if (lash) {
      localStorage.setItem('m_lash_currentLashista', JSON.stringify(lash));
    } else {
      localStorage.removeItem('m_lash_currentLashista');
    }
  };

  const loginWithGoogle = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    localStorage.setItem('m_lash_userEmail', email);
    localStorage.setItem('m_lash_userName', name);

    if (email.toLowerCase() === 'giovannamcortes@gmail.com') {
      setCurrentRole('admin');
      setCurrentLashista(null);
    } else {
      // Find matching lashista by email
      const match = lashistas.find(l => l.email.toLowerCase() === email.toLowerCase());
      if (match) {
        setCurrentLashista(match);
        setCurrentRole('lashista');
      } else {
        // Create new lashista on the fly via Google Registration
        const newLash = addLashista({
          name: name,
          email: email,
          phone: '+56 9 9999 9999',
          plan: 'Pro',
          activeModules: { agendaPro: true, retencion: true, viral: true },
          remainingDays: 30
        });
        setCurrentLashista(newLash);
        setCurrentRole('lashista');
      }
    }
    setActiveMainView('inicio');
  };

  const logout = () => {
    setUserEmail(null);
    setUserName(null);
    setCurrentRole('public');
    setCurrentLashista(null);
    localStorage.removeItem('m_lash_userEmail');
    localStorage.removeItem('m_lash_userName');
    localStorage.removeItem('m_lash_role');
    localStorage.removeItem('m_lash_currentLashista');
    setActiveMainView('inicio');
  };

  // 1. Initial load from backend database
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const response = await fetch("/api/load-data");
        if (response.ok) {
          const data = await response.json();
          
          // If we got valid database collections back, populate them
          if (data && (data.lashistas || data.clientas || data.appointments)) {
            if (data.lashistas && Array.isArray(data.lashistas)) {
              setLashistas(data.lashistas);
              localStorage.setItem('m_lash_lashistas', JSON.stringify(data.lashistas));
            }
            if (data.clientas && Array.isArray(data.clientas)) {
              setClientas(data.clientas);
              localStorage.setItem('m_lash_clientas', JSON.stringify(data.clientas));
            }
            if (data.appointments && Array.isArray(data.appointments)) {
              setAppointments(data.appointments);
              localStorage.setItem('m_lash_appointments', JSON.stringify(data.appointments));
            }
            if (data.campaigns && Array.isArray(data.campaigns)) {
              setCampaigns(data.campaigns);
              localStorage.setItem('m_lash_campaigns', JSON.stringify(data.campaigns));
            }
            if (data.workHours && Array.isArray(data.workHours)) {
              setWorkHours(data.workHours);
              localStorage.setItem('m_lash_workHours', JSON.stringify(data.workHours));
            }
            if (data.emailLogs && Array.isArray(data.emailLogs)) {
              setEmailLogs(data.emailLogs);
              localStorage.setItem('m_lash_emailLogs', JSON.stringify(data.emailLogs));
            }
            
            // Re-hydrate session settings for logged in lashista if we have one
            const savedUser = localStorage.getItem('m_lash_userEmail');
            if (savedUser) {
              const match = data.lashistas?.find((l: any) => l.email.toLowerCase() === savedUser.toLowerCase());
              if (match) {
                setCurrentLashistaState(match);
                localStorage.setItem('m_lash_currentLashista', JSON.stringify(match));
              }
            }
            console.log("Loaded system state automatically from server-side db.json!");
          }
        }
      } catch (err) {
        console.warn("Could not load database from backend server, falling back to local simulation:", err);
      } finally {
        setHasLoadedServer(true);
      }
    };

    loadBackendData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('m_lash_lashistas', JSON.stringify(lashistas));
  }, [lashistas]);

  useEffect(() => {
    localStorage.setItem('m_lash_clientas', JSON.stringify(clientas));
  }, [clientas]);

  useEffect(() => {
    localStorage.setItem('m_lash_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('m_lash_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('m_lash_workHours', JSON.stringify(workHours));
  }, [workHours]);

  useEffect(() => {
    localStorage.setItem('m_lash_emailLogs', JSON.stringify(emailLogs));
  }, [emailLogs]);

  useEffect(() => {
    localStorage.setItem('m_lash_role', currentRole);
  }, [currentRole]);

  // 2. Auto-save changes to Node.js backend whenever they update, after initial load is completed
  useEffect(() => {
    if (!hasLoadedServer) return;

    const payload = {
      lashistas,
      clientas,
      appointments,
      campaigns,
      workHours,
      emailLogs,
      version: "1.0",
      timestamp: new Date().toISOString()
    };

    // Debounce of 1.5 seconds to prevent hammering the server during rapid typing or clicks
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch("/api/save-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          console.warn("Auto-save feedback warning: Server returned non-ok response");
        } else {
          console.log("Changes auto-saved successfully to Node.js backend file!");
        }
      } catch (err) {
        console.warn("Auto-save failed to reach Node.js server:", err);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [lashistas, clientas, appointments, campaigns, workHours, emailLogs, hasLoadedServer]);


  // Sync currentLashista settings if lashistas array updates!
  useEffect(() => {
    if (currentLashista) {
      const match = lashistas.find(l => l.id === currentLashista.id);
      if (match) {
        // deep equal update
        if (JSON.stringify(match) !== JSON.stringify(currentLashista)) {
          setCurrentLashistaState(match);
          localStorage.setItem('m_lash_currentLashista', JSON.stringify(match));
        }
      }
    }
  }, [lashistas, currentLashista]);

  // Admin Module Access control
  const toggleModuleAccess = (lashistaId: string, module: 'agendaPro' | 'retencion' | 'viral') => {
    setLashistas(prev => prev.map(lash => {
      if (lash.id === lashistaId) {
        return {
          ...lash,
          activeModules: {
            ...lash.activeModules,
            [module]: !lash.activeModules[module]
          }
        };
      }
      return lash;
    }));
  };

  const updateLashistaPlan = (lashistaId: string, plan: 'Básico' | 'Pro' | 'Trial') => {
    setLashistas(prev => prev.map(lash => {
      if (lash.id === lashistaId) {
        return {
          ...lash,
          plan,
          // Sync defaults depending on plan
          activeModules: plan === 'Básico' 
            ? { agendaPro: true, retencion: false, viral: false }
            : plan === 'Pro' 
              ? { agendaPro: true, retencion: true, viral: true }
              : { agendaPro: true, retencion: false, viral: false }
        };
      }
      return lash;
    }));
  };

  const deleteLashista = (lashistaId: string) => {
    setLashistas(prev => prev.filter(lash => lash.id !== lashistaId));
  };

  const updateLashista = (lashistaId: string, updatedFields: Partial<Lashista>) => {
    setLashistas(prev => prev.map(lash => {
      if (lash.id === lashistaId) {
        return {
          ...lash,
          ...updatedFields
        };
      }
      return lash;
    }));
  };

  const addLashista = (newInfo: Omit<Lashista, 'id' | 'registeredDate'>) => {
    const today = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;
    const newLashista: Lashista = {
      ...newInfo,
      id: `lash-${Date.now()}`,
      registeredDate: dateStr,
      remainingDays: newInfo.plan === 'Trial' ? 30 : 30
    };
    setLashistas(prev => [newLashista, ...prev]);
    return newLashista;
  };

  // Clientas CRM Access
  const addClienta = (newCli: Omit<Clienta, 'id'>) => {
    const cli: Clienta = {
      ...newCli,
      id: `cli-${Date.now()}`,
      registrationDate: newCli.registrationDate || '2026-05-24'
    };
    setClientas(prev => [cli, ...prev]);
  };

  const updateClienta = (id: string, updatedFields: Partial<Clienta>) => {
    setClientas(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteClienta = (id: string) => {
    setClientas(prev => prev.filter(c => c.id !== id));
  };

  // Appointments / Agenda Actions
  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const app: Appointment = {
      ...newApp,
      id: `app-${Date.now()}`
    };
    setAppointments(prev => [app, ...prev]);
  };

  const toggleAppointmentStatus = (id: string) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: app.status === 'Confirmado' ? 'Pendiente' : 'Confirmado'
        };
      }
      return app;
    }));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  // Campaigns
  const addCampaign = (newCamp: Omit<Campaign, 'id'>) => {
    const camp: Campaign = {
      ...newCamp,
      id: `camp-${Date.now()}`
    };
    setCampaigns(prev => [camp, ...prev]);
  };

  const toggleCampaignActive = (id: string) => {
    setCampaigns(prev => prev.map(camp => {
      if (camp.id === id) {
        return {
          ...camp,
          active: !camp.active
        };
      }
      return camp;
    }));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(camp => camp.id !== id));
  };

  // Work Hours
  const updateWorkHours = (day: string, hours: string, closed: boolean) => {
    setWorkHours(prev => prev.map(wh => {
      if (wh.day === day) {
        return { ...wh, hours, closed };
      }
      return wh;
    }));
  };

  // Mailer
  const sendMassEmail = (targetGroup: string, subject: string, body: string) => {
    let count = lashistas.length;
    if (targetGroup === 'agendaPro') {
      count = lashistas.filter(l => l.activeModules.agendaPro).length;
    } else if (targetGroup === 'retencion') {
      count = lashistas.filter(l => l.activeModules.retencion).length;
    } else if (targetGroup === 'viral') {
      count = lashistas.filter(l => l.activeModules.viral).length;
    }

    const today = new Date();
    const dateStr = `${today.toLocaleDateString()} ${today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    
    const newLog = {
      id: `mail-${Date.now()}`,
      date: dateStr,
      subject,
      targetGroup: targetGroup === 'all' ? 'Todas las Lashistas' : targetGroup,
      recipientCount: count
    };

    setEmailLogs(prev => [newLog, ...prev]);
    return `¡Éxito! Tu correo fue enrutado y enviado a ${count} lashistas de forma segmentada.`;
  };

  // Live dynamic analytics states calculated on the active count
  const [stats, setStats] = useState<SystemStats>({
    totalLashistas: lashistas.length,
    revenueMRR: 8420,
    totalAppointments: 1842,
    totalWhatsAppMessages: 9317
  });

  const triggerStatsRefresh = () => {
    // recalculate MRR based on plans
    // Pro plan: $49/mo, Básico Plan: $29/mo, Trial: 0
    let mrr = lashistas.reduce((acc, current) => {
      if (current.plan === 'Pro') return acc + 49;
      if (current.plan === 'Básico') return acc + 29;
      return acc;
    }, 0);

    // If mrr calculation yields zero (e.g., empty lashistas array), default to base mockup amount plus dynamic increments
    if (mrr === 0) mrr = 8420;
    else {
      mrr = 3500 + mrr * 2.5; // Scale mockup factor slightly to fit screenshot visuals perfectly
    }
    
    setStats({
      totalLashistas: lashistas.length,
      revenueMRR: Math.round(mrr),
      totalAppointments: 1800 + appointments.length,
      totalWhatsAppMessages: 9200 + (appointments.length * 4) + (campaigns.length * 20)
    });
  };

  useEffect(() => {
    triggerStatsRefresh();
  }, [lashistas, appointments, campaigns]);

  // Download all lashistas, clientas, agendas as a JSON file backup
  const exportBackup = () => {
    try {
      const backupData = {
        lashistas,
        clientas,
        appointments,
        campaigns,
        workHours,
        emailLogs,
        version: "1.0",
        timestamp: new Date().toISOString()
      };
      
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `respaldo_mundo_lashista_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export backup failed:", err);
      alert("No se pudo exportar el archivo de respaldo.");
    }
  };

  // Upload/import JSON backup and hydrate state & localStorage
  const importBackup = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.lashistas && Array.isArray(data.lashistas)) {
        setLashistas(data.lashistas);
        localStorage.setItem('m_lash_lashistas', JSON.stringify(data.lashistas));
      }
      if (data.clientas && Array.isArray(data.clientas)) {
        setClientas(data.clientas);
        localStorage.setItem('m_lash_clientas', JSON.stringify(data.clientas));
      }
      if (data.appointments && Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
        localStorage.setItem('m_lash_appointments', JSON.stringify(data.appointments));
      }
      if (data.campaigns && Array.isArray(data.campaigns)) {
        setCampaigns(data.campaigns);
        localStorage.setItem('m_lash_campaigns', JSON.stringify(data.campaigns));
      }
      if (data.workHours && Array.isArray(data.workHours)) {
        setWorkHours(data.workHours);
        localStorage.setItem('m_lash_workHours', JSON.stringify(data.workHours));
      }
      if (data.emailLogs && Array.isArray(data.emailLogs)) {
        setEmailLogs(data.emailLogs);
        localStorage.setItem('m_lash_emailLogs', JSON.stringify(data.emailLogs));
      }
      
      // Hydrate specific active user session if exists
      const savedUser = localStorage.getItem('m_lash_userEmail');
      if (savedUser) {
        const match = data.lashistas?.find((l: any) => l.email.toLowerCase() === savedUser.toLowerCase());
        if (match) {
          setCurrentLashistaState(match);
          localStorage.setItem('m_lash_currentLashista', JSON.stringify(match));
        }
      }
      
      setTimeout(() => {
        triggerStatsRefresh();
      }, 100);
      
      return true;
    } catch (err) {
      console.error("Import backup failed:", err);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      currentLashista,
      setCurrentRole,
      setCurrentLashista,
      userEmail,
      userName,
      loginWithGoogle,
      logout,
      activeMainView,
      setActiveMainView,
      
      lashistas,
      addLashista,
      toggleModuleAccess,
      updateLashistaPlan,
      deleteLashista,
      updateLashista,

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

      emailLogs,
      sendMassEmail,

      stats,
      triggerStatsRefresh,
      exportBackup,
      importBackup
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
