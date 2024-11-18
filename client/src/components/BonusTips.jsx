import React from "react";

function BonusTips({ tips }) {
  return (
    <div>
      <h2>Daily Bonus Tips</h2>
      <ul>
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}

export default BonusTips;
