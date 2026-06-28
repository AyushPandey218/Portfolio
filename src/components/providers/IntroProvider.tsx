'use client';

import { useState, useCallback, createContext, useContext } from 'react';
import dynamic from 'next/dynamic';

const IntroOverlay = dynamic(
  () => import('@/components/intro/IntroOverlay'),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 z-50 bg-black" />,
  },
);

interface IntroContextValue {
  replayIntro: () => void;
  showIntro: boolean;
}

const IntroContext = createContext<IntroContextValue>({
  replayIntro: () => {},
  showIntro: true,
});

export function useReplayIntro() {
  return useContext(IntroContext);
}

export default function IntroProvider({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);
  const [replayKey, setReplayKey] = useState(0);

  const handleComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const replayIntro = useCallback(() => {
    localStorage.removeItem('portfolio-intro-played');
    setShowIntro(true);
    setReplayKey((k) => k + 1);
  }, []);

  return (
    <IntroContext.Provider value={{ replayIntro, showIntro }}>
      {showIntro && (
        <IntroOverlay key={replayKey} onComplete={handleComplete} />
      )}
      {children}
    </IntroContext.Provider>
  );
}
