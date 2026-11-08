"use client";

import { useEffect } from "react";

// Warns users who open the browser console against "paste this code" scams (self-XSS).
// Production only, runs once after the page has loaded, renders nothing.

const TITLE_STYLE = "color:#B31B38;font-size:48px;font-weight:bold;-webkit-text-stroke:1px #000;";
const TEXT_STYLE = "font-size:16px;line-height:1.6;";
const NOTE_STYLE = "font-size:14px;line-height:1.6;color:#B31B38;font-weight:bold;";

const WARNING = {
  titleTa: "நில்லுங்கள்!",
  titleEn: "Stop!",
  ta: "இது டெவலப்பர்களுக்கான ஒரு வசதி. யாராவது இங்கே எதையாவது தட்டச்சு செய்ய சொன்னால், அது ஒரு மோசடி. அவர்கள் உங்கள் இணை கணக்கையும் தனிப்பட்ட தகவல்களையும் திருட முடியும். இங்கே எதையும் தட்டச்சு செய்யாதீர்கள்.",
  en: "This is a browser feature for developers. If someone told you to copy and paste something here, it is a scam. It can give them access to your Inai account and personal details. Do not paste anything here.",
  noteTa: "பிற கணக்குகளை அணுக முயல்வது அல்லது இணையத்தளத்தைத் தவறாகப் பயன்படுத்துவது எங்கள் விதிமுறைகளுக்கு எதிரானது; அது உங்கள் கணக்கு நிரந்தரமாகத் தடைசெய்யப்பட வழிவகுக்கும்.",
  noteEn: "Trying to access other accounts or misuse the site is against our Terms and can lead to your account being permanently banned.",
};

export default function ConsoleWarning() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    console.log(`%c${WARNING.titleTa}`, TITLE_STYLE);
    console.log(`%c${WARNING.ta}`, TEXT_STYLE);
    console.log(`%c${WARNING.noteTa}`, NOTE_STYLE);
    console.log(`%c${WARNING.titleEn}`, TITLE_STYLE);
    console.log(`%c${WARNING.en}`, TEXT_STYLE);
    console.log(`%c${WARNING.noteEn}`, NOTE_STYLE);
  }, []);

  return null;
}
