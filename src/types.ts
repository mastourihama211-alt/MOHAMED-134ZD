/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SavingsEntry {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO format (YYYY-MM-DD)
  createdAt: number; // Timestamp
  ticketPhoto?: string; // Base64 image data string
  merchantName?: 'Aziz' | 'MG' | 'Mamix Chokri' | 'Other' | string;
  productName?: string;
  productPrice?: number;
  productPhoto?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  deadline: string; // YYYY-MM-DD
  isActive: boolean;
}

export interface SavingsReminder {
  id: string;
  label: string;
  frequency: 'daily' | 'weekly';
  time: string; // "HH:MM" 24 hour format
  dayOfWeek?: number; // 0 (Sunday) to 6 (Saturday), only for weekly
  isEnabled: boolean;
  createdAt: number;
}

export type CategoryKey = 'coffee' | 'meal' | 'transport' | 'shopping' | 'leisure' | 'utility' | 'other';

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  emoji: string;
  color: string; // Tailwind class background
  textColor: string; // Tailwind class text
  borderColor: string; // Tailwind class border
  suggestedAction: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryDef> = {
  coffee: {
    key: 'coffee',
    label: 'Café & Boissons',
    emoji: '☕',
    color: 'bg-amber-100',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    suggestedAction: 'Café fait maison'
  },
  meal: {
    key: 'meal',
    label: 'Repas & Snacking',
    emoji: '🍱',
    color: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    suggestedAction: 'Repas préparé à la maison'
  },
  transport: {
    key: 'transport',
    label: 'Transport & Vélo',
    emoji: '🚴',
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    suggestedAction: 'Marche ou vélo au lieu du taxi/voiture'
  },
  shopping: {
    key: 'shopping',
    label: 'Achat Évité',
    emoji: '🛒',
    color: 'bg-rose-100',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-200',
    suggestedAction: 'Achat impulsif résisté'
  },
  leisure: {
    key: 'leisure',
    label: 'Loisirs & Sorties',
    emoji: '🎬',
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    suggestedAction: 'Alternative gratuite ou réduction'
  },
  utility: {
    key: 'utility',
    label: 'Factures / Abonnements',
    emoji: '💡',
    color: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    borderColor: 'border-cyan-200',
    suggestedAction: 'Abonnement inutile résilié'
  },
  other: {
    key: 'other',
    label: 'Autre Économie',
    emoji: '💰',
    color: 'bg-slate-100',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-200',
    suggestedAction: 'Autre moyen créatif'
  }
};

export interface SavingBadge {
  id: string;
  title: string;
  description: string;
  requirementType: 'total' | 'entriesCount' | 'dailyStreak';
  requirementValue: number;
  emoji: string;
  badgeColor: string;
}

export const SAVINGS_BADGES: SavingBadge[] = [
  {
    id: 'first_saving',
    title: 'Premier Écureuil',
    description: 'Enregistrer votre première économie quotidienne',
    requirementType: 'entriesCount',
    requirementValue: 1,
    emoji: '🌱',
    badgeColor: 'border-emerald-200 bg-emerald-50 text-emerald-800'
  },
  {
    id: 'bronze_saving',
    title: 'Épargnant Bronze',
    description: 'Atteindre un total de 20 DT d\'économie',
    requirementType: 'total',
    requirementValue: 20,
    emoji: '🥉',
    badgeColor: 'border-amber-600/30 bg-amber-50 text-amber-900'
  },
  {
    id: 'silver_saving',
    title: 'Épargnant Argent',
    description: 'Atteindre un total de 100 DT d\'économie',
    requirementType: 'total',
    requirementValue: 100,
    emoji: '🥈',
    badgeColor: 'border-slate-300 bg-slate-50 text-slate-800'
  },
  {
    id: 'gold_saving',
    title: 'Maitre Écureuil (Or)',
    description: 'Atteindre un total de 500 DT d\'économie',
    requirementType: 'total',
    requirementValue: 500,
    emoji: '👑',
    badgeColor: 'border-yellow-400 bg-yellow-50 text-yellow-800 font-extrabold'
  },
  {
    id: 'streak_3',
    title: 'Habitude Naissante',
    description: 'Avoir un historique d\'au moins 3 économies enregistrées',
    requirementType: 'entriesCount',
    requirementValue: 3,
    emoji: '🔥',
    badgeColor: 'border-orange-200 bg-orange-50 text-orange-800'
  }
];
