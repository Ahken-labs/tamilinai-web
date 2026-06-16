export const CONTACT = {
  whatsappNumber: "94770750760",
  get whatsappUrl() {
    return `https://wa.me/${this.whatsappNumber}`;
  },
  socials: {
    facebook: "https://www.facebook.com/share/18QWf8Lxp1/",
    twitter: "https://x.com/Inai_lk",
    instagram: "https://www.instagram.com/inai.lk/",
  },
  company: {
    name: "Ahken Nexus (Pvt) Ltd.",
    website: "https://ahkenlabs.com/",
  },
  address: {
    line1: "247/1, Uthayanagar west,",
    line2: "Kilinochchi, Sri Lanka.",
  },
  email: "support@inai.lk",
} as const;
