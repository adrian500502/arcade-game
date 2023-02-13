import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { phraseRef, leftAnswersRef, rightAnswersRef } from './Level.js';

export default create(
  subscribeWithSelector((set) => {
    return {
      seed: 0,
      levelsCount: 10,
      difficulty: 1,
      phase: 'ready',
      startTime: 0,
      endTime: 0,
      start: () => set((state) => (state.phase === 'ready' ? { phase: 'playing', startTime: Date.now() } : {})),
      restart: () =>
        set((state) => {
          if (state.phase === 'playing' || state.phase === 'ended') {
            for (let i = 0; i < phraseRef.current.length; i++) {
              phraseRef.current[i].position.y = 0.6;
              leftAnswersRef.current[i].position.y = 0.3;
              rightAnswersRef.current[i].position.y = 0.3;
            }

            return { phase: 'ready', seed: Math.random() };
          }

          return {};
        }),
      end: () => set((state) => (state.phase === 'playing' ? { phase: 'ended', endTime: Date.now() } : {})),
    };
  })
);
