import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { useCelebration } from '@/hooks/useCelebration';
import { CelebrationDto } from '@/types/celebration';


type CelebrationType = {
  celebrations: CelebrationDto[];
  setCelebrations: (celebrations: CelebrationDto[]) => void;
  getCelebration: (docId: string) => CelebrationDto | undefined;
};

export const CelebrationContext = createContext<CelebrationType>({
  celebrations: [],
  setCelebrations: () => {},
  getCelebration: () => undefined,
});

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const { fetchCelebrationList } = useCelebration(currentUser);
  const [celebrations, setCelebrations] = useState<CelebrationDto[]>([]);

  useEffect(() => {
    (async () => {
      const celebrationList = await fetchCelebrationList();
      // console.log('--- CelebrationProvider ---');
      // console.log(currentUser?.uid);
      setCelebrations(celebrationList);
    })();
  }, [currentUser]);

  const getCelebration = (docId: string): CelebrationDto | undefined => {
    return celebrations.find((celebration) => celebration.docId === docId);
  };

  return (
    <CelebrationContext.Provider
      value={{
        celebrations,
        setCelebrations,
        getCelebration,
      }}
    >
      {children}
    </CelebrationContext.Provider>
  );
};
