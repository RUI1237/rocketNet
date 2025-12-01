import React from "react";
import { Spin, Typography, Modal } from "antd";
import type { DataAnalysisLatestAlarmSnapshot } from "@/types";
import { DataAnalysisStyles as styles } from "@/styles";

const { Text } = Typography;

export interface LatestAlarmsWallProps {
  latestAlarms: DataAnalysisLatestAlarmSnapshot[];
  loading: boolean;
}

export const LatestAlarmsWall: React.FC<LatestAlarmsWallProps> = ({ latestAlarms, loading }) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className="title">最新报警事件快照</span>
          <span className="subTitle">点击图片查看高清大图</span>
        </div>
        {loading ? (
          <Spin tip="最新报警加载中..." />
        ) : latestAlarms.length ? (
          <div className={styles.latestAlarmsGrid}>
            {latestAlarms.map((item) => (
              <div
                className={styles.alarmCard}
                key={item.alarmId}
                onClick={() => setPreviewImage(item.imageUrl)}
              >
                <img src={item.imageUrl} alt={`alarm-${item.alarmId}`} />
                <div className={styles.alarmMeta}>
                  <div>尺寸：{item.measuredLength} m</div>
                  <div style={{ opacity: 0.8, fontSize: 10 }}>{item.alarmTime}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Text type="secondary">暂无最新报警记录</Text>
        )}
      </div>

      {/* 图片大图预览 Modal */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width={900}
        centered
      >
        {previewImage && (
          <img
            src={previewImage}
            alt="alarm-preview"
            style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
          />
        )}
      </Modal>
    </>
  );
};
