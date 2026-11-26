import React, { useState, useEffect, useMemo } from 'react'
import {
  LayoutDashboard,
  Users,
  Wallet,
  FolderKanban,
  Briefcase,
  FileText,
  Plus,
  Trash2,
  RotateCcw,
  Printer,
  Upload,
  CheckCircle2,
  Circle,
  Globe,
  Database
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from './supabaseClient'

const CURRENCIES = {
  FCFA: { symbol: 'FCFA', rateFromFcfa: 1 },
  EUR: { symbol: '€', rateFromFcfa: 1 / 655.957 },
  USD: { symbol: '$', rateFromFcfa: 1 / 600 },
}

const FIXED_FEES = [
  { id: 'fee-10k', label: 'Frais fixe logistique / déplacement léger', amountFcfa: 10000 },
  { id: 'fee-50k', label: 'Frais fixe coordination / installation lourde', amountFcfa: 50000 },
]

const INITIAL_CLIENTS = [
  { id: 'c-1', name: 'Chambre de Commerce Pointe-Noire', contact: 'Direction Générale', phone: '+242 06 000 00 00', city: 'Pointe-Noire', status: 'Client actif' },
  { id: 'c-2', name: 'Atelier Événementiel Brazza', contact: 'Service Achats', phone: '+242 05 000 00 00', city: 'Brazzaville', status: 'Prospect' },
]

const INITIAL_TRANSACTIONS = [
  { id: 't-1', date: '2026-11-15', label: 'Acompte séminaire Pointe-Noire', type: 'Entrée', amountFcfa: 250000 },
  { id: 't-2', date: '2026-11-18', label: 'Achat consommables & logistique', type: 'Sortie', amountFcfa: 50000 },
]

const INITIAL_PROJECTS = [
  {
    id: 'p-1',
    title: 'Conférence & Networking Pointe-Noire',
    client: 'Chambre de Commerce Pointe-Noire',
    date: '2026-12-10',
    budgetFcfa: 850000,
    tasks: [
      { id: 'tk-1', text: 'Valider salle et sonorisation', done: true },
      { id: 'tk-2', text: 'Confirmer prestataires traiteur & accueil', done: false },
      { id: 'tk-3', text: 'Imprimer badges et supports', done: false },
    ],
  },
]

const INITIAL_PROVIDERS = [
  { id: 'pr-1', name: 'Sono & Lumière Côte Sauvage', category: 'Technique / Son', phone: '+242 06 111 22 33', city: 'Pointe-Noire', fileName: 'fiche-tarifaire-sono.pdf', fileData: '' },
  { id: 'pr-2', name: 'Délices de l’Océan Traiteur', category: 'Restauration', phone: '+242 06 444 55 66', city: 'Pointe-Noire', fileName: 'menu-evenementiel.pdf', fileData: '' },
]

const INITIAL_INVOICE = {
  docType: 'DEVIS',
  docNumber: 'DEV-2026-001',
  issuerName: 'AXELOG Consulting Event’s',
  issuerSub: 'Pointe-Noire • Brazzaville — Événementiel, Logistique & Coordination',
  clientName: 'Chambre de Commerce Pointe-Noire',
  clientInfo: 'Pointe-Noire, République du Congo',
  logoUrl: '',
  signatureUrl: '',
  items: [
    { id: 'i-1', description: 'Organisation et coordination événementielle', qty: 1, unitPriceFcfa: 350000 },
    { id: 'i-2', description: 'Frais fixe coordination / installation lourde', qty: 1, unitPriceFcfa: 50000 },
  ],
  notes: 'Devis exprimé en FCFA avec conversion indicative en € et $. Acompte de 50% à la validation.',
}

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App()
