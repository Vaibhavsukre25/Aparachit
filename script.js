// Garuda Purana Punishment Database System
// All complaints and punishments stored locally

const punishmentDatabase = {
    "क्रोध": {
        name: "क्रोध - क्रूरता का दंड",
        punishments: [
            "तम्सराज नरक में: भीषण आग से सडा दिया जाएगा",
            "शरीर पर तपते लोहे की छड़ें: हजार गुना पीड़ा"
        ],
        severity: 9
    },
    "लोभ": {
        name: "लोभ - लालच का दंड",
        punishments: [
            "तरलौह: पिघली हुई धातु निगलनी होगी सदा",
            "दरिद्रता का चक्र: हमेशा भूखे-नंगे रहना"
        ],
        severity: 8
    },
    "काम": {
        name: "काम - वासना का दंड",
        punishments: [
            "वग नरक में भस्म होना: शरीर पर तीक्ष्ण अग्नि",
            "काम की भीषण पीड़ा: शरीर के हर अंग में दर्द"
        ],
        severity: 8
    },
    "अहंकार": {
        name: "अहंकार - घमंड का दंड",
        punishments: [
            "विजु नरक में: कीड़े बनकर सडना",
            "अपमान और तिरस्कार सदा: समाज से निष्कासन"
        ],
        severity: 7
    },
    "महज": {
        name: "महज - ईर्ष्या का दंड",
        punishments: [
            "कन्थर नरक में: दूसरों की खुशी देखते रहना लेकिन पीड़ा सहना",
            "वेदना का सफर: हमेशा असंतुष्ट रहना"
        ],
        severity: 7
    },
    "आलस्य": {
        name: "आलस्य - सुस्ती का दंड",
        punishments: [
            "अंधकार नरक में: निरंतर अंधेरे में भटकना",
            "शक्तिहीनता: कोई काम करने की क्षमता न होना"
        ],
        severity: 6
    },
    "छल": {
        name: "छल - धोखे का दंड",
        punishments: [
            "निकुम्भिल नरक: हर समय धोखा खाना और पछताना",
            "विश्वास टूटना: कोई आपको विश्वास न करे"
        ],
        severity: 8
    },
    "अधर्म": {
        name: "अधर्म - सर्वोच्च पाप का दंड",
        punishments: [
            "महारौरव नरक में: यमदूत द्वारा अनंत प्रताड़ना",
            "सभी नरकों का संचय: सभी दंड एक साथ भुगतना पड़ेगा"
        ],
        severity: 10
    }
};

// Advanced Complaint Database Class
class ComplaintDatabase {
    constructor() {
        this.storageKey = 'aparichitComplaints';
        this.analyticsKey = 'aparichitAnalytics';
    }

    addComplaint(complaintData) {
        const complaints = this.getAllComplaints();
        const newComplaint = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('en-IN'),
            status: 'PENDING',
            ipInfo: this.getDeviceInfo(),
            // include provided fields (text, category, severity, punishment, reporterName, etc.)
            ...complaintData
        };
        complaints.push(newComplaint);
        localStorage.setItem(this.storageKey, JSON.stringify(complaints));
        this.updateAnalytics(complaintData.category);
        return newComplaint;
    }

    getAllComplaints() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    getComplaintsByCategory(category) {
        return this.getAllComplaints().filter(c => c.category === category);
    }

    getComplaintSeverityStats() {
        const complaints = this.getAllComplaints();
        return complaints.reduce((acc, c) => ({
            ...acc,
            [c.category]: (acc[c.category] || 0) + 1
        }), {});
    }

    updateAnalytics(category) {
        const analytics = this.getAnalytics();
        if (!analytics[category]) {
            analytics[category] = 0;
        }
        analytics[category]++;
        localStorage.setItem(this.analyticsKey, JSON.stringify(analytics));
    }

    getAnalytics() {
        const data = localStorage.getItem(this.analyticsKey);
        return data ? JSON.parse(data) : {};
    }

    deleteComplaint(id) {
        let complaints = this.getAllComplaints();
        complaints = complaints.filter(c => c.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(complaints));
    }

    exportComplaints() {
        return this.getAllComplaints();
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            timestamp: new Date().toISOString()
        };
    }

    clearAllComplaints() {
        if (confirm('Are you sure you want to delete all complaints? This action cannot be undone!')) {
            localStorage.removeItem(this.storageKey);
            return true;
        }
        return false;
    }
}

// Initialize Database
const db = new ComplaintDatabase();
// API base (server). Adjust or set window.API_BASE if different (e.g., production)
const API_BASE = window.API_BASE || 'http://localhost:4000';

// Utility: read attachment(s) as data URLs (returns Promise)
function readAttachments(fileInput) {
    return new Promise((resolve) => {
        const files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
        if (!files.length) return resolve([]);
        const readers = files.map(f => {
            return new Promise((res) => {
                const r = new FileReader();
                r.onload = () => res({ name: f.name, type: f.type, data: r.result });
                r.onerror = () => res(null);
                r.readAsDataURL(f);
            });
        });
        Promise.all(readers).then(results => resolve(results.filter(Boolean)));
    });
}

