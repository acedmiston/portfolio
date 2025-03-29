import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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

  try {
    const apiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: conversation,
        }),
      }
    );

    const data = await apiResponse.json();
    const reply = data.choices[0].message;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.error();
  }
}
