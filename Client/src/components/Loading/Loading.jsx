import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Loading = React.memo(function Loading() {
  return (
    <div className="fixed inset-0 z-[99999999999999999999999] bg-white/30 flex items-center justify-center">
      <Spin
        indicator={
          <LoadingOutlined
            spin
            style={{
              fontSize: 100,
              color: "#999",
            }}
          />
        }
      />
    </div>
  );
});

export default Loading;
