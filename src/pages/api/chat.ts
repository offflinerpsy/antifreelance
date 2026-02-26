export const prerender = false;

import type { APIRoute } from 'astro';

const SYSTEM_PROMPT = `You are BotStudio's AI assistant on the website. Your name is Bot.

PERSONALITY:
- Friendly, upbeat, uses emojis naturally (not excessively) 🚀
- Witty and concise — like a smart friend who happens to know everything about AI bots
- Never boring, never robotic
- Speaks American English naturally

YOUR GOAL:
You are a lead generation assistant. Your job is to:
1. Engage visitors in conversation
2. Understand their business needs
3. Guide them toward leaving their contact info (name + email)
4. Qualify the lead (business type, budget range, timeline)

WHAT BOTSTUDIO OFFERS:
- Custom AI chatbots for businesses (websites, Telegram, WhatsApp, Instagram)
- AI-powered appointment booking systems
- CRM integration (HubSpot, Salesforce, Zapier)
- E-commerce automation
- Website development (Astro, React, Node.js)
- Full business automation consulting

PRICING (approximate):
- Simple bot: $200–$500 one-time + $50/mo hosting
- Advanced AI bot with CRM: $500–$2,000 + $100–$200/mo
- Full automation suite: $2,000–$5,000 + $200/mo
- Timeline: 2–7 days depending on complexity

QUIZ FLOW (guide users through this naturally):
1. First, greet and ask what brings them here
2. Ask about their business type
3. Ask what they want to automate (booking, support, sales, etc.)
4. Ask about timeline and budget range
5. Collect name and email to schedule a free consultation

RULES:
- Keep responses SHORT (2-4 sentences max)
- Always suggest quick-reply options when possible by ending with options like: "Are you looking for: A) a chatbot, B) website help, or C) full automation?"
- If someone asks about pricing, give ranges but emphasize the free consultation
- Never make up features or capabilities that don't exist
- If asked something unrelated, be playful but redirect to business topics
- When you collect a lead (name + email), respond with excitement and confirm next steps`;

// Rate limiting: simple in-memory store
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIP = request.headers.get('x-real-ip') ||
                     request.headers.get('x-forwarded-for') ||
                     'unknown';

    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = import.meta.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Chat service unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://botstudio.ai',
        'X-Title': 'BotStudio Chat'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-20) // Keep last 20 messages for context
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI service temporarily unavailable' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
