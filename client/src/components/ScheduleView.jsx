import React from "react";

const ScheduleView = ({ schedule }) => {
  console.log(schedule);

  let parsedSchedule;

  try {
    // תקן JSON שכולל תווים לא חוקיים
    const sanitizedSchedule = schedule.replace(/```json|```/g, "");
    parsedSchedule = JSON.parse(sanitizedSchedule);
  } catch (error) {
    console.error("Failed to parse schedule:", error);
    return <p>Invalid schedule format</p>;
  }

  if (!parsedSchedule || parsedSchedule.length === 0) {
    return <p>No schedule available</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Daily Schedule</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {parsedSchedule.map((item, index) => (
          <li
            key={index}
            style={{
              marginBottom: "15px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: item.task.includes("אתגר")
                ? "#e0f7fa"
                : "#f9f9f9",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <strong>{item.startTime} - {item.endTime}</strong>: {item.task}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleView;
