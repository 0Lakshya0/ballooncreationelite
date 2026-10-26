/** Public assistant identity; independent of whichever upstream serves a request. */
export const BLOON_NAME = "Bloon";
export type BloonIdentityContext = { creatorQuestions: number; creatorTopic?: boolean };
const initialContext: BloonIdentityContext = { creatorQuestions: 0 };

function normalized(question: string): string {
  return question
    .normalize("NFKC")
    .replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/gu, "")
    .toLowerCase();
}
function language(question: string): "hi" | "hinglish" | "en" {
  if (/[\u0900-\u097f]/u.test(question)) return "hi";
  return /\b(?:naam|nam|kaun|kon|kisne|kiska|tum|tumhe|tumko|tujhe|aap|aapko|apka|aapka|tera|teraa|batao|bata|btao|banaya|bnaya|banai|banayi|unka|unke|uska|uske|aur|ho|hai)\b/i.test(
    question,
  )
    ? "hinglish"
    : "en";
}
export function bloonIntroduction(question: string): string {
  const lang = language(question);
  if (lang === "hi")
    return "मेरा नाम Bloon है। मैं Balloon Creation का AI सहायक हूँ, जो सजावट और आयोजन की योजना बनाने में आपकी मदद करता है।";
  if (lang === "hinglish")
    return "Mera naam Bloon hai. Main Balloon Creation ka AI assistant hoon, jo decoration aur celebration planning mein aapki madad karta hai.";
  return "I'm Bloon, Balloon Creation's AI assistant. I can help with decoration ideas and celebration planning.";
}
function creatorAnswer(question: string, disclosed: boolean): string {
  const lang = language(question);
  if (lang === "hi")
    return disclosed
      ? "मैं Bloon हूँ। Lakshya Chouhan ने मुझे इस वेबसाइट के AI सहायक के रूप में बनाया और कॉन्फ़िगर किया है। वही Balloon Creation की वेबसाइट के क्रिएटर भी हैं। मैं उनके बारे में इससे ज़्यादा व्यक्तिगत जानकारी साझा नहीं कर सकता।"
      : "मैं Bloon हूँ। Balloon Creation की वेबसाइट बनाने वाले क्रिएटर ने ही मुझे इस वेबसाइट के AI सहायक के रूप में बनाया और कॉन्फ़िगर किया है। अभी मैं उनका नाम साझा नहीं कर सकता।";
  if (lang === "hinglish")
    return disclosed
      ? "Main Bloon hoon. Lakshya Chouhan ne mujhe is website ke AI assistant ke roop mein banaya aur configure kiya hai. Wahi Balloon Creation ki website ke creator bhi hain. Main unke baare mein isse zyada personal details share nahi kar sakta."
      : "Main Bloon hoon. Balloon Creation ki website banane wale creator ne hi mujhe is website ke AI assistant ke roop mein banaya aur configure kiya hai. Abhi main unka naam share nahi kar sakta.";
  return disclosed
    ? "I'm Bloon. Lakshya Chouhan created and configured me as this website's AI assistant. He is also the creator of the Balloon Creation website. I can't share any further personal details about him."
    : "I'm Bloon. The creator of the Balloon Creation website also created and configured me as this website's AI assistant. I can't share their name at this stage.";
}
function privacyAnswer(question: string): string {
  const lang = language(question);
  if (lang === "hi")
    return "क्रिएटर की और व्यक्तिगत जानकारी साझा करना मेरी गोपनीयता नीति के विरुद्ध है। मैं सजावट और आयोजन की योजना बनाने में आपकी मदद कर सकता हूँ।";
  if (lang === "hinglish")
    return "Creator ki aur personal details share karna meri privacy policy ke against hai. Main decoration aur celebration planning mein aapki madad kar sakta hoon.";
  return "Sharing further personal information about the creator would go against my privacy policy. I can help with decoration ideas and celebration planning instead.";
}
function technicalAnswer(question: string): string {
  const lang = language(question);
  if (lang === "hi")
    return "मैं Bloon हूँ, Balloon Creation की वेबसाइट का AI सहायक। वेबसाइट के क्रिएटर ने इस सहायक को बनाया और कॉन्फ़िगर किया है; यह मूल AI मॉडल को प्रशिक्षित करने का दावा नहीं है। अंतर्निहित AI सेवाएँ बदल सकती हैं, और मैं इस अनुरोध का सटीक मॉडल या प्रदाता सत्यापित नहीं कर सकता।";
  if (lang === "hinglish")
    return "Main Bloon hoon, Balloon Creation ki website ka AI assistant. Website ke creator ne is assistant ko banaya aur configure kiya hai; iska matlab underlying AI model ko train karna nahi hai. Underlying AI services badal sakti hain; main is request ka exact model ya provider verify nahi kar sakta.";
  return "I'm Bloon, Balloon Creation's website AI assistant. The website's creator built and configured this assistant; that is not a claim that they trained the underlying AI model. Underlying AI services can vary, and I can't verify the exact model or provider serving this request.";
}

