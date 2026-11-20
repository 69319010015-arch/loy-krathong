import confetti from 'canvas-confetti';
import { DataManager } from './data.js';
import { AppScene } from './scene.js';

/**
 * main.js: ควบคุมการทำงานของเว็บแอปพลิเคชัน
 * - กระทง 20 ใบในแม่น้ำเริ่มต้นเป็นกระทงประกอบฉาก (ไม่มีข้อมูลคน)
 * - กระทงที่มีคนส่งเข้าประกวดจริงเท่านั้นถึงจะมีข้อมูลคน และเปิด Popup โหวตได้
 */

class AppController {
  constructor() {
    this.dataManager = new DataManager();
    this.selectedKrathongId = null;
    this.selectedStyle = 'lotus';
    this.capturedPhotoData = null;
    this.cameraStream = null;
    this.toastTimeout = null;

    this.initElements();
    this.initScene();
    this.bindEvents();
    this.hideLoading();
  }

  initElements() {
    // Containers & Screens
    this.loadingScreen = document.getElementById('loading-screen');
    this.loadingBar = document.getElementById('loading-bar');
    this.canvasContainer = document.getElementById('canvas-container');
    this.toastScenic = document.getElementById('toast-scenic');

    // Modals
    this.modalAdd = document.getElementById('modal-add');
    this.modalVote = document.getElementById('modal-vote');
    this.modalLeaderboard = document.getElementById('modal-leaderboard');

    // Add Krathong Form Elements
    this.formAdd = document.getElementById('form-add-krathong');
    this.inputName = document.getElementById('input-name');
    this.inputWish = document.getElementById('input-wish');
    this.inputFile = document.getElementById('input-file-photo');
    this.photoPreviewImg = document.getElementById('photo-preview-img');
    this.photoPlaceholder = document.getElementById('photo-placeholder');

    // Camera Live Capture Elements
    this.cameraContainer = document.getElementById('camera-live-container');
    this.videoStream = document.getElementById('camera-stream');
    this.btnTriggerCamera = document.getElementById('btn-trigger-camera');
    this.btnCapturePhoto = document.getElementById('btn-capture-photo');
    this.btnCancelCamera = document.getElementById('btn-cancel-camera');

    // Style Selector
    this.styleButtons = document.querySelectorAll('.style-choice-btn');

    // Vote Modal Elements
    this.voteModalImg = document.getElementById('vote-modal-img');
    this.voteModalId = document.getElementById('vote-modal-id');
    this.voteModalName = document.getElementById('vote-modal-name');
    this.voteModalStyle = document.getElementById('vote-modal-style');
    this.voteModalWish = document.getElementById('vote-modal-wish');
    this.voteModalVotes = document.getElementById('vote-modal-votes');
    this.btnSubmitVote = document.getElementById('btn-submit-vote');

    // Leaderboard List
    this.leaderboardList = document.getElementById('leaderboard-list');

    // Action Buttons
    this.btnAddKrathong = document.getElementById('btn-add-krathong');
    this.btnOpenLeaderboard = document.getElementById('btn-open-leaderboard');
    this.btnCameraReset = document.getElementById('btn-camera-reset');

    // Modal Close Buttons
    this.btnCloseModalAdd = document.getElementById('btn-close-modal-add');
    this.btnCloseModalVote = document.getElementById('btn-close-modal-vote');
    this.btnCloseModalLeaderboard = document.getElementById('btn-close-modal-leaderboard');
  }

  initScene() {
    this.scene = new AppScene(
      this.canvasContainer,
      (id) => {
        // เมื่อแตะกระทงที่มีคนส่งเข้าประกวดจริง -> เปิด Modal โหวต
        this.openVoteModal(id);
      },
      () => {
        // เมื่อแตะกระทงประกอบฉาก -> แสดง Toast ชวนส่งกระทง
        this.showScenicToast();
      }
    );

    // โหลดกระทงของผู้ส่งประกวดจริงจาก LocalStorage (ถ้ามี)
    const contestants = this.dataManager.getAll();
    this.scene.loadKrathongs(contestants);
  }

  showScenicToast() {
    if (!this.toastScenic) return;
    clearTimeout(this.toastTimeout);

    this.toastScenic.classList.remove('opacity-0', '-translate-y-2');
    this.toastScenic.classList.add('opacity-100', 'translate-y-0');

    this.toastTimeout = setTimeout(() => {
      this.toastScenic.classList.remove('opacity-100', 'translate-y-0');
      this.toastScenic.classList.add('opacity-0', '-translate-y-2');
    }, 2800);
  }

