document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.nextElementSibling;
        const icon = item.querySelector('i');
        const isOpen = answer.style.display === "block";
        
        // Close others
        document.querySelectorAll('.faq-answer').forEach(a => a.style.display = "none");
        document.querySelectorAll('.faq-question i').forEach(i => {
            i.classList.remove('fa-chevron-up');
            i.classList.add('fa-chevron-down');
        });

        if (!isOpen) {
            answer.style.display = "block";
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    });
});

document.getElementById('regForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.querySelector('.submit-btn');
    const msg = document.getElementById('msg');
    btn.innerHTML = 'Sending Application...';
    btn.disabled = true;

    setTimeout(() => {
        msg.innerHTML = "✅ Application Received! Check your WhatsApp for a message from our manager.";
        msg.style.color = "green";
        btn.innerHTML = 'Success';
    }, 1800);
});