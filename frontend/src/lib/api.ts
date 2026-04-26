import type { Article } from '../types';

// Add Article type to the file scope for fallback articles

const NEWSDATA_API_KEY = process.env.EXPO_PUBLIC_NEWSDATA_API_KEY;
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_MODEL = process.env.EXPO_PUBLIC_GROQ_MODEL || 'llama-3-8b-8192';
const ACCENTS = ['#E48A48', '#F1A25C', '#D56F41', '#C87447', '#E2A66A'];

type NewsDataItem = {
  article_id?: string;
  title?: string;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  link?: string;
  source_id?: string;
  pubDate?: string;
  category?: string[] | string | null;
};

const cleanText = (
  value?: string | null,
  fallback = 'Story details are not available yet.',
) =>
  (value ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\[[^\]]+\]/g, '')
    .trim() || fallback;

const toTitle = (value?: string | null) => {
  if (!value) return 'Latest';
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const buildCards = (text: string) => {
  const normalized = cleanText(text);
  const first = normalized;
  const second = `${normalized} This matters because Layman should turn dense business and tech stories into short explanations people can actually follow.`;
  const third = `${normalized} If a reader wants more context, the next step is opening the story details and asking a follow-up question in the app chat.`;
  return [first, second, third].map((entry) => entry.slice(0, 220));
};

const toWordCount = (value: string) =>
  cleanText(value)
    .split(' ')
    .filter(Boolean).length;

const normalizeSummaryCard = (raw: string, fallback: string) => {
  const cleaned = cleanText(raw, fallback)
    .replace(/^["']|["']$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = toWordCount(cleaned);
  if (wordCount >= 28 && wordCount <= 35) {
    return cleaned;
  }

  return cleanText(fallback);
};

const buildLaymanCardFallbacks = (article: Article) => {
  const subject = article.displayHeadline || article.headline || article.title;
  const summary = cleanText(article.summary || article.content, subject);

  return [
    `${subject} is the big update here, and the story points to a real shift people should notice. In simple terms, it matters because the change could affect business, tech, or everyday users pretty quickly.`,
    `What stands out most is the pressure, money, or policy angle sitting underneath this update. Layman readers should take away that this is not random news, it signals a broader move that may keep growing.`,
    `The easiest way to read this story is to focus on who is affected and what changes next. If you want more detail, open the full article and use Ask Layman to unpack the trickier parts.`,
  ].map((card) => normalizeSummaryCard(card, card));
};

const buildSuggestions = (headline: string) => [
  'What happened here?',
  'Why does this matter?',
  `Explain "${headline.slice(0, 18)}..." simply.`,
];

const safeJsonParse = (value: unknown) => {
  if (typeof value !== 'string') return null;

  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const extractStringArray = (value: unknown, expectedLength?: number) => {
  if (!Array.isArray(value)) return null;

  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  if (expectedLength && normalized.length < expectedLength) {
    return null;
  }

  return expectedLength ? normalized.slice(0, expectedLength) : normalized;
};

const isGroqRateLimitPayload = (value: string) => {
  const lower = value.toLowerCase();
  return lower.includes('rate limit') || lower.includes('rate_limit_exceeded') || lower.includes('tokens per day');
};

const shouldQuietlyFallbackGroq = (status: number, payload: string) =>
  status === 429 || isGroqRateLimitPayload(payload);

const buildArticleContext = (article: Article) => {
  const parts = [
    `Display headline: ${article.displayHeadline || article.headline}`,
    `Original title: ${article.title}`,
    `Category: ${article.category}`,
    `Source: ${article.source}`,
    `Summary: ${cleanText(article.summary, article.headline)}`,
    `Content: ${cleanText(article.content, article.summary || article.headline)}`,
    `Layman cards: ${article.cards.map((card, index) => `Card ${index + 1}: ${card}`).join(' ')}`,
  ];

  if (article.publishedAt) {
    parts.push(`Published: ${article.publishedAt}`);
  }

  if (article.sourceUrl) {
    parts.push(`Source link: ${article.sourceUrl}`);
  }

  return parts.join('\n').slice(0, 3600);
};

export async function fetchNews(): Promise<Article[]> {
  console.log('[NewsData] API Key present:', !!NEWSDATA_API_KEY);

  if (!NEWSDATA_API_KEY) {
    console.warn('NewsData API Key missing!');
    return [];
  }

  try {
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=business,technology&language=en&image=1`;
    console.log('[NewsData] Fetching from:', url.replace(NEWSDATA_API_KEY, '***'));

    const response = await fetch(url);
    console.log('[NewsData] Response status:', response.status);

    if (!response.ok) {
      throw new Error(`NewsData request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log('[NewsData] Response:', { status: data.status, totalResults: data.totalResults, resultsCount: data.results?.length },data.image_url);

    if (data.status === 'success' && Array.isArray(data.results) && data.results.length > 0) {
      return (data.results as NewsDataItem[]).map((item, index) => {
        const headline = cleanText(item.title, 'Latest business and tech update');
        const summary = cleanText(item.description || item.content, headline);
        const category = Array.isArray(item.category)
          ? item.category[0]
          : item.category || 'General';
        const source = toTitle(item.source_id || 'NewsData');

        return {
          id: item.article_id || `${source}-${index}`,
          category: toTitle(category),
          title: headline,
          subtitle: source,
          headline,
          summary,
          imageLabel: source,
          accent: ACCENTS[index % ACCENTS.length],
          cards: buildCards(summary),
          suggestions: buildSuggestions(headline),
          source,
          content: cleanText(item.content || item.description, summary),
          imageUrl: item.image_url ?? null,
          sourceUrl: item.link || '',
          publishedAt: item.pubDate,
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function transformArticleForLayman(
  article: Article,
): Promise<string[]> {
  if (!GROQ_API_KEY) {
    console.warn("Groq API Key missing!");
    return buildLaymanCardFallbacks(article);
  }

  try {
    const fallbackCards = buildLaymanCardFallbacks(article);
    const prompt = `
You are "Layman", an AI that simplifies complex news into everyday, casual language.
Summarize the following article into exactly THREE cards.

CRITICAL RULES:
1. You MUST output a JSON object with a single key "cards" which is an array of exactly 3 strings.
2. Each string MUST be exactly 2 sentences.
3. Each string MUST be between 28 and 35 words long.
4. Keep the tone casual, like explaining to a friend.
5. The second sentence should be long enough to help fill the last line of the card.
6. Each card should read like a complete swipe card, not a fragment or note.
7. Avoid vague filler like "it's getting popular" or "this is important."

Title: ${article.title}
Content: ${(article.content || article.summary).substring(0, 3000)} // Truncate to save tokens

Output JSON format only.
{
  "cards": ["card 1 text", "card 2 text", "card 3 text"]
}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (shouldQuietlyFallbackGroq(response.status, errorText)) {
        console.warn('Groq summary quota reached. Falling back to local Layman cards.');
        return fallbackCards;
      }
      throw new Error(`Groq request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const messageContent = data?.choices?.[0]?.message?.content;
    const parsed = safeJsonParse(messageContent);
    const cards = extractStringArray(parsed?.cards, 3);

    if (cards) {
      return cards.map((card: string, index: number) =>
        normalizeSummaryCard(card, fallbackCards[index] || fallbackCards[0]),
      );
    }

    console.warn('Groq returned an unexpected summary payload:', messageContent);
    return fallbackCards;
  } catch (error) {
    console.error("Error transforming article:", error);
    return buildLaymanCardFallbacks(article);
  }
}

export async function generateChatSuggestions(
  article: Article,
): Promise<string[]> {
  if (!GROQ_API_KEY)
    return [
      "What does this mean?",
      "Why is this important?",
      "Explain it simpler.",
    ];

  try {
    const fallbackQuestions = [
      "What does this mean?",
      "Why is this important?",
      "Explain it simpler.",
    ];
    const prompt = `Generate exactly 3 short, conversational questions a layman would ask about this article.

RULES:
1. Each question must be answerable from the article context below.
2. Keep them specific to the story, not generic.
3. Keep them natural and short enough to fit in the chat UI.
4. Output JSON only with a "questions" key containing an array of 3 strings.

ARTICLE CONTEXT:
${buildArticleContext(article)}`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (shouldQuietlyFallbackGroq(response.status, errorText)) {
        console.warn('Groq suggestions quota reached. Falling back to default questions.');
        return fallbackQuestions;
      }
      throw new Error(`Groq request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const parsed = safeJsonParse(data?.choices?.[0]?.message?.content) || {};
    const questions = extractStringArray(parsed.questions, 3);
    return (
      questions || [
        "What does this mean?",
        "Why is this important?",
        "Explain it simpler.",
      ]
    );
  } catch (e) {
    return [
      "What does this mean?",
      "Why is this important?",
      "Explain it simpler.",
    ];
  }
}

export async function askLayman(
  article: Article,
  question: string,
  history: { role: string; content: string }[] = [],
): Promise<string> {
  if (!GROQ_API_KEY)
    return "Please configure your Groq API key to use the chat feature.";

  try {
    const articleContext = buildArticleContext(article);
    const systemPrompt = `You are Layman, a helpful and casual AI assistant. 
You are answering a user's question about the following article:
${articleContext}

RULES:
1. Answer in 1-2 short sentences max.
2. Use everyday, simple terms. No jargon.
3. Be friendly and conversational.
4. Use the article title, summary, content, and Layman cards together as your context.
5. If the answer is implied by the article, you may make a small reasonable inference, but do not invent specific facts that are not supported.
6. If the article still does not contain enough detail, say what is missing in plain language instead of only saying "I don't have enough information."
7. Do NOT invent paywalls, paid plans, subscriptions, missing sections, or hidden article details unless the article context explicitly says that.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: question },
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: messages,
          temperature: 0.7,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (shouldQuietlyFallbackGroq(response.status, errorText)) {
        return "I’m temporarily out of AI quota right now, but you can still read the Layman summary cards above.";
      }
      throw new Error(`Groq request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const answer =
      data.choices?.[0]?.message?.content?.trim() ||
      "I'm not sure how to answer that right now.";

    const lowerAnswer = answer.toLowerCase();
    const lowerContext = articleContext.toLowerCase();
    const mentionsPaywall =
      lowerAnswer.includes('paid plan') ||
      lowerAnswer.includes('paid plans') ||
      lowerAnswer.includes('subscriber') ||
      lowerAnswer.includes('subscription') ||
      lowerAnswer.includes('paywall');
    const contextMentionsPaywall =
      lowerContext.includes('paid plan') ||
      lowerContext.includes('paid plans') ||
      lowerContext.includes('subscriber') ||
      lowerContext.includes('subscription') ||
      lowerContext.includes('paywall');

    if (mentionsPaywall && !contextMentionsPaywall) {
      return "I don't have enough information in this article excerpt to answer that confidently.";
    }

    return answer;
  } catch (error) {
    console.error("Error asking Layman:", error);
    return "Oops! I hit a snag trying to answer that. Let's try again.";
  }
}
