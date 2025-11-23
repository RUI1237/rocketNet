// src/pages/PredictionLogModule.tsx

import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Empty, Image } from "antd";
import { DownOutlined, UpOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

// 引入您的 Store (假设您已经创建了 usePredictionStore)
import { usePredictionStore } from "@/stores";
// 引入类型定义
import type { PredictionLogType } from "@/types";

// 引入样式 (沿用之前的或创建新的)
import styles from "@/styles/Log.module.scss";

// 引入子组件 (用于展示 events 列表)
import PredictionDetail from "./PredictionDetail";

const PredictionLogModule: React.FC = () => {
  // ----------------------------------------------------------------
  // 1. Store 状态获取
  // ----------------------------------------------------------------
  const {
    logs, // 对应 PredictionLogType[]
    total, // 总条数
    isLoading,
    fetchLogs, // 获取列表 API
    fetchLogDetail, // 获取详情 API (用于填充 events)
  } = usePredictionStore();

  // ----------------------------------------------------------------
  // 2. 本地 UI 状态
  // ----------------------------------------------------------------
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  // 分页参数状态
  const [tableParams, setTableParams] = useState({
    page: 1,
    pageSize: 10,
  });

  // 图片查看相关状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // ----------------------------------------------------------------
  // 3. 生命周期与交互逻辑
  // ----------------------------------------------------------------

  // 初始化加载
  useEffect(() => {
    fetchLogs(tableParams);
  }, []);

  // 处理表格翻页
  const handleTableChange = async (pagination: TablePaginationConfig) => {
    const newPage = pagination.current || 1;
    const newPageSize = pagination.pageSize || 10;

    setTableParams({
      page: newPage,
      pageSize: newPageSize,
    });

    await fetchLogs({
      page: newPage,
      pageSize: newPageSize,
    });
  };

  // 手动刷新
  const handleRefresh = async () => {
    // 刷新时清空展开项，防止数据重新加载后展开状态不一致
    setExpandedRowKeys([]);
    await fetchLogs(tableParams);
  };

  // 处理展开/收起 (手风琴模式：一次只展开一行)
  const toggleExpand = async (id: number) => {
    if (expandedRowKeys.includes(id)) {
      setExpandedRowKeys([]);
    } else {
      // 接口描述提到：列表查询时 events 可能为空，点击详情查询时该字段会有数据
      // 因此展开前必须调用详情接口
      await fetchLogDetail(id);
      setExpandedRowKeys([id]);
    }
  };

  // 点击查看图片 (传递给子组件的回调)
  const onViewImage = (url: string) => {
    if (!url) return;
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  // ----------------------------------------------------------------
  // 4. 表格列定义 (适配 PredictionLogType)
  // ----------------------------------------------------------------
  const columns: ColumnsType<PredictionLogType> = [
    {
      title: "任务 ID",
      dataIndex: "taskId",
      key: "taskId",
      width: "15%",
      ellipsis: true, // 如果ID太长则省略
    },
    {
      title: "原始文件名",
      dataIndex: "originalFilename",
      key: "originalFilename",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "预测时间",
      dataIndex: "creationTime",
      key: "creationTime",
      width: "18%",
    },
    {
      title: "任务状态",
      dataIndex: "taskStatus",
      key: "taskStatus",
      width: "12%",
      render: (status: string) => {
        let color = "default";
        let text = status;

        switch (status) {
          case "COMPLETED":
            color = "success";
            text = "已完成";
            break;
          case "PROCESSING":
            color = "processing";
            text = "进行中";
            break;
          case "FAILED":
            color = "error";
            text = "失败";
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "预测结果",
      dataIndex: "predictionResult",
      key: "predictionResult",
      width: "10%",
      render: (result: string) => {
        // 假设结果是 "正常" 或 "异常"
        const isAbnormal = result === "异常" || result === "Abnormal";
        const color = isAbnormal ? "volcano" : "green";
        return result ? <Tag color={color}>{result}</Tag> : "-";
      },
    },
    {
      title: "操作",
      key: "action",
      width: "15%",
      render: (_, record) => {
        const isExpanded = expandedRowKeys.includes(record.id);
        const canExpand = record.taskStatus === "COMPLETED"; // 只有完成的任务才有详情可看

        return (
          <span>
            <Button
              type="link"
              onClick={async () => await toggleExpand(record.id)}
              disabled={!canExpand}
            >
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
          </span>
        );
      },
    },
  ];

  // ----------------------------------------------------------------
  // 5. 渲染视图
  // ----------------------------------------------------------------
  return (
    <div
      className={styles.moduleContainer}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // 确保容器高度
      }}
    >
      {/* --- 头部区域 --- */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <h2 style={{ margin: 0 }}>预测日志管理</h2>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
        >
          刷新列表
        </Button>
      </div>

      {/* --- 表格区域 --- */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={logs}
          loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: tableParams.page,
            pageSize: tableParams.pageSize,
            total: total,
            showTotal: (total) => `共 ${total} 条记录`,
            showSizeChanger: true,
            position: ["topRight"],
          }}
          scroll={{ y: "calc(100vh - 280px)" }}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: async (_, record) => {
              if (record.taskStatus === "COMPLETED") {
                await toggleExpand(record.id);
              }
            },
            expandIconColumnIndex: -1, // 隐藏默认 + 号
            expandedRowRender: (record) => (
              // 传递 events 数据和看图回调给子组件
              <PredictionDetail events={record.events || []} onViewImage={onViewImage} />
            ),
          }}
          locale={{
            emptyText: (
              <div
                style={{
                  height: "100%",
                  minHeight: "400px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Empty description="暂无预测记录" />
              </div>
            ),
          }}
        />
      </div>

      {/* --- 图片预览组件 (全局单例模式) --- */}
      <Image
        width={200}
        style={{ display: "none" }}
        src={previewImage}
        preview={{
          visible: previewVisible,
          src: previewImage,
          onVisibleChange: (value) => {
            setPreviewVisible(value);
            if (!value) setPreviewImage("");
          },
        }}
      />
    </div>
  );
};

export default PredictionLogModule;
