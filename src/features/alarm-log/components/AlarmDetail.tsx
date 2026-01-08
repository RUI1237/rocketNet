import React from "react";
import { Descriptions, Button } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import type { AlarmLogType } from "../types/alarm.types";
import styles from "../styles/Log.module.scss";

interface AlarmDetailProps {
  record: AlarmLogType;
  onViewImage: (imageUrl: string) => void; // 回调函数
}

const AlarmDetail: React.FC<AlarmDetailProps> = ({ record, onViewImage }) => {
  return (
    <div className={styles.detailContainer}>
      <Descriptions title="详细监测数据" size="small" column={2} bordered>
        <Descriptions.Item label="原始文件名">{record.originalFilename}</Descriptions.Item>

        {/* 仅当已处理时显示处理信息 */}
        {record.status === "已处理" && (
          <>
            <Descriptions.Item label="处理人">{record.acknowledgedBy}</Descriptions.Item>
            <Descriptions.Item label="处理时间">{record.acknowledgedTime}</Descriptions.Item>
            <Descriptions.Item label="备注信息">
              <span style={{ color: "#cf1322" }}>{record.notes}</span>
            </Descriptions.Item>
          </>
        )}
        <Descriptions.Item label="查看图片">
          <Button
            type="primary"
            ghost
            icon={<FileImageOutlined />}
            onClick={() => onViewImage(record.resultImageUrl)}
          >
            查看现场结果图
          </Button>
          <span style={{ marginLeft: 10, color: "#999", fontSize: 12 }}>
            结果图路径: {record.resultImageUrl}
          </span>
        </Descriptions.Item>
      </Descriptions>

      {/* 图片查看按钮放在最后 */}
    </div>
  );
};

export default AlarmDetail;
