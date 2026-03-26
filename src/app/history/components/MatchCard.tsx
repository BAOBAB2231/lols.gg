"use client";

import { normalizeChampionName } from "@/lib/getChampionImgUrl";

const CHAMP_IMG_BASE = "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion";

export default function MatchCard({ match }: { match: any }) {
  const blueTeam = match.participants.filter((p: any) => p.teamId === "blue");
  const redTeam = match.participants.filter((p: any) => p.teamId === "red");

  const date = new Date(match.gameDate).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const redWon = redTeam.some((p: any) => p.win === "Win");
  const blueWon = blueTeam.some((p: any) => p.win === "Win");

  const allPlayers = [...blueTeam, ...redTeam];
  const topDamage = Math.max(...allPlayers.map((p) => Number(p.totalDamageDealtToChampions)));

  const renderPlayer = (player: any) => {
    const isTopDamage = Number(player.totalDamageDealtToChampions) === topDamage;
    const champ = normalizeChampionName(player.championName);
    const imgUrl = `${CHAMP_IMG_BASE}/${champ}.png`;

    return (
      <div key={player.name} className="flex items-center gap-3">
        <img
          src={imgUrl}
          alt={player.championName}
          width={32}
          height={32}
          className="rounded"
          onError={(e) => {
            e.currentTarget.src = "/fallback-champion.png";
          }}
        />
        <div>
          <div className="text-white text-sm font-semibold">{player.name}</div>
          <div
            className={`text-xs flex flex-wrap gap-x-4 ${isTopDamage ? "text-yellow-300 font-bold" : "text-gray-300"}`}
          >
            <span>
              {player.kills} / {player.deaths} / {player.assists}
            </span>
            <span>{Number(player.totalDamageDealtToChampions).toLocaleString()} dmg</span>
            <span>{Number(player.goldEarned).toLocaleString()} gold</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{match.matchId}</h2>
        <span className="text-sm text-gray-400">{date}</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className={`font-semibold mb-2 ${blueWon ? "text-green-400" : "text-blue-400"}`}>
            Blue Team {blueWon && "🏆"}
          </h3>
          <div className="space-y-2">{blueTeam.map(renderPlayer)}</div>
        </div>
        <div>
          <h3 className={`font-semibold mb-2 ${redWon ? "text-green-400" : "text-red-400"}`}>
            Red Team {redWon && "🏆"}
          </h3>
          <div className="space-y-2">{redTeam.map(renderPlayer)}</div>
        </div>
      </div>
    </div>
  );
}
