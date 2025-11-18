import React, { useState } from "react";
import { Table, Button, Modal, Tag, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "@/styles/Modules.module.scss";

// 定义预测日志的数据结构
interface PredictionDataType {
  key: string;
  id: string;
  timestamp: string;
  modelName: string;
  result: string;
  confidence: number;
  imageUrl: string; // 预测的快照图片
}

// 模拟后端的预测数据
const mockPredictionData: PredictionDataType[] = [
  {
    key: "1",
    id: "PRED-20251118-001",
    timestamp: "2025-11-18 14:05:12",
    modelName: "VisionMark-V3.1",
    result: "异常-烟雾",
    confidence: 99.2,
    imageUrl: "https://via.placeholder.com/800x600.png/000000/FFFFFF/?text=Smoke+Detected",
  },
  {
    key: "2",
    id: "PRED-20251118-002",
    timestamp: "2025-11-18 14:05:08",
    modelName: "GuardNet-V1.5",
    result: "正常",
    confidence: 97.5,
    imageUrl: "https://via.placeholder.com/800x600.png/000000/FFFFFF/?text=Normal+Scene",
  },
  {
    key: "3",
    id: "PRED-20251118-003",
    timestamp: "2025-11-18 14:04:55",
    modelName: "VisionMark-V3.1",
    result: "异常-人影",
    confidence: 85.1,
    imageUrl: "https://via.placeholder.com/800x600.png/000000/FFFFFF/?text=Intruder+Shadow",
  },
  {
    key: "4",
    id: "PRED-20251118-004",
    timestamp: "2025-11-18 14:04:50",
    modelName: "GuardNet-V1.5",
    result: "正常",
    confidence: 99.8,
    imageUrl: "https://via.placeholder.com/800x600.png/000000/FFFFFF/?text=Normal+Scene",
  },
];

const PredictionLogModule: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<PredictionDataType | null>(null);

  const showDetails = (record: PredictionDataType) => {
    setSelectedLog(record);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<PredictionDataType> = [
    { title: "预测ID", dataIndex: "id", key: "id", width: 220 },
    { title: "时间戳", dataIndex: "timestamp", key: "timestamp", width: 180 },
    { title: "模型名称", dataIndex: "modelName", key: "modelName", width: 150 },
    {
      title: "预测结果",
      dataIndex: "result",
      key: "result",
      render: (result: string) => (
        <Tag color={result.includes("异常") ? "red" : "cyan"}>{result}</Tag>
      ),
    },
    {
      title: "置信度",
      dataIndex: "confidence",
      key: "confidence",
      render: (confidence: number) => {
        const color = confidence > 95 ? "volcano" : confidence > 80 ? "orange" : "green";
        return <Tag color={color}>{confidence.toFixed(1)}%</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => showDetails(record)}>
          查看快照
        </Button>
      ),
    },
  ];

  return (
    <div
      className={styles.moduleContainer}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <h2
        style={{
          padding: "1.5rem 2rem",
          margin: 0,
          borderBottom: "1px solid rgba(0, 221, 255, 0.3)",
        }}
      >
        预测日志模块
      </h2>
      <Table
        columns={columns}
        dataSource={mockPredictionData}
        style={{ flex: 1, overflow: "hidden" }}
        scroll={{ y: "100%" }}
      />
      <Modal
        title={`预测详情 - ${selectedLog?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={850}
      >
        {selectedLog && (
          <div>
            <p>
              <strong>时间:</strong> {selectedLog.timestamp}
            </p>
            <p>
              <strong>模型:</strong> {selectedLog.modelName}
            </p>
            <p>
              <strong>结果:</strong> {selectedLog.result} (置信度:{" "}
              {selectedLog.confidence.toFixed(1)}%)
            </p>
            <Image width="100%" src={selectedLog.imageUrl} alt="预测快照" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PredictionLogModule;
