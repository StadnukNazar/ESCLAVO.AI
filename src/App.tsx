/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CheckCircle2, XCircle, Code2, Sparkles, Send, History, Trash2, 
  PlusCircle, Check, BrainCircuit, ChevronDown, Trophy, 
  Settings, Languages, Globe, Zap, Target, Library, Flag, Shield,
  Search, Binary, Layout, X,
  PanelLeft, PanelRight, Maximize2, Copy, Clock, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import DoodleJumpGame from './components/DoodleJumpGame';
import TerminalInvadersGame from './components/TerminalInvadersGame';
import CodeMemoryGame from './components/CodeMemoryGame';

// Types
type Language = 'Ukrainian' | 'English' | 'German' | 'French' | 'Spanish' | 'Polish';

const LANGUAGE_CONFIG: Record<Language, { flag: string, code: string, label: string }> = {
  'Ukrainian': { flag: '🇺🇦', code: 'UA', label: 'Українська' },
  'English': { flag: '🇺🇸', code: 'EN', label: 'English' },
  'German': { flag: '🇩🇪', code: 'DE', label: 'Deutsch' },
  'French': { flag: '🇫🇷', code: 'FR', label: 'Français' },
  'Spanish': { flag: '🇪🇸', code: 'ES', label: 'Español' },
  'Polish': { flag: '🇵🇱', code: 'PL', label: 'Polski' }
};

