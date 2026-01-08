import React from "react";
import { Table, Button, Tag, Descriptions } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { PredictionLogType, PredictionEvent } from "../types/prediction.types";
import type { ColumnsType } from "antd/es/table";
import styles from "@/features/alarm-log/styles/Log.module.scss";

interface PredictionDetailProps {
  record: PredictionLogType;
  onViewImage: (url: string) => void;
}

const PredictionDetail: React.FC<PredictionDetailProps> = ({ record, onViewImage }) => {
  const columns: ColumnsType<PredictionEvent> = [
    {
      title: "帧时间戳",
      dataIndex: "frameTimestamp",
      key: "frameTimestamp",
      render: (text) => text || "-",
    },
    {
      title: "测量长度 (m)",
      dataIndex: "measuredLength",
      key: "measuredLength",
    },
    {
      title: "是否报警",
      dataIndex: "isAlarm",
      key: "isAlarm",
      render: (val) => {
        const isAlert = val === "true" || val === "是";
        return <Tag color={isAlert ? "red" : "green"}>{isAlert ? "报警" : "正常"}</Tag>;
      },
    },
    {
      title: "结果图",
      key: "action",
      render: (_, row) => (
        <Button
          size="small"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => onViewImage(row.resultImageUrl)}
          disabled={!row.resultImageUrl}
        >
          查看
        </Button>
      ),
    },
  ];

  const getResultClassName = () => {
    if (record.predictionResult === "预测失败") return styles.resultFailed;
    if (record.predictionResult === "触发报警") return styles.resultWarning;
    return styles.resultSuccess;
  };

  return (
    <div className={styles.detailContainer}>
      <Descriptions title="预测任务概览" size="small" column={2} bordered>
        <Descriptions.Item label="原始文件名">{record.originalFilename}</Descriptions.Item>
        <Descriptions.Item label="预测时间">{record.creationTime}</Descriptions.Item>
        <Descriptions.Item label="任务状态">
          <Tag
            color={
              record.taskStatus === "COMPLETED"
                ? "blue"
                : record.taskStatus === "FAILED"
                  ? "red"
                  : "orange"
            }
          >
            {record.taskStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="总体结果">
          {record.predictionResult ? (
            <span className={getResultClassName()}>{record.predictionResult}</span>
          ) : (
            "-"
          )}
        </Descriptions.Item>
      </Descriptions>

      <div className={styles.eventDetailSection}>
        <h4 className={styles.eventDetailTitle}>事件详情列表 ({record.events?.length || 0})</h4>
        <Table
          rowKey={(row) => row.frameTimestamp || Math.random().toString()}
          columns={columns}
          dataSource={record.events || []}
          pagination={false}
          size="small"
          bordered
        />
      </div>
    </div>
  );
};

export default PredictionDetail;
