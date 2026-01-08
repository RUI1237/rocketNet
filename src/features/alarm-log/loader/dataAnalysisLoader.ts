import type { LoaderFunctionArgs } from "react-router-dom";
import { alarmService } from "../services/alarm.service";

export function alarmLogLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = Number(url.searchParams.get("pageSize")) || 10;
  const logsPromise = alarmService.fetchLogs({ page, pageSize });

  return { logs: logsPromise, page, pageSize };
}
