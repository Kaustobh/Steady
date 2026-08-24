import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfile,
  Task,
  Project,
  Resource,
  DailyReview,
  WeeklyInsight,
  ActiveScreen,
  ThemeMode,
  DomainType,
  InterruptionLog
} from '../types';
import { savePersistentState, loadPersistentState, exportUserDataJSON } from '../utils/storage';

interface SteadyContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (
    name: string,
    roles: UserProfile['roles'],
    domains: UserProfile['domains'],
    prefs: UserProfile['preferences']
  ) => void;
  
  // Dynamic Task CRUD
  tasks: Task[];
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  activeTask: Task | undefined;
  addTask: (taskData: Omit<Task, 'id' | 'status' | 'priorityScore' | 'substeps' | 'resources' | 'interruptions' | 'createdAt'>) => void;
  deleteTask: (taskId: string) => void;
  startFocusOnTask: (taskId: string) => void;
  toggleSubstep: (taskId: string, substepId: string) => void;
  autoSplitTask: (taskId: string, newSteps: string[]) => void;
  deferTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  logInterruption: (taskId: string, reason: InterruptionLog['reason']) => void;
  
  // Projects CRUD
  projects: Project[];
  addProject: (name: string, domain: DomainType, nextMilestone: string) => void;
  deleteProject: (projectId: string) => void;

  // Resources CRUD
  resources: Resource[];
  addResource: (resourceData: Omit<Resource, 'id'>) => void;
  deleteResource: (resourceId: string) => void;
  attachResourceToTask: (resourceId: string, taskId: string) => void;
  toggleVerifyResource: (resourceId: string) => void;
  
  // Review & Insights
  dailyReviews: DailyReview[];
  submitDailyReview: (review: Omit<DailyReview, 'id' | 'date'>) => void;
  weeklyInsights: WeeklyInsight[];
  
  // Active Focus Session State
  focusSecondsRemaining: number;
  isFocusRunning: boolean;
  startFocusTimer: () => void;
  pauseFocusTimer: () => void;
  resetFocusTimer: () => void;
  addExtraFocusMinutes: (mins: number) => void;
  
  // Data Export & Reset
  exportData: () => string;
  resetDemoData: () => void;
}

const defaultUser: UserProfile = {
  name: '',
  roles: [],
  domains: ['Work', 'Study', 'Life'],
  preferences: {
    dayPredictability: 'Unpredictable',
    helpFocusArea: 'Prioritizing',
    suggestionStyle: 'Balanced',
  },
  onboardingCompleted: false,
};

const SteadyContext = createContext<SteadyContextType | undefined>(undefined);

