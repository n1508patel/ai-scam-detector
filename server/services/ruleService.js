const RULES = [
  { name: "Urgent or threatening language (urgent, immediately, last chance)", weight: 15, regex: /\b(urgent|immediately|last chance|within 24 hours|expire[sd]?|blocked|suspended)\b/i },
  { name: "Asks for OTP, PIN, CVV or password", weight: 30, regex: /\b(otp|pin|cvv|password)\b/i },
  { name: "KYC update or account block threat", weight: 25, regex: /\b(kyc|pan card update|aadhaar update|account (will be )?(blocked|closed))\b/i },
  { name: "Lottery, prize or KBC style bait", weight: 30, regex: /\b(lottery|lucky draw|you (have )?won|prize|kbc|congratulations)\b/i },
  { name: "Asks for advance payment (fee, registration, deposit)", weight: 25, regex: /\b(registration fee|processing fee|advance payment|security deposit|send money)\b/i },
  { name: "Work-from-home or easy daily earning claim", weight: 20, regex: /\b(work from home|earn \d+|daily (income|earning)|part[- ]time job)\b/i },
  { name: "Asks to accept a UPI collect request or scan a QR code", weight: 25, regex: /\b(collect request|scan (the )?qr|accept (the )?request)\b/i },
  { name: "Shortened link (bit.ly, tinyurl, etc.)", weight: 20, regex: /\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|cutt\.ly|rb\.gy)\b/i },
  { name: "Link uses a raw IP address", weight: 25, regex: /https?:\/\/\d{1,3}(\.\d{1,3}){3}/i },
  { name: "Suspicious domain extension (.xyz, .top, .click, .icu)", weight: 15, regex: /https?:\/\/[^\s/]+\.(xyz|top|click|icu|work|loan)\b/i },
];

export function runRules(text) {
  const redFlags = [];
  let score = 0;

  for (const rule of RULES) {
    if (rule.regex.test(text)) {
      redFlags.push(rule.name);
      score += rule.weight;
    }
  }

  return { score: Math.min(score, 100), redFlags };
}