// ===== FAQ FUNCTIONALITY =====
document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', function() {
        const faqItem = this.parentElement;
        const answer = this.nextElementSibling;
        const icon = this.querySelector('i');
        const isOpen = faqItem.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                const otherAnswer = item.querySelector('.faq-answer');
                if (otherAnswer) {
                    otherAnswer.classList.remove('active');
                }
            }
        });

        // Toggle current FAQ
        if (!isOpen) {
            faqItem.classList.add('active');
            answer.classList.add('active');
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            faqItem.classList.remove('active');
            answer.classList.remove('active');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    });
});

// ===== FORM SUBMISSION =====
document.getElementById('regForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.querySelector('.submit-btn');
    const msg = document.getElementById('msg');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
        msg.innerHTML = "✅ Application Received! Check your WhatsApp for a message from our manager.";
        msg.style.color = "#00d2ff";
        msg.style.fontWeight = "600";
        btn.innerHTML = '✓ Success';
        btn.style.opacity = "0.7";
        
        // Reset form
        document.getElementById('regForm').reset();
        
        // Allow user to submit again after 5 seconds
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
            msg.innerHTML = "";
        }, 5000);
    }, 1800);
});

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = getComputedStyle(entry.target).animation;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.value-item, .perk-card, .step-item, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// ===== WHATSAPP BUTTON ANIMATION =====
const whatsappBtn = document.querySelector('.whatsapp-float');
if (whatsappBtn) {
    whatsappBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) rotate(8deg)';
    });
    
    whatsappBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
    
    // Touch support
    whatsappBtn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(1.15) rotate(8deg)';
    });
    
    whatsappBtn.addEventListener('touchend', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
}

// ===== BUTTON RIPPLE EFFECT ON MOBILE =====
document.querySelectorAll('.cta-btn, .secondary-btn, .submit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '1px';
        ripple.style.height = '1px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(1)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== RIPPLE ANIMATION =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== PREVENT LAYOUT SHIFT =====
document.addEventListener('DOMContentLoaded', () => {
    // Ensure viewport is set correctly
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        const newViewport = document.createElement('meta');
        newViewport.name = 'viewport';
        newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(newViewport);
    }
});

// ===== ACTIVE LINK HIGHLIGHTING =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--accent)';
        } else {
            link.style.color = 'var(--text-light)';
        }
    });
});