import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface PubMedArticle {
  title: string;
  authors: string;
  journal: string;
  year: string;
  pmid: string;
  url: string;
  doi?: string;
}

// Search PubMed via E-utilities (FREE, no API key needed)
async function searchPubMed(query: string, maxResults: number = 5): Promise<PubMedArticle[]> {
  try {
    // Step 1: Search for article IDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json&sort=relevance`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return [];

    const searchData = await searchRes.json();
    const ids = searchData?.esearchresult?.idlist;
    if (!ids || ids.length === 0) return [];

    // Step 2: Fetch article details
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) return [];

    const summaryData = await summaryRes.json();
    const results = summaryData?.result;
    if (!results) return [];

    const articles: PubMedArticle[] = [];
    for (const id of ids) {
      const article = results[id];
      if (!article) continue;

      const doi = article.elocationid?.replace('doi: ', '') || '';
      articles.push({
        title: article.title || '',
        authors: article.sortfirstauthor || article.lastauthor || '',
        journal: article.fulljournalname || article.source || '',
        year: article.pubdate?.split(' ')[0] || '',
        pmid: id,
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        doi: doi ? `https://doi.org/${doi}` : undefined,
      });
    }

    return articles;
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

// Search WHO publications (basic search)
async function searchWHO(query: string): Promise<Array<{ title: string; url: string }>> {
  // WHO doesn't have a simple free API, but we return known guideline URLs based on keywords
  const whoSources: Record<string, Array<{ title: string; url: string }>> = {
    cardiovascular: [
      { title: 'WHO Cardiovascular Diseases Fact Sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)' },
      { title: 'WHO HEARTS Technical Package', url: 'https://www.who.int/publications/i/item/hearts-technical-package' },
    ],
    diabetes: [
      { title: 'WHO Diabetes Fact Sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/diabetes' },
      { title: 'WHO Global Diabetes Report', url: 'https://www.who.int/publications/i/item/9789241565257' },
    ],
    cancer: [
      { title: 'WHO Cancer Fact Sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/cancer' },
      { title: 'WHO Cancer Prevention Guidelines', url: 'https://www.who.int/health-topics/cancer' },
    ],
    mental_health: [
      { title: 'WHO Mental Health Action Plan', url: 'https://www.who.int/publications/i/item/9789241506021' },
      { title: 'WHO mhGAP Intervention Guide', url: 'https://www.who.int/publications/i/item/9789241549790' },
    ],
    respiratory: [
      { title: 'WHO Chronic Respiratory Diseases', url: 'https://www.who.int/health-topics/chronic-respiratory-diseases' },
      { title: 'WHO COPD Fact Sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/chronic-obstructive-pulmonary-disease-(copd)' },
    ],
    child_health: [
      { title: 'WHO Child Growth Standards', url: 'https://www.who.int/tools/child-growth-standards' },
      { title: 'WHO Immunization Schedule', url: 'https://www.who.int/teams/immunization-vaccines-and-biologicals' },
    ],
    nutrition: [
      { title: 'WHO Nutrition Guidelines', url: 'https://www.who.int/health-topics/nutrition' },
    ],
  };

  const queryLower = query.toLowerCase();
  const results: Array<{ title: string; url: string }> = [];

  for (const [key, sources] of Object.entries(whoSources)) {
    if (queryLower.includes(key) || key.split('_').some(k => queryLower.includes(k))) {
      results.push(...sources);
    }
  }

  // Always add general WHO source
  if (results.length === 0) {
    results.push(
      { title: 'WHO International Classification of Diseases (ICD-11)', url: 'https://icd.who.int/' },
      { title: 'WHO Clinical Guidelines', url: 'https://www.who.int/publications/who-guidelines' },
    );
  }

  return results.slice(0, 3);
}

export async function POST(request: NextRequest) {
  try {
    const { query, specialty } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Build specialty-aware search query
    const specialtyTerms: Record<string, string> = {
      cardiology: 'cardiology cardiovascular heart',
      ophthalmology: 'ophthalmology eye vision',
      dermatology: 'dermatology skin',
      dentistry: 'dentistry oral dental',
      pediatrics: 'pediatrics child',
      psychiatry: 'psychiatry mental health',
      anesthesiology: 'anesthesiology anesthesia',
      endocrinology: 'endocrinology thyroid diabetes',
      oncology: 'oncology cancer tumor',
      respiratory: 'respiratory pulmonary lung',
      general: 'clinical medicine',
    };

    const specialtyBoost = specialtyTerms[specialty] || '';
    const enhancedQuery = `${query} ${specialtyBoost} clinical guidelines`;

    // Search in parallel
    const [pubmedResults, whoResults] = await Promise.all([
      searchPubMed(enhancedQuery, 5),
      searchWHO(query),
    ]);

    return NextResponse.json({
      pubmed: pubmedResults,
      who: whoResults,
      query: enhancedQuery,
    });
  } catch (error: any) {
    console.error('Sources search error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to search sources' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
