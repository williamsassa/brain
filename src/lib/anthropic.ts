import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default anthropic;

export async function* streamMedicalResponse(
  messages: Anthropic.MessageParam[],
  systemPrompt: string,
  options?: { maxTokens?: number }
) {
  const stream = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: options?.maxTokens || 2048,
    system: systemPrompt,
    messages,
    stream: true,
  });

  for await (const event of stream) {
    yield event;
  }
}
