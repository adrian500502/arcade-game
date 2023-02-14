import { Vector3 } from 'three';
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, useRapier } from '@react-three/rapier';
import useGame from './useGame';

export default function Ball() {
  const ballRef = useRef();
  const [subscribeKeys, getKeysState] = useKeyboardControls();
  const {
    rapier: { Ray },
    world: { raw },
  } = useRapier();

  const [smoothedCameraPosition] = useState(() => new Vector3(0, 8, 8));
  const [smoothedCameraTarget] = useState(() => new Vector3());

  const start = useGame((state) => state.start);
  const restart = useGame((state) => state.restart);
  const end = useGame((state) => state.end);
  const levelsCount = useGame((state) => state.levelsCount);

  const jump = () => {
    const origin = ballRef.current.translation();
    origin.y -= 0.21;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new Ray(origin, direction);
    const collision = raw().castRay(ray, 10, true);
    collision.toi < 0.1 && ballRef.current.applyImpulse({ x: 0, y: 0.15, z: 0 });
  };

  const reset = () => {
    ballRef.current.setTranslation({ x: 0, y: 1, z: 0 });
    ballRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    ballRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (phrase) => {
        if (phrase === 'ready') reset();
      }
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (jumping) => {
        if (jumping) jump();
      }
    );

    const unsubscribeAnyKey = subscribeKeys(() => {
      start();
    });

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAnyKey();
    };
  }, []);

  useFrame((state, delta) => {
    /**
     * Player movement
     */
    const { forward, backward, leftward, rightward } = getKeysState();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = delta * 0.15;
    const torqueStrength = delta * 0.05;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    ballRef.current.applyImpulse(impulse);
    ballRef.current.applyTorqueImpulse(torque);

    /**
     * Camera movement
     */
    const ballPosition = ballRef.current.translation();
    const newCameraPosition = new Vector3();
    newCameraPosition.copy(ballPosition);
    newCameraPosition.z += 3;
    newCameraPosition.y += 0.85;

    const newCameraTarget = new Vector3();
    newCameraTarget.copy(ballPosition);
    newCameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(newCameraPosition, delta * 5);
    smoothedCameraTarget.lerp(newCameraTarget, delta * 5);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    if (ballPosition.y < -4) restart();
    if (ballPosition.z < -(levelsCount * 2 + 3) && ballPosition.y > 0.2) end();
  });

  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
      linearDamping={2}
      angularDamping={2}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial flatShading color="orange" />
      </mesh>
    </RigidBody>
  );
}