export const SteadyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return loadPersistentState<ThemeMode>('steady_theme', 'light');
  });

  // User state
  const [user, setUser] = useState<UserProfile>(() => {
    return loadPersistentState<UserProfile>('steady_user', defaultUser);
  });

  // Active Screen — Always start at onboarding screen as requested
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('onboarding-welcome');

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    return loadPersistentState<Task[]>('steady_tasks', []);
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    return tasks.length > 0 ? tasks[0].id : null;
  });

  // Projects & Resources
  const [projects, setProjects] = useState<Project[]>(() => {
    return loadPersistentState<Project[]>('steady_projects', []);
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    return loadPersistentState<Resource[]>('steady_resources', []);
  });

  // Reviews
  const [dailyReviews, setDailyReviews] = useState<DailyReview[]>(() => {
    return loadPersistentState<DailyReview[]>('steady_reviews', []);
  });

  // Active Focus Session State
  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks[0];
  const [focusSecondsRemaining, setFocusSecondsRemaining] = useState<number>(
    (activeTask?.durationMins || 20) * 60
  );
  const [isFocusRunning, setIsFocusRunning] = useState<boolean>(false);

  // Compute Weekly Insights Dynamically based strictly on user data
  const computeWeeklyInsights = (): WeeklyInsight[] => {
    const totalCompleted = tasks.filter(t => t.status === 'completed').length;
    const totalInterruptions = tasks.reduce((sum, t) => sum + (t.interruptions?.length || 0), 0);
    const deferredCount = tasks.filter(t => t.status === 'deferred').length;

    return [
      {
        id: 'ins-dyn-1',
        title: totalInterruptions > 0 ? 'Interruption Patterns' : 'Focus Consistency',
        metric: totalInterruptions > 0 ? `${totalInterruptions} recorded pauses` : 'High Stability',
        description: totalInterruptions > 0
          ? 'Logging interruptions helps identify external noise and protect your high-energy focus windows.'
          : 'You have maintained smooth focus sessions with minimal distraction pauses.',
        recommendation: 'Schedule 20-minute micro-focus blocks during unpredictable shifts.',
        actionableCTA: 'Auto-adjust focus window recommendations'
      },
      {
        id: 'ins-dyn-2',
        title: 'Task Execution Rate',
        metric: `${totalCompleted} tasks completed`,
        description: totalCompleted > 0
          ? `You have completed ${totalCompleted} priority actions using Steady.`
          : 'Complete your first task to start building daily momentum metrics.',
        recommendation: 'Keep tasks under 30 minutes to reduce starting friction.'
      },
      {
        id: 'ins-dyn-3',
        title: 'Task Friction Alert',
        metric: deferredCount > 0 ? `${deferredCount} deferred` : 'Low Friction',
        description: deferredCount > 0
          ? 'Tasks deferred often need breakdown into smaller 5-minute steps.'
          : 'You are moving through tasks cleanly without excessive postponements.',
        recommendation: 'Use the 1-tap Auto-Split helper whenever a task feels intimidating.',
        actionableCTA: 'Enable auto-breakdown helper'
      }
    ];
  };

  const weeklyInsights = computeWeeklyInsights();

  // DOM theme sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    savePersistentState('steady_theme', theme);
  }, [theme]);

  // Storage persistence sync
  useEffect(() => {
    savePersistentState('steady_user', user);
  }, [user]);

  useEffect(() => {
    savePersistentState('steady_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    savePersistentState('steady_projects', projects);
  }, [projects]);

  useEffect(() => {
    savePersistentState('steady_resources', resources);
  }, [resources]);

  useEffect(() => {
    savePersistentState('steady_reviews', dailyReviews);
  }, [dailyReviews]);

  // Focus Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isFocusRunning && focusSecondsRemaining > 0) {
      interval = setInterval(() => {
        setFocusSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (focusSecondsRemaining === 0 && isFocusRunning) {
      setIsFocusRunning(false);
      if (activeTaskId) {
        completeTask(activeTaskId);
      }
    }
    return () => clearInterval(interval);
  }, [isFocusRunning, focusSecondsRemaining, activeTaskId]);

  useEffect(() => {
    if (activeTask) {
      setFocusSecondsRemaining(activeTask.durationMins * 60);
      setIsFocusRunning(false);
    }
  }, [activeTaskId]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const completeOnboarding = (
    name: string,
    roles: UserProfile['roles'],
    domains: UserProfile['domains'],
    preferences: UserProfile['preferences']
  ) => {
    setUser({
      name: name.trim() || 'User',
      roles: roles.length > 0 ? roles : ['General'],
      domains: domains.length > 0 ? domains : ['Work', 'Life'],
      preferences,
      onboardingCompleted: true,
    });
    setActiveScreen('home');
  };

  const addTask = (taskData: Omit<Task, 'id' | 'status' | 'priorityScore' | 'substeps' | 'resources' | 'interruptions' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      status: 'pending',
      priorityScore: 85 + Math.floor(Math.random() * 10),
      substeps: [
        { id: `sub-${Date.now()}-1`, title: 'Initial preparation', isDone: false },
        { id: `sub-${Date.now()}-2`, title: 'Core action execution', isDone: false }
      ],
      resources: [],
      interruptions: [],
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setActiveTaskId(newTask.id);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskId === taskId) {
      const remaining = tasks.filter(t => t.id !== taskId);
      setActiveTaskId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const startFocusOnTask = (taskId: string) => {
    setActiveTaskId(taskId);
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      setFocusSecondsRemaining(target.durationMins * 60);
    }
    setIsFocusRunning(true);
    setActiveScreen('focus');
  };

  const toggleSubstep = (taskId: string, substepId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          substeps: t.substeps.map(s =>
            s.id === substepId ? { ...s, isDone: !s.isDone } : s
          ),
        };
      })
    );
  };

  const autoSplitTask = (taskId: string, newStepTitles: string[]) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const addedSubsteps = newStepTitles.map((title, idx) => ({
          id: `gen-${Date.now()}-${idx}`,
          title,
          isDone: false,
        }));
        return {
          ...t,
          substeps: [...t.substeps, ...addedSubsteps],
        };
      })
    );
  };

  const deferTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'deferred',
          priorityScore: Math.max(10, t.priorityScore - 20),
        };
      })
    );
  };

  const completeTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'completed',
          substeps: t.substeps.map(s => ({ ...s, isDone: true })),
        };
      })
    );
    setIsFocusRunning(false);
  };

  const logInterruption = (taskId: string, reason: InterruptionLog['reason']) => {
    const newLog: InterruptionLog = {
      id: `int-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reason,
    };
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          interruptions: [...t.interruptions, newLog],
        };
      })
    );
  };

  const addProject = (name: string, domain: DomainType, nextMilestone: string) => {
    const newProj: Project = {
      id: `p-${Date.now()}`,
      name,
      domain,
      progress: 0,
      nextMilestone,
      activeTasksCount: 0,
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const addResource = (resourceData: Omit<Resource, 'id'>) => {
    const newRes: Resource = {
      ...resourceData,
      id: `r-${Date.now()}`,
    };
    setResources(prev => [newRes, ...prev]);
  };

  const deleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
  };

  const attachResourceToTask = (resourceId: string, taskId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        if (t.resources.some(r => r.id === resourceId)) return t;
        return {
          ...t,
          resources: [...t.resources, resource],
        };
      })
    );
  };

  const toggleVerifyResource = (resourceId: string) => {
    setResources(prev =>
      prev.map(r => {
        if (r.id !== resourceId) return r;
        const nextState = !r.isVerified;
        return {
          ...r,
          isVerified: nextState,
          tagBadges: nextState
            ? Array.from(new Set(['Verified by me', ...r.tagBadges]))
            : r.tagBadges.filter(b => b !== 'Verified by me'),
        };
      })
    );
  };

  const submitDailyReview = (reviewData: Omit<DailyReview, 'id' | 'date'>) => {
    const newRev: DailyReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setDailyReviews(prev => [newRev, ...prev]);
  };

  const startFocusTimer = () => setIsFocusRunning(true);
  const pauseFocusTimer = () => setIsFocusRunning(false);
  const resetFocusTimer = () => {
    setIsFocusRunning(false);
    if (activeTask) {
      setFocusSecondsRemaining(activeTask.durationMins * 60);
    }
  };

  const addExtraFocusMinutes = (mins: number) => {
    setFocusSecondsRemaining(prev => prev + mins * 60);
  };

  const exportData = () => {
    return exportUserDataJSON(user, tasks, projects, resources, dailyReviews);
  };

  const resetDemoData = () => {
    setUser(defaultUser);
    setTasks([]);
    setProjects([]);
    setResources([]);
    setDailyReviews([]);
    setActiveTaskId(null);
    setActiveScreen('onboarding-welcome');
    localStorage.clear();
  };

  return (
    <SteadyContext.Provider
      value={{
        theme,
        toggleTheme,
        activeScreen,
        setActiveScreen,
        user,
        updateUserProfile,
        completeOnboarding,
        tasks,
        activeTaskId,
        setActiveTaskId,
        activeTask,
        addTask,
        deleteTask,
        startFocusOnTask,
        toggleSubstep,
        autoSplitTask,
        deferTask,
        completeTask,
        logInterruption,
        projects,
        addProject,
        deleteProject,
        resources,
        addResource,
        deleteResource,
        attachResourceToTask,
        toggleVerifyResource,
        dailyReviews,
        submitDailyReview,
        weeklyInsights,
        focusSecondsRemaining,
        isFocusRunning,
        startFocusTimer,
        pauseFocusTimer,
        resetFocusTimer,
        addExtraFocusMinutes,
        exportData,
        resetDemoData,
      }}
    >
      {children}
    </SteadyContext.Provider>
  );
};

export const useSteady = () => {
  const context = useContext(SteadyContext);
  if (!context) {
    throw new Error('useSteady must be used within a SteadyProvider');
  }
  return context;
};
