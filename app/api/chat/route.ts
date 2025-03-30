import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getRelevantContext } from '@/utils/aiContextSelector/contextSelector';
import { personalInfo } from '@/lib/personalInfo';
import { ChatMessage, MessageRole } from '@/lib/types';

export const runtime = 'nodejs';

interface OpenAIMessage {
  role: MessageRole;
  content: string;
}

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();

    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;

    // Get context relevant to the user's query
    const relevantContext = getRelevantContext(latestMessage);

    const conversation: OpenAIMessage[] = [
      {
        role: 'system',
        content: `
        You are an AI assistant embedded on Aaron Edmiston's portfolio website.
        
        ABOUT AARON:
        ${personalInfo.basics.summary}
        
        I'll provide you with specific information about Aaron based on the visitor's query:
        
        ${relevantContext}
        
        Instructions:
        1. Always respond in a warm, friendly tone with some personality.
        2. Provide specific details about Aaron's experience and skills using the information provided.
        3. If asked about something outside this information, be honest and suggest contacting Aaron directly.
        4. Keep responses concise (2-3 paragraphs maximum) but informative.
        5. Highlight Aaron's achievements and skills appropriately.
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

    const reply: ChatMessage = {
      role: 'assistant',
      content: response.choices[0].message.content || '',
      timestamp: Date.now(),
    };

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to generate response', details: errorMessage },
      { status: 500 }
    );
  }
}
