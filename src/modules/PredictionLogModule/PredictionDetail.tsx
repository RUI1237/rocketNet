import React from "react";
import { Table, Button, Tag, Descriptions } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { PredictionLogType, PredictionEvent } from "@/types"; // 确保引入了父类型
import type { ColumnsType } from "antd/es/table";
import styles from "@/styles/Log.module.scss";

interface PredictionDetailProps {
  record: PredictionLogType; // 修改这里：接收整个记录对象，不仅仅是 events 数组
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
            <span
              style={{
                color: record.predictionResult === "异常" ? "#cf1322" : "#389e0d",
                fontWeight: "bold",
              }}
            >
              {record.predictionResult}
            </span>
          ) : (
            "-"
          )}
        </Descriptions.Item>
      </Descriptions>

      {/* 2. 下方展示事件列表 (这是 Prediction 特有的嵌套结构) */}
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ marginBottom: "10px", fontSize: "14px", fontWeight: "bold" }}>
          事件详情列表 ({record.events?.length || 0})
        </h4>
        <Table
          rowKey={(row) => row.frameTimestamp || Math.random()}
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
