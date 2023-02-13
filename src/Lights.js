import { Fragment, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lights() {
  const directionalLightRef = useRef();

  useFrame((state) => {
    directionalLightRef.current.position.z = state.camera.position.z + 1 - 4;
    directionalLightRef.current.target.position.z = state.camera.position.z - 4;
    directionalLightRef.current.target.updateMatrixWorld();
  });

  return (
    <Fragment>
      <directionalLight
        ref={directionalLightRef}
        intensity={1.3}
        position={[3, 3, 1]}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.1}
        shadow-camera-far={25}
        shadow-camera-top={25}
        shadow-camera-left={-25}
        shadow-camera-bottom={-25}
        shadow-camera-right={25}
        castShadow
      />
      <ambientLight intensity={0.4} />
    </Fragment>
  );
}
