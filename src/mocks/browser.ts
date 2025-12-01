// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { alarmData } from "./alarmData";
import { predictionData } from "./predictionData";
import { monitoringData } from "./monitoringData";
import { dataAnalysisData } from "./dataAnalysisData";

export const worker = setupWorker(
  ...handlers,
  ...alarmData,
  ...predictionData,
  ...monitoringData,
  ...dataAnalysisData
);
