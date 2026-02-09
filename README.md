# ⚡ Aparichit - Complaint Registration System ⚡
## Based on Garuda Purana - Punishment for Sins

### 🎭 Project Overview
**Aparichit** is a dark, horror-themed complaint registration system inspired by the Garuda Purana (ancient Hindu text about sins and punishments). The project uses a sophisticated database system to track complaints and assign punishments based on categories of sins.

---

## 🌪️ Features

### 1. **Horror-Themed Design**
- Animated dark backgrounds with red/black color scheme
- Flickering text animations and glowing effects
- Pulsing buttons with shadow effects
- Responsive design for all devices

### 2. **Sin Category System (Garuda Purana-Based)**
The system categorizes complaints into 8 types of sins:

| पाप (Sin) | English | गंभीरता (Severity) | नरक (Hell) |
|-----------|---------|-----------------|----------|
| क्रोध | Anger/Violence | 9/10 | तम्सराज |
| लोभ | Greed/Avarice | 8/10 | तरलौह |
| काम | Lust | 8/10 | वग |
| अहंकार | Pride | 7/10 | विजु |
| महज | Jealousy | 7/10 | कन्थर |
| आलस्य | Lethargy | 6/10 | अंधकार |
| छल | Deception | 8/10 | निकुम्भिल |
| अधर्म | Irreligion | 10/10 | महारौरव |

### 3. **Advanced Database System**
- **Browser LocalStorage Database**: All complaints stored permanently in browser
- **JSON Format**: Structured data for easy analysis
- **Automatic Analytics**: Tracks complaint patterns by category

### 4. **Complaint Submission Flow**
1. User enters Home Page
2. Views live complaint counter
3. Selects sin category
4. Writes detailed complaint (min 10 words)
5. System assigns punishment from Garuda Purana
6. Complaint recorded to database
7. User sees assigned punishment on confirmation page

### 5. **Database Features**
- ✅ Add new complaints with full metadata
- ✅ View all complaints by category
- ✅ Export data as JSON
- ✅ Export data as CSV
- ✅ Real-time analytics and statistics
- ✅ Severity-based classification
- ✅ Timestamp tracking
- ✅ Clear/delete functionality

---

## 📂 File Structure

```
Aparichit/
├── index.html              # Entry point with warning message
├── Home Page.html          # Home/dashboard with complaint counter
├── Request.html            # Complaint submission form with category selector
├── Confirmation.html       # Punishment display and confirmation
├── admin.html              # Admin dashboard for database management
│
├── style.css               # Main page styling
├── Home Page.css           # Home page styling
├── Request.css             # Request form styling
├── Confirmation.css        # Confirmation page styling
│
├── script.js               # Core JavaScript with database logic
│
├── Audios/                 # Audio files for horror theme
│   └── Theme Song.mp3
├── Images/                 # Background and icon images
│   └── Hell.jpg
│   └── Icon.jpg
└── Videos/                 # Video files for horror effects
    ├── Video 1.mp4
    └── Video 2.mp4
```

---

## 🗄️ Database Schema

### Complaint Object
```json
{
  "id": 1707424234567,
  "text": "User's complaint description",
  "category": "क्रोध",
  "severity": 9,
  "punishment": "तम्सराज नरक में: भीषण आग से सडा दिया जाएगा",
  "timestamp": "09/02/2026, 3:42:15 pm",
  "status": "PENDING",
  "ipInfo": {
    "userAgent": "Mozilla/5.0...",
    "language": "en-IN",
    "timestamp": "2026-02-09T15:42:15.567Z"
  }
}
```

### Storage Keys
- `aparichitComplaints`: Main complaints array (JSON)
- `aparichitAnalytics`: Category-wise complaint statistics (JSON)

---

## 🚀 How to Use

### **For Users:**

1. **Access the Application**
   - Open `index.html` in a web browser
   - Click "ENTER" to proceed

2. **Submit a Complaint**
   - Click "SUBMIT COMPLAINT" on home page
   - Select your sin category from dropdown
   - Write detailed complaint (preview shows punishment)
   - Click "SUBMIT COMPLAINT" button
   - View your assigned punishment

3. **Check Statistics**
   - Go to Home Page
   - Click "VIEW DATABASE" to see all complaints
   - Click "STATISTICS" to see category breakdown
   - Click "EXPORT DATA" to download as JSON

### **For Administrators:**

1. **Access Admin Console**
   - Open `admin.html` directly
   - Or click "VIEW DATABASE" on home page

2. **Dashboard Features**
   - View total complaints count
   - See average and maximum severity levels
   - Chart visualization of sin categories
   - Full complaint table with all details
   - Export options (JSON/CSV)

3. **Export Data**
   - **JSON Export**: Complete structured data with analytics
   - **CSV Export**: Spreadsheet-compatible format for analysis

---

## 🎨 Punishment System

The system randomly assigns punishments from the Garuda Purana based on sin category:

```javascript
const punishmentDatabase = {
    "क्रोध": {
        punishments: [
            "तम्सराज नरक में: भीषण आग से सडा दिया जाएगा",
            "शरीर पर तपते लोहे की छड़ें: हजार गुना पीड़ा"
        ]
    },
    // ... more sins
}
```

