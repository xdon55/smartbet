import { createFileRoute } from "@tanstack/react-router";
import { GameLobby } from "@/components/game-lobby";

export const Route = createFileRoute("/casino")({
  head: () => ({
    meta: [
      { title: "Casino games · SMARTBET" },
      {
        name: "description",
        content: "Play live roulette, blackjack, game shows and slots in UGX at the SMARTBET casino.",
      },
      { property: "og:title", content: "Casino games · SMARTBET" },
      {
        property: "og:description",
        content: "Live roulette, blackjack, game shows and slots in UGX.",
      },
    ],
  }),
  component: () => (
    <GameLobby
      category="casino"
      title="Casino"
      tagline="Live tables, game shows and top slots, all in UGX."
    />
  ),
});
