import { Fragment } from 'react';
import { Physics } from '@react-three/rapier';
import useGame from './useGame.js';
import Level from './Level.js';
import Ball from './Ball.js';
import Lights from './Lights.js';

export default function Experience() {
  const seed = useGame((state) => state.seed);
  const levelsCount = useGame((state) => state.levelsCount);
  const difficulty = useGame((state) => state.difficulty);

  return (
    <Fragment>
      <color args={['#bdedfc']} attach="background"></color>

      <Physics>
        <Level levelsCount={levelsCount} difficulty={difficulty} seed={seed} />
        <Ball />
      </Physics>

      <Lights />
    </Fragment>
  );
}
