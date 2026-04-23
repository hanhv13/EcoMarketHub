// ============================================================
// FILE: frontend/src/main.jsx
// CHỨC NĂNG: Điểm khởi động của toàn bộ React app
//            Gắn component App vào thẻ <div id="root"> trong index.html
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'  // CSS toàn cục

// ReactDOM.createRoot: tạo "gốc" React tại thẻ div#root
// .render(<App />): hiển thị component App vào đó
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode giúp phát hiện lỗi tiềm ẩn trong quá trình dev
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
