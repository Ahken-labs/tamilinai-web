interface AboutMeData {
  name?: string;
  gender?: string;
  maritalStatus?: string;
  education?: string;
  occupation?: string;
  country?: string;
  city?: string;
  citizenship?: string;
  templateIndex?: number; // if provided, pick sequentially; otherwise random
}

// "a" vs "an" — checks the spoken sound, not just the letter
function an(word: string): string {
  if (!word) return 'a';
  const w = word.trim().toLowerCase();
  // Acronyms are spoken letter-by-letter, so the sound depends on the letter name, not the letter itself.
  // e.g. "H" → "aitch", "F" → "eff", "M" → "em", "S" → "ess" — all start with a vowel sound → "an HND", "an MBA"
  // Vowels (a,e,i,o,u) obviously sound like vowels. B,C,D,G,J,K,P,Q,T,U,V,W,Y,Z start with consonant sounds → "a".
  if (/^[a-z]{2,5}$/.test(w) && w === word.trim().toLowerCase() && !/[aeiou]/.test(w[1] ?? '')) {
    const acronymVowelSounds = new Set(['a', 'e', 'f', 'h', 'i', 'l', 'm', 'n', 'o', 'r', 's', 'x']);
    if (acronymVowelSounds.has(w[0])) return 'an';
  }
  // Regular words — vowel sound check
  const vowelStarts = /^[aeiou]/i;
  // Special cases: "honest", "hour" → "an"; "university", "uniform" → "a" (yu sound)
  const silentH = /^hon|^hour/i;
  const yuSound = /^uni|^use|^eu|^ew/i;
  if (silentH.test(word)) return 'an';
  if (yuSound.test(word)) return 'a';
  return vowelStarts.test(word) ? 'an' : 'a';
}

function locationPhrase(country?: string, city?: string): string {
  const isSriLanka = !country || country.toLowerCase().includes('sri lanka');
  if (isSriLanka) {
    return city ? `based in ${city}, Sri Lanka` : 'based in Sri Lanka';
  }
  return city ? `based in ${city}, ${country}` : `based in ${country}`;
}

function originPhrase(country?: string, citizenship?: string): string {
  const isSriLanka = !country || country.toLowerCase().includes('sri lanka');
  const isCitizenSL = !citizenship || citizenship.toLowerCase().includes('sri lanka');
  if (isSriLanka) return '';
  if (isCitizenSL) return ', originally from Sri Lanka';
  if (citizenship && !citizenship.toLowerCase().includes(country?.toLowerCase() ?? '')) {
    return `, with roots in Sri Lanka`;
  }
  return '';
}

function educationPhrase(education?: string): string {
  if (!education) return '';
  const e = education.toLowerCase();
  if (e.includes('doctor') || e.includes('phd')) return 'a doctorate';
  if (e.includes('master')) return 'a postgraduate degree';
  if (e.includes('bachelor') || e.includes('degree')) return 'a university degree';
  if (e.includes('diploma')) return 'a diploma';
  if (e.includes('school') || e.includes('o/l') || e.includes('a/l')) return 'a school education';
  return `a background in ${education}`;
}

function occupationPhrase(occupation?: string): string {
  if (!occupation) return '';
  return occupation.toLowerCase();
}

