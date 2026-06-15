/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavingsEntry, SavingsGoal } from './types';

// Helper to get formatted ISO date string relative to today
const getRelativeDateStr = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const getInitialSavingsEntries = (): SavingsEntry[] => {
  return [
    {
      id: 'init-1',
      amount: 4.50,
      category: 'coffee',
      note: 'Café thermos au lieu de Starbuck',
      date: getRelativeDateStr(0), // Today
      createdAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    },
    {
      id: 'init-2',
      amount: 12.00,
      category: 'meal',
      note: 'Repas maison / Lunchbox au travail',
      date: getRelativeDateStr(0), // Today
      createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    },
    {
      id: 'init-3',
      amount: 5.50,
      category: 'transport',
      note: 'Vélib / Vélo au lieu d\'un Uber',
      date: getRelativeDateStr(1), // Yesterday
      createdAt: Date.now() - 1000 * 60 * 60 * 28,
    },
    {
      id: 'init-4',
      amount: 35.00,
      category: 'shopping',
      note: 'Chaussures soldées inutiles évitées !',
      date: getRelativeDateStr(2), // 2 days ago
      createdAt: Date.now() - 1000 * 60 * 60 * 53,
    },
    {
      id: 'init-5',
      amount: 8.99,
      category: 'utility',
      note: 'Résilier abonnement streaming inactif',
      date: getRelativeDateStr(3), // 3 days ago
      createdAt: Date.now() - 1000 * 60 * 60 * 78,
    },
    {
      id: 'init-6',
      amount: 15.00,
      category: 'leisure',
      note: 'Soirée ciné avec pass réduction',
      date: getRelativeDateStr(4), // 4 days ago
      createdAt: Date.now() - 1000 * 60 * 60 * 99,
    },
    {
      id: 'init-7',
      amount: 6.50,
      category: 'meal',
      note: 'Snack fait maison à la place du distributeur',
      date: getRelativeDateStr(5), // 5 days ago
      createdAt: Date.now() - 1000 * 60 * 60 * 125,
    },
    {
      id: 'init-8',
      amount: 4.50,
      category: 'coffee',
      note: 'Thé préparé chez soi',
      date: getRelativeDateStr(6), // 6 days ago
      createdAt: Date.now() - 1000 * 60 * 60 * 148,
    }
  ];
};

export const getInitialGoal = (): SavingsGoal => {
  const d = new Date();
  // set deadline to end of current month
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const deadlineStr = lastDay.toISOString().split('T')[0];

  return {
    id: 'default-goal',
    title: 'Mes économies du mois 🎯',
    targetAmount: 150.00,
    deadline: deadlineStr,
    isActive: true,
  };
};
