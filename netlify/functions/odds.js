export default async (req, context) => {
  try {
    const apiKey = process.env.ODDS_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing ODDS_API_KEY environment variable' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const url = new URL(req.url);
    const path = url.searchParams.get('path');

    if (!path) {
      return new Response(
        JSON.stringify({ error: 'Missing path parameter' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const targetUrl = `https://api.the-odds-api.com${path}${path.includes('?') ? '&' : '?'}apiKey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch odds data',
        details: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
