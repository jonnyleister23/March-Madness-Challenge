export default async (req, context) => {
  try {
    const apiKey = process.env.ODDS_API_KEY;

    const url =
      `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/` +
      `?apiKey=${apiKey}` +
      `&regions=us&markets=spreads&oddsFormat=american&bookmakers=draftkings`;

    const response = await fetch(url);
    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
