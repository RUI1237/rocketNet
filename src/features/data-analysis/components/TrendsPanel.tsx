import React, { useMemo } from "react";
import { Typography } from "antd";
import ReactECharts from "echarts-for-react";
import type { DataAnalysisTrends24h } from "../types/dataAnalysis.types";
import styles from "../styles/DataAnalysis.module.scss";

const { Text } = Typography;

export interface TrendsPanelProps {
  trends24h: DataAnalysisTrends24h | null;
}

export const TrendsPanel: React.FC<TrendsPanelProps> = ({ trends24h }) => {
  const option = useMemo(() => {
    if (!trends24h) return {};

    const { hours, taskCounts, alarmCounts } = trends24h;

    return {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["预测数", "报警数"],
        textStyle: { color: "#d9d9d9" },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: hours,
        axisLine: { lineStyle: { color: "#888" } },
        axisLabel: { color: "#d9d9d9" },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#888" } },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
        axisLabel: { color: "#d9d9d9" },
      },
      series: [
        {
          name: "预测数",
          type: "line",
          smooth: true,
          data: taskCounts,
          areaStyle: {
            color: "rgba(64,169,255,0.25)",
          },
          lineStyle: {
            color: "#40a9ff",
          },
          symbol: "circle",
          symbolSize: 4,
        },
        {
          name: "报警数",
          type: "line",
          smooth: true,
          data: alarmCounts,
          areaStyle: {
            color: "rgba(250,84,28,0.25)",
          },
          lineStyle: {
            color: "#fa8c16",
          },
          symbol: "circle",
          symbolSize: 4,
        },
      ],
    };
  }, [trends24h]);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className="title" style={{ color: "rgba(31, 219, 204, 0.9)" }}>
          <span style={{ marginRight: 8, color: "#40a9ff", fontSize: 16 }}>
            {/* 折线图 icon 可用 LineChartOutlined，如果没有则用字符 */}
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              fill="none"
              style={{ verticalAlign: "middle" }}
            >
              <polyline points="2,14 7,9 12,13 18,4" stroke="#40a9ff" strokeWidth="2" fill="none" />
              <circle cx="2" cy="14" r="1.2" fill="#40a9ff" />
              <circle cx="7" cy="9" r="1.2" fill="#40a9ff" />
              <circle cx="12" cy="13" r="1.2" fill="#40a9ff" />
              <circle cx="18" cy="4" r="1.2" fill="#40a9ff" />
            </svg>
          </span>
          24 小时任务 / 报警趋势
        </span>
        <span className="subTitle" style={{ color: "#d9d9d9" }}>
          系统 24 小时不间断智能监控能力
        </span>
      </div>
      <div className={styles.chartBody}>
        {trends24h ? (
          // 保证折线图为有幅度，无 "平滑过度"
          <ReactECharts
            option={{
              ...option,
              // 覆盖 option 里的 smooth 为 false，显示有幅度折线
              series: option.series?.map((s: any) => ({
                ...s,
                smooth: false,
              })),
            }}
            style={{ width: "100%", height: "100%" }}
            notMerge
            lazyUpdate
          />
        ) : (
          <Text type="secondary" style={{ color: "#d9d9d9" }}>
            暂无趋势数据
          </Text>
        )}
      </div>
    </div>
  );
};
