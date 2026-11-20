import * as THREE from 'three';

/**
 * krathong.js: สร้างโมเดลกระทง 3 มิติสีสันหวานสดใส
 * (กระทงดอกบัวชมพูหวานแบบในภาพ, กระทงใบตองวิจิตร, กระทงทองคำประกาย)
 * พร้อมเปลวเทียนเรืองแสงและธูป
 */

export class KrathongFactory {
  constructor() {
    this.materials = this.initMaterials();
  }

  initMaterials() {
    return {
      // ฐานหยวกกล้วยสีเขียวสด
      bananaBase: new THREE.MeshStandardMaterial({
        color: 0x65a30d,
        roughness: 0.7,
        metalness: 0.1
      }),
      bananaBaseSide: new THREE.MeshStandardMaterial({
        color: 0x84cc16,
        roughness: 0.8,
      }),
      // กลีบกระทงใบตอง
      bananaPetal: new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.5,
        side: THREE.DoubleSide
      }),
      // กลีบดอกบัวสีชมพูหวานสดใสแบบในภาพ
      lotusPetalOuter: new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        roughness: 0.4,
        side: THREE.DoubleSide
      }),
      lotusPetalInner: new THREE.MeshStandardMaterial({
        color: 0xfbcfe8,
        roughness: 0.3,
        side: THREE.DoubleSide
      }),
      // กลีบทองคำประกาย
      goldPetal: new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.25,
        metalness: 0.85,
        side: THREE.DoubleSide
      }),
      // ดอกไม้ประดับตรงกลาง
      marigold: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.6
      }),
      jasmine: new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.5
      }),
      // เทียน
      candleWax: new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.3
      }),
      candleWick: new THREE.MeshBasicMaterial({
        color: 0x1c1917
      }),
      // เปลวเทียนเรืองแสงสว่าง
      candleFlame: new THREE.MeshBasicMaterial({
        color: 0xffedd5
      }),
      // ธูป 3 ดอก
      incenseStick: new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.8
      }),
      incenseTip: new THREE.MeshBasicMaterial({
        color: 0xef4444
      })
    };
  }

  createKrathong(data) {
    const group = new THREE.Group();
    group.name = `krathong_${data.id}`;
    group.userData = {
      id: data.id,
      name: data.name,
      votes: data.votes,
      wish: data.wish,
      style: data.style,
      avatar: data.avatar,
      initialY: 0,
      phase: Math.random() * Math.PI * 2,
      driftSpeed: 0.15 + Math.random() * 0.1,
      rotSpeed: (Math.random() - 0.5) * 0.3
    };

    const style = data.style || 'lotus';

    // 1. ฐานกระทง (หยวกกล้วยทรงกระบอก)
    const baseGeo = new THREE.CylinderGeometry(0.95, 0.9, 0.35, 18);
    const baseMesh = new THREE.Mesh(baseGeo, [
      this.materials.bananaBaseSide,
      this.materials.bananaBase,
      this.materials.bananaBase
    ]);
    baseMesh.position.y = 0.15;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // 2. กลีบรอบนอกและรอบใน
    if (style === 'lotus') {
      this.addLotusPetals(group);
    } else if (style === 'golden') {
      this.addGoldenPetals(group);
    } else {
      this.addBananaLeafPetals(group);
    }

    // 3. ดอกไม้ประดับตรงกลาง
    this.addCenterFlowers(group);

    // 4. ธูป 3 ดอก และ เทียน 1 เล่ม
    this.addCandleAndIncense(group);

    group.scale.set(1.15, 1.15, 1.15);
    group.position.set(data.posX || 0, 0, data.posZ || 0);

    return group;
  }

  addBananaLeafPetals(group) {
    const numPetals = 12;
    const radius = 0.92;
    const petalGeo = new THREE.ConeGeometry(0.24, 0.55, 4);

    for (let i = 0; i < numPetals; i++) {
      const angle = (i / numPetals) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, this.materials.bananaPetal);
      petal.position.set(Math.cos(angle) * radius, 0.35, Math.sin(angle) * radius);
      petal.rotation.y = -angle;
      petal.rotation.z = -0.4;
      petal.castShadow = true;
      group.add(petal);
    }

    const innerPetals = 8;
    for (let i = 0; i < innerPetals; i++) {
      const angle = (i / innerPetals) * Math.PI * 2 + 0.2;
      const petal = new THREE.Mesh(petalGeo, this.materials.bananaPetal);
      petal.scale.set(0.85, 0.85, 0.85);
      petal.position.set(Math.cos(angle) * (radius - 0.2), 0.38, Math.sin(angle) * (radius - 0.2));
      petal.rotation.y = -angle;
      petal.rotation.z = -0.25;
      group.add(petal);
    }
  }

  addLotusPetals(group) {
    const numOuter = 16;
    const outerRadius = 0.95;
    const petalGeo = new THREE.ConeGeometry(0.24, 0.65, 5);

    // ชั้นนอกสีชมพูหวาน
    for (let i = 0; i < numOuter; i++) {
      const angle = (i / numOuter) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, this.materials.lotusPetalOuter);
      petal.position.set(Math.cos(angle) * outerRadius, 0.36, Math.sin(angle) * outerRadius);
      petal.rotation.y = -angle;
      petal.rotation.z = -0.45;
      petal.castShadow = true;
      group.add(petal);
    }

    // ชั้นในสีชมพูอ่อนละมุน
    const numInner = 12;
    const innerRadius = 0.72;
    for (let i = 0; i < numInner; i++) {
      const angle = (i / numInner) * Math.PI * 2 + 0.25;
      const petal = new THREE.Mesh(petalGeo, this.materials.lotusPetalInner);
      petal.scale.set(0.85, 0.85, 0.85);
      petal.position.set(Math.cos(angle) * innerRadius, 0.42, Math.sin(angle) * innerRadius);
      petal.rotation.y = -angle;
      petal.rotation.z = -0.3;
      group.add(petal);
    }
  }

  addGoldenPetals(group) {
    const numPetals = 14;
    const radius = 0.95;
    const petalGeo = new THREE.ConeGeometry(0.25, 0.65, 4);

    for (let i = 0; i < numPetals; i++) {
      const angle = (i / numPetals) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, this.materials.goldPetal);
      petal.position.set(Math.cos(angle) * radius, 0.38, Math.sin(angle) * radius);
      petal.rotation.y = -angle;
      petal.rotation.z = -0.42;
      petal.castShadow = true;
      group.add(petal);
    }

    const numInner = 10;
    for (let i = 0; i < numInner; i++) {
      const angle = (i / numInner) * Math.PI * 2 + 0.25;
      const petal = new THREE.Mesh(petalGeo, this.materials.goldPetal);
      petal.scale.set(0.8, 0.8, 0.8);
      petal.position.set(Math.cos(angle) * 0.72, 0.42, Math.sin(angle) * 0.72);
      petal.rotation.y = -angle;
      petal.rotation.z = -0.25;
      group.add(petal);
    }
  }

  addCenterFlowers(group) {
    const flowerGeo = new THREE.SphereGeometry(0.12, 6, 6);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const fl = new THREE.Mesh(flowerGeo, i % 2 === 0 ? this.materials.marigold : this.materials.jasmine);
      fl.position.set(Math.cos(angle) * 0.42, 0.38, Math.sin(angle) * 0.42);
      group.add(fl);
    }
  }

  addCandleAndIncense(group) {
    // 1. เทียน 1 เล่ม
    const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.55, 8);
    const candle = new THREE.Mesh(candleGeo, this.materials.candleWax);
    candle.position.set(0, 0.6, 0.05);
    candle.castShadow = true;
    group.add(candle);

    // ไส้เทียน
    const wickGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 4);
    const wick = new THREE.Mesh(wickGeo, this.materials.candleWick);
    wick.position.set(0, 0.9, 0.05);
    group.add(wick);

    // เปลวเทียนรูปกรวยสีสว่าง
    const flameGeo = new THREE.ConeGeometry(0.08, 0.22, 8);
    const flame = new THREE.Mesh(flameGeo, this.materials.candleFlame);
    flame.position.set(0, 1.02, 0.05);
    flame.name = 'candle_flame';
    group.add(flame);

    // แสงสว่างจากเปลวเทียน
    const candleLight = new THREE.PointLight(0xffb703, 1.6, 6, 2);
    candleLight.position.set(0, 1.05, 0.05);
    candleLight.name = 'candle_light';
    group.add(candleLight);

    // 2. ธูป 3 ดอก
    const stickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.7, 4);
    const offsets = [-0.07, 0, 0.07];
    
    for (let i = 0; i < 3; i++) {
      const stick = new THREE.Mesh(stickGeo, this.materials.incenseStick);
      stick.position.set(offsets[i], 0.65, -0.12);
      stick.rotation.x = -0.15;
      stick.rotation.z = (offsets[i]) * 0.8;
      group.add(stick);

      const tipGeo = new THREE.SphereGeometry(0.02, 4, 4);
      const tip = new THREE.Mesh(tipGeo, this.materials.incenseTip);
      tip.position.set(offsets[i] + (offsets[i] * 0.28), 1.0, -0.17);
      group.add(tip);
    }
  }
}
