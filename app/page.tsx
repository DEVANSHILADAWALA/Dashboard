import Project from "./component/Project";
import TimesheetTable from "./component/Timesheet";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 space-y-4">
        {/* Timesheet Section */}
        <TimesheetTable />

        {/* Dashboard Cards */}
        <Project />

      </div>
    </div>
  );
}