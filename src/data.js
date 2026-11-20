/**
 * data.js: จัดการข้อมูลกระทงที่ผู้ใช้งานส่งเข้าประกวดจริง (พร้อม LocalStorage)
 * *กระทงเริ่มต้นในแม่น้ำ 20 กระทงเป็นกระทงประกอบฉาก ไม่มีข้อมูลคน*
 */

const STORAGE_KEY = 'loy_krathong_contestants_v2';

export class DataManager {
  constructor() {
    this.contestants = [];
    this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.contestants = JSON.parse(stored);
      } else {
        // เริ่มต้นว่างเปล่า ไม่มีข้อมูลคนปลอม มีเฉพาะกระทงที่คนส่งจริง
        this.contestants = [];
        this.saveData();
      }
    } catch (e) {
      console.warn("Could not read from localStorage:", e);
      this.contestants = [];
    }
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.contestants));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  getAll() {
    return this.contestants;
  }

  getById(id) {
    return this.contestants.find(c => c.id === id);
  }

  addContestant({ name, wish, style, avatar, posX, posZ }) {
    const newId = this.contestants.length > 0 
      ? Math.max(...this.contestants.map(c => c.id)) + 1 
      : 1;

    const newContestant = {
      id: newId,
      name,
      wish,
      style: style || 'lotus',
      votes: 1, // เริ่มต้น 1 คะแนนจากเจ้าของ
      avatar: avatar || this.createDefaultAvatar(name),
      createdTime: Date.now(),
      posX: posX !== undefined ? posX : (Math.random() - 0.5) * 14,
      posZ: posZ !== undefined ? posZ : 10 + Math.random() * 8,
      isScenic: false // เป็นกระทงที่มีข้อมูลคนจริง
    };

    this.contestants.push(newContestant);
    this.saveData();
    return newContestant;
  }

  createDefaultAvatar(name) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="grad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.4"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" rx="100" fill="#ec4899"/>
      <rect width="200" height="200" rx="100" fill="url(#grad)"/>
      <text x="50%" y="45%" text-anchor="middle" dominant-baseline="central" font-size="70">🪷</text>
      <text x="50%" y="80%" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-family="Prompt, sans-serif" font-weight="bold" font-size="18">${name.split(' ')[0]}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  vote(id) {
    const contestant = this.getById(id);
    if (contestant) {
      contestant.votes = (contestant.votes || 0) + 1;
      this.saveData();
      return contestant.votes;
    }
    return 0;
  }

  getLeaderboard() {
    return [...this.contestants].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  }
}
