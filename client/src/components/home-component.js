import React from "react";

function homeComponent() {
  return (
    <main>
      <div className="container py-4">
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">Monitor System</h1>
            <p className="col-md-8 fs-4">
              Window
              監控系統,請先在監看的主機上安裝agent,agent會固定發送截圖到s3並且傳送心跳至nacos，若無心跳則會於頁面告警
            </p>
          </div>
        </div>

        <div className="row align-items-md-stretch">
          <div className="col-md-6">
            <div className="h-100 p-5 text-white bg-dark rounded-3">
              <h2>Admin 權限</h2>
              <p>提供操作新增機器及新增用戶功能</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="h-100 p-5 bg-light border rounded-3">
              <h2>Readonly 權限</h2>
              <p>僅可觀看監控，不具其他操作權限</p>
            </div>
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; 2022 Darren Lin
        </footer>
      </div>
    </main>
  );
}

export default homeComponent;
