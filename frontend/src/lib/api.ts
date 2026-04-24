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

const buildSuggestions = (headline: string) => [
  'What happened here?',
  'Why does this matter?',
  `Explain "${headline.slice(0, 18)}..." simply.`,
];

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
    return [
      "Missing Groq API Key. Please add EXPO_PUBLIC_GROQ_API_KEY to your .env file.",
      "Card 2 fallback - API key not configured.",
      "Card 3 fallback - API key not configured.",
    ];
  }

  try {
    const prompt = `
You are "Layman", an AI that simplifies complex news into everyday, casual language.
Summarize the following article into exactly THREE cards.

CRITICAL RULES:
1. You MUST output a JSON object with a single key "cards" which is an array of exactly 3 strings.
2. Each string MUST be exactly 2 sentences.
3. Each string MUST be between 28 and 35 words long.
4. Keep the tone casual, like explaining to a friend.

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

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      const parsed = JSON.parse(data.choices[0].message.content);
      if (parsed.cards && Array.isArray(parsed.cards)) {
        return parsed.cards;
      }
    }
    throw new Error("Invalid response from Groq");
  } catch (error) {
    console.error("Error transforming article:", error);
    return [
      "We encountered an error trying to simplify this article for you.",
      "Please try again later or check your network connection.",
      "In the meantime, you can read the original article using the link above.",
    ];
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
    const prompt = `Generate exactly 3 short, conversational questions a layman would ask about this article. Output JSON only with a "questions" key containing an array of 3 strings.
Title: ${article.title}`;

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

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return (
      parsed.questions || [
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
    const systemPrompt = `You are Layman, a helpful and casual AI assistant. 
You are answering a user's question about the following article:
Title: ${article.title}
Content: ${(article.content || article.summary).substring(0, 2000)}

RULES:
1. Answer in 1-2 short sentences max.
2. Use everyday, simple terms. No jargon.
3. Be friendly and conversational.`;

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

    const data = await response.json();
    return (
      data.choices[0].message.content ||
      "I'm not sure how to answer that right now."
    );
  } catch (error) {
    console.error("Error asking Layman:", error);
    return "Oops! I hit a snag trying to answer that. Let's try again.";
  }
}
