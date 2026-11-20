import * as THREE from 'three';

/**
 * environment.js: สร้างองค์ประกอบฉาก 3 มิติบรรยากาศงานวัดลอยกระทงสุดคึกคัก
 * ประกอบด้วย: 
 * - แม่น้ำสะท้อนแสง ใบบัวลอยน้ำ เรือพายไม้
 * - ดวงจันทร์วันเพ็ญดวงโตสีเหลืองทองสว่างไสว
 * - พระเจดีย์ทองคำเรืองรองพร้อมประกายดาว
 * - พระอุโบสถวัดและบ้านเรือนไทย
 * - ทางเดินงานวัดพร้อม "รั้วกั้นขอบทางเดิน" (Balustrade / Railing) ตลอดแนวริมน้ำ
 * - "ท่าน้ำเชื่อมต่อติดกับทางเดินวัด" ด้วยบันไดขนาดใหญ่พร้อมราวกั้นอย่างต่อเนื่อง
 * - แผงลอยขายของงานวัด (ร้านกระทง, ร้านของกิน, ร้านน้ำ, ร้านลูกโป่ง)
 * - ธงราวสามเหลี่ยมหลากสีประดับงานวัด (Bunting Flags)
 * - โคมลอยประดับท้องฟ้า และประกายพลุไฟ (Fireworks)
 */

export class EnvironmentBuilder {
  constructor(scene) {
    this.scene = scene;
    this.materials = this.initMaterials();
    this.fireworks = [];
    this.stars = [];
  }

