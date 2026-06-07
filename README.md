# Jessica Financial OS - Template

**Personal Treasury Dashboard** 教學範本

這是一個輕量級的個人財務儀表板，專注於「流動性安全」而非預算管理。

## 核心概念

- **Freedom Reserve（自由儲備金）** = 備用金 + 旅遊金 + 娛樂費
- **核心問題**：我這個月有沒有比上個月更安全？
- **Treasury 思維**：管理現金流動性，而非追蹤每筆消費

## 快速開始

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發環境
npm run dev

# 3. 打開瀏覽器
http://localhost:5173
```

## 自訂你的 Dashboard

### 1. 修改基礎數據

編輯 `src/types.ts`：

- `FIXED_COMMITMENTS` - 固定支出（房貸、租金、貸款等）
- `FIXED_ALLOCATIONS` - 固定配置（備用金、旅遊金等月度儲蓄）
- `MILESTONES` - Freedom Reserve 里程碑目標

### 2. 更新每月記錄

編輯 `data/records.json`：

```json
[
  {
    "id": "2026-05",
    "month": "2026/05",
    "income": 100000,        // 月收入
    "expense": 0,            // 月支出（可選）
    "reserveFund": 50000,    // 備用金
    "travelFund": 30000,     // 旅遊金
    "entertainFund": 20000,  // 娛樂費
    "insuranceFund": 15000,  // 保障基金
    "creditAccount": 5000,   // 信用帳戶
    "isBaseline": true,
    "note": "示例數據"
  }
]
```

### 3. 設定未來現金事件

編輯 `src/types.ts` 中的 `CASH_EVENTS` 陣列，加入你的：
- 保費支出
- 旅遊計劃
- 大額支出

### 4. 設定現金流入

編輯 `src/types.ts` 中的 `CASH_INFLOWS`，加入：
- 獎金
- 退稅
- 其他預期收入

## 部署到 GitHub Pages

1. Fork 或建立新 repo
2. 推送程式碼到 GitHub
3. 設定 Settings → Pages → Source 選 "GitHub Actions"
4. 推送到 main 分支會自動部署

每次更新數據只需：
```bash
git add data/records.json
git commit -m "Update June data"
git push
```

## Dashboard 結構

1. **Current Position** - 當前財務狀態
2. **Future Cash Events** - 未來現金支出計劃
3. **Funding Status** - 各項資金準備狀況
4. **Future Cash Inflows** - 預期現金流入
5. **Internal Balances** - 內部帳戶餘額
6. **Cash Peak Calendar** - 現金需求高峰月份
7. **October Forecast** - 特定月份預測（可自訂）

## 技術棧

- React + TypeScript
- Tailwind CSS
- Vite
- GitHub Pages

---

🤖 Generated with Claude Code  
💡 專注於流動性安全，而非預算追蹤
