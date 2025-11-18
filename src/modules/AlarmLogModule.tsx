import React, { useState } from "react";
import { Table, Button, Modal, Tag, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "@/styles/Modules.module.scss";

interface DataType {
  key: string;
  id: string;
  timestamp: string;
  type: string;
  status: "unprocessed" | "processed";
  details: string;
}

// 模拟后端数据
const mockData: DataType[] = [
  {
    key: "1",
    id: "LOG-001",
    timestamp: "2025-11-18 10:30:05",
    type: "非法入侵",
    status: "unprocessed",
    details: "在A区域检测到未授权人员活动，持续时间5秒。",
  },
  {
    key: "2",
    id: "LOG-002",
    timestamp: "2025-11-18 09:15:21",
    type: "设备故障",
    status: "processed",
    details: "摄像头C-102信号丢失，已于09:20:00恢复。",
  },
  {
    key: "3",
    id: "LOG-003",
    timestamp: "2025-11-18 11:45:10",
    type: "烟雾警报",
    status: "unprocessed",
    details: "仓库B检测到烟雾浓度异常。",
  },
];

const AlarmLogModule: React.FC = () => {
  const [logs, setLogs] = useState<DataType[]>(mockData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<DataType | null>(null);

  const showDetails = (record: DataType) => {
    setSelectedLog(record);
    setIsModalVisible(true);
  };

  const handleProcessAlarm = (key: string) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) => (log.key === key ? { ...log, status: "processed" } : log))
    );
    message.success(`日志 ${key} 已处理!`);
  };

  const columns: ColumnsType<DataType> = [
    { title: "日志ID", dataIndex: "id", key: "id" },
    { title: "时间", dataIndex: "timestamp", key: "timestamp" },
    { title: "报警类型", dataIndex: "type", key: "type" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "unprocessed" ? "volcano" : "green"}>
          {status === "unprocessed" ? "未处理" : "已处理"}
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => showDetails(record)}>
            详情
          </Button>
          {record.status === "unprocessed" && (
            <Popconfirm
              title="确认处理此报警?"
              onConfirm={() => handleProcessAlarm(record.key)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" danger>
                处理
              </Button>
            </Popconfirm>
          )}
        </span>
      ),
    },
  ];

  return (
    <div
      className={styles.moduleContainer}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <h2>报警日志模块</h2>
      <Table
        columns={columns}
        dataSource={logs}
        style={{ height: "100%", padding: "0 50px 0 20px" }}
        pagination={{ position: ["topRight"] }}
      />
      <Modal
        title={`日志详情 - ${selectedLog?.id}`}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <p>
          <strong>时间:</strong> {selectedLog?.timestamp}
        </p>
        <p>
          <strong>类型:</strong> {selectedLog?.type}
        </p>
        <p>
          <strong>状态:</strong> {selectedLog?.status === "unprocessed" ? "未处理" : "已处理"}
        </p>
        <p>
          <strong>详细信息:</strong> {selectedLog?.details}
        </p>
      </Modal>
    </div>
  );
};

export default AlarmLogModule;