/** Pure decision: searching/typing/rendering never advances the disclosure counter.
 * Only an accepted, submitted creator question advances it, once, in the shared chat.
 * This is conversational disclosure, not a secret/access-control mechanism.
 */
export function resolveBloonIdentity(
  question: string,
  context: BloonIdentityContext = initialContext,
): { answer: string | null; context: BloonIdentityContext } {
  const text = normalized(question);
  const count = Number.isFinite(context.creatorQuestions)
    ? Math.max(0, Math.min(3, Math.floor(context.creatorQuestions)))
    : 0;
  const inCreatorTopic = count > 0 && context.creatorTopic !== false;
  const self =
    /\b(?:you|your|yourself|ur|u|tu|tum|tumhe|tumko|tujhe|tumhara|tumhari|aap|aapko|apka|aapka|aapki|tera|teri|apna|apni|apne|khud|bloon|chatbot|assistant|website|site)\b|balloon\s*creation|तुम|आप|तुझे|तेरा|तेरी|अपना|अपने|खुद|वेबसाइट|ब्लून/u.test(
      text,
    );
  const creatorSubject =
    /\b(?:creator|creators|developer|developers|maker|founder|lakshya|chouhan|unka|unke|uska|uske)\b|क्रिएटर|निर्माता|डेवलपर|लक्ष्य|चौहान|उनक|उसक/u.test(
      text,
    ) ||
    (inCreatorTopic && /\b(?:his|her|their|him|them)\b/u.test(text));
  const making =
    /\b(?:creator|creators|developer|developers|maker|founder|created|built|developed|designed|made|kisne|banaya|bnaya|banane|banai|banayi|bnayi)\b|क्रिएटर|निर्माता|डेवलपर|किसने|बनाया|बनाई|बनाने|निर्मित/u.test(
      text,
    );
  const personal =
    /\b(?:personal|private|address|home|lives?|phone|mobile|number|email|contact|family|parents|wife|girlfriend|salary|income|dob|age|birthday|photos?|password|credentials|biography|background|baare|bare|details|everything|more|all|ghar|rehta|rehti|umar|pata|pataa|parivar|sab|poora|pura|aur)\b|व्यक्तिगत|निजी|पता|घर|फोन|फ़ोन|नंबर|परिवार|उम्र|जन्म|तस्वीर|बारे|जानकारी|विवरण|और बताओ|सब बताओ/u.test(
      text,
    );
  const eventQuestion =
    /\b(?:decoration|decor|balloons?|party|event|wedding|anniversary|setup|theme|booking|quote)\b|सजावट|डेकोरेशन|शादी|बुकिंग/u.test(
      text,
    );
  const moreFollowup =
    /^(?:please\s+)?(?:tell me more|more(?: details)?|everything|all details|aur(?: bhi| kya| details| bata| bta)|poora|pura|sab(?: kuch)?|और|पूरी|सब)/u.test(
      text,
    );
  const sensitive =
    creatorSubject &&
    /\b(?:personal|private|address|home|lives?|phone|mobile|number|email|contact|family|parents|wife|girlfriend|salary|income|dob|age|birthday|photos?|password|credentials|biography|social|instagram|facebook|linkedin|education|qualification|college|school|ghar|rehta|rehti|umar|pata|pataa|parivar)\b|व्यक्तिगत|निजी|पता|घर|फोन|फ़ोन|नंबर|परिवार|उम्र|जन्म|तस्वीर/u.test(
      text,
    );
  if (
    sensitive ||
    (count >= 3 &&
      ((creatorSubject && personal) || (inCreatorTopic && moreFollowup && !eventQuestion)))
  )
    return { answer: privacyAnswer(question), context };
  const technical =
    /\b(?:underlying|base model|pretrained|pre-trained|training|trained|provider|engine|model|api)\b|मॉडल|माडल|प्रोवाइडर|प्रशिक्ष/u.test(
      text,
    );
  if (technical && (self || making || /\bunderlying\b/u.test(text)))
    return { answer: technicalAnswer(question), context: { ...context, creatorTopic: false } };
  const creatorFollowup =
    inCreatorTopic &&
    !eventQuestion &&
    !/\b(?:your|apna|tumhara|aapka)\s+(?:own\s+)?(?:name|naam)\b|तुम्हारा नाम|अपना नाम/u.test(
      text,
    ) &&
    (/\b(?:their name|his name|her name|the name|name please|naam|nam|who exactly|who is it)\b|उनका नाम|उसका नाम|किसने/u.test(
      text,
    ) ||
      moreFollowup ||
      (creatorSubject && personal));
  const shortCreator =
    /^(?:please\s+)?(?:kisne (?:banaya|bnaya|banai|banayi)|किसने बनाया|who (?:created|built|made|developed)(?: this)?)[?!. ]*$/u.test(
      text,
    );
  const creator =
    (making && (self || creatorSubject)) ||
    shortCreator ||
    creatorFollowup ||
    /\bwho is lakshya(?: chouhan)?\b/u.test(text);
  if (creator) {
    const next = { creatorQuestions: Math.min(3, count + 1), creatorTopic: true };
    return { answer: creatorAnswer(question, next.creatorQuestions >= 3), context: next };
  }
  const identity =
    /\b(?:name|named|called|identity|identify|introduce|introduction|powered|system\s*(?:prompt|instructions?))\b|\b(?:naam|nam|kaun|kon|parichay|pehchan)\b|नाम|कौन|परिचय|पहचान/u.test(
      text,
    );
  const direct =
    /\b(?:(?:who|what|which ai|which assistant) (?:are|r) (?:you|u)|who am i (?:speaking|talking) (?:to|with)|what (?:do|should) (?:they|i|we) call you|introduce yourself|identify yourself)\b|^(?:name|naam|nam|नाम)[?! .]*$/iu.test(
      text,
    );
  const rename =
    /\b(?:new name|real name|actual name|secret name|system prompt|system instructions)\b|\b(?:tum ho|naam badal|asli naam)\b|असली नाम|नाम बदल|अब से/u.test(
      text,
    );
  const namingSomethingElse =
    /\b(?:suggest|choose|recommend|pick)\b.{0,35}\b(?:a name|names|a model)\b/i.test(text);
  return {
    answer:
      (!namingSomethingElse && self && identity) || direct || rename
        ? bloonIntroduction(question)
        : null,
    context: { ...context, creatorTopic: false },
  };
}
export function localBloonAnswer(
  question: string,
  context: BloonIdentityContext = initialContext,
): string | null {
  return resolveBloonIdentity(question, context).answer;
}

