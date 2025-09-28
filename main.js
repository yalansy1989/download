// Video Downloader App - Main JavaScript File

class VideoDownloader {
    constructor() {
        this.selectedPlatform = null;
        this.selectedQuality = '720p';
        this.currentVideoUrl = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initAnimations();
    }

    bindEvents() {
        // Platform selection
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectPlatform(e));
        });

        // Quality selection
        document.querySelectorAll('.quality-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectQuality(e));
        });

        // URL input and analysis
        const urlInput = document.getElementById('videoUrl');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        urlInput.addEventListener('input', () => this.validateUrl());
        urlInput.addEventListener('paste', () => {
            setTimeout(() => this.autoDetectPlatform(), 100);
        });
        
        analyzeBtn.addEventListener('click', () => this.analyzeUrl());

        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadVideo());

        // Keyboard shortcuts
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

        const apiBase = "https://video-downloader-backend-bu65.vercel.app
";

        let endpoint = "";
        if (this.selectedPlatform === "youtube") endpoint = "/youtube";
        else if (this.selectedPlatform === "tiktok") endpoint = "/tiktok";
        else if (this.selectedPlatform === "instagram") endpoint = "/instagram";
        else if (this.selectedPlatform === "facebook") endpoint = "/facebook";
        else {
            this.showNotification('المنصة غير مدعومة حالياً', 'error');
            return;
        }

        // Show loading state on button
        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner loading-spinner"></i> جاري التحميل...';
        downloadBtn.disabled = true;

        // Build API URL
        const finalUrl = `${apiBase}${endpoint}?url=${encodeURIComponent(this.currentVideoUrl)}`;
        window.open(finalUrl, "_blank");

        // Restore button state after short delay
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        }, 2000);
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

    getPlatformColor(platform) {
        const colors = { 'youtube': 'text-red-500','instagram':'text-pink-500','tiktok':'text-black','facebook':'text-blue-500' };
        return colors[platform] || 'text-gray-500';
    }
}

// Utility & extra features
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({behavior:'smooth',block:'start'});
        });
    });
}
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') document.getElementById('analyzeBtn').click();
        if (e.key === 'Escape') {
            document.getElementById('videoUrl').value = '';
            document.getElementById('qualitySection').classList.add('hidden');
            document.getElementById('previewSection').classList.add('hidden');
            document.getElementById('selectedPlatform').classList.add('hidden');
        }
    });
}
function addResponsiveFeatures() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) document.querySelectorAll('.platform-card').forEach(card => card.style.transition = 'all 0.2s ease');
    window.addEventListener('orientationchange', () => { setTimeout(()=>window.scrollTo(0,0),500);});
}
document.addEventListener('DOMContentLoaded', () => {
    const app = new VideoDownloader();
    addSmoothScrolling();
    addKeyboardShortcuts();
    addResponsiveFeatures();
    console.log('🎬 محمّل الفيديوهات - تم تحميل التطبيق بنجاح!');
    console.log('💡 نصيحة: استخدم Ctrl+Enter لتحليل الرابط بسرعة');
    addFloatingParticles();
    showKeyboardShortcutsInfo();
    addRippleEffect();
    loadUserPreferences();
});
function addFloatingParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles'; document.body.appendChild(particlesContainer);
    for (let i=0;i<50;i++){const p=document.createElement('div');p.className='particle';p.style.left=Math.random()*100+'%';p.style.top=Math.random()*100+'%';p.style.animationDelay=Math.random()*6+'s';p.style.animationDuration=(Math.random()*3+3)+'s';particlesContainer.appendChild(p);}
}
function showKeyboardShortcutsInfo() {
    setTimeout(() => {
        const shortcuts = ['Enter: تحليل الرابط','Ctrl+Enter: تحليل سريع','Escape: مسح البيانات'];
        console.log('⌨️ اختصارات لوحة المفاتيح:'); shortcuts.forEach(s=>console.log('  '+s));
    }, 3000);
}
function addRippleEffect() {
    document.querySelectorAll('button, .platform-card').forEach(element => {
        element.addEventListener('click', function(e){
            const ripple=document.createElement('span');const rect=this.getBoundingClientRect();const size=Math.max(rect.width,rect.height);const x=e.clientX-rect.left-size/2;const y=e.clientY-rect.top-size/2;ripple.style.width=ripple.style.height=size+'px';ripple.style.left=x+'px';ripple.style.top=y+'px';ripple.classList.add('ripple-effect');this.appendChild(ripple);setTimeout(()=>{if(ripple.parentElement)ripple.remove();},600);
        });
    });
}
function debounce(func,wait){let timeout;return function(...args){const later=()=>{clearTimeout(timeout);func(...args);};clearTimeout(timeout);timeout=setTimeout(later,wait);};}
function throttle(func,limit){let inThrottle;return function(){if(!inThrottle){func.apply(this,arguments);inThrottle=true;setTimeout(()=>inThrottle=false,limit);}};}
function handleError(error,context='عام'){console.error(`خطأ في ${context}:`,error);}
function saveToStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch(e){console.warn('تعذر حفظ البيانات محلياً:',e);}}
function loadFromStorage(key,def=null){try{const item=localStorage.getItem(key);return item?JSON.parse(item):def;}catch(e){console.warn('تعذر تحميل البيانات محلياً:',e);return def;}}
function loadUserPreferences(){const p=loadFromStorage('videoDownloaderPrefs',{preferredQuality:'720p',lastUsedPlatform:null,autoDetectPlatform:true});if(p.preferredQuality){const q=document.querySelector(`[data-quality="${p.preferredQuality}"]`);if(q){document.querySelectorAll('.quality-btn').forEach(b=>b.classList.remove('selected'));q.classList.add('selected');}}console.log('تم تحميل إعدادات المستخدم:',p);}
function saveUserPreferences(key,value){const p=loadFromStorage('videoDownloaderPrefs',{});p[key]=value;saveToStorage('videoDownloaderPrefs',p);}
if(typeof module!=='undefined'&&module.exports){module.exports=VideoDownloader;}

