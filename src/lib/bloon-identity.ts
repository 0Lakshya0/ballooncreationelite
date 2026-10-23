/** Public assistant identity; independent of whichever upstream serves a request. */
export const BLOON_NAME = "Bloon";

export function bloonIntroduction(question: string): string {
  if (/[\u0900-\u097f]/u.test(question))
    return "मेरा नाम Bloon है। मैं Balloon Creation का AI सहायक हूँ, जो सजावट और आयोजन की योजना बनाने में आपकी मदद करता है।";
  if (
    /\b(?:naam|nam|kaun|kon|tum|tumhara|aap|apka|aapka|tera|teraa|batao|bata|ho|hai|kya)\b/i.test(
      question,
    )
  )
    return "Mera naam Bloon hai. Main Balloon Creation ka AI assistant hoon, jo decoration aur celebration planning mein aapki madad karta hai.";
  return "I'm Bloon, Balloon Creation's AI assistant. I can help with decoration ideas and celebration planning.";
}

/** Deterministic common identity requests: no model call, credit use or rename roleplay. */
export function localBloonAnswer(question: string): string | null {
  const text = question
    .normalize("NFKC")
    .replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/gu, "")
    .toLowerCase();
  const self =
    /\b(?:you|your|yourself|ur|u|tum|tumhara|tumhari|aap|apka|aapka|aapki|tera|teri|apni|apne|khud)\b|तुम|आप|तेरा|तेरी|अपना|अपने|खुद/u.test(
      text,
    );
  const identity =
    /\b(?:name|named|called|identity|identify|introduce|introduction|model|provider|engine|underlying|developer|created|built|trained|powered|system\s*(?:prompt|instructions?))\b|\b(?:naam|nam|kaun|kon|parichay|pehchan)\b|नाम|कौन|परिचय|पहचान|मॉडल|माडल|प्रोवाइडर|बनाया|बनाए/u.test(
      text,
    );
  const direct =
    /\b(?:who (?:are|r) (?:you|u)|who am i (?:speaking|talking) (?:to|with)|what (?:do|should) (?:they|i|we) call you|introduce yourself|identify yourself|underlying (?:model|provider|engine))\b|^(?:name|naam|nam|नाम)[?! .]*$/iu.test(
      text,
    );
  const rename =
    /\b(?:new name|real name|actual name|secret name|system prompt|system instructions)\b|\b(?:tum ho|naam badal|asli naam)\b|असली नाम|नाम बदल|अब से/u.test(
      text,
    );
  const namingSomethingElse =
    /\b(?:suggest|choose|recommend|pick)\b.{0,35}\b(?:a name|names|a model)\b/i.test(text);
  return (!namingSomethingElse && self && identity) || direct || rename
    ? bloonIntroduction(question)
    : null;
}

/** Fail safely if an older upstream still asserts a different self identity.
 * Do not globally replace vendor names: factual discussions of other AI tools stay intact.
 */
export function enforceBloonIdentity(answer: string, question: string): string {
  const other =
    "(?:chatgpt|gpt(?:[- .]?\\d[\\w.-]*)?|openai|gemini|google|bard|claude|anthropic|llama|meta|groq|cloudflare|mistral|deepseek|qwen|glm[\\w.-]*|z\\.ai|openrouter|copilot|microsoft)";
  const selfClaim = new RegExp(
    `\\b(?:(?:i am|i'm|i’m|my (?:real |actual )?name is|i am called|i go by|as)\\s+(?:(?:an?|the)\\s+)?${other}\\b|(?:i am|i'm|i’m|i was|my model)[^.!?\\n]{0,140}(?:developed|created|trained|built|powered|provided)\\s+by\\s+${other}\\b)`,
    "i",
  );
  const hindiClaim = new RegExp(`(?:मेरा नाम|मैं|mera naam|main|mai)\\s+(?:${other})`, "iu");
  const renamedClaim =
    /\bmy (?:real |actual )?name (?:is|:)\s+(?!bloon\b)\S+|मेरा नाम\s+(?!bloon\b)\S+|\bmera naam\s+(?!bloon\b)\S+/iu.test(
      answer,
    );
  return (
    localBloonAnswer(question) ||
    (renamedClaim || selfClaim.test(answer) || hindiClaim.test(answer)
      ? bloonIntroduction(question)
      : answer)
  );
}
