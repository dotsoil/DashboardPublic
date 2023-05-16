import React from "react";
import { Card } from "react-bootstrap";
import Map from "../pages/Map";
import { useTranslation } from "react-i18next";
import CarouselsCard from "./CarouselsCard";
import { ArrowCircleRightRounded } from "@mui/icons-material";
import HarvestTimeline from "./HarvestTimeline";
import { Link } from "react-router-dom";
import {calculateSizeToUserUnit} from '../utils/globalFunctions'

function FieldCard({ Field, Sensor }) {
  const { t } = useTranslation();
  const fieldUnit = localStorage.getItem("fieldUnit") || "DUNAM";

  
  return (
    <CarouselsCard
      interval={15000}
      className="fieldCard"
      cards={[
        <Card>
          <Card.Header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Card.Title>
              {t("Field Name")} : {Field?.name || " "}
            </Card.Title>
            <Card.Title>
              {t("All Sensors Map")}
              {` `}
              <Link to="/Map">
                <ArrowCircleRightRounded />
              </Link>
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Map
              height={window.innerHeight / 2}
              width={window.innerWidth / 1.6}
              mapCenterValue={Field?.location}
            />
          </Card.Body>
        </Card>,
        <Card>
          <Card.Header>
            <Card.Title>{t("Field Details")}</Card.Title>
          </Card.Header>

          <Card.Body>
            {/* Card text for each key and value field */}
            <Card.Text>
              {t("Field Type")}: {Field?.fieldType || " "}
            </Card.Text>
            <Card.Text>
              {t("Field Size")} :{" "}
              {Field?.size
                ? `${calculateSizeToUserUnit(fieldUnit, Field?.size)} ${
                    t(fieldUnit) || t("DUNAM")
                  }`
                : " "}
            </Card.Text>
            <Card.Text>
              {t("Irrigation Type")}: {Field?.irrigationType || " "}
            </Card.Text>
            <Card.Text>
              {t("Planting Date")} :{" "}
              {(Field && Field?.seedDate?.slice(0, 19).replace("T", " ")) ||
                " "}
            </Card.Text>
            <Card.Text>
              {t("Cultivation")}: {Field?.typeCultivation || " "}
            </Card.Text>
            <Card.Text>
              {t("Sensor ID")}: {Sensor?.Sid || "Sid"}
            </Card.Text>
          </Card.Body>
        </Card>,
        <Card>
          <HarvestTimeline
            seedDate={Field?.seedDate}
            harvestDate={Field?.harvestDate}
          />
        </Card>,
      ]}
    />
  );
}

export default FieldCard;
