interface AboutMeData {
  name?: string;
  gender?: string; // reserved for future use
  maritalStatus?: string;
  education?: string;
  occupation?: string;
  country?: string;
  city?: string;
  citizenship?: string;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
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
  const { name, maritalStatus, education, occupation, country, city, citizenship } = data;

  const loc = locationPhrase(country, city);
  const origin = originPhrase(country, citizenship);
  const edu = educationPhrase(education);
  const occ = occupationPhrase(occupation);
  const firstName = name?.split(' ')[0] ?? '';
  const isSriLanka = !country || country.toLowerCase().includes('sri lanka');
  const marital = maritalStatus?.toLowerCase();
  const neverMarried = !marital || marital === 'never married' || marital === 'single';

  const templates: string[] = [
    // 1
    [
      firstName ? `Hi, I'm ${firstName}` : `Hi there`,
      loc ? `, ${loc}${origin}.` : '.',
      edu ? ` I hold ${edu}` : '',
      occ ? ` and work as a ${occ}.` : (edu ? '.' : ''),
      neverMarried
        ? ` I'm looking forward to meeting someone special to build a meaningful life together.`
        : ` I believe in second chances and am looking forward to finding a genuine partner.`,
    ].filter(Boolean).join(''),

    // 2
    [
      `I'm a${occ ? ` ${occ}` : ' professional'}`,
      loc ? ` ${loc}${origin}.` : '.',
      edu ? ` I completed ${edu}` : '',
      edu ? ` and take pride in my career and personal growth.` : '',
      ` Family is very important to me, and I'm looking for someone who values the same.`,
    ].filter(Boolean).join(''),

    // 3
    [
      isSriLanka
        ? `Growing up in Sri Lanka has shaped who I am today.`
        : `Living abroad has broadened my perspective while keeping me rooted in my Tamil heritage.`,
      occ ? ` I work as a ${occ}` : '',
      edu ? ` with ${edu}` : '',
      occ || edu ? `.` : '',
      ` I'm a family-oriented person looking to build a life with someone who shares similar values.`,
    ].filter(Boolean).join(''),

    // 4
    [
      firstName ? `My name is ${firstName}.` : '',
      ` I'm ${loc}${origin}.`,
      edu ? ` I hold ${edu}` : '',
      occ ? ` and currently work as a ${occ}.` : (edu ? '.' : ''),
      ` I enjoy spending time with family and believe that trust and respect are the foundation of a happy marriage.`,
    ].filter(Boolean).join(''),

    // 5
    [
      `I'm a simple, family-oriented person`,
      loc ? ` ${loc}${origin}.` : '.',
      occ ? ` I work as a ${occ}` : '',
      edu ? ` and hold ${edu}` : '',
      occ || edu ? `.` : '',
      ` I'm looking for a life partner who is kind, understanding, and values family above all.`,
    ].filter(Boolean).join(''),

    // 6
    [
      occ ? `As a ${occ}` : `In my professional life`,
      edu ? ` with ${edu}` : '',
      `, I've worked hard to build a stable and fulfilling career.`,
      loc ? ` I'm currently ${loc}${origin}.` : '',
      ` Beyond work, I deeply value family bonds and am ready to start a new chapter with the right person.`,
    ].filter(Boolean).join(''),

    // 7
    [
      `I come from a close-knit Sri Lankan Tamil family`,
      isSriLanka ? ' in Sri Lanka.' : ` and am now ${loc}.`,
      edu ? ` I have ${edu}` : '',
      occ ? ` and work as a ${occ}.` : (edu ? '.' : ''),
      ` I'm an honest and straightforward person looking for a genuine, long-term relationship.`,
    ].filter(Boolean).join(''),

    // 8
    [
      firstName ? `Hello, I'm ${firstName}` : 'Hello',
      loc ? ` — ${loc}${origin}.` : '.',
      ` I believe in building a relationship on a strong foundation of mutual respect and understanding.`,
      occ ? ` I work as a ${occ}` : '',
      edu ? ` and hold ${edu}` : '',
      occ || edu ? `.` : '',
      ` Looking forward to finding someone to share life's journey with.`,
    ].filter(Boolean).join(''),

    // 9
    [
      loc ? `I'm ${loc}${origin}` : `I'm from Sri Lanka`,
      occ ? `, working as a ${occ}` : '',
      `.`,
      edu ? ` I hold ${edu}.` : '',
      neverMarried
        ? ` Marriage is a big step and I'm looking for someone I can truly connect with and grow together.`
        : ` I'm hopeful about the future and looking for a caring, understanding partner.`,
    ].filter(Boolean).join(''),

    // 10
    [
      isSriLanka
        ? `Sri Lanka is home, and I'm proud of my roots.`
        : `Though I'm ${loc}${origin}, my Sri Lankan Tamil roots remain close to my heart.`,
      occ ? ` I work as a ${occ}` : '',
      edu ? ` and completed ${edu}` : '',
      occ || edu ? `.` : '',
      ` I'm looking for a life partner who is family-focused, caring, and ready to build something beautiful together.`,
    ].filter(Boolean).join(''),
  ];

  return pick(templates).replace(/\s{2,}/g, ' ').trim();
}
