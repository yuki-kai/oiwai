import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { useCelebration } from '@/hooks/useCelebration';
import { CelebrationDto } from '@/types/celebration';


type CelebrationType = {
  celebrations: CelebrationDto[];
};

export const CelebrationContext = createContext<CelebrationType>({ celebrations: [] });

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const { fetchCelebrationList } = useCelebration(currentUser);
  const [celebrations, setCelebrations] = useState<CelebrationDto[]>([]);

  useEffect(() => {
    (async () => {
      const celebrationList = await fetchCelebrationList();
      console.log('--- CelebrationProvider ---');
      console.log(currentUser?.uid);
      setCelebrations(celebrationList);
    })();
  }, [currentUser]);

  return (
    <CelebrationContext.Provider
      value={{
        celebrations,
      }}
    >
      {children}
    </CelebrationContext.Provider>
  );
};
