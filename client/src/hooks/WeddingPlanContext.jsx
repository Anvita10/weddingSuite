import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Api } from '../api/client.js';

const WeddingPlanContext = createContext(null);

const DEFAULT_PLAN = {
  coupleNames: '',
  guests: 300,
  functions: ['Wedding', 'Reception'],
  foodPreference: 'Both',
  decorStyle: 'Royal',
  roomsNeeded: 12,
  preferredDate: '',
};

export function WeddingPlanProvider({ children }) {
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [estimate, setEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const updatePlan = useCallback((patch) => {
    setPlan((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }, []);

  const toggleFunction = useCallback((fn) => {
    setPlan((prev) => {
      const has = prev.functions.includes(fn);
      const functions = has ? prev.functions.filter((f) => f !== fn) : [...prev.functions, fn];
      return { ...prev, functions: functions.length ? functions : prev.functions };
    });
    setSaved(false);
  }, []);

  const refreshEstimate = useCallback(async () => {
    if (!plan.functions.length) return;
    setEstimateLoading(true);
    try {
      const data = await Api.getEstimate({
        guests: plan.guests,
        functions: plan.functions,
        decorStyle: plan.decorStyle,
        roomsNeeded: plan.roomsNeeded,
      });
      setEstimate(data);
    } catch (err) {
      console.error('Failed to fetch estimate', err);
    } finally {
      setEstimateLoading(false);
    }
  }, [plan.guests, plan.functions, plan.decorStyle, plan.roomsNeeded]);

  const value = useMemo(
    () => ({
      plan,
      updatePlan,
      toggleFunction,
      estimate,
      estimateLoading,
      refreshEstimate,
      saved,
      setSaved,
    }),
    [plan, updatePlan, toggleFunction, estimate, estimateLoading, refreshEstimate, saved]
  );

  return <WeddingPlanContext.Provider value={value}>{children}</WeddingPlanContext.Provider>;
}

export function useWeddingPlan() {
  const ctx = useContext(WeddingPlanContext);
  if (!ctx) throw new Error('useWeddingPlan must be used within WeddingPlanProvider');
  return ctx;
}
