// create antd timeline component for harvests showing the seed date item and the harvest date item with counting date from seed date to harvest date
import React, { useState, useEffect } from "react";
import { Timeline } from "antd";
import "../scss/components/Timeline.scss";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const HarvestTimeline = ({ seedDate, harvestDate }) => {
  const { t } = useTranslation();

  const [daysSinceStart, setDaysSinceStart] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  const [showSinceDays, setShowSinceDays] = useState(false);
  const [showLeftDays, setShowLeftDays] = useState(false);

  const calculateDays = (calculateDate) => {
    // calculate days left from today to harvest
    const today = new Date();
    const harvest = new Date(calculateDate);
    const diffTime = Math.abs(harvest - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.abs(diffDays);
  };

  useEffect(() => {
    setDaysLeft(calculateDays(harvestDate));
  }, [harvestDate]);

  useEffect(() => {
    setDaysSinceStart(calculateDays(seedDate));
  }, [seedDate]);

  return (
    <Timeline>
      <Timeline.Item color="brown">
        {t("Seed Date")}: {seedDate}
      </Timeline.Item>
      <Timeline.Item dot={<AiOutlineClockCircle />}>
        {daysSinceStart} {t("days since seed date And")} <br />
        {daysLeft} {t("days left to harvest")}
      </Timeline.Item>
      <Timeline.Item color="green">
        {t("Harvest Date")}: {harvestDate}
      </Timeline.Item>
    </Timeline>
  );
};

export default HarvestTimeline;
