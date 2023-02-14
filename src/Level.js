import { ColorManagement, BoxGeometry, MeshStandardMaterial } from 'three';
import { useMemo, useRef, Fragment } from 'react';
import { Float, Text, useGLTF } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import phrasesData from './Phrases.js';

ColorManagement.legacyMode = false;

let phraseRef, leftAnswersRef, rightAnswersRef;
const boxGeometry = new BoxGeometry(1, 1, 1);
const startEndFloorMaterial = new MeshStandardMaterial({ color: '#104A8E' });
const jumpFloorMaterial = new MeshStandardMaterial({ color: '#26ABFF' });

export function StartFloor({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.2} rotationIntensity={0.2}>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          scale={0.3}
          maxWidth={5}
          maxHeight={2}
          textAlign="center"
          position={[-1.0, 0.15, -0.5]}
          rotation-y={Math.PI / 9}
          color="orange"
          outlineWidth={0.02}
        >
          START
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <RigidBody type="fixed" restitution={0.5} friction={0.2}>
        <mesh
          geometry={boxGeometry}
          material={startEndFloorMaterial}
          position={[0, -0.1, 0]}
          scale={[4, 0.25, 4]}
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function JumpFloor({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={jumpFloorMaterial}
        position={[-1, -0.1, 0]}
        scale={[1.25, 0.2, 1.25]}
        receiveShadow
      />
      <mesh
        geometry={boxGeometry}
        material={jumpFloorMaterial}
        position={[1, -0.1, 0]}
        scale={[1.25, 0.2, 1.25]}
        receiveShadow
      />
    </group>
  );
}

export function FinishFloor({ position = [0, 0, 0] }) {
  const crown = useGLTF('./golden_crown.glb');
  crown.scene.traverse((mesh) => mesh.type === 'Mesh' && (mesh.castShadow = true));

  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          scale={0.8}
          position={[0, 2, 2]}
          color="orange"
          outlineWidth={0.02}
        >
          FINISH
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <RigidBody type="fixed" restitution={0.5} friction={0.2}>
        <mesh
          geometry={boxGeometry}
          material={startEndFloorMaterial}
          position={[0, -0.1, 0]}
          scale={[4, 0.25, 4]}
          receiveShadow
        />
      </RigidBody>

      <RigidBody position={[0, 0.3, 0]} type="fixed" colliders={'trimesh'} restitution={0.5} friction={0}>
        <primitive object={crown.scene} scale={[0.75, 0.9, 0.75]} />
      </RigidBody>
    </group>
  );
}

export default function Level({ levelsCount = 5, difficulty = 0, seed = 0 }) {
  phraseRef = useRef([]);
  leftAnswersRef = useRef([]);
  rightAnswersRef = useRef([]);
  let pickedPhrases = [];

  useMemo(() => {
    let filteredPhrases = JSON.parse(JSON.stringify(phrasesData)).filter((t) => t.difficulty === difficulty);
    pickedPhrases = [];

    for (let i = 0; i < levelsCount; i++) {
      const pick = filteredPhrases[Math.floor(Math.random() * filteredPhrases.length)];
      pick.selected = true;
      pickedPhrases.push(pick);

      filteredPhrases = filteredPhrases.filter((phrases) => !phrases.selected);
    }
  }, [levelsCount, difficulty, seed]);

  return (
    <Fragment>
      <StartFloor position={[0, 0, 0]} />

      {[...Array(levelsCount)].map((val, idx, arr) => {
        const correctAnswer = pickedPhrases[idx].correctAnswer;
        const incorrectAnswer = pickedPhrases[idx].incorrectAnswer;
        const randomAnswer = Math.random() > 0.5 ? correctAnswer : incorrectAnswer;
        const otherAnswer = randomAnswer === correctAnswer ? incorrectAnswer : correctAnswer;

        return (
          <Fragment key={idx}>
            <JumpFloor position={[0, 0, -(idx * 2 + 3.5)]} />

            <Text
              ref={(phrase) => (phraseRef.current[idx] = phrase)}
              font="./bebas-neue-v9-latin-regular.woff"
              scale={0.18}
              maxWidth={5}
              maxHeight={2}
              textAlign="center"
              position={[0, 0.6, -(idx * 2 + 3.5)]}
              color={`hsl(${Math.random() * 360}, 100%, 50%)`}
              outline="black"
              outlineWidth={0.1}
            >
              {`${pickedPhrases[idx].phrase}`}
              <meshBasicMaterial toneMapped={false} />
            </Text>

            <Float floatIntensity={0.02} rotationIntensity={0.02}>
              <Text
                ref={(answer) => (leftAnswersRef.current[idx] = answer)}
                font="./bebas-neue-v9-latin-regular.woff"
                scale={0.15}
                maxWidth={5}
                maxHeight={5}
                textAlign="left"
                position={[-1, 0.3, -(idx * 2 + 3.5)]}
                color="white"
                outline="black"
                outlineWidth={0.1}
              >
                {randomAnswer}
                <meshBasicMaterial toneMapped={false} />
              </Text>
            </Float>

            {randomAnswer === correctAnswer && (
              <CuboidCollider
                args={[0.625, 0.1, 0.625]}
                position={[-1, -0.1, -(idx * 2 + 3.5)]}
                restitution={0.5}
                onCollisionEnter={() => {
                  phraseRef.current[idx].position.y = 20;
                  leftAnswersRef.current[idx].position.y = 20;
                  rightAnswersRef.current[idx].position.y = 20;
                }}
              />
            )}

            <Float floatIntensity={0.02} rotationIntensity={0.02}>
              <Text
                ref={(answer) => (rightAnswersRef.current[idx] = answer)}
                font="./bebas-neue-v9-latin-regular.woff"
                scale={0.15}
                maxWidth={5}
                maxHeight={5}
                textAlign="right"
                position={[1, 0.3, -(idx * 2 + 3.5)]}
                outline="black"
                outlineWidth={0.1}
              >
                {otherAnswer}
                <meshBasicMaterial toneMapped={false} />
              </Text>
            </Float>

            {otherAnswer === correctAnswer && (
              <CuboidCollider
                args={[0.625, 0.1, 0.625]}
                position={[1, -0.1, -(idx * 2 + 3.5)]}
                restitution={0.5}
                onCollisionEnter={() => {
                  phraseRef.current[idx].position.y = 20;
                  leftAnswersRef.current[idx].position.y = 20;
                  rightAnswersRef.current[idx].position.y = 20;
                }}
              />
            )}
          </Fragment>
        );
      })}

      <FinishFloor position={[0, 0, -(levelsCount * 2 + 5)]} />
    </Fragment>
  );
}

export { phraseRef, leftAnswersRef, rightAnswersRef };
