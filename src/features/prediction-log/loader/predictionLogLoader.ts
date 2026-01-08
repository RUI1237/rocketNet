import type { LoaderFunctionArgs } from "react-router-dom";
import { predictionService } from "../services/prediction.service";

export function predictionLogLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = Number(url.searchParams.get("pageSize")) || 10;
  const logsPromise = predictionService.fetchLogs({ page, pageSize });

  return { logs: logsPromise, page, pageSize };
}
