# Fit Helper Tutorial

這份文件是給學生的入門導覽，目標是先看懂現有架構，再沿用同一套分層方式往下開發。

## 1. 專案定位

Fit Helper 是一個以健身訓練紀錄為主題的 Next.js App Router 專案。
目前已經提供：

- 基本路由與頁面容器
- UI 元件範例
- domain 層的型別與狀態管理（Zustand）
- MUI 主題設定

## 2. 目錄導覽

### app/

用途：App Router 路徑與頁面入口。

- app/layout.tsx
  - 全域 Root Layout
  - 設定 html lang 為 zh-Hant-TW
  - 注入 MUI ThemeProvider 與 App Router cache provider
- app/(main)/layout.tsx
  - main route group 的 layout（目前是 pass-through）
- app/(main)/page.tsx
  - 目前首頁
  - 掛載 DemoSection 與 DemoCategoriesDisplay，示範如何組合 UI 與 domain store

### components/

用途：可重用的 UI 元件存放區。

- components/Demo/DemoSection.tsx
  - 用 Paper + Typography + Divider 封裝展示區塊
- components/Demo/DemoCategoriesDisplay.tsx
  - 從 categories store 讀資料
  - 點卡片會呼叫 updateCategoryDisplay 切換 display
  - 資料尚未 rehydrate 時顯示 skeleton
- components/NextLink/NextLink.tsx
  - 封裝 Next.js Link（目前是薄包裝）

### domain/

用途：依資源切分的業務邏輯層。

目前有三個資源：

- domain/category/
  - schema.ts：Category 型別
  - store.ts：categories 狀態與更新行為（含 persist、rehydrate 預設分類）
- domain/record/
  - schema.ts：Record、SetRecord、RestRecord 型別
  - store.ts：歷史紀錄 CRUD 與局部更新
- domain/currentRecord/
  - store.ts：進行中的訓練流程（start、add/update set/rest、commit、discard）

### style/

用途：視覺主題。

- style/theme.ts
  - 建立 MUI theme
  - 設定字體使用 Root Layout 注入的 Roboto 變數

### public/

用途：靜態資源（圖片、icon、manifest 等）。
目前資料夾存在但尚未放置內容，後續可按功能加入。

## 3. domain 分層慣例（本專案的重點）

在這個專案中，domain 採資源導向切分，每個資源可以逐步擴充出下列模組：

- type/schema：定義資料形狀與型別
- store/context：管理狀態與狀態更新
- provider：跨元件注入情境資料
- utils：純函式與格式轉換
- apis：和後端或外部服務溝通
- hooks：封裝可重用的邏輯

注意：目前程式碼已經實作的是 schema + store；provider、utils、apis、hooks 是下一步擴充方向。

## 4. 狀態管理實作重點

目前 store 主要使用 Zustand，搭配：

- persist middleware：將資料存到 localStorage
- immer middleware：用可讀性較高的方式做 immutable update

你會在 category、record、currentRecord 三個 store 看見一致風格的 action 設計，這是後續新增資源時可以直接複製的模式。

## 5. 建議的開發起手式

### Step 1: 啟動專案

```bash
npm run dev
```

### Step 2: 從首頁觀察資料流

先看 app/(main)/page.tsx 如何掛載 Demo 元件，再追到 DemoCategoriesDisplay 觀察：

- 如何讀取 useCategoriesStore
- 如何透過 updateCategoryDisplay 改變狀態

### Step 3: 以「新增一個資源」練習擴充

建議先新增一個新資源資料夾（例如 exercise 或 timer），先做最小可行版本：

1. 建立 schema.ts 定義型別
2. 建立 store.ts 寫最少 action
3. 在頁面掛一個簡單展示元件驗證互動

## 6. 推薦延伸練習

- 練習 1：在 app/(main) 下新增路由頁面，將單一功能拆成獨立頁
- 練習 2：在 domain/currentRecord/store.ts 加一個 action（例如重排序 sets）
- 練習 3：為某個 domain 資源補上 hooks 與 apis，將 UI 與 store 操作解耦

## 7. 你應該先記住的事

- app 負責路由與頁面入口
- components 負責可重用 UI
- domain 負責資料模型與業務邏輯
- 先延用既有 pattern，再做擴充，比重寫結構更重要

---

如果你是第一次加入這個專案，建議先完整走一次：

首頁顯示 -> 點擊分類改變狀態 -> 追到 store action -> 回到 UI 驗證結果。

只要這條線走通，後續新增功能就會很順。
