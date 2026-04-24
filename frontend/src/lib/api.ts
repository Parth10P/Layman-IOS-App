export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  source_url: string;
  source_name: string;
  pubDate: string;
}

const NEWSDATA_API_KEY = process.env.EXPO_PUBLIC_NEWSDATA_API_KEY;
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

export async function fetchNews(): Promise<Article[]> {
  if (!NEWSDATA_API_KEY) {
    console.warn("NewsData API Key missing!");
    return [];
  }

  try {
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=business,technology&language=en&image=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success" && data.results) {
      return data.results.map((item: any) => ({
        id: item.article_id,
        title: item.title,
        description: item.description || item.content || item.title,
        content: item.content || item.description || item.title,
        image_url: item.image_url,
        source_url: item.link,
        source_name: item.source_id,
        pubDate: item.pubDate,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
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
      "Card 2 fallback text since the API key is not configured.",
      "Card 3 fallback text since the API key is not configured.",
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
Content: ${article.content.substring(0, 3000)} // Truncate to save tokens

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
          model: "llama3-8b-8192",
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
          model: "llama3-8b-8192",
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
Content: ${article.content.substring(0, 2000)}

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
          model: "llama3-8b-8192",
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