/** Guard upstream self/provenance claims and premature owner-name disclosures.
 * Factual discussions of other AI tools stay intact; provider diagnostics stay truthful.
 */
export function enforceBloonIdentity(
  answer: string,
  question: string,
  context: BloonIdentityContext = initialContext,
): string {
  const local = localBloonAnswer(question, context);
  if (local) return local;
  const creatorClaim =
    /\b(?:i (?:was|am|have been)|i[’']m)[^.!?\n]{0,140}(?:developed|created|built|made|trained|provided)\s+by\b|\bmy\s+(?:creator|developer|maker)\b|(?:मुझे|मुझको|mujhe|mujhko)[^.!?\n]{0,140}(?:बनाया|निर्मित|banaya|bnaya)|(?:मेरे|मेरा|mere|mera)\s+(?:creator|developer|निर्माता)|\bLakshya\s+Chouhan\b|लक्ष्य\s*चौहान/iu.test(
      answer,
    );
  if (creatorClaim) return creatorAnswer(question, context.creatorQuestions >= 3);
  const other =
    "(?:chatgpt|gpt(?:[- .]?\\d[\\w.-]*)?|openai|gemini|google|bard|claude|anthropic|llama|meta|groq|cloudflare|mistral|deepseek|qwen|glm[\\w.-]*|z\\.ai|openrouter|copilot|microsoft)";
  const selfClaim = new RegExp(
    `\\b(?:(?:i am|i'm|i’m|my (?:real |actual )?name is|i am called|i go by|as)\\s+(?:(?:an?|the)\\s+)?${other}\\b|(?:i am|i'm|i’m|i was|my model)[^.!?\\n]{0,140}(?:developed|created|trained|built|powered|provided)\\s+by\\s+${other}\\b)`,
    "i",
  );
  const hindiClaim = new RegExp(`(?:मेरा नाम|मैं|mera naam|main|mai)\\s+(?:${other})`, "iu");
  const properNameClaim =
    /\bI(?: am|[’']m)\s+(?!Bloon\b|An?\b|The\b|Here\b|Happy\b|Glad\b|Sorry\b|Ready\b|Your\b|Able\b|Not\b)[A-Z][a-z][\p{L}\p{N}_-]*/u.test(
      answer,
    );
  const renamedClaim =
    /\bmy (?:real |actual )?name (?:is|:)\s+(?!bloon\b)\S+|मेरा नाम\s+(?!bloon\b)\S+|\bmera naam\s+(?!bloon\b)\S+/iu.test(
      answer,
    );
  return properNameClaim || renamedClaim || selfClaim.test(answer) || hindiClaim.test(answer)
    ? bloonIntroduction(question)
    : answer;
}
