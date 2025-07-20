
//added for bot dtection
(function detectBots() {
  try {
    const isBot =
      !navigator.cookieEnabled ||
      !navigator.userAgent ||
      navigator.userAgent.toLowerCase().includes('bot') ||
      navigator.plugins.length === 0;

    if (isBot) {
      alert("Access denied. Bots are not allowed.");
      window.location.href = "https://google.com";
    }
  } catch (e) {
    console.warn("Bot detection failed:", e);
  }
})();

let currentLang = 'en';

function translatePage(lang) {
    // ✅ Validate input
    const allowedLangs = ['en', 'mr'];
    if (!allowedLangs.includes(lang)) return;

    currentLang = lang;
    document.documentElement.lang = lang;

    // Update all elements with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const translatedText = translations[lang][key];
        if (translatedText) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translatedText;
            } else if (el.tagName === 'TITLE') {
                document.title = translatedText;
            } else if (el.hasAttribute('alt')) {
                el.alt = translatedText;
            } else {
                el.textContent = translatedText;
            }
        }
    });

    // Highlight active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}


// Language toggle event
function setupLanguageToggle() {
    document.getElementById('lang-marathi').addEventListener('click', () => translatePage('mr'));
    document.getElementById('lang-english').addEventListener('click', () => translatePage('en'));
}

// Hamburger menu
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    // Close menu on link click (mobile UX)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

// Section entrance animations
function setupSectionAnimations() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });
    sections.forEach(section => observer.observe(section));
}

// Smooth scroll for nav links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Admin Panel reveal
function setupAdminPanelReveal() {
    let adminVisible = false;
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toLowerCase() === 'a') {
            adminVisible = !adminVisible;
            document.querySelector('.admin-link').style.display = adminVisible ? 'inline-block' : 'none';
        }
    });
}

// Animate photos on load
function animatePhotosOnLoad() {
    const photos = document.querySelectorAll('.photo-img');
    photos.forEach((img, i) => {
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1) translateY(0)';
        }, 300 + i * 180);
    });
}

function setupPhotoModal() {
    const images = Array.from(document.querySelectorAll('.photos-scroll .photo-img'));
    const modal = document.getElementById('photo-modal');
    const modalImg = modal.querySelector('.modal-img');
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');
    const footer = document.querySelector('footer');

    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const focusableElements = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstEl) {
                e.preventDefault();
                lastEl.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        }
    });


    let currentIndex = 0;

    function showModal(index) {
        currentIndex = index;
        modalImg.src = DOMPurify.sanitize(images[currentIndex].src);
        modalImg.alt =DOMPurify.sanitize( images[currentIndex].alt);
        modal.classList.add('active');
        modal.focus();
        document.body.style.overflow = 'hidden';
        if (footer) footer.style.display = 'none';

    }
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (footer) footer.style.display = 'block';
    }
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showModal(currentIndex);
    }
    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        showModal(currentIndex);
    }
    images.forEach((img, i) => {
        img.addEventListener('click', () => showModal(i));
    });
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'Escape') closeModal();
    });
}

function setupQRModal() {
    const showBtn = document.getElementById('show-qr-btn');
    const modal = document.getElementById('qr-modal');
    const closeBtn = modal.querySelector('.qr-modal-close');
    const footer = document.querySelector('footer');

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (footer) footer.style.display = 'none';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (footer) footer.style.display = 'block';
    }

    showBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active') && e.key === 'Escape') closeModal();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageToggle();
    setupHamburgerMenu();
    setupSectionAnimations();
    setupSmoothScroll();
    setupAdminPanelReveal();
    translatePage(currentLang);
    animatePhotosOnLoad();
    setupPhotoModal();
    setupQRModal();
    setupSection();
    setFooter();
});

//we are adding this for section on off code


function setupSection() {
    // console.log("1")
    const menuItems = document.querySelectorAll('#menu li');
    const sections = document.querySelectorAll('.section');
    //  console.log("start")
    //console.log(menuItems);
    //console.log(sections);
    //console.log("end");
    const defaultSection = document.getElementById('section1');
    if (defaultSection) {
        defaultSection.classList.add('active');
    }
    menuItems.forEach(item => {
        console.log(item.getAttribute('data-target'))
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if(targetId && item.getAttribute('data-target')){
                //console.log("3"+targetId)
            // Hide all sections
            //  sections.forEach(section => section.classList.remove('active'));
            if (targetSection) {
                sections.forEach(section => section.classList.remove('active'));
                targetSection.classList.add('active');
            } else {
                console.warn(`Section with ID ${targetId} not found.`);
            }
          
            }else{
                    console.warn(`Section with ID2 ${targetId} not found.`);
            }
          
        });
    });
}


function setFooter() {
    const photoModal = document.getElementById('photo-modal');
    const modalClose = document.querySelector('.modal-close');

    photoImages.forEach(img => {
        img.addEventListener('click', () => {
            photoModal.style.display = 'block';
            footer.style.display = 'none';
        });
    });

    // Close modal and show footer again
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            photoModal.style.display = 'none';
            footer.style.display = 'block';
        });
    }
}