  hideLoading() {
    setTimeout(() => {
      if (this.loadingBar) this.loadingBar.style.width = '100%';
      setTimeout(() => {
        if (this.loadingScreen) {
          this.loadingScreen.classList.add('opacity-0', 'pointer-events-none');
          setTimeout(() => this.loadingScreen.remove(), 700);
        }
      }, 400);
    }, 500);
  }

  bindEvents() {
    // 1. ปุ่มเปิด Modal ส่งกระทง
    this.btnAddKrathong.addEventListener('click', () => {
      this.openAddModal();
    });

    // 2. ปิด Modal ทั้งหมด
    this.btnCloseModalAdd.addEventListener('click', () => this.closeAddModal());
    this.btnCloseModalVote.addEventListener('click', () => this.closeVoteModal());
    this.btnCloseModalLeaderboard.addEventListener('click', () => this.closeLeaderboardModal());

    [this.modalAdd, this.modalVote, this.modalLeaderboard].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeAllModals();
        }
      });
    });

    // 3. ปุ่มเลือกสไตล์กระทง
    this.styleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.styleButtons.forEach(b => b.classList.remove('active', 'border-amber-400'));
        btn.classList.add('active', 'border-amber-400');
        this.selectedStyle = btn.dataset.style;
      });
    });

    // 4. ระบบกล้องถ่ายรูปสด
    this.btnTriggerCamera.addEventListener('click', async () => {
      await this.startCamera();
    });

    this.btnCapturePhoto.addEventListener('click', () => {
      this.capturePhoto();
    });

    this.btnCancelCamera.addEventListener('click', () => {
      this.stopCamera();
    });

    // 5. ระบบเลือกรูปจากเครื่อง
    this.inputFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.setPhotoPreview(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });

    // 6. ส่งกระทงใหม่
    this.formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmitKrathong();
    });

    // 7. ปุ่มโหวต
    this.btnSubmitVote.addEventListener('click', () => {
      this.handleVote();
    });

    // 8. ปุ่มอันดับคะแนน
    this.btnOpenLeaderboard.addEventListener('click', () => {
      this.openLeaderboardModal();
    });

    // 9. รีเซ็ตมุมกล้อง
    this.btnCameraReset.addEventListener('click', () => {
      this.scene.resetCamera();
    });
  }

  // --- กล้องถ่ายรูป ---
  async startCamera() {
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      this.videoStream.srcObject = this.cameraStream;
      this.cameraContainer.classList.remove('hidden');
      this.cameraContainer.classList.add('flex');
    } catch (err) {
      console.error("Camera access error:", err);
      alert("ไม่สามารถเปิดกล้องได้ กรุณาใช้ปุ่ม 'เลือกรูปจากเครื่อง' แทนครับ");
    }
  }

  capturePhoto() {
    if (!this.cameraStream) return;
    const canvas = document.createElement('canvas');
    canvas.width = this.videoStream.videoWidth || 480;
    canvas.height = this.videoStream.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoStream, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    this.setPhotoPreview(dataUrl);
    this.stopCamera();
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    this.cameraContainer.classList.add('hidden');
    this.cameraContainer.classList.remove('flex');
  }

  setPhotoPreview(dataUrl) {
    this.capturedPhotoData = dataUrl;
    this.photoPreviewImg.src = dataUrl;
    this.photoPreviewImg.classList.remove('hidden');
    this.photoPlaceholder.classList.add('hidden');
  }

  // --- การจัดการ Modals ---
  openAddModal() {
    this.modalAdd.classList.remove('hidden');
  }

  closeAddModal() {
    this.stopCamera();
    this.modalAdd.classList.add('hidden');
  }

  openVoteModal(id) {
    const item = this.dataManager.getById(id);
    if (!item) return;

    this.selectedKrathongId = id;
    this.voteModalId.textContent = item.id;
    this.voteModalName.textContent = item.name;
    this.voteModalWish.textContent = `"${item.wish}"`;
    this.voteModalVotes.textContent = item.votes || 0;
    this.voteModalImg.src = item.avatar;

    const styleNames = {
      'lotus': '🌸 กระทงดอกบัวชมพู',
      'banana-leaf': '🌿 กระทงใบตองวิจิตร',
      'golden': '✨ กระทงทองคำประกาย'
    };
    this.voteModalStyle.textContent = `รูปแบบกระทง: ${styleNames[item.style] || item.style}`;

    this.modalVote.classList.remove('hidden');
  }

  closeVoteModal() {
    this.modalVote.classList.add('hidden');
    this.selectedKrathongId = null;
  }

  openLeaderboardModal() {
    const list = this.dataManager.getLeaderboard();
    this.leaderboardList.innerHTML = '';

    if (list.length === 0) {
      // แสดงกรณีที่ยังไม่มีใครส่งกระทงเข้าประกวด
      const emptyEl = document.createElement('div');
      emptyEl.className = 'text-center py-8 px-4 bg-white/5 rounded-2xl border border-white/10';
      emptyEl.innerHTML = `
        <span class="text-4xl block mb-2">🪷</span>
        <h4 class="text-sm font-bold text-amber-200">ยังไม่มีผู้ส่งกระทงเข้าประกวด</h4>
        <p class="text-xs text-white/60 mt-1">กดปุ่ม "ส่งกระทงเข้าประกวด" ด้านล่างเพื่อเป็นท่านแรกที่ร่วมลอยกระทง!</p>
      `;
      this.leaderboardList.appendChild(emptyEl);
    } else {
      const medals = ['🥇', '🥈', '🥉'];
      list.forEach((c, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer';
        
        const rankBadge = index < 3 
          ? `<span class="text-xl w-7 text-center">${medals[index]}</span>`
          : `<span class="text-xs font-bold text-white/50 w-7 text-center">#${index + 1}</span>`;

        itemEl.innerHTML = `
          <div class="flex items-center space-x-3">
            ${rankBadge}
            <img src="${c.avatar}" alt="${c.name}" class="w-10 h-10 rounded-full object-cover border border-amber-400/40" />
            <div class="text-left">
              <h4 class="text-sm font-semibold text-white leading-snug">${c.name}</h4>
              <p class="text-[11px] text-white/50 truncate max-w-[150px] sm:max-w-[180px]">${c.wish}</p>
            </div>
          </div>
          <div class="flex items-center space-x-1.5 text-amber-300 font-bold text-sm">
            <span>💖</span>
            <span>${c.votes || 0}</span>
          </div>
        `;

        itemEl.addEventListener('click', () => {
          this.closeLeaderboardModal();
          this.openVoteModal(c.id);
        });

        this.leaderboardList.appendChild(itemEl);
      });
    }

    this.modalLeaderboard.classList.remove('hidden');
  }

  closeLeaderboardModal() {
    this.modalLeaderboard.classList.add('hidden');
  }

  closeAllModals() {
    this.closeAddModal();
    this.closeVoteModal();
    this.closeLeaderboardModal();
  }

  // --- การส่งกระทงและการโหวต ---
  handleSubmitKrathong() {
    const name = this.inputName.value.trim();
    const wish = this.inputWish.value.trim();
    if (!name || !wish) return;

    // หาพิกัดว่างในแม่น้ำที่ปลอดภัย ไม่ซ้อนทับกับกระทงอื่น
    const safePos = this.scene.findSafeWaterPosition();

    // บันทึกเฉพาะผู้ส่งจริง พร้อมพิกัดปลอดภัย
    const newContestant = this.dataManager.addContestant({
      name,
      wish,
      style: this.selectedStyle,
      avatar: this.capturedPhotoData,
      posX: safePos.x,
      posZ: safePos.z
    });

    // สร้างกระทงประกวด 3D ลงสู่แม่น้ำ พร้อมวงแสงประกาย
    this.scene.spawnContestantKrathong(newContestant);

    this.closeAddModal();
    this.formAdd.reset();
    this.photoPreviewImg.src = '';
    this.photoPreviewImg.classList.add('hidden');
    this.photoPlaceholder.classList.remove('hidden');
    this.capturedPhotoData = null;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 }
    });

    // เปิดดูรายละเอียดกระทงที่เพิ่งปล่อย
    setTimeout(() => {
      this.openVoteModal(newContestant.id);
    }, 400);
  }

  handleVote() {
    if (!this.selectedKrathongId) return;

    const newVotes = this.dataManager.vote(this.selectedKrathongId);
    this.voteModalVotes.textContent = newVotes;
    this.scene.updateVotes(this.selectedKrathongId, newVotes);

    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#fbbf24', '#f59e0b', '#ec4899', '#ffffff']
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new AppController();
});
