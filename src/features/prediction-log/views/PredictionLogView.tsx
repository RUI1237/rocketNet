import React, { Suspense, useState } from "react";
import { useLoaderData, Await, useRevalidator, useSearchParams } from "react-router-dom";
import { Table, Button, Tag, Empty, Image, Spin } from "antd";
import { DownOutlined, UpOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { predictionService } from "../services/prediction.service";
import type { PredictionLogType, PredictionLogRespond } from "../types/prediction.types";
import styles from "@/features/alarm-log/styles/Log.module.scss";
import PredictionDetail from "../components/PredictionDetail";
import type { predictionLogLoader } from "../loader/predictionLogLoader";

const SectionLoading = () => (
  <div style={{ padding: 50, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Spin tip="加载数据中...">
      <div style={{ padding: 50, background: "transparent" }} />
    </Spin>
  </div>
);

const PredictionLogView: React.FC = () => {
  const { logs, page, pageSize } = useLoaderData() as ReturnType<typeof predictionLogLoader>;
  const [_, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();

  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [detailCache, setDetailCache] = useState<Record<number, PredictionLogType>>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newPage = pagination.current || 1;
    const newPageSize = pagination.pageSize || 10;

    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      prev.set("pageSize", String(newPageSize));
      return prev;
    });
  };

  const handleRefresh = () => {
    setExpandedRowKeys([]);
    setDetailCache({});
    revalidator.revalidate();
  };

  const toggleExpand = async (id: number) => {
    if (expandedRowKeys.includes(id)) {
      setExpandedRowKeys([]);
    } else {
      if (!detailCache[id]) {
        const detail = await predictionService.fetchLogDetail(id);
        setDetailCache((prev) => ({ ...prev, [id]: detail }));
      }
      setExpandedRowKeys([id]);
    }
  };

  const onViewImage = (url: string) => {
    if (!url) return;
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const columns: ColumnsType<PredictionLogType> = [
    { title: "任务 ID", dataIndex: "id", key: "id", width: "15%", ellipsis: true },
    {
      title: "原始文件名",
      dataIndex: "originalFilename",
      key: "originalFilename",
      width: "20%",
      ellipsis: true,
    },
    { title: "预测时间", dataIndex: "creationTime", key: "creationTime", width: "18%" },
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
        let color = "green";
        if (result === "预测失败") color = "red";
        else if (result === "触发报警") color = "orange";
        return result ? <Tag color={color}>{result}</Tag> : "-";
      },
    },
    {
      title: "操作",
      key: "action",
      width: "15%",
      render: (_, record) => {
        const isExpanded = expandedRowKeys.includes(record.id);
        const canExpand = record.taskStatus === "COMPLETED";
        return (
          <Button type="link" onClick={() => toggleExpand(record.id)} disabled={!canExpand}>
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
        );
      },
    },
  ];

  const renderTable = (data: PredictionLogRespond) => {
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data.records}
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: data.total,
          showSizeChanger: true,
          position: ["topRight"],
        }}
        scroll={{ y: "calc(100vh - 390px)" }}
        expandable={{
          expandedRowKeys,
          expandIconColumnIndex: -1,
          expandedRowRender: (record) => (
            <PredictionDetail record={detailCache[record.id] || record} onViewImage={onViewImage} />
          ),
        }}
        locale={{
          emptyText: (
            <div className={styles.emptyState}>
              <Empty description="暂无预测记录" />
            </div>
          ),
        }}
      />
    );
  };

  return (
    <div className={styles.moduleContainer}>
      <div className={styles.headerArea}>
        <h2>预测日志管理</h2>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={revalidator.state === "loading"}
        >
          刷新列表
        </Button>
      </div>

      <div className={styles.tableArea}>
        <Suspense fallback={<SectionLoading />}>
          <Await resolve={logs} errorElement={<Empty description="数据加载失败" />}>
            {(data) => renderTable(data)}
          </Await>
        </Suspense>
      </div>

      {previewImage && (
        <Image
          width={200}
          className={styles.hiddenPreview}
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
      )}
    </div>
  );
};

export default PredictionLogView;
