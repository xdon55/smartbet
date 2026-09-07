export type Outcome = { id: string; label: string; odds: number };

export type Market = {
  id: string;
  name: string;
  outcomes: Outcome[];
};

export type Match = {
  id: string;
  sport: string;
  league: string;
  country: string;
  home: string;
  away: string;
  startsAt: string;
  live?: { minute: number; homeScore: number; awayScore: number };
  marketCount: number;
  markets: Market[];
};

const oneX2 = (h: number, d: number, a: number): Market => ({
  id: "1x2",
  name: "1X2",
  outcomes: [
    { id: "1", label: "1", odds: h },
    { id: "X", label: "X", odds: d },
    { id: "2", label: "2", odds: a },
  ],
});

const goals = (over: number, under: number): Market => ({
  id: "ou25",
  name: "Total goals 2.5",
  outcomes: [
    { id: "over", label: "Over", odds: over },
    { id: "under", label: "Under", odds: under },
  ],
});

const btts = (yes: number, no: number): Market => ({
  id: "btts",
  name: "Both teams to score",
  outcomes: [
    { id: "yes", label: "Yes", odds: yes },
    { id: "no", label: "No", odds: no },
  ],
});

export const matches: Match[] = [
  {
    id: "m1",
    sport: "Football",
    league: "Uganda Premier League",
    country: "Uganda",
    home: "Vipers SC",
    away: "KCCA FC",
    startsAt: "Today 18:00",
    marketCount: 148,
    markets: [oneX2(2.05, 3.1, 3.6), goals(1.85, 1.9), btts(1.78, 1.95)],
  },
  {
    id: "m2",
    sport: "Football",
    league: "Premier League",
    country: "England",
    home: "Arsenal",
    away: "Liverpool",
    startsAt: "Today 20:30",
    live: { minute: 63, homeScore: 1, awayScore: 1 },
    marketCount: 212,
    markets: [oneX2(2.45, 3.4, 2.7), goals(1.62, 2.25), btts(1.55, 2.35)],
  },
  {
    id: "m3",
    sport: "Football",
    league: "La Liga",
    country: "Spain",
    home: "Real Betis",
    away: "Sevilla",
    startsAt: "Tomorrow 22:00",
    marketCount: 176,
    markets: [oneX2(2.9, 3.15, 2.4), goals(1.95, 1.8), btts(1.7, 2.05)],
  },
  {
    id: "m4",
    sport: "Football",
    league: "Serie A",
    country: "Italy",
    home: "Inter",
    away: "Napoli",
    startsAt: "Today 19:45",
    live: { minute: 28, homeScore: 0, awayScore: 0 },
    marketCount: 190,
    markets: [oneX2(1.95, 3.3, 4.1), goals(2.1, 1.7), btts(1.88, 1.85)],
  },
  {
    id: "m5",
    sport: "Basketball",
    league: "NBA",
    country: "USA",
    home: "Boston Celtics",
    away: "Denver Nuggets",
    startsAt: "Tomorrow 03:30",
    marketCount: 94,
    markets: [
      {
        id: "ml",
        name: "Winner",
        outcomes: [
          { id: "1", label: "1", odds: 1.72 },
          { id: "2", label: "2", odds: 2.1 },
        ],
      },
      goals(1.9, 1.9),
    ],
  },
  {
    id: "m6",
    sport: "Tennis",
    league: "ATP Masters",
    country: "France",
    home: "C. Alcaraz",
    away: "J. Sinner",
    startsAt: "Today 16:00",
    live: { minute: 1, homeScore: 1, awayScore: 0 },
    marketCount: 66,
    markets: [
      {
        id: "ml",
        name: "Winner",
        outcomes: [
          { id: "1", label: "1", odds: 1.95 },
          { id: "2", label: "2", odds: 1.85 },
        ],
      },
    ],
  },
  {
    id: "m7",
    sport: "Football",
    league: "CAF Champions League",
    country: "Africa",
    home: "Al Ahly",
    away: "Mamelodi Sundowns",
    startsAt: "Sat 17:00",
    marketCount: 132,
    markets: [oneX2(2.2, 3.05, 3.3), goals(2.0, 1.75), btts(1.82, 1.9)],
  },
  {
    id: "m8",
    sport: "Football",
    league: "Bundesliga",
    country: "Germany",
    home: "Bayern München",
    away: "RB Leipzig",
    startsAt: "Sun 18:30",
    marketCount: 168,
    markets: [oneX2(1.55, 4.2, 5.4), goals(1.48, 2.6), btts(1.6, 2.25)],
  },
];

export const sports = [
  { id: "football", name: "Football", count: 1284 },
  { id: "basketball", name: "Basketball", count: 212 },
  { id: "tennis", name: "Tennis", count: 176 },
  { id: "cricket", name: "Cricket", count: 48 },
  { id: "rugby", name: "Rugby", count: 31 },
  { id: "volleyball", name: "Volleyball", count: 27 },
  { id: "esports", name: "eSports", count: 64 },
  { id: "boxing", name: "Boxing", count: 12 },
];

export const formatUgx = (value: number) =>
  new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(value);
