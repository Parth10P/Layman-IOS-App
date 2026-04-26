import type { Article } from '../types';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_MODEL = process.env.EXPO_PUBLIC_GROQ_MODEL || 'llama-3-8b-8192';

const MAX_CHARS = 52;
const MIN_CHARS = 48;

const toWords = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

const trimHeadline = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/\[[^\]]+\]/g, '')
    .trim();

const clampToTarget = (value: string) => {
  const cleaned = trimHeadline(value);
  if (cleaned.length <= MAX_CHARS) {
    return cleaned;
  }

  return `${cleaned.slice(0, MAX_CHARS - 1).trimEnd()}…`;
};

const buildFallbackHeadline = (article: Article) => {
  const source = trimHeadline(article.title || article.headline);
  const words = toWords(source);

  let picked = words.slice(0, 9).join(' ');
  if (!picked) {
    picked = 'Big story update you should know';
  }

  if (picked.length < MIN_CHARS && words.length > 9) {
    picked = words.slice(0, 10).join(' ');
  }

  return clampToTarget(picked);
};

const sanitizeHeadline = (raw: string, fallback: string) => {
  const cleaned = clampToTarget(raw.replace(/^["']|["']$/g, ''));
  const wordCount = toWords(cleaned).length;

  if (!cleaned || wordCount < 5) {
    return fallback;
  }

  return cleaned;
};

export async function rewriteFeedHeadlines(articles: Article[]): Promise<Article[]> {
  if (!articles.length) {
    return articles;
  }

  if (!GROQ_API_KEY) {
    return articles.map((article) => ({
      ...article,
      displayHeadline: buildFallbackHeadline(article),
    }));
  }

  try {
    const articlePayload = articles.map((article) => ({
      id: article.id,
      original_title: article.title,
      current_headline: article.headline,
      summary: article.summary,
      content: (article.content || '').slice(0, 800),
      source: article.source,
      link: article.sourceUrl || '',
    }));

    const prompt = `You rewrite app headlines for a mobile news app called Layman.

TASK:
Rewrite each article into a conversational headline.

STRICT RULES:
1. Each rewritten headline should be casual and easy to understand.
2. Aim for 7 to 9 words.
3. Aim for 48 to 52 characters when possible.
4. Do not use clickbait.
5. Do not repeat the source name.
6. Return JSON only in this format:
{
  "items": [
    { "id": "article-id", "displayHeadline": "rewritten headline" }
  ]
}

ARTICLES:
${JSON.stringify(articlePayload)}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    const rewritten = new Map<string, string>();

    if (Array.isArray(parsed.items)) {
      for (const item of parsed.items) {
        if (typeof item?.id === 'string' && typeof item?.displayHeadline === 'string') {
          rewritten.set(item.id, item.displayHeadline);
        }
      }
    }

    return articles.map((article) => {
      const fallback = buildFallbackHeadline(article);
      return {
        ...article,
        displayHeadline: sanitizeHeadline(rewritten.get(article.id) || fallback, fallback),
        
      };
    });
  } catch (error) {
    console.error('Error rewriting headlines:', error);
    return articles.map((article) => ({
      ...article,
      displayHeadline: buildFallbackHeadline(article),
    }));
  }
}
