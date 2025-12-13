import React, { useEffect, useState } from "react";
import "./HeatMap.css";

const generateActivityData = (year) => {
  const data = {};
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const count = Math.floor(Math.random() * 50);
    data[dateStr] = count;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState({});
  const [maxCount, setMaxCount] = useState(0);

  useEffect(() => {
    const data = generateActivityData(2024);
    setActivityData(data);
    const max = Math.max(...Object.values(data));
    setMaxCount(max);
  }, []);

  const getColor = (count) => {
    if (count === 0) return "#ebedf0";
    const intensity = count / maxCount;
    const hue = 120; // green
    const saturation = 100;
    const lightness = 100 - intensity * 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthDays = [];
  let currentMonth = 0;

  for (let month = 0; month < 12; month++) {
    const year = 2024;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    monthDays.push({
      month: months[month],
      days: daysInMonth,
      startDay: new Date(year, month, 1).getDay(),
    });
  }

  return (
    <div className="heatmap-container">
      <h3>2024 Contribution Activity</h3>
      <div className="heatmap-grid">
        {monthDays.map((monthData, monthIdx) => (
          <div key={monthIdx} className="month-section">
            <div className="month-label">{monthData.month}</div>
            <div className="month-grid">
              {Array.from({ length: 7 }).map((_, dayOfWeek) => (
                <div key={dayOfWeek} className="week-column">
                  {Array.from({ length: 6 }).map((_, week) => {
                    const dayNum = week * 7 + dayOfWeek - monthData.startDay + 1;
                    if (dayNum < 1 || dayNum > monthData.days) {
                      return <div key={`empty-${week}-${dayOfWeek}`} className="day empty"></div>;
                    }
                    const dateStr = `2024-${String(monthIdx + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                    const count = activityData[dateStr] || 0;
                    return <div key={dateStr} className="day" style={{ backgroundColor: getColor(count) }} title={`${dateStr}: ${count} contributions`} />;
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((intensity, idx) => (
          <div
            key={idx}
            className="legend-box"
            style={{
              backgroundColor: intensity === 0 ? "#ebedf0" : `hsl(120, 100%, ${100 - intensity * 50}%)`,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatMapProfile;
