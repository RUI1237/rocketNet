import React, { useState, useMemo } from "react";
import { Typography, Modal } from "antd";
import type { DataAnalysisLatestAlarmSnapshot } from "../types/dataAnalysis.types";
import styles from "../styles/DataAnalysis.module.scss";

const { Text } = Typography;

export interface LatestAlarmsWallProps {
  latestAlarms: DataAnalysisLatestAlarmSnapshot[];
}

export const LatestAlarmsWall: React.FC<LatestAlarmsWallProps> = ({ latestAlarms }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const previewAlarm = useMemo(
    () => latestAlarms.find((item) => item.imageUrl === previewImage),
    [latestAlarms, previewImage]
  );

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.title}>最新报警事件快照</span>
          <span className={styles.subTitle}>点击图片查看高清大图</span>
        </div>

        {latestAlarms.length ? (
          <div
            className={styles.latestAlarmsGrid}
            style={{
              overflowY: "hidden",
              // maxHeight: "90%",
            }}
          >
            {latestAlarms.slice(0, 6).map((item) => (
              <div
                key={item.alarmId}
                className={styles.alarmCard}
                onClick={() => setPreviewImage(item.imageUrl)}
              >
                {item.imageUrl && <img src={item.imageUrl} alt={`alarm-${item.alarmId}`} />}

                <div className={styles.alarmMeta}>
                  <div className={styles.metaValue}>
                    {item.measuredLength} <span>m</span>
                  </div>
                  <div className={styles.metaTime}>{item.alarmTime.split(" ")[1]}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Text type="secondary" style={{ color: "white" }}>
            暂无最新报警记录
          </Text>
        )}
      </div>

      {/* --- Modal 弹窗 --- */}
      <Modal
        open={!!previewImage}
        footer={null}
        closable={false}
        centered
        width="auto"
        styles={{
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.92)",
            backdropFilter: "blur(5px)",
          },
          content: {
            padding: 0,
            background: "transparent",
            boxShadow: "none",
            transform: "scale(1.5)",
            transformOrigin: "center center",
          },
          body: {
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        onCancel={() => setPreviewImage(null)}
      >
        <div className={styles.modalContent}>
          {/* 左侧：大图 */}
          <div className={styles.modalImageArea}>
            {previewImage && <img src={previewImage} alt="Preview" />}
          </div>

          {/* 右侧：详情信息 */}
          {previewAlarm && (
            <div className={styles.modalInfoArea}>
              <div>
                <div className={styles.label}>DETECTED SIZE</div>
                <div className={styles.valueRow}>
                  <span className={styles.valueText}>{previewAlarm.measuredLength}</span>
                  <span className={styles.unitText}>m</span>
                </div>

                <div className={styles.label}>TIMESTAMP</div>
                <div className={styles.timeText}>{previewAlarm.alarmTime}</div>
              </div>
            </div>
          )}

          {/* 关闭按钮 */}
          <div className={styles.closeBtn} onClick={() => setPreviewImage(null)} title="关闭">
            ×
          </div>
        </div>
      </Modal>
    </>
  );
};