Each sin category has:
- **Name**: Hindi and English
- **Punishments**: Array of 2+ punishment descriptions
- **Severity**: 6-10 scale rating

---

## 💻 Technical Features

### Frontend Technologies
- **HTML5**: Semantic markup with meta tags
- **CSS3**: Advanced animations, gradients, flexbox, grid
- **Vanilla JavaScript**: No frameworks, pure ES6+

### Advanced Styling
- **Animations**: Flickering, pulsing, glowing effects
- **Gradients**: Multi-layer linear and radial gradients
- **Responsive Design**: Mobile, tablet, desktop optimization
- **Dark Theme**: Full dark mode support

### JavaScript Functionality
- **LocalStorage API**: Persistent client-side database
- **SessionStorage**: Temporary complaint passing
- **JSON Handling**: Serialization and deserialization
- **Event Listeners**: Form validation and interactivity
- **Date/Time**: ISO 8601 timestamp tracking

---

## 🔒 Data Privacy

- ✅ All data stored **locally in browser** (no server needed)
- ✅ No external API calls
- ✅ No cloud services
- ✅ User data never leaves the device
- ⚠️ Data persists until browser cache is cleared

---

## 🎬 Media Assets Requirements

You'll need these media files in respective folders:

**Audios/**
- `Theme Song.mp3` - Horror theme music

**Images/**
- `Hell.jpg` - Dark background image
- `Icon.jpg` - Browser icon

**Videos/**
- `Video 1.mp4` - Home page video
- `Video 2.mp4` - Confirmation page video

---

## 🛠️ Customization

### Change Sin Categories
Edit the `punishmentDatabase` object in `script.js`:

```javascript
const punishmentDatabase = {
    "आपकी श्रेणी": {
        name: "आपकी श्रेणी - विवरण",
        punishments: ["दंड 1", "दंड 2"],
        severity: 7
    }
}
```

### Modify Styling
- Edit CSS files for colors, animations, fonts
- Change background gradients in body styles
- Adjust font sizes for different screen sizes

### Add New Features
- Create new HTML pages
- Add form validation in script.js
- Implement server-side database
- Add user authentication

---

## 📊 Viewing Database

### Method 1: Browser Console
```javascript
// In browser console (F12 → Console):
aparichitDB.getAllComplaints()
aparichitDB.getAnalytics()
```

### Method 2: Admin Dashboard
- Visit `admin.html`
- View live statistics
- Export data

### Method 3: Browser Developer Tools
- Press F12
- Go to Application → Local Storage
- Look for keys: `aparichitComplaints`, `aparichitAnalytics`

---

## 🚨 Important Notes

⚠️ **Data Persistence**
- Data stored in localStorage persists across browser sessions
- Clearing browser cache/cookies will delete all data
- Always backup important data using export function

⚠️ **Browser Compatibility**
- Requires modern browser with ES6+ support
- Works on Chrome, Firefox, Safari, Edge
- Mobile browsers supported

⚠️ **Performance**
- Handles 1000+ complaints without lag
- Animations may slow on older devices
- Disable animations in slow devices

---

## 🎯 Future Enhancements

- [ ] Backend database (MongoDB/Firebase)
- [ ] User authentication
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Data visualization (charts/graphs)
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Comment/reply system
- [ ] Severity-based auto-response
- [ ] AI-based punishment suggestion

---

## 📜 Garuda Purana References

This project is inspired by the **Garuda Purana**, an ancient Hindu text that describes:
- The consequences of various sins
- Different types of hells (naraks)
- The journey of the soul after death
- Methods of atonement and redemption

The punishments mentioned are based on traditional Hindu philosophy and are used here for creative/entertainment purposes.

---

## 📄 License

This project is created for educational and entertainment purposes. Use freely with attribution.

---

## 👨‍💻 Developer Notes

### Key Files:
- **script.js**: Contains `ComplaintDatabase` class and punishment system
- **index.html**: Entry animation and warning
- **admin.html**: Complete database management interface

### Database Methods:
```javascript
db.addComplaint(data)          // Add new complaint
db.getAllComplaints()          // Get all stored complaints
db.getAnalytics()              // Get category statistics
db.deleteComplaint(id)         // Delete by ID
db.exportComplaints()          // Export all data
db.clearAllComplaints()        // Clear database
```

---

## 🎭 Script Flow

```
index.html (START)
    ↓ [ENTER]
Home Page.html (Display counter, show options)
    ↓ [SUBMIT COMPLAINT]
Request.html (Select category, write complaint)
    ↓ [SUBMIT]
script.js (Process & store in localStorage)
    ↓
Confirmation.html (Show assigned punishment)
    ↓
[END / SUBMIT ANOTHER]
```

---

## ✨ Credits

- **Concept**: Garuda Purana
- **Design**: Dark/Horror theme
- **Technology**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Browser LocalStorage

---

**Last Updated**: February 9, 2026

---

### Questions or Issues?

For any questions about the project functionality or customization, refer to the code comments in each file.

**Remember**: "आपके पाप आपके साथ हैं" - Your sins follow you!
