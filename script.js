// API key และ URL สำหรับดึงแบนเนอร์
const API_KEY = 'c15d4d99f487a84834bcf633521d40ca';
const BANNER_API_URL = 'https://www.ramenplzbanner.space//api/get_banners.php'; // เปลี่ยนเป็น HTTPS

// ตัวแปรสำหรับ Carousel
let currentSlide = 0;
let banners = [];
let slideInterval;

// DOM Elements
const carousel = document.querySelector('.carousel');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dotsContainer = document.querySelector('.carousel-dots');

// ฟังก์ชันดึงข้อมูลแบนเนอร์จาก API
async function fetchBanners() {
    try {
        const response = await fetch(BANNER_API_URL, {
            method: 'GET',
            headers: {
                'X-API-Key': API_KEY,
                'Accept': 'application/json'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('ไม่สามารถดึงข้อมูลแบนเนอร์ได้: ' + response.status);
        }

        const data = await response.json();

        if (data.success) {
            banners = data.data || [];
        } else {
            banners = [];
        }

        if (banners.length > 0) {
            renderCarousel();
            startAutoSlide();
        } else {
            // หากไม่มีแบนเนอร์ ให้ใช้ภาพเริ่มต้น
            banners = [{ imageUrl: 'https://via.placeholder.com/1200x400', alt: 'แบนเนอร์เริ่มต้น', targetUrl: '#' }];
            renderCarousel();
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        // ใช้แบนเนอร์เริ่มต้นหากดึงข้อมูลไม่สำเร็จ
        banners = [{ imageUrl: 'https://via.placeholder.com/1200x400', alt: 'แบนเนอร์เริ่มต้น', targetUrl: '#' }];
        renderCarousel();
    }
}

// สร้าง Carousel จากข้อมูลแบนเนอร์
function renderCarousel() {
    // ล้าง Carousel ที่มีอยู่
    carousel.innerHTML = '';
    dotsContainer.innerHTML = '';

    // สร้างสไลด์และจุดนำทาง
    banners.forEach((banner, index) => {
        // สร้างสไลด์
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';

        // สร้างลิงก์สำหรับแบนเนอร์
        const link = document.createElement('a');
        link.href = banner.targetUrl || '#';
        link.target = '_blank';

        const image = document.createElement('img');
        image.src = banner.imageUrl;
        image.alt = banner.alt || banner.title || 'แบนเนอร์';
        image.onerror = function() {
            this.src = 'https://via.placeholder.com/1200x400';
        };

        link.appendChild(image);
        slide.appendChild(link);
        carousel.appendChild(slide);

        // สร้างจุดนำทาง
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // อัพเดทตำแหน่งสไลด์แรก
    updateCarousel();
}

// ไปยังสไลด์ที่กำหนด
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
    resetAutoSlide();
}

// อัพเดทตำแหน่ง Carousel
function updateCarousel() {
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

    // อัพเดทจุดนำทาง
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// สไลด์ถัดไป
function nextSlide() {
    currentSlide = (currentSlide + 1) % banners.length;
    updateCarousel();
}

// สไลด์ก่อนหน้า
function prevSlide() {
    currentSlide = (currentSlide - 1 + banners.length) % banners.length;
    updateCarousel();
}

// เริ่มการเลื่อนอัตโนมัติ
function startAutoSlide() {
    if (banners.length > 1) {
        slideInterval = setInterval(nextSlide, 5000); // เลื่อนทุก 5 วินาที
    }
}

// รีเซ็ตการเลื่อนอัตโนมัติเมื่อผู้ใช้โต้ตอบ
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Event Listeners
prevButton.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

nextButton.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

// ดึงแบนเนอร์เมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    // ตรวจสอบว่า elements มีอยู่ในหน้า
    if (carousel && prevButton && nextButton && dotsContainer) {
        fetchBanners();
    }
});

// อัพเดทแบนเนอร์ทุก 1 นาที
setInterval(fetchBanners, 60 * 1000);