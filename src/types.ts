/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SubscriptionPlan = 'Básico' | 'Pro' | 'Trial';

export interface ActiveModules {
  agendaPro: boolean;
  retencion: boolean;
  viral: boolean;
}

export interface Lashista {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: SubscriptionPlan;
  registeredDate: string;
  activeModules: ActiveModules;
  remainingDays: number; // For Trial indicator or membership display
  documents?: ClientFileResource[];
  notificationSenderEmail?: string;
  whatsappBotNumber?: string;
}

export interface LashMapping {
  style: string;      // E.g., "Efecto Ojo de Gato", "Efecto Rímel", "Efecto Muñeca"
  curvature: string;  // E.g., "C", "D", "CC", "L"
  thickness: string;  // E.g., "0.07 mm", "0.15 mm", "0.20 mm"
  lengths: string;    // E.g., "9-10-11-12-11 mm"
}

export interface ClientFileResource {
  id: string;
  type: 'image' | 'document' | 'consent';
  name: string;
  url: string;        // Base64 or placeholder URLs
  date: string;       // YYYY-MM-DD
  notes?: string;
}

export interface Clienta {
  id: string;
  name: string;
  phone: string;
  birthday: string; // e.g., "15 Mar"
  type: 'VIP' | 'Frecuente' | 'Nueva';
  lastService: string;
  whatsAppStatus: 'Activo' | 'Pendiente';
  email?: string; // Optional email for receipts and coupons
  registrationDate?: string; // e.g. "YYYY-MM-DD" for anniversary calculations
  // Clinical records & Consent fields
  allergies?: string;
  medicalConditions?: string;
  clinicalNotes?: string;
  mapping?: LashMapping;
  hasConsentSigned?: boolean;
  consentSignedDate?: string;
  consentSignature?: string; // Base64 signature
  resources?: ClientFileResource[];
}

export interface Appointment {
  id: string;
  clientaName: string;
  time: string;
  duration: number; // e.g. 60 or 120
  service: string;
  date: string; // "YYYY-MM-DD" e.g. "2026-05-24"
  status: 'Confirmado' | 'Pendiente';
}

export interface Campaign {
  id: string;
  name: string;
  service: string;
  dateRange: string; // e.g., "01/03 → 31/03"
  discount: string; // e.g., "-20%"
  active: boolean;
}

export interface WorkHour {
  day: string; // e.g. "Lun"
  hours: string; // e.g. "09:00-19:00"
  closed: boolean;
}

export interface SystemStats {
  totalLashistas: number;
  revenueMRR: number;
  totalAppointments: number;
  totalWhatsAppMessages: number;
}
