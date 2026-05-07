const documents = [
    { id: 'aadhaar', category: 'Government', title: 'Aadhaar Card', format: 'First 4 letters (UPPER) + YYYY of Birth', generate: (p) => p.fullName && p.dob ? (p.fullName.replace(/\s/g, '').substring(0, 4).toUpperCase() + new Date(p.dob).getFullYear()) : null },
    { id: 'pan', category: 'Government', title: 'PAN Card', format: 'DDMMYYYY of Birth', generate: (p) => p.dob ? formatDate(p.dob, 'DDMMYYYY') : null },
    { id: 'itr', category: 'Government', title: 'Income Tax Return', format: 'PAN (lower) + DDMMYYYY of Birth', generate: (p) => p.pan && p.dob ? (p.pan.toLowerCase() + formatDate(p.dob, 'DDMMYYYY')) : null },
    { id: 'kotak', category: 'Banking', title: 'Kotak Bank', format: 'First 4 letters (lower) + DDMM of Birth', generate: (p) => p.fullName && p.dob ? (p.fullName.replace(/\s/g, '').substring(0, 4).toLowerCase() + formatDate(p.dob, 'DDMM')) : null },
    { id: 'kotak_neo', category: 'Banking', title: 'Kotak Neo', format: 'PAN Number (UPPER)', generate: (p) => p.pan ? p.pan.toUpperCase() : null },
    { id: 'sbi', category: 'Banking', title: 'SBI Savings', format: 'Last 5 digits of Mobile + DDMMYY of Birth', generate: (p) => p.mobile && p.dob ? (p.mobile.slice(-5) + formatDate(p.dob, 'DDMMYY')) : null },
    { id: 'axis', category: 'Banking', title: 'Axis Bank (Savings/CC)', format: 'First 4 letters (UPPER) + DDMM of Birth', generate: (p) => p.fullName && p.dob ? (p.fullName.replace(/\s/g, '').substring(0, 4).toUpperCase() + formatDate(p.dob, 'DDMM')) : null },
    { id: 'hdfc_savings', category: 'Banking', title: 'HDFC Savings', format: 'Customer ID', generate: (p) => p.custId || null },
    { id: 'hdfc_cc', category: 'Banking', title: 'HDFC Credit Card', format: 'First 4 letters (UPPER) + Last 4 of Card', generate: (p) => p.fullName && p.ccLast4 ? (p.fullName.replace(/\s/g, '').substring(0, 4).toUpperCase() + p.ccLast4) : null },
    { id: 'icici', category: 'Banking', title: 'ICICI Bank', format: 'First 4 letters (lower) + DDMM of Birth', generate: (p) => p.fullName && p.dob ? (p.fullName.replace(/\s/g, '').substring(0, 4).toLowerCase() + formatDate(p.dob, 'DDMM')) : null },
    { id: 'slice', category: 'Banking', title: 'Slice / SBM Bank', format: 'DDMMYYYY of Birth', generate: (p) => p.dob ? formatDate(p.dob, 'DDMMYYYY') : null },
    { id: 'boi', category: 'Banking', title: 'Bank of India', format: 'First 4 letters (lower) + DDMM of Birth', generate: (p) => p.fullName && p.dob ? (p.fullName.replace(/\s/g, '').substring(0, 4).toLowerCase() + formatDate(p.dob, 'DDMM')) : null },
    { id: 'central', category: 'Banking', title: 'Central Bank', format: 'Cust ID + @ + DDMMYYYY of Birth', generate: (p) => p.custId && p.dob ? (p.custId + '@' + formatDate(p.dob, 'DDMMYYYY')) : null },
    { id: 'yes', category: 'Banking', title: 'Yes Bank', format: 'Customer ID + DDMMYYYY of Birth', generate: (p) => p.custId && p.dob ? (p.custId + formatDate(p.dob, 'DDMMYYYY')) : null },
    { id: 'idbi', category: 'Banking', title: 'IDBI Bank', format: 'First 4 letters (UPPER) + DDMM of Birth', generate: (p) => p.fullName && p.dob ? (p.fullName.replace(/\s/g, '').substring(0, 4).toUpperCase() + formatDate(p.dob, 'DDMM')) : null },
    { id: 'pnb', category: 'Banking', title: 'PNB Savings', format: 'Customer ID', generate: (p) => p.custId || null },
    { id: 'standard_chartered', category: 'Banking', title: 'Standard Chartered', format: 'First 4 letters (UPPER) + DDMM of Birth', generate: (p) => p.fullName && p.dob ? (p.fullName.replace(/\s/g, '').substring(0, 4).toUpperCase() + formatDate(p.dob, 'DDMM')) : null },
];

