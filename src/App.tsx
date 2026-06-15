/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  PiggyBank, 
  Plus, 
  Trash2, 
  Award, 
  History, 
  Target, 
  X, 
  TrendingUp, 
  Coins, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  Check, 
  Wallet,
  ArrowRight,
  Info,
  ChevronDown,
  RotateCcw,
  Smile,
  BadgeAlert,
  Flame,
  Utensils,
  Coffee,
  Car,
  Bell,
  BellOff,
  Clock,
  Volume2,
  Camera,
  Package
} from 'lucide-react';
import { SavingsEntry, SavingsGoal, CategoryKey, CATEGORIES, SAVINGS_BADGES, SavingsReminder } from './types';
import { getInitialSavingsEntries, getInitialGoal } from './initialData';

// Format utility helper for Tunisian Dinars with 3 decimal spaces (Millimes)
export const formatTND = (amount: number): string => {
  return amount.toFixed(3).replace('.', ',') + ' DT';
};

// Bilingual inspirational quotes of the day
const TUNISIAN_PROVERBS = [
  {
    ar: "دِينَار عَلَى دِينَار يْنَحِّي الغَصْرَة 🪙",
    fr: "Dinar après dinar, l'épargne éloigne le besoin.",
    hint: "Chaque millime économisé aujourd'hui construit votre confort de demain."
  },
  {
    ar: "إكْبِشْ فِي الفِرْنِكْ يَكْبِشْ فِيكْ 🔐",
    fr: "Prenez soin du millime, le dinar veillera sur vous.",
    hint: "Résister à un achat inutile de 2 DT est une grande victoire."
  },
  {
    ar: "الحَرْكَة فِيهَا بَرَكَة وَالقِلَّة تْجِيبْ العِلَّة 🌿",
    fr: "Chaque petit geste d'économie apporte sa bénédiction.",
    hint: "La lunchbox de midi est saine pour votre corps et votre portefeuille."
  },
  {
    ar: "تَفْتُوفَة عَلَى تَفْتُوفَة تَعْمِلْ مَكْتُوبْ دَافِي 🔥",
    fr: "Petit à petit, la tirelire grandit et rassure son maître.",
    hint: "Les petits ruisseaux font les grandes rivières d'épargne."
  }
];

