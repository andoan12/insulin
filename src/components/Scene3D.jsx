import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Html,
  Float,
  Sparkles,
  Environment,
  ContactShadows,
  RoundedBox,
  Cylinder,
  Torus,
  Sphere
} from '@react-three/drei';
import * as THREE from 'three';

/**
 * Helper function for smooth linear interpolation
 */
const damp = (current, target, lambda, delta) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta));

/**
 * 3D High-Contrast Classroom Label Badge inside the 3D Canvas
 */
function Label3D({ position, title, subtitle, color = 'cyan', visible = true, onClick, pulse = false }) {
  if (!visible) return null;

  const colorStyles = {
    emerald: 'border-emerald-400/90 bg-slate-950/90 text-emerald-300 shadow-emerald-500/20',
    cyan: 'border-cyan-400/90 bg-slate-950/90 text-cyan-300 shadow-cyan-500/20',
    rose: 'border-rose-400/90 bg-slate-950/90 text-rose-300 shadow-rose-500/20',
    amber: 'border-amber-400/90 bg-slate-950/90 text-amber-300 shadow-amber-500/20',
    violet: 'border-violet-400/90 bg-slate-950/90 text-violet-300 shadow-violet-500/20',
    gold: 'border-yellow-400/90 bg-slate-950/90 text-yellow-200 shadow-yellow-500/20'
  };

  return (
    <Html position={position} center distanceFactor={11} zIndexRange={[10, 0]}>
      <div
        onClick={onClick}
        className={`px-3.5 py-2 rounded-xl border-2 backdrop-blur-md shadow-xl transition-transform duration-200 whitespace-nowrap select-none ${
          colorStyles[color] || colorStyles.cyan
        } ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : 'pointer-events-none'} ${
          pulse ? 'animate-bounce' : ''
        }`}
      >
        <div className="text-sm md:text-base font-extrabold tracking-wide leading-tight flex items-center gap-2">
          {pulse && <span className="inline-block w-2.5 h-2.5 rounded-full bg-current animate-ping" />}
          <span>{title}</span>
        </div>
        {subtitle && (
          <div className="text-xs font-semibold text-slate-200/90 mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
    </Html>
  );
}

/**
 * Circular Plasmid Ring with Base-Pair Rungs & Optional Inserted Insulin Gene Segment
 * Supports partial arc (when cut open by restriction enzymes)
 */
function PlasmidModel({
  radius = 1.25,
  tube = 0.095,
  isCut = false,
  hasInsulinInsert = false,
  insertProgress = 0, // 0 = separate, 1 = inserted
  showStickyEnds = false,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
  highlight = false
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Main plasmid arc: full circle (2*PI) or cut open (1.55*PI, leaving 0.45*PI gap at top-right)
  const mainArc = isCut || hasInsulinInsert ? Math.PI * 1.55 : Math.PI * 2;
  const gapArc = Math.PI * 2 - mainArc;

  // Generate base-pair rungs along the plasmid arc
  const rungs = useMemo(() => {
    const count = isCut || hasInsulinInsert ? 22 : 28;
    const items = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const angle = t * mainArc;
      items.push({
        angle,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        color: i % 2 === 0 ? '#34d399' : '#38bdf8'
      });
    }
    return items;
  }, [mainArc, radius, isCut, hasInsulinInsert]);

  // Generate base-pair rungs for the inserted human insulin gene segment
  const insertRungs = useMemo(() => {
    const count = 8;
    const items = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const angle = mainArc + t * gapArc;
      items.push({
        angle,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        color: i % 2 === 0 ? '#fb7185' : '#facc15'
      });
    }
    return items;
  }, [mainArc, gapArc, radius]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z += delta * 0.18;
  });

  return (
    <group
      position={position}
      rotation={rotation}
      scale={hovered && onClick ? scale * 1.07 : scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      onPointerOver={(e) => {
        if (onClick) {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <group ref={groupRef}>
        {/* Outer & inner backbone strands simulated via Torus */}
        <mesh>
          <torusGeometry args={[radius, tube, 24, 96, mainArc]} />
          <meshStandardMaterial
            color={hovered || highlight ? '#2dd4bf' : '#10b981'}
            emissive={hovered || highlight ? '#059669' : '#065f46'}
            emissiveIntensity={hovered || highlight ? 0.85 : 0.45}
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>

        {/* Secondary inner ring for double-strand visual depth */}
        <mesh>
          <torusGeometry args={[radius * 0.86, tube * 0.72, 20, 96, mainArc]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.15}
          />
        </mesh>

        {/* Base-pair rungs connecting outer and inner rings */}
        {rungs.map((r, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(r.angle) * (radius * 0.93), Math.sin(r.angle) * (radius * 0.93), 0]}
            rotation={[0, 0, r.angle + Math.PI / 2]}
          >
            <cylinderGeometry args={[0.025, 0.025, radius * 0.14, 8]} />
            <meshStandardMaterial
              color={r.color}
              emissive={r.color}
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}

        {/* Sticky Ends (Đầu dính) teeth when Plasmid is cut open */}
        {showStickyEnds && (isCut || (hasInsulinInsert && insertProgress < 0.9)) && (
          <>
            {/* Sticky end 1 at angle = 0 */}
            <group position={[radius, -0.05, 0]}>
              <mesh position={[0, -0.08, 0]}>
                <boxGeometry args={[0.14, 0.22, 0.14]} />
                <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.9} />
              </mesh>
            </group>
            {/* Sticky end 2 at angle = mainArc */}
            <group
              position={[Math.cos(mainArc) * radius * 0.86, Math.sin(mainArc) * radius * 0.86, 0]}
              rotation={[0, 0, mainArc]}
            >
              <mesh position={[0, 0.08, 0]}>
                <boxGeometry args={[0.14, 0.22, 0.14]} />
                <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.9} />
              </mesh>
            </group>
          </>
        )}

        {/* Inserted Human Insulin Gene Segment (Rose/Gold) */}
        {hasInsulinInsert && (
          <group
            position={[
              (1 - insertProgress) * 2.2,
              (1 - insertProgress) * 0.9,
              (1 - insertProgress) * 0.4
            ]}
          >
            <mesh rotation={[0, 0, mainArc]}>
              <torusGeometry args={[radius, tube * 1.12, 24, 48, gapArc]} />
              <meshStandardMaterial
                color="#f43f5e"
                emissive="#e11d48"
                emissiveIntensity={0.85}
                roughness={0.2}
                metalness={0.25}
              />
            </mesh>
            <mesh rotation={[0, 0, mainArc]}>
              <torusGeometry args={[radius * 0.86, tube * 0.85, 20, 48, gapArc]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#d97706"
                emissiveIntensity={0.75}
                roughness={0.25}
              />
            </mesh>
            {insertRungs.map((r, idx) => (
              <mesh
                key={idx}
                position={[
                  Math.cos(r.angle) * (radius * 0.93),
                  Math.sin(r.angle) * (radius * 0.93),
                  0
                ]}
                rotation={[0, 0, r.angle + Math.PI / 2]}
              >
                <cylinderGeometry args={[0.03, 0.03, radius * 0.14, 8]} />
                <meshStandardMaterial
                  color={r.color}
                  emissive={r.color}
                  emissiveIntensity={0.9}
                />
              </mesh>
            ))}

            {/* Glowing weld rings when insertProgress is near 1 */}
            {insertProgress > 0.85 && (
              <>
                <mesh position={[radius * 0.93, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.22, 0.035, 16, 32]} />
                  <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={1.5} />
                </mesh>
                <mesh
                  position={[
                    Math.cos(mainArc) * radius * 0.93,
                    Math.sin(mainArc) * radius * 0.93,
                    0
                  ]}
                  rotation={[Math.PI / 2, mainArc, 0]}
                >
                  <torusGeometry args={[0.22, 0.035, 16, 32]} />
                  <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={1.5} />
                </mesh>
              </>
            )}
          </group>
        )}
      </group>
    </group>
  );
}

/**
 * 3D Human DNA Double Helix Segment containing the Insulin Gene
 */
function HumanDNAModel({
  position = [0, 0, 0],
  isExcised = false,
  scale = 1,
  onClick
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const basePairs = useMemo(() => {
    const pairs = [];
    const total = 18;
    for (let i = 0; i < total; i++) {
      const y = (i - (total - 1) / 2) * 0.24;
      const angle = i * 0.52;
      const isInsulinRegion = i >= 5 && i <= 12;
      pairs.push({
        y,
        angle,
        isInsulinRegion,
        x1: Math.cos(angle) * 0.42,
        z1: Math.sin(angle) * 0.42,
        x2: Math.cos(angle + Math.PI) * 0.42,
        z2: Math.sin(angle + Math.PI) * 0.42
      });
    }
    return pairs;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group
      position={position}
      scale={hovered && onClick ? scale * 1.06 : scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      onPointerOver={(e) => {
        if (onClick) {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <group ref={groupRef}>
        {basePairs.map((bp, idx) => {
          // If cut/excised, flanking non-insulin segments drift away vertically
          const offsetY = isExcised
            ? bp.isInsulinRegion
              ? 0
              : bp.y > 0
              ? 1.15
              : -1.15
            : 0;
          const opacity = isExcised && !bp.isInsulinRegion ? 0.25 : 1;

          const strandColor1 = bp.isInsulinRegion ? '#f43f5e' : '#64748b';
          const strandColor2 = bp.isInsulinRegion ? '#fbbf24' : '#475569';
          const rungColor = bp.isInsulinRegion ? '#38bdf8' : '#94a3b8';

          return (
            <group key={idx} position={[0, bp.y + offsetY, 0]}>
              {/* Strand 1 node */}
              <mesh position={[bp.x1, 0, bp.z1]}>
                <sphereGeometry args={[bp.isInsulinRegion ? 0.11 : 0.085, 16, 16]} />
                <meshStandardMaterial
                  color={strandColor1}
                  emissive={strandColor1}
                  emissiveIntensity={bp.isInsulinRegion ? 0.8 : 0.15}
                  transparent
                  opacity={opacity}
                />
              </mesh>
              {/* Strand 2 node */}
              <mesh position={[bp.x2, 0, bp.z2]}>
                <sphereGeometry args={[bp.isInsulinRegion ? 0.11 : 0.085, 16, 16]} />
                <meshStandardMaterial
                  color={strandColor2}
                  emissive={strandColor2}
                  emissiveIntensity={bp.isInsulinRegion ? 0.8 : 0.15}
                  transparent
                  opacity={opacity}
                />
              </mesh>
              {/* Hydrogen-bonded base pair rung */}
              <mesh rotation={[0, -bp.angle, Math.PI / 2]}>
                <cylinderGeometry args={[0.032, 0.032, 0.84, 8]} />
                <meshStandardMaterial
                  color={rungColor}
                  emissive={rungColor}
                  emissiveIntensity={bp.isInsulinRegion ? 0.65 : 0.1}
                  transparent
                  opacity={opacity}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

/**
 * 3D E. coli Bacterium Cell Model
 * Features outer translucent capsule wall, inner cytoplasmic membrane, tangled chromosomal nucleoid,
 * waving flagella, and surface pili.
 */
function EColiCellModel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isPermeable = false,
  isRecombinant = false,
  onClick,
  children
}) {
  const cellRef = useRef();
  const flagellaRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Tangled chromosomal DNA curve inside E. coli
  const nucleoidGeometry = useMemo(() => {
    const pts = [];
    const loops = 65;
    for (let i = 0; i <= loops; i++) {
      const t = (i / loops) * Math.PI * 2;
      const x = -0.55 + Math.sin(t * 3) * 0.55 + Math.cos(t * 2) * 0.2;
      const y = Math.sin(t * 5) * 0.42;
      const z = Math.cos(t * 4) * 0.42;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    return new THREE.TubeGeometry(curve, 140, 0.038, 8, true);
  }, []);

  // Flagella curves trailing from the left pole of the bacterium
  const flagellaGeometries = useMemo(() => {
    return [-0.35, 0, 0.35, 0.18].map((offsetY, idx) => {
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        pts.push(
          new THREE.Vector3(
            -1.95 - t * 2.1,
            offsetY + Math.sin(t * Math.PI * 3 + idx) * 0.25,
            (idx - 1.5) * 0.18 + Math.cos(t * Math.PI * 3 + idx) * 0.2
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      return new THREE.TubeGeometry(curve, 36, 0.022, 6, false);
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (flagellaRef.current) {
      flagellaRef.current.rotation.x = Math.sin(t * 4) * 0.12;
      flagellaRef.current.rotation.z = Math.cos(t * 3) * 0.08;
    }
  });

  return (
    <group
      ref={cellRef}
      position={position}
      rotation={rotation}
      scale={hovered && onClick ? scale * 1.04 : scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      onPointerOver={(e) => {
        if (onClick) {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Outer Capsule Wall (rotated 90deg on Z so capsule lies horizontally) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[1.08, 1.9, 24, 36]} />
        <meshPhysicalMaterial
          color={isRecombinant ? '#06b6d4' : isPermeable ? '#38bdf8' : '#10b981'}
          emissive={isRecombinant ? '#0891b2' : isPermeable ? '#0284c7' : '#047857'}
          emissiveIntensity={hovered ? 0.55 : isPermeable ? 0.5 : 0.22}
          roughness={0.2}
          metalness={0.05}
          transmission={0.55}
          transparent
          opacity={0.42}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Cytoplasmic Membrane */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.96, 1.78, 20, 32]} />
        <meshStandardMaterial
          color="#064e3b"
          emissive="#065f46"
          emissiveIntensity={0.25}
          transparent
          opacity={0.22}
          wireframe={isPermeable}
        />
      </mesh>

      {/* Tangled Chromosomal DNA (ADN vùng nhân) on the left side of the cell */}
      <mesh geometry={nucleoidGeometry} position={[-0.35, 0, 0]}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.55}
          roughness={0.35}
        />
      </mesh>

      {/* Ribosomes (tiny granules inside cytoplasm) */}
      {[
        [-0.9, 0.5, 0.3],
        [-0.2, -0.55, 0.4],
        [0.4, 0.6, -0.3],
        [0.9, -0.45, 0.25],
        [-1.1, -0.3, -0.4],
        [0.1, 0.45, 0.55]
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshStandardMaterial color="#a7f3d0" emissive="#34d399" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Waving Flagella (Tiên mao) */}
      <group ref={flagellaRef}>
        {flagellaGeometries.map((geo, i) => (
          <mesh key={i} geometry={geo}>
            <meshStandardMaterial
              color="#6ee7b7"
              emissive="#10b981"
              emissiveIntensity={0.35}
            />
          </mesh>
        ))}
      </group>

      {/* Child components inside or attached to the cell (e.g. Plasmid) */}
      {children}
    </group>
  );
}

/**
 * 3D Molecular Scissors: Restriction Enzyme (Enzyme Giới Hạn Restrictase - EcoRI)
 */
function RestrictionEnzymeModel({ position = [0, 0, 0], isCutting = false, onClick }) {
  const leftBladeRef = useRef();
  const rightBladeRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const angle = isCutting ? Math.abs(Math.sin(t * 7)) * 0.45 : 0.3 + Math.sin(t * 2.5) * 0.1;
    if (leftBladeRef.current && rightBladeRef.current) {
      leftBladeRef.current.rotation.z = angle;
      rightBladeRef.current.rotation.z = -angle;
    }
  });

  return (
    <group
      position={position}
      scale={hovered && onClick ? 1.12 : 1}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      onPointerOver={(e) => {
        if (onClick) {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Left catalytic subunit */}
      <group ref={leftBladeRef}>
        <mesh position={[-0.18, 0.22, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.16, 0.45, 16, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={isCutting ? 1.1 : 0.6}
            roughness={0.25}
          />
        </mesh>
      </group>
      {/* Right catalytic subunit */}
      <group ref={rightBladeRef}>
        <mesh position={[0.18, 0.22, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.16, 0.45, 16, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={isCutting ? 1.1 : 0.6}
            roughness={0.25}
          />
        </mesh>
      </group>
      {/* Hinge core */}
      <mesh position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

/**
 * 3D Enzyme DNA Ligase Complex ("Molecular Glue / Welder")
 */
function LigaseEnzymeModel({ position = [0, 0, 0], active = false, onClick }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * (active ? 3.2 : 1.0);
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 3) * 0.2;
    }
  });

  return (
    <group
      ref={ref}
      position={position}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <mesh>
        <torusGeometry args={[0.32, 0.11, 16, 32]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#9333ea"
          emissiveIntensity={active ? 1.1 : 0.55}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.18, 1]} />
        <meshStandardMaterial color="#fde047" emissive="#eab308" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

/**
 * STEP 1 SCENE: Extract Plasmid from E. coli & Isolate Human Insulin Gene
 */
function Step1ExtractScene({ actionDone, onTriggerAction, showLabels }) {
  const plasmidGroupRef = useRef();
  const cellGroupRef = useRef();

  useFrame((_, delta) => {
    if (!plasmidGroupRef.current || !cellGroupRef.current) return;
    // When actionDone is false, Plasmid sits inside E. coli at [0.55, 0, 0]
    // When actionDone is true, Plasmid detaches and moves out to [0.5, 0.15, 1.35] and scales up
    const targetX = actionDone ? 0.35 : -1.05;
    const targetY = actionDone ? 0.1 : 0.0;
    const targetZ = actionDone ? 1.15 : 0.0;
    const targetScale = actionDone ? 1.05 : 0.58;

    plasmidGroupRef.current.position.x = damp(plasmidGroupRef.current.position.x, targetX, 4, delta);
    plasmidGroupRef.current.position.y = damp(plasmidGroupRef.current.position.y, targetY, 4, delta);
    plasmidGroupRef.current.position.z = damp(plasmidGroupRef.current.position.z, targetZ, 4, delta);

    const s = damp(plasmidGroupRef.current.scale.x, targetScale, 4, delta);
    plasmidGroupRef.current.scale.setScalar(s);

    // Gently shift E. coli left when Plasmid is extracted
    const cellTargetX = actionDone ? -2.35 : -1.6;
    cellGroupRef.current.position.x = damp(cellGroupRef.current.position.x, cellTargetX, 3.5, delta);
  });

  return (
    <group>
      {/* Left/Center: E. coli Bacterium */}
      <group ref={cellGroupRef} position={[-1.6, 0, 0]}>
        <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.3}>
          <EColiCellModel onClick={onTriggerAction} />
        </Float>
        <Label3D
          visible={showLabels}
          position={[-0.2, 1.65, 0]}
          title="Tế bào vi khuẩn E. coli"
          subtitle="Chứa ADN vùng nhân & các Plasmid vòng"
          color="emerald"
          onClick={onTriggerAction}
        />
        <Label3D
          visible={showLabels}
          position={[-0.45, -1.5, 0.2]}
          title="ADN vùng nhân"
          subtitle="Phân tử ADN lớn của vi khuẩn"
          color="cyan"
        />
      </group>

      {/* Detachable Circular Plasmid DNA */}
      <group ref={plasmidGroupRef} position={[-1.05, 0, 0]} scale={0.58}>
        <PlasmidModel
          radius={1.15}
          onClick={onTriggerAction}
          highlight={!actionDone}
        />
        <Label3D
          visible={showLabels}
          position={[0, -1.65, 0]}
          title={actionDone ? 'Thể truyền Plasmid (Đã tách chiết)' : 'Plasmid (Nhấp để tách ra!)'}
          subtitle="ADN vòng nhỏ, tự nhân đôi độc lập"
          color="emerald"
          pulse={!actionDone}
          onClick={onTriggerAction}
        />
      </group>

      {/* Right: Human DNA Segment containing the Insulin Gene */}
      <group position={[2.85, 0.1, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          <HumanDNAModel onClick={onTriggerAction} />
        </Float>
        <Label3D
          visible={showLabels}
          position={[0, 2.35, 0]}
          title="ADN Tế bào tuyến tụy người"
          subtitle="Đoạn màu hồng/vàng: Gen mã hóa Insulin"
          color="rose"
        />
      </group>
    </group>
  );
}

/**
 * STEP 2 SCENE: Restriction Enzymes (Restrictase) Cut Plasmid & Human Insulin Gene
 */
function Step2CutScene({ actionDone, onTriggerAction, showLabels }) {
  const enzyme1Ref = useRef();
  const enzyme2Ref = useRef();

  useFrame((_, delta) => {
    if (!enzyme1Ref.current || !enzyme2Ref.current) return;
    // Enzyme 1 moves to Plasmid cut site
    const e1TargetX = actionDone ? -0.75 : -1.65;
    const e1TargetY = actionDone ? 0.85 : 2.15;
    enzyme1Ref.current.position.x = damp(enzyme1Ref.current.position.x, e1TargetX, 4.5, delta);
    enzyme1Ref.current.position.y = damp(enzyme1Ref.current.position.y, e1TargetY, 4.5, delta);

    // Enzyme 2 moves to Human DNA insulin flanking site
    const e2TargetX = actionDone ? 2.1 : 2.25;
    const e2TargetY = actionDone ? 0.65 : 2.35;
    enzyme2Ref.current.position.x = damp(enzyme2Ref.current.position.x, e2TargetX, 4.5, delta);
    enzyme2Ref.current.position.y = damp(enzyme2Ref.current.position.y, e2TargetY, 4.5, delta);
  });

  return (
    <group>
      {/* Left: Circular Plasmid getting cut open */}
      <group position={[-1.75, -0.1, 0]}>
        <PlasmidModel
          radius={1.35}
          isCut={actionDone}
          showStickyEnds={actionDone}
          onClick={onTriggerAction}
        />
        <Label3D
          visible={showLabels}
          position={[0, -1.9, 0]}
          title={actionDone ? 'Plasmid đã cắt mở vòng' : 'Thể truyền Plasmid nguyên vẹn'}
          subtitle={actionDone ? 'Xuất hiện 2 Đầu dính (Sticky ends) màu vàng' : 'Nhấp để cắt bằng Enzyme Restrictase'}
          color="emerald"
          onClick={onTriggerAction}
        />
      </group>

      {/* Restriction Enzyme 1 above Plasmid */}
      <group ref={enzyme1Ref} position={[-1.65, 2.15, 0.3]}>
        <RestrictionEnzymeModel isCutting={actionDone} onClick={onTriggerAction} />
        <Label3D
          visible={showLabels}
          position={[0, 0.85, 0]}
          title="Enzyme giới hạn (Restrictase)"
          subtitle="Kéo phân tử cắt đặc hiệu tạo đầu dính"
          color="amber"
          pulse={!actionDone}
          onClick={onTriggerAction}
        />
      </group>

      {/* Restriction Enzyme 2 above Human DNA */}
      <group ref={enzyme2Ref} position={[2.25, 2.35, 0.3]}>
        <RestrictionEnzymeModel isCutting={actionDone} onClick={onTriggerAction} />
      </group>

      {/* Right: Human DNA getting cleaved to isolate the Insulin Gene */}
      <group position={[2.15, -0.1, 0]}>
        <HumanDNAModel isExcised={actionDone} onClick={onTriggerAction} />
        <Label3D
          visible={showLabels}
          position={[0, -2.15, 0]}
          title={actionDone ? 'Gen Insulin người (Đã cắt rời)' : 'ADN người chứa Gen Insulin'}
          subtitle={actionDone ? 'Có đầu dính bổ sung với Plasmid' : 'Cắt bởi cùng loại Enzyme Restrictase'}
          color="rose"
          onClick={onTriggerAction}
        />
      </group>

      {/* Cleavage sparkles when cut */}
      {actionDone && (
        <>
          <Sparkles position={[-0.8, 0.8, 0.2]} count={35} scale={1.8} size={4} speed={1.2} color="#facc15" />
          <Sparkles position={[2.1, 0, 0.2]} count={35} scale={2.2} size={4} speed={1.2} color="#fb7185" />
        </>
      )}
    </group>
  );
}

/**
 * STEP 3 SCENE: Recombine Plasmid + Human Insulin Gene via DNA Ligase
 */
function Step3RecombineScene({ actionDone, onTriggerAction, showLabels }) {
  const [insertProgress, setInsertProgress] = useState(0);
  const ligase1Ref = useRef();
  const ligase2Ref = useRef();

  useFrame((_, delta) => {
    const target = actionDone ? 1 : 0;
    const next = damp(insertProgress, target, 3.8, delta);
    if (Math.abs(next - insertProgress) > 0.001) {
      setInsertProgress(next);
    }

    if (ligase1Ref.current && ligase2Ref.current) {
      // Ligase complexes move onto the two splice junctions when actionDone is true
      const l1Target = actionDone ? [1.25, 0.55, 0.35] : [1.9, 1.85, 0.5];
      const l2Target = actionDone ? [0.45, 1.35, 0.35] : [-1.5, 1.95, 0.5];

      ligase1Ref.current.position.x = damp(ligase1Ref.current.position.x, l1Target[0], 4, delta);
      ligase1Ref.current.position.y = damp(ligase1Ref.current.position.y, l1Target[1], 4, delta);
      ligase1Ref.current.position.z = damp(ligase1Ref.current.position.z, l1Target[2], 4, delta);

      ligase2Ref.current.position.x = damp(ligase2Ref.current.position.x, l2Target[0], 4, delta);
      ligase2Ref.current.position.y = damp(ligase2Ref.current.position.y, l2Target[1], 4, delta);
      ligase2Ref.current.position.z = damp(ligase2Ref.current.position.z, l2Target[2], 4, delta);
    }
  });

  return (
    <group>
      {/* Center: Recombinant Plasmid Assembly */}
      <group position={[-0.2, -0.1, 0]}>
        <PlasmidModel
          radius={1.55}
          tube={0.11}
          isCut={!actionDone}
          hasInsulinInsert={true}
          insertProgress={insertProgress}
          showStickyEnds={true}
          onClick={onTriggerAction}
        />

        <Label3D
          visible={showLabels}
          position={[0, -2.1, 0]}
          title={
            actionDone
              ? 'ADN Tái Tổ Hợp (Plasmid tái tổ hợp)'
              : 'Plasmid mở vòng + Đoạn Gen Insulin người'
          }
          subtitle={
            actionDone
              ? 'Đã gắn kết bền vững bằng liên kết phosphodiester'
              : 'Nhấp để ghép nối bằng Enzyme DNA Ligase!'
          }
          color={actionDone ? 'rose' : 'cyan'}
          pulse={!actionDone}
          onClick={onTriggerAction}
        />

        {!actionDone && (
          <Label3D
            visible={showLabels}
            position={[2.9, 1.25, 0]}
            title="Gen Insulin người"
            subtitle="Đang di chuyển vào vị trí đầu dính"
            color="rose"
            onClick={onTriggerAction}
          />
        )}
      </group>

      {/* DNA Ligase Enzyme Complexes */}
      <group ref={ligase1Ref} position={[1.9, 1.85, 0.5]}>
        <LigaseEnzymeModel active={actionDone} onClick={onTriggerAction} />
        <Label3D
          visible={showLabels}
          position={[0.2, 0.75, 0]}
          title="Enzyme DNA Ligase"
          subtitle="Hồ dán phân tử nối liền 2 đầu ADN"
          color="violet"
          onClick={onTriggerAction}
        />
      </group>

      <group ref={ligase2Ref} position={[-1.5, 1.95, 0.5]}>
        <LigaseEnzymeModel active={actionDone} onClick={onTriggerAction} />
      </group>

      {actionDone && (
        <Sparkles position={[0.4, 0.5, 0.2]} count={50} scale={3.2} size={5} speed={1.5} color="#fde047" />
      )}
    </group>
  );
}

/**
 * STEP 4 SCENE: Transform Recombinant Plasmid back into Host E. coli Cell
 */
function Step4TransformScene({ actionDone, onTriggerAction, showLabels }) {
  const plasmidWrapRef = useRef();

  useFrame((_, delta) => {
    if (!plasmidWrapRef.current) return;
    // Moves from outside left [-2.55, 0.2, 0.8] into the E. coli cell [1.35, 0.05, 0.2]
    const targetX = actionDone ? 1.25 : -2.45;
    const targetY = actionDone ? 0.05 : 0.15;
    const targetZ = actionDone ? 0.15 : 0.65;
    const targetScale = actionDone ? 0.52 : 0.92;

    plasmidWrapRef.current.position.x = damp(plasmidWrapRef.current.position.x, targetX, 3.6, delta);
    plasmidWrapRef.current.position.y = damp(plasmidWrapRef.current.position.y, targetY, 3.6, delta);
    plasmidWrapRef.current.position.z = damp(plasmidWrapRef.current.position.z, targetZ, 3.6, delta);

    const s = damp(plasmidWrapRef.current.scale.x, targetScale, 3.6, delta);
    plasmidWrapRef.current.scale.setScalar(s);
  });

  return (
    <group>
      {/* Recombinant Plasmid traveling into E. coli */}
      <group ref={plasmidWrapRef} position={[-2.45, 0.15, 0.65]} scale={0.92}>
        <PlasmidModel
          radius={1.15}
          hasInsulinInsert={true}
          insertProgress={1}
          onClick={onTriggerAction}
        />
        <Label3D
          visible={showLabels}
          position={[0, -1.65, 0]}
          title={actionDone ? 'Plasmid tái tổ hợp (Đã vào tế bào)' : 'Plasmid tái tổ hợp'}
          subtitle={actionDone ? 'Bắt đầu nhân bản & biểu hiện Gen Insulin' : 'Nhấp để biến nạp vào tế bào E. coli'}
          color="rose"
          pulse={!actionDone}
          onClick={onTriggerAction}
        />
      </group>

      {/* Recipient E. coli Cell on the Right */}
      <group position={[0.85, 0, 0]}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.25}>
          <EColiCellModel
            scale={1.12}
            isPermeable={!actionDone}
            isRecombinant={actionDone}
            onClick={onTriggerAction}
          />
        </Float>

        <Label3D
          visible={showLabels}
          position={[0.2, 1.85, 0]}
          title={
            actionDone
              ? 'Vi khuẩn E. coli chuyển gen (Tái tổ hợp)'
              : 'Tế bào nhận E. coli (Xử lý CaCl₂ & Sốc nhiệt)'
          }
          subtitle={
            actionDone
              ? 'Đã mang Plasmid chứa Gen Insulin người'
              : 'Màng sinh chất giãn nở tạo lỗ nhỏ cho ADN đi qua'
          }
          color="cyan"
          onClick={onTriggerAction}
        />

        {/* Expressed Insulin granules glowing when transformed */}
        {actionDone && (
          <group>
            <Sparkles position={[0.4, 0, 0.5]} count={45} scale={2.8} size={5} speed={1.6} color="#38bdf8" />
            {[
              [0.9, 0.5, 0.8],
              [1.2, -0.4, 0.7],
              [0.3, -0.6, 0.9],
              [1.5, 0.2, 0.5]
            ].map((pos, i) => (
              <Float key={i} speed={3} floatIntensity={0.6}>
                <mesh position={pos}>
                  <octahedronGeometry args={[0.14, 2]} />
                  <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={1.2} />
                </mesh>
              </Float>
            ))}
          </group>
        )}
      </group>
    </group>
  );
}

/**
 * Mini E. coli Cell for inside the 3D Bioreactor Tank in Step 5
 */
function MiniRecombinantBacterium({ basePos, phase, speed = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + phase;
    if (ref.current) {
      ref.current.position.x = basePos[0] + Math.sin(t * 1.3) * 0.25;
      ref.current.position.y = basePos[1] + Math.cos(t * 1.1) * 0.22;
      ref.current.position.z = basePos[2] + Math.sin(t * 0.9) * 0.25;
      ref.current.rotation.z = Math.sin(t) * 0.35;
      ref.current.rotation.y = t * 0.6;
    }
  });

  return (
    <group ref={ref} position={basePos}>
      {/* Mini capsule body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.15, 0.28, 12, 16]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.5}
          transparent
          opacity={0.78}
        />
      </mesh>
      {/* Mini glowing recombinant plasmid ring inside */}
      <mesh position={[0.06, 0, 0]}>
        <torusGeometry args={[0.08, 0.022, 8, 20]} />
        <meshStandardMaterial color="#f43f5e" emissive="#fb7185" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

/**
 * STEP 5 SCENE: 3D Bioreactor Tank (Nồi lên men sinh học), Bacteria Replication & Insulin Purification
 */
function Step5BioreactorScene({ actionDone, onTriggerAction, showLabels }) {
  const impellerRef = useRef();
  const insulinStreamRef = useRef();

  // Positions for bacteria inside the bioreactor tank
  const bacteriaList = useMemo(() => {
    const initial = [
      [-1.3, 0.35, 0.2],
      [-0.7, -0.35, -0.2],
      [-1.1, -0.75, 0.35]
    ];
    const replicated = [
      [-1.3, 0.35, 0.2],
      [-0.7, -0.35, -0.2],
      [-1.1, -0.75, 0.35],
      [-0.45, 0.55, 0.35],
      [-1.55, -0.2, -0.3],
      [-0.95, 0.85, -0.25],
      [-0.55, -0.85, 0.25],
      [-1.45, 0.75, -0.15],
      [-0.85, 0.05, 0.55],
      [-1.25, -0.45, -0.45]
    ];
    return actionDone ? replicated : initial;
  }, [actionDone]);

  useFrame((_, delta) => {
    if (impellerRef.current) {
      impellerRef.current.rotation.y += delta * (actionDone ? 6.5 : 1.8);
    }
  });

  return (
    <group>
      {/* LEFT / CENTER: 3D Industrial Bioreactor Tank (Nồi lên men) */}
      <group position={[-1.0, -0.1, 0]} onClick={onTriggerAction}>
        {/* Top Stainless Steel Dome Cap */}
        <mesh position={[0, 1.75, 0]}>
          <cylinderGeometry args={[1.45, 1.55, 0.32, 36]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Motor housing on top of Bioreactor */}
        <mesh position={[0, 2.15, 0]}>
          <cylinderGeometry args={[0.42, 0.48, 0.55, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Bottom Stainless Steel Base */}
        <mesh position={[0, -1.75, 0]}>
          <cylinderGeometry args={[1.55, 1.35, 0.35, 36]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Central Rotating Impeller Shaft & Rushton Turbine Blades */}
        <group ref={impellerRef}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 3.2, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Upper & Lower 4-blade impellers */}
          {[-0.65, 0.55].map((yPos, idx) => (
            <group key={idx} position={[0, yPos, 0]}>
              <mesh>
                <boxGeometry args={[1.15, 0.16, 0.06]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[1.15, 0.16, 0.06]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Nutrient Culture Medium inside the tank */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[1.38, 1.38, 2.95, 36]} />
          <meshPhysicalMaterial
            color={actionDone ? '#0891b2' : '#0d9488'}
            emissive={actionDone ? '#0e7490' : '#115e59'}
            emissiveIntensity={actionDone ? 0.45 : 0.2}
            transmission={0.65}
            transparent
            opacity={0.32}
            roughness={0.15}
          />
        </mesh>

        {/* Outer Borosilicate Glass Cylinder Vessel */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.48, 1.48, 3.25, 36, 1, true]} />
          <meshPhysicalMaterial
            color="#e2e8f0"
            transmission={0.85}
            transparent
            opacity={0.24}
            roughness={0.08}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Rising Oxygen Aeration & Insulin Protein Sparkles inside tank */}
        <Sparkles
          position={[0, -0.1, 0]}
          count={actionDone ? 90 : 30}
          scale={[2.2, 2.7, 2.2]}
          size={actionDone ? 4.5 : 2.5}
          speed={actionDone ? 1.8 : 0.7}
          color={actionDone ? '#fde047' : '#67e8f9'}
        />

        <Label3D
          visible={showLabels}
          position={[0, 2.75, 0]}
          title="Nồi lên men sinh học (Bioreactor)"
          subtitle={
            actionDone
              ? 'E. coli nhân đôi cấp số nhân & tiết Protein Insulin'
              : 'Nhấp để khởi động nhân sinh khối E. coli!'
          }
          color="violet"
          pulse={!actionDone}
          onClick={onTriggerAction}
        />
      </group>

      {/* Recombinant E. coli Bacteria swimming inside the Bioreactor */}
      {bacteriaList.map((pos, idx) => (
        <MiniRecombinantBacterium
          key={idx}
          basePos={pos}
          phase={idx * 1.7}
          speed={actionDone ? 1.8 : 0.8}
        />
      ))}

      {/* Extraction Pipeline connecting Bioreactor to Purified Insulin Vial */}
      <mesh position={[1.15, -0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 1.8, 16]} />
        <meshStandardMaterial
          color={actionDone ? '#38bdf8' : '#475569'}
          emissive={actionDone ? '#0284c7' : '#1e293b'}
          emissiveIntensity={actionDone ? 0.8 : 0.2}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>

      {/* RIGHT: Purified Human Insulin Medical Vial & Molecular Crystals */}
      <group position={[2.55, -0.35, 0]} onClick={onTriggerAction}>
        {/* Medical Vial Glass Body */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 1.75, 32]} />
          <meshPhysicalMaterial
            color="#bae6fd"
            transmission={0.8}
            transparent
            opacity={0.38}
            roughness={0.1}
          />
        </mesh>

        {/* Purified Golden-Cyan Insulin Liquid inside Vial (fills up when actionDone) */}
        <mesh
          position={[0, actionDone ? -0.32 : -0.82, 0]}
          scale={[1, actionDone ? 1 : 0.25, 1]}
        >
          <cylinderGeometry args={[0.61, 0.61, 1.35, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={actionDone ? 0.95 : 0.35}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Vial Neck & Cap */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.32, 0.45, 0.25, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.2, 24]} />
          <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.5} />
        </mesh>

        {/* Floating 3D Purified Insulin Hormone Hexamer Crystals above the Vial */}
        {actionDone && (
          <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.5}>
            <group position={[0, 1.65, 0]} ref={insulinStreamRef}>
              <mesh>
                <dodecahedronGeometry args={[0.36, 0]} />
                <meshStandardMaterial
                  color="#fde047"
                  emissive="#eab308"
                  emissiveIntensity={1.1}
                  roughness={0.15}
                  metalness={0.4}
                />
              </mesh>
              <mesh rotation={[0.5, 0.5, 0]}>
                <torusGeometry args={[0.52, 0.04, 16, 32]} />
                <meshStandardMaterial color="#38bdf8" emissive="#06b6d4" emissiveIntensity={1} />
              </mesh>
            </group>
          </Float>
        )}

        <Label3D
          visible={showLabels}
          position={[0, -1.55, 0]}
          title={actionDone ? 'Insulin Người Tinh Khiết' : 'Bình thu hoạch & Tinh sạch'}
          subtitle={
            actionDone
              ? 'Sẵn sàng điều chế thuốc trị bệnh tiểu đường'
              : 'Chờ dịch chiết xuất từ nồi lên men'
          }
          color={actionDone ? 'gold' : 'cyan'}
          onClick={onTriggerAction}
        />
      </group>
    </group>
  );
}

/**
 * Main Exported 3D Canvas Wrapper
 */
export default function Scene3D({
  currentStep,
  actionDone,
  onTriggerAction,
  showLabels,
  orbitResetKey
}) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [0, 0.6, 7.2], fov: 44 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#060d1f']} />
        <fog attach="fog" args={['#060d1f', 11, 24]} />

        {/* Classroom-optimized high-contrast studio lighting */}
        <ambientLight intensity={0.85} />
        <directionalLight position={[6, 8, 6]} intensity={1.8} castShadow />
        <directionalLight position={[-6, -4, -4]} intensity={0.65} color="#38bdf8" />
        <pointLight position={[0, 3, 4]} intensity={1.1} color="#a7f3d0" />

        {/* Subtle ambient bio-particles in background */}
        <Sparkles count={45} scale={12} size={1.8} speed={0.25} opacity={0.3} color="#38bdf8" />

        {/* Active Step 3D Scene */}
        <group position={[0, 0.1, 0]}>
          {currentStep === 1 && (
            <Step1ExtractScene
              actionDone={actionDone}
              onTriggerAction={onTriggerAction}
              showLabels={showLabels}
            />
          )}
          {currentStep === 2 && (
            <Step2CutScene
              actionDone={actionDone}
              onTriggerAction={onTriggerAction}
              showLabels={showLabels}
            />
          )}
          {currentStep === 3 && (
            <Step3RecombineScene
              actionDone={actionDone}
              onTriggerAction={onTriggerAction}
              showLabels={showLabels}
            />
          )}
          {currentStep === 4 && (
            <Step4TransformScene
              actionDone={actionDone}
              onTriggerAction={onTriggerAction}
              showLabels={showLabels}
            />
          )}
          {currentStep === 5 && (
            <Step5BioreactorScene
              actionDone={actionDone}
              onTriggerAction={onTriggerAction}
              showLabels={showLabels}
            />
          )}
        </group>

        <ContactShadows
          position={[0, -2.75, 0]}
          opacity={0.45}
          scale={14}
          blur={2.4}
          far={4.5}
        />

        <OrbitControls
          key={orbitResetKey}
          makeDefault
          enablePan={true}
          enableZoom={true}
          minDistance={3.5}
          maxDistance={12}
          maxPolarAngle={Math.PI * 0.78}
          minPolarAngle={Math.PI * 0.2}
        />
      </Canvas>
    </div>
  );
}