let profile = JSON.parse(localStorage.getItem('userProfile')) || {};

// DOM Elements
const documentGrid = document.getElementById('documentGrid');
const searchInput = document.getElementById('searchInput');
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const profileForm = document.getElementById('profileForm');
const closeBtn = document.querySelector('.close-btn');
const toast = document.getElementById('toast');
const downloadProfileBtn = document.getElementById('downloadProfile');

// Initialize
function init() {
    renderDocuments();
    loadProfileIntoForm();
}

function formatDate(dateStr, type) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const shortYear = String(year).slice(-2);

    if (type === 'DDMMYYYY') return `${day}${month}${year}`;
    if (type === 'DDMM') return `${day}${month}`;
    if (type === 'DDMMYY') return `${day}${month}${shortYear}`;
    return '';
}

function renderDocuments(filter = '') {
    documentGrid.innerHTML = '';
    const filtered = documents.filter(doc => 
        doc.title.toLowerCase().includes(filter.toLowerCase()) || 
        doc.category.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doc-card';
        
        const password = doc.generate(profile);
        const displayPassword = password || 'Update Profile to see';
        const isClickable = !!password;

        card.innerHTML = `
            <div>
                <div class="doc-header">
                    <span class="doc-category">${doc.category}</span>
                </div>
                <h3 class="doc-title">${doc.title}</h3>
                <p class="doc-format">${doc.format}</p>
            </div>
            <div class="doc-actions">
                <button class="copy-btn ${isClickable ? '' : 'disabled'}" onclick="copyPassword('${displayPassword}', this)">
                    <span class="material-symbols-outlined">${isClickable ? 'content_copy' : 'error'}</span>
                    ${isClickable ? 'Copy Password' : 'Missing Info'}
                </button>
            </div>
        `;
        documentGrid.appendChild(card);
    });
}

function copyPassword(text, btn) {
    if (text.includes('Update Profile')) {
        showModal();
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showToast();
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="material-symbols-outlined">check</span> Copied!`;
        btn.classList.add('success');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('success');
        }, 2000);
    });
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function showModal() {
    profileModal.classList.add('active');
}

function hideModal() {
    profileModal.classList.remove('active');
}

function loadProfileIntoForm() {
    if (profile.fullName) document.getElementById('fullName').value = profile.fullName;
    if (profile.dob) document.getElementById('dob').value = profile.dob;
    if (profile.mobile) document.getElementById('mobile').value = profile.mobile;
    if (profile.pan) document.getElementById('pan').value = profile.pan;
    if (profile.custId) document.getElementById('custId').value = profile.custId;
    if (profile.ccLast4) document.getElementById('ccLast4').value = profile.ccLast4;
}

// Event Listeners
profileBtn.addEventListener('click', showModal);
closeBtn.addEventListener('click', hideModal);
window.addEventListener('click', (e) => { if (e.target === profileModal) hideModal(); });

profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    profile = {
        fullName: document.getElementById('fullName').value,
        dob: document.getElementById('dob').value,
        mobile: document.getElementById('mobile').value,
        pan: document.getElementById('pan').value,
        custId: document.getElementById('custId').value,
        ccLast4: document.getElementById('ccLast4').value,
    };
    localStorage.setItem('userProfile', JSON.stringify(profile));
    renderDocuments();
    hideModal();
    showToast();
});

searchInput.addEventListener('input', (e) => {
    renderDocuments(e.target.value);
});

downloadProfileBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "profile_details.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

init();
