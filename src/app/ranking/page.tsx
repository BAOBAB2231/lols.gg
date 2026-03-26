"use client";

import { useState, useEffect } from "react";
import FilterControls from "./components/FilterControls";
import WinrateRanking from "./components/WinrateRankingSection";
import SynergyRanking from "./components/SynergyRankingSection";
import DamageRanking from "./components/DamageRankingSection";
import GoldRanking from "./components/GoldRankingSection";
import DamagePerDeathRanking from "./components/DamagePerDeathRankingSection";
import TotalAssistsRanking from "./components/TotalAssistsRankingSection";
import TotalGamesRanking from "./components/TotalGamesRankingSection";
import TotalKillsRanking from "./components/TotalKillsRankingSection";
import TeamWinrate from "./components/TeamWinrateSection";
import StreakRankingSection from "./components/StreakRankingSection"; // ✅ 추가

const TABS = [
  "승률",
  "딜량",
  "골드",
  "시너지",
  "데스당 딜량",
  "진형 승률",
  "총 킬",
  "총 어시스트",
  "총 게임수",
  "역대연승",
  "역대연패",
  "현재연승",
  "현재연패", // ✅ 추가
];

export default function RankingPage() {
  const [selectedTab, setSelectedTab] = useState("승률");
  const [position, setPosition] = useState("전체라인");
  const [month, setMonth] = useState("전체");
  const [year, setYear] = useState("2026");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">랭킹 페이지</h1>

      {/* 필터 적용 탭 */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {["승률", "딜량", "골드", "시너지", "데스당 딜량", "진형 승률"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
              selectedTab === tab ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 필터 없는 탭 */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {["총 킬", "총 어시스트", "총 게임수", "역대연승", "역대연패", "현재연승", "현재연패"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
              selectedTab === tab ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 필터 컨트롤 (필터 필요한 탭만 보여줌) */}
      {["승률", "딜량", "골드", "시너지", "데스당 딜량", "진형 승률"].includes(selectedTab) && (
        <FilterControls
          selectedPosition={position}
          onPositionChange={setPosition}
          selectedMonth={month}
          onMonthChange={setMonth}
          selectedYear={year}
          onYearChange={setYear}
        />
      )}

      {/* 실제 컨텐츠 섹션 */}
      <div className="mt-6">
        {selectedTab === "승률" && <WinrateRanking position={position} month={month} year={year} />}
        {selectedTab === "딜량" && <DamageRanking position={position} month={month} year={year} />}
        {selectedTab === "골드" && <GoldRanking position={position} month={month} year={year} />}
        {selectedTab === "시너지" && <SynergyRanking position={position} month={month} year={year} />}
        {selectedTab === "데스당 딜량" && <DamagePerDeathRanking position={position} month={month} year={year} />}
        {selectedTab === "진형 승률" && <TeamWinrate year={year} month={month} />}

        {selectedTab === "총 킬" && <TotalKillsRanking />}
        {selectedTab === "총 어시스트" && <TotalAssistsRanking />}
        {selectedTab === "총 게임수" && <TotalGamesRanking />}

        {selectedTab === "역대연승" && (
          <StreakRankingSection type="역대연승" api="/api/stats/ranking/longestWinStreak?" />
        )}
        {selectedTab === "역대연패" && (
          <StreakRankingSection type="역대연패" api="/api/stats/ranking/longestLoseStreak?" />
        )}
        {selectedTab === "현재연승" && (
          <StreakRankingSection type="현재연승" api="/api/stats/ranking/currentWinStreak?" />
        )}
        {selectedTab === "현재연패" && (
          <StreakRankingSection type="현재연패" api="/api/stats/ranking/currentLoseStreak?" />
        )}
      </div>
    </div>
  );
}
