import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EnvironmentBuilder } from './environment.js';
import { CrowdManager } from './crowd.js';
import { KrathongFactory } from './krathong.js';

/**
 * scene.js: จัดการ 3D Engine ทั้งหมด
 * - กระทง 20 ใบประกอบฉาก และกระทงประกวดที่ถูกส่ง
 * - มีระบบป้องกันการซ้อนทับกัน (Collision Avoidance / Repulsion)
 * - กระทงที่ถูกส่งสามารถลอยไปมาได้ตามกระแสน้ำ แต่ลอยอยู่ในขอบเขตรอบจุดปล่อย ไม่ไกลเกินไป
 */

export class AppScene {
  constructor(containerElement, onKrathongSelected, onScenicSelected) {
    this.container = containerElement;
    this.onKrathongSelected = onKrathongSelected;
    this.onScenicSelected = onScenicSelected;

    this.scenicKrathongs = [];
    this.contestantKrathongs = [];
    this.contestantMap = new Map();
    this.raycastableObjects = [];

    this.initEngine();
    this.initLights();
    this.initControls();
    this.initRaycaster();

    this.environment = new EnvironmentBuilder(this.scene);
    this.environment.buildAll();

    this.crowd = new CrowdManager(this.scene);
    this.krathongFactory = new KrathongFactory();

    // สร้าง 20 กระทงประกอบฉาก ลอยในแม่น้ำ
    this.createScenicKrathongs();

    this.clock = new THREE.Clock();
    this.isAnimating = true;

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  initEngine() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x211134);
    this.scene.fog = new THREE.FogExp2(0x241238, 0.007);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.5,
      350
    );
    this.camera.position.set(0, 16, 42);
    this.defaultCamPos = new THREE.Vector3(0, 16, 42);
    this.defaultCamTarget = new THREE.Vector3(0, 1, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.45;

    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0x734c8c, 2.2);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xf472b6, 0xfbbf24, 1.4);
    this.scene.add(hemiLight);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.target.copy(this.defaultCamTarget);

    this.controls.minDistance = 6;
    this.controls.maxDistance = 115;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.minPolarAngle = 0.2;
  }

  // หาพิกัดในแม่น้ำที่ปลอดภัย ไม่ซ้อนทับกับกระทงใดๆ (ระยะห่างขั้นต่ำ 3.0 เมตร)
  findSafeWaterPosition() {
    const allKrathongs = [...this.scenicKrathongs, ...this.contestantKrathongs];
    const minDist = 3.0;

    for (let attempt = 0; attempt < 100; attempt++) {
      // สุ่มพิกัดในแม่น้ำบริเวณหน้าท่าน้ำที่มองเห็นชัดเจน
      const x = (Math.random() - 0.5) * 32;
      const z = 7.5 + Math.random() * 18; // Z: 7.5 ถึง 25.5 (อยู่ในแม่น้ำ ไม่ชิดฝั่งและไม่ไกลเกินไป)

      let isSafe = true;
      for (const k of allKrathongs) {
        const kx = k.userData.originX !== undefined ? k.userData.originX : k.position.x;
        const kz = k.userData.originZ !== undefined ? k.userData.originZ : k.position.z;
        const dist = Math.hypot(x - kx, z - kz);
        if (dist < minDist) {
          isSafe = false;
          break;
        }
      }

      if (isSafe) {
        return { x, z };
      }
    }

    // สำรองหากพื้นที่เต็ม
    return {
      x: (Math.random() - 0.5) * 26,
      z: 10 + Math.random() * 14
    };
  }

  // ตรวจสอบว่าพิกัดมีกระทงอื่นอยู่ใกล้เกินไปหรือไม่
  isPositionOccupied(x, z, excludeId = null) {
    const allKrathongs = [...this.scenicKrathongs, ...this.contestantKrathongs];
    const minDist = 2.8;

    for (const k of allKrathongs) {
      if (excludeId && k.userData.id === excludeId) continue;
      const kx = k.userData.originX !== undefined ? k.userData.originX : k.position.x;
      const kz = k.userData.originZ !== undefined ? k.userData.originZ : k.position.z;
      if (Math.hypot(x - kx, z - kz) < minDist) {
        return true;
      }
    }
    return false;
  }

  // สร้าง 20 กระทงประกอบฉาก ลอยกระจายตัวในแม่น้ำแบบไม่ซ้อนทับกัน
  createScenicKrathongs() {
    const styles = ['lotus', 'banana-leaf', 'golden'];
    const positions = [
      { x: -9, z: 8 },
      { x: 9, z: 8.5 },
      { x: 0, z: 13 },
      { x: -17, z: 11 },
      { x: 19, z: 11.5 },
      { x: -26, z: 16 },
      { x: 27, z: 16.5 },
      { x: -11, z: 21 },
      { x: 13, z: 23 },
      { x: -36, z: 19 },
      { x: 37, z: 21 },
      { x: -5, z: 28 },
      { x: 6, z: 31 },
      { x: -21, z: 33 },
      { x: 23, z: 35 },
      { x: -31, z: 39 },
      { x: 33, z: 41 },
      { x: -13, z: 43 },
      { x: 15, z: 45 },
      { x: 0, z: 37 }
    ];

    positions.forEach((pos, index) => {
      const scenicData = {
        id: `scenic_${index + 1}`,
        name: "กระทงประดับงานวัด",
        style: styles[index % styles.length],
        posX: pos.x,
        posZ: pos.z,
        isScenic: true
      };

      const krathong = this.krathongFactory.createKrathong(scenicData);
      krathong.userData.isScenic = true;
      krathong.userData.originX = pos.x;
      krathong.userData.originZ = pos.z;
      krathong.userData.driftRadiusX = 1.0 + Math.random() * 0.8;
      krathong.userData.driftRadiusZ = 0.8 + Math.random() * 0.6;
      krathong.userData.driftSpeed = 0.2 + Math.random() * 0.15;

      this.scene.add(krathong);
      this.scenicKrathongs.push(krathong);
      this.raycastableObjects.push(krathong);
    });
  }

  initRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    const handlePointer = (event) => {
      if (event.target.tagName !== 'CANVAS') return;

      const clientX = event.clientX !== undefined ? event.clientX : (event.touches && event.touches[0] ? event.touches[0].clientX : null);
      const clientY = event.clientY !== undefined ? event.clientY : (event.touches && event.touches[0] ? event.touches[0].clientY : null);

      if (clientX === null || clientY === null) return;

      this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.raycastableObjects, true);

      if (intersects.length > 0) {
        let current = intersects[0].object;
        while (current.parent && !current.name.startsWith('krathong_')) {
          current = current.parent;
        }

        if (current && current.userData) {
          if (current.userData.isScenic) {
            if (this.onScenicSelected) {
              this.onScenicSelected();
            }
          } else if (current.userData.id) {
            if (this.onKrathongSelected) {
              this.onKrathongSelected(current.userData.id);
            }
          }
        }
      }
    };

    this.renderer.domElement.addEventListener('click', handlePointer);
  }

  resetCamera() {
    this.camera.position.copy(this.defaultCamPos);
    this.controls.target.copy(this.defaultCamTarget);
    this.controls.update();
  }

  loadKrathongs(contestants) {
    this.contestantKrathongs.forEach(obj => {
      this.scene.remove(obj);
      const idx = this.raycastableObjects.indexOf(obj);
      if (idx > -1) this.raycastableObjects.splice(idx, 1);
    });
    this.contestantKrathongs = [];
    this.contestantMap.clear();

    contestants.forEach(data => {
      this.spawnContestantKrathong(data);
    });
  }

  // สร้างกระทงที่ถูกส่งเข้าประกวด (ตรวจสอบตำแหน่งไม่ให้ซ้อนทับ และกำหนดขอบเขตการลอย)
  spawnContestantKrathong(data) {
    // หากตำแหน่งเดิมซ้อนทับหรือยังไม่มีพิกัด ให้หาพิกัดว่างในแม่น้ำทันที
    if (data.posX === undefined || data.posZ === undefined || this.isPositionOccupied(data.posX, data.posZ, data.id)) {
      const safePos = this.findSafeWaterPosition();
      data.posX = safePos.x;
      data.posZ = safePos.z;
    }

    const krathong = this.krathongFactory.createKrathong(data);
    krathong.userData.isScenic = false;

    // ขอบเขตการลอยไปมา: ลอยไปมาได้รอบๆ จุดเริ่มต้น (ไม่ไกลเกินไป)
    krathong.userData.originX = data.posX;
    krathong.userData.originZ = data.posZ;
    krathong.userData.driftRadiusX = 3.0 + Math.random() * 1.5; // รัศมีลอย X: 3 - 4.5 เมตร
    krathong.userData.driftRadiusZ = 2.5 + Math.random() * 1.2; // รัศมีลอย Z: 2.5 - 3.7 เมตร
    krathong.userData.driftSpeed = 0.35 + Math.random() * 0.15;

    // วงรัศมีแสงประกายสีทองหมุนวนรอบกระทงประกวด
    const haloGeo = new THREE.RingGeometry(1.2, 1.6, 24);
    haloGeo.rotateX(-Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.y = 0.08;
    halo.name = 'contestant_halo';
    krathong.add(halo);

    this.scene.add(krathong);
    this.contestantMap.set(data.id, krathong);
    this.contestantKrathongs.push(krathong);
    this.raycastableObjects.push(krathong);

    return krathong;
  }

  updateVotes(id, newVoteCount) {
    const krathong = this.contestantMap.get(id);
    if (krathong) {
      krathong.userData.votes = newVoteCount;
      krathong.scale.set(1.4, 1.4, 1.4);
      setTimeout(() => {
        if (krathong) krathong.scale.set(1.15, 1.15, 1.15);
      }, 350);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    if (!this.isAnimating) return;
    requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();

    if (this.environment) {
      this.environment.update(time);
    }

    if (this.crowd) {
      this.crowd.update(time);
    }

    const allKrathongs = [...this.scenicKrathongs, ...this.contestantKrathongs];

    // 1. อัปเดตการลอยไปมาของกระทงแต่ละใบ (Drift Movement within Bounds)
    allKrathongs.forEach(krathong => {
      const uData = krathong.userData;
      const ph = uData.phase;

      // กระเพื่อมขึ้น-ลงตามผิวน้ำ
      krathong.position.y = Math.sin(time * 2.2 + ph) * 0.08 + 0.05;
      krathong.rotation.z = Math.sin(time * 1.5 + ph) * 0.04;
      krathong.rotation.x = Math.cos(time * 1.2 + ph) * 0.04;
      krathong.rotation.y += uData.rotSpeed * 0.005;

      // กระทงลอยไปมาอย่างนุ่มนวลรอบจุด origin (ไม่ลอยไปไกลเกินขอบเขตที่กำหนด)
      if (uData.originX !== undefined && uData.originZ !== undefined) {
        const speed = uData.driftSpeed || 0.3;
        const radX = uData.driftRadiusX || 2.0;
        const radZ = uData.driftRadiusZ || 1.8;

        // คำนวณตำแหน่งลอยเป้าหมาย (Sine & Cosine ผสมหลายความถี่)
        const targetX = uData.originX + Math.sin(time * speed + ph) * radX + Math.cos(time * 0.15 + ph * 1.8) * 0.6;
        const targetZ = uData.originZ + Math.cos(time * (speed * 0.85) + ph) * radZ + Math.sin(time * 0.12 + ph * 1.4) * 0.5;

        // ค่อยๆ เคลื่อนตัวเข้าหาเป้าหมายอย่างเป็นธรรมชาติ
        krathong.position.x += (targetX - krathong.position.x) * 0.035;
        krathong.position.z += (targetZ - krathong.position.z) * 0.035;
      }

      // เปลวเทียนไหวริบหรี่
      const candleFlame = krathong.getObjectByName('candle_flame');
      const candleLight = krathong.getObjectByName('candle_light');
      if (candleFlame && candleLight) {
        const flicker = Math.sin(time * 15 + ph * 5) * 0.15;
        candleFlame.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
        candleLight.intensity = 1.3 + flicker * 0.7;
      }

      // วงประกายแสงหมุนวนของกระทงประกวด
      const halo = krathong.getObjectByName('contestant_halo');
      if (halo) {
        halo.rotation.y = time * 0.8;
        halo.scale.set(
          1 + Math.sin(time * 3 + ph) * 0.08,
          1,
          1 + Math.sin(time * 3 + ph) * 0.08
        );
      }
    });

    // 2. ระบบป้องกันการซ้อนทับกัน (Collision Avoidance & Separation Physics)
    // ตรวจสอบระยะห่างคู่กระทงทุกคู่ หากใกล้กันเกิน 2.8 เมตร ให้มีแรงผลักแยกออกจากกันทันที
    const minDist = 2.8;
    const len = allKrathongs.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const kA = allKrathongs[i];
        const kB = allKrathongs[j];

        const dx = kA.position.x - kB.position.x;
        const dz = kA.position.z - kB.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist < minDist && dist > 0.0001) {
          const overlap = (minDist - dist) * 0.5;
          const nx = dx / dist;
          const nz = dz / dist;

          // ดันกระทงทั้งสองใบแยกออกจากกันอย่างนุ่มนวล
          kA.position.x += nx * overlap * 0.6;
          kA.position.z += nz * overlap * 0.6;
          kB.position.x -= nx * overlap * 0.6;
          kB.position.z -= nz * overlap * 0.6;
        }
      }
    }

    // 3. ควบคุมขอบเขตให้อยู่ในแม่น้ำ ไม่ให้ลอยขึ้นฝั่งหรือหลุดออกนอกจอ
    allKrathongs.forEach(krathong => {
      krathong.position.z = Math.max(7.0, Math.min(48.0, krathong.position.z));
      krathong.position.x = Math.max(-44.0, Math.min(44.0, krathong.position.x));
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
