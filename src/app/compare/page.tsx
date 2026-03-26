"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import championNameKo from "@/lib/championNameKo";

export default function ComparePage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("all");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const laneNameMap: Record<string, string> = {
    TOP: "탑",
    JUNGLE: "정글",
    MIDDLE: "미드",
    BOTTOM: "원딜",
    UTILITY: "서포터",
  };

  async function handleCompare() {
    if (!playerA || !playerB) return;
    if (playerA === playerB) {
      alert("같은 플레이어끼리는 비교할 수 없습니다.");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("playerA", playerA);
      params.append("playerB", playerB);
      params.append("year", year);
      params.append("month", month);

      const res = await fetch(`/api/compare?${params.toString()}`);
      if (!res.ok) {
        const text = await res.text(); // 실패 시 json()이 아니라 text()로 먼저 읽어야 에러 안남
        console.error("서버 에러:", text);
        alert("서버 오류 발생");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("요청 실패:", error);
      alert("네트워크 오류");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchPlayers() {
      const res = await fetch("/api/players");
      const data = await res.json();
      const aliasList = data
        .filter((p: any) => p.alias && p.alias !== "guest")
        .map((p: any) => p.alias);
      setPlayers(aliasList);
    }
    fetchPlayers();
  }, []);

  return (
    <div className="from-gray-900 to-black min-h-screen text-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* 상단 타이틀 */}
        <h1 className="text-4xl font-extrabold text-center mb-10">
          상대 전적 비교
        </h1>

        {/* 필터 (연도/월) */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Select onValueChange={(value) => setYear(value)}>
            <SelectTrigger className="w-[120px] bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="2026" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setMonth(value)}>
            <SelectTrigger className="w-[120px] bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {[...Array(12)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 플레이어 선택 + 비교 버튼 */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
          <Select onValueChange={(value) => setPlayerA(value)}>
            <SelectTrigger className="w-[200px] bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="플레이어 A 선택" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player} value={player}>
                  {player}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setPlayerB(value)}>
            <SelectTrigger className="w-[200px] bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="플레이어 B 선택" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player} value={player}>
                  {player}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={handleCompare}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded"
          >
            비교하기
          </button>
        </div>

        {/* 결과 표시 */}
        {loading && (
          <div className="text-lg font-semibold text-center">로딩중...</div>
        )}

        {result && (
          <div className="space-y-8">
            {/* 전체 전적 */}
            <div className="p-6 border border-neutral-700 rounded-2xl bg-neutral-800/90 shadow-lg shadow-black/20">
              <h2 className="text-2xl font-bold mb-4 text-center">전체 전적</h2>
              <div className="text-lg text-center">
                {playerA} vs {playerB}
              </div>
              <div className="mt-4 flex justify-center gap-8 text-xl">
                <span className="text-blue-400">
                  승리 {result.summary.wins}회
                </span>
                <span className="text-red-400">
                  패배 {result.summary.losses}회
                </span>
                <span className="font-semibold">
                  {result.summary.winrate}% 승률
                </span>
              </div>
            </div>

            {/* 맞라인 전적 */}
            {/* 맞라인 전적 */}
            <div className="p-6 border border-neutral-700 rounded-2xl bg-neutral-800/90 shadow-lg shadow-black/20">
              <h2 className="text-2xl font-bold mb-6 text-center">
                맞라인 전적
              </h2>

              {result.laneStats.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">
                  {result.laneStats.map((lane: any) => (
                    <div
                      key={lane.lane}
                      className="w-36 sm:w-40 bg-[#1c1c1e] p-4 rounded-2xl shadow-md border border-neutral-700 flex flex-col items-center"
                    >
                      <div className="text-lg font-bold mb-2">
                        {laneNameMap[lane.lane] || lane.lane}
                      </div>
                      <div className="text-sm">
                        <span className="text-blue-400">{lane.wins}승</span> /
                        <span className="text-red-400 ml-1">
                          {lane.losses}패
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        {lane.winrate}% 승률
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-neutral-400">
                  맞라인 전적 없음
                </div>
              )}
            </div>
            {/* 챔피언별 전적 */}
            <div className="p-6 border border-neutral-700 rounded-2xl bg-neutral-800/90 shadow-lg shadow-black/20">
              <h2 className="text-2xl font-bold mb-6 text-center">
                챔피언별 전적
              </h2>

              {Object.entries(result.championStatsByLane).length > 0 ? (
                Object.entries(result.championStatsByLane).map(
                  ([lane, champs]: any) => (
                    <div key={lane} className="mb-8">
                      {/* 라인 제목 */}
                      <h3 className="text-xl font-bold mb-3 text-left pl-2">
                        {laneNameMap[lane] || lane} 라인
                      </h3>

                      {/* 테이블 */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center border border-neutral-700 rounded-xl overflow-hidden">
                          <thead className="bg-neutral-700 text-white">
                            <tr>
                              <th className="px-3 py-2">내 챔피언</th>
                              <th className="px-3 py-2">vs</th>
                              <th className="px-3 py-2">상대 챔피언</th>
                              <th className="px-3 py-2 text-blue-400">승리</th>
                              <th className="px-3 py-2 text-red-400">패배</th>
                              <th className="px-3 py-2">승률</th>
                            </tr>
                          </thead>
                          <tbody className="bg-neutral-800">
                            {(champs as any[]).map((champ, idx) => (
                              <tr
                                key={idx}
                                className="border-t border-neutral-700"
                              >
                                <td className="px-3 py-2">
                                  {championNameKo[champ.championA] ||
                                    champ.championA}
                                </td>
                                <td className="px-3 py-2 text-neutral-400">
                                  vs
                                </td>
                                <td className="px-3 py-2">
                                  {championNameKo[champ.championB] ||
                                    champ.championB}
                                </td>
                                <td className="px-3 py-2 text-blue-400">
                                  {champ.wins}
                                </td>
                                <td className="px-3 py-2 text-red-400">
                                  {champ.losses}
                                </td>
                                <td className="px-3 py-2 font-semibold">
                                  {champ.winrate}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-center text-neutral-400">
                  챔피언별 전적 없음
                </div>
              )}
            </div>

            {/* 최근 3경기 표시 */}
            {result.recentMatches?.length > 0 && (
              <div className="p-6 border border-neutral-700 rounded-2xl bg-neutral-800/90 shadow-lg shadow-black/20">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  최근 3경기
                </h2>
                <div className="space-y-4">
                  {result.recentMatches.map((match: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b border-neutral-700 pb-2 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {new Date(match.date).toLocaleDateString("ko-KR")}
                        </span>
                        <span className="text-neutral-400">
                          {match.matchId}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-base">
                          {championNameKo[match.championA]} vs{" "}
                          {championNameKo[match.championB]}
                        </span>
                        <span
                          className={
                            match.result === "win"
                              ? "text-blue-400"
                              : "text-red-400"
                          }
                        >
                          {match.result === "win" ? "승리" : "패배"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