export function generateAboutMe(data: AboutMeData): string {
  const { name, maritalStatus, education, occupation, country, city, citizenship, templateIndex } = data;

  const loc = locationPhrase(country, city);
  const origin = originPhrase(country, citizenship);
  const edu = educationPhrase(education);
  const occ = occupationPhrase(occupation);
  const firstName = name?.split(' ')[0] ?? '';
  const isSriLanka = !country || country.toLowerCase().includes('sri lanka');
  const marital = maritalStatus?.toLowerCase();
  const neverMarried = !marital || marital === 'never married' || marital === 'single';
  const a_occ = occ ? an(occ) : 'a';
  const isEarlyCareer = occ ? /intern|student|trainee|apprentice|fresher|graduate|part.time/i.test(occ) : false;

  const templates: string[] = [
    // 1
    [
      firstName ? `Hi, I'm ${firstName}` : `Hi there`,
      loc ? `, ${loc}${origin}.` : '.',
      edu ? ` I hold ${edu}` : '',
      occ ? ` and work as ${a_occ} ${occ}.` : (edu ? '.' : ''),
      neverMarried
        ? ` I'm looking forward to meeting someone special to build a meaningful life together.`
        : ` I believe in second chances and am looking forward to finding a genuine partner.`,
    ].filter(Boolean).join(''),

    // 2
    [
      `I'm ${a_occ}${occ ? ` ${occ}` : ' professional'}`,
      loc ? ` ${loc}${origin}.` : '.',
      edu ? ` I completed ${edu}` : '',
      edu ? ` and take pride in my career and personal growth.` : '',
      ` Family is very important to me, and I'm looking for someone who values the same.`,
    ].filter(Boolean).join(''),

    // 3
    [
      isSriLanka
        ? `My upbringing has shaped who I am today.`
        : `Living abroad has broadened my perspective while keeping me rooted in my Tamil heritage.`,
      occ ? ` I work as ${a_occ} ${occ}` : '',
      edu ? ` with ${edu}` : '',
      occ || edu ? `.` : '',
      ` I'm a family-oriented person looking to build a life with someone who shares similar values.`,
    ].filter(Boolean).join(''),

    // 4
    [
      firstName ? `My name is ${firstName}.` : '',
      ` I'm ${loc}${origin}.`,
      edu ? ` I hold ${edu}` : '',
      occ ? ` and currently work as ${a_occ} ${occ}.` : (edu ? '.' : ''),
      ` I enjoy spending time with family and believe that trust and respect are the foundation of a happy marriage.`,
    ].filter(Boolean).join(''),

    // 5
    [
      `I'm a simple, family-oriented person`,
      loc ? ` ${loc}${origin}.` : '.',
      occ ? ` I work as ${a_occ} ${occ}` : '',
      edu ? ` and hold ${edu}` : '',
      occ || edu ? `.` : '',
      ` I'm looking for a life partner who is kind, understanding, and values family above all.`,
    ].filter(Boolean).join(''),

    // 6
    [
      occ ? `As ${a_occ} ${occ}` : `In my professional life`,
      edu ? ` with ${edu}` : '',
      isEarlyCareer
        ? `, I'm focused on growing and building my path forward.`
        : `, I've worked hard to build a stable and fulfilling career.`,
      loc ? ` I'm currently ${loc}${origin}.` : '',
      ` Beyond work, I deeply value family bonds and am ready to start a new chapter with the right person.`,
    ].filter(Boolean).join(''),

    // 7
    [
      `I come from a close-knit Tamil family`,
      isSriLanka ? '.' : ` and am now ${loc}${origin}.`,
      edu ? ` I have ${edu}` : '',
      occ ? ` and work as ${a_occ} ${occ}.` : (edu ? '.' : ''),
      ` I'm an honest and straightforward person looking for a genuine, long-term relationship.`,
    ].filter(Boolean).join(''),

    // 8
    [
      firstName ? `Hello, I'm ${firstName}` : 'Hello',
      loc ? ` — ${loc}${origin}.` : '.',
      ` I believe in building a relationship on a strong foundation of mutual respect and understanding.`,
      occ ? ` I work as ${a_occ} ${occ}` : '',
      edu ? ` and hold ${edu}` : '',
      occ || edu ? `.` : '',
      ` Looking forward to finding someone to share life's journey with.`,
    ].filter(Boolean).join(''),

    // 9
    [
      loc ? `I'm ${loc}${origin}` : `I'm from a Tamil family`,
      occ ? `, working as ${a_occ} ${occ}` : '',
      `.`,
      edu ? ` I hold ${edu}.` : '',
      neverMarried
        ? ` Marriage is a big step and I'm looking for someone I can truly connect with and grow together.`
        : ` I'm hopeful about the future and looking for a caring, understanding partner.`,
    ].filter(Boolean).join(''),

    // 10
    [
      isSriLanka
        ? `I'm proud of my Tamil roots and the values they've given me.`
        : `Though I'm ${loc}${origin}, my Tamil heritage remains close to my heart.`,
      occ ? ` I work as ${a_occ} ${occ}` : '',
      edu ? ` and completed ${edu}` : '',
      occ || edu ? `.` : '',
      ` I'm looking for a life partner who is family-focused, caring, and ready to build something beautiful together.`,
    ].filter(Boolean).join(''),

    // 11
    [
      firstName ? `I'm ${firstName},` : `I'm someone`,
      ` who values honesty, simplicity, and strong family ties.`,
      loc ? ` I'm ${loc}${origin}.` : '',
      occ ? ` I work as ${a_occ} ${occ}` : '',
      edu ? ` and have ${edu}` : '',
      occ || edu ? `.` : '',
      ` I hope to find a partner who is grounded, warm-hearted, and ready to grow together.`,
    ].filter(Boolean).join(''),

    // 12
    [
      `I believe a good marriage is built on friendship, trust, and shared values.`,
      occ ? ` I'm ${a_occ} ${occ}` : '',
      loc ? (occ ? ` ${loc}${origin}` : ` I'm ${loc}${origin}`) : '',
      occ || loc ? `.` : '',
      edu ? ` I hold ${edu}.` : '',
      ` I'm looking for someone genuine and caring to start this next chapter with.`,
    ].filter(Boolean).join(''),

    // 13
    [
      `I'm a calm, caring person who enjoys meaningful conversations and quality time with loved ones.`,
      occ ? ` Professionally, I work as ${a_occ} ${occ}` : '',
      edu ? (occ ? ` with ${edu}` : ` I have ${edu}`) : '',
      occ || edu ? `.` : '',
      loc ? ` I'm currently ${loc}${origin}.` : '',
      ` Hoping to find a partner who brings warmth and laughter into each day.`,
    ].filter(Boolean).join(''),

    // 14
    [
      firstName ? `Hi, I'm ${firstName}.` : `Hi there.`,
      ` I'm someone who takes life seriously but also knows how to enjoy the little moments.`,
      occ ? ` I work as ${a_occ} ${occ}` : '',
      loc ? (occ ? ` and am ${loc}${origin}` : ` I'm ${loc}${origin}`) : '',
      occ || loc ? `.` : '',
      ` I'm looking for a kind and genuine person to build a loving family with.`,
    ].filter(Boolean).join(''),

    // 15
    [
      `Relationships built on honesty and mutual respect mean everything to me.`,
      occ ? ` I'm ${a_occ} ${occ}` : '',
      edu ? (occ ? ` with ${edu}` : ` I have ${edu}`) : '',
      occ || edu ? `,` : '',
      loc ? ` I'm ${occ || edu ? 'currently ' : ''}${loc}${origin}.` : '',
      ` I'm ready to invest wholeheartedly in the right relationship.`,
    ].filter(Boolean).join(''),
  ];

  const total = templates.length;
  const index = templateIndex !== undefined
    ? ((templateIndex % total) + total) % total
    : Math.floor(Math.random() * total);

  return templates[index].replace(/\s{2,}/g, ' ').trim();
}

export const ABOUT_ME_TEMPLATE_COUNT = 15;
