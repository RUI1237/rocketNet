import React from "react";
import { Table, Button, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { PredictionEvent } from "@/types";
import type { ColumnsType } from "antd/es/table";

interface Props {
  events: PredictionEvent[];
  onViewImage: (url: string) => void;
}

const PredictionDetail: React.FC<Props> = ({ events, onViewImage }) => {
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
        // 处理字符串 "true"/"false" 或 "是"/"否"
        const isAlert = val === "true" || val === "是";
        return <Tag color={isAlert ? "red" : "green"}>{isAlert ? "报警" : "正常"}</Tag>;
      },
    },
    {
      title: "结果图",
      key: "action",
      render: (_, record) => (
        <Button
          size="small"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => onViewImage(record.resultImageUrl)}
          disabled={!record.resultImageUrl}
        >
          查看图片
        </Button>
      ),
    },
  ];

  return (
    <div style={{ margin: "0 20px", padding: "10px", background: "#f9f9f9", borderRadius: "4px" }}>
      <h4 style={{ marginBottom: 10 }}>事件详情列表</h4>
      <Table
        rowKey={(record) => record.id || record.frameTimestamp || Math.random()}
        columns={columns}
        dataSource={events}
        pagination={false} // 详情通常不做内部分页，或者根据需求开启
        size="small"
        bordered
      />
    </div>
  );
};

export default PredictionDetail;
