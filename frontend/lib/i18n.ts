export type Language = "en" | "hi";

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const DICTIONARY: Translations = {
  // Brand & Subtitle
  brandName: { en: "Aashray", hi: "आश्रय" },
  brandSubtitle: {
    en: "AI-Based Disaster Risk Mapping & Relocation Recommendation System",
    hi: "एआई-आधारित आपदा जोखिम मानचित्रण एवं सुरक्षित पुनर्वास अनुशंसा प्रणाली",
  },
  tagline: {
    en: "Identify Risk. Protect Communities. Plan Safer Relocation.",
    hi: "जोखिम पहचानें। समुदायों की रक्षा करें। सुरक्षित पुनर्वास की योजना बनाएं।",
  },
  demoModeNotice: {
    en: "DEMO MODE — Not Official Government Data",
    hi: "डेमो मोड — आधिकारिक सरकारी डेटा नहीं है",
  },

  // Roles & Portals
  roleAdmin: { en: "Administrator", hi: "प्रशासक (Admin)" },
  roleUser: { en: "Citizen / Resident", hi: "नागरिक / निवासी" },
  adminCardDesc: {
    en: "Manage risk data, alerts, habitations, relocation planning and system insights.",
    hi: "जोखिम डेटा, अलर्ट, बस्तियों, पुनर्वास योजना और विश्लेषणात्मक जानकारी प्रबंधित करें।",
  },
  userCardDesc: {
    en: "View local risks, alerts, relocation status and report issues.",
    hi: "स्थानीय जोखिम, चेतावनियां, पुनर्वास स्थिति देखें और समस्याओं की रिपोर्ट करें।",
  },
  adminLoginTitle: { en: "Institutional & Authority Login", hi: "प्रशासनिक एवं अधिकारी लॉगिन" },
  userLoginTitle: { en: "Citizen Portal Access", hi: "नागरिक पोर्टल पहुंच" },

  // Navigation Links
  navDashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  navRiskMap: { en: "Risk Map", hi: "जोखिम मानचित्र" },
  navHabitations: { en: "Habitations", hi: "बस्तियां" },
  navRiskAssessment: { en: "Risk Assessment", hi: "जोखिम मूल्यांकन" },
  navCarryingCapacity: { en: "Carrying Capacity", hi: "धारण क्षमता" },
  navRelocation: { en: "Relocation", hi: "पुनर्वास" },
  navSafeZones: { en: "Safe Zones", hi: "सुरक्षित क्षेत्र" },
  navAlerts: { en: "Alerts", hi: "चेतावनियां" },
  navComplaints: { en: "Complaints", hi: "नागरिक शिकायतें" },
  navReports: { en: "Reports", hi: "रिपोर्ट" },
  navAIAssistant: { en: "AI Assistant", hi: "एआई सहायक" },
  navSettings: { en: "Settings", hi: "सेटिंग्स" },

  // Citizen Navigation
  navMyDashboard: { en: "My Dashboard", hi: "मेरा डैशबोर्ड" },
  navMyRiskMap: { en: "My Risk Map", hi: "मेरा जोखिम मानचित्र" },
  navMyRelocation: { en: "Relocation Status", hi: "पुनर्वास स्थिति" },
  navReportIssue: { en: "Report an Issue", hi: "समस्या दर्ज करें" },

  // KPIs
  kpiTotalHabitations: { en: "Total Habitations", hi: "कुल बस्तियां" },
  kpiCriticalZones: { en: "Critical Zones", hi: "अति संवेदनशील क्षेत्र" },
  kpiHighRiskAreas: { en: "High Risk Areas", hi: "उच्च जोखिम क्षेत्र" },
  kpiPopulationAtRisk: { en: "Population at Risk", hi: "जोखिम में जनसंख्या" },
  kpiImmediateRelocations: { en: "Immediate Relocation Cases", hi: "तत्काल पुनर्वास मामले" },
  kpiOpenComplaints: { en: "Open Complaints", hi: "लंबित शिकायतें" },

  // Risk Levels
  riskCritical: { en: "CRITICAL", hi: "अति गंभीर" },
  riskHigh: { en: "HIGH", hi: "उच्च जोखिम" },
  riskModerate: { en: "MODERATE", hi: "मध्यम" },
  riskSafe: { en: "SAFE / LOW", hi: "सुरक्षित / कम" },

  // Hazards
  hazardFlood: { en: "Flood", hi: "बाढ़" },
  hazardLandslide: { en: "Landslide", hi: "भूस्खलन" },
  hazardErosion: { en: "Riverine Erosion", hi: "नदी कटाव" },

  // Common Actions & Buttons
  btnLogin: { en: "Sign In", hi: "लॉगिन करें" },
  btnRegister: { en: "Create Account", hi: "खाता बनाएं" },
  btnLogout: { en: "Logout", hi: "लॉगआउट" },
  btnSwitchRole: { en: "Switch Role", hi: "भूमिका बदलें" },
  btnDemoAccess: { en: "Instant Demo Access", hi: "त्वरित डेमो पहुंच" },
  btnSubmit: { en: "Submit Report", hi: "रिपोर्ट जमा करें" },
  btnCancel: { en: "Cancel", hi: "रद्द करें" },
  btnSearch: { en: "Search", hi: "खोजें" },
  btnRefresh: { en: "Refresh", hi: "ताज़ा करें" },
  btnViewDetails: { en: "View Details", hi: "विवरण देखें" },
  btnAskAI: { en: "Ask Aashray AI", hi: "आश्रय एआई से पूछें" },

  // Complaint Statuses
  statusSubmitted: { en: "Submitted", hi: "दर्ज की गई" },
  statusUnderReview: { en: "Under Review", hi: "समीक्षाधीन" },
  statusInProgress: { en: "In Progress", hi: "प्रक्रियाधीन" },
  statusResolved: { en: "Resolved", hi: "समाधान हुआ" },
  statusRejected: { en: "Rejected", hi: "अस्वीकृत" },

  // Relocation Statuses
  relocAssessmentPending: { en: "Assessment Pending", hi: "मूल्यांकन लंबित" },
  relocAssessmentCompleted: { en: "Assessment Completed", hi: "मूल्यांकन पूर्ण" },
  relocRecommended: { en: "Relocation Recommended", hi: "पुनर्वास अनुशंसित" },
  relocPlanning: { en: "Planning & Allocation", hi: "योजना एवं आवंटन" },
  relocInProgress: { en: "Relocation In Progress", hi: "पुनर्वास जारी है" },
  relocCompleted: { en: "Relocated / Completed", hi: "सुरक्षित पुनर्वास संपन्न" },

  // Capacity Statuses
  capacityWithin: { en: "WITHIN CAPACITY", hi: "क्षमता के भीतर" },
  capacityNear: { en: "NEAR CAPACITY", hi: "क्षमता के समीप" },
  capacityOver: { en: "OVER CAPACITY", hi: "अत्यधिक भार" },

  // User Dashboard Strings
  myAreaHeading: { en: "My Registered Location", hi: "मेरा पंजीकृत क्षेत्र" },
  currentRiskLevel: { en: "Current Risk Level", hi: "वर्तमान जोखिम स्तर" },
  currentRiskScore: { en: "Composite Risk Score", hi: "समग्र जोखिम स्कोर" },
  activeLocalAlerts: { en: "Active Local Alerts", hi: "सक्रिय स्थानीय चेतावनियां" },
  safetyGuidanceTitle: { en: "Latest Safety Guidance", hi: "नवीनतम सुरक्षा निर्देश" },
  emergencyContacts: { en: "Emergency Lifeline Contacts", hi: "आपातकालीन संपर्क" },
};

export function getTranslation(key: string, lang: Language = "en"): string {
  if (DICTIONARY[key] && DICTIONARY[key][lang]) {
    return DICTIONARY[key][lang];
  }
  return DICTIONARY[key]?.en || key;
}
