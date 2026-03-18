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

    const type = url.searchParams.get('type') || 'odds';

    let targetUrl;

    if (type === 'scores') {
      const daysFrom = url.searchParams.get('daysFrom') || '3';

      targetUrl =
        `https://api.the-odds-api.com/v4/sports/basketball_ncaab/scores/` +
        `?apiKey=${encodeURIComponent(apiKey)}` +
        `&daysFrom=${encodeURIComponent(daysFrom)}`;
    } else {
      const regions = url.searchParams.get('regions') || 'us';
      const markets = url.searchParams.get('markets') || 'spreads';
      const oddsFormat = url.searchParams.get('oddsFormat') || 'american';
      const bookmakers = url.searchParams.get('bookmakers') || 'draftkings';

      targetUrl =
        `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/` +
        `?apiKey=${encodeURIComponent(apiKey)}` +
        `&regions=${encodeURIComponent(regions)}` +
        `&markets=${encodeURIComponent(markets)}` +
        `&oddsFormat=${encodeURIComponent(oddsFormat)}` +
        `&bookmakers=${encodeURIComponent(bookmakers)}`;
    }

    const response = await fetch(targetUrl, {
      headers: { Accept: 'application/json' }
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
