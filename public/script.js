document.getElementById('regForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('.submit-btn');
    const msg = document.getElementById('msg');
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    const data = {
        name: document.getElementById('name').value,
        handle: document.getElementById('handle').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    
    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            msg.style.color = "#10b981";
            msg.innerText = "✅ Application Sent! We will WhatsApp you shortly.";
            document.getElementById('regForm').reset();
        } else {
             throw new Error();
        }
    } catch (err) {
        msg.style.color = "#ef4444";
        msg.innerText = "❌ Error. Contact us via WhatsApp directly.";
    } finally {
        submitBtn.innerText = "Apply Now";
        submitBtn.disabled = false;
    }
});