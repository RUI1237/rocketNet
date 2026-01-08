import React, { Suspense, useState } from "react";
import { useLoaderData, Await, useRevalidator, useSearchParams } from "react-router-dom";
import { Table, Button, Tag, Empty, Image, Spin } from "antd";
import { DownOutlined, UpOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { alarmService } from "../services/alarm.service";
import type { AlarmLogType, AlarmLogRespond } from "../types/alarm.types";
import styles from "../styles/Log.module.scss";
import AlarmDetail from "../components/AlarmDetail";
import ProcessModal from "../components/ProcessModal";
import type { alarmLogLoader } from "../loader/dataAnalysisLoader";

const SectionLoading = () => (
  <div style={{ padding: 50, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Spin tip="加载数据中...">
      <div style={{ padding: 50, background: "transparent" }} />
    </Spin>
  </div>
);

const AlarmLogView: React.FC = () => {
  const { logs, page, pageSize } = useLoaderData() as ReturnType<typeof alarmLogLoader>;
  const [_, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();

  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [detailCache, setDetailCache] = useState<Record<number, AlarmLogType>>({});
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [processingId, setProcessingId] = useState<number>(-1);
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
        const detail = await alarmService.fetchLogDetail(id);
        setDetailCache((prev) => ({ ...prev, [id]: detail }));
      }
      setExpandedRowKeys([id]);
    }
  };

  const handleOpenProcess = (record: AlarmLogType) => {
    setProcessingId(record.id);
    setProcessModalVisible(true);
  };

  const handleSubmitProcess = async (notes: string) => {
    if (processingId) {
      await alarmService.processAlarm(processingId, notes);
      setProcessModalVisible(false);
      setProcessingId(-1);
      handleRefresh();
    }
  };

  const onViewImage = (url: string) => {
    if (!url) return;
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const columns: ColumnsType<AlarmLogType> = [
    { title: "日志ID", dataIndex: "logId", key: "logId", width: "15%" },
    { title: "报警时间", dataIndex: "alarmTime", key: "alarmTime", width: "20%" },
    { title: "类型", dataIndex: "alarmType", key: "alarmType", width: "15%" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status) => <Tag color={status === "已处理" ? "green" : "volcano"}>{status}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      width: "20%",
      render: (_, record) => {
        const isExpanded = expandedRowKeys.includes(record.id);
        return (
          <span>
            <Button type="link" onClick={() => toggleExpand(record.id)}>
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

  const renderTable = (data: AlarmLogRespond) => {
    const currentData = data;
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={currentData.records}
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: currentData.total,
          showSizeChanger: true,
          position: ["topRight"],
        }}
        scroll={{ y: "calc(100vh - 390px)" }}
        expandable={{
          expandedRowKeys,
          expandIconColumnIndex: -1,
          expandedRowRender: (record) => (
            <AlarmDetail record={detailCache[record.id] || record} onViewImage={onViewImage} />
          ),
        }}
        locale={{
          emptyText: (
            <div className={styles.emptyState}>
              <Empty description="暂无报警记录" />
            </div>
          ),
        }}
      />
    );
  };

  return (
    <div className={styles.moduleContainer}>
      <div className={styles.headerArea}>
        <h2>报警日志管理</h2>
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

      <ProcessModal
        visible={processModalVisible}
        onSubmit={handleSubmitProcess}
        onCancel={() => setProcessModalVisible(false)}
      />

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

export default AlarmLogView;