interface Achievement {
  id: string;
  title: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

const TOPIC_TRANSLATIONS: Record<string, Record<string, string>> = {
  Ukrainian: {
    "Variables & Scope": "Змінні та Область Видимості",
    "Data Types": "Типи Даних",
    "Operators": "Оператори",
    "Strict Mode": "Суворий Режим",
    "Loops": "Цикли",
    "Functions": "Функції",
    "Arrow Functions": "Стрілкові Функції",
    "Closures": "Замикання",
    "Call Stack": "Стек Викликів",
    "Objects": "Об'єкти",
    "Arrays": "Масиви",
    "Array Methods": "Методи Масивів",
    "Destructuring": "Деструктуризація",
    "Spread/Rest": "Spread/Rest",
    "Recursion": "Рекурсія",
    "Promises": "Проміси",
    "Async/Await": "Async/Await",
    "Fetch API": "Fetch API",
    "DOM Manipulation": "Маніпуляції з DOM",
    "Events": "Події",
    "Classes": "Класи",
    "Prototypes": "Прототипи",
    "Inheritance": "Успадкування",
    "Modules": "Модулі",
    "Error Handling": "Обробка Помилок",
    "Regex": "Регулярні Вирази",
    "Storage API": "Storage API",
    "Timers": "Таймери",
    "JSON": "JSON",
    "Map & Set": "Map & Set",
    "Proxy": "Проксі",
    "Reflect": "Рефлексія",
    "WeakMap": "WeakMap",
    "BigInt": "BigInt",
    "Symbol": "Символи",
    "Web Workers": "Web Workers",
    "Canvas API": "Canvas API",
    "Audio API": "Audio API",
    "Intl API": "Intl API",
    "Performance": "Продуктивність",
    "Memory Management": "Управління Пам'яттю",
    "Clean Code": "Чистий Код",
    "Design Patterns": "Шаблони Проектування",
    "Solid Principles": "Принципи SOLID",
    "Unit Testing": "Юніт-Тестування"
  },
  Polish: {
    "Variables & Scope": "Zmienne i Zakres",
    "Data Types": "Typy Danych",
    "Operators": "Operatory",
    "Strict Mode": "Tryb Ścisły",
    "Loops": "Pętle",
    "Functions": "Funkcje",
    "Arrow Functions": "Funkcje Strzałkowe",
    "Closures": "Domknięcia",
    "Call Stack": "Stos Wywołań",
    "Objects": "Obiekty",
    "Arrays": "Tablice",
    "Array Methods": "Metody Tablic",
    "Destructuring": "Destrukturyzacja",
    "Spread/Rest": "Spread/Rest",
    "Recursion": "Rekurencja",
    "Promises": "Obietnice",
    "Async/Await": "Async/Await",
    "Fetch API": "Fetch API",
    "DOM Manipulation": "Manipulacja DOM",
    "Events": "Zdarzenia",
    "Classes": "Klasy",
    "Prototypes": "Prototypy",
    "Inheritance": "Dziedziczenie",
    "Modules": "Moduły",
    "Error Handling": "Obsługa Błędów",
    "Regex": "Wyrażenia Regularne",
    "Storage API": "Storage API",
    "Timers": "Timery",
    "JSON": "JSON",
    "Map & Set": "Map & Set",
    "Proxy": "Proxy",
    "Reflect": "Reflect",
    "WeakMap": "WeakMap",
    "BigInt": "BigInt",
    "Symbol": "Symbole",
    "Web Workers": "Web Workers",
    "Canvas API": "Canvas API",
    "Audio API": "Audio API",
    "Intl API": "Intl API",
    "Performance": "Wydajność",
    "Memory Management": "Zarządzanie Pamięcią",
    "Clean Code": "Czysty Kod",
    "Design Patterns": "Wzorce Projektowe",
    "Solid Principles": "Zasady SOLID",
    "Unit Testing": "Testy Jednostkowe"
  },
  Spanish: {
    "Variables & Scope": "Variables y Ámbito",
    "Data Types": "Tipos de Datos",
    "Operators": "Operadores",
    "Strict Mode": "Modo Estricto",
    "Loops": "Bucles",
    "Functions": "Funciones",
    "Arrow Functions": "Funciones de Flecha",
    "Closures": "Clausuras",
    "Call Stack": "Pila de Llamadas",
    "Objects": "Objetos",
    "Arrays": "Arreglos",
    "Array Methods": "Métodos de Arreglos",
    "Destructuring": "Desestructuración",
    "Spread/Rest": "Spread/Rest",
    "Recursion": "Recursividad",
    "Promises": "Promesas",
    "Async/Await": "Async/Await",
    "Fetch API": "Fetch API",
    "DOM Manipulation": "Manipulación del DOM",
    "Events": "Eventos",
    "Classes": "Clases",
    "Prototypes": "Prototipos",
    "Inheritance": "Herencia",
    "Modules": "Módulos",
    "Error Handling": "Manejo de Errores",
    "Regex": "Regex",
    "Storage API": "Storage API",
    "Timers": "Temporizadores",
    "JSON": "JSON",
    "Map & Set": "Map & Set",
    "Proxy": "Proxy",
    "Reflect": "Reflect",
    "WeakMap": "WeakMap",
    "BigInt": "BigInt",
    "Symbol": "Símbolos",
    "Web Workers": "Web Workers",
    "Canvas API": "Canvas API",
    "Audio API": "Audio API",
    "Intl API": "Intl API",
    "Performance": "Rendimiento",
    "Memory Management": "Gestión de Memoria",
    "Clean Code": "Código Limpio",
    "Design Patterns": "Patrones de Diseño",
    "Solid Principles": "Principios SOLID",
    "Unit Testing": "Pruebas Unitarias"
  },
  French: {
    "Variables & Scope": "Variables et Portée",
    "Data Types": "Types de Données",
    "Operators": "Opérateurs",
    "Strict Mode": "Mode Strict",
    "Loops": "Boucles",
    "Functions": "Fonctions",
    "Arrow Functions": "Fonctions Fléchées",
    "Closures": "Fermetures",
    "Call Stack": "Pile d'Appels",
    "Objects": "Objets",
    "Arrays": "Tableaux",
    "Array Methods": "Méthodes de Tableaux",
    "Destructuring": "Déstructuration",
    "Spread/Rest": "Spread/Rest",
    "Recursion": "Récursivité",
    "Promises": "Promesses",
    "Async/Await": "Async/Await",
    "Fetch API": "Fetch API",
    "DOM Manipulation": "Manipulation du DOM",
    "Events": "Événements",
    "Classes": "Classes",
    "Prototypes": "Prototypes",
    "Inheritance": "Héritage",
    "Modules": "Modules",
    "Error Handling": "Gestion des Erreures",
    "Regex": "Regex",
    "Storage API": "Storage API",
    "Timers": "Minuteurs",
    "JSON": "JSON",
    "Map & Set": "Map & Set",
    "Proxy": "Proxy",
    "Reflect": "Reflect",
    "WeakMap": "WeakMap",
    "BigInt": "BigInt",
    "Symbol": "Symboles",
    "Web Workers": "Web Workers",
    "Canvas API": "Canvas API",
    "Audio API": "Audio API",
    "Intl API": "Intl API",
    "Performance": "Performance",
    "Memory Management": "Gestion de la Mémoire",
    "Clean Code": "Clean Code",
    "Design Patterns": "Patrons de Conception",
    "Solid Principles": "Principes SOLID",
    "Unit Testing": "Tests Unitaires"
  },
  German: {
    "Variables & Scope": "Variablen & Gültigkeitsbereich",
    "Data Types": "Datentypen",
    "Operators": "Operatoren",
    "Strict Mode": "Strict Mode",
    "Loops": "Schleifen",
    "Functions": "Funktionen",
    "Arrow Functions": "Pfeilfunktionen",
    "Closures": "Closures",
    "Call Stack": "Aufrufstapel",
    "Objects": "Objekte",
    "Arrays": "Arrays",
    "Array Methods": "Array-Methoden",
    "Destructuring": "Destrukturierung",
    "Spread/Rest": "Spread/Rest",
    "Recursion": "Rekursion",
    "Promises": "Promises",
    "Async/Await": "Async/Await",
    "Fetch API": "Fetch API",
    "DOM Manipulation": "DOM-Manipulation",
    "Events": "Events",
    "Classes": "Klassen",
    "Prototypes": "Prototypen",
    "Inheritance": "Vererbung",
    "Modules": "Module",
    "Error Handling": "Fehlerbehandlung",
    "Regex": "Regex",
    "Storage API": "Storage API",
    "Timers": "Timer",
    "JSON": "JSON",
    "Map & Set": "Map & Set",
    "Proxy": "Proxy",
    "Reflect": "Reflect",
    "WeakMap": "WeakMap",
    "BigInt": "BigInt",
    "Symbol": "Symbole",
    "Web Workers": "Web Workers",
    "Canvas API": "Canvas API",
    "Audio API": "Audio API",
    "Intl API": "Intl API",
    "Performance": "Leistung",
    "Memory Management": "Speicherverwaltung",
    "Clean Code": "Sauberer Code",
    "Design Patterns": "Entwurfsmuster",
    "Solid Principles": "SOLID-Prinzipien",
    "Unit Testing": "Unit Testing"
  },
  English: {
    "Variables & Scope": "Variables & Scope",
    "Data Types": "Data Types",
    "Operators": "Operators",
    "Strict Mode": "Strict Mode",
    "Loops": "Loops",
    "Functions": "Functions",
    "Arrow Functions": "Arrow Functions",
    "Closures": "Closures",
    "Call Stack": "Call Stack",
    "Objects": "Objects",
    "Arrays": "Arrays",
    "Array Methods": "Array Methods",
    "Destructuring": "Destructuring",
    "Spread/Rest": "Spread/Rest",
    "Recursion": "Recursion",
    "Promises": "Promises",
    "Async/Await": "Async/Await",
    "Fetch API": "Fetch API",
    "DOM Manipulation": "DOM Manipulation",
    "Events": "Events",
    "Classes": "Classes",
    "Prototypes": "Prototypes",
    "Inheritance": "Inheritance",
    "Modules": "Modules",
    "Error Handling": "Error Handling",
    "Regex": "Regex",
    "Storage API": "Storage API",
    "Timers": "Timers",
    "JSON": "JSON",
    "Map & Set": "Map & Set",
    "Proxy": "Proxy",
    "Reflect": "Reflect",
    "WeakMap": "WeakMap",
    "BigInt": "BigInt",
    "Symbol": "Symbol",
    "Web Workers": "Web Workers",
    "Canvas API": "Canvas API",
    "Audio API": "Audio API",
    "Intl API": "Intl API",
    "Performance": "Performance",
    "Memory Management": "Memory Management",
    "Clean Code": "Clean Code",
    "Design Patterns": "Design Patterns",
    "Solid Principles": "Solid Principles",
    "Unit Testing": "Unit Testing"
  }
};

interface TourStep {
  target: string;
  title: string;
  description: string;
}

const TOUR_STEPS: Record<Language, TourStep[]> = {
  'Ukrainian': [
    { target: 'sidebar-panel', title: '📚 Твоя Бібліотека Знань', description: 'Тут зберігаються всі твої уроки. Вивчай нові теми, щоб відкривати секретні рівні та прокачувати свій ранг.' },
    { target: 'practice-panel', title: '🧪 Навчальна Лабораторія', description: 'Тут починається справжня магія. Виконуй місії, пиши реальний код та заробляй XP для свого персонажа.' },
    { target: 'chat-panel', title: '🤖 Твій Нейро-Наставник', description: 'Запитуй про що завгодно! Бот пояснить найскладніші концепції людською мовою та допоможе виправити баги.' },
    { target: 'stats-panel', title: '🏆 Твій Прогрес', description: 'Слідкуй за своєю статистикою, стріками та досягненнями. Стань легендою світу JavaScript!' }
  ],
  'English': [
    { target: 'sidebar-panel', title: 'Pick Lessons', description: 'Over 100 topics from basics to advanced. Complete them to unlock new levels.' },
    { target: 'practice-panel', title: 'Complete Missions', description: 'Get tasks from the bot. Correct answers grant XP and real practice.' },
    { target: 'chat-panel', title: 'Chat with AI', description: 'Ask anything! The bot will explain errors or help with code logic.' },
    { target: 'stats-panel', title: 'Track Progress', description: 'Check your level, XP, and streaks. Become a true JS master!' }
  ],
  'German': [
    { target: 'sidebar-panel', title: 'Lektionen wählen', description: 'Über 100 Themen. Schließe sie ab, um neue Level freizuschalten.' },
    { target: 'practice-panel', title: 'Missionen erfüllen', description: 'Erhalte Aufgaben. Richtige Antworten bringen XP und Praxis.' },
    { target: 'chat-panel', title: 'KI-Chat', description: 'Frag alles! Der Bot erklärt Fehler oder hilft bei Codelogik.' },
    { target: 'stats-panel', title: 'Fortschritt', description: 'Dein Level und deine XP auf einen Blick.' }
  ],
  'French': [
    { target: 'sidebar-panel', title: 'Choisir des leçons', description: 'Plus de 100 thèmes. Complétez-les pour débloquer des niveaux.' },
    { target: 'practice-panel', title: 'Missions', description: 'Répondez aux tâches pour gagner de l\'XP.' },
    { target: 'chat-panel', title: 'Chat IA', description: 'Posez vos questions sur le code ici.' },
    { target: 'stats-panel', title: 'Statistiques', description: 'Suivez votre progression et vos niveaux.' }
  ],
  'Spanish': [
    { target: 'sidebar-panel', title: 'Elegir lecciones', description: 'Más de 100 temas. Complétalos para desbloquear niveles.' },
    { target: 'practice-panel', title: 'Misiones', description: 'Realiza tareas para ganar XP.' },
    { target: 'chat-panel', title: 'Chat IA', description: 'Pregunta cualquier cosa sobre el código.' },
    { target: 'stats-panel', title: 'Progreso', description: 'Sigue tu nivel y experiencia.' }
  ],
  'Polish': [
    { target: 'sidebar-panel', title: 'Wybierz lekcje', description: 'Ponad 100 tematów. Ukończ je, aby odblokować poziomy.' },
    { target: 'practice-panel', title: 'Misje', description: 'Wykonuj zadania, aby zdobywać XP.' },
    { target: 'chat-panel', title: 'Chat AI', description: 'Pytaj o cokolwiek związanego z kodem.' },
    { target: 'stats-panel', title: 'Postępy', description: 'Śledź swój poziom i doświadczenie.' }
  ]
};

const UI_TEXT = {
  Ukrainian: {
    start: "Почати розмову",
    missions: "Місії",
    history: "Історія",
    newChat: "Новий чат",
    settings: "Налаштування",
    active: "Активні",
    completed: "Завершені",
    send: "Надіслати",
    level: "Рівень",
    rank: "Ранг",
    novice: "Новачок",
    coder: "Кодер",
    dev: "Розробник",
    architect: "Архітектор",
    newTask: "Нове завдання",
    easy: "Легко",
    normal: "Нормально",
    hard: "Хардкор",
    placeholder: "Запитай щось про JavaScript...",
    connected: "Поєднано з ESCLAVO.AI",
    achievements: "Досягнення",
    unlocked: "МІСІЯ РОЗБЛОКОВАНА",
    ready: "Готовий закріпити тему?",
    accept: "ПРИЙНЯТИ ВИКЛИК",
    course: "Курс",
    lesson: "Урок",
    locked: "Заблоковано",
    progress: "Прогрес",
    finishCourse: "Завершити курс",
    achievementHint: "Розблоковується в процесі",
    noMissions: "Активних місій поки немає",
    welcome: "Твій персональний майстер JavaScript. Давай створимо щось неймовірне.",
    hello: "Привіт! Давай почнемо вивчати JavaScript.",
    protocol: "Протокол Навчання Альфа",
    systemStatus: "СТАТУС СИСТЕМИ",
    optimal: "ОПТИМАЛЬНИЙ",
    build: "ЗБІРКА",
    explainLesson: "Поясни мені тему:",
    provideTask: "Дай мені практичне завдання рівня",
    explainError: "Поясни детальніше, чому моя відповідь невірна для завдання:",
    success: "ЧУДОВО!",
    error: "ПОМИЛКА! СПРОБУЙ ЩЕ",
    check: "ПЕРЕВІРИТИ",
    levelUp: "Вітаємо! Рівень розблоковано!",
    levelUpTitle: "НОВИЙ РІВЕНЬ!",
    advancedUnlocked: "Ви розблокували доступ до складніших завдань!",
    answerPlaceholder: "Ваша відповідь...",
    codePlaceholder: "// Напишіть рішення...",
    explainFail: "Пояснити помилку",
    errorLabel: "Помилка",
    noActiveMissions: "Активних місій поки немає",
    dailyChallenge: "ЩОДЕННИЙ ВИКЛИК",
    dailyActivity: "ЩОДЕННА АКТИВНІСТЬ",
    noCompletedTasks: "Завершених завдань поки немає",
    practiceLab: "ПРАКТИКА.ЛАБ",
    codeChallenge: "#КОД_ВИКЛИК",
    advancedMastery: "Просунута Майстерність",
    neuralPath: "Нейронний шлях навчання",
    memoryGame: "Тренування Пам'яті",
    sidebarToggle: "Перемикання бічної панелі",
    statsToggle: "Перемикання панелі статистики",
    fullscreen: "Повноекранний режим",
    language: "Вибір мови",
    deleteChat: "Видалити чат",
    achievementTitles: {
      first_correct: 'Перша іскра',
      first_error: 'Найкращий вчитель',
      streak_10: 'Режим Бога',
      scholar_20: 'Академік',
      level_10: 'Ветеран',
      level_25: 'Елітний кодер',
      level_50: 'Напівбог',
      course_start: 'Шлях починається',
      course_half: 'Середина майстерності',
      course_finish: 'Верховний майстер',
      xp_10000: 'XP Мільйонер',
      fast_learner: 'Швидкий розум',
      clean_coder: 'Чистий кодер',
      master_architect: 'Майстер-архітектор',
      help_seeker: 'Допитливий розум',
    }
  },
  English: {
    start: "Start Journey",
    missions: "Missions",
    history: "History",
    newChat: "New Chat",
    settings: "Settings",
    active: "Active",
    completed: "Completed",
    send: "Send",
    level: "Level",
    rank: "Rank",
    novice: "Novice",
    coder: "Coder",
    dev: "Developer",
    architect: "Architect",
    newTask: "New Task",
    easy: "Easy",
    normal: "Normal",
    hard: "Hardcore",
    placeholder: "Ask something about JavaScript...",
    connected: "Connected to ESCLAVO.AI",
    achievements: "Achievements",
    unlocked: "MISSION UNLOCKED",
    ready: "Ready for a challenge?",
    accept: "ACCEPT CHALLENGE",
    course: "Course",
    lesson: "Lesson",
    locked: "Locked",
    progress: "Progress",
    finishCourse: "Finish Course",
    achievementHint: "Unlocked by progressing",
    noMissions: "No active missions yet",
    welcome: "Your personal JavaScript master. Let's create something incredible.",
    hello: "Hello! Let's start learning JavaScript.",
    protocol: "Learning Protocol Alpha",
    systemStatus: "SYSTEM STATUS",
    optimal: "OPTIMAL",
    build: "BUILD",
    explainLesson: "Explain this topic to me:",
    provideTask: "Give me a practical task of level",
    explainError: "Explain in detail why my answer is incorrect for the task:",
    success: "GREAT!",
    error: "ERROR! TRY AGAIN",
    check: "CHECK",
    levelUp: "Congratulations! Level unlocked!",
    levelUpTitle: "NEW LEVEL!",
    advancedUnlocked: "You've unlocked access to more complex tasks!",
    answerPlaceholder: "Your answer...",
    codePlaceholder: "// Write solution...",
    explainFail: "Explain error",
    errorLabel: "Error",
    noActiveMissions: "No active missions yet",
    dailyChallenge: "DAILY CHALLENGE",
    dailyActivity: "DAILY ACTIVITY",
    noCompletedTasks: "No completed tasks yet",
    practiceLab: "PRACTICE.LAB",
    codeChallenge: "#CODE_CHALLENGE",
    advancedMastery: "Advanced Mastery",
    neuralPath: "Neural Learning Path",
    memoryGame: "Memory Training",
    sidebarToggle: "Toggle Sidebar",
    statsToggle: "Toggle Stats",
    fullscreen: "Fullscreen",
    language: "Select Language",
    deleteChat: "Delete Chat",
    achievementTitles: {
      first_correct: 'First Spark',
      first_error: 'Greatest Teacher',
      streak_10: 'God Mode',
      scholar_20: 'Academic',
      level_10: 'Veteran',
      level_25: 'Elite Coder',
      level_50: 'Demi-God',
      course_start: 'The Path Begins',
      course_half: 'Midpoint Mastery',
      course_finish: 'Supreme Master',
      xp_10000: 'XP Millionaire',
      fast_learner: 'Quick Wit',
      clean_coder: 'Clean Coder',
      master_architect: 'Master Architect',
      help_seeker: 'Inquisitive Mind',
    }
  },
  French: {
    start: "Démarrer",
    missions: "Missions",
    history: "Histoire",
    newChat: "Nouveau Chat",
    settings: "Paramètres",
    active: "Actif",
    completed: "Terminé",
    send: "Envoyer",
    level: "Niveau",
    rank: "Rang",
    novice: "Novice",
    coder: "Codeur",
    dev: "Développeur",
    architect: "Architecte",
    newTask: "Nouvelle Tâche",
    easy: "Facile",
    normal: "Normal",
    hard: "Difficile",
    placeholder: "Posez une question sur JavaScript...",
    connected: "Connecté à ESCLAVO.AI",
    achievements: "Réalisations",
    unlocked: "MISSION DÉBLOQUÉE",
    ready: "Prêt pour un défi ?",
    accept: "ACCEPTER LE DÉFI",
    course: "Cours",
    lesson: "Leçon",
    locked: "Verrouillé",
    progress: "Progrès",
    finishCourse: "Terminer le cours",
    neuralPath: "Parcours d'apprentissage neural",
    achievementHint: "Débloqué en progressant",
    noMissions: "Pas encore de missions actives",
    welcome: "Votre maître JavaScript personnel. Créons quelque chose d'incroyable.",
    hello: "Salut ! Commençons à apprendre JavaScript.",
    protocol: "Protocole d'Apprentissage Alpha",
    systemStatus: "STATUT DU SYSTÈME",
    optimal: "OPTIMAL",
    build: "VERSION",
    explainLesson: "Expliquez-moi ce sujet :",
    provideTask: "Donnez-moi une tâche pratique de niveau",
    explainError: "Expliquez en détail pourquoi ma réponse est incorrecte pour la tâche :",
    success: "EXCELLENT !",
    error: "ERREUR ! RÉESSAYEZ",
    check: "VÉRIFIER",
    levelUp: "Félicitations ! Niveau débloqué !",
    levelUpTitle: "NOUVEAU NIVEAU !",
    advancedUnlocked: "Vous avez débloqué l'accès à des tâches plus complexes !",
    answerPlaceholder: "Votre réponse...",
    codePlaceholder: "// Écrivez la solution...",
    explainFail: "Expliquer l'erreur",
    errorLabel: "Erreur",
    noActiveMissions: "Pas encore de missions actives",
    dailyChallenge: "DÉFI QUOTIDIEN",
    dailyActivity: "ACTIVITÉ QUOTIDIENNE",
    noCompletedTasks: "Pas encore de tâches terminées",
    practiceLab: "LABO.PRATIQUE",
    codeChallenge: "#DÉFI_CODE",
    advancedMastery: "Maîtrise Avancée",
    memoryGame: "Entraînement Mémoire",
    sidebarToggle: "Toggle Barre latérale",
    statsToggle: "Toggle Statistiques",
    fullscreen: "Plein écran",
    language: "Choisir la langue",
    deleteChat: "Supprimer le chat",
    achievementTitles: {
      first_correct: 'Première Étincelle',
      first_error: 'Meilleur Professeur',
      streak_10: 'Mode Dieu',
      scholar_20: 'Académique',
      level_10: 'Vétéran',
      level_25: 'Codeur d\'Élite',
      level_50: 'Demi-Dieu',
      course_start: 'Le Chemin Commence',
      course_half: 'Maîtrise Intermédiaire',
      course_finish: 'Maître Suprême',
      xp_10000: 'Millionnaire d\'XP',
      fast_learner: 'Esprit Vif',
      clean_coder: 'Codeur Propre',
      master_architect: 'Maître Architecte',
      help_seeker: 'Esprit Inquisiteur',
    }
  },
  German: {
    start: "Starten",
    missions: "Missionen",
    history: "Verlauf",
    newChat: "Neuer Chat",
    settings: "Einstellungen",
    active: "Aktiv",
    completed: "Abgeschlossen",
    send: "Senden",
    level: "Level",
    rank: "Rang",
    novice: "Anfänger",
    coder: "Coder",
    dev: "Entwickler",
    architect: "Architekt",
    newTask: "Neue Aufgabe",
    easy: "Einfach",
    normal: "Normal",
    hard: "Extrem",
    placeholder: "Frage etwas über JavaScript...",
    connected: "Verbunden mit ESCLAVO.AI",
    achievements: "Erfolge",
    unlocked: "MISSION FREIGESCHALTET",
    ready: "Bereit für eine Herausforderung?",
    accept: "HERAUSFORDERUNG ANNEHMEN",
    course: "Kurs",
    lesson: "Lektion",
    locked: "Gesperrt",
    progress: "Fortschritt",
    finishCourse: "Kurs beenden",
    achievementHint: "Freigeschaltet durch Fortschritt",
    noMissions: "Noch keine aktiven Missionen",
    welcome: "Dein persönlicher JavaScript-Meister. Lass uns etwas Unglaubliches erschaffen.",
    hello: "Hallo! Lass uns anfangen, JavaScript zu lernen.",
    protocol: "Lernprotokoll Alpha",
    systemStatus: "SYSTEMSTATUS",
    optimal: "OPTIMAL",
    build: "BUILD",
    explainLesson: "Erkläre mir dieses Thema:",
    provideTask: "Gib mir eine praktische Aufgabe der Stufe",
    explainError: "Erkläre mir im Detail, warum meine Antwort auf die Aufgabe falsch ist:",
    success: "GROSSARTIG!",
    error: "FEHLER! VERSUCH ES NOCHMAL",
    check: "PRÜFEN",
    levelUp: "Glückwunsch! Level freigeschaltet!",
    levelUpTitle: "NEUES LEVEL!",
    advancedUnlocked: "Du hast Zugang zu komplexeren Aufgaben freigeschaltet!",
    answerPlaceholder: "Deine Antwort...",
    codePlaceholder: "// Lösung schreiben...",
    explainFail: "Fehler erklären",
    errorLabel: "Fehler",
    noActiveMissions: "Noch keine aktiven Missionen",
    dailyChallenge: "TÄGLICHE HERAUSFORDERUNG",
    dailyActivity: "TÄGLICHE AKTIVITÄT",
    noCompletedTasks: "Noch keine abgeschlossenen Aufgaben",
    practiceLab: "PRAXIS.LABOR",
    codeChallenge: "#CODE_CHALLENGE",
    advancedMastery: "Fortgeschrittene Meisterschaft",
    neuralPath: "Neuraler Lernpfad",
    memoryGame: "Gedächtnistraining",
    sidebarToggle: "Seitenleiste umschalten",
    statsToggle: "Statistiken umschalten",
    fullscreen: "Vollbild",
    language: "Sprache auswählen",
    deleteChat: "Chat löschen",
    achievementTitles: {
      first_correct: 'Erster Funke',
      first_error: 'Größter Lehrer',
      streak_10: 'Gott-Modus',
      scholar_20: 'Akademiker',
      level_10: 'Veteran',
      level_25: 'Elite-Coder',
      level_50: 'Halbgott',
      course_start: 'Der Weg beginnt',
      course_half: 'Halbzeit-Meisterschaft',
      course_finish: 'Oberster Meister',
      xp_10000: 'XP-Millionär',
      fast_learner: 'Schneller Verstand',
      clean_coder: 'Sauberer Coder',
      master_architect: 'Meisterarchitekt',
      help_seeker: 'Wissbegieriger Geist',
    }
  },
  Spanish: {
    start: "Empezar",
    missions: "Misiones",
    history: "Historia",
    newChat: "Nuevo Chat",
    settings: "Ajustes",
    active: "Activo",
    completed: "Completado",
    send: "Enviar",
    level: "Nivel",
    rank: "Rango",
    novice: "Novato",
    coder: "Coder",
    dev: "Desarrollador",
    architect: "Arquitecto",
    newTask: "Nueva Tarea",
    easy: "Fácil",
    normal: "Normal",
    hard: "Difícil",
    placeholder: "Pregunta algo sobre JavaScript...",
    connected: "Conectado a ESCLAVO.AI",
    achievements: "Logros",
    unlocked: "MISIÓN DESBLOQUEADA",
    ready: "¿Listo para un desafío?",
    accept: "ACEPTAR EL DESAFÍO",
    course: "Curso",
    lesson: "Lección",
    locked: "Bloqueado",
    progress: "Progreso",
    finishCourse: "Terminar curso",
    achievementHint: "Desbloqueado al progresar",
    noMissions: "Aún no hay misiones activas",
    welcome: "Tu maestro personal de JavaScript. Creamos algo increíble.",
    hello: "¡Hola! Empecemos a aprender JavaScript.",
    protocol: "Protocolo de Aprendizaje Alfa",
    systemStatus: "ESTADO DEL SISTEMA",
    optimal: "ÓPTIMO",
    build: "COMPILACIÓN",
    explainLesson: "Explícame este tema:",
    provideTask: "Dame una tarea práctica de nivel",
    explainError: "Explícame detalladamente por qué mi respuesta es incorrecta para la tarea:",
    success: "¡EXCELENTE!",
    error: "¡ERROR! INTÉNTALO DE NUEVO",
    check: "VERIFICAR",
    levelUp: "¡Felicidades! ¡Nivel desbloqueado!",
    levelUpTitle: "¡NUEVO NIVEL!",
    advancedUnlocked: "¡Has desbloqueado el acceso a tareas más complejas!",
    answerPlaceholder: "Tu respuesta...",
    codePlaceholder: "// Escribe la solución...",
    explainFail: "Explicar error",
    errorLabel: "Error",
    noActiveMissions: "Aún no hay misiones activas",
    dailyChallenge: "DESAFÍO DIARIO",
    dailyActivity: "ACTIVIDAD DIARIA",
    noCompletedTasks: "Aún no hay tareas completadas",
    practiceLab: "LAB.PRÁCTICA",
    codeChallenge: "#DESAFÍO_CÓDIGO",
    advancedMastery: "Maestría Avanzada",
    neuralPath: "Ruta de aprendizaje neuronal",
    memoryGame: "Entrenamiento de Memoria",
    sidebarToggle: "Alternar barra lateral",
    statsToggle: "Alternar estadísticas",
    fullscreen: "Pantalla completa",
    language: "Seleccionar idioma",
    deleteChat: "Eliminar chat",
    achievementTitles: {
      first_correct: 'Primera Chispa',
      first_error: 'Mejor Maestro',
      streak_10: 'Modo Dios',
      scholar_20: 'Académico',
      level_10: 'Veterano',
      level_25: 'Codificador de Élite',
      level_50: 'Semidiós',
      course_start: 'El Camino Comienza',
      course_half: 'Maestría Intermedia',
      course_finish: 'Maestro Supremo',
      xp_10000: 'Millonario de XP',
      fast_learner: 'Ingenio Rápido',
      clean_coder: 'Programador Limpio',
      master_architect: 'Maestro Arquitecto',
      help_seeker: 'Mente Inquisitiva',
    }
  },
  Polish: {
    start: "Rozpocznij",
    missions: "Misje",
    history: "Historia",
    newChat: "Nowy Czat",
    settings: "Ustawienia",
    active: "Aktywne",
    completed: "Zakończone",
    send: "Wyślij",
    level: "Poziom",
    rank: "Ranga",
    novice: "Nowicjusz",
    coder: "Koder",
    dev: "Programista",
    architect: "Architekt",
    newTask: "Nowe zadanie",
    easy: "Łatwe",
    normal: "Normalne",
    hard: "Hardkor",
    placeholder: "Zapytaj o JavaScript...",
    connected: "Połączono z ESCLAVO.AI",
    achievements: "Osiągnięcia",
    unlocked: "MISJA ODBLOKOWANA",
    ready: "Gotowy na wyzwanie?",
    accept: "PRZYJMIJ WYZWANIE",
    course: "Kurs",
    lesson: "Lekcja",
    locked: "Zablokowane",
    progress: "Postęp",
    finishCourse: "Ukończ kurs",
    achievementHint: "Odblokowane przez postęp",
    noMissions: "Brak aktywnych misji",
    welcome: "Twój osobisty mistrz JavaScript. Stwórzmy coś niesamowitego.",
    hello: "Cześć! Zacznijmy naukę JavaScript.",
    protocol: "Protokół Nauki Alfa",
    systemStatus: "STATUS SYSTEMU",
    optimal: "OPTYMALNY",
    build: "WERSJA",
    explainLesson: "Wyjaśnij mi ten temat:",
    provideTask: "Daj mi praktyczne zadanie na poziomie",
    explainError: "Wyjaśnij szczegółowo, dlaczego moja odpowiedź jest błędna dla zadania:",
    success: "ŚWIETNIE!",
    error: "BŁĄD! SPRÓBUJ PONOWNIE",
    check: "SPRAWDŹ",
    levelUp: "Gratulacje! Poziom odblokowany!",
    levelUpTitle: "NOWY POZIOM!",
    advancedUnlocked: "Odblokowałeś dostęp do trudniejszych zadań!",
    answerPlaceholder: "Twoja odpowiedź...",
    codePlaceholder: "// Napisz rozwiązanie...",
    explainFail: "Wyjaśnij błąd",
    errorLabel: "Błąd",
    noActiveMissions: "Brak aktywnych misji",
    dailyChallenge: "CODZIENNE WYZWANIE",
    dailyActivity: "CODZIENNA AKTYWNOŚĆ",
    noCompletedTasks: "Brak ukończonych zadań",
    practiceLab: "LAB.PRAKTYKI",
    codeChallenge: "#WYZWANIE_KODU",
    advancedMastery: "Zaawansowane Mistrzostwo",
    neuralPath: "Neuronowa ścieżka nauki",
    memoryGame: "Trening Pamięci",
    sidebarToggle: "Przełącz pasek boczny",
    statsToggle: "Przełącz statystyki",
    fullscreen: "Pełny ekran",
    language: "Wybierz język",
    deleteChat: "Usuń czat",
    achievementTitles: {
      first_correct: 'Pierwsza Iskra',
      first_error: 'Najlepszy Nauczyciel',
      streak_10: 'Tryb Boga',
      scholar_20: 'Akademik',
      level_10: 'Weteran',
      level_25: 'Elitarny Koder',
      level_50: 'Półbóg',
      course_start: 'Droga się Zaczyna',
      course_half: 'Mistrzostwo Połowiczne',
      course_finish: 'Najwyższy Mistrz',
      xp_10000: 'Milioner XP',
      fast_learner: 'Szybki Umysł',
      clean_coder: 'Czysty Koder',
      master_architect: 'Mistrz Architektury',
      help_seeker: 'Dociekliwy Umysł',
    }
  }
};

interface JSTask {
  id: number;
  question: string;
  correctAnswer: string;
  type: 'input' | 'textarea';
  difficulty?: 'EASY' | 'NORMAL' | 'HARDCORE';
}

interface MasteryStats {
  logic: number;
  syntax: number;
  async: number;
  dom: number;
  perf: number;
}

interface RoadmapStep {
  id: string;
  title: string;
  status: 'locked' | 'unlocked' | 'completed';
}

interface LearningStats {
  xp: number;
  level: number;
  streak: number;
  helpCount: number;
  totalCorrect: number;
  lastXP?: number;
  completedLessons: number[];
  achievements: { id: string; title: string; unlocked: boolean }[];
  mastery: MasteryStats;
}

interface ChatSession {
  id: string;
  title: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  lastTask?: JSTask | null;
}

const EsclavoIcon = ({ className = "w-4 h-4", themeAccent = "emerald" }: { className?: string, themeAccent?: string }) => {
  return (
    <div className={`${className} rounded-xl overflow-hidden border border-white/20 shrink-0 bg-neutral-900 flex items-center justify-center p-1.5 shadow-2xl relative group`}>
      <div className={`absolute inset-0 bg-gradient-to-br from-${themeAccent}-500/20 to-transparent`} />
      <Sparkles className="w-full h-full text-white relative z-10 group-hover:scale-110 transition-transform duration-500" />
      <div className={`absolute -inset-1 bg-${themeAccent}-500/5 blur-lg group-hover:bg-${themeAccent}-500/10 transition-colors`} />
    </div>
  );
};

const ACHIEVEMENTS_DATA = [
  { id: 'first_correct', title: 'First Spark', icon: <Zap className="w-4 h-4" />, requirement: "Дайте першу правильну відповідь" },
  { id: 'first_error', title: 'Greatest Teacher', icon: <XCircle className="w-4 h-4" />, requirement: "Зробіть свою першу помилку" },
  { id: 'streak_10', title: 'Esclavo Initiate', icon: <EsclavoIcon />, requirement: "Серія з 10 правильних відповідей поспіль" },
  { id: 'scholar_20', title: 'Academic', icon: <Trophy className="w-4 h-4" />, requirement: "Виконайте 20 завдань" },
  { id: 'level_10', title: 'Veteran', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, requirement: "Досягніть 10 рівня" },
  { id: 'level_25', title: 'Protocol Elite', icon: <EsclavoIcon />, requirement: "Досягніть 25 рівня" },
  { id: 'level_50', title: 'Demi-God', icon: <Sparkles className="w-4 h-4 text-purple-400" />, requirement: "Досягніть 50 рівня" },
  { id: 'course_start', title: 'The Path Begins', icon: <Globe className="w-4 h-4 text-amber-400" />, requirement: "Розпочніть проходження курсу" },
  { id: 'course_half', title: 'Midpoint Mastery', icon: <Check className="w-4 h-4 text-orange-400" />, requirement: "Завершіть 50 уроків" },
  { id: 'course_finish', title: 'Supreme Master', icon: <Trophy className="w-4 h-4 text-yellow-400" />, requirement: "Завершіть всі 100 уроків" },
  { id: 'xp_10000', title: 'XP Millionaire', icon: <Zap className="w-4 h-4 text-white" />, requirement: "Наберіть 10,000 XP" },
  { id: 'fast_learner', title: 'Quick Wit', icon: <BrainCircuit className="w-4 h-4 text-rose-400" />, requirement: "Виконайте завдання менш ніж за 15 секунд" },
  { id: 'clean_coder', title: 'Code Architect', icon: <EsclavoIcon />, requirement: "50 правильних відповідей загалом" },
  { id: 'master_architect', title: 'Master Architect', icon: <Trophy className="w-4 h-4 text-indigo-400" />, requirement: "Досягніть 100 рівня" },
  { id: 'help_seeker', title: 'Inquisitive Mind', icon: <BrainCircuit className="w-4 h-4 text-pink-400" />, requirement: "Використайте AI-підказку 5 разів" },
];

const COURSE_LESSONS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  levelRequired: Math.floor(i / 5) + 1,
  title: `Lesson ${i + 1}`,
  topic: [
    "Variables & Scope", "Data Types", "Operators", "Strict Mode", "Loops", 
    "Functions", "Arrow Functions", "Closures", "Call Stack", "Objects",
    "Arrays", "Array Methods", "Destructuring", "Spread/Rest", "Recursion",
    "Promises", "Async/Await", "Fetch API", "DOM Manipulation", "Events",
    "Classes", "Prototypes", "Inheritance", "Modules", "Error Handling",
    "Regex", "Storage API", "Timers", "JSON", "Map & Set",
    "Proxy", "Reflect", "WeakMap", "BigInt", "Symbol",
    "Web Workers", "Canvas API", "Audio API", "Intl API", "Performance",
    "Memory Management", "Clean Code", "Design Patterns", "Solid Principles", "Unit Testing"
  ][i % 45] || "Advanced Mastery"
}));

