document.getElementById('regForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('.submit-btn');
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
            document.getElementById('msg').style.color = "#10b981";
            document.getElementById('msg').innerText = "Application Sent Successfully! Team Galaxy will call you shortly.";
            document.getElementById('regForm').reset();
        } else {
             throw new Error();
        }
    } catch (err) {
        document.getElementById('msg').style.color = "#ef4444";
        document.getElementById('msg').innerText = "Error. Please try again or contact via WhatsApp.";
    } finally {
        submitBtn.innerText = "Apply to Team Galaxy";
        submitBtn.disabled = false;
    }
});