import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AndeanIntro() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    let renderer;
    let frame = 0;
    let cleanup = () => {};
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2('#1c2922', 0.045);
      const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
      camera.position.set(0, 0.35, 12.5);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));
      renderer.setClearColor('#1c2922', 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);

      const sceneGroup = new THREE.Group();
      scene.add(sceneGroup);
      const textileGroup = new THREE.Group();
      sceneGroup.add(textileGroup);

      const palette = ['#dba84c', '#b95e42', '#80906c', '#e7d7b5', '#78958b'];
      const ambient = new THREE.AmbientLight('#f4dfb5', 1.8);
      scene.add(ambient);
      const keyLight = new THREE.PointLight('#dfac61', 25, 35);
      keyLight.position.set(3, 4, 8);
      scene.add(keyLight);

      // Sun disk + concentric rings: a procedural geometric motif, not a downloaded asset.
      const sunGroup = new THREE.Group();
      sunGroup.position.set(2.7, 1.65, -2.1);
      sceneGroup.add(sunGroup);
      const sun = new THREE.Mesh(
        new THREE.CircleGeometry(1.12, 72),
        new THREE.MeshBasicMaterial({ color: '#d9a74e', transparent: true, opacity: 0.92 })
      );
      sunGroup.add(sun);
      [1.34, 1.58, 1.82].forEach((r, index) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(r, index === 1 ? 0.018 : 0.01, 6, 96),
          new THREE.MeshBasicMaterial({ color: index === 1 ? '#b85d43' : '#e7d7b5', transparent: true, opacity: 0.74 })
        );
        ring.position.z = -0.02 * (index + 1);
        sunGroup.add(ring);
      });

      // Low polygon mountain ridge in layered muted Andean colors.
      const ridgeShapes = [
        { points: [[-8, -2.4], [-5.5, 0.1], [-4.3, -1.0], [-2.1, 1.0], [0.2, -1.4], [2.6, 0.2], [4.1, -1.0], [6.5, 0.3], [8, -1.7], [8, -5], [-8, -5]], color: '#586f59', z: -3.7, opacity: 0.4 },
        { points: [[-8, -3.0], [-6.4, -1.8], [-4.8, -2.4], [-2.4, -1.7], [-0.4, -2.7], [2.3, -1.9], [4, -2.5], [6.3, -1.9], [8, -2.8], [8, -5], [-8, -5]], color: '#b65e43', z: -3.1, opacity: 0.32 },
      ];
      ridgeShapes.forEach(({ points, color, z, opacity }) => {
        const shape = new THREE.Shape();
        shape.moveTo(points[0][0], points[0][1]);
        points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
        shape.closePath();
        const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide }));
        mesh.position.z = z;
        sceneGroup.add(mesh);
      });

      // Woven warp/weft curves create a moving, textile-like surface.
      const curveCount = 34;
      const sampleCount = 126;
      for (let row = 0; row < curveCount; row += 1) {
        const positions = [];
        const yBase = (row - (curveCount - 1) / 2) * 0.105;
        for (let i = 0; i < sampleCount; i += 1) {
          const x = -6.7 + (13.4 * i) / (sampleCount - 1);
          const wave = Math.sin(x * 0.73 + row * 0.23) * 0.3 + Math.cos(x * 0.31 - row * 0.16) * 0.16;
          const z = Math.sin(x * 0.52 + row * 0.14) * 0.7 + Math.cos(row * 0.32) * 0.24;
          positions.push(x, yBase + wave, z);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const material = new THREE.LineBasicMaterial({ color: palette[row % palette.length], transparent: true, opacity: row % 4 === 0 ? 0.86 : 0.42 });
        textileGroup.add(new THREE.Line(geometry, material));
      }
      for (let col = 0; col < 53; col += 1) {
        const positions = [];
        const xBase = (col - 26) * 0.25;
        for (let i = 0; i < 54; i += 1) {
          const y = -2.7 + (5.4 * i) / 53;
          const x = xBase + Math.sin(y * 1.05 + col * 0.21) * 0.18;
          const z = Math.cos(y * 0.88 + col * 0.13) * 0.34;
          positions.push(x, y, z + 0.1);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const material = new THREE.LineBasicMaterial({ color: palette[(col + 2) % palette.length], transparent: true, opacity: col % 7 === 0 ? 0.72 : 0.22 });
        textileGroup.add(new THREE.Line(geometry, material));
      }

      // A stepped diamond motif at the center; the shape deliberately stays abstract.
      const motif = new THREE.Group();
      motif.position.set(-1.6, 0.05, 1.1);
      sceneGroup.add(motif);
      for (let layer = 0; layer < 4; layer += 1) {
        const size = 1.25 - layer * 0.23;
        const shape = new THREE.BufferGeometry();
        const v = new Float32Array([
          0, size, 0, size * 0.78, 0, 0,
          size * 0.78, 0, 0, 0, -size, 0,
          0, -size, 0, -size * 0.78, 0, 0,
          -size * 0.78, 0, 0, 0, size, 0,
        ]);
        shape.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
        motif.add(new THREE.LineSegments(shape, new THREE.LineBasicMaterial({ color: palette[layer], transparent: true, opacity: 0.75 - layer * 0.08 })));
      }

      // A subtle quipu-inspired group gives the product a distinct Andean visual identity.
      // The cords and knots are abstract decorative geometry, not a reconstruction of a historical record.
      const quipuGroup = new THREE.Group();
      quipuGroup.position.set(3.95, -0.05, -0.55);
      sceneGroup.add(quipuGroup);
      const cordColors = ['#d9ad58', '#b95e42', '#88a07b', '#e6d6b8', '#72968d'];
      for (let cord = 0; cord < 5; cord += 1) {
        const x = (cord - 2) * 0.34;
        const curvePoints = [];
        for (let point = 0; point <= 24; point += 1) {
          const u = point / 24;
          const y = 2.15 - u * 4.2;
          const wave = Math.sin(u * Math.PI * 2 + cord * 0.55) * 0.075;
          curvePoints.push(new THREE.Vector3(x + wave, y, 0.15 * Math.sin(u * Math.PI + cord)));
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.012, 5, false), new THREE.MeshBasicMaterial({ color: cordColors[cord], transparent: true, opacity: 0.8 }));
        quipuGroup.add(cordMesh);
        [0.19 + cord * 0.08, 0.47 + ((cord + 1) % 3) * 0.05, 0.73 - cord * 0.025].forEach((u, knotIndex) => {
          const y = 2.15 - u * 4.2;
          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.052 + ((cord + knotIndex) % 2) * 0.012, 10, 8),
            new THREE.MeshStandardMaterial({ color: cordColors[(cord + knotIndex) % cordColors.length], roughness: 0.8, metalness: 0.05 })
          );
          sphere.position.set(x + Math.sin(u * Math.PI * 2 + cord * 0.55) * 0.075, y, 0.16 * Math.sin(u * Math.PI + cord));
          sphere.scale.set(0.78, 1.35, 0.78);
          quipuGroup.add(sphere);
        });
      }

      // A restrained particle field adds depth without making mobile rendering heavy.
      const particleCount = 240;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i += 1) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 18;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
      const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: '#ead9b9', size: 0.018, transparent: true, opacity: 0.7 }));
      scene.add(particles);

      const resize = () => {
        if (!mount) return;
        const width = mount.clientWidth || window.innerWidth;
        const height = mount.clientHeight || window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = width < 650 ? 15.2 : 12.5;
        camera.updateProjectionMatrix();
      };
      resize();
      const onMouseMove = (event) => {
        const rect = mount.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        const py = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
        sceneGroup.userData.targetX = py * 0.055;
        sceneGroup.userData.targetY = px * 0.08;
      };
      window.addEventListener('resize', resize);
      mount.addEventListener('pointermove', onMouseMove, { passive: true });
      let last = 0;
      const animate = (now) => {
        frame = window.requestAnimationFrame(animate);
        const elapsed = now * 0.00025;
        if (!reducedMotion) {
          textileGroup.rotation.y += (Math.sin(elapsed) * 0.025 - textileGroup.rotation.y) * 0.015;
          textileGroup.position.y = Math.sin(elapsed * 1.7) * 0.08;
          sunGroup.rotation.z = Math.sin(elapsed * 0.4) * 0.035;
          quipuGroup.rotation.y = Math.sin(elapsed * 0.55) * 0.045;
          quipuGroup.position.y = -0.05 + Math.sin(elapsed * 1.2) * 0.035;
          particles.rotation.y = elapsed * 0.08;
          sceneGroup.rotation.x += ((sceneGroup.userData.targetX || 0) - sceneGroup.rotation.x) * 0.03;
          sceneGroup.rotation.y += ((sceneGroup.userData.targetY || 0) - sceneGroup.rotation.y) * 0.03;
        }
        if (now - last > 15) {
          renderer.render(scene, camera);
          last = now;
        }
      };
      frame = window.requestAnimationFrame(animate);
      cleanup = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        mount.removeEventListener('pointermove', onMouseMove);
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((mat) => mat.dispose());
          }
        });
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    } catch (error) {
      console.warn('Three.js could not initialize; CSS fallback stays visible.', error);
    }

    return () => cleanup();
  }, []);

  return <div className="andean-scene" ref={mountRef} aria-hidden="true"><div className="scene-fallback" /></div>;
}
