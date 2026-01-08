import { dataAnalysisService } from "../services/dataAnalysis.service";

export function dataAnalysisLoader() {
  const kpiPromise = dataAnalysisService.getKpi();
  const trendsPromise = dataAnalysisService.getTrends24h();
  const efficiencyPromise = dataAnalysisService.getEfficiency();
  const sizePromise = dataAnalysisService.getSizeDistribution();
  const alarmsPromise = dataAnalysisService.getLatestAlarms();

  return {
    kpi: kpiPromise,
    trends24h: trendsPromise,
    efficiency: efficiencyPromise,
    sizeDistribution: sizePromise,
    latestAlarms: alarmsPromise,
  };
}
