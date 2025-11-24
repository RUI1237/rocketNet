import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Empty, Image } from "antd";
import { DownOutlined, UpOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

// 引入您的 Store 和类型
import { useAlarmStore } from "@/stores";
import type { AlarmLogType, QuaryLogs } from "@/types";

// 引入样式
import styles from "@/styles/Log.module.scss";

// 引入子组件 (假设您已经有了)
import AlarmDetail from "./AlarmDetail";
import ProcessModal from "./ProcessModal";

const AlarmLogModule: React.FC = () => {
  const {
    logs, // 当前页的数据列表 (例如 10 条)
    total, // 数据库总条数 (例如 500 条)
    isLoading,
    fetchLogs,
    processAlarm,
    fetchLogDetail,
  } = useAlarmStore();

  // ----------------------------------------------------------------
  // 2. 本地 UI 状态
  // ----------------------------------------------------------------
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  // 分页参数状态
  const [tableParams, setTableParams] = useState<QuaryLogs>({
    page: 1,
    pageSize: 10,
  });

  // 处理弹窗状态 (预留)
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [processingId, setProcessingId] = useState<number>(-1);

  // 图片查看相关状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  // ----------------------------------------------------------------

  // 初始化加载：组件挂载时请求第一页数据
  useEffect(() => {
    fetchLogs(tableParams);
  }, []);

  // 核心：处理表格翻页
  const handleTableChange = async (pagination: TablePaginationConfig) => {
    const newPage = pagination.current || 1;
    const newPageSize = pagination.pageSize || 10;

    // 1. 更新本地分页状态 (为了 UI 高亮)
    setTableParams({
      page: newPage,
      pageSize: newPageSize,
    });

    // 2. 向后端请求对应页码的数据
    // 注意：后端需要返回该页的 list 以及 最新的 total
    await fetchLogs({
      page: newPage,
      pageSize: newPageSize,
    });
  };

  // 手动刷新
  const handleRefresh = async () => {
    await fetchLogs(tableParams);
  };

  // 处理展开/收起 (手风琴模式：一次只展开一行)
  const toggleExpand = async (id: number) => {
    if (expandedRowKeys.includes(id)) {
      setExpandedRowKeys([]);
    } else {
      // 如果未展开，先触发业务埋点/懒加载，再展开
      await fetchLogDetail(id);
      setExpandedRowKeys([id]);
    }
  };

  // 处理报警 (预留逻辑)
  const handleOpenProcess = (record: AlarmLogType) => {
    console.log("打开处理弹窗 ID:", record.id);
    setProcessingId(record.id);
    setProcessModalVisible(true);
  };

  const handleSubmitProcess = async (notes: string) => {
    if (processingId) {
      await processAlarm(processingId, notes);
      setProcessModalVisible(false);
      setProcessingId(-1);
      console.log("sshgdhs");
      await handleRefresh();
    }
  };

  const onViewImage = (url: string) => {
    if (!url) return; // 防止空 URL 报错
    setPreviewImage(url); // 设置当前要看的图片
    setPreviewVisible(true); // 打开预览弹窗
  };
  const columns: ColumnsType<AlarmLogType> = [
    {
      title: "日志ID",
      dataIndex: "logId",
      key: "logId",
      width: "15%", // 使用百分比宽度
    },
    {
      title: "报警时间",
      dataIndex: "alarmTime",
      key: "alarmTime",
      width: "20%",
    },
    {
      title: "类型",
      dataIndex: "alarmType",
      key: "alarmType",
      width: "15%",
    },
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
            <Button type="link" onClick={async () => await toggleExpand(record.id)}>
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
    <div
      className={styles.moduleContainer}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* --- 头部区域 (固定高度) --- */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0, // 防止头部被压缩
        }}
      >
        <h2 style={{ margin: 0 }}>报警日志管理</h2>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
        >
          刷新列表
        </Button>
      </div>

      {/* --- 表格区域 (自适应填充剩余高度) --- */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <Table
          rowKey="id" // 必须指定唯一键，且需与 toggleExpand 传的值一致
          columns={columns}
          dataSource={logs} // 只展示当前页的 10 条数据
          loading={isLoading}
          onChange={handleTableChange} // 监听翻页
          // 分页配置 (关键)
          pagination={{
            current: tableParams.page,
            pageSize: tableParams.pageSize,
            total: total, // 这里使用 Store 里的总数，而不是 logs.length
            // showTotal: (total) => `共 ${total} 条记录`,
            showSizeChanger: false,
            position: ["topRight"],
          }}
          scroll={{ y: "100%" }}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: async (_, record) => await toggleExpand(record.id),
            expandIconColumnIndex: -1, // 隐藏默认的 + 号图标，我们自定义了按钮
            expandedRowRender: (record) => <AlarmDetail {...{ record, onViewImage }} />,
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
                <Empty description="暂无报警记录" />
              </div>
            ),
          }}
        />
      </div>

      {/* --- 弹窗组件 (如果有) --- */}
      <ProcessModal
        visible={processModalVisible}
        onSubmit={handleSubmitProcess}
        onCancel={() => setProcessModalVisible(false)}
      />

      <Image
        width={200} // 宽高随意，因为 display: none 隐藏了
        style={{ display: "none" }} // 【关键】隐藏 DOM 元素，只留预览功能
        // 【关键错误修复】这里必须是字符串 URL，不能是 logs 数组
        // 当 previewImage 为空时，给一个空字符串即可
        src={previewImage}
        preview={{
          visible: previewVisible,
          src: previewImage, // 确保预览图也是这张
          onVisibleChange: (value) => {
            setPreviewVisible(value);
            // 关闭时可选：清空 URL
            if (!value) setPreviewImage("");
          },
        }}
      />
    </div>
  );
};

export default AlarmLogModule;
