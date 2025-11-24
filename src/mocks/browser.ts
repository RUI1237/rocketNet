// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { alarmData } from "./alarmData";
import { predictionData } from "./predictionData";
import { monitoringData } from "./monitoringData";

export const worker = setupWorker(...handlers, ...alarmData, ...predictionData, ...monitoringData);
