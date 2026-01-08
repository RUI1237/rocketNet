import React, { useMemo } from "react";
import { Typography } from "antd";
import ReactECharts from "echarts-for-react";
import type { DataAnalysisSizeDistribution } from "../types/dataAnalysis.types";
import styles from "../styles/DataAnalysis.module.scss";

const { Text } = Typography;

export interface SizeDistributionPanelProps {
  sizeDistribution: DataAnalysisSizeDistribution | null;
}

export const SizeDistributionPanel: React.FC<SizeDistributionPanelProps> = ({
  sizeDistribution,
}) => {
  const option = useMemo(() => {
    if (!sizeDistribution) return {};

    const { sizeRanges, counts } = sizeDistribution;
    const maxCount = Math.max(...counts);
    const dynamicMax = Math.ceil(maxCount * 1.2); // 动态最大值，留20%空间

    return {
      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "5%",
        right: "5%",
        top: "9%",
        bottom: "20%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: sizeRanges,
        axisLine: { lineStyle: { color: "#888" } },
        axisLabel: { color: "#d9d9d9" },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: dynamicMax,
        minInterval: 1,
        axisLine: { lineStyle: { color: "#888" } },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
        axisLabel: { color: "#d9d9d9" },
      },
      series: [
        {
          name: "报警次数",
          type: "bar",
          data: counts,
          itemStyle: {
            color: "rgba(31, 219, 204, 0.9)",
          },
          emphasis: {
            itemStyle: {
              color: "#40a9ff",
            },
          },
          barWidth: "50%",
        },
      ],
    };
  }, [sizeDistribution]);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className="title" style={{ color: "rgba(31, 219, 204, 0.9)" }}>
          超规尺寸风险分布
        </span>
        <span className="subTitle" style={{ color: "#d9d9d9" }}>
          识别主要风险尺寸区间
        </span>
      </div>
      <div className={styles.chartBody}>
        {sizeDistribution ? (
          <ReactECharts
            option={option}
            style={{ width: "100%", height: "100%" }}
            notMerge
            lazyUpdate
          />
        ) : (
          <Text type="secondary" style={{ color: "#d9d9d9" }}>
            暂无尺寸分布数据
          </Text>
        )}
      </div>
    </div>
  );
};