const CodeBlock = ({ children }: { children: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/50 border-b border-neutral-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">JavaScript / TypeScript</span>
        <button 
          onClick={handleCopy}
          className="text-neutral-500 hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          <span className="text-[9px] font-bold uppercase">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-emerald-300 leading-relaxed font-medium">
          {children}
        </code>
      </pre>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-1.5 p-4 bg-neutral-900/50 rounded-2xl w-fit border border-neutral-800/50">
    <motion.div 
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
    />
    <motion.div 
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
    />
    <motion.div 
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
    />
  </div>
);

const MasteryBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
      <span className="text-neutral-500">{label}</span>
      <span className={color}>{value}%</span>
    </div>
    <div className="h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${color.replace('text-', 'bg-')}`}
      />
    </div>
  </div>
);

const RoadmapStepItem = ({ step, index }: { step: RoadmapStep, index: number }) => (
  <div className="relative pl-8 pb-8 last:pb-0 group">
    {/* Line */}
    <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-neutral-900 group-last:h-4" />
    
    {/* Circle */}
    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
      step.status === 'completed' ? 'bg-emerald-600 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
      step.status === 'unlocked' ? 'bg-neutral-950 border-emerald-500 animate-pulse' :
      'bg-neutral-950 border-neutral-800'
    }`}>
      {step.status === 'completed' ? <Check className="w-3 h-3 text-white" /> : 
       step.status === 'unlocked' ? <Zap className="w-3 h-3 text-emerald-500" /> : 
       <Clock className="w-3 h-3 text-neutral-800" />}
    </div>

    <div className="space-y-1">
      <h4 className={`text-[10px] font-black uppercase tracking-widest ${
        step.status === 'locked' ? 'text-neutral-600' : 'text-neutral-200'
      }`}>
        {step.title}
      </h4>
      <div className="h-0.5 w-8 bg-neutral-900 rounded-full" />
    </div>
  </div>
);

const AssistantThinking = () => (
  <div className="flex gap-4 p-6 bg-neutral-900/30 rounded-3xl border border-neutral-800/50 max-w-[200px]">
    <div className="w-8 h-8 rounded-xl bg-emerald-600/20 flex items-center justify-center animate-pulse">
      <BrainCircuit className="w-4 h-4 text-emerald-500" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="h-2 w-full bg-neutral-800 rounded-full animate-pulse" />
      <div className="h-2 w-3/4 bg-neutral-800 rounded-full animate-pulse delay-75" />
    </div>
  </div>
);

const DailyStreak = ({ streak }: { streak: number }) => {
  return (
    <div className="flex gap-2 items-end h-16">
      {[...Array(7)].map((_, i) => (
        <motion.div 
          key={i} 
          initial={{ height: 6 }}
          animate={{ height: i < (streak % 7 || (streak > 0 ? 7 : 0)) ? [6, 32 + (i * 4), 24 + (i * 4)] : 6 }}
          className={`w-3 rounded-full transition-all ${i < (streak % 7 || (streak > 0 ? 7 : 0)) ? 'bg-gradient-to-t from-orange-600 via-orange-400 to-amber-300 shadow-[0_0_25px_rgba(249,115,22,0.5)]' : 'bg-neutral-800'}`}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('js-mentor-sessions');
    return saved ? JSON.parse(saved) : [{ id: '1', title: 'Новий чат', messages: [] }];
  });
  const [currentSessionId, setCurrentSessionId] = useState(sessions[0]?.id || '1');
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('js-lang') as Language) || 'Ukrainian';
  });
  const t = UI_TEXT[language];
  
  const [dynamicTasks, setDynamicTasks] = useState<JSTask[]>(() => {
    const saved = localStorage.getItem('js-mentor-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean | null>>({});
  const [taskFeedbacks, setTaskFeedbacks] = useState<Record<number, string>>({});
  const [checkingTasks, setCheckingTasks] = useState<Record<number, boolean>>({});
  const [showGame, setShowGame] = useState(false);
  const [showGameCenter, setShowGameCenter] = useState(false);
  const [activeGame, setActiveGame] = useState<'jump' | 'invaders' | 'memory' | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proposedTask, setProposedTask] = useState<JSTask | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSidebar, setActiveSidebar] = useState<'history' | 'missions' | 'achievements' | 'course' | 'roadmap' | 'settings'>('history');
  const [currentTheme, setCurrentTheme] = useState<'CYBER' | 'PLASMA' | 'ESCLAVO'>(() => {
    const saved = localStorage.getItem('esclavo-theme');
    return (saved as any) || 'ESCLAVO';
  });
  const [preferredDifficulty, setPreferredDifficulty] = useState<'easy' | 'normal' | 'hard'>(() => {
    const saved = localStorage.getItem('esclavo-difficulty');
    return (saved as any) || 'normal';
  });
  const [challengesEnabled, setChallengesEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('esclavo-challenges-enabled');
    return saved === null ? true : saved === 'true';
  });
  const [autoTasks, setAutoTasks] = useState<boolean>(() => {
    const saved = localStorage.getItem('esclavo-auto-tasks');
    return saved === null ? true : saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('esclavo-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('esclavo-difficulty', preferredDifficulty);
  }, [preferredDifficulty]);

  useEffect(() => {
    localStorage.setItem('esclavo-challenges-enabled', challengesEnabled.toString());
  }, [challengesEnabled]);

  useEffect(() => {
    localStorage.setItem('esclavo-auto-tasks', autoTasks.toString());
  }, [autoTasks]);

  const [practiceTab, setPracticeTab] = useState<'active' | 'history'>('active');
  const [completedTasks, setCompletedTasks] = useState<JSTask[]>(() => {
    const saved = localStorage.getItem('js-mentor-completed');
    return saved ? JSON.parse(saved) : [];
  });

  const [levelUpMessage, setLevelUpMessage] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState(false);
  const [isRequestingManualTask, setIsRequestingManualTask] = useState(false);
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState<number | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [leftWidth, setLeftWidth] = useState(() => {
    const saved = localStorage.getItem('js-mentor-left-width');
    return saved ? parseInt(saved) : 450;
  });
  const [rightWidth, setRightWidth] = useState(() => {
    const saved = localStorage.getItem('js-mentor-right-width');
    return saved ? parseInt(saved) : 500;
  });
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDownLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = leftWidth;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(300, Math.min(window.innerWidth * 0.45, startWidth + (moveEvent.clientX - startX)));
      setLeftWidth(newWidth);
      localStorage.setItem('js-mentor-left-width', newWidth.toString());
    };
    
    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseDownRight = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = rightWidth;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(300, Math.min(window.innerWidth * 0.45, startWidth - (moveEvent.clientX - startX)));
      setRightWidth(newWidth);
      localStorage.setItem('js-mentor-right-width', newWidth.toString());
    };
    
    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
  };
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>(() => {
    const saved = localStorage.getItem('js-mentor-roadmap');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Neural Core Initialization', status: 'completed' },
      { id: '2', title: 'Functional Logic Flow', status: 'unlocked' },
      { id: '3', title: 'Async Buffer Management', status: 'locked' },
      { id: '4', title: 'Architectural Frameworks', status: 'locked' }
    ];
  });
  
  const [lastActionTime, setLastActionTime] = useState(Date.now());

  useEffect(() => {
    localStorage.setItem('js-mentor-completed', JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('js-lang', language);
  }, [language]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isLoading]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 200;
      setShowScrollButton(isScrolledUp);
    }
  };

  // Progress Stats (XP & Leveling)
  const [stats, setStats] = useState<LearningStats>(() => {
    const saved = localStorage.getItem('js-mentor-stats');
    const defaultStats: LearningStats = { 
      xp: 0, 
      level: 1, 
      streak: 0,
      helpCount: 0,
      totalCorrect: 0,
      completedLessons: [],
      achievements: ACHIEVEMENTS_DATA.map(a => ({ id: a.id, title: a.title, unlocked: false })),
      mastery: {
        logic: 10,
        syntax: 10,
        async: 0,
        dom: 0,
        perf: 0
      }
    };
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultStats,
        ...parsed,
        achievements: parsed.achievements || defaultStats.achievements,
        mastery: parsed.mastery || defaultStats.mastery
      };
    }
    return defaultStats;
  });

  useEffect(() => {
    localStorage.setItem('js-mentor-stats', JSON.stringify(stats));
  }, [stats]);

  const addXP = (amount: number, isCorrect: boolean) => {
    const now = Date.now();
    const timeTaken = (now - lastActionTime) / 1000;
    setLastActionTime(now);

    setStats((prev: LearningStats) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const totalCorrect = (prev.totalCorrect || 0) + (isCorrect ? 1 : 0);
      
      const newMastery = { ...(prev.mastery || { logic: 10, syntax: 10, async: 0, dom: 0, perf: 0 }) };
      if (isCorrect) {
        // Increment random mastery category
        const categories = Object.keys(newMastery) as (keyof MasteryStats)[];
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        newMastery[randomCat] = Math.min(100, newMastery[randomCat] + 5);
      }

      const updatedAchievements = [...(prev.achievements || [])];
      
      const unlock = (id: string) => {
        const index = updatedAchievements.findIndex(a => a.id === id);
        if (index !== -1 && !updatedAchievements[index].unlocked) {
          updatedAchievements[index].unlocked = true;
          // Optionally notify user
        }
      };

      if (isCorrect) unlock('first_correct');
      if (!isCorrect) unlock('first_error');
      if (newStreak >= 10) unlock('streak_10');
      if (completedTasks.length >= 20) unlock('scholar_20');
      
      if (newLevel >= 10) unlock('level_10');
      if (newLevel >= 25) unlock('level_25');
      if (newLevel >= 50) unlock('level_50');
      if (newLevel >= 100) unlock('master_architect');
      
      if (newXP >= 10000) unlock('xp_10000');
      if (prev.completedLessons?.length >= 1) unlock('course_start');
      if (prev.completedLessons?.length >= 50) unlock('course_half');
      if (prev.completedLessons?.length >= 100) unlock('course_finish');

      if (totalCorrect >= 50) unlock('clean_coder');
      if (prev.helpCount >= 5) unlock('help_seeker');
      if (isCorrect && timeTaken < 15) unlock('fast_learner');
      
      if (newLevel > prev.level) setLevelUpMessage(true);
      
      return { 
        ...prev, 
        xp: newXP, 
        level: newLevel, 
        lastXP: amount, 
        streak: newStreak,
        totalCorrect: totalCorrect,
        achievements: updatedAchievements,
        mastery: newMastery
      };
    });
  };

  const getRank = (level: number) => {
    if (level <= 5) return t.novice;
    if (level <= 10) return t.coder;
    if (level <= 20) return t.dev;
    return t.architect;
  };

  useEffect(() => {
    setProposedTask(null);
    setSuggestions([]);
  }, [currentSessionId]);

  useEffect(() => {
    if (isAppStarted) {
      const hasFinishedOnboarding = localStorage.getItem('js-onboarding-done');
      if (!hasFinishedOnboarding) {
        setTimeout(() => setCurrentTourStep(0), 1500);
      }
    }
  }, [isAppStarted]);

  const completeTour = () => {
    setCurrentTourStep(null);
    localStorage.setItem('js-onboarding-done', 'true');
  };

  const nextTourStep = () => {
    if (currentTourStep === null) return;
    if (currentTourStep >= TOUR_STEPS[language].length - 1) {
      completeTour();
    } else {
      setCurrentTourStep(currentTourStep + 1);
    }
  };

  useEffect(() => {
    localStorage.setItem('js-mentor-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('js-mentor-tasks', JSON.stringify(dynamicTasks));
  }, [dynamicTasks]);

  const createNewSession = () => {
    const newSession: ChatSession = { id: Date.now().toString(), title: t.newChat, messages: [] };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== id);
    if (filtered.length === 0) {
      const reset = [{ id: '1', title: 'Новий чат', messages: [] }];
      setSessions(reset);
      setCurrentSessionId('1');
    } else {
      setSessions(filtered);
      if (currentSessionId === id) setCurrentSessionId(filtered[0].id);
    }
  };

  const handleChat = async (manualMsg?: string, isForPractice: boolean = false) => {
    const msg = manualMsg || chatMessage;
    if (!msg.trim() || isLoading) return;

    // Secret Game Trigger: "геймес"
    if (msg.trim().toLowerCase() === 'геймес') {
      setShowGameCenter(true);
      setChatMessage('');
      return;
    }

    setIsLoading(true);
    setChatMessage('');
    setProposedTask(null);

    const isUserRequestingTask = isForPractice || isRequestingManualTask;

    const updatedMessages = [...(currentSession?.messages || []), { role: 'user', content: msg }] as any;
    
    // Update title based on first user message if it's t.newChat
    let updatedTitle = currentSession?.title || t.newChat;
    if (updatedTitle === t.newChat || updatedTitle === 'Новий чат') {
      updatedTitle = msg.length > 25 ? msg.substring(0, 25) + '...' : msg;
    }

    setSessions(prev => prev.map(s => 
      s.id === currentSessionId ? { ...s, title: updatedTitle, messages: updatedMessages } : s
    ));

    if (msg.includes(t.explainError)) {
      setStats(prev => ({ ...prev, helpCount: (prev.helpCount || 0) + 1 }));
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: msg, 
          history: currentSession?.messages || [], 
          language,
          settings: {
            challengesEnabled,
            difficulty: preferredDifficulty,
            autoTasks
          }
        })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Server error');

      let cleanedText = data.text;
      let newSuggestions: string[] = [];
      const suggestionMatch = data.text.match(/\[SUGGESTIONS:\s*(.*?)\s*\]/);

      // Robust Task Parsing Logic
      const combinedTaskRegex = /\[(?:TASK|ЗАВДАННЯ|ZAVDANNYA):\s*(.*?)\s*\|\s*(.*?)\s*(?:\|\s*(.*?)\s*)?\]/gi;
      let tasksFound = false;

      // Use a Set to track processed task strings to avoid duplicates from overlapping regex rules (though we now use just one)
      const processedTaskStrings = new Set<string>();
      
      const allTaskMatches = Array.from(data.text.matchAll(combinedTaskRegex));
      
      for (const taskMatch of allTaskMatches) {
        const fullMatch = taskMatch[0];
        if (processedTaskStrings.has(fullMatch)) continue;
        processedTaskStrings.add(fullMatch);

        const diffRaw = (taskMatch[1] || 'NORMAL').trim().toUpperCase();
        const question = (taskMatch[2] || '').trim();
        const answer = (taskMatch[3] || '').trim();

        if (question) {
          const diff = ['EASY', 'NORMAL', 'HARDCORE'].includes(diffRaw) ? diffRaw : 'NORMAL';
          const tempTask: JSTask = {
            id: Date.now() + Math.random(),
            difficulty: diff as any,
            question,
            correctAnswer: answer || '?',
            type: question.length > 80 ? 'textarea' : 'input'
          };

          setDynamicTasks(prev => [tempTask, ...prev]);
          tasksFound = true;
          cleanedText = cleanedText.replace(fullMatch, '').trim();
        }
      }

      if (tasksFound) {
        setRightSidebarOpen(true);
        setPracticeTab('active');
      } else if (isUserRequestingTask) {
        // Fallback for messy formatting: try to find anything between brackets with at least one pipe
        const looseMatch = data.text.match(/\[(.*?)\|(.*?)\|(.*?)\]/);
        if (looseMatch) {
          const tempTask: JSTask = {
            id: Date.now() + Math.random(),
            difficulty: 'NORMAL' as any,
            question: looseMatch[2]?.trim() || looseMatch[1]?.trim(),
            correctAnswer: looseMatch[3]?.trim() || '?',
            type: (looseMatch[2] || '').length > 80 ? 'textarea' : 'input'
          };
          setDynamicTasks(prev => [tempTask, ...prev]);
          setRightSidebarOpen(true);
          setPracticeTab('active');
          cleanedText = cleanedText.replace(looseMatch[0], '').trim();
        }
      }

      if (isUserRequestingTask) {
        setIsRequestingManualTask(false);
      }

      if (suggestionMatch) {
        cleanedText = cleanedText.replace(suggestionMatch[0], '').trim();
        newSuggestions = suggestionMatch[1].split('|').map((s: string) => s.trim());
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }

      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { 
          ...s, 
          messages: [...s.messages, { role: 'assistant', content: cleanedText }] 
        } : s
      ));
    } catch (error: any) {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { 
          ...s, 
          messages: [...s.messages, { role: 'assistant', content: `❌ ${t.errorLabel}: ${error.message}` }] 
        } : s
      ));
    } finally {
      setIsLoading(false);
      setIsRequestingManualTask(false);
    }
  };

  const confirmTask = () => {
    setProposedTask(null);
  };

  const checkAnswer = async (taskId: number) => {
    const task = dynamicTasks.find(t => t.id === taskId);
    if (!task || checkingTasks[taskId]) return;

    const userAnswer = answers[taskId]?.trim();
    if (!userAnswer) return;

    setCheckingTasks(prev => ({ ...prev, [taskId]: true }));
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: task.question,
          correctAnswer: task.correctAnswer,
          userAnswer: userAnswer,
          difficulty: task.difficulty,
          language: language
        })
      });
      
      const data = await response.json();
      setResults(prev => ({ ...prev, [taskId]: data.isCorrect }));
      setTaskFeedbacks(prev => ({ ...prev, [taskId]: data.feedback }));
      
      if (data.isCorrect && data.xpAwarded) {
        addXP(data.xpAwarded, true);
        // Move to completed
        setTimeout(() => {
          setCompletedTasks(prev => [task, ...prev]);
          setDynamicTasks(prev => prev.filter(t => t.id !== taskId));
        }, 3000);
      } else {
        addXP(0, false);
      }
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setCheckingTasks(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const theme = useMemo(() => {
    const tA = currentTheme === 'CYBER' ? 'blue' : currentTheme === 'PLASMA' ? 'violet' : 'emerald';
    return {
      accent: tA,
      primary: `bg-${tA}-600`,
      hover: `bg-${tA}-500`,
      text: 'text-white',
      accentText: `text-${tA}-500`,
      accentTextMuted: `text-${tA}-500/60`,
      border: `border-${tA}-500/30`,
      borderFocus: `focus:border-${tA}-500/50`,
      shadow: `shadow-${tA}-600/30`,
      shadowStrong: `shadow-${tA}-600/50`,
      glow: `bg-${tA}-600/10`,
      glowStrong: `bg-${tA}-600/20`,
      gradient: `from-${tA}-600 via-${tA}-400 to-${tA}-500`,
      ring: `ring-${tA}-600/50`,
      decoration: `via-${tA}-500`,
      texture: currentTheme === 'CYBER' ? 'texture-grid' : currentTheme === 'PLASMA' ? 'texture-noise' : ''
    };
  }, [currentTheme]);

  const tA = theme.accent;

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-neutral-100 font-sans flex text-base overflow-hidden relative theme-${currentTheme.toLowerCase()}`}>
      {/* Background Exclusive Textures */}
      <div className={theme.texture} />
      {currentTheme === 'ESCLAVO' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/5 via-transparent to-emerald-900/5 pointer-events-none" />
      )}
      
      <AnimatePresence mode="wait">
        {!isAppStarted ? (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center p-6 overflow-hidden"
          >
            {/* Optimized Background Gradients */}
            <div className={`absolute top-1/4 left-1/4 w-[300px] h-[300px] ${theme.glowStrong} blur-[100px] animate-pulse opacity-50`} />
            <div className={`absolute bottom-1/4 right-1/4 w-[300px] h-[300px] ${theme.glowStrong} blur-[100px] animate-pulse delay-1000 opacity-50`} />
            
            <div className="h-full flex flex-col items-center justify-center text-center space-y-12 w-full mx-auto relative z-10">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="relative"
               >
                  {/* Exclusive Scanning Line */}
                  <div className={`absolute inset-x-0 h-[2px] ${theme.accent === 'blue' ? 'bg-blue-400/30' : theme.accent === 'violet' ? 'bg-violet-400/30' : 'bg-emerald-400/30'} blur-sm animate-scanline z-50 pointer-events-none`} />
                  
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className={`absolute -inset-12 border-2 border-dashed ${currentTheme === 'PLASMA' ? 'border-violet-500/20' : currentTheme === 'CYBER' ? 'border-blue-500/20' : 'border-emerald-500/20'} rounded-full`}
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    className={`absolute -inset-24 border ${currentTheme === 'PLASMA' ? 'border-violet-500/10' : currentTheme === 'CYBER' ? 'border-blue-500/10' : 'border-emerald-500/10'} rounded-full`}
                  />
                  <div className={`w-48 h-48 ${currentTheme === 'PLASMA' ? 'bg-violet-900/20' : currentTheme === 'CYBER' ? 'bg-blue-900/20' : 'bg-emerald-900/20'} rounded-[3rem] flex items-center justify-center ${currentTheme === 'PLASMA' ? 'shadow-[0_0_80px_rgba(139,92,246,0.2)]' : currentTheme === 'CYBER' ? 'shadow-[0_0_80px_rgba(37,99,235,0.2)]' : 'shadow-[0_0_80px_rgba(16,185,129,0.2)]'} relative z-10 group overflow-hidden border ${theme.border}`}>
                     <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10" />
                     <img 
                       src="https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&w=200&h=200&q=80" 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                       alt="Cucumber"
                       referrerPolicy="no-referrer"
                     />
                  </div>
               </motion.div>
               
               <div className="space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className={`text-9xl md:text-[12rem] font-black text-white tracking-tighter italic leading-none drop-shadow-[0_0_50px_${currentTheme === 'PLASMA' ? 'rgba(139,92,246,0.2)' : currentTheme === 'CYBER' ? 'rgba(37,99,235,0.2)' : 'rgba(16,185,129,0.2)'}]`}>ESCLAVO</h2>
                    <div className="flex items-center justify-center gap-4 mt-4">
                       <div className="h-[1px] w-12 bg-neutral-800" />
                       <span className={`${theme.accentText} font-black uppercase tracking-[0.4em] text-xs`}>ESCLAVO PROTOCOL</span>
                       <div className="h-[1px] w-12 bg-neutral-800" />
                    </div>
                  </motion.div>
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-neutral-400 max-w-lg mx-auto font-medium leading-relaxed uppercase tracking-tight"
                  >
                    {t.welcome}
                  </motion.p>
               </div>

               <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.6 }}
                 className="flex flex-col items-center gap-6 w-full"
               >
                 <motion.button 
                   whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(255,255,255,0.2)" }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => {
                     setIsAppStarted(true);
                     if (!currentSession || currentSession.messages.length === 0) {
                       handleChat(t.hello);
                     }
                   }}
                   className="bg-white text-black px-16 py-8 rounded-[2rem] font-black text-3xl shadow-2xl flex items-center gap-6 group hover:bg-neutral-100 transition-all"
                 >
                   {t.start}
                   <div className={`${theme.primary} p-2 rounded-xl text-white group-hover:translate-x-2 transition-transform`}>
                      <Zap className="w-6 h-6 fill-white" />
                   </div>
                 </motion.button>

                  <div className="flex gap-4 mt-8">
                    {(Object.keys(UI_TEXT) as Language[]).map(l => (
                      <button 
                        key={l}
                        onClick={() => setLanguage(l as Language)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${language === l ? 'bg-white/10 text-white border-white/20' : 'text-neutral-600 border-transparent hover:text-neutral-400'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
               </motion.div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-neutral-800 font-black text-[10px] tracking-widest uppercase">
               <span>{t.systemStatus}: {t.optimal}</span>
               <span>LOCALE: {language}</span>
               <span>{t.build}: 2026.ESCLAVO.CORE</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex overflow-hidden h-screen relative"
          >
            {/* Tour Overlay */}
            <AnimatePresence>
              {currentTourStep !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                  {/* Spotlight Background Effect (Optional, just making backdrop darker/blurry) */}
                  <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 40 }}
                    className="bg-[#0f0f0f] border border-emerald-500/30 p-10 rounded-[3rem] max-w-md w-full shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden group"
                  >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/10 blur-[80px] rounded-full" />
                    
                    <div className="absolute top-0 right-0 p-6">
                      <button onClick={completeTour} className="text-neutral-700 hover:text-white transition-colors group/close">
                        <XCircle className="w-8 h-8 group-hover/close:rotate-90 transition-transform duration-300" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                      <div className="bg-emerald-600/20 p-4 rounded-3xl border border-emerald-500/30">
                        <BrainCircuit className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 block mb-1">Onboarding Protocol</span>
                        <div className="flex gap-1">
                          {TOUR_STEPS[language].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentTourStep ? 'w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : i < currentTourStep ? 'w-3 bg-emerald-900' : 'w-3 bg-neutral-800'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <motion.h3 
                      key={currentTourStep + 'title'}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-3xl font-black text-white italic tracking-tighter mb-4 uppercase leading-tight"
                    >
                      {TOUR_STEPS[language][currentTourStep].title}
                    </motion.h3>
                    
                    <motion.p 
                      key={currentTourStep + 'desc'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-neutral-400 text-lg leading-relaxed mb-10 font-medium"
                    >
                      {TOUR_STEPS[language][currentTourStep].description}
                    </motion.p>

                    <div className="flex gap-5">
                      <button 
                        onClick={completeTour}
                        className="flex-1 py-4 px-8 rounded-2xl border border-neutral-800 text-neutral-500 font-black uppercase tracking-widest text-[11px] hover:bg-neutral-800 hover:text-neutral-300 transition-all active:scale-95"
                      >
                        Skip
                      </button>
                      <button 
                        onClick={nextTourStep}
                        className="flex-[1.5] py-4 px-8 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500 shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 active:scale-95 group/btn"
                      >
                        {currentTourStep === TOUR_STEPS[language].length - 1 ? 'Finish' : 'Next Step'}
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.div>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

        <aside 
          id="sidebar-panel" 
          className={`border-r border-neutral-900 flex flex-col ${currentTheme === 'PLASMA' ? 'bg-[#0a001a]' : currentTheme === 'CYBER' ? 'bg-[#000a1a]' : 'bg-[#000d08]'} duration-500 ease-in-out overflow-hidden relative ${isResizing ? '' : 'transition-[opacity,transform,width]'} ${leftSidebarOpen ? 'opacity-100' : 'w-0 opacity-0 pointer-events-none'} ${currentTourStep === 0 ? `ring-8 ${theme.ring} z-[60] relative shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]` : ''}`}
          style={{ width: leftSidebarOpen ? leftWidth : 0 }}
        >
              {leftSidebarOpen && (
                <div 
                  onMouseDown={handleMouseDownLeft}
                  className={`absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-${tA}-600/50 transition-colors z-[100]`}
                />
              )}
              <div className="p-4 border-b border-neutral-900 flex gap-1">
          <button 
            onClick={() => setActiveSidebar('history')}
            className={`p-3 rounded-xl transition-all group relative ${activeSidebar === 'history' ? `${theme.primary} ${theme.text} ${theme.shadow}` : 'text-neutral-600 hover:text-neutral-400 hover:bg-neutral-900'}`}
          >
            <History className="w-5 h-5" />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none z-[100] shadow-2xl overflow-visible">
              {t.history}
            </span>
          </button>
          <button 
            onClick={() => setActiveSidebar('missions')}
            className={`p-3 rounded-xl transition-all group relative ${activeSidebar === 'missions' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-neutral-600 hover:text-neutral-400 hover:bg-neutral-900'}`}
          >
            <Zap className="w-5 h-5" />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none z-[100] shadow-2xl">
              {t.missions}
            </span>
          </button>
          <button 
            onClick={() => setActiveSidebar('achievements')}
            className={`p-3 rounded-xl transition-all group relative ${activeSidebar === 'achievements' ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-neutral-600 hover:text-neutral-400 hover:bg-neutral-900'}`}
          >
            <Trophy className="w-5 h-5" />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none z-[100] shadow-2xl">
              {t.achievements}
            </span>
          </button>
          <button 
            onClick={() => setActiveSidebar('course')}
            className={`p-3 rounded-xl transition-all group relative ${activeSidebar === 'course' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-neutral-600 hover:text-neutral-400 hover:bg-neutral-900'}`}
          >
            <Library className="w-5 h-5" />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none z-[100] shadow-2xl">
              {t.course}
            </span>
          </button>
          
          <div className="flex-1" />
          
          <button 
            onClick={() => setActiveSidebar('settings')}
            className={`p-3 rounded-xl transition-all group relative ${activeSidebar === 'settings' ? `${theme.primary} ${theme.text} ${theme.shadow}` : 'text-neutral-600 hover:text-neutral-400 hover:bg-neutral-900'}`}
          >
            <EsclavoIcon className="w-5 h-5" themeAccent={tA} />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none z-[100] shadow-2xl">
              {t.settings}
            </span>
          </button>

          <div className="relative group">
            <button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${showLanguageMenu ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'}`}
            >
              <Languages className="w-4 h-4 opacity-70" />
              <span className="text-sm">{LANGUAGE_CONFIG[language].flag}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showLanguageMenu ? 'rotate-180' : ''}`} />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all pointer-events-none z-[100] shadow-2xl">
              {t.language}
            </span>

            <AnimatePresence>
              {showLanguageMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowLanguageMenu(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 z-50 shadow-2xl min-w-[160px]"
                  >
                    <div className="grid grid-cols-1 gap-1">
                      {(Object.keys(LANGUAGE_CONFIG) as Language[]).map(l => (
                        <button 
                          key={l}
                          onClick={() => {
                            setLanguage(l);
                            setShowLanguageMenu(false);
                          }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                            language === l 
                            ? 'bg-emerald-600 text-white' 
                            : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                          }`}
                        >
                          <span className="text-lg">{LANGUAGE_CONFIG[l].flag}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">{LANGUAGE_CONFIG[l].label}</span>
                          {language === l && <div className="ml-auto w-1 h-1 bg-white rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {activeSidebar === 'history' && (
          <>
            <div className="p-6 border-b border-neutral-900 bg-[#0a0a0a]/50">
              <button 
                onClick={createNewSession}
                className="w-full bg-neutral-900/50 border border-neutral-800 hover:bg-neutral-800 py-6 px-8 rounded-2xl flex items-center justify-center gap-4 transition-all font-black uppercase tracking-[0.3em] text-xs text-white shadow-2xl group active:scale-95"
              >
                <PlusCircle className={`w-6 h-6 ${theme.accentText.replace('text-', 'text-')} group-hover:rotate-90 transition-transform`} /> {t.newChat}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-1">
              {sessions.map(s => (
                  <div 
                    key={s.id}
                    onClick={() => setCurrentSessionId(s.id)}
                    className={`group px-6 py-5 rounded-[1.5rem] cursor-pointer transition-all flex items-center justify-between border ${currentSessionId === s.id ? `bg-${tA}-600/10 border-${tA}-500/50 text-white shadow-xl shadow-${tA}-900/10` : 'border-transparent hover:bg-neutral-900/50 text-neutral-500'}`}
                  >
                    <div className="flex items-center gap-4 truncate">
                      <History className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-black truncate leading-tight tracking-tight uppercase italic">{s.title}</span>
                    </div>
                    <button 
                      onClick={(e) => deleteSession(e, s.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-rose-500 transition-all hover:bg-white/5 rounded-lg relative group/dt"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover/dt:opacity-100 translate-y-1 group-hover/dt:translate-y-0 transition-all pointer-events-none z-[100] shadow-2xl">
                        {t.deleteChat}
                      </span>
                    </button>
                  </div>
              ))}
            </div>
            <div className="p-4 border-t border-neutral-900/40 bg-black/40">
              <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">© 2026 Stadnuk Nazar</span>
                <div className="h-[1px] w-12 bg-blue-500/30"></div>
                <span className="text-[8px] font-bold text-neutral-600 tracking-widest uppercase">ESCLAVO.OS</span>
              </div>
            </div>
          </>
        )}

        {activeSidebar === 'missions' && (
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2">
            {dynamicTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-8 space-y-4">
                <BrainCircuit className="w-8 h-8" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{t.noMissions}</p>
              </div>
            ) : (
              dynamicTasks.map(t => (
                <div key={t.id} className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${theme.glowStrong} ${theme.accentText}`}>
                      {t.difficulty || 'NORMAL'}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-300 truncate font-medium">{t.question}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeSidebar === 'achievements' && (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-4">{t.achievements}</h3>
             {ACHIEVEMENTS_DATA.map((ach) => {
               const unlocked = stats.achievements?.find((a: any) => a.id === ach.id)?.unlocked;
               return (
                 <div key={ach.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${unlocked ? 'bg-amber-500/5 border-amber-500/20' : 'bg-neutral-900/30 border-neutral-800/50 opacity-40 grayscale'}`}>
                   <div className={`p-2 rounded-lg ${unlocked ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-neutral-800 text-neutral-600'}`}>
                     {ach.icon}
                   </div>
                   <div>
                     <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-200">{(t as any).achievementTitles[ach.id] || ach.title}</h4>
                     <p className="text-[8px] font-bold text-neutral-500">{unlocked ? 'Досягнення отримано' : ach.requirement || t.achievementHint}</p>
                   </div>
                 </div>
               );
             })}
          </div>
        )}

          {/* Course tab */}
          {activeSidebar === 'course' && (
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2">
              <div className="p-2 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{t.progress}</h3>
                  <span className="text-[10px] font-black text-purple-400">{Math.round((stats.completedLessons?.length || 0) / COURSE_LESSONS.length * 100)}%</span>
                </div>
                <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 transition-all duration-500" 
                    style={{ width: `${(stats.completedLessons?.length || 0) / COURSE_LESSONS.length * 100}%` }} 
                  />
                </div>
              </div>
              {COURSE_LESSONS.map(lesson => {
                const isLocked = stats.level < lesson.levelRequired;
                const isCompleted = stats.completedLessons?.includes(lesson.id);
                const translations = TOPIC_TRANSLATIONS[language] || {};
                const lessonTopic = (translations as any)[lesson.topic] || lesson.topic;
                
                return (
                  <button
                    key={lesson.id}
                    disabled={isLocked || isLoading}
                    onClick={() => {
                      handleChat(`${t.lesson} ${lesson.id}: ${lessonTopic}. ${t.explainLesson}`);
                      if (!isCompleted) {
                         setStats((prev: any) => {
                           const newXP = prev.xp + 100;
                           const newLevel = Math.floor(newXP / 500) + 1;
                           if (newLevel > prev.level) setLevelUpMessage(true);
                           
                           return {
                             ...prev,
                             xp: newXP,
                             level: newLevel,
                             completedLessons: [...(prev.completedLessons || []), lesson.id]
                           };
                         });
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 relative overflow-hidden group ${
                      isLocked ? 'bg-neutral-900/20 border-neutral-900 opacity-40 grayscale' : 
                      isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' :
                      'bg-neutral-900/40 border-neutral-800/50 hover:bg-neutral-800/80'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isLocked ? 'bg-neutral-800 text-neutral-600' :
                      isCompleted ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                      'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]'
                    }`}>
                      {isLocked ? <Settings className="w-3 h-3 animate-spin-slow" /> : isCompleted ? <Check className="w-3 h-3" /> : <Library className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                         <span className="text-[8px] font-black uppercase text-neutral-500 tracking-tighter shrink-0">{t.lesson} {lesson.id}</span>
                         {isLocked && <span className="text-[7px] font-black uppercase bg-neutral-800 text-neutral-600 px-1 rounded tracking-tighter shrink-0">{t.locked} Lvl {lesson.levelRequired}</span>}
                      </div>
                      <h4 className="text-[10px] font-bold text-neutral-200 truncate pr-4">
                        {lessonTopic}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

        {activeSidebar === 'settings' && (
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">{t.settings}</h3>
              <p className="text-[8px] text-neutral-500 uppercase font-bold">Preferences & Protocol</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-900/10 border border-emerald-900/20 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${theme.glowStrong} rounded-lg`}>
                    <EsclavoIcon className={`w-5 h-5 ${theme.accentText.replace('text-', 'text-')}`} themeAccent={tA} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white">Theme Protocol</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['CYBER', 'PLASMA', 'ESCLAVO'].map(tm => (
                    <button 
                      key={tm} 
                      onClick={() => setCurrentTheme(tm as any)}
                      className={`py-2 text-[8px] font-black uppercase tracking-widest rounded-lg border transition-all ${currentTheme === tm ? (tm === 'ESCLAVO' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' : tm === 'CYBER' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/20') : 'border-neutral-800 text-neutral-500 hover:bg-neutral-800'}`}
                    >
                      {tm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                    <Flag className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white">Challenge Protocol</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Enable Tasks</span>
                    <button 
                      onClick={() => setChallengesEnabled(!challengesEnabled)}
                      className={`w-12 h-6 rounded-full transition-all relative p-1 ${challengesEnabled ? theme.primary : 'bg-neutral-800'}`}
                    >
                      <motion.div 
                        animate={{ x: challengesEnabled ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>

                  <div className={`space-y-3 transition-all ${challengesEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    <div className="h-[1px] bg-neutral-800" />
                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block mb-2 text-center">Global Difficulty</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['easy', 'normal', 'hard'] as const).map(diff => (
                        <button
                          key={diff}
                          onClick={() => setPreferredDifficulty(diff)}
                          className={`py-2 text-[8px] font-black uppercase tracking-widest rounded-lg border transition-all ${preferredDifficulty === diff ? `${theme.primary} ${theme.text} ${theme.shadow}` : 'border-neutral-800 text-neutral-500 hover:bg-neutral-800'}`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[1px] bg-neutral-800" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Auto Missions</span>
                      <span className="text-[8px] text-neutral-600 font-bold">Proactive AI suggestions</span>
                    </div>
                    <button 
                      onClick={() => setAutoTasks(!autoTasks)}
                      className={`w-12 h-6 rounded-full transition-all relative p-1 ${autoTasks ? theme.primary : 'bg-neutral-800'}`}
                    >
                      <motion.div 
                        animate={{ x: autoTasks ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest text-white">Secure Link</span>
                    <span className="text-[8px] text-neutral-600 font-bold uppercase">End-to-end encryption</span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        <div id="stats-panel" className={`p-6 border-t border-neutral-900 bg-[#0a0a0a]/95 backdrop-blur-2xl transition-all ${currentTourStep === 3 ? `ring-8 ${theme.ring} z-[60] relative shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]` : ''}`}>
           {/* Progress Panel */}
           <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-[0.3em] text-neutral-600 uppercase mb-1">{t.rank}</span>
                    <div className="flex items-center gap-3">
                       <Award className="w-5 h-5 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                       <span className="text-lg font-black text-white italic tracking-tight">{getRank(stats.level)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black tracking-[0.3em] text-neutral-600 uppercase mb-1">{t.level}</span>
                    <div className="text-4xl font-black text-white leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{stats.level}</div>
                  </div>
               </div>

               <div className="space-y-6 bg-neutral-900/60 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden backdrop-blur-md">
                  <div className="flex justify-between items-end mb-2">
                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] italic">{t.dailyActivity}</span>
                       <DailyStreak streak={stats.streak} />
                    </div>
                    <div className="text-right">
                       <span className="block text-sm font-black text-white tracking-widest">{stats.streak} DAYS</span>
                       <span className="block text-[10px] font-bold text-orange-500 uppercase tracking-wide">ON FIRE 🔥</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-400">
                      <span>{stats.xp % 500} / 500 XP</span>
                      <span className={`${theme.accentText}`}>GOAL: LVL {stats.level + 1}</span>
                    </div>
                    <div className="h-2.5 bg-black rounded-full overflow-hidden border border-neutral-800 p-[2px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.xp % 500) / 5}%` }}
                        className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full ${theme.shadow.replace('shadow-', 'shadow-[0_0_20px_').replace('/30', '/50').replace('/20', '/50')}]`}
                      />
                    </div>
                  </div>
               </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={`flex-1 flex flex-col h-screen overflow-hidden lg:grid ${isResizing ? '' : 'transition-[grid-template-columns] duration-500'}`}
        style={{ gridTemplateColumns: `1fr ${rightSidebarOpen ? rightWidth : 0}px` }}
      >
        
        {/* Chat Area */}
        <div id="chat-panel" className={`flex flex-col h-full bg-[#0a0a0a] relative overflow-hidden min-h-0 transition-all ${currentTourStep === 2 ? `ring-8 ${theme.ring} z-[60] relative shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]` : ''}`}>
          {/* Main Layout Textures */}
          <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
             <div className="absolute inset-0 texture-grid" />
             <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-transparent h-40" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent h-40" />
          </div>

          <header className="px-10 py-8 border-b border-neutral-900 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-md shrink-0 z-20 sticky top-0">
            <div className="flex items-center gap-6">
               <button 
                 onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                 className={`p-3 rounded-xl transition-all group relative ${leftSidebarOpen ? 'text-emerald-500 bg-emerald-500/10' : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'}`}
               >
                 <PanelLeft className="w-6 h-6" />
                 <span className="absolute top-full mt-4 left-0 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all pointer-events-none z-[100] shadow-2xl">
                   {t.sidebarToggle}
                 </span>
               </button>
               <div className="flex items-center gap-4">
                 <div className="bg-emerald-600 p-1 rounded-2xl shadow-2xl shadow-emerald-500/30 w-10 h-10 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&w=100&h=100&q=80" 
                    className="w-full h-full object-cover"
                    alt="Cucumber"
                    referrerPolicy="no-referrer"
                  />
                 </div>
                 <div>
                    <h1 className="text-2xl font-black tracking-tighter text-white leading-none flex items-center gap-3 uppercase italic">
                      ESCLAVO.AI
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-lg tracking-widest not-italic">PLATINUM v3</span>
                    </h1>
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-2">
                 <button 
                   onClick={() => {
                     if (!document.fullscreenElement) {
                       document.documentElement.requestFullscreen();
                     } else {
                       if (document.exitFullscreen) {
                         document.exitFullscreen();
                       }
                     }
                   }}
                   className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300 transition-all group relative"
                 >
                   <Maximize2 className="w-5 h-5" />
                   <span className="absolute top-full mt-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all pointer-events-none z-[100] shadow-2xl">
                     {t.fullscreen}
                   </span>
                 </button>

                 <button 
                   onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                   className={`p-2 rounded-lg transition-all group relative ${rightSidebarOpen ? 'text-emerald-500 bg-emerald-500/10' : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'}`}
                 >
                   <PanelRight className="w-5 h-5" />
                   <span className="absolute top-full mt-4 right-0 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all pointer-events-none z-[100] shadow-2xl">
                     {t.statsToggle}
                   </span>
                 </button>
            </div>
          </header>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-10 py-12 space-y-12 custom-scrollbar scroll-smooth relative"
          >
            {/* Background Glows */}
            <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] ${theme.glow} blur-[120px] rounded-full pointer-events-none`} />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none" />
            {currentSession?.messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
                 <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-8 border-2 border-dashed border-emerald-500/20 rounded-full"
                    />
                    <div className="w-32 h-32 bg-emerald-900/40 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-900/30 relative z-10 group cursor-pointer overflow-hidden border border-emerald-500/20">
                       <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10" />
                       <img 
                         src="https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&w=150&h=150&q=80" 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                         alt="Logo"
                         referrerPolicy="no-referrer"
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h2 className="text-6xl font-black text-white tracking-tighter italic">ESCLAVO<span className="text-emerald-500">.</span></h2>
                    <p className="text-lg text-emerald-500 max-w-md mx-auto font-medium leading-relaxed uppercase tracking-widest">{t.welcome}</p>
                 </div>

                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => handleChat(t.hello)}
                   className="bg-white text-black px-10 py-6 rounded-3xl font-black text-2xl shadow-2xl flex items-center gap-4 group active:scale-95 transition-all"
                 >
                   {t.start}
                   <CheckCircle2 className="w-8 h-8 group-hover:translate-x-1" />
                 </motion.button>
              </div>
            )}

            {currentSession?.messages.map((m, i) => {
              const isLastAssistantMessage = m.role === 'assistant' && i === currentSession.messages.length - 1;
              return (
                <div key={i} className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-start`}
                  >
                    {/* Avatar ONLY for assistant */}
                    {m.role === 'assistant' && (
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-lg shadow-black">
                          <img 
                            src="https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&w=100&h=100&q=80" 
                            alt="Bot"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="mt-1 text-[8px] font-black uppercase tracking-widest text-center text-neutral-600">
                          AI
                        </div>
                      </div>
                    )}

                    <div className={`max-w-[85%] p-8 rounded-[2rem] shadow-2xl ${m.role === 'user' ? `${theme.primary} ${theme.text} ${theme.shadow}` : 'glass-card border-white/5 text-neutral-200'} relative group overflow-hidden`}>
                      {m.role === 'assistant' && (
                        <div className={`absolute top-0 left-0 w-1 h-full ${theme.glowStrong}`} />
                      )}
                      <div className="markdown-body text-sm md:text-base leading-[1.8] font-medium tracking-tight">
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <CodeBlock>{String(children).replace(/\n$/, '')}</CodeBlock>
                              ) : (
                                <code className="bg-neutral-800/50 px-1.5 py-0.5 rounded text-emerald-400 font-mono text-[0.9em] border border-neutral-700/50" {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>

                  {isLastAssistantMessage && (
                    <div className="flex flex-col items-start gap-3">
                      {/* Suggestions */}
                      {suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((q, idx) => (
                            <button 
                              key={idx}
                              onClick={() => handleChat(q)}
                              disabled={isLoading}
                              className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white text-xs font-bold text-neutral-400 transition-all"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start"
              >
                <TypingIndicator />
              </motion.div>
            )}

            {showScrollButton && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={scrollToBottom}
                className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-50 ${theme.glowStrong} backdrop-blur-md border ${theme.border} ${theme.accentText} p-2 rounded-full hover:${theme.glowStrong.replace('/20', '/30').replace('/10', '/30')} transition-all shadow-2xl`}
              >
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </motion.button>
            )}

            {proposedTask && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mx-auto max-w-xl glass-card neon-border rounded-[2rem] p-8 space-y-6 relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 opacity-10 rotate-12">
                   <BrainCircuit className="w-32 h-32 text-emerald-500 animate-pulse" />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">{t.unlocked}</span>
                     </div>
                     {proposedTask.difficulty && (
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                          proposedTask.difficulty === 'HARDCORE' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                          proposedTask.difficulty === 'NORMAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {proposedTask.difficulty === 'HARDCORE' ? t.hard : proposedTask.difficulty === 'NORMAL' ? t.normal : t.easy}
                        </div>
                     )}
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">{t.ready}</h3>
                  <div className={`h-1 w-12 ${theme.primary} rounded-full mb-4`} />
                    <p className="text-sm text-neutral-400 leading-relaxed font-medium bg-white/5 p-4 rounded-xl border border-white/5">{proposedTask.question}</p>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmTask}
                    className={`w-full ${theme.primary} hover:${theme.hover} ${theme.text} py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all ${theme.shadowStrong} group border border-white/10`}
                  >
                    <EsclavoIcon className="w-6 h-6 group-hover:scale-125 transition-transform" themeAccent={tA} />
                    {t.accept}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {isLoading && (
               <div className="flex justify-start">
                   <div className="bg-neutral-900 p-10 rounded-[2.5rem] border border-neutral-800 animate-pulse flex gap-4">
                     <div className={`w-3 h-3 bg-${tA}-500 rounded-full animate-bounce`} />
                     <div className={`w-3 h-3 bg-${tA}-500 rounded-full animate-bounce [animation-delay:-.3s]`} />
                     <div className={`w-3 h-3 bg-${tA}-500 rounded-full animate-bounce [animation-delay:-.5s]`} />
                  </div>
               </div>
            )}
          </div>

          <AnimatePresence>
            {showScrollButton && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={scrollToBottom}
                className={`absolute bottom-32 right-12 bg-${tA}-600/80 hover:bg-${tA}-600 text-white backdrop-blur-md p-3 rounded-full shadow-2xl z-30 transition-all border ${theme.border} group active:scale-90`}
              >
                <ChevronDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="p-8 bg-[#0a0a0a]">
             <div className="w-full flex gap-4">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder={t.placeholder}
                  className={`flex-1 bg-black/40 border border-neutral-800/50 rounded-3xl px-8 py-6 focus:outline-none ${theme.borderFocus} transition-all text-xl text-neutral-200 placeholder:text-neutral-700 shadow-2xl backdrop-blur-md`}
                />
                <button 
                  onClick={() => handleChat()}
                  disabled={isLoading}
                  className={`${theme.primary} hover:${theme.hover} disabled:opacity-50 w-24 h-20 rounded-3xl transition-all ${theme.shadow.replace('shadow-', 'shadow-3xl shadow-').replace('/30', '/40')} flex items-center justify-center group active:scale-95 shrink-0`}
                >
                  <Send className="w-8 h-8 text-white transition-transform group-hover:scale-110 group-hover:-rotate-12" />
                </button>
             </div>
          </div>
        </div>

        <aside 
          id="practice-panel" 
          className={`border-l border-neutral-900 ${currentTheme === 'PLASMA' ? 'bg-[#0a001a]' : currentTheme === 'CYBER' ? 'bg-[#000a1a]' : 'bg-[#000d08]'} flex flex-col duration-500 ease-in-out overflow-hidden shadow-2xl relative ${isResizing ? '' : 'transition-[opacity,transform,width]'} ${rightSidebarOpen ? 'opacity-100' : 'w-0 opacity-0 pointer-events-none'} ${currentTourStep === 1 ? `ring-8 ${theme.ring} z-[60] relative shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]` : ''}`}
          style={{ width: rightSidebarOpen ? rightWidth : 0 }}
        >
          {rightSidebarOpen && (
            <div 
              onMouseDown={handleMouseDownRight}
              className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-emerald-600/50 transition-colors z-[100]"
            />
          )}
           <header className="p-8 border-b border-neutral-900 shrink-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black italic uppercase tracking-[0.4em] text-[#10b981]">{t.practiceLab}</h2>
              </div>
              <div className="flex p-1.5 bg-neutral-900/50 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setPracticeTab('active')}
                  className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all ${practiceTab === 'active' ? 'bg-neutral-800 text-white shadow-xl' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  {t.active}
                </button>
                <button 
                  onClick={() => setPracticeTab('history')}
                  className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all ${practiceTab === 'history' ? 'bg-neutral-800 text-white shadow-xl' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  {t.completed}
                </button>
              </div>
           </header>

           <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
              {levelUpMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-600 p-4 rounded-xl mb-4 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="flex items-center gap-3 justify-between">
                    <div>
                      <h3 className="text-xs font-black italic uppercase leading-tight tracking-[0.2em]">{t.levelUpTitle}</h3>
                      <p className="text-[10px] opacity-80 font-bold">{t.levelUp} {stats.level}</p>
                      {stats.level === 2 && (
                        <p className="text-[9px] mt-1 text-emerald-200 font-bold">{t.advancedUnlocked}</p>
                      )}
                    </div>
                    <button onClick={() => setLevelUpMessage(false)} className="bg-white/20 p-1.5 rounded-lg hover:bg-white/30 transition-all">
                      <PlusCircle className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                </motion.div>
              )}
              {practiceTab === 'active' ? (
                dynamicTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-10 px-8 space-y-4 pt-20">
                     <div className="w-16 h-16 border-2 border-dashed border-neutral-800 rounded-2xl flex items-center justify-center">
                        <PlusCircle className="w-6 h-6" />
                     </div>
                     <p className="text-xs font-black uppercase tracking-widest">{t.noActiveMissions}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                     {dynamicTasks.map((task) => (
                      <motion.div 
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0d0d0d] border border-neutral-800 hover:border-neutral-700 rounded-xl p-6 space-y-6 shadow-xl relative group transition-all"
                      >
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                              <span className="text-[8px] font-black font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-500/10">{t.codeChallenge}</span>
                              {task.difficulty && (
                                <span className={`text-[8px] font-black font-mono px-2 py-0.5 rounded uppercase tracking-widest border ${
                                  task.difficulty === 'HARDCORE' ? 'text-rose-500 bg-rose-500/10 border-rose-500/10' :
                                  task.difficulty === 'NORMAL' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10' :
                                  'text-emerald-500 bg-emerald-500/10 border-emerald-500/10'
                                }`}>
                                  {task.difficulty === 'HARDCORE' ? t.hard : task.difficulty === 'NORMAL' ? t.normal : t.easy}
                                </span>
                              )}
                           </div>
                           <p className="text-sm font-bold text-neutral-200 leading-snug">
                              {task.question}
                            </p>
                        </div>

                        <div className="space-y-3">
                          {task.type === 'input' ? (
                            <input 
                              type="text"
                              value={answers[task.id] || ''}
                              onChange={(e) => setAnswers({ ...answers, [task.id]: e.target.value })}
                              className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-neutral-700 transition-all placeholder:text-neutral-800"
                              placeholder={t.answerPlaceholder}
                            />
                          ) : (
                            <div className="relative">
                              <textarea 
                                value={answers[task.id] || ''}
                                onChange={(e) => setAnswers({ ...answers, [task.id]: e.target.value })}
                                className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-4 text-xs h-32 focus:outline-none focus:border-neutral-700 transition-all resize-none font-mono"
                                placeholder={t.codePlaceholder}
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => checkAnswer(task.id)}
                            disabled={checkingTasks[task.id]}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-black py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center group"
                          >
                            {checkingTasks[task.id] ? (
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                              t.check
                            )}
                          </button>
                          
                          <button 
                            onClick={() => setDynamicTasks(prev => prev.filter(t => t.id !== task.id))}
                            className="p-2.5 text-neutral-600 hover:text-rose-500 bg-neutral-900/50 hover:bg-rose-500/10 rounded-lg transition-all border border-neutral-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <AnimatePresence mode="wait">
                          {results[task.id] !== undefined && !checkingTasks[task.id] && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-3 pt-2"
                            >
                              <div className={`p-3 rounded-lg flex items-center gap-3 border text-[10px] font-black uppercase tracking-widest ${results[task.id] ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/5 border-rose-500/20 text-rose-500'}`}>
                                  {results[task.id] ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4 animate-shake" />}
                                  {results[task.id] ? `${t.success} +${stats.lastXP || 100} XP` : t.error}
                              </div>
                              {taskFeedbacks[task.id] && (
                                <div className="space-y-2">
                                  <div className="p-4 bg-black/40 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-400 leading-relaxed italic">
                                     {taskFeedbacks[task.id]}
                                  </div>
                                  {!results[task.id] && (
                                    <button 
                                      onClick={() => handleChat(`${t.explainError} "${answers[task.id]}" -> ${task.question}`)}
                                      className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] uppercase font-black tracking-widest rounded-lg border border-rose-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                      <BrainCircuit className="w-3.5 h-3.5" />
                                      {t.explainFail}
                                    </button>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  {completedTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-10 px-8 space-y-4 pt-20">
                       <Check className="w-12 h-12" />
                     <p className="text-xs font-black uppercase tracking-widest">{t.noCompletedTasks}</p>
                    </div>
                  ) : (
                    completedTasks.map(task => (
                      <div key={task.id} className="p-4 bg-neutral-900/30 border border-neutral-800/50 rounded-xl space-y-2 opacity-60">
                        <div className="flex justify-between items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[8px] font-bold text-neutral-600">{new Date(task.id).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[10px] font-bold text-neutral-400 line-clamp-2">{task.question}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
           </div>
        </aside>
      </main>
      </motion.div>
    )}
    </AnimatePresence>
    <AnimatePresence>
      {showGameCenter && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6"
        >
          <div className="w-full max-w-lg bg-[#0a0a0a] border border-neutral-800 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 blur-sm animate-scanline" />
             <button 
                onClick={() => setShowGameCenter(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400"
             >
                <X className="w-6 h-6" />
             </button>
             
             <div className="space-y-2 mb-10">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Ігровий <span className="text-blue-500">Центр</span></h2>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest italic">Оберіть протокол розваг</p>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => { setActiveGame('jump'); setShowGame(true); setShowGameCenter(false); }}
                  className="group relative p-6 bg-emerald-900/10 border border-emerald-500/20 rounded-3xl hover:bg-emerald-900/20 transition-all text-left space-y-4"
                >
                   <div className="p-3 bg-emerald-600 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-lg shadow-emerald-600/20">
                      <Zap className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white uppercase italic">Огірок Стрибає</h4>
                      <p className="text-[10px] text-neutral-500 font-medium uppercase mt-1 tracking-widest">Platform Jumper</p>
                   </div>
                </button>

                <button 
                  onClick={() => { setActiveGame('invaders'); setShowGame(true); setShowGameCenter(false); }}
                  className="group relative p-6 bg-blue-900/10 border border-blue-500/20 rounded-3xl hover:bg-blue-900/20 transition-all text-left space-y-4"
                >
                   <div className="p-3 bg-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/20">
                      <Shield className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white uppercase italic">Terminal Invaders</h4>
                      <p className="text-[10px] text-neutral-500 font-medium uppercase mt-1 tracking-widest">Space Shooter</p>
                   </div>
                </button>

                <button 
                  onClick={() => { setActiveGame('memory'); setShowGame(true); setShowGameCenter(false); }}
                  className="group relative p-6 bg-purple-900/10 border border-purple-500/20 rounded-3xl hover:bg-purple-900/20 transition-all text-left space-y-4 col-span-2"
                >
                   <div className="p-3 bg-purple-600 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-lg shadow-purple-600/20">
                      <BrainCircuit className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white uppercase italic">{t.memoryGame}</h4>
                      <p className="text-[10px] text-neutral-500 font-medium uppercase mt-1 tracking-widest">Neural Sync Protocol</p>
                   </div>
                </button>
             </div>
             
             <div className="mt-10 pt-10 border-t border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest italic">System Ready</span>
                </div>
                <p className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest font-mono">Build v2.1.0-games</p>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {showGame && activeGame === 'jump' && <DoodleJumpGame onClose={() => setShowGame(false)} />}
      {showGame && activeGame === 'invaders' && <TerminalInvadersGame onClose={() => setShowGame(false)} />}
      {showGame && activeGame === 'memory' && <CodeMemoryGame onClose={() => setShowGame(false)} />}
    </AnimatePresence>
  </div>
);
}

