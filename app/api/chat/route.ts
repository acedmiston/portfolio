import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const conversation = [
      {
        role: 'system',
        content: `
You are an AI assistant embedded on a developer's portfolio website.
The developer is friendly, curious, and down-to-earth, specializing in JavaScript, React, and Next.js.
Always respond in a warm, witty tone and provide concise, insightful answers about their work and projects.
If you don't know something, be honest and add a little humor.
        `,
      },
      ...messages,
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversation,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = response.choices[0].message;
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
}
