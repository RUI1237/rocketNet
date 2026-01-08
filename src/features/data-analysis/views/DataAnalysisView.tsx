import React, { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";
import { Spin, Alert } from "antd";
import styles from "../styles/DataAnalysis.module.scss";

import { KpiOverview } from "../components/KpiOverview";
import { TrendsPanel } from "../components/TrendsPanel";
import { EfficiencyPanel } from "../components/EfficiencyPanel";
import { SizeDistributionPanel } from "../components/SizeDistributionPanel";
import { LatestAlarmsWall } from "../components/LatestAlarmsWall";
import type { dataAnalysisLoader } from "../loader/dataAnalysisLoader";

const SectionLoading = ({ tip }: { tip?: string }) => (
  <div
    style={{
      padding: 20,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <Spin tip={tip || "加载数据中..."}>
      <div style={{ padding: 50, background: "transparent" }} />
    </Spin>
  </div>
);

const SectionError = () => (
  <Alert message="数据加载失败" type="error" showIcon style={{ margin: 10 }} />
);

const DataAnalysisView: React.FC = () => {
  // @ts-ignore: TS可能会报 Promise 类型不匹配，实际运行是没问题的
  const { kpi, trends24h, efficiency, sizeDistribution, latestAlarms } =
    useLoaderData() as ReturnType<typeof dataAnalysisLoader>;
  return (
    <div className={styles.dashboardRoot}>
      {/* 模块 1: KPI */}
      <Suspense fallback={<SectionLoading tip="加载关键指标..." />}>
        <Await resolve={kpi} errorElement={<SectionError />}>
          {(resolvedKpi) => <KpiOverview kpi={resolvedKpi} />}
        </Await>
      </Suspense>

      {/* 中部布局 */}
      <div className={styles.chartsRow}>
        {/* 模块 2: 趋势图 */}
        <Suspense fallback={<SectionLoading tip="绘制趋势图..." />}>
          <Await resolve={trends24h} errorElement={<SectionError />}>
            {(resolvedTrends) => <TrendsPanel trends24h={resolvedTrends} />}
          </Await>
        </Suspense>

        {/* 右侧布局 */}
        <div className={styles.rightColumn}>
          {/* 模块 3: 效率 */}
          <Suspense fallback={<SectionLoading tip="绘制效率图..." />}>
            <Await resolve={efficiency} errorElement={<SectionError />}>
              {(data) => <EfficiencyPanel efficiency={data} />}
            </Await>
          </Suspense>

          {/* 模块 4: 尺寸分布 */}
          <Suspense fallback={<SectionLoading tip="绘制尺寸分布..." />}>
            <Await resolve={sizeDistribution} errorElement={<SectionError />}>
              {(data) => <SizeDistributionPanel sizeDistribution={data} />}
            </Await>
          </Suspense>

          {/* 模块 5: 报警墙 */}
          <Suspense fallback={<SectionLoading tip="绘制报警墙..." />}>
            <Await resolve={latestAlarms} errorElement={<SectionError />}>
              {(data) => <LatestAlarmsWall latestAlarms={data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysisView;
