// Video Downloader App - Main JavaScript File

class VideoDownloader {
    constructor() {
        this.selectedPlatform = null;
        this.selectedQuality = '720p';
        this.currentVideoUrl = null;
        this.apiBase = "https://yalansy1989-video-downloader-backen.vercel.app/api"; // 🔥 رابط السيرفر
        this.init();
    }

    init() {
        this.bindEvents();
        this.initAnimations();
    }

    bindEvents() {
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectPlatform(e));
        });

        document.querySelectorAll('.quality-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectQuality(e));
        });

        const urlInput = document.getElementById('videoUrl');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        urlInput.addEventListener('input', () => this.validateUrl());
        urlInput.addEventListener('paste', () => {
            setTimeout(() => this.autoDetectPlatform(), 100);
        });
        
        analyzeBtn.addEventListener('click', () => this.analyzeUrl());

        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadVideo());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.activeElement === urlInput) {
                this.analyzeUrl();
            }
        });
    }

    initAnimations() {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('slide-in');
            });
        }, observerOptions);
        document.querySelectorAll('.gradient-card, .platform-card').forEach(el => observer.observe(el));
    }

    selectPlatform(event) {
        document.querySelectorAll('.platform-card').forEach(card => {
            card.classList.remove('ring-4', 'ring-blue-400');
        });
        const card = event.currentTarget;
        card.classList.add('ring-4', 'ring-blue-400');
        this.selectedPlatform = card.dataset.platform;
        this.updateSelectedPlatformDisplay();
        card.classList.add('pulse-animation');
        setTimeout(() => card.classList.remove('pulse-animation'), 1000);
        document.getElementById('videoUrl').focus();
    }

    updateSelectedPlatformDisplay() {
        const platformDisplay = document.getElementById('selectedPlatform');
        const platformName = document.getElementById('platformName');
        const platformNames = {
            'youtube': 'يوتيوب',
            'instagram': 'انستقرام',
            'tiktok': 'تيك توك',
            'facebook': 'فيس بوك'
        };
        platformName.textContent = platformNames[this.selectedPlatform];
        platformDisplay.classList.remove('hidden');
        platformDisplay.classList.add('slide-in');
    }

    selectQuality(event) {
        document.querySelectorAll('.quality-btn').forEach(btn => btn.classList.remove('selected'));
        const btn = event.currentTarget;
        btn.classList.add('selected');
        this.selectedQuality = btn.dataset.quality;
        document.getElementById('selectedQuality').textContent = this.selectedQuality;
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => { btn.style.transform = ''; }, 200);
    }

    validateUrl() {
        const urlInput = document.getElementById('videoUrl');
        const url = urlInput.value.trim();
        if (!url) return false;
        try {
            new URL(url);
            urlInput.classList.remove('border-red-500');
            urlInput.classList.add('border-green-500');
            return true;
        } catch {
            urlInput.classList.remove('border-green-500');
            urlInput.classList.add('border-red-500');
            return false;
        }
    }

    autoDetectPlatform() {
        const url = document.getElementById('videoUrl').value.trim();
        if (!url) return;
        if (url.includes('youtube.com') || url.includes('youtu.be')) this.selectPlatformByName('youtube');
        else if (url.includes('instagram.com')) this.selectPlatformByName('instagram');
        else if (url.includes('tiktok.com')) this.selectPlatformByName('tiktok');
        else if (url.includes('facebook.com')) this.selectPlatformByName('facebook');
    }

    selectPlatformByName(platformName) {
        const card = document.querySelector(`[data-platform="${platformName}"]`);
        if (card) card.click();
    }

    analyzeUrl() {
        const url = document.getElementById('videoUrl').value.trim();
        if (!url) {
            this.showNotification('يرجى إدخال رابط الفيديو', 'error');
            return;
        }
        if (!this.validateUrl()) {
            this.showNotification('رابط غير صحيح، يرجى التحقق من الرابط', 'error');
            return;
        }
        this.currentVideoUrl = url;
        this.autoDetectPlatform();
        this.showLoadingSection();
        this.simulateAnalysis();
    }

    simulateAnalysis() {
        let progress = 0;
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
            progressText.textContent = Math.floor(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.showQualitySection();
                    this.showPreviewSection();
                    this.hideLoadingSection();
                }, 500);
            }
        }, 200);
    }

    showLoadingSection() {
        document.getElementById('loadingSection').classList.remove('hidden');
        document.getElementById('loadingSection').classList.add('slide-in');
        document.getElementById('qualitySection').classList.add('hidden');
        document.getElementById('previewSection').classList.add('hidden');
    }

    hideLoadingSection() {
        document.getElementById('loadingSection').classList.add('hidden');
    }

    showQualitySection() {
        const section = document.getElementById('qualitySection');
        section.classList.remove('hidden');
        section.classList.add('slide-in');
    }

    showPreviewSection() {
        const section = document.getElementById('previewSection');
        section.classList.remove('hidden');
        section.classList.add('slide-in');
        const video = document.getElementById('previewVideo');
        video.poster = 'https://via.placeholder.com/640x360/1e293b/ffffff?text=معاينة+الفيديو';
    }

    downloadVideo() {
        if (!this.currentVideoUrl) {
            this.showNotification('لم يتم تحليل أي رابط بعد', 'error');
            return;
        }

        let endpoint = "";
        if (this.selectedPlatform === "youtube") endpoint = "/youtube";
        else if (this.selectedPlatform === "tiktok") endpoint = "/tiktok";
        else if (this.selectedPlatform === "instagram") endpoint = "/instagram";
        else if (this.selectedPlatform === "facebook") endpoint = "/facebook";
        else {
            this.showNotification('المنصة غير مدعومة حالياً', 'error');
            return;
        }

        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner loading-spinner"></i> جاري التحميل...';
        downloadBtn.disabled = true;

        const finalUrl = `${this.apiBase}${endpoint}?url=${encodeURIComponent(this.currentVideoUrl)}`;

        fetch(finalUrl)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.downloadUrl) {
                    window.open(data.downloadUrl, "_blank");
                } else {
                    this.showNotification(data.message || 'حدث خطأ في إنشاء رابط التحميل', 'error');
                }
            })
            .catch(() => {
                this.showNotification('فشل الاتصال بالسيرفر', 'error');
            })
            .finally(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white font-semibold min-w-[300px] slide-in`;
        switch (type) {
            case 'success': notification.classList.add('bg-green-500'); break;
            case 'error': notification.classList.add('bg-red-500'); break;
            default: notification.classList.add('bg-blue-500');
        }
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="mr-2">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentElement) notification.remove();
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VideoDownloader();
    // ✅ دالة تحميل الفيديو بعد التعديل
downloadVideo() {
    if (!this.currentVideoUrl) {
        this.showNotification('لم يتم تحليل أي رابط بعد', 'error');
        return;
    }

    // 🔥 تحديد نقطة النهاية (endpoint) حسب المنصة
    let endpoint = "";
    if (this.selectedPlatform === "youtube") endpoint = "/youtube";
    else if (this.selectedPlatform === "tiktok") endpoint = "/tiktok";
    else if (this.selectedPlatform === "instagram") endpoint = "/instagram";
    else if (this.selectedPlatform === "facebook") endpoint = "/facebook";
    else {
        this.showNotification('المنصة غير مدعومة حالياً', 'error');
        return;
    }

    // 🔄 حالة التحميل على الزر
    const downloadBtn = document.getElementById('downloadBtn');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner loading-spinner"></i> جاري التحميل...';
    downloadBtn.disabled = true;

    // 🌐 استدعاء API
    fetch(`${this.apiBase}${endpoint}?url=${encodeURIComponent(this.currentVideoUrl)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.downloadUrl) {
                // فتح رابط التحميل في نافذة جديدة
                window.open(data.downloadUrl, "_blank");
                this.showNotification('تم تجهيز رابط التحميل ✅', 'success');
            } else {
                this.showNotification(data.message || 'فشل في الحصول على رابط التحميل', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            this.showNotification('فشل الاتصال بالسيرفر ❌', 'error');
        })
        .finally(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        });
}

    console.log('🎬 محمّل الفيديوهات - تم تحميل التطبيق بنجاح!');
});

