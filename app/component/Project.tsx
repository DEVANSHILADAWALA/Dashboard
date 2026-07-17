"use client";
import { useEffect, useState } from "react";
import ProjectStatusChart from "./ProjectStatusChart";
import {
  FolderKanban,
  ClipboardList,
  Activity,
  PauseCircle,
  BadgeCheck,
  Ban,
} from "lucide-react";

interface Counts {
  total: number;
  planning: number;
  running: number;
  hold: number;
  completed: number;
  stopped: number;
}

interface FinancialYear {
  id: number;
  year_code: string;
  start_year: number;
  end_year: number;
  search_code: string;
  is_active: boolean;
  is_current: boolean;
}

export default function Project() {
  const [counts, setCounts] = useState<Counts>({
    total: 0,
    planning: 0,
    running: 0,
    hold: 0,
    completed: 0,
    stopped: 0,
  });

  //for the chart data
  const [stats, setStats] = useState({
    total: 0,
    inPlanning: 0,
    running: 0,
    onHold: 0,
    completed: 0,
    stopped: 0,
  });

  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [selectedYear, setSelectedYear] = useState("");

  const fetchProjectStats = async (financialYear?: string) => {
    try {
      const url = financialYear
        ? `https://erpupgradeback-1jtf.onrender.com/api/projects/stats?financialYear=${financialYear}`
        : "https://erpupgradeback-1jtf.onrender.com/api/projects/stats";

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        //  for the chart data
        setStats(result.stats);

        setCounts({
          total: result.stats.total || 0,
          planning: result.stats.inPlanning || 0,
          running: result.stats.running || 0,
          hold: result.stats.onHold || 0,
          completed: result.stats.completed || 0,
          stopped: result.stats.stopped || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching project stats:", error);
    }
  };

  const fetchFinancialYears = async () => {
    try {
      const res = await fetch(
        "https://erpupgradeback-1jtf.onrender.com/api/financial-years",
      );

      const data = await res.json();

      if (data.success) {
        setFinancialYears(data.financialYears);
      }
    } catch (err) {
      console.error("Error fetching financial years:", err);
    }
  };

  useEffect(() => {
    fetchProjectStats();
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://erpupgradeback-1jtf.onrender.com/api/projects/stats?financialYear=${selectedYear}`,
        );

        const result = await response.json();

        if (result.success) {
          setCounts({
            total: result.stats.total || 0,
            planning: result.stats.inPlanning || 0,
            running: result.stats.running || 0,
            hold: result.stats.onHold || 0,
            completed: result.stats.completed || 0,
            stopped: result.stats.stopped || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching project stats:", error);
      }
    };
    fetchData();
  }, [selectedYear]);

  const percentage = (value: number) => {
    if (counts.total === 0) return 0;
    return Number(((value / counts.total) * 100).toFixed(1));
  };

  const cards = [
    {
      title: "TOTAL PROJECTS",
      value: counts.total,
      icon: <FolderKanban size={32} className="text-white" />,
      color: "bg-[#194146]",
      light: "bg-slate-50",
      percentage: 100,
    },
    {
      title: "IN PLANNING",
      value: counts.planning,
      icon: <ClipboardList size={32} className="text-white" />,
      color: "bg-[#61e2f3]",
      light: "bg-cyan-50",
      percentage: percentage(counts.planning),
    },
    {
      title: "RUNNING",
      value: counts.running,
      icon: <Activity size={32} className="text-white" />,
      color: "bg-[#bbe7bf]",
      light: "bg-green-50",
      percentage: percentage(counts.running),
    },
    {
      title: "ON HOLD",
      value: counts.hold,
      icon: <PauseCircle size={32} className="text-white" />,
      color: "bg-[#f5e192]",
      light: "bg-yellow-50",
      percentage: percentage(counts.hold),
    },
    {
      title: "COMPLETED",
      value: counts.completed,
      icon: <BadgeCheck size={32} className="text-white" />,
      color: "bg-[#abe64d]",
      light: "bg-lime-50",
      percentage: percentage(counts.completed),
    },
    {
      title: "STOPPED",
      value: counts.stopped,
      icon: <Ban size={32} className="text-white" />,
      color: "bg-[#ffb3b3]",
      light: "bg-red-50",
      percentage: percentage(counts.stopped),
    },
  ];

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#194146]">Project</h1>
          <p className="mt-1 text-gray-500">Overview of all project statuses</p>
        </div>

        <div className="w-full md:w-30 rounded rounded-2">
          <select
            value={selectedYear}
            onChange={(e) => {
              const year = e.target.value;
              setSelectedYear(year);

              if (year === "") {
                fetchProjectStats();
              } else {
                fetchProjectStats(year);
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm  "
          >
            <option value="">ALL</option>

            {financialYears.map((year) => (
              <option key={year.id} value={year.year_code}>
                {year.year_code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Chart */}
        <div className="xl:col-span-5 h-full">
          <ProjectStatusChart stats={stats} />
        </div>

        {/* Cards */}
        <div className="xl:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 h-full">
            {cards.map((card, index) => (
              <div
                key={index}
                className="
            relative
            bg-white
            rounded-2xl
            border border-gray-100
            shadow-sm
            hover:shadow-lg
            transition-all
            duration-300
            p-4
            h-[165px]
            overflow-hidden
          "
              >
                {/* Top Border */}
                <div
                  className={`absolute top-0 left-0 h-1.5 w-full ${card.color}`}
                />

                {/* Background Circle */}
                <div
                  className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${card.light}`}
                />

                {/* Header */}
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <p className="text-[11px] uppercase font-semibold text-gray-500">
                      {card.title}
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-gray-800">
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow ${card.color}`}
                  >
                    {card.icon}
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{card.percentage}%</span>
                  </div>

                  <div className="h-1.5 rounded-full bg-gray-200">
                    <div
                      className={`${card.color} h-1.5 rounded-full`}
                      style={{ width: `${card.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Border */}
                <div
                  className={`absolute bottom-0 left-0 h-1 w-full ${card.color}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
