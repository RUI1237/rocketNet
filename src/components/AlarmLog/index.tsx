import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Modal, Image } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import { useAlarmStore } from "@/stores"; // 引入 Store
import type { AlarmLogType } from "@/types";
import styles from "@/styles/AlarmLog.module.scss"; // 引入样式

// 引入拆分出去的子组件
import AlarmDetail from "./AlarmDetail";
import ProcessModal from "./ProcessModal";

const AlarmLogModule: React.FC = () => {
  // 1. Store 状态
  const { logs, isLoading, fetchLogs, processAlarm } = useAlarmStore();

  // 2. 本地 UI 状态
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 图片查看相关状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // 初始化
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // --- 逻辑处理 ---

  // 切换行展开
  const toggleExpand = (key: string) => {
    const currentKeys = [...expandedRowKeys];
    const index = currentKeys.indexOf(key);
    if (index > -1) currentKeys.splice(index, 1);
    else currentKeys.push(key);
    setExpandedRowKeys(currentKeys);
  };

  // 打开处理弹窗
  const handleOpenProcess = (record: AlarmLogType) => {
    setProcessingId(record.logId);
    setProcessModalVisible(true);
  };

  // 提交处理
  const handleSubmitProcess = async (notes: string) => {
    if (processingId) {
      await processAlarm(processingId, notes);
      setProcessModalVisible(false);
      setProcessingId(null);
    }
  };

  // 查看图片 (由子组件调用)
  const handleViewImage = (url: string) => {
    // 这里处理一下本地路径问题，实际项目中后端应返回 http 地址
    // 这里只是为了演示，如果 url 包含 E:/ 则使用 fallback 图片
    const finalUrl = url.includes("E:/")
      ? "https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" // 演示用占位图
      : url;

    setPreviewImage(finalUrl);
    setPreviewVisible(true);
  };

  // --- 表格配置 ---

  const columns: ColumnsType<AlarmLogType> = [
    { title: "日志ID", dataIndex: "logId", key: "logId" },
    { title: "报警时间", dataIndex: "alarmTime", key: "alarmTime" },
    { title: "类型", dataIndex: "alarmType", key: "alarmType" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "已处理" ? "green" : "volcano"}>{status}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        const isExpanded = expandedRowKeys.includes(record.logId);
        return (
          <span>
            <Button type="link" onClick={() => toggleExpand(record.logId)}>
              {isExpanded ? (
                <span>
                  收起 <UpOutlined />
                </span>
              ) : (
                <span>
                  详情 <DownOutlined />
                </span>
              )}
            </Button>
            {record.status !== "已处理" && (
              <Button type="link" danger onClick={() => handleOpenProcess(record)}>
                处理
              </Button>
            )}
          </span>
        );
      },
    },
  ];

  return (
    <div className={styles.moduleContainer}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h2>报警日志管理</h2>
        <Button type="primary" onClick={() => fetchLogs()} loading={isLoading}>
          刷新列表
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="logId"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => toggleExpand(record.logId),
          expandIconColumnIndex: -1, // 隐藏默认+号
          // 渲染拆分出去的子组件
          expandedRowRender: (record) => (
            <AlarmDetail record={record} onViewImage={handleViewImage} />
          ),
        }}
      />

      {/* 处理填写备注的弹窗组件 */}
      <ProcessModal
        visible={processModalVisible}
        onSubmit={handleSubmitProcess}
        onCancel={() => setProcessModalVisible(false)}
      />

      {/* 图片查看弹窗 (Antd 自带 Image 预览功能) */}
      <Image
        width={0}
        height={0}
        src={previewImage}
        style={{ display: "none" }} // 隐藏实际 DOM
        preview={{
          visible: previewVisible,
          src: previewImage,
          onVisibleChange: (value) => {
            setPreviewVisible(value);
          },
        }}
      />
    </div>
  );
};

export default AlarmLogModule;
