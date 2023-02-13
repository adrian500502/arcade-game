import { useRef, useEffect } from 'react';
import { addEffect } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import useGame from './useGame.js';

export default function Interface() {
  const timeRef = useRef();

  const phase = useGame((state) => state.phase);
  const restart = useGame((state) => state.restart);

  const forward = useKeyboardControls((state) => state.forward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const backward = useKeyboardControls((state) => state.backward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;

      if (state.phase === 'playing') elapsedTime = Date.now() - state.startTime;
      else if (state.phase === 'ended') elapsedTime = state.endTime - state.startTime;

      if (timeRef.current) timeRef.current.textContent = (elapsedTime / 1000).toFixed(2);
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <div className="interface">
      <div ref={timeRef} className="time">
        0.00
      </div>

      {phase === 'ended' ? (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      ) : null}

      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? 'active' : ''}`}></div>
          <div className={`key ${backward ? 'active' : ''}`}></div>
          <div className={`key ${rightward ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? 'active' : ''}`}></div>
        </div>
      </div>
    </div>
  );
}