  initMaterials() {
    return {
      // ผิวน้ำสีครามประกายม่วงสะท้อนแสงจันทร์
      water: new THREE.MeshStandardMaterial({
        color: 0x132a52,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9,
        flatShading: true
      }),
      // ตลิ่งดินและทางเดินหินงานวัด
      ground: new THREE.MeshStandardMaterial({
        color: 0x221a36,
        roughness: 0.85,
      }),
      stonePath: new THREE.MeshStandardMaterial({
        color: 0x5a4875,
        roughness: 0.65,
      }),
      // ไม้เรือนไทย บันได และท่าน้ำ
      thaiWood: new THREE.MeshStandardMaterial({
        color: 0x6d3618,
        roughness: 0.6,
      }),
      thaiWoodLight: new THREE.MeshStandardMaterial({
        color: 0xa45a2a,
        roughness: 0.5,
      }),
      // รั้วกั้นทางเดินวัด (สไตล์รั้วปูนปั้นสีขาวขอบทองแบบวัดไทย)
      railingPost: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.5,
      }),
      railingBar: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.4,
      }),
      goldTrim: new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        metalness: 0.8,
      }),
      roofTile: new THREE.MeshStandardMaterial({
        color: 0xc2410c,
        roughness: 0.4,
      }),
      // วัดและเจดีย์ทองคำอร่ามเรืองแสง
      goldChedi: new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.15,
        metalness: 0.9,
        emissive: 0x78350f,
        emissiveIntensity: 0.25
      }),
      templeWall: new THREE.MeshStandardMaterial({
        color: 0xfdf4ff,
        roughness: 0.6,
      }),
      templeRoofRed: new THREE.MeshStandardMaterial({
        color: 0xb91c1c,
        roughness: 0.35,
      }),
      templeGoldTrim: new THREE.MeshStandardMaterial({
        color: 0xfcd34d,
        roughness: 0.2,
        metalness: 0.9,
      }),
      // ดวงจันทร์โตสว่างนวล
      moonMaterial: new THREE.MeshBasicMaterial({
        color: 0xfef08a,
      }),
      // ใบบัวในน้ำ
      lotusPad: new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.5,
        side: THREE.DoubleSide
      }),
      lotusPadLight: new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.4,
        side: THREE.DoubleSide
      }),
      // ต้นไม้ริมน้ำ
      bananaTreeLeaf: new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.5,
        side: THREE.DoubleSide
      }),
      treeTrunk: new THREE.MeshStandardMaterial({
        color: 0x451a03,
        roughness: 0.8,
      }),
      // โคมลอยส่องสว่าง
      lanternGlow: new THREE.MeshBasicMaterial({
        color: 0xffedd5,
      })
    };
  }

  buildAll() {
    this.createMoon();
    this.createRiver();
    this.createTerrainAndConnectedPier();
    this.createRailingAlongPath();
    this.createThaiHouse();
    this.createTempleAndChedi();
    this.createMarketStalls();
    this.createFestivalBunting();
    this.createFireworksAndStars();
    this.createLotusPads();
    this.createWoodenBoat();
    this.createVegetation();
    this.createSkyLanterns();
  }

  // 1. ดวงจันทร์วันเพ็ญดวงโตสีเหลืองทองสว่างไสว
  createMoon() {
    const moonGeo = new THREE.SphereGeometry(9.5, 32, 32);
    const moon = new THREE.Mesh(moonGeo, this.materials.moonMaterial);
    moon.position.set(-15, 52, -85);
    this.scene.add(moon);

    const haloMat1 = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const halo1 = new THREE.Mesh(new THREE.RingGeometry(9.5, 22, 32), haloMat1);
    halo1.position.copy(moon.position);
    halo1.position.z += 0.5;
    halo1.lookAt(0, 10, 30);
    this.scene.add(halo1);

    const haloMat2 = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const halo2 = new THREE.Mesh(new THREE.RingGeometry(22, 36, 32), haloMat2);
    halo2.position.copy(moon.position);
    halo2.position.z += 0.4;
    halo2.lookAt(0, 10, 30);
    this.scene.add(halo2);

    const moonLight = new THREE.DirectionalLight(0xfff7be, 2.2);
    moonLight.position.set(-15, 52, -85);
    moonLight.target.position.set(0, 0, 5);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.bias = -0.001;
    this.scene.add(moonLight);
    this.scene.add(moonLight.target);
  }

  // 2. แม่น้ำกว้างใหญ่
  createRiver() {
    const waterGeo = new THREE.PlaneGeometry(180, 150, 45, 45);
    waterGeo.rotateX(-Math.PI / 2);

    this.waterMesh = new THREE.Mesh(waterGeo, this.materials.water);
    this.waterMesh.position.set(0, -0.05, 5);
    this.waterMesh.receiveShadow = true;
    this.waterMesh.name = 'river_water';
    this.scene.add(this.waterMesh);

    const pos = waterGeo.attributes.position;
    this.initialWaterVertices = new Float32Array(pos.array);
  }

  // 3. ตลิ่งดิน ทางเดินวัด และ "ท่าน้ำที่เชื่อมต่อติดกับทางเดินวัด"
  createTerrainAndConnectedPier() {
    const group = new THREE.Group();

    // ฝั่งตลิ่งดินด้านหลัง
    const bankGeo = new THREE.BoxGeometry(160, 4, 52);
    const bank = new THREE.Mesh(bankGeo, this.materials.ground);
    bank.position.set(0, 1.8, -45);
    bank.receiveShadow = true;
    group.add(bank);

    // ลานกว้างทางเดินวัด (ระดับ Y = 3.85, ขอบริมน้ำอยู่ที่ Z = -17)
    const pathGeo = new THREE.BoxGeometry(140, 0.25, 16);
    const path = new THREE.Mesh(pathGeo, this.materials.stonePath);
    path.position.set(0, 3.85, -25);
    path.receiveShadow = true;
    group.add(path);

    // --- บันไดใหญ่เชื่อมต่อจากทางเดินวัดลงสู่ท่าน้ำอย่างแนบสนิท (Connecting Grand Stairs) ---
    // กว้าง 16 เมตร เชื่อมจาก Z = -17 (ระดับ Y = 3.85) ลงมาสู่ Z = -11 (ระดับ Y = 0.5)
    const numStairs = 9;
    const stairWidth = 16;
    for (let i = 0; i < numStairs; i++) {
      const t = i / (numStairs - 1);
      const stepY = 3.85 - t * 3.35;
      const stepZ = -17 + t * 6.5;
      
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(stairWidth, 0.42, 0.85),
        this.materials.thaiWoodLight
      );
      stepMesh.position.set(0, stepY, stepZ);
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      group.add(stepMesh);
    }

    // ราวบันไดเชื่อมต่อสองข้าง (Stair Handrails)
    [-8.1, 8.1].forEach(x => {
      const railGeo = new THREE.CylinderGeometry(0.1, 0.1, 7.8, 8);
      railGeo.rotateX(Math.PI / 6.5);
      const rail = new THREE.Mesh(railGeo, this.materials.railingBar);
      rail.position.set(x, 2.8, -13.5);
      group.add(rail);

      // เสาราวบันได 3 ต้น
      [[-17, 4.4], [-13.5, 2.7], [-10.5, 1.2]].forEach(p => {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 1.3, 8),
          this.materials.railingPost
        );
        post.position.set(x, p[1], p[0]);
        group.add(post);

        const cap = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 8, 8),
          this.materials.goldTrim
        );
        cap.position.set(x, p[1] + 0.7, p[0]);
        group.add(cap);
      });
    });

    // --- ชานท่าน้ำไม้ (Pier Platform) เชื่อมติดตีนบันไดและยื่นลงสู่แม่น้ำ ---
    const pierPlankGeo = new THREE.BoxGeometry(20, 0.4, 12);
    const pier = new THREE.Mesh(pierPlankGeo, this.materials.thaiWood);
    pier.position.set(0, 0.45, -5);
    pier.castShadow = true;
    pier.receiveShadow = true;
    group.add(pier);

    // เสาค้ำท่าน้ำในน้ำ
    const postGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.5, 8);
    [[-9.5, -0.6, -10], [9.5, -0.6, -10], [-9.5, -0.6, 0.5], [9.5, -0.6, 0.5]].forEach(p => {
      const post = new THREE.Mesh(postGeo, this.materials.thaiWood);
      post.position.set(...p);
      group.add(post);
    });

    // บันไดท่าน้ำขั้นสุดท้ายสัมผัสผิวน้ำ (สำหรับหย่อนกระทงลงน้ำ)
    for (let s = 0; s < 3; s++) {
      const waterStep = new THREE.Mesh(
        new THREE.BoxGeometry(18, 0.22, 1.1),
        this.materials.thaiWoodLight
      );
      waterStep.position.set(0, 0.35 - s * 0.18, 1.2 + s * 1.0);
      group.add(waterStep);
    }

    // โคมประทีปส่องสว่างริมท่าน้ำ
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const lampGeo = new THREE.SphereGeometry(0.38, 12, 12);
    [[-9.5, 1.6, -8], [9.5, 1.6, -8], [-9.5, 1.6, 0], [9.5, 1.6, 0]].forEach(lp => {
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(...lp);
      group.add(lamp);

      const light = new THREE.PointLight(0xffaa44, 2.2, 12);
      light.position.set(...lp);
      group.add(light);
    });

    this.scene.add(group);
  }

  // 4. "ขอบทางเดินมีรั้วกั้น" (Railing along Temple Path Edges)
  createRailingAlongPath() {
    const railingGroup = new THREE.Group();

    // ฟังก์ชันสร้างช่วงรั้วกั้น (Section of Railing)
    const buildRailingSegment = (startX, endX, z, y) => {
      const length = Math.abs(endX - startX);
      const midX = (startX + endX) / 2;

      // 1. ราวบนและราวล่าง (Top & Bottom Rails)
      const topRailGeo = new THREE.BoxGeometry(length, 0.16, 0.2);
      const topRail = new THREE.Mesh(topRailGeo, this.materials.railingBar);
      topRail.position.set(midX, y + 1.15, z);
      railingGroup.add(topRail);

      const bottomRailGeo = new THREE.BoxGeometry(length, 0.12, 0.16);
      const bottomRail = new THREE.Mesh(bottomRailGeo, this.materials.railingBar);
      bottomRail.position.set(midX, y + 0.25, z);
      railingGroup.add(bottomRail);

      // 2. เสารั้วหลักทุกๆ ระยะ 4 เมตร (Main Posts)
      const numPosts = Math.floor(length / 4) + 1;
      const step = length / (numPosts - 1);
      const minX = Math.min(startX, endX);

      for (let i = 0; i < numPosts; i++) {
        const postX = minX + i * step;

        // ตัวเสารั้วสีขาว
        const postGeo = new THREE.BoxGeometry(0.35, 1.35, 0.35);
        const post = new THREE.Mesh(postGeo, this.materials.railingPost);
        post.position.set(postX, y + 0.65, z);
        railingGroup.add(post);

        // หัวเสารั้วทรงดอกบัวตูมสีทองอร่าม (Lotus Bud Post Cap)
        const capGeo = new THREE.SphereGeometry(0.22, 8, 8);
        const cap = new THREE.Mesh(capGeo, this.materials.goldTrim);
        cap.position.set(postX, y + 1.45, z);
        railingGroup.add(cap);

        // โคมไฟประดับหัวเสารั้วบางจุด
        if (i % 2 === 0) {
          const postLamp = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 6, 6),
            new THREE.MeshBasicMaterial({ color: 0xffedd5 })
          );
          postLamp.position.set(postX, y + 1.8, z);
          railingGroup.add(postLamp);

          const postLight = new THREE.PointLight(0xffb703, 1.2, 8);
          postLight.position.set(postX, y + 1.8, z);
          railingGroup.add(postLight);
        }
      }

      // 3. ซี่ลูกกรงรั้ว (Balusters / Spindles)
      const numBalusters = Math.floor(length / 0.7);
      const bStep = length / numBalusters;
      for (let b = 1; b < numBalusters; b++) {
        const bx = minX + b * bStep;
        // ไม่วางซี่ตรงกับเสาหลัก
        const isNearPost = (b * bStep) % step < 0.3 || (b * bStep) % step > (step - 0.3);
        if (!isNearPost) {
          const balGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.78, 6);
          const bal = new THREE.Mesh(balGeo, this.materials.railingPost);
          bal.position.set(bx, y + 0.7, z);
          railingGroup.add(bal);
        }
      }
    };

    // รั้วกั้นตลอดขอบหน้าทางเดินวัด (Z = -17, Y = 3.85)
    // เว้นช่องตรงกลาง (X: -8.5 ถึง +8.5) สำหรับเป็นทางลงบันไดสู่ท่าน้ำ
    buildRailingSegment(-68, -8.5, -17, 3.85); // รั้วฝั่งซ้าย
    buildRailingSegment(8.5, 68, -17, 3.85);  // รั้วฝั่งขวา

    this.scene.add(railingGroup);
  }

  // 5. แผงลอยขายของงานวัด (Temple Fair Market Stalls)
  createMarketStalls() {
    this.marketGroup = new THREE.Group();

    const stallsData = [
      {
        name: "ร้านกระทงวิจิตร",
        color1: 0xef4444, color2: 0xffffff,
        x: -24, z: -27, rotY: 0.15,
        type: "krathong"
      },
      {
        name: "ร้านลูกชิ้นปิ้ง&หมูปิ้ง",
        color1: 0xf59e0b, color2: 0xfef08a,
        x: -12, z: -28, rotY: 0.05,
        type: "food"
      },
      {
        name: "ร้านน้ำหวาน&ชาโบราณ",
        color1: 0x3b82f6, color2: 0xffffff,
        x: 12, z: -28, rotY: -0.05,
        type: "drinks"
      },
      {
        name: "ร้านลูกโป่งแฟนซี&ของเล่น",
        color1: 0xec4899, color2: 0xa855f7,
        x: 24, z: -27, rotY: -0.15,
        type: "balloons"
      }
    ];

    stallsData.forEach(stall => {
      const sGroup = new THREE.Group();
      sGroup.position.set(stall.x, 3.8, stall.z);
      sGroup.rotation.y = stall.rotY;

      // โต๊ะแผงลอย
      const tableGeo = new THREE.BoxGeometry(4.2, 1.4, 2.2);
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.set(0, 0.7, 0);
      table.castShadow = true;
      sGroup.add(table);

      // เสาเต็นท์
      const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.8, 6);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.5 });
      [[-2, 1.9, -1], [2, 1.9, -1], [-2, 1.9, 1], [2, 1.9, 1]].forEach(pos => {
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(...pos);
        sGroup.add(pole);
      });

      // หลังคาเต็นท์ผ้าใบโค้ง
      const canopyGeo = new THREE.ConeGeometry(3.3, 1.5, 4);
      canopyGeo.rotateY(Math.PI / 4);
      canopyGeo.scale(1.2, 1, 0.9);
      const canopyMat = new THREE.MeshStandardMaterial({
        color: stall.color1,
        roughness: 0.5,
        side: THREE.DoubleSide
      });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.set(0, 4.3, 0);
      sGroup.add(canopy);

      const frillGeo = new THREE.BoxGeometry(4.5, 0.4, 0.1);
      const frillMat = new THREE.MeshStandardMaterial({ color: stall.color2 });
      const frill = new THREE.Mesh(frillGeo, frillMat);
      frill.position.set(0, 3.5, 1.1);
      sGroup.add(frill);

      const lightBulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffedd5 })
      );
      lightBulb.position.set(0, 3.4, 0);
      sGroup.add(lightBulb);

      const stallLight = new THREE.PointLight(0xffd166, 2.5, 10);
      stallLight.position.set(0, 3.2, 0);
      sGroup.add(stallLight);

      if (stall.type === "krathong") {
        for (let k = -1.2; k <= 1.2; k += 0.8) {
          const miniK = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.2, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0x16a34a })
          );
          miniK.position.set(k, 1.5, 0.3);
          sGroup.add(miniK);
        }
      } else if (stall.type === "balloons") {
        const balloonColors = [0xef4444, 0x3b82f6, 0xfacc15, 0xec4899, 0x10b981];
        for (let b = 0; b < 6; b++) {
          const balloonMat = new THREE.MeshStandardMaterial({
            color: balloonColors[b % balloonColors.length],
            roughness: 0.3,
            metalness: 0.2
          });
          const balloon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), balloonMat);
          balloon.position.set(
            (Math.random() - 0.5) * 1.8,
            4.8 + Math.random() * 0.8,
            (Math.random() - 0.5) * 1.2
          );
          sGroup.add(balloon);
        }
      }

      this.marketGroup.add(sGroup);
    });

    this.scene.add(this.marketGroup);
  }

  // 6. ธงราวสามเหลี่ยมหลากสีประดับงานวัด
  createFestivalBunting() {
    this.buntingGroup = new THREE.Group();
    const flagColors = [0x38bdf8, 0xec4899, 0x10b981, 0xfacc15, 0xf97316, 0xa855f7];
    const flagGeo = new THREE.ConeGeometry(0.28, 0.6, 3);
    flagGeo.rotateX(Math.PI);

    const createBuntingLine = (startX, startY, startZ, endX, endY, endZ, numFlags) => {
      for (let i = 0; i <= numFlags; i++) {
        const t = i / numFlags;
        const x = startX + (endX - startX) * t;
        const z = startZ + (endZ - startZ) * t;
        const dip = Math.sin(t * Math.PI) * 1.4;
        const y = startY + (endY - startY) * t - dip;

        const color = flagColors[i % flagColors.length];
        const flagMat = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.5,
          side: THREE.DoubleSide
        });
        const flag = new THREE.Mesh(flagGeo, flagMat);
        flag.position.set(x, y, z);
        flag.rotation.y = Math.sin(i * 0.5) * 0.2;
        this.buntingGroup.add(flag);
      }
    };

    createBuntingLine(-32, 10.5, -28, 0, 9.5, -24, 24);
    createBuntingLine(0, 9.5, -24, 32, 11, -28, 24);
    createBuntingLine(-20, 8.5, -20, 20, 8.5, -20, 26);

    this.scene.add(this.buntingGroup);
  }

  // 7. ดอกไม้ไฟและประกายดาวบนท้องฟ้า
  createFireworksAndStars() {
    const starGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });

    for (let i = 0; i < 70; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(
        (Math.random() - 0.5) * 160,
        25 + Math.random() * 40,
        -50 - Math.random() * 60
      );
      star.userData = {
        baseScale: 0.7 + Math.random() * 0.8,
        blinkSpeed: 2 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2
      };
      this.stars.push(star);
      this.scene.add(star);
    }

    const fireworkColors = [0xfbbf24, 0xf43f5e, 0x38bdf8, 0xa855f7];
    const particleGeo = new THREE.SphereGeometry(0.22, 6, 6);

    const centers = [
      { x: 38, y: 38, z: -65, color: fireworkColors[0] },
      { x: 20, y: 46, z: -75, color: fireworkColors[1] },
      { x: -35, y: 40, z: -70, color: fireworkColors[2] }
    ];

    centers.forEach(c => {
      const pMat = new THREE.MeshBasicMaterial({ color: c.color });
      for (let p = 0; p < 24; p++) {
        const angle = (p / 24) * Math.PI * 2;
        const radius = 2.5 + (p % 3) * 1.5;
        const part = new THREE.Mesh(particleGeo, pMat);
        part.position.set(
          c.x + Math.cos(angle) * radius,
          c.y + Math.sin(angle) * radius,
          c.z
        );
        this.fireworks.push({
          mesh: part,
          centerX: c.x,
          centerY: c.y,
          angle,
          radius,
          speed: 0.8 + Math.random() * 0.4
        });
        this.scene.add(part);
      }
    });
  }

  // 8. ใบบัวลอยน้ำประปราย
  createLotusPads() {
    const padGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.04, 16);
    const padsGroup = new THREE.Group();

    const padPositions = [
      [-12, -0.01, 8], [-14, -0.01, 10], [-10, -0.01, 12],
      [14, -0.01, 12], [16, -0.01, 10], [18, -0.01, 15],
      [-22, -0.01, 20], [-20, -0.01, 22],
      [25, -0.01, 22], [28, -0.01, 19],
      [2, -0.01, 18], [-2, -0.01, 22]
    ];

    padPositions.forEach((pos, idx) => {
      const mat = idx % 2 === 0 ? this.materials.lotusPad : this.materials.lotusPadLight;
      const pad = new THREE.Mesh(padGeo, mat);
      pad.position.set(...pos);
      pad.scale.set(1 + Math.random() * 0.5, 1, 1 + Math.random() * 0.5);
      pad.rotation.y = Math.random() * Math.PI;
      padsGroup.add(pad);

      if (idx % 3 === 0) {
        const flower = new THREE.Mesh(
          new THREE.ConeGeometry(0.25, 0.45, 6),
          new THREE.MeshStandardMaterial({ color: 0xf472b6 })
        );
        flower.position.set(pos[0], 0.25, pos[2]);
        padsGroup.add(flower);
      }
    });

    this.scene.add(padsGroup);
  }

  // 9. เรือพายไม้โบราณมีหลังคาโค้ง พร้อมคนนั่ง 2 คน (ตามรูปถ่าย)
  createWoodenBoat() {
    const boatGroup = new THREE.Group();
    // วางเรือลอยในแม่น้ำอย่างสวยงามริมตลิ่ง
    boatGroup.position.set(15, 0.18, 9);
    boatGroup.rotation.y = -0.4;

    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x4a2511, roughness: 0.7 });
    const woodPlankMat = new THREE.MeshStandardMaterial({ color: 0x7c3f1d, roughness: 0.6 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x3d2110, roughness: 0.8, side: THREE.DoubleSide });
    const garlandMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.6 }); // หมวกงอบสีฟางข้าว
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.6 });

    // --- 1. ลำเรือไม้ (Boat Hull) ---
    // ท้องเรือ
    const floor = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.2, 6.2), darkWoodMat);
    floor.position.y = 0.1;
    boatGroup.add(floor);

    // กราบเรือซ้ายและขวา (Gunwales)
    const sideGeo = new THREE.BoxGeometry(0.18, 0.7, 6.2);
    const leftSide = new THREE.Mesh(sideGeo, darkWoodMat);
    leftSide.position.set(-0.95, 0.45, 0);
    boatGroup.add(leftSide);

    const rightSide = new THREE.Mesh(sideGeo, darkWoodMat);
    rightSide.position.set(0.95, 0.45, 0);
    boatGroup.add(rightSide);

    // หัวเรือและท้ายเรือเชิดขึ้นเล็กน้อย (Bow & Stern)
    const bow = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.6, 4), darkWoodMat);
    bow.rotateX(Math.PI / 2);
    bow.rotateY(Math.PI / 4);
    bow.scale.set(1.3, 0.6, 1);
    bow.position.set(0, 0.5, 3.6);
    boatGroup.add(bow);

    const stern = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.4, 4), darkWoodMat);
    stern.rotateX(-Math.PI / 2);
    stern.rotateY(Math.PI / 4);
    stern.scale.set(1.3, 0.6, 1);
    stern.position.set(0, 0.5, -3.5);
    boatGroup.add(stern);

    // ม้านั่งไม้ในเรือ
    const bench1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.7), woodPlankMat);
    bench1.position.set(0, 0.35, 0.5);
    boatGroup.add(bench1);

    const bench2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.7), woodPlankMat);
    bench2.position.set(0, 0.35, -1.8);
    boatGroup.add(bench2);

    // --- 2. โครงหลังคาโค้ง (Curved Canopy Roof) ---
    // เสาค้ำหลังคา 4 ต้น
    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 6);
    const postPositions = [
      [-0.85, 1.25, 1.8], [0.85, 1.25, 1.8],
      [-0.85, 1.25, -1.4], [0.85, 1.25, -1.4]
    ];
    postPositions.forEach(p => {
      const post = new THREE.Mesh(postGeo, darkWoodMat);
      post.position.set(...p);
      boatGroup.add(post);
    });

    // ราวกันตกฉลุลายไม้ข้างเรือ (Wooden Railings)
    [-0.88, 0.88].forEach(x => {
      const railBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 3.2), woodPlankMat);
      railBar.position.set(x, 0.95, 0.2);
      boatGroup.add(railBar);
    });

    // หลังคาโค้งทำจากไม้/ผ้าใบ (Curved Roof Arch)
    const roofCurveGeo = new THREE.CylinderGeometry(1.25, 1.25, 3.6, 16, 1, true, 0, Math.PI);
    roofCurveGeo.rotateZ(Math.PI / 2);
    roofCurveGeo.scale(0.8, 0.6, 1.0);
    const canopyRoof = new THREE.Mesh(roofCurveGeo, canopyMat);
    canopyRoof.position.set(0, 2.05, 0.2);
    boatGroup.add(canopyRoof);

    // ชายระบายสีเขียวประดับหน้าริมหลังคา (Green Garland Fringes ตามรูปถ่าย)
    const garlandFront = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.18, 0.15), garlandMat);
    garlandFront.position.set(0, 2.0, 2.0);
    boatGroup.add(garlandFront);

    const garlandBack = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.18, 0.15), garlandMat);
    garlandBack.position.set(0, 2.0, -1.6);
    boatGroup.add(garlandBack);

    // โคมไฟประทีปห้อยใต้หลังคาเรือ
    const boatLamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    boatLamp.position.set(0, 1.9, 0.2);
    boatGroup.add(boatLamp);

    const boatLight = new THREE.PointLight(0xffa14a, 2.0, 9);
    boatLight.position.set(0, 1.8, 0.2);
    boatGroup.add(boatLight);

    // ไม้พายยาว (Long Oar) พาดทอดลงไปในน้ำ
    const oarPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.6, 6), woodPlankMat);
    oarPole.position.set(1.1, 0.6, -1.8);
    oarPole.rotation.z = -0.55;
    oarPole.rotation.x = -0.3;
    boatGroup.add(oarPole);

    const oarBlade = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.9, 0.05), woodPlankMat);
    oarBlade.position.set(1.8, -0.2, -2.4);
    oarBlade.rotation.z = -0.55;
    oarBlade.rotation.x = -0.3;
    boatGroup.add(oarBlade);

    // --- 3. คนนั่งในเรือ 2 คน (2 People sitting in the boat) ---

    // [คนที่ 1]: นั่งชมวิวในเรือใต้หลังคา
    const person1 = new THREE.Group();
    person1.position.set(-0.25, 0.45, 0.5);

    // ลำตัวเสื้อสีชมพูบานเย็นสดใส
    const p1Torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.22, 0.75, 8),
      new THREE.MeshStandardMaterial({ color: 0xec4899 })
    );
    p1Torso.position.y = 0.55;
    person1.add(p1Torso);

    // หัว
    const p1Head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), skinMat);
    p1Head.position.y = 1.15;
    person1.add(p1Head);

    // ผมดำ
    const p1Hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
      new THREE.MeshStandardMaterial({ color: 0x18181b })
    );
    p1Hair.position.y = 1.2;
    person1.add(p1Hair);

    // ขานั่งงอเข่าบนม้านั่ง
    const p1Legs = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.22, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    p1Legs.position.set(0, 0.15, 0.15);
    person1.add(p1Legs);

    boatGroup.add(person1);

    // [คนที่ 2]: นั่งท้ายเรือ พร้อมสวมหมวกงอบใบลานสีฟางข้าว (แบบในรูปภาพเป๊ะๆ)
    const person2 = new THREE.Group();
    person2.position.set(0.2, 0.45, -1.8);
    person2.rotation.y = 0.3;

    // ลำตัวเสื้อสีน้ำเงินเข้ม
    const p2Torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.24, 0.78, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a })
    );
    p2Torso.position.y = 0.58;
    person2.add(p2Torso);

    // หัว
    const p2Head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), skinMat);
    p2Head.position.y = 1.18;
    person2.add(p2Head);

    // หมวกงอบทรงกรวยใบลานสีฟางข้าว (Conical Straw Hat) แบบในรูปถ่าย
    const ngobHat = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.35, 12), hatMat);
    ngobHat.position.y = 1.38;
    person2.add(ngobHat);

    // ขานั่ง
    const p2Legs = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.24, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    p2Legs.position.set(0, 0.16, 0.15);
    person2.add(p2Legs);

    // แขนจับไม้พาย
    const p2Arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.65, 6),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a })
    );
    p2Arm.position.set(0.35, 0.65, -0.15);
    p2Arm.rotation.x = -0.5;
    person2.add(p2Arm);

    boatGroup.add(person2);

    boatGroup.userData = { phase: 0 };
    this.boat = boatGroup;
    this.scene.add(boatGroup);
  }

  // 10. บ้านทรงไทย
  createThaiHouse() {
    const house = new THREE.Group();
    house.position.set(-38, 3.8, -44);
    house.rotation.y = 0.25;

    const stiltGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 8);
    for (let x = -5; x <= 5; x += 5) {
      for (let z = -4; z <= 4; z += 4) {
        const stilt = new THREE.Mesh(stiltGeo, this.materials.thaiWood);
        stilt.position.set(x, 1.5, z);
        house.add(stilt);
      }
    }

    const floor = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 11), this.materials.thaiWoodLight);
    floor.position.set(0, 3.2, 0);
    house.add(floor);

    const walls = new THREE.Mesh(new THREE.BoxGeometry(10, 4.2, 8), this.materials.thaiWood);
    walls.position.set(-1, 5.4, 0);
    house.add(walls);

    const roofBaseGeo = new THREE.ConeGeometry(8, 4.5, 4);
    roofBaseGeo.rotateY(Math.PI / 4);
    roofBaseGeo.scale(1.4, 1, 1.1);
    const roof = new THREE.Mesh(roofBaseGeo, this.materials.roofTile);
    roof.position.set(-1, 9.2, 0);
    house.add(roof);

    const houseLight = new THREE.PointLight(0xffa14a, 2.2, 16);
    houseLight.position.set(-1, 5.5, 5.5);
    house.add(houseLight);

    this.scene.add(house);
  }

  // 11. พระอุโบสถวัดและพระเจดีย์ทองอร่าม
  createTempleAndChedi() {
    const templeGroup = new THREE.Group();
    templeGroup.position.set(28, 3.8, -48);

    const chediGroup = new THREE.Group();
    chediGroup.position.set(16, 0, 5);

    const b1 = new THREE.Mesh(new THREE.BoxGeometry(11, 1.4, 11), this.materials.templeWall);
    b1.position.y = 0.7;
    chediGroup.add(b1);

    const b2 = new THREE.Mesh(new THREE.BoxGeometry(9, 1.2, 9), this.materials.goldChedi);
    b2.position.y = 2.0;
    chediGroup.add(b2);

    const bell = new THREE.Mesh(new THREE.SphereGeometry(3.5, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.7), this.materials.goldChedi);
    bell.position.y = 4.5;
    chediGroup.add(bell);

    const throne = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 3.2), this.materials.goldChedi);
    throne.position.y = 7.2;
    chediGroup.add(throne);

    const rings = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.4, 5.0, 14), this.materials.goldChedi);
    rings.position.y = 9.8;
    chediGroup.add(rings);

    const needle = new THREE.Mesh(new THREE.ConeGeometry(0.35, 7.0, 12), this.materials.goldChedi);
    needle.position.y = 15.5;
    chediGroup.add(needle);

    const chediSpot = new THREE.PointLight(0xfbbf24, 4.0, 35);
    chediSpot.position.set(0, 11, 10);
    chediGroup.add(chediSpot);

    templeGroup.add(chediGroup);

    const ubosot = new THREE.Group();
    ubosot.position.set(-6, 0, 0);

    const uBase = new THREE.Mesh(new THREE.BoxGeometry(18, 1.5, 24), this.materials.templeWall);
    uBase.position.y = 0.75;
    ubosot.add(uBase);

    const uWall = new THREE.Mesh(new THREE.BoxGeometry(13, 6, 19), this.materials.templeWall);
    uWall.position.y = 4.5;
    ubosot.add(uWall);

    const roofL1 = new THREE.Mesh(new THREE.ConeGeometry(12, 5, 4), this.materials.templeRoofRed);
    roofL1.rotateY(Math.PI / 4);
    roofL1.scale.set(1.5, 0.9, 1.8);
    roofL1.position.set(0, 9.5, 0);
    ubosot.add(roofL1);

    const roofL2 = new THREE.Mesh(new THREE.ConeGeometry(9.5, 4, 4), this.materials.templeRoofRed);
    roofL2.rotateY(Math.PI / 4);
    roofL2.scale.set(1.4, 0.9, 1.7);
    roofL2.position.set(0, 12.2, 0);
    ubosot.add(roofL2);

    const templeLight = new THREE.PointLight(0xffa14a, 3.0, 30);
    templeLight.position.set(0, 5, 11);
    ubosot.add(templeLight);

    templeGroup.add(ubosot);
    this.scene.add(templeGroup);
  }

  // 12. ต้นไม้ริมตลิ่ง
  createVegetation() {
    const vegGroup = new THREE.Group();
    const spawnTree = (x, y, z, scale = 1) => {
      const tree = new THREE.Group();
      tree.position.set(x, y, z);
      tree.scale.set(scale, scale, scale);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 4, 7), this.materials.treeTrunk);
      trunk.position.y = 2;
      tree.add(trunk);

      const leafGeo = new THREE.BoxGeometry(0.6, 0.05, 3.2);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const leaf = new THREE.Mesh(leafGeo, this.materials.bananaTreeLeaf);
        leaf.position.set(Math.sin(angle) * 1.0, 3.8, Math.cos(angle) * 1.0);
        leaf.rotation.y = angle;
        leaf.rotation.x = 0.55;
        tree.add(leaf);
      }
      vegGroup.add(tree);
    };

    [[-32, 3.5, -24, 1.2], [-35, 3.5, -28, 1.0], [32, 3.5, -24, 1.1], [35, 3.5, -28, 1.3]].forEach(p => {
      spawnTree(p[0], p[1], p[2], p[3]);
    });

    this.scene.add(vegGroup);
  }

  // 13. โคมลอยประดับท้องฟ้า
  createSkyLanterns() {
    this.skyLanterns = [];
    const group = new THREE.Group();
    const lanternGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.0, 8);

    for (let i = 0; i < 40; i++) {
      const lantern = new THREE.Mesh(lanternGeo, this.materials.lanternGlow);
      const x = (Math.random() - 0.5) * 150;
      const y = 14 + Math.random() * 50;
      const z = -35 - Math.random() * 65;
      lantern.position.set(x, y, z);
      lantern.userData = {
        baseY: y,
        speedY: 0.12 + Math.random() * 0.18,
        driftX: (Math.random() - 0.5) * 0.06,
        phase: Math.random() * Math.PI * 2
      };
      group.add(lantern);
      this.skyLanterns.push(lantern);
    }
    this.scene.add(group);
  }

  // อัปเดตอนิเมชันน้ำ โคมลอย ดาวระยิบระยับ และเรือพาย
  update(time) {
    if (this.waterMesh && this.initialWaterVertices) {
      const pos = this.waterMesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = this.initialWaterVertices[i * 3];
        const w = this.initialWaterVertices[i * 3 + 2];
        pos.array[i * 3 + 1] = 
          Math.sin(u * 0.15 + time * 1.5) * 0.12 + 
          Math.cos(w * 0.2 + time * 1.2) * 0.08;
      }
      pos.needsUpdate = true;
    }

    if (this.skyLanterns) {
      this.skyLanterns.forEach(lt => {
        lt.position.y += lt.userData.speedY * 0.06;
        lt.position.x += Math.sin(time + lt.userData.phase) * 0.02;
        if (lt.position.y > 70) lt.position.y = 12;
      });
    }

    if (this.stars) {
      this.stars.forEach(st => {
        const s = st.userData.baseScale * (0.6 + 0.4 * Math.sin(time * st.userData.blinkSpeed + st.userData.phase));
        st.scale.set(s, s, s);
      });
    }

    if (this.boat) {
      this.boat.position.y = 0.2 + Math.sin(time * 1.8) * 0.06;
      this.boat.rotation.z = Math.sin(time * 1.2) * 0.04;
    }
  }
}
