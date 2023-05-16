import React from "react";
import "./BatteryProgress.scss";
function BatteryProgress({ battery }) {
  return (
    <div className="battery">
      <section>
        <article>
          <input
            type="radio"
            name="switch-color"
            id="empty-battery"
            checked={battery < 30 && battery > 0 ? true : false}
          />
          <input
            type="radio"
            name="switch-color"
            id="half-battery"
            checked={battery >= 30 && battery <= 50 ? true : false}
          />
          <input
            type="radio"
            name="switch-color"
            id="full-battery"
            checked={battery > 50 ? true : false}
          />
          <div class="chart">
            <div class={`bar bar-${battery || 100} white`}>
              <div class="face top">
                <div class="growing-bar"></div>
              </div>
              <div class="face side-0">
                <div class="growing-bar"></div>
              </div>
              <div class="face floor">
                <div class="growing-bar"></div>
              </div>
              <div class="face side-a"></div>
              <div class="face side-b"></div>
              <div class="face side-1">
                <div class="growing-bar"></div>
              </div>
            </div>
          </div>
        </article>
        <p>Battery {battery}%</p>
      </section>
    </div>
  );
}

export default BatteryProgress;
