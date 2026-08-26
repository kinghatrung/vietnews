<img src="vietnews.png" alt="Trọ Ơi Banner" width="100%" />

# 🚀 News Website with AI Content Moderation

Dự án xây dựng một **website tin tức** với kiến trúc tách biệt **Frontend (ReactJS)**, **Backend (ExpressJS)** và **Machine Learning (Flask/Python)** để kiểm duyệt nội dung tự động.

## 📂 Cấu trúc dự án

```
project-root/
│── Client/           # ReactJS (UI/UX)
│── Server/            # ExpressJS (API & Services)
│── Machine Learning/         # Machine Learning model (Flask / FastAPI)
│── README.md           # Tài liệu dự án
```

---

## ✨ Tính năng chính

### 👥 Vai trò người dùng

- **Người dùng**: Đọc tin tức, tìm kiếm, bình luận.
- **Phóng viên**: Đăng bài viết, quản lý nội dung cá nhân.
- **Biên tập viên**: Kiểm duyệt, chỉnh sửa bài viết, sử dụng AI để phát hiện từ ngữ toxic/tiêu cực.
- **Người kiểm duyệt**: Kiểm duyệt toàn bộ nội dung mà người dùng bình luận.
- **Tổng biên tập viên**: Quản lý toàn bộ hệ thống, tài khoản, phân quyền.

### 🖥️ Frontend (ReactJS)

- SPA với **React Router v6**.
- Quản lý layout theo vai trò (**DefaultLayout, AdminLayout, EditorLayout...**).
- Ant Design UI + TailwindCSS cho giao diện.
- Axios để gọi API.
- State management bằng Context API (hoặc Redux Toolkit nếu mở rộng).

### ⚙️ Backend (ExpressJS)

- Kiến trúc **MVC + Service Layer** rõ ràng.
- **Authentication & Authorization**: JWT (accessToken, refreshToken) lưu bằng HttpOnly Cookie.
- RESTful API cho quản lý Users, Posts, Comments, Roles...
- Tích hợp **AI Service** (ML model) qua HTTP request.

### 🤖 Machine Learning

- Mô hình **SVM** phát hiện từ ngữ toxic/tiêu cực.
- Được train từ file `train.txt`.
- Deploy bằng **Flask API**.
- Backend gọi tới Flask để kiểm duyệt nội dung trước khi lưu.

---

## 🔧 Công nghệ sử dụng

- **Frontend**: ReactJS, React Router, Ant Design, TailwindCSS, Axios.
- **Backend**: Node.js, ExpressJS, MongoDB (hoặc PostgreSQL/MySQL tuỳ chọn), JWT.
- **Machine Learning**: Python, Flask, scikit-learn, Pandas, Numpy.
- **Dev Tools**: ESLint, Prettier, Husky, Lint-staged.
- **Triển khai (Deployment)**: Railway / Vercel (Frontend), Render / Railway (Backend), PythonAnywhere / Docker (ML).

---

## 🚀 Cài đặt & Chạy dự án

### 1️⃣ Clone dự án

```bash
git clone https://github.com/kinghatrung/vietnews.git
cd vietnews
```

### 2️⃣ Frontend (ReactJS)

```bash
cd Client
npm install
npm run dev   # hoặc npm start
```

Truy cập: [http://localhost:5173]

### 3️⃣ Backend (ExpressJS)

```bash
cd Server
npm install
npm start   # hoặc npm start
```

API chạy tại: [http://localhost:1302]

### 4️⃣ Machine Learning Service (Flask)

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

ML API chạy tại: [http://localhost:8000](http://localhost:8000)

---

## 🔗 Tích hợp AI kiểm duyệt nội dung

- **Bước 1**: Người dùng nhập bài viết/bình luận.
- **Bước 2**: Backend gửi nội dung → ML API.
- **Bước 3**: ML model phân loại toxic / clean.
- **Bước 4**: Backend quyết định lưu hay từ chối nội dung.
- **Bước 5**: Trả kết quả về frontend.

---

## 📖 Scripts hữu ích

- **Frontend**

  - `npm run dev` → Chạy dev server
  - `npm run build` → Build production

- **Backend**

  - `npm run dev` → Chạy server với nodemon
  - `npm run lint` → Kiểm tra code style

- **ML Service**
  - `python app.py` → Chạy Flask server
  - `jupyter notebook` → Train model

---

## 🛠️ Đóng góp

1. Fork repo
2. Tạo branch mới `feature/ten-tinh-nang`
3. Commit thay đổi `git commit -m "Add new feature"`
4. Push branch `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## 👨‍💻 Nhóm phát triển

- **Frontend**: ReactJS team
- **Backend**: ExpressJS team
- **AI/ML**: Data Science team
- **Project Leader**: ...

---

## 📜 License

MIT License © 2025