export default function App() {
  // --- STATE ---
  const [entries, setEntries] = useState<SavingsEntry[]>([]);
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'history' | 'goals' | 'badges'>('dashboard');
  
  // Quick Filters for history
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Form Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [entryAmount, setEntryAmount] = useState<string>('');
  const [entryCategory, setEntryCategory] = useState<CategoryKey>('coffee');
  const [entryNote, setEntryNote] = useState<string>('');
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Goal Form States
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Proverb Index Rotator
  const [proverbIndex, setProverbIndex] = useState(0);

  // --- USER PROFILE & ONBOARDING STATE ---
  const [userProfile, setUserProfile] = useState<{ firstName: string; lastName: string } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingFirstName, setOnboardingFirstName] = useState('');
  const [onboardingLastName, setOnboardingLastName] = useState('');

  // --- TICKET COMPILATION & SCANNING STATES (Aziz & MG) ---
  const ticketFileInputRef = useRef<HTMLInputElement>(null);
  const modalTicketFileInputRef = useRef<HTMLInputElement>(null);
  const [ticketImage, setTicketImage] = useState<string | null>(null);
  const [modalTicketImage, setModalTicketImage] = useState<string | null>(null);
  const [isScanningTicket, setIsScanningTicket] = useState(false);
  const [ticketMerchant, setTicketMerchant] = useState<'Aziz' | 'MG' | 'Other'>('Aziz');
  const [modalTicketMerchant, setModalTicketMerchant] = useState<'Aziz' | 'MG' | 'Mamix Chokri' | 'Other'>('Other');
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [ticketNote, setTicketNote] = useState<string>('');
  const [zoomedTicketImage, setZoomedTicketImage] = useState<string | null>(null);

  // Individual Product tracking fields requested by the user
  const [entryProductName, setEntryProductName] = useState<string>('');
  const [entryProductPrice, setEntryProductPrice] = useState<string>('');
  const [entryProductPhoto, setEntryProductPhoto] = useState<string | null>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  // Dedicated Quick Product state for dashboard quick logger
  const [showQuickProdForm, setShowQuickProdForm] = useState(false);
  const [quickProdName, setQuickProdName] = useState('');
  const [quickProdPrice, setQuickProdPrice] = useState('');
  const [quickProdPhoto, setQuickProdPhoto] = useState<string | null>(null);
  const [quickProdMerchant, setQuickProdMerchant] = useState<'Aziz' | 'MG' | 'Mamix Chokri' | 'Other'>('Other');
  const [quickProdSaving, setQuickProdSaving] = useState('');
  const quickProdFileInputRef = useRef<HTMLInputElement>(null);

  // States for the new dedicated Products tab search/filter
  const [prodSearchQuery, setProdSearchQuery] = useState('');
  const [prodMerchantFilter, setProdMerchantFilter] = useState<'All' | 'Aziz' | 'MG' | 'Mamix Chokri' | 'Other'>('All');

  // Reminders States
  const [reminders, setReminders] = useState<SavingsReminder[]>([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showTriggeredPrompt, setShowTriggeredPrompt] = useState(false);
  const [triggeredReminder, setTriggeredReminder] = useState<SavingsReminder | null>(null);
  const [lastTriggeredKey, setLastTriggeredKey] = useState<string>('');

  // Form states for creating reminders
  const [reminderLabel, setReminderLabel] = useState('');
  const [reminderFrequency, setReminderFrequency] = useState<'daily' | 'weekly'>('daily');
  const [reminderTime, setReminderTime] = useState('20:00');
  const [reminderDayOfWeek, setReminderDayOfWeek] = useState<number>(0);
  const [userNotificationPermission, setUserNotificationPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Interactive inputs specifically for Trigger Modals
  const [triggeredAmount, setTriggeredAmount] = useState<string>('');
  const [triggeredCategory, setTriggeredCategory] = useState<CategoryKey>('coffee');
  const [triggeredNote, setTriggeredNote] = useState<string>('');

  const getInitialReminders = (): SavingsReminder[] => [
    {
      id: 'rem-1',
      label: 'Café & Thé du Matin ☕',
      frequency: 'daily',
      time: '09:00',
      isEnabled: true,
      createdAt: Date.now()
    },
    {
      id: 'rem-2',
      label: 'Bilan de l\'Épargne du Soir 🌙',
      frequency: 'daily',
      time: '20:30',
      isEnabled: true,
      createdAt: Date.now()
    },
    {
      id: 'rem-3',
      label: 'Épargne fin de semaine 📈',
      frequency: 'weekly',
      time: '18:00',
      dayOfWeek: 0, // Sunday
      isEnabled: true,
      createdAt: Date.now()
    }
  ];

  useEffect(() => {
    // Rotate proverb randomly on load
    setProverbIndex(Math.floor(Math.random() * TUNISIAN_PROVERBS.length));
  }, []);

  // Simulator/Quick Add Presets in Tunisian Dinar (TND)
  const quickPresets = [
    { label: 'Café Direct évité ☕', arLabel: 'قهوة الشارع', amount: 1.550, category: 'coffee' as CategoryKey, note: 'Café thermos maison' },
    { label: 'Sandwich / Krout évité 🍱', arLabel: 'كروت الشارع', amount: 4.500, category: 'meal' as CategoryKey, note: 'Repas sain à la maison' },
    { label: 'Taxi individuel évité 🚴', arLabel: 'تاكسي فردي', amount: 6.000, category: 'transport' as CategoryKey, note: 'Marche active ou transport collectif' },
    { label: 'Achat compulsif évité 🛒', arLabel: 'قضية زايدة', amount: 15.000, category: 'shopping' as CategoryKey, note: 'Résistance achat impulsif' },
    { label: 'Sortie modérée 🎬', arLabel: 'سهرية خفيفة', amount: 10.000, category: 'leisure' as CategoryKey, note: 'Alternative gratuite trouvée' },
    { label: 'Abonnement inutile résilié 💡', arLabel: 'اشتراك غير مستغل', amount: 12.000, category: 'utility' as CategoryKey, note: 'Annulation service inactif' },
  ];

  // Load from LocalStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('savings_entries');
    const savedGoal = localStorage.getItem('savings_goal');
    const savedReminders = localStorage.getItem('savings_reminders');

    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        setEntries(getInitialSavingsEntries());
      }
    } else {
      const init = getInitialSavingsEntries();
      setEntries(init);
      localStorage.setItem('savings_entries', JSON.stringify(init));
    }

    if (savedGoal) {
      try {
        setGoal(JSON.parse(savedGoal));
      } catch (e) {
        setGoal(getInitialGoal());
      }
    } else {
      const initGoal = getInitialGoal();
      setGoal(initGoal);
      localStorage.setItem('savings_goal', JSON.stringify(initGoal));
    }

    if (savedReminders) {
      try {
        setReminders(JSON.parse(savedReminders));
      } catch (e) {
        setReminders(getInitialReminders());
      }
    } else {
      const initRem = getInitialReminders();
      setReminders(initRem);
      localStorage.setItem('savings_reminders', JSON.stringify(initRem));
    }

    const savedProfile = localStorage.getItem('savings_user_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        setShowOnboarding(true);
      }
    } else {
      setShowOnboarding(true);
    }
  }, []);

  // Save changes helper
  const saveEntries = (newEntries: SavingsEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('savings_entries', JSON.stringify(newEntries));
  };

  const saveGoal = (newGoal: SavingsGoal | null) => {
    setGoal(newGoal);
    if (newGoal) {
      localStorage.setItem('savings_goal', JSON.stringify(newGoal));
    } else {
      localStorage.removeItem('savings_goal');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const first = onboardingFirstName.trim();
    const last = onboardingLastName.trim();
    if (!first || !last) {
      alert("Veuillez renseigner votre prénom et nom.");
      return;
    }

    const profile = { firstName: first, lastName: last };
    setUserProfile(profile);
    localStorage.setItem('savings_user_profile', JSON.stringify(profile));
    setShowOnboarding(false);
    playBeepNotification();
  };

  const handleResetAllData = () => {
    if (confirm("⚠️ Réinitialiser l'application d'Épargne ?\n\nAttention : Cette action va effacer définitivement tout votre historique d'épargne (0 DT), vos objectifs, et supprimer les badges d'une manière irréversible.\n\nهل أنت متأكّد من حذف جميع المدخرات والبدء من الصفر ؟")) {
      saveEntries([]);
      const defaultGoal: SavingsGoal = {
        id: 'goal-1',
        title: 'Épargne pour mon avenir 🎯',
        targetAmount: 250.000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true
      };
      saveGoal(defaultGoal);
      playBeepNotification();
      alert("✅ Réinitialisation réussie ! Vous repartez de 0 DT.\nتم مسح كل البيانات والبدء من الصفر بنجاح.");
    }
  };

  const handleTicketImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setTicketImage(reader.result as string);
      
      // Auto prefilled notes based on selected merchant
      if (ticketMerchant === 'Aziz') {
        setTicketNote('Achat malin Magasin Aziz 🛒');
      } else if (ticketMerchant === 'MG') {
        setTicketNote('Économie Magasin Général MG 🛒');
      } else {
        setTicketNote('Ticket de caisse enregistré 🧾');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSavingsFromTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(ticketAmount.replace(',', '.'));
    if (isNaN(amt) || amt <= 0) {
      alert("Veuillez indiquer le montant de l'économie (valeur supérieure à 0 DT).");
      return;
    }

    const mName = ticketMerchant === 'Aziz' ? 'Aziz' : ticketMerchant === 'MG' ? 'MG' : 'Other';
    const finalNote = ticketNote.trim() || `Ticket ${mName}`;

    const newEntry: SavingsEntry = {
      id: 'entry-ticket-' + Date.now(),
      amount: amt,
      category: 'shopping',
      note: finalNote,
      ticketPhoto: ticketImage || undefined,
      merchantName: mName,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now()
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);
    
    // Play sound and reset form states
    playBeepNotification();
    setTicketImage(null);
    setTicketAmount('');
    setTicketNote('');
    
    alert(`🎉 Ticket ${mName} enregistré avec succès !\nÉconomie récoltée : +${formatTND(amt)}`);
  };

  // --- REMINDERS & NOTIFICATION NOTIFY LOGIC ---
  const saveReminders = (newRems: SavingsReminder[]) => {
    setReminders(newRems);
    localStorage.setItem('savings_reminders', JSON.stringify(newRems));
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => r.id === id ? { ...r, isEnabled: !r.isEnabled } : r);
    saveReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce rappel ?')) {
      const updated = reminders.filter(r => r.id !== id);
      saveReminders(updated);
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: SavingsReminder = {
      id: 'rem-' + Date.now(),
      label: reminderLabel.trim() || 'Rappel d\'Épargne ⏰',
      frequency: reminderFrequency,
      time: reminderTime,
      dayOfWeek: reminderFrequency === 'weekly' ? reminderDayOfWeek : undefined,
      isEnabled: true,
      createdAt: Date.now()
    };
    const updated = [...reminders, newReminder];
    saveReminders(updated);
    
    // Clear form inputs
    setReminderLabel('');
  };

  // Synthesizes a beautiful mechanical retro chiptune beep sound for alerts (zero external weight!)
  const playBeepNotification = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const now = ctx.currentTime;
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      // Joyous chime blip
      playNote(523.25, now, 0.1); // C5
      playNote(659.25, now + 0.08, 0.1); // E5
      playNote(783.99, now + 0.16, 0.3); // G5
    } catch (err) {
      console.log("Audio presentation deferred by client actions:", err);
    }
  };

  // Requests system OS permissions to raise Native Desktop Notifications
  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert("Les notifications système ne sont pas supportées sur ce périphérique. Un pop-up d'alerte en jeu sera utilisé !");
      return;
    }
    
    const permission = await Notification.requestPermission();
    setUserNotificationPermission(permission);
    if (permission === 'granted') {
      try {
        new Notification("Macha2Allah 🇹🇳 Tracker", {
          body: "Bénis soient vos efforts ! Les notifications système sont actives.",
        });
      } catch (err) {
        console.warn("Could not fire confirmation notice:", err);
      }
      playBeepNotification();
    }
  };

  // Fire the Reminder trigger immediately
  const triggerReminderEvent = (reminder: SavingsReminder) => {
    setTriggeredReminder(reminder);
    setTriggeredAmount('');
    setTriggeredCategory('coffee');
    setTriggeredNote(`Rappel : "${reminder.label}"`);
    setShowTriggeredPrompt(true);
    playBeepNotification();

    // Standard Desktop Notifications raise
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        const notification = new Notification(`Macha2Allah 🇹🇳 Rappel d'Épargne`, {
          body: `Prenez 3 secondes pour logguer votre épargne quotidienne : "${reminder.label}"`,
          icon: '/favicon.ico'
        });
        notification.onclick = () => {
          window.focus();
          setShowTriggeredPrompt(true);
        };
      } catch (err) {
        console.log("Local Desktop Notifications trigger skipped (iframe restriction maybe):", err);
      }
    }
  };

  // Simulation Trigger for direct prompt test (highly educational for user in AI Studio preview)
  const handleSimulateReminder = (reminder: SavingsReminder) => {
    setShowReminderModal(false); // Close settings panel
    triggerReminderEvent(reminder);
  };

  // Commit dynamic input directly inside triggered Reminder Popup Modal
  const handleAddSavingsFromTrigger = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amt = parseFloat(triggeredAmount.replace(',', '.'));
    if (isNaN(amt) || amt <= 0) {
      alert('Veuillez entrer une valeur d\'économie supérieure à 0 DT');
      return;
    }

    const newEntry: SavingsEntry = {
      id: 'entry-rem-' + Date.now(),
      amount: amt,
      category: triggeredCategory,
      note: triggeredNote.trim() || `Validé via rappel "${triggeredReminder?.label || 'Épargne'}"`,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now()
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);
    
    // Play celebratory level-up chime!
    playBeepNotification();
    
    // Reset inputs and close triggered drawer
    setTriggeredAmount('');
    setTriggeredReminder(null);
    setShowTriggeredPrompt(false);
  };

  // Helper values to append keypad inputs on Trigger modal
  const handleTriggerKeypadPress = (val: string) => {
    if (val === 'C') {
      setTriggeredAmount('');
    } else if (val === ',') {
      if (!triggeredAmount.includes('.')) {
        setTriggeredAmount(prev => prev === '' ? '0.' : prev + '.');
      }
    } else {
      const parts = triggeredAmount.split('.');
      if (parts[1] && parts[1].length >= 3) {
        return; // limit decimal to millimes
      }
      setTriggeredAmount(prev => prev + val);
    }
  };

  const appendTriggerKeypadAmount = (amountToAdd: number) => {
    const current = parseFloat(triggeredAmount) || 0;
    setTriggeredAmount((current + amountToAdd).toFixed(3));
  };

  // Auto scanning scheduler check for active alarms matching hours + minutes
  useEffect(() => {
    const sensor = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hh}:${mm}`;
      const dayIndex = now.getDay(); // 0 is Sunday, etc.
      const todayDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

      reminders.forEach(reminder => {
        if (!reminder.isEnabled) return;
        
        // Exact time equality "HH:MM"
        if (reminder.time === timeStr) {
          if (reminder.frequency === 'weekly' && reminder.dayOfWeek !== dayIndex) {
            return;
          }
          
          // Guarantee single trigger per matching window (e.g. 1 alert per minute)
          const searchKey = `${reminder.id}-${todayDateString}-${timeStr}`;
          if (lastTriggeredKey !== searchKey) {
            setLastTriggeredKey(searchKey);
            triggerReminderEvent(reminder);
          }
        }
      });
    }, 10000); // 10-second tick makes it highly accurate
    
    return () => clearInterval(sensor);
  }, [reminders, lastTriggeredKey]);

  // --- ACTIONS ---
  const handleModalTicketImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Str = reader.result as string;
      setModalTicketImage(base64Str);
      setIsScanningTicket(true);

      try {
        const response = await fetch('/api/parse-ticket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ image: base64Str })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.amount) {
            setEntryAmount(data.amount.toString());
          }
          if (data.category) {
            setEntryCategory(data.category);
          }
          if (data.note) {
            setEntryNote(data.note);
          }
          if (data.productName) {
            setEntryProductName(data.productName);
          }
          if (data.productPrice) {
            setEntryProductPrice(data.productPrice.toString());
          }
          if (data.merchant) {
            const mLower = data.merchant.toLowerCase();
            if (mLower.includes('aziz')) {
              setModalTicketMerchant('Aziz');
            } else if (mLower.includes('mg') || mLower.includes('général') || mLower.includes('general')) {
              setModalTicketMerchant('MG');
            } else if (mLower.includes('mamix') || mLower.includes('chokri')) {
              setModalTicketMerchant('Mamix Chokri');
            } else {
              setModalTicketMerchant('Other');
            }
          }
        } else {
          console.error("Failed to parse ticket via API, status:", response.status);
          setEntryCategory('shopping');
          setEntryNote('تيكيت تم تسجيله 🧾');
        }
      } catch (err) {
        console.error("Error calling parse-ticket API:", err);
        setEntryCategory('shopping');
        setEntryNote('تيكيت مغازة 🛒');
      } finally {
        setIsScanningTicket(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSavings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amt = parseFloat(entryAmount.replace(',', '.'));
    if (isNaN(amt) || amt <= 0) {
      alert('Veuillez entrer un montant valide supérieur à 0 DT');
      return;
    }

    const prodPrice = parseFloat(entryProductPrice.replace(',', '.'));

    const newEntry: SavingsEntry = {
      id: 'entry-' + Date.now(),
      amount: amt,
      category: entryCategory,
      note: entryNote.trim() || CATEGORIES[entryCategory].suggestedAction,
      date: entryDate || new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      ticketPhoto: modalTicketImage || undefined,
      merchantName: modalTicketMerchant !== 'Other' ? modalTicketMerchant : undefined,
      productName: entryProductName.trim() || undefined,
      productPrice: isNaN(prodPrice) ? undefined : prodPrice,
      productPhoto: entryProductPhoto || undefined
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);
    
    // Reset and close
    setEntryAmount('');
    setEntryCategory('coffee');
    setEntryNote('');
    setModalTicketImage(null);
    setModalTicketMerchant('Other');
    setEntryProductName('');
    setEntryProductPrice('');
    setEntryProductPhoto(null);
    setShowAddModal(false);
  };

  const handleAddQuickProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickProdName.trim()) {
      alert('الرجاء إدخال إسم المنتج على الأقل لتوثيقه!');
      return;
    }
    const priceVal = parseFloat(quickProdPrice.replace(',', '.'));
    const savingVal = parseFloat(quickProdSaving.replace(',', '.'));
    
    const finalAmount = !isNaN(savingVal) && savingVal > 0 
      ? savingVal 
      : (!isNaN(priceVal) && priceVal > 0 ? parseFloat((priceVal * 0.15).toFixed(3)) : 1.000);

    const newEntry: SavingsEntry = {
      id: 'entry-qprod-' + Date.now(),
      amount: finalAmount,
      category: 'shopping',
      note: `مشتريات ذكية: ${quickProdName.trim()} 📦`,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      merchantName: quickProdMerchant !== 'Other' ? quickProdMerchant : undefined,
      productName: quickProdName.trim(),
      productPrice: isNaN(priceVal) ? undefined : priceVal,
      productPhoto: quickProdPhoto || undefined
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);
    
    // Reset
    setQuickProdName('');
    setQuickProdPrice('');
    setQuickProdPhoto(null);
    setQuickProdMerchant('Other');
    setQuickProdSaving('');
    setShowQuickProdForm(false);
    playBeepNotification();
  };

  const handleQuickAdd = (preset: typeof quickPresets[number]) => {
    const newEntry: SavingsEntry = {
      id: 'entry-' + Date.now() + Math.random().toString(36).substr(2, 4),
      amount: preset.amount,
      category: preset.category,
      note: preset.label,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now()
    };
    const updated = [newEntry, ...entries];
    saveEntries(updated);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette économie ?')) {
      const updated = entries.filter(e => e.id !== id);
      saveEntries(updated);
    }
  };

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const tgt = parseFloat(goalTarget.replace(',', '.'));
    if (isNaN(tgt) || tgt <= 0) {
      alert('Veuillez entrer un objectif valide');
      return;
    }

    const updatedGoal: SavingsGoal = {
      id: goal?.id || 'goal-' + Date.now(),
      title: goalTitle.trim() || 'Mon projet d\'épargne',
      targetAmount: tgt,
      deadline: goalDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true
    };

    saveGoal(updatedGoal);
    setShowGoalModal(false);
  };

  const handleDeleteGoal = () => {
    if (confirm('Voulez-vous supprimer votre objectif actuel ?')) {
      saveGoal(null);
    }
  };

  // Safe keypad typing inside Modal
  const handleKeypadPress = (val: string) => {
    if (val === 'C') {
      setEntryAmount('');
    } else if (val === ',') {
      if (!entryAmount.includes('.')) {
        setEntryAmount(prev => prev === '' ? '0.' : prev + '.');
      }
    } else {
      // Tunisian Millimes are 3 digits maximum after dot
      const parts = entryAmount.split('.');
      if (parts[1] && parts[1].length >= 3) {
        return; // stop writing past Millimes precision
      }
      setEntryAmount(prev => prev + val);
    }
  };

  const appendKeypadAmount = (amountToAdd: number) => {
    const current = parseFloat(entryAmount) || 0;
    setEntryAmount((current + amountToAdd).toFixed(3));
  };

  // --- DERIVED METRICS ---
  const totalSavings = useMemo(() => {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  }, [entries]);

  const todaySavings = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return entries
      .filter(e => e.date === todayStr)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries]);

  const monthSavings = useMemo(() => {
    const currentMonthPrefix = new Date().toISOString().substring(0, 7); // "YYYY-MM"
    return entries
      .filter(e => e.date.startsWith(currentMonthPrefix))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries]);

  // TUNISIAN EQUIVALENT CONVERSIONS (FUN MATH!)
  const tunisianEquivalents = useMemo(() => {
    return {
      chapati: Math.floor(totalSavings / 4.5), // average cost 4.5 DT for a delicious chapati
      fricasse: Math.floor(totalSavings / 1.0), // delicious fricassé bun at 1.0 DT
      directCoffee: Math.floor(totalSavings / 1.5), // express coffee at 1.5 DT
      taxiRide: Math.floor(totalSavings / 6.0), // average simple taxi ride at 6.0 DT
    };
  }, [totalSavings]);

  const streakDays = useMemo(() => {
    if (entries.length === 0) return 0;
    
    const uniqueDates = Array.from(new Set<string>(entries.map(e => e.date)))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0];
    
    if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
      return 0; 
    }

    let streak = 0;
    let checkDate = new Date(uniqueDates[0]);

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentEntryDate = new Date(uniqueDates[i]);
      const diffTime = checkDate.getTime() - currentEntryDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (diffDays === 1) {
        streak++;
        checkDate = currentEntryDate;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [entries]);

  const goalProgress = useMemo(() => {
    if (!goal) return 0;
    const progressPercent = (totalSavings / goal.targetAmount) * 100;
    return Math.min(Math.round(progressPercent), 100);
  }, [goal, totalSavings]);

  // Goal dynamic advice based on performance
  const goalAdviceDetail = useMemo(() => {
    if (!goal) return null;
    const daysRemaining = Math.max(1, Math.round((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 3600 * 24)));
    const neededPerDay = Math.max(0, (goal.targetAmount - totalSavings) / daysRemaining);
    return {
      daysRemaining,
      neededPerDay: neededPerDay,
    };
  }, [goal, totalSavings]);

  const unlockedBadges = useMemo(() => {
    return SAVINGS_BADGES.filter(badge => {
      if (badge.requirementType === 'entriesCount') {
        return entries.length >= badge.requirementValue;
      }
      if (badge.requirementType === 'total') {
        return totalSavings >= badge.requirementValue;
      }
      return false;
    });
  }, [entries, totalSavings]);

  // Category statistics helper
  const categoryStats = useMemo(() => {
    const stats: Record<CategoryKey, { amount: number; percentage: number }> = {} as any;
    
    Object.keys(CATEGORIES).forEach((k) => {
      stats[k as CategoryKey] = { amount: 0, percentage: 0 };
    });

    entries.forEach(e => {
      const cat = e.category as CategoryKey;
      if (stats[cat]) {
        stats[cat].amount += e.amount;
      }
    });

    if (totalSavings > 0) {
      Object.keys(stats).forEach(k => {
        stats[k as CategoryKey].percentage = Math.round(
          (stats[k as CategoryKey].amount / totalSavings) * 100
        );
      });
    }

    return stats;
  }, [entries, totalSavings]);

  // Filtered History entries list
  const filteredEntriesList = useMemo(() => {
    if (selectedCategoryFilter === 'all') return entries;
    return entries.filter(e => e.category === selectedCategoryFilter);
  }, [entries, selectedCategoryFilter]);

  // Weekly saving progress challenge (standard goal 30 DT per week)
  const weeklyChallengeTarget = 30;
  const currentWeekProgress = useMemo(() => {
    // Sum last 7 days of entries
    const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const recentSavings = entries
      .filter(e => new Date(e.date).getTime() >= sevenDaysAgo)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      amount: recentSavings,
      percentage: Math.min(100, Math.round((recentSavings / weeklyChallengeTarget) * 100))
    };
  }, [entries]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 md:p-6 select-none font-sans overflow-x-hidden antialiased relative">
      
      {/* Premium animated ambient background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] bg-amber-500/10 rounded-full blur-[110px] pointer-events-none animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[40vw] h-[40vw] bg-rose-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse duration-[8000ms]"></div>
      <div className="absolute top-1/2 left-1/3 w-[30deg] h-[30deg] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[5000ms]"></div>
      
      {/* Background Ambience Dots & Grid overlay for ultimate tech aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-25 pointer-events-none"></div>
      
      {/* Container simulating a luxury mobile device frame */}
      <div className="w-full md:max-w-md md:h-[840px] md:rounded-[48px] md:border-[10px] md:border-slate-800 bg-slate-950/90 backdrop-blur-3xl flex flex-col relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] md:ring-[12px] md:ring-slate-900/40 border-slate-800/60">
        
        {/* Notch & Status Bar */}
        <div className="hidden md:flex justify-between items-center px-8 pt-3 pb-2 text-[11px] text-slate-400 font-medium z-40 bg-slate-950/60 backdrop-blur-md shrink-0 border-b border-slate-900/40">
          <div>09:41</div>
          <div className="w-24 h-4.5 bg-black rounded-b-2xl absolute left-1/2 -translate-x-1/2 top-0 border-x border-b border-slate-800 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[10px] text-amber-500 font-extrabold animate-pulse">● LIVE</span>
            <span>5G</span>
            <span>📶</span>
            <span>🔋 99%</span>
          </div>
        </div>

        {showOnboarding ? (
          <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950 relative overflow-hidden">
            {/* Ambient gradients */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-red-650/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="my-auto space-y-6 z-10">
              {/* Icon/Brand Banner */}
              <div className="text-center space-y-3">
                <div className="inline-flex p-4.5 bg-gradient-to-tr from-amber-500/20 via-red-500/10 to-transparent rounded-[28px] text-amber-400 border border-amber-500/30 shadow-inner animate-pulse">
                  <PiggyBank className="w-10 h-10 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-slate-100 tracking-tight leading-none flex items-center justify-center gap-2">
                    Macha2Allah <span className="text-lg">🇹🇳</span>
                  </h1>
                  <p className="text-xs text-amber-400 font-extrabold tracking-widest uppercase font-sans">
                    تطبيق الإدخار اليومي الذكي
                  </p>
                </div>
              </div>

              {/* Onboarding info card */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="text-center space-y-1 pb-1 border-b border-slate-800/40">
                  <h2 className="text-sm font-black text-slate-200">مرحباً بك لأول مرة ! 👋</h2>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    يرجى إدخال اسمك ولقبك لتخصيص حساب الإدخار الخاص بك.
                  </p>
                  <p className="text-[10px] text-slate-500 italic">
                    Veuillez entrer votre prénom et votre nom pour personnaliser votre expérience.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-3.5">
                  {/* First Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-sans">
                      Prénom / الإسم الأول *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Mohamed"
                      value={onboardingFirstName}
                      onChange={(e) => setOnboardingFirstName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none placeholder-slate-700 text-xs font-semibold"
                    />
                  </div>

                  {/* Last Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-sans">
                      Nom / اللقب العائلي *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Trabelsi"
                      value={onboardingLastName}
                      onChange={(e) => setOnboardingLastName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none placeholder-slate-700 text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 bg-gradient-to-r from-red-650 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-wider cursor-pointer font-sans"
                  >
                    <span>إبدأ الإدخار اليوم • Commencer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Note/Proverb Footnote */}
            <div className="text-center space-y-1 text-[10px] text-slate-500 pb-2 z-10">
              <p className="font-extrabold text-[#ef4444]">« دِينَار عَلَى دِينَار يْنَحِّي الغَصْرَة 🪙 »</p>
              <p className="italic">Chaque millime compte dans votre parcours d'indépendance.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Brand Header */}
        <header className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500/20 to-red-500/10 rounded-xl text-amber-400 border border-amber-500/30 shadow-inner">
              <PiggyBank className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">Macha2Allah</h1>
                <span className="text-[10px] bg-red-600 px-1 py-0.2 rounded font-bold text-white shadow-sm">🇹🇳 DT</span>
              </div>
              {userProfile ? (
                <button
                  type="button"
                  onClick={() => {
                    const first = prompt("Entrez votre prénom / الإسم الأول :", userProfile.firstName);
                    const last = prompt("Entrez votre nom / اللقب :", userProfile.lastName);
                    if (first !== null && last !== null) {
                      const updated = { firstName: first.trim() || userProfile.firstName, lastName: last.trim() || userProfile.lastName };
                      if (updated.firstName && updated.lastName) {
                        setUserProfile(updated);
                        localStorage.setItem('savings_user_profile', JSON.stringify(updated));
                        playBeepNotification();
                      }
                    }
                  }}
                  className="text-[9.5px] text-amber-400 font-extrabold tracking-wide block mt-0.5 text-left cursor-pointer hover:underline flex items-center gap-1"
                  title="Modifier votre profil"
                >
                  <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block"></span>
                  👤 {userProfile.firstName} {userProfile.lastName}
                </button>
              ) : (
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold block mt-0.5">
                  Économies Quotidiennes
                </span>
              )}
            </div>
          </div>
          
          <div 
            className="flex items-center gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory max-w-[62vw] md:max-w-none pr-1 py-1 shrink-0 -mr-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Ticket Camera Quick Snap Button */}
            <motion.button 
              whileTap={{ scale: 0.90 }}
              onClick={() => {
                setShowAddModal(true);
                setTimeout(() => {
                  modalTicketFileInputRef.current?.click();
                }, 150);
              }}
              className="shrink-0 snap-end px-3.5 py-2 bg-slate-900 hover:bg-slate-850 hover:border-amber-500/35 border border-slate-800 rounded-xl text-amber-400 font-extrabold flex items-center justify-center gap-2 relative cursor-pointer"
              title="Prendre en photo un ticket (Aziz / MG)"
            >
              <Camera className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-[10.5px] font-black text-amber-400">تيكيت 📸</span>
            </motion.button>

            {/* Quick entry plus button */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEntryAmount('');
                setEntryNote('');
                setEntryDate(new Date().toISOString().split('T')[0]);
                setShowAddModal(true);
              }}
              className="shrink-0 snap-end px-3.5 py-2 bg-gradient-to-r from-red-600 to-amber-500 text-slate-950 font-black rounded-xl flex items-center justify-center gap-1 shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:brightness-110 active:brightness-95 transition-all text-xs cursor-pointer border border-red-500/30"
              id="cta-add"
            >
              <Plus className="w-3.5 h-3.5 font-black" />
              <span className="text-[11px] font-bold">إدخار ➕</span>
            </motion.button>

            {/* Reminders / Alarm Settings Bell */}
            <motion.button 
              whileTap={{ scale: 0.90 }}
              onClick={() => setShowReminderModal(true)}
              className="shrink-0 snap-end p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-350 hover:text-amber-400 relative cursor-pointer"
              title="Gérer les rappels d'épargne"
            >
              <Bell className="w-4 h-4" />
              {reminders.some(r => r.isEnabled) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
              )}
            </motion.button>
          </div>
        </header>

        {/* INSPIRATIONAL BILINGUAL PROVERB CAROUSEL (Animated inline ticker) */}
        <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border-b border-slate-800/50 py-2.5 px-4 flex items-center justify-between gap-3 text-xs shrink-0 select-none">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] font-bold text-amber-300 truncate font-sans tracking-wide leading-tight text-right">
                {TUNISIAN_PROVERBS[proverbIndex].ar}
              </p>
              <p className="text-[9px] text-slate-300 italic truncate tracking-wide leading-normal">
                "{TUNISIAN_PROVERBS[proverbIndex].fr}"
              </p>
            </div>
          </div>

          <button 
            onClick={() => setProverbIndex((proverbIndex + 1) % TUNISIAN_PROVERBS.length)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400"
            title="Slogan suivant"
          >
            <RotateCcw className="w-3 h-3 hover:rotate-45 transition-transform" />
          </button>
        </div>

        {/* MAIN BODY CONTAINER WITH APP PAGES */}
        <main className="flex-1 overflow-y-auto pb-24 p-4 space-y-4.5 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* USER GREETING BOARD */}
              {userProfile && (
                <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 shadow-md bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-slate-900/40 to-slate-950/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-red-500/10 text-amber-400 font-extrabold flex items-center justify-center border border-amber-500/25">
                      👤
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Asslama • عَسْلامَة 👋</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-100 flex items-center gap-1 leading-tight mt-0.5">
                        {userProfile.firstName} {userProfile.lastName}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      onClick={() => {
                        const first = prompt("Entrez votre prénom / الإسم الأول :", userProfile.firstName);
                        const last = prompt("Entrez votre nom / اللقب :", userProfile.lastName);
                        if (first !== null && last !== null) {
                          const updated = { firstName: first.trim() || userProfile.firstName, lastName: last.trim() || userProfile.lastName };
                          if (updated.firstName && updated.lastName) {
                            setUserProfile(updated);
                            localStorage.setItem('savings_user_profile', JSON.stringify(updated));
                            playBeepNotification();
                          }
                        }
                      }}
                      className="text-[9.5px] text-amber-400/90 hover:text-amber-400 hover:underline cursor-pointer font-black uppercase px-2 py-1.5 bg-amber-500/10 rounded-lg hover:bg-amber-500/20 transition-colors"
                    >
                      تعديل • Éditer
                    </button>
                  </div>
                </div>
              )}

              {/* PRIMARY TOTAL SAVINGS HERO CARD */}
              <div className="relative rounded-3xl p-5.5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-slate-100 overflow-hidden shadow-xl border border-slate-800/80">
                {/* Glow ring in background */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#ef4444] bg-[#ef4444]/15 px-2.5 py-0.5 rounded-full border border-red-500/20 inline-block">
                      الحصالة الذكية • Solde Épargne
                    </span>
                    <h2 className="mt-2.5 text-3xl font-black tracking-tight text-white flex items-baseline gap-1.5">
                      {formatTND(totalSavings)}
                    </h2>
                  </div>
                  
                  {streakDays > 0 && (
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/15 to-red-500/15 border border-orange-500/20 rounded-2xl px-2.5 py-1 text-orange-400 text-[10px] font-bold animate-pulse">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{streakDays} {streakDays === 1 ? 'Jour' : 'Jours'}</span>
                    </div>
                  )}
                </div>
                
                {/* Statistics breakdown display */}
                <div className="grid grid-cols-2 gap-3 mt-5 pt-4.5 border-t border-slate-800/90 text-slate-400 text-xs">
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">اليوم • Aujourd'hui</span>
                    <span className="font-extrabold text-sm text-amber-400 inline-block mt-0.5">
                      +{formatTND(todaySavings)}
                    </span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">هذا الشهر • Mois courant</span>
                    <span className="font-extrabold text-sm text-emerald-400 inline-block mt-0.5">
                      {formatTND(monthSavings)}
                    </span>
                  </div>
                </div>

                {/* Tunisian Proverb hint */}
                <p className="text-[10px] text-slate-400 mt-3 pt-1 border-t border-slate-800/40 italic flex items-center gap-1 leading-tight">
                  <Info className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{TUNISIAN_PROVERBS[proverbIndex].hint}</span>
                </p>
              </div>

              {/* Promotional Quick-Link Banner to Dedicated Materials & Products Section */}
              <div 
                onClick={() => setActiveTab('products')}
                className="bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-950 border border-emerald-500/15 hover:border-emerald-500/35 p-4 rounded-3xl flex justify-between items-center cursor-pointer transition shadow-md group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl bg-emerald-500/15 p-2 rounded-2xl text-emerald-400 group-hover:scale-110 transition duration-300">📦</span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-emerald-400 block uppercase tracking-wider">تفصيل السلع والمواد الموفرّة ✨</span>
                    <span className="text-[10px] text-slate-400 block mt-1">معرض ومصوّر سلع مستقل ومكتمل بمكان خاص به!</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-emerald-400 text-[10px] font-black uppercase">
                  <span>عرض 🌐</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* REMINDERS PREVIEW/STATUS ROW */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 flex flex-col gap-2.5 shadow-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Rappels actifs pour épargner ⏰
                  </h3>
                  <button 
                    onClick={() => setShowReminderModal(true)}
                    className="text-[10px] text-amber-400 font-extrabold flex items-center gap-0.5 hover:underline cursor-pointer"
                  >
                    Gérer ({reminders.filter(r => r.isEnabled).length})
                  </button>
                </div>

                {reminders.filter(r => r.isEnabled).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {reminders.filter(r => r.isEnabled).map((rem) => (
                      <div 
                        key={rem.id}
                        onClick={() => setShowReminderModal(true)}
                        className="bg-slate-950/60 border border-slate-850 hover:border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-slate-200 cursor-pointer transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-extrabold text-[11px] leading-tight font-mono">{rem.time}</span>
                        <span className="text-slate-500 font-medium text-[9px] uppercase">
                          {rem.frequency === 'daily' ? 'Chaque jour' : 'Hebdo'}
                        </span>
                        <span className="text-slate-350 text-[10px] truncate max-w-28 font-semibold">({rem.label})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic py-0.5 flex items-center gap-1.5">
                    <BellOff className="w-3.5 h-3.5 text-slate-600" />
                    <span>Aucun bip d'alerte configuré. Cliquez pour en planifier !</span>
                  </div>
                )}
              </div>

              {/* TUNISIAN FUN REAL CONVERTION CALCULATOR */}
              {totalSavings > 0 && (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4.5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Smile className="w-4 h-4 text-emerald-400" />
                      Équivalence en Tunisie (Maths de poche)
                    </h3>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.2 rounded uppercase">Vrai gain</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Chapati Mahdia box */}
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-lg shadow-inner">
                        🌯
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block leading-tight">Chapatis Mahdia</span>
                        <span className="text-xs font-black text-white">{tunisianEquivalents.chapati} pizzas/sandwichs</span>
                      </div>
                    </div>

                    {/* Fricassés delicious count */}
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-lg shadow-inner">
                        🥯
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block leading-tight">Fricassés chauds</span>
                        <span className="text-xs font-black text-white">{tunisianEquivalents.fricasse} pièces sauvées</span>
                      </div>
                    </div>

                    {/* Direct espresso coffee */}
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-lg shadow-inner">
                        ☕
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block leading-tight">Cafés Direct / Express</span>
                        <span className="text-xs font-black text-slate-200">{tunisianEquivalents.directCoffee} tasses évitées</span>
                      </div>
                    </div>

                    {/* Taxi course */}
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-lg shadow-inner">
                        🚕
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block leading-tight">Courses de Taxi</span>
                        <span className="text-xs font-black text-slate-200">{tunisianEquivalents.taxiRide} trajets épargnés</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SAVING MOTIVATIONAL MINI CHALLENGE WEEK */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-4.5 space-y-3 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      🎯 Défi Hebdo : "L'Écureuil Sérieux"
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Objectif minimum : Économiser 30 DT en 7 jours</p>
                  </div>
                  <span className="text-xs font-black text-red-400 text-right">
                    {formatTND(currentWeekProgress.amount)}
                  </span>
                </div>

                {/* Challenge Progress gauge */}
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentWeekProgress.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>Cible hebdomadaire : 30,000 DT</span>
                    <span className="font-extrabold text-slate-300">{currentWeekProgress.percentage}% accompli</span>
                  </div>
                </div>

                {currentWeekProgress.percentage >= 100 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-[10.5px] text-emerald-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Défi validé ! Votre discipline est impressionnante cette semaine.</span>
                  </div>
                )}
              </div>

              {/* QUICK ONE-TAP INCREMENTS CARDS */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    Ajout Rapide en Un Clic
                  </h3>
                  <span className="text-[10px] text-amber-500/70 font-semibold">Tapper pour épargner</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {quickPresets.map((preset, index) => {
                    const catDef = CATEGORIES[preset.category] || CATEGORIES.other;
                    return (
                      <motion.button
                        key={index}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleQuickAdd(preset)}
                        className="bg-slate-900 hover:border-slate-700/80 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between items-start text-left cursor-pointer transition-all relative group"
                      >
                        <div className="flex items-start gap-2.5 w-full">
                          <span className="text-xl bg-slate-950 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                            {catDef.emoji}
                          </span>
                          <div className="truncate flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-slate-300 block truncate">
                              {preset.label}
                            </span>
                            <span className="text-[9px] text-[#ef4444] font-bold block">
                              {preset.arLabel}
                            </span>
                            <span className="text-xs font-black text-amber-400 block mt-0.5">
                              +{formatTND(preset.amount)}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>



              {/* DYNAMIC PROGRESS RANGE FOR SAVINGS GOALS */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Projet de Vie Actuel
                  </h3>
                  {goal && (
                    <button 
                      onClick={() => {
                        setGoalTitle(goal.title);
                        setGoalTarget(goal.targetAmount.toString());
                        setGoalDeadline(goal.deadline);
                        setShowGoalModal(true);
                      }}
                      className="text-[11px] text-amber-400 font-extrabold hover:underline"
                    >
                      Modifier
                    </button>
                  )}
                </div>

                {goal ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* SVG Circle progress bar loader */}
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          {/* Inner dark circle */}
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            className="stroke-slate-800"
                            strokeWidth="4.5"
                            fill="transparent"
                          />
                          {/* Colored path progress */}
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            className="stroke-emerald-500"
                            strokeWidth="4.5"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 26}
                            strokeDashoffset={2 * Math.PI * 26 * (1 - goalProgress / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-xs font-black text-slate-100">{goalProgress}%</span>
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-200 truncate leading-tight uppercase tracking-wider">{goal.title}</h4>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" /> Échéance : {new Date(goal.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        
                        {goalAdviceDetail && (
                          <span className="text-[10px] text-slate-400 block leading-snug">
                            Plus que {goalAdviceDetail.daysRemaining} jours. Épargnez <strong>{formatTND(goalAdviceDetail.neededPerDay)}/jour</strong> pour réussir !
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10.5px] border-t border-slate-800 pt-3 text-slate-400">
                      <div>
                        <span className="block opacity-70">Déjà amassé :</span>
                        <strong className="text-white text-xs">{formatTND(totalSavings)}</strong>
                      </div>
                      <div className="text-right">
                        <span className="block opacity-70">Cible finale :</span>
                        <strong className="text-emerald-400 text-xs">{formatTND(goal.targetAmount)}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-slate-400 space-y-3">
                    <p className="text-xs">Définissez quoi acheter avec votre argent économisé (Ordinateur, Voyage, Voiture, etc.)</p>
                    <button 
                      onClick={() => {
                        setGoalTitle('');
                        setGoalTarget('');
                        setGoalDeadline('');
                        setShowGoalModal(true);
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-200 text-xs font-extrabold rounded-xl transition"
                    >
                      Créer un objectif d'épargne
                    </button>
                  </div>
                )}
              </div>

              {/* BRIEF RECENT SAVINGS LIST (LAST 3) */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    Écritures Récentes
                  </h3>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className="text-[11px] text-amber-400 font-extrabold flex items-center gap-0.5 hover:underline"
                  >
                    Historique ({entries.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {entries.slice(0, 3).map((entry) => {
                    const catDef = CATEGORIES[entry.category as CategoryKey] || CATEGORIES.other;
                    return (
                      <div 
                        key={entry.id}
                        className="bg-slate-900/50 border border-slate-850 rounded-2xl p-3 flex flex-col gap-2 hover:border-slate-800 transition-colors"
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xl bg-slate-950 p-2.5 rounded-xl shadow-inner shrink-0">
                              {catDef.emoji}
                            </span>
                            <div className="min-w-0">
                              <span className="font-extrabold text-xs text-slate-200 block truncate max-w-40 sm:max-w-xs">
                                {entry.note}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center flex-wrap gap-1.5 mt-0.5">
                                <span>{new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                <span className="text-slate-600">•</span>
                                <span className="font-bold text-[9px] text-amber-500/90 uppercase tracking-wider">{catDef.label}</span>
                                {entry.merchantName && (
                                  <>
                                    <span className="text-slate-600">•</span>
                                    {entry.merchantName === 'Aziz' && (
                                      <span className="px-1.5 py-0.5 text-[8px] font-black uppercase text-slate-950 bg-amber-400 rounded shrink-0 block leading-none">
                                        Aziz 🛒
                                      </span>
                                    )}
                                    {entry.merchantName === 'MG' && (
                                      <span className="px-1.5 py-0.5 text-[8px] font-black uppercase text-white bg-red-600 rounded shrink-0 block leading-none">
                                        MG 🏬
                                      </span>
                                    )}
                                    {(entry.merchantName === 'Mamix' || entry.merchantName === 'Chokri' || entry.merchantName === 'Mamix Chokri') && (
                                      <span className="px-1.5 py-0.5 text-[8px] font-black uppercase text-slate-950 bg-emerald-400 rounded shrink-0 block leading-none">
                                        Mamix Chokri 🍬
                                      </span>
                                    )}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-black text-amber-400">
                              +{formatTND(entry.amount)}
                            </span>
                            <button 
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-850 rounded-lg transition"
                              title="Supprimer la transaction"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Product detailed card inside dashboard entry */}
                        {(entry.productName || entry.productPrice || entry.productPhoto) && (
                          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-850/60 flex items-center justify-between gap-2 text-right">
                            <div className="flex items-center gap-2 min-w-0">
                              {entry.productPhoto && (
                                <img 
                                  src={entry.productPhoto} 
                                  onClick={() => setZoomedTicketImage(entry.productPhoto || null)}
                                  className="w-10 h-10 object-cover rounded-lg border border-slate-800 cursor-zoom-in hover:border-amber-500/35 transition shrink-0" 
                                  alt="Product"
                                />
                              )}
                              <div className="leading-tight text-left min-w-0">
                                <span className="text-[8px] font-bold text-slate-500 block uppercase tracking-wider">📦 المنتج المصاحب</span>
                                <span className="text-[10px] font-black text-slate-200 truncate block">{entry.productName || 'منتج غير محدد'}</span>
                              </div>
                            </div>
                            {entry.productPrice !== undefined && entry.productPrice > 0 && (
                              <div className="text-right shrink-0">
                                <span className="text-[8px] text-slate-500 block">السعر</span>
                                <span className="text-[10px] font-black text-amber-500">{formatTND(entry.productPrice)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {entries.length === 0 && (
                    <div className="text-center p-8 text-slate-500 text-xs italic bg-slate-900/30 rounded-2xl border border-slate-800">
                      Aucune économie n'a été ajoutée pour le moment. Appuyez sur "Économiser" ci-dessus !
                    </div>
                  )}
                </div>
              </div>

              {/* STATISTICAL PIE DISTRIBUTIONS */}
              {totalSavings > 0 && (
                <div className="bg-slate-900/30 border border-slate-850 rounded-3xl p-4.5 space-y-3.5">
                  <h3 className="text-xs font-black text-slate-350 uppercase tracking-wider">
                    Répartition par Catégorie d'Épargne
                  </h3>

                  <div className="space-y-2.5">
                    {Object.keys(CATEGORIES).map(key => {
                      const cat = CATEGORIES[key as CategoryKey];
                      const stat = categoryStats[key as CategoryKey];
                      if (stat.amount === 0) return null;
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <span className="text-sm">{cat.emoji}</span>
                              <span className="font-bold">{cat.label}</span>
                            </span>
                            <span className="font-black text-slate-200">
                              {formatTND(stat.amount)} <span className="text-slate-500 font-normal text-[10px]">({stat.percentage}%)</span>
                            </span>
                          </div>
                          
                          {/* Custom visual color bars */}
                          <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-amber-500 transition-all duration-300"
                              style={{ 
                                width: `${stat.percentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MAINTENANCE / SETTINGS DANGER ZONE */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 mt-4 space-y-3 shadow-inner">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-800/30">
                  <span className="text-sm">⚠️</span>
                  <div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">منطقة الأمان والإعدادات • Paramètres</h3>
                    <p className="text-[9.5px] text-slate-500">Pour vider ou réinitialiser les informations de votre application d’Épargne</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-950/40 border border-slate-850 p-3 rounded-2xl">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-[11px] font-black text-slate-200 block">بدء الإدخار من الصفر 🗑️</span>
                    <span className="text-[9px] text-slate-500 block">Réinitialiser l'application d'épargne (Remettre le solde à 0 DT)</span>
                  </div>

                  <button 
                    onClick={handleResetAllData}
                    className="w-full sm:w-auto px-4 py-2 bg-red-550/10 text-red-400 hover:text-white hover:bg-red-650/40 cursor-pointer font-black uppercase text-[10px] rounded-xl transition-all border border-red-500/20 active:scale-95"
                    title="Remettre tout l'historique d'épargne à zéro"
                  >
                    مسح كافة البيانات • Réinitialiser 🚨
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB: PRODUCTS AND MATERIALS DEDICATED VIEW */}
          {activeTab === 'products' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 font-sans"
            >
              {/* HEADER CONTAINER */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest inline-block mb-1">
                      المعرض المستقل للسلع • Votre Vitrine
                    </span>
                    <h2 className="text-lg font-black text-slate-100 flex items-center gap-1.5 leading-tight">
                      معرض السلّع والمواد الموفرّة 🛍️
                    </h2>
                    <p className="text-[10px] text-slate-400 max-w-sm leading-relaxed">
                      تتبع السلع الفردية والمواد الغذائية التي قمت بشراءها بنجاح مع التقاط صور واضحة لها وتوثيق سعرها ونسبة توفيرها!
                    </p>
                  </div>
                  <span className="text-3xl bg-slate-950 p-3 rounded-2xl border border-slate-800">📦</span>
                </div>
              </div>

              {/* PRODUCTS STATISTICS ROW */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                  <span className="text-[8.5px] text-slate-505 font-extrabold uppercase">عدد السلع • Articles</span>
                  <span className="block text-base font-black text-amber-400">
                    {entries.filter(e => e.productName).length} 📦
                  </span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                  <span className="text-[8.5px] text-slate-505 font-extrabold uppercase">التوفير • Total Gains</span>
                  <span className="block text-base font-black text-emerald-400">
                    {formatTND(entries.filter(e => e.productName).reduce((acc, curr) => acc + curr.amount, 0))}
                  </span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                  <span className="text-[8.5px] text-slate-505 font-extrabold uppercase">معدل التوفير • Moyenne</span>
                  <span className="block text-base font-black text-slate-200">
                    {entries.filter(e => e.productName).length > 0 
                      ? formatTND(entries.filter(e => e.productName).reduce((acc, curr) => acc + curr.amount, 0) / entries.filter(e => e.productName).length) 
                      : '0,000'
                    }
                  </span>
                </div>
              </div>

              {/* ACTION: TOGGLE ADD NEW PRODUCT FORM */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuickProdForm(!showQuickProdForm)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-lg active:scale-95"
                >
                  {showQuickProdForm ? 'إلغاء النموذج ❌' : '➕ تسجيل إضافة سلعة جديدة بالتفاصيل والصورة'}
                </button>

                {/* Inline form to quickly log a product details */}
                {showQuickProdForm && (
                  <motion.form 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleAddQuickProduct}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden"
                  >
                    <div className="text-[11px] font-black text-amber-400 border-b border-slate-900 pb-2 flex justify-between">
                      <span>✍️ ملء تفاصيل السلعة المراد حفظها في الحصالة</span>
                      <span className="text-slate-500 font-medium">Création de matériel</span>
                    </div>

                    <div className="space-y-3">
                      {/* Product Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest flex justify-between">
                          <span>إسم المادة أو السلعة *</span>
                          <span className="text-[8px] text-slate-500">(Ex: Chocolat Saïd, Yaourt...)</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="مثال: علبة شوكولاتة سعيد، باكو حليب، ياغورت..."
                          value={quickProdName}
                          onChange={(e) => setQuickProdName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none placeholder-slate-700 font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Product Price */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">
                            سعر المادة (DT)
                          </label>
                          <input 
                            type="text" 
                            placeholder="0,000"
                            value={quickProdPrice}
                            onChange={(e) => setQuickProdPrice(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-amber-400 font-black text-xs focus:outline-none placeholder-slate-800"
                          />
                        </div>

                        {/* Custom saving amount on this item */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest flex justify-between">
                            <span>المبلغ الموفّر (DT) *</span>
                            <span className="text-[8px] text-slate-500">(Épargne)</span>
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="مقدار التوفير"
                            value={quickProdSaving}
                            onChange={(e) => setQuickProdSaving(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-emerald-400 font-black text-xs focus:outline-none placeholder-slate-800"
                          />
                        </div>
                      </div>

                      {/* Store select keys for this product */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">
                          محل أو مغازة الشراء • Magasin
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(['Aziz', 'MG', 'Mamix Chokri', 'Other'] as const).map((m) => {
                            const isSel = quickProdMerchant === m;
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setQuickProdMerchant(m)}
                                className={`py-1.5 rounded-xl text-[9.5px] font-black border transition-all cursor-pointer ${
                                  isSel 
                                    ? m === 'Aziz' 
                                      ? 'bg-amber-500 text-slate-950 border-amber-400' 
                                      : m === 'MG' 
                                        ? 'bg-red-650 text-white' 
                                        : m === 'Mamix Chokri'
                                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                          : 'bg-slate-705 text-slate-200 border-slate-650'
                                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-705'
                                }`}
                              >
                                {m === 'Aziz' ? 'عزيز 🛒' : m === 'MG' ? 'MG 🏬' : m === 'Mamix Chokri' ? 'ماميكس 🍬' : 'آخر'}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Camera capture upload */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-300 block uppercase">
                          صورة المادة أو السلعة (📸 التقاط مباشر بالكاميرا)
                        </label>
                        <button
                          type="button"
                          onClick={() => quickProdFileInputRef.current?.click()}
                          className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer text-xs font-bold ${
                            quickProdPhoto 
                              ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5' 
                              : 'text-slate-400 border-slate-800 hover:border-slate-700 bg-slate-900/40'
                          }`}
                        >
                          <Camera className="w-4 h-4 text-amber-505 animate-pulse" />
                          <span>{quickProdPhoto ? 'تم تصوير السلعة بنجاح ✔' : 'اضغط للالتقاط بكاميرا الموبايل'}</span>
                        </button>
                        <input 
                          ref={quickProdFileInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onloadend = () => setQuickProdPhoto(r.result as string);
                              r.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </div>

                      {quickProdPhoto && (
                        <div className="flex items-center justify-between p-2 bg-slate-900 rounded-xl border border-slate-800 mt-1">
                          <img 
                            src={quickProdPhoto} 
                            className="w-12 h-12 object-cover rounded-xl border border-slate-755" 
                            alt="Miniature Snapshot" 
                          />
                          <button
                            type="button"
                            onClick={() => setQuickProdPhoto(null)}
                            className="p-1.5 px-3 bg-red-500/15 hover:bg-red-500/20 text-red-400 text-[9px] font-black rounded-lg"
                          >
                            حذف الصورة ❌
                          </button>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 hover:from-emerald-400 font-black text-xs rounded-xl shadow-lg transition cursor-pointer"
                      >
                        💾 حفظ وتوثيق هذه السلعة في السجل
                      </button>
                    </div>
                  </motion.form>
                )}
              </div>

              {/* SEARCH & FILTERS BAR */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4.5 space-y-3 shadow-md">
                <div className="flex flex-col gap-2.5">
                  {/* Search Input */}
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="🔍 ابحث عن سلعة، مادة، أو طعام محدد..."
                      value={prodSearchQuery}
                      onChange={(e) => setProdSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none placeholder-slate-700 font-semibold"
                    />
                    {prodSearchQuery && (
                      <button
                        onClick={() => setProdSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        ❌
                      </button>
                    )}
                  </div>

                  {/* Merchant horizontal selector */}
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">موقع أو محل الشراء</span>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {([
                        { key: 'All', label: 'الكل' },
                        { key: 'Aziz', label: 'عزيز 🛒' },
                        { key: 'MG', label: 'MG 🏬' },
                        { key: 'Mamix Chokri', label: 'ماميكس 🍬' },
                        { key: 'Other', label: 'آخر • Autre' }
                      ] as const).map((f) => {
                        const isSel = prodMerchantFilter === f.key;
                        return (
                          <button
                            key={f.key}
                            type="button"
                            onClick={() => setProdMerchantFilter(f.key)}
                            className={`shrink-0 px-3 py-1 text-[9.5px] font-black rounded-lg border transition ${
                              isSel 
                                ? 'bg-amber-400 text-slate-950 border-amber-300' 
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-705'
                            }`}
                          >
                            {f.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* GALLERY SHOWCASE OF REGISTERED ITEMS */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block pb-1 border-b border-slate-800/60 font-sans">
                  🛍️ السلع والمنتوجات الموفرة ({
                    entries.filter(e => 
                      e.productName && 
                      (prodMerchantFilter === 'All' || e.merchantName === prodMerchantFilter) &&
                      e.productName.toLowerCase().includes(prodSearchQuery.toLowerCase())
                    ).length
                  })
                </span>

                {entries.filter(e => 
                  e.productName && 
                  (prodMerchantFilter === 'All' || e.merchantName === prodMerchantFilter) &&
                  e.productName.toLowerCase().includes(prodSearchQuery.toLowerCase())
                ).length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {entries.filter(e => 
                      e.productName && 
                      (prodMerchantFilter === 'All' || e.merchantName === prodMerchantFilter) &&
                      e.productName.toLowerCase().includes(prodSearchQuery.toLowerCase())
                    ).map((entry) => {
                      return (
                        <div 
                          key={entry.id}
                          className="bg-slate-900/40 border border-slate-850 hover:border-slate-700 p-3 rounded-3xl flex flex-col justify-between space-y-3 transition-colors relative group"
                        >
                          <div className="space-y-2">
                            {/* Product Snapshot / Fallback */}
                            {entry.productPhoto ? (
                              <div 
                                onClick={() => setZoomedTicketImage(entry.productPhoto || null)}
                                className="relative w-full h-28 rounded-2xl overflow-hidden border border-slate-800 cursor-zoom-in group-hover:border-amber-500/30 transition-all"
                                title="انقر لتكبير صورة السلعة"
                              >
                                <img 
                                  src={entry.productPhoto} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                                  referrerPolicy="no-referrer"
                                  alt={entry.productName} 
                                />
                                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-[8px] font-extrabold text-slate-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 pointer-events-none">
                                  📸 تم التصوير
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-24 bg-slate-950/60 rounded-2xl flex flex-col items-center justify-center text-3xl border border-slate-850 text-slate-600">
                                <span>📦</span>
                                <span className="text-[8px] text-slate-505 font-extrabold uppercase mt-1">بدون صورة كابتشر</span>
                              </div>
                            )}

                            {/* Details Info */}
                            <div className="space-y-1 text-right">
                              <span className="text-xs font-black text-slate-100 block truncate" title={entry.productName}>
                                {entry.productName}
                              </span>
                              
                              <div className="flex justify-between items-center text-[9px] pt-1">
                                <span className="text-slate-500">التاريخ: {entry.date}</span>
                                {entry.productPrice !== undefined && entry.productPrice > 0 && (
                                  <span className="text-amber-500 font-black">
                                    السعر الأصلي: {formatTND(entry.productPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-850 flex justify-between items-center">
                            {/* Trash Delete button */}
                            <button
                              onClick={() => {
                                if (confirm('هل أنت متأكد من حذف هذه السلعة المسجلة من السجل؟')) {
                                  handleDeleteEntry(entry.id);
                                }
                              }}
                              type="button"
                              className="p-1 px-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 bg-slate-900 rounded-lg transition duration-200"
                              title="حذف هذه السلعة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Tag & Savings */}
                            <div className="flex items-center gap-1.5">
                              {entry.merchantName ? (
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase leading-none text-right ${
                                  entry.merchantName === 'Aziz' 
                                    ? 'bg-amber-400 text-slate-950' 
                                    : entry.merchantName === 'MG' 
                                      ? 'bg-red-650 text-white' 
                                      : 'bg-emerald-400 text-slate-950'
                                }`}>
                                  {entry.merchantName === 'Aziz' ? 'عزيز 🛒' : entry.merchantName === 'MG' ? 'MG 🏬' : 'ماميكس 🍬'}
                                </span>
                              ) : (
                                <span className="text-[8px] text-slate-505 font-bold uppercase">متنوع 🛍️</span>
                              )}

                              <span className="text-emerald-400 font-black text-xs">+{formatTND(entry.amount)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 bg-slate-900/30 border border-slate-850 border-dashed rounded-3xl text-center space-y-2">
                    <p className="text-xs text-slate-500 italic">
                      لا تتوفر سلع مسجلة تطابق بحثك أو تصنيف المحلات الحالي.
                    </p>
                    <button
                      onClick={() => setShowQuickProdForm(true)}
                      type="button"
                      className="py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-500 font-bold hover:underline"
                    >
                      سجّل أو كبّشر مادتك الأولى الآن 🏷️
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: HISTORY LIST */}
          {activeTab === 'history' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                    التحويلات المالية <span className="text-slate-400 font-normal text-xs">• Historique Épargne</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 block tracking-wider mt-0.5">
                    {entries.length} écritures enregistrées • Total Épargne : {formatTND(totalSavings)}
                  </p>
                </div>

                <button 
                  onClick={() => {
                    if (confirm('Voulez-vous supprimer toutes les écritures d\'économie ? Cette action est irréversible.')) {
                      saveEntries([]);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-600/20 text-[10px] font-bold"
                >
                  Tout vider
                </button>
              </div>

              {/* Horizontal scroll Quick Filters by category */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none shrink-0">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border cursor-pointer shrink-0 transition-all ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-amber-400 border-amber-400 text-slate-950 font-black'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tous ({entries.length})
                </button>
                {Object.keys(CATEGORIES).map(k => {
                  const cat = CATEGORIES[k as CategoryKey];
                  const count = entries.filter(e => e.category === k).length;
                  if (count === 0) return null; // hide empty categories
                  return (
                    <button
                      key={k}
                      onClick={() => setSelectedCategoryFilter(k)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border cursor-pointer shrink-0 transition-all flex items-center gap-1 ${
                        selectedCategoryFilter === k
                          ? 'bg-amber-400 border-amber-400 text-slate-900 font-black'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label.split(' ')[0]}</span>
                      <span className="text-[9px] bg-slate-950/20 px-1 rounded">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* LIST FEED WITH SCROLL BAR */}
              <div className="space-y-2">
                {filteredEntriesList.map((entry) => {
                  const catDef = CATEGORIES[entry.category as CategoryKey] || CATEGORIES.other;
                  return (
                    <div 
                      key={entry.id}
                      className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col gap-3 hover:border-slate-800 transition"
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {entry.ticketPhoto ? (
                            <div 
                              onClick={() => setZoomedTicketImage(entry.ticketPhoto || null)}
                              className="relative w-12 h-12 rounded-xl shrink-0 overflow-hidden border border-slate-800 cursor-zoom-in group shadow-inner"
                              title="Voir le ticket à taille réelle"
                            >
                              <img src={entry.ticketPhoto} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[7px] text-amber-400 font-extrabold text-center py-0.5 uppercase tracking-wide">
                                Zoom 🔍
                              </div>
                            </div>
                          ) : (
                            <span className="text-2xl bg-slate-950 p-2 rounded-2xl shrink-0 shadow-inner">
                              {catDef.emoji}
                            </span>
                          )}
                          
                          <div className="truncate min-w-0">
                            <h4 className="font-extrabold text-xs text-slate-100 truncate max-w-44 sm:max-w-xs flex items-center gap-1.5 flex-wrap">
                              <span>{entry.note}</span>
                              {entry.merchantName === 'Aziz' && (
                                <span className="px-1.5 py-0.5 text-[8.5px] font-black uppercase text-slate-950 bg-amber-500 rounded-md shrink-0 block leading-none">
                                  Aziz 🛒
                                </span>
                              )}
                              {entry.merchantName === 'MG' && (
                                <span className="px-1.5 py-0.5 text-[8.5px] font-black uppercase text-white bg-red-650 rounded-md shrink-0 block leading-none">
                                  MG 🏬
                                </span>
                              )}
                              {(entry.merchantName === 'Mamix' || entry.merchantName === 'Chokri' || entry.merchantName === 'Mamix Chokri') && (
                                <span className="px-1.5 py-0.5 text-[8.5px] font-black uppercase text-slate-950 bg-emerald-400 rounded-md shrink-0 block leading-none">
                                  Mamix Chokri 🍬
                                </span>
                              )}
                            </h4>
                            <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">
                              {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} • <span className="font-bold text-[8.5px] uppercase text-amber-500">{catDef.label}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-amber-400">
                            +{formatTND(entry.amount)}
                          </span>
                          
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-1 px-2.5 text-slate-500 hover:text-red-500 bg-slate-850 hover:bg-slate-800 rounded-lg transition text-xs"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Display Product Details inline if they exist */}
                      {(entry.productName || entry.productPrice || entry.productPhoto) && (
                        <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between gap-2.5 text-right">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {entry.productPhoto && (
                              <img 
                                src={entry.productPhoto} 
                                onClick={() => setZoomedTicketImage(entry.productPhoto || null)}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-800 cursor-zoom-in hover:border-amber-500/35 transition shrink-0" 
                                alt="Product"
                              />
                            )}
                            <div className="leading-tight text-left min-w-0">
                              <span className="text-[8.5px] font-bold text-slate-500 block uppercase tracking-wider">📦 المنتج المصاحب • Produit</span>
                              <span className="text-[10.5px] font-extrabold text-slate-200 truncate block">{entry.productName || 'غير محدّد'}</span>
                            </div>
                          </div>
                          {entry.productPrice !== undefined && entry.productPrice > 0 && (
                            <div className="text-right shrink-0">
                              <span className="text-[8px] text-slate-500 block">السعر</span>
                              <span className="text-[10.5px] font-black text-amber-500">{formatTND(entry.productPrice)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredEntriesList.length === 0 && (
                  <div className="text-center py-20 text-slate-500 text-sm space-y-3">
                    <p className="italic">Aucune transaction trouvée pour ce filtre.</p>
                    <button 
                      onClick={() => setSelectedCategoryFilter('all')}
                      className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg"
                    >
                      Effacer le filtre
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: SAVINGS OBJECTIVE GOALS */}
          {activeTab === 'goals' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                  المشروع و دخر الأموال <span className="text-slate-400 font-normal text-xs">• Objectifs de Vie</span>
                </h2>
                <p className="text-[10px] text-slate-400 block mt-0.5">Acheter une voiture, un smartphone, ou financer ses vacances d'été !</p>
              </div>

              {goal ? (
                <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-5.5 space-y-4 shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-black text-emerald-400 bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-500/20 inline-block leading-tight">
                        Cible active
                      </span>
                      <h3 className="text-base font-black text-slate-100 mt-2">{goal.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                        <Calendar className="w-4 h-4 text-slate-500" /> Échéance : {new Date(goal.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    <button 
                      onClick={handleDeleteGoal}
                      className="p-1.5 text-slate-500 hover:text-red-400 bg-slate-850 rounded-xl hover:bg-slate-800 transition"
                      title="Supprimer cet objectif"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 bg-slate-950/50 p-4 rounded-2xl border border-slate-850">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs text-slate-400">Progression</span>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-400">{goalProgress}%</span>
                        <span className="text-[10px] text-slate-500 block leading-none">Atteint</span>
                      </div>
                    </div>

                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-full transition-all duration-700" 
                        style={{ width: `${goalProgress}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10.5px] text-slate-400 pt-2 border-t border-slate-800/60 mt-3">
                      <div>
                        <span>Épargné actuellement :</span>
                        <span className="block font-black text-white text-xs mt-0.5">{formatTND(totalSavings)}</span>
                      </div>
                      <div className="text-right">
                        <span>Objectif visé :</span>
                        <span className="block font-black text-emerald-400 text-xs mt-0.5">{formatTND(goal.targetAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {goalAdviceDetail && (
                    <div className="text-xs text-slate-400 bg-slate-850 p-3.5 rounded-2xl flex items-start gap-2.5 border border-slate-800">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="leading-snug">
                          <strong>Calculateur intelligent :</strong> Il vous reste <strong>{goalAdviceDetail.daysRemaining} jours</strong> pour conclure votre projet. Parviendrez-vous à épargner <strong>{formatTND(goalAdviceDetail.neededPerDay)}</strong> par jour ?
                        </p>
                        <p className="text-[10px] text-slate-500 italic">
                          💡 Dites non à un petit café dehors chaque matin et votre projet sera bouclé rapidement !
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setGoalTitle(goal.title);
                        setGoalTarget(goal.targetAmount.toString());
                        setGoalDeadline(goal.deadline);
                        setShowGoalModal(true);
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-100 rounded-xl text-xs font-bold transition"
                    >
                      Ajuster le Projet
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 shadow-sm">
                    <Target className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-200">Aucun projet d'épargne</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      S'épargner sans projet est difficile. Définissez votre projet (Achat PC, voyages au pays, permis de conduire) pour garder la pêche !
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setGoalTitle('');
                      setGoalTarget('');
                      setGoalDeadline('');
                      setShowGoalModal(true);
                    }}
                    className="px-5 py-3 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition"
                  >
                    Nouveau Projet d'Épargne
                  </button>
                </div>
              )}

              {/* RECOMMENDED TUNISIAN SMART ADVICE TABLE */}
              <div className="space-y-3 pt-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                  Astuces de poche en Tunisie 🇹🇳
                </h3>
                
                <div className="space-y-2.5">
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850 flex gap-3">
                    <span className="text-2xl bg-slate-950 p-2.5 rounded-xl shrink-0">🚌</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-200">Le transport collectif (Covoiturage ou Métro)</h4>
                      <p className="text-[10.5px] text-slate-400 leading-normal mt-0.5">Le taxi individuel vide rapidement votre portefeuille. Privilégiez le covoiturage ou les moyens alternatifs. Économie estimée : <strong>6,000 DT/jour</strong>.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850 flex gap-3">
                    <span className="text-2xl bg-slate-950 p-2.5 rounded-xl shrink-0">🥪</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-200">Le "Krout" fait maison</h4>
                      <p className="text-[10.5px] text-slate-400 leading-normal mt-0.5">Acheter à manger dehors tous les midis au bureau s'avère coûteux. Importez votre plat cuisiné maison ou sandwich. Économie estimée : <strong>8,000 DT/jour</strong>.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850 flex gap-3">
                    <span className="text-2xl bg-slate-950 p-2.5 rounded-xl shrink-0">☕</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-200">Faire son café au Thermos</h4>
                      <p className="text-[10.5px] text-slate-400 leading-normal mt-0.5">Le traditionnel "gahwa" bu quotidiennement en terrasse représente plus de 50 DT par mois. Préparez-le chez vous. Économie estimée : <strong>2,000 DT/jour</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: GAMIFIED SUCCESS BADGES */}
          {activeTab === 'badges' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                  الجوائز والنجاحات <span className="text-slate-400 font-normal text-xs">• Badges d'Honneur</span>
                </h2>
                <p className="text-[10px] text-slate-400 block mt-0.5">Débloquez de superbes badges au fil de votre rigueur et de vos dépôts !</p>
              </div>

              {/* STATS OVERVIEW FOR MOTIVATION */}
              <div className="bg-slate-900/60 border border-slate-800 p-4.5 rounded-3xl flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] text-slate-400 block font-bold uppercase tracking-wider">Discipline financière</span>
                  <span className="text-base font-black text-amber-400">
                    {unlockedBadges.length} de {SAVINGS_BADGES.length} Succès Validés
                  </span>
                </div>
                <div className="text-2xl bg-slate-950/70 p-3 rounded-full border border-slate-855 text-center animate-bounce">
                  🏆
                </div>
              </div>

              {/* GRID VIEW LIST */}
              <div className="space-y-2">
                {SAVINGS_BADGES.map((badge) => {
                  const isUnlocked = unlockedBadges.some(b => b.id === badge.id);
                  return (
                    <div 
                      key={badge.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                        isUnlocked 
                          ? `${badge.badgeColor.split(' ')[0]} bg-slate-900 border-amber-500/30 opacity-100 shadow-md` 
                          : 'border-slate-850 bg-slate-900/30 opacity-50'
                      }`}
                    >
                      <span className={`text-3xl p-3 rounded-2xl bg-slate-950/80 shrink-0 ${isUnlocked ? 'scale-105 filter-none' : 'grayscale'}`}>
                        {badge.emoji}
                      </span>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-200">{badge.title}</h4>
                          {isUnlocked ? (
                            <span className="text-[8.5px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-black uppercase tracking-wide">
                              Débloqué
                            </span>
                          ) : (
                            <span className="text-[8.5px] bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide">
                              En cours
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </main>

        {/* STICKY BOTTOM TAB NAVIGATION COMPONENT */}
        <nav className="absolute bottom-0 left-0 right-0 h-19 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 flex justify-around items-center px-4 pb-2 z-30 shrink-0">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-2xl transition-all cursor-pointer ${activeTab === 'dashboard' ? 'text-amber-400 font-extrabold bg-slate-850' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Coins className="w-5 h-5" />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>

          <button 
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-2xl transition-all cursor-pointer ${activeTab === 'products' ? 'text-amber-400 font-extrabold bg-slate-850' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-bold">المواد والسلع</span>
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-2xl transition-all cursor-pointer ${activeTab === 'history' ? 'text-amber-400 font-extrabold bg-slate-850' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] font-bold">السجل</span>
          </button>

          <button 
            onClick={() => setActiveTab('goals')}
            className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-2xl transition-all cursor-pointer ${activeTab === 'goals' ? 'text-amber-400 font-extrabold bg-slate-850' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-bold">الأهداف</span>
          </button>

          <button 
            onClick={() => setActiveTab('badges')}
            className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-2xl transition-all cursor-pointer ${activeTab === 'badges' ? 'text-amber-400 font-extrabold bg-slate-850' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-bold">الجوائز</span>
          </button>
        </nav>
      </>
    )}

        {/* --- MODAL DIALOGS --- */}

        {zoomedTicketImage && (
          <div 
            onClick={() => setZoomedTicketImage(null)}
            className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-4 z-[9999] backdrop-blur-md cursor-zoom-out"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm max-h-[85vh] w-full bg-slate-900 border border-slate-800 p-2.5 flex flex-col justify-between items-center text-center space-y-4 shadow-2xl rounded-3xl"
            >
              <button
                onClick={() => setZoomedTicketImage(null)}
                className="absolute top-2.5 right-2 text-slate-400 hover:text-white p-1.5 bg-slate-800/80 rounded-full cursor-pointer z-10 hover:scale-105 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
              <img src={zoomedTicketImage} className="max-w-full max-h-[65vh] object-contain rounded-2xl" alt="Ticket Zoomed" />
              <div className="space-y-1 pb-2">
                <span className="text-xs font-black text-amber-400">Aperçu du Ticket • تيكيت الكاشير</span>
                <p className="text-[10px] text-slate-450">Appuyez sur X ou en dehors pour fermer</p>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: ADD SAVINGS (CUSTOM INTUITIVE TAP KEYPAD FOR MILLIMES) */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-end justify-center"
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 24, stiffness: 220 }}
                className="w-full bg-slate-900 border-t border-slate-800 rounded-t-[32px] p-5.5 space-y-4 pb-8 max-h-[92%] overflow-y-auto"
              >
                {/* Header of Modal */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <div>
                      <h3 className="text-xs font-black text-slate-200">إضافة مبلغ • Nouvelle Épargne</h3>
                      <span className="text-[9px] text-slate-450 uppercase block">Enregistrer le pécule du jour</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Amount input view area */}
                <div className="space-y-1 bg-slate-950 p-4.5 rounded-2xl border border-slate-800/80">
                  <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    Montant Épargné (Tunisian Dinars TND / DT)
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                      {entryAmount || '0'}<span className="text-slate-500 text-sm ml-1">DT</span>
                    </div>
                    
                    {entryAmount !== '' && (
                      <button 
                        type="button"
                        onClick={() => setEntryAmount('')}
                        className="text-[10px] text-red-400 hover:underline font-bold"
                      >
                        Vider
                      </button>
                    )}
                  </div>
                  
                  {/* Realtime Conversion in standard currency */}
                  <span className="text-[9.5px] text-slate-400 block pt-1 border-t border-slate-900/50">
                     Équivaut à : <strong>{entryAmount ? formatTND(parseFloat(entryAmount) || 0) : '0,000 DT'}</strong>
                  </span>
                </div>

                {/* Custom quick increment keys */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => appendKeypadAmount(0.500)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10.5px] font-extrabold whitespace-nowrap cursor-pointer shrink-0"
                  >
                    +500 Millimes 🥯
                  </button>
                  <button
                    type="button"
                    onClick={() => appendKeypadAmount(1.500)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10.5px] font-extrabold whitespace-nowrap cursor-pointer shrink-0"
                  >
                    +1,500 DT ☕
                  </button>
                  <button
                    type="button"
                    onClick={() => appendKeypadAmount(5.000)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10.5px] font-extrabold whitespace-nowrap cursor-pointer shrink-0"
                  >
                    +5,000 DT 🌯
                  </button>
                  <button
                    type="button"
                    onClick={() => appendKeypadAmount(10.000)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10.5px] font-extrabold whitespace-nowrap cursor-pointer shrink-0"
                  >
                    +10,000 DT 🚕
                  </button>
                </div>

                {/* Touch Numerical Keypad widget */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-850">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ',', 'C'].map((key) => {
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleKeypadPress(key)}
                        className={`py-2.5 rounded-xl text-center text-sm font-black transition-all cursor-pointer select-none active:bg-slate-800 ${
                          key === 'C' 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                            : key === ',' 
                              ? 'bg-slate-900 text-slate-300' 
                              : 'bg-slate-900 text-slate-100 hover:bg-slate-800'
                        }`}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>

                {/* Category Picker selectors */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                    <span>Source de l'économie / مصدر التوفير</span>
                    <span className="text-[8.5px] text-amber-500 font-extrabold animate-pulse">إسحب يمين يسار للاختيار ↔ Glisser</span>
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1.5 snap-x snap-mandatory">
                    {Object.keys(CATEGORIES).map(key => {
                      const cat = CATEGORIES[key as CategoryKey];
                      const isSelected = entryCategory === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setEntryCategory(key as CategoryKey);
                          }}
                          className={`snap-start shrink-0 px-4 py-3 rounded-xl flex items-center gap-2 border cursor-pointer select-none transition-all ${
                            isSelected 
                              ? 'border-amber-400 bg-amber-500/15 text-amber-400 font-black scale-[1.03] shadow-lg shadow-amber-500/5' 
                              : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-base">{cat.emoji}</span>
                          <span className="text-[11px] font-extrabold leading-none whitespace-nowrap">
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Date du gain
                    </label>
                    <input 
                      type="date"
                      required
                      value={entryDate}
                      onChange={(e) => setEntryDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Quick toggle to launch camera scanner */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Ticket 📸
                    </label>
                    <button
                      type="button"
                      disabled={isScanningTicket}
                      onClick={() => modalTicketFileInputRef.current?.click()}
                      className={`w-full py-2 bg-slate-950/40 hover:bg-slate-850 rounded-xl flex items-center justify-center gap-1 border hover:border-amber-500/30 transition-all cursor-pointer text-xs font-black ${
                        isScanningTicket ? 'text-amber-500 border-amber-500/50 animate-pulse bg-amber-500/10' :
                        modalTicketImage ? 'text-amber-400 border-amber-400' : 'text-slate-400 border-slate-800'
                      }`}
                      title="Attacher la photo d'un ticket"
                    >
                      <Camera className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                      <span>{isScanningTicket ? 'جاري التحليل... ✍️' : modalTicketImage ? 'تم الإرفاق ✔' : 'تصوير التيكيت'}</span>
                    </button>
                    {/* Hidden input file */}
                    <input 
                      ref={modalTicketFileInputRef}
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handleModalTicketImageUpload} 
                      className="hidden" 
                    />
                  </div>
                </div>

                {/* Ticket and Merchant scanner within the modal */}
                <div className="space-y-2 bg-slate-950/40 p-3 rounded-2xl border border-slate-850">
                  {isScanningTicket && (
                    <div className="p-3 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-xl text-center text-[10px] font-black flex items-center justify-center gap-2 animate-pulse my-1">
                      <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري قراءة تفاصيل التيكيت وسلاسل السلعة ماليّاً... 🧠✨</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pb-1 border-b border-slate-900/50">
                    <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                      🛍️ مغازات التيكيت • Magasin du Ticket :
                    </span>
                  </div>

                  {/* 5-way elegant store selector */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setModalTicketMerchant('Aziz');
                        setEntryCategory('shopping');
                        if (!entryNote.trim() || entryNote === 'Achat malin Magasin Aziz 🛒' || entryNote === 'Économie Magasin Général MG 🛒' || entryNote.startsWith('Économie') || entryNote.startsWith('Achat') || entryNote.includes('مغازة')) {
                          setEntryNote('توفير مشتريات مغازة عزيز 🛒');
                        }
                      }}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[9.5px] flex items-center justify-center gap-1 border cursor-pointer transition-all ${
                        modalTicketMerchant === 'Aziz' 
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-500/10'
                          : 'bg-slate-900 text-slate-400 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      🛒 Aziz
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalTicketMerchant('MG');
                        setEntryCategory('shopping');
                        if (!entryNote.trim() || entryNote === 'Achat malin Magasin Aziz 🛒' || entryNote === 'Économie Magasin Général MG 🛒' || entryNote.startsWith('Économie') || entryNote.startsWith('Achat') || entryNote.includes('مغازة')) {
                          setEntryNote('عجلة توفير مغازة عامة MG 🏬');
                        }
                      }}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[9.5px] flex items-center justify-center gap-1 border cursor-pointer transition-all ${
                        modalTicketMerchant === 'MG' 
                          ? 'bg-[#ef4444] text-white border-red-500 font-extrabold shadow-md shadow-red-500/10'
                          : 'bg-slate-900 text-slate-400 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      🏬 MG Général
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalTicketMerchant('Mamix Chokri');
                        setEntryCategory('shopping');
                        if (!entryNote.trim() || entryNote === 'Achat malin Magasin Aziz 🛒' || entryNote === 'Économie Magasin Général MG 🛒' || entryNote.startsWith('Économie') || entryNote.startsWith('Achat') || entryNote.includes('مشتريات') || entryNote.includes('مغازة')) {
                          setEntryNote('عجلة توفير مغازة Mamix Chokri 🍬');
                        }
                      }}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[9.5px] flex items-center justify-center gap-1 border cursor-pointer transition-all ${
                        modalTicketMerchant === 'Mamix Chokri' 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm shadow-emerald-500/10'
                          : 'bg-slate-900 text-slate-400 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      🍬 Mamix Chokri
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalTicketMerchant('Other');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[9.5px] flex items-center justify-center gap-1 border cursor-pointer transition-all ${
                        modalTicketMerchant === 'Other' 
                          ? 'bg-slate-800 text-slate-200 border-slate-750 font-extrabold'
                          : 'bg-slate-900 text-slate-450 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      ❌ لا يوجد
                    </button>
                  </div>

                  {modalTicketImage && (
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-xl border border-slate-800 mt-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={modalTicketImage} 
                          className="w-12 h-12 object-cover rounded-lg border border-slate-705" 
                          alt="Ticket pré-visualisation"
                        />
                        <div className="leading-tight">
                          <span className="text-[10px] font-bold text-slate-200 block">تم إرفاق صورة التيكيت 📸</span>
                          <span className="text-[8px] text-slate-405 italic">Prêt à être enregistré</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalTicketImage(null)}
                        className="p-1 px-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[9px] rounded-lg cursor-pointer"
                      >
                        حذف 🗑
                      </button>
                    </div>
                  )}
                </div>

                {/* 📦 NEW Collapsible / Interactive Section for Product Details (اسم المنتج وصورته والسعر) */}
                <div className="space-y-2.5 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-850/80">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-800/40">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider flex items-center gap-1">
                      <span>📦 تفاصيل المادة أو المنتج • Détails Produit</span>
                    </span>
                    <span className="text-[8.5px] text-slate-450 bg-slate-950 px-2 py-0.5 rounded-md">جديد ✨</span>
                  </div>

                  <div className="space-y-2">
                    {/* A. Product Name */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                        <span>إسم المنتج / Nom de la Marchandise</span>
                        <span className="text-[8px] text-slate-500">(اختياري)</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="مثال: ياغورت، باكو حليب، شوكولاتة..."
                        value={entryProductName}
                        onChange={(e) => setEntryProductName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none placeholder-slate-700 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* B. Product Price */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                          <span>سعر المادة (DT)</span>
                          <span className="text-[8px] text-slate-500">(Prix)</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="0.000"
                          value={entryProductPrice}
                          onChange={(e) => setEntryProductPrice(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-amber-400 font-black text-xs focus:outline-none placeholder-slate-805"
                        />
                      </div>

                      {/* C. Product Camera Upload Photo */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          صورة السلعة / Photo
                        </label>
                        <button
                          type="button"
                          onClick={() => productFileInputRef.current?.click()}
                          className={`w-full py-2 rounded-xl flex items-center justify-center gap-1 border transition-all cursor-pointer text-[10px] font-bold ${
                            entryProductPhoto 
                              ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5' 
                              : 'text-slate-400 border-slate-800 hover:border-slate-700 bg-slate-950/40'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{entryProductPhoto ? 'تم تصوير السلعة' : 'التقط صورة المادة'}</span>
                        </button>
                        <input 
                          ref={productFileInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onloadend = () => setEntryProductPhoto(r.result as string);
                              r.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* D. Inline Product Photo presentation */}
                    {entryProductPhoto && (
                      <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded-xl border border-slate-850 mt-1">
                        <div className="flex items-center gap-2">
                          <img 
                            src={entryProductPhoto} 
                            className="w-10 h-10 object-cover rounded-lg border border-slate-800"
                            alt="Produit miniature" 
                          />
                          <span className="text-[9px] font-semibold text-slate-400">صورة مصغرة للسلعة المصاحبة</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEntryProductPhoto(null)}
                          className="p-1 px-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[8.5px] font-black rounded-lg cursor-pointer"
                        >
                          إلغاء ❌
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Free memo form note */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Description / الإسم أو التفاصيل *
                  </label>
                  <input 
                    type="text" 
                    placeholder={`Ex: ${CATEGORIES[entryCategory].suggestedAction}`}
                    value={entryNote}
                    onChange={(e) => setEntryNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-200 text-xs focus:outline-none placeholder-slate-600 font-semibold"
                  />
                </div>

                {/* Register Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddSavings()}
                  className="w-full py-4 bg-gradient-to-r from-red-600 via-amber-500 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer uppercase tracking-wider"
                >
                  <Check className="w-4 h-4 font-black" /> تسجيل في الحصالة • Enregistrer !
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 2: DEFINE GOAL DIALOG */}
        <AnimatePresence>
          {showGoalModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-end justify-center"
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 24, stiffness: 220 }}
                className="w-full bg-slate-900 border-t border-slate-800 rounded-t-[32px] p-5.5 space-y-4 pb-8 max-h-[90%] overflow-y-auto"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <div>
                      <h3 className="text-xs font-black text-slate-200">مشروع إدخار جديد • Nouveau Projet</h3>
                      <span className="text-[9px] text-slate-450 block uppercase">Fixer un défi d'objectif concret</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowGoalModal(false)}
                    className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleUpdateGoal} className="space-y-4">
                  {/* Title of goal */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Titre de l'objectif (Ex: Achat smartphone, Permis, Fêtes, Cadeaux)
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Épargne Voyage ou achat d'un nouvel ordinateur"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-805 focus:border-emerald-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none placeholder-slate-600 text-xs"
                    />
                  </div>

                  {/* Target Amount */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Montant de la Cible (Tunisian Dinars TND)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.100"
                        required
                        placeholder="Ex: 350.000"
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-805 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-100 font-extrabold focus:outline-none tracking-tight font-mono text-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">
                        DT
                      </span>
                    </div>
                  </div>

                  {/* Date Limit */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Date Limite de réussite
                    </label>
                    <input 
                      type="date"
                      required
                      value={goalDeadline}
                      onChange={(e) => setGoalDeadline(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-805 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3.5 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer uppercase tracking-wider"
                    >
                      <Check className="w-4 h-4 font-black" /> تحديث الـهدف • Enregistrer
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 3: REMINDER MANAGEMENT PANEL */}
        <AnimatePresence>
          {showReminderModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-end justify-center"
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 24, stiffness: 220 }}
                className="w-full bg-slate-900 border-t border-slate-800 rounded-t-[32px] p-5.5 space-y-4 pb-8 max-h-[92%] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔔</span>
                    <div>
                      <h3 className="text-xs font-black text-slate-200">Gérer mes Rappels • ضبط التنبيهات</h3>
                      <span className="text-[9px] text-slate-400 uppercase block">Recevoir un bip à heures fixes</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowReminderModal(false)}
                    className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* HTML System Notification Request Card */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-200 block">Notifications Système</span>
                    <p className="text-[9px] text-slate-400 leading-snug">Recevez des alertes directement sur votre bureau ou mobile.</p>
                  </div>
                  {userNotificationPermission === 'granted' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-2 py-1 rounded border border-emerald-500/20">Actif ✅</span>
                      <button 
                        type="button"
                        onClick={playBeepNotification}
                        className="p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
                        title="Tester le son"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={requestNotificationPermission}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 hover:brightness-110 rounded-xl text-[10px] font-black cursor-pointer"
                    >
                      Autoriser
                    </button>
                  )}
                </div>

                {/* Reminders list block */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vos rappels programmés</h4>
                  
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {reminders.map((rem) => {
                      return (
                        <div 
                          key={rem.id} 
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            rem.isEnabled 
                              ? 'bg-slate-950/60 border-slate-800 text-slate-100' 
                              : 'bg-slate-900/30 border-slate-900 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Clock className={`w-3.5 h-3.5 text-slate-400 ${rem.isEnabled && 'text-amber-400 animate-pulse'}`} />
                            <div className="min-w-0">
                              <span className="text-xs font-black block truncate">{rem.label}</span>
                              <span className="text-[9.5px] text-slate-400 block font-mono">
                                {rem.time} • {rem.frequency === 'daily' ? 'Chaque Jour' : 'Dimanche (Hebdo)'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Simulator Tester (Excellent for iframe check!) */}
                            <button
                              type="button"
                              onClick={() => handleSimulateReminder(rem)}
                              className="px-2 py-1 bg-amber-500/15 hover:bg-amber-500/35 text-amber-400 text-[9px] font-black rounded uppercase border border-amber-500/10 cursor-pointer"
                              title="Déclencher instantanément"
                            >
                              Tester
                            </button>

                            {/* Toggle Enable switch */}
                            <button 
                              type="button"
                              onClick={() => handleToggleReminder(rem.id)}
                              className={`px-2 py-1 rounded text-[9px] font-extrabold cursor-pointer ${
                                rem.isEnabled 
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                  : 'bg-slate-850 text-slate-500'
                              }`}
                            >
                              {rem.isEnabled ? 'Actif' : 'Désactivé'}
                            </button>

                            {/* Delete */}
                            <button 
                              type="button"
                              onClick={() => handleDeleteReminder(rem.id)}
                              className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {reminders.length === 0 && (
                      <div className="text-center py-6 text-xs italic text-slate-500 bg-slate-950/20 rounded-xl border border-dashed border-slate-800">
                        Aucun rappel. Créez-en un ci-dessous !
                      </div>
                    )}
                  </div>
                </div>

                {/* Form to append a Reminder */}
                <form onSubmit={handleAddReminder} className="space-y-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-850">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block leading-none">Ajouter un nouveau rappel</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {/* Recall visée */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 uppercase font-bold">Intitulé du Rappel</label>
                      <input 
                        type="text"
                        required
                        placeholder="Ex: Épargne Express"
                        value={reminderLabel}
                        onChange={(e) => setReminderLabel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Timing */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 uppercase font-bold">Heure d'alerte (24H)</label>
                      <input 
                        type="time"
                        required
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Frequency selector buttons */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 uppercase font-bold block">Récurrence</label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setReminderFrequency('daily')}
                          className={`flex-1 py-1 px-2 rounded font-bold text-[10px] border transition cursor-pointer ${
                            reminderFrequency === 'daily'
                              ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Chaque jour
                        </button>
                        <button
                          type="button"
                          onClick={() => setReminderFrequency('weekly')}
                          className={`flex-1 py-1 px-2 rounded font-bold text-[10px] border transition cursor-pointer ${
                            reminderFrequency === 'weekly'
                              ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Dimanche (Hebdo)
                        </button>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-red-600 to-amber-500 text-slate-950 text-xs font-black rounded-lg transition uppercase cursor-pointer"
                      >
                        + Activer
                      </button>
                    </div>
                  </div>
                </form>

                <p className="text-[9px] text-slate-500 text-center leading-snug">
                  💡 Les alarmes de poche s'activent de manière autonome en arrière-plan pendant vos sessions pour garantir des finances rigoureuses.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 4: INTERACTIVE TRIGGERED ALARM PROMPT */}
        <AnimatePresence>
          {showTriggeredPrompt && triggeredReminder && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4.5"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-[32px] p-5.5 space-y-4 shadow-2xl relative overflow-hidden"
              >
                {/* Visual red/amber warning strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>

                {/* Alarm Header */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-amber-500/20 border border-amber-500/30 text-amber-500 rounded-2xl flex items-center justify-center text-xl animate-bounce">
                    🔔
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white leading-tight">Macha2Allah : Rappel Actif</h3>
                    <span className="text-[10px] uppercase text-amber-400 font-extrabold tracking-wider font-mono">
                      {triggeredReminder.label} ({triggeredReminder.time})
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-850 space-y-1 text-center">
                  <p className="text-[10.5px] text-slate-200 font-bold arabic text-right leading-none">
                    دِينَار عَلَى دِينَار يْنَحِّي الغَصْرَة 🪙
                  </p>
                  <p className="text-[9.5px] text-slate-300 italic block mt-1">
                    « Dinar après dinar, l'épargne éloigne le besoin. »
                  </p>
                  <p className="text-[9px] text-slate-500 leading-snug">
                    Validez ce rappel en indiquant vos économies de poche ou dépenses résistées !
                  </p>
                </div>

                {/* Keypad entry container specifically inside trigger dialog */}
                <div className="space-y-3">
                  
                  {/* Amount indicator field */}
                  <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-850">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block leading-none">
                      Millimes ou Dinars (DT) de l'épargne
                    </span>
                    <div className="flex items-baseline justify-between pt-0.5">
                      <span className="text-xl font-black text-amber-400 font-mono tracking-tight">
                        {triggeredAmount || '0'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">DT</span>
                    </div>
                  </div>

                  {/* Little helper keys */}
                  <div className="flex gap-1 overflow-x-auto pb-0.5 justify-center">
                    <button
                      type="button"
                      onClick={() => appendTriggerKeypadAmount(0.500)}
                      className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] font-extrabold rounded-lg whitespace-nowrap text-slate-350 cursor-pointer"
                    >
                      +500 M 🥯
                    </button>
                    <button
                      type="button"
                      onClick={() => appendTriggerKeypadAmount(1.550)}
                      className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] font-extrabold rounded-lg whitespace-nowrap text-slate-350 cursor-pointer"
                    >
                      +1.550 DT ☕
                    </button>
                    <button
                      type="button"
                      onClick={() => appendTriggerKeypadAmount(5.000)}
                      className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] font-extrabold rounded-lg whitespace-nowrap text-slate-350 cursor-pointer"
                    >
                      +5.000 DT 🌯
                    </button>
                  </div>

                  {/* Trigger sub keypad keys */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-2 rounded-xl border border-slate-900">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ',', 'C'].map((key) => {
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleTriggerKeypadPress(key)}
                          className={`py-1.5 rounded-lg text-center text-xs font-black transition cursor-pointer select-none active:bg-slate-800 ${
                            key === 'C' 
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                              : key === ',' 
                                ? 'bg-slate-900 text-slate-400' 
                                : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
                          }`}
                        >
                          {key}
                        </button>
                      );
                    })}
                  </div>

                  {/* Rapid category selectors */}
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-extrabold text-slate-450 uppercase block tracking-wider leading-none">Origine de l'Épargne</span>
                    <div className="flex gap-1 overflow-x-auto pb-0.5 font-sans">
                      {Object.keys(CATEGORIES).slice(0, 5).map(key => {
                        const cat = CATEGORIES[key as CategoryKey];
                        const isSelect = triggeredCategory === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setTriggeredCategory(key as CategoryKey)}
                            className={`p-1.5 px-2.5 rounded-xl border flex items-center gap-1.5 cursor-pointer select-none shrink-0 text-[10px] font-bold transition-all ${
                              isSelect 
                                ? 'border-amber-400 bg-amber-500/10 text-amber-400 scale-102' 
                                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span>{cat.emoji}</span>
                            <span>{cat.label.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Note memo */}
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-bold text-slate-450 uppercase block tracking-wider leading-none">Note explicative</span>
                    <input 
                      type="text"
                      placeholder={`Mémo : ${CATEGORIES[triggeredCategory].suggestedAction}`}
                      value={triggeredNote}
                      onChange={(e) => setTriggeredNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 text-[11px] focus:outline-none focus:border-amber-400 placeholder-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Form CTA control triggers */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAddSavingsFromTrigger()}
                    className="w-full py-3.5 bg-gradient-to-r from-red-600 via-amber-500 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 tracking-widest uppercase cursor-pointer"
                  >
                    <Check className="w-4 h-4 font-black" /> Enregistrer mes gains • تسجيل
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTriggeredPrompt(false);
                      setTriggeredReminder(null);
                    }}
                    className="w-full py-2 bg-slate-900 border border-slate-850 hover:bg-slate-850 rounded-xl text-slate-400 font-bold text-[11px] text-center transition cursor-pointer"
                  >
                    Rappeler plus tard
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
