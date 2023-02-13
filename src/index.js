import './style.css';
import ReactDOM from 'react-dom/client';
import { Fog, PCFSoftShadowMap } from 'three';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Experience from './Experience.js';
import Interface from './Interface.js';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
  <KeyboardControls
    map={[
      { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
      { name: 'leftward', keys: ['KeyA', 'ArrowLeft'] },
      { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
      { name: 'rightward', keys: ['KeyD', 'ArrowRight'] },
      { name: 'jump', keys: ['Space'] },
    ]}
  >
    <Canvas
      onCreated={(state) => (state.scene.fog = new Fog('#bdedfc', 6, 8))}
      camera={{
        fov: 50,
        near: 0.1,
        far: 30,
        position: [0, 5, 8],
      }}
      shadows={{ type: PCFSoftShadowMap }}
    >
      <Experience />
    </Canvas>

    <Interface />
  </KeyboardControls>
);