// Enable site audio after user gesture
function enableAudio() {
    localStorage.setItem('aparichitAudioEnabled', '1');
    const vids = document.querySelectorAll('video');
    const auds = document.querySelectorAll('audio');
    vids.forEach(v => { try { v.muted = false; v.play().catch(()=>{}); } catch(e){} });
    auds.forEach(a => { try { a.muted = false; a.play().catch(()=>{}); } catch(e){} });
}

// Small helper for validating email
function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// Form Submission Handler (supports new fields & attachments)
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById("input");
    const btn = document.getElementById("submit");
    const categorySelect = document.getElementById("category");
    const punishmentPreview = document.getElementById("punishmentPreview");
    const attachments = document.getElementById('attachments');
    const reporterName = document.getElementById('reporterName');
    const reporterEmail = document.getElementById('reporterEmail');
    const targetName = document.getElementById('targetName');
    const identifier = document.getElementById('identifier');

    // Show preview when category changes
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const selectedCategory = this.value;
            const punishment = punishmentDatabase[selectedCategory];
            if (punishment && punishmentPreview) {
                punishmentPreview.innerHTML = `<strong>दंड की जानकारी:</strong> ${punishment.name}<br><em>"${punishment.punishments[0]}"</em>`;
                punishmentPreview.classList.add('show');
            }
        });
    }

    if (btn) {
        btn.addEventListener("click", async function(e) {
            e.preventDefault();
            const complaintText = input ? input.value.trim() : '';
            const selectedCategory = categorySelect ? categorySelect.value : "अधर्म";
            const rName = reporterName ? reporterName.value.trim() : '';
            const rEmail = reporterEmail ? reporterEmail.value.trim() : '';
            const tName = targetName ? targetName.value.trim() : '';
            const iden = identifier ? identifier.value.trim() : '';

            if (!rName) { alert('कृपया अपना नाम दर्ज करें।'); return; }
            if (!rEmail || !isValidEmail(rEmail)) { alert('कृपया वैध ईमेल दर्ज करें।'); return; }
            if (!tName) { alert('कृपया जिस व्यक्ति/संस्था का नाम दर्ज करना है वह भरें।'); return; }
            if (!complaintText || complaintText.length < 10) { alert('⚠ कम से कम 10 शब्द लिखो!'); return; }

            const punishment = punishmentDatabase[selectedCategory] || punishmentDatabase["अधर्म"];
            const randomPunishment = punishment.punishments[Math.floor(Math.random() * punishment.punishments.length)];

            // read attachments (if any) with client-side limits (5MB each)
            const filesData = attachments ? await readAttachments(attachments) : [];
            for (const f of (attachments.files || [])) {
                if (f.size > 5 * 1024 * 1024) { alert('Each attachment must be <= 5MB'); return; }
            }

            const payload = {
                text: complaintText,
                category: selectedCategory,
                severity: punishment.severity,
                punishment: randomPunishment,
                reporterName: rName,
                reporterEmail: rEmail,
                targetName: tName,
                identifier: iden
            };

            // Try sending to server API first; fallback to localStorage if unavailable
            let savedComplaint = null;
            try {
                const form = new FormData();
                Object.keys(payload).forEach(k => form.append(k, payload[k]));
                if (attachments && attachments.files) {
                    Array.from(attachments.files).forEach(f => form.append('attachments', f, f.name));
                }
                const res = await fetch(`${API_BASE}/api/complaints`, { method: 'POST', body: form });
                if (res.ok) {
                    const data = await res.json();
                    savedComplaint = { id: data.id, ...payload };
                } else { throw new Error('server error'); }
            } catch (e) {
                // Fallback: save in localStorage as before
                const complaint = db.addComplaint({
                    text: complaintText,
                    category: selectedCategory,
                    severity: punishment.severity,
                    punishment: randomPunishment,
                    reporterName: rName,
                    reporterEmail: rEmail,
                    targetName: tName,
                    identifier: iden,
                    attachments: filesData
                });
                savedComplaint = complaint;
            }

            // Save to session for confirmation page
            sessionStorage.setItem('currentComplaint', JSON.stringify(savedComplaint));

            // Provide immediate feedback
            input.value = "";
            input.value = "💀 आपकी वेदना दर्ज हो गई! नरक की सजा निश्चित है! 💀";
            input.style.color = "#ff0000";

            // Attempt to enable audio if user previously allowed
            if (localStorage.getItem('aparichitAudioEnabled')) enableAudio();

            setTimeout(() => {
                window.location.href = "Confirmation.html";
            }, 1200);
        });
    }
});

// Admin Dashboard Function
function viewAllComplaints() {
    const complaints = db.getAllComplaints();
    console.log('Total Complaints:', complaints.length);
    console.log('All Complaints:', complaints);
    return complaints;
}

function getComplaintStats() {
    const stats = db.getAnalytics();
    console.log('Complaint Statistics:', stats);
    return stats;
}

// Export for debugging
window.aparichitDB = db;
