import { NextRequest, NextResponse } from 'next/server';
import { getMedicalSystemPrompt } from '@/lib/medical-prompts';

export const runtime = 'nodejs';
export const maxDuration = 60;

// ---------------------------------------------------------------------------
// PubMed source fetching — best-effort, never blocks the AI response
// ---------------------------------------------------------------------------
async function fetchPubMedSources(query: string, specialty: string): Promise<string> {
  try {
    const specialtyTerms: Record<string, string> = {
      cardiology: 'cardiovascular heart', ophthalmology: 'eye vision optic',
      dermatology: 'skin dermatologic', dentistry: 'oral dental',
      pediatrics: 'pediatric child', psychiatry: 'mental health psychiatric',
      anesthesiology: 'anesthesia perioperative', endocrinology: 'endocrine diabetes thyroid',
      oncology: 'cancer tumor neoplasm', respiratory: 'pulmonary lung respiratory',
      general: 'clinical medicine',
    };
    const boost = specialtyTerms[specialty] || 'clinical';
    const searchQuery = `${query} ${boost}`.slice(0, 200);

    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchQuery)}&retmax=5&retmode=json&sort=relevance`;
    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(6000) });
    if (!searchRes.ok) return '';

    const searchData = await searchRes.json();
    const ids: string[] = searchData?.esearchresult?.idlist;
    if (!ids || ids.length === 0) return '';

    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    const summaryRes = await fetch(summaryUrl, { signal: AbortSignal.timeout(6000) });
    if (!summaryRes.ok) return '';

    const summaryData = await summaryRes.json();
    const results = summaryData?.result;
    if (!results) return '';

    let sourcesText = '\n\n───────────────────────────────────────\nREAL MEDICAL SOURCES FROM PUBMED (you MUST cite these in your response with their exact URLs):\n';
    for (const id of ids) {
      const a = results[id];
      if (!a) continue;
      const year = a.pubdate?.split(' ')[0] || '';
      const journal = a.fulljournalname || a.source || '';
      const author = a.sortfirstauthor || 'et al.';
      sourcesText += `[PMID:${id}] "${a.title}" — ${author}, ${journal} (${year}). URL: https://pubmed.ncbi.nlm.nih.gov/${id}/\n`;
    }
    sourcesText += '───────────────────────────────────────\n';
    return sourcesText;
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Provider config — priority: OpenAI GPT > Anthropic > error
// ---------------------------------------------------------------------------
function getAIConfig() {
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: 'openai' as const,
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      baseUrl: 'https://api.openai.com/v1/chat/completions',
    };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: 'anthropic' as const,
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-sonnet-4-20250514',
      baseUrl: 'https://api.anthropic.com/v1/messages',
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// OpenAI GPT streaming
// ---------------------------------------------------------------------------
async function streamOpenAI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
      max_tokens: 4096,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI error (${response.status}): ${errorBody}`);
  }

  return response.body;
}

// ---------------------------------------------------------------------------
// Anthropic streaming (fallback)
// ---------------------------------------------------------------------------
async function streamAnthropic(
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      system: systemPrompt,
      messages,
      max_tokens: 4096,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic error (${response.status}): ${errorBody}`);
  }

  return response.body;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const config = getAIConfig();
    if (!config) {
      return NextResponse.json(
        { error: 'No AI API key configured. Add OPENAI_API_KEY or ANTHROPIC_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages, patientData, specialty, language, isAutoAnalysis } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // ── Build system prompt ──────────────────────────────────────────────
    const systemPrompt = getMedicalSystemPrompt(specialty || 'general', language || 'en');

    // ── Patient context injection ────────────────────────────────────────
    let patientContext = '';
    if (patientData && Object.keys(patientData).length > 0) {
      patientContext = `\n\n══════════════════════════════════════════\nCURRENT PATIENT DATA (use this for your analysis):\n${JSON.stringify(patientData, null, 2)}\n══════════════════════════════════════════`;
    }

    // ── Auto-analysis micro-diagnostic instructions ──────────────────────
    let autoAnalysisInstruction = '';
    if (isAutoAnalysis) {
      autoAnalysisInstruction = `\n\n🔬 AUTO-ANALYSIS MODE — The doctor just updated patient information. Provide a FOCUSED micro-diagnostic analysis of the NEW data. Be concise but clinically precise (2-4 paragraphs max).

REQUIRED STRUCTURE:
**🔎 Clinical Significance:**
Brief analysis of the new data point and its clinical relevance in ${specialty || 'general'} context.

**🧠 Diagnostic Hypothesis — Confidence: X%**
- ICD-10: [code] — [description]
- Causal pathway: [symptom/sign] → [mechanism] → [condition]

**⚠️ Potential Concerns:**
Use severity indicators:
🔴 URGENT — immediate attention required
🟡 MODERATE — monitor closely
🟢 NORMAL — within expected parameters

**📚 References:**
- Cite 2-3 real PubMed sources with actual URLs (from the sources provided below)
- Include relevant clinical guideline references

Do NOT generate a full SOAP report unless the doctor explicitly requests it.`;
    }

    // ── Fetch real PubMed sources based on the latest user message ────────
    const lastUserMsg = messages.filter((m: { role: string }) => m.role === 'user').pop()?.content || '';

    // Also extract key terms from patient data for better PubMed search
    let searchTerms = lastUserMsg;
    if (patientData) {
      const complaint = patientData.chiefComplaint || '';
      const symptoms = patientData.symptoms || '';
      if (complaint) searchTerms += ' ' + complaint;
      if (symptoms) searchTerms += ' ' + symptoms;
    }

    const pubmedSources = searchTerms.length > 5
      ? await fetchPubMedSources(searchTerms, specialty || 'general')
      : '';

    // ── Assemble the full system prompt ──────────────────────────────────
    const fullSystem = systemPrompt + patientContext + autoAnalysisInstruction + pubmedSources;

    // ── Format messages for the API ──────────────────────────────────────
    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // ── Get stream from the configured provider ──────────────────────────
    let sourceStream: ReadableStream<Uint8Array> | null;

    if (config.provider === 'openai') {
      sourceStream = await streamOpenAI(config.apiKey, config.model, fullSystem, formattedMessages);
    } else {
      sourceStream = await streamAnthropic(config.apiKey, fullSystem, formattedMessages);
    }

    if (!sourceStream) {
      throw new Error('No response stream received');
    }

    // ── Transform SSE stream → plain text stream ─────────────────────────
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
      try {
        const reader = sourceStream.getReader();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (!trimmed.startsWith('data: ')) continue;

            try {
              const json = JSON.parse(trimmed.slice(6));

              if (config.provider === 'openai') {
                // OpenAI format: choices[0].delta.content
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  await writer.write(encoder.encode(content));
                }
              } else {
                // Anthropic format: content_block_delta
                if (json.type === 'content_block_delta' && json.delta?.text) {
                  await writer.write(encoder.encode(json.delta.text));
                }
              }
            } catch {
              // Skip unparseable lines
            }
          }
        }
      } catch (streamError: any) {
        const errorMsg = streamError?.message || 'Stream error';
        await writer.write(encoder.encode(`\n\n⚠️ **Error**: ${errorMsg}`));
      } finally {
        await writer.close();
      }
    })();

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
