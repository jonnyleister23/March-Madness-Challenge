export default async (req, context) => {
  try {
    const apiKey = process.env.ODDS_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing ODDS_API_KEY environment variable" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const sport = "basketball_ncaab";
    const regions = "us";
    const markets = "spreads";
    const oddsFormat = "american";
    const bookmakers = "draftkings";

    const url =
      `https://api.the-odds-api.com/v4/sports/${sport}/odds/` +
      `?apiKey=${apiKey}` +
      `&regions=${encodeURIComponent(regions)}` +
      `&markets=${encodeURIComponent(markets)}` +
      `&oddsFormat=${encodeURIComponent(oddsFormat)}` +
      `&bookmakers=${encodeURIComponent(bookmakers)}`;

    const response = await fetch(url);

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch odds",
        details: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
