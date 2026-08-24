import React from 'react';
import { SteadyProvider, useSteady } from './context/SteadyContext';
import { Shell } from './components/layout/Shell';
import { OnboardingWelcome } from './components/screens/OnboardingWelcome';
import { OnboardingRoleSetup } from './components/screens/OnboardingRoleSetup';
import { OnboardingPreferences } from './components/screens/OnboardingPreferences';
import { HomeTodayNow } from './components/screens/HomeTodayNow';
import { TaskBreakdown } from './components/screens/TaskBreakdown';
import { FocusMode } from './components/screens/FocusMode';
import { ProjectsHub } from './components/screens/ProjectsHub';
import { ResourcesHub } from './components/screens/ResourcesHub';
import { DailyReview } from './components/screens/DailyReview';
import { WeeklyInsights } from './components/screens/WeeklyInsights';

/**
 * AppContent Component
 * Swaps between the 10 screen modules based on current activeScreen route in SteadyContext.
 */
const AppContent: React.FC = () => {
  const { activeScreen } = useSteady();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'onboarding-welcome':
        return <OnboardingWelcome />;
      case 'onboarding-roles':
        return <OnboardingRoleSetup />;
      case 'onboarding-prefs':
        return <OnboardingPreferences />;
      case 'home':
        return <HomeTodayNow />;
      case 'breakdown':
        return <TaskBreakdown />;
      case 'focus':
        return <FocusMode />;
      case 'projects':
        return <ProjectsHub />;
      case 'resources':
        return <ResourcesHub />;
      case 'review':
        return <DailyReview />;
      case 'insights':
        return <WeeklyInsights />;
      default:
        return <HomeTodayNow />;
    }
  };

  return <Shell>{renderScreen()}</Shell>;
};

/**
 * Root Application Component
 * Wraps the entire application shell with SteadyProvider context.
 */
export const App: React.FC = () => {
  return (
    <SteadyProvider>
      <AppContent />
    </SteadyProvider>
  );
};

export default App;
