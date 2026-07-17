"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, RefreshCw } from "lucide-react";

interface Timesheet {
  id: number;
  project_code: string;
  project_type: string;
  process_name: string;
  start_time: string;
  stop_time: string | null;
  user_name: string;
  date: string;
  project_by: string;
}

export default function Timesheet() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [, setNow] = useState(Date.now());

  const fetchTimesheets = async (initial = false) => {
    try {
      if (initial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const res = await fetch(
        "https://erpupgradeback-1jtf.onrender.com/api/timesheets?stopTime=Ongoing",
        {
          cache: "no-store",
        },
      );

      const data = await res.json();
      setTimesheets(data.timesheets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTimesheets(true);

    const interval = setInterval(() => {
      fetchTimesheets(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getDuration = (date: string, startTime: string) => {
    const start = new Date(`${date}T${startTime}`);
    const now = new Date();
    let diff = now.getTime() - start.getTime();
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#194146]">Active Timesheets</h1>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <div className="text-lg font-medium text-gray-500">
            Loading timesheets...
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto  pt-3 pb-4 ">
            <div className="flex gap-5 w-max">
              {timesheets.map((item) => (
                <div
                  key={item.id}
                  className="w-[325px] flex-shrink-0 rounded-2xl border border-[#d7e3e4] bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
                >
                  {/* Top Header */}
                  <div className="bg-[#194146] px-4 py-3 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg font-bold">
                          {item.user_name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {item.user_name}
                          </h3>
                        </div>
                      </div>

                      <div className="rounded-lg bg-white/10 px-3 py-2 text-right">
                        <p className="text-[10px] uppercase tracking-wide">
                          Duration
                        </p>

                        <p className="text-sm font-bold">
                          {getDuration(item.date, item.start_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-3 p-4">

                    {/* Project & Project By */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          Project
                        </p>
                        <p className="mt-0.5 break-all text-sm font-semibold text-black">
                          {item.project_code}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          Project By
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-black">
                          {item.project_by}
                        </p>
                      </div>
                    </div>

                    {/* Process & Type */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          Process
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-black">
                          {item.process_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          Type
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-black">
                          {item.project_type}
                        </p>
                      </div>
                    </div>

                    {/* Date & Start Time */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          Date
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-black">
                          {new Date(item.date).toLocaleDateString("en-GB")}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          Start Time
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-black">
                          {item.start_time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {timesheets.length === 0 && (
            <div className="py-20 text-center">
              <h3 className="text-xl font-semibold text-gray-700">
                No Active Timesheets
              </h3>

              <p className="mt-2 text-gray-500">
                There are currently no employee sessions.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
