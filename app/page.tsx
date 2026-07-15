"use client";

import { useEffect, useState } from "react";
import { getProjects, getProjectsByStatus } from "../services/api";

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

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>({
    total: 0,
    planning: 0,
    running: 0,
    hold: 0,
    completed: 0,
    stopped: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [total, planning, running, hold, completed, stopped] =
        await Promise.all([
          getProjects(),
          getProjectsByStatus("In Planning"),
          getProjectsByStatus("running"),
          getProjectsByStatus("On Hold"),
          getProjectsByStatus("completed"),
          getProjectsByStatus("stopped"),
        ]);

      setCounts({
        total: total?.pagination?.total || 0,
        planning: planning?.pagination?.total || 0,
        running: running?.pagination?.total || 0,
        hold: hold?.pagination?.total || 0,
        completed: completed?.pagination?.total || 0,
        stopped: stopped?.pagination?.total || 0,
      });
    };

    fetchData();
  }, []);

  const percentage = (value: number) => {
    if (counts.total === 0) return 0;

    return Number(((value / counts.total) * 100).toFixed(1));
  };

  const cards = [
    {
      title: "TOTAL PROJECTS",
      value: counts.total,
      icon: <FolderKanban size={32} className="text-white" />,
      color: "bg-slate-500",
      light: "bg-slate-50",
      percentage: 100,
    },
    {
      title: "IN PLANNING",
      value: counts.planning,
      icon: <ClipboardList size={32} className="text-white" />,
      color: "bg-[#0e7490]",
      light: "bg-cyan-50",
      percentage: percentage(counts.planning),
    },
    {
      title: "RUNNING",
      value: counts.running,
      icon: <Activity size={32} className="text-white" />,
      color: "bg-[#53a80c]",
      light: "bg-green-50",
      percentage: percentage(counts.running),
    },
    {
      title: "ON HOLD",
      value: counts.hold,
      icon: <PauseCircle size={32} className="text-white" />,
      color: "bg-yellow-500",
      light: "bg-yellow-50",
      percentage: percentage(counts.hold),
    },
    {
      title: "COMPLETED",
      value: counts.completed,
      icon: <BadgeCheck size={32} className="text-white" />,
      color: "bg-[#53a80c]",
      light: "bg-lime-50",
      percentage: percentage(counts.completed),
    },
    {
      title: "STOPPED",
      value: counts.stopped,
      icon: <Ban size={32} className="text-white" />,
      color: "bg-[#df6565]",
      light: "bg-red-50",
      percentage: percentage(counts.stopped),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="
              relative
              bg-white
              rounded-3xl
              shadow-lg
              hover:shadow-2xl
              transition-all
              duration-300
              hover:-translate-y-2
              overflow-hidden
              p-6
            "
          >
            {/* Top Bar */}
            <div className={`absolute top-0 left-0 h-2 w-full ${card.color}`} />

            {/* Background Circle */}
            <div
              className={`
                absolute
                -right-10
                -top-10
                h-32
                w-32
                rounded-full
                ${card.light}
              `}
            />

            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {card.title}
                </p>

                <h2 className="text-5xl font-bold text-gray-800 mt-3">
                  {card.value}
                </h2>
              </div>

              <div
                className={`
                  h-16
                  w-16
                  rounded-2xl
                  ${card.color}
                  flex
                  items-center
                  justify-center
                  shadow-lg
                `}
              >
                {card.icon}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span>{card.percentage}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${card.color} h-2 rounded-full`}
                  style={{
                    width: `${card.percentage}%`,
                  }}
                />
              </div>
            </div>

            {/* Bottom Border */}
            <div
              className={`
                absolute
                bottom-0
                left-0
                h-1
                w-full
                ${card.color}
              `}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
