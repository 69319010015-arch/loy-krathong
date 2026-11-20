import * as THREE from 'three';

/**
 * crowd.js: สุ่มสร้างผู้คนเดินไปมาอย่างคึกคักในงานวัด
 * - เดินสวนกันไปมาบนทางเดินวัดหน้าร้านค้าและบนชานท่าน้ำ
 * - ยืนเกาะรั้วชมแม่น้ำ และยืนพนมมือลอยกระทงริมท่าน้ำ
 */

export class CrowdManager {
  constructor(scene) {
    this.scene = scene;
    this.people = [];
    this.materials = this.initMaterials();
    this.createCrowd();
  }

  initMaterials() {
    return {
      skin1: new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.6 }),
      skin2: new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.6 }),
      skin3: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }),
      hairDark: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 }),
      clothGold: new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 }),
      clothPink: new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 }),
      clothBlue: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.5 }),
      clothCyan: new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.5 }),
      clothGreen: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 }),
      clothPurple: new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.5 }),
      clothOrange: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 }),
      clothWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }),
      pantsBrown: new THREE.MeshStandardMaterial({ color: 0x5c2c16, roughness: 0.7 }),
      pantsDark: new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.7 })
    };
  }

  createCrowd() {
    this.crowdGroup = new THREE.Group();
    const clothList = [
      this.materials.clothGold, this.materials.clothPink, 
      this.materials.clothBlue, this.materials.clothCyan,
      this.materials.clothGreen, this.materials.clothPurple, 
      this.materials.clothOrange, this.materials.clothWhite
    ];
    const skinList = [this.materials.skin1, this.materials.skin2, this.materials.skin3];

    // 1. กลุ่มคนเดินไปมา (Walking People - 14 คน)
    const walkingPaths = [
      // ทางเดินวัดหน้าร้านค้า (Z: -23 ถึง -25, Y = 3.9)
      { startX: -34, endX: 34, y: 3.9, z: -22, speed: 0.045, dir: 1 },
      { startX: 32, endX: -32, y: 3.9, z: -24, speed: 0.04, dir: -1 },
      { startX: -26, endX: 26, y: 3.9, z: -21.5, speed: 0.05, dir: 1 },
      { startX: 24, endX: -28, y: 3.9, z: -24.5, speed: 0.038, dir: -1 },
      { startX: -16, endX: 36, y: 3.9, z: -23, speed: 0.042, dir: 1 },
      { startX: 35, endX: -22, y: 3.9, z: -25, speed: 0.048, dir: -1 },
      { startX: -30, endX: 20, y: 3.9, z: -21, speed: 0.044, dir: 1 },

      // เดินบนชานท่าน้ำไม้ริมแม่น้ำ (Z: -5 ถึง -8, Y = 0.55)
      { startX: -7.5, endX: 7.5, y: 0.55, z: -6, speed: 0.035, dir: 1 },
      { startX: 7, endX: -7, y: 0.55, z: -4.5, speed: 0.038, dir: -1 },
      { startX: -6.5, endX: 6.5, y: 0.55, z: -7.5, speed: 0.032, dir: 1 },

      // ทางเดินฝั่งเรือนไทยและฝั่งวัด
      { startX: -36, endX: -18, y: 3.9, z: -32, speed: 0.036, dir: 1 },
      { startX: -20, endX: -37, y: 3.9, z: -34, speed: 0.04, dir: -1 },
      { startX: 16, endX: 36, y: 3.9, z: -32, speed: 0.037, dir: 1 },
      { startX: 35, endX: 18, y: 3.9, z: -34, speed: 0.041, dir: -1 }
    ];

    walkingPaths.forEach((p, idx) => {
      const person = this.buildPerson(
        skinList[idx % skinList.length],
        clothList[idx % clothList.length],
        idx % 2 === 0 ? this.materials.pantsBrown : this.materials.pantsDark,
        true
      );

      const curX = p.startX + Math.random() * (p.endX - p.startX);
      person.position.set(curX, p.y, p.z);
      person.rotation.y = p.dir > 0 ? Math.PI / 2 : -Math.PI / 2;

      person.userData = {
        isWalking: true,
        startX: Math.min(p.startX, p.endX),
        endX: Math.max(p.startX, p.endX),
        speed: p.speed,
        direction: p.dir,
        baseY: p.y,
        walkCycle: Math.random() * Math.PI * 2
      };

      this.crowdGroup.add(person);
      this.people.push(person);
    });

    // 2. กลุ่มคนยืน (Standing People - 10 คน)
    const standingSpots = [
      // ยืนเลือกซื้อของหน้าร้านค้า
      { x: -24, y: 3.9, z: -25.2, rotY: Math.PI },
      { x: -12, y: 3.9, z: -26.2, rotY: Math.PI },
      { x: 12, y: 3.9, z: -26.2, rotY: Math.PI },
      { x: 24, y: 3.9, z: -25.2, rotY: Math.PI },

      // ยืนชมวิวริมรั้วทางเดินวัด (เกาะรั้วมองลงไปที่แม่น้ำ)
      { x: -14, y: 3.9, z: -18, rotY: 0 },
      { x: 14, y: 3.9, z: -18, rotY: 0 },
      { x: -25, y: 3.9, z: -18, rotY: 0.1 },
      { x: 25, y: 3.9, z: -18, rotY: -0.1 },

      // ยืนพนมมือถือกระทงเตรียมลอยที่ริมชานท่าน้ำ (หน้าสุด)
      { x: -3.5, y: 0.55, z: -1.5, rotY: 0 },
      { x: 3.5, y: 0.55, z: -1.5, rotY: 0 }
    ];

    standingSpots.forEach((s, idx) => {
      const person = this.buildPerson(
        skinList[(idx + 2) % skinList.length],
        clothList[(idx + 3) % clothList.length],
        idx % 2 === 0 ? this.materials.pantsBrown : this.materials.pantsDark,
        false
      );

      person.position.set(s.x, s.y, s.z);
      person.rotation.y = s.rotY;
      person.userData = {
        isWalking: false,
        baseY: s.y,
        phase: Math.random() * Math.PI * 2
      };

      this.crowdGroup.add(person);
      this.people.push(person);
    });

    this.scene.add(this.crowdGroup);
  }

  buildPerson(skinMat, shirtMat, pantsMat, isWalking = false) {
    const group = new THREE.Group();

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), skinMat);
    head.position.y = 2.45;
    head.name = 'head';
    group.add(head);

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
      this.materials.hairDark
    );
    hair.position.y = 2.52;
    group.add(hair);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.9, 8), shirtMat);
    torso.position.y = 1.7;
    group.add(torso);

    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.2, 6);
    legGeo.translate(0, -0.6, 0);

    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.16, 1.25, 0);
    leftLeg.name = 'left_leg';
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.16, 1.25, 0);
    rightLeg.name = 'right_leg';
    group.add(rightLeg);

    const armGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.8, 6);
    armGeo.translate(0, -0.4, 0);

    const leftArm = new THREE.Mesh(armGeo, shirtMat);
    leftArm.position.set(-0.4, 2.05, 0);
    leftArm.name = 'left_arm';
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, shirtMat);
    rightArm.position.set(0.4, 2.05, 0);
    rightArm.name = 'right_arm';
    group.add(rightArm);

    if (Math.random() > 0.45) {
      const tinyK = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.14, 0.1, 8),
        new THREE.MeshStandardMaterial({ color: 0x16a34a })
      );
      tinyK.position.set(0, 1.45, 0.4);

      const tinyFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.12, 4),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      tinyFlame.position.set(0, 1.55, 0.4);
      tinyK.add(tinyFlame);

      group.add(tinyK);
    }

    group.scale.set(0.9, 0.9, 0.9);
    return group;
  }

  update(time) {
    this.people.forEach(p => {
      const leftLeg = p.getObjectByName('left_leg');
      const rightLeg = p.getObjectByName('right_leg');
      const leftArm = p.getObjectByName('left_arm');
      const rightArm = p.getObjectByName('right_arm');

      if (p.userData.isWalking) {
        p.position.x += p.userData.speed * p.userData.direction;
        p.userData.walkCycle += 0.12;

        const walkSin = Math.sin(p.userData.walkCycle);
        if (leftLeg && rightLeg) {
          leftLeg.rotation.x = walkSin * 0.6;
          rightLeg.rotation.x = -walkSin * 0.6;
        }
        if (leftArm && rightArm) {
          leftArm.rotation.x = -walkSin * 0.5;
          rightArm.rotation.x = walkSin * 0.5;
        }

        p.position.y = p.userData.baseY + Math.abs(Math.sin(p.userData.walkCycle * 2)) * 0.05;

        if (p.userData.direction > 0 && p.position.x >= p.userData.endX) {
          p.userData.direction = -1;
          p.rotation.y = -Math.PI / 2;
        } else if (p.userData.direction < 0 && p.position.x <= p.userData.startX) {
          p.userData.direction = 1;
          p.rotation.y = Math.PI / 2;
        }
      } else {
        const ph = p.userData.phase;
        p.position.y = p.userData.baseY + Math.sin(time * 2 + ph) * 0.02;
        if (leftArm && rightArm) {
          leftArm.rotation.x = Math.sin(time * 1.5 + ph) * 0.1;
          rightArm.rotation.x = -Math.sin(time * 1.5 + ph) * 0.1;
        }
      }
    });
  }
}
