# 文档格式、编号与变更协议（强制）

> DOC-RULES · v1.0 · 2026-10-26。所有后续新增和补写必须沿用既定格式；变更格式本身须先更新本文与对应模板。

## 1. 文件与职责

- 根目录**长期说明文件**以 `README.md`（入口/真实命令）与 `AGENTS.md`（Agent 执行约束）为核心；`.gitignore` 和 `tools/` 等工程辅助文件可以存在。其余长期标准放 `docs/`，不复制完整规则。
- 产品决策在 `PRODUCT.md`，技术约束在 `ARCHITECTURE.md`，阶段状态在 `PLAN.md`，Feature **状态**在 `FEATURES.md`，细节与验收在每个 `FEAT-*.md`，素材权属在 `ASSET_LICENSES.md`。
- **禁止创建与已有事实源重复的状态文件**。新增文档必须说明单一职责并更新 `docs/INDEX.md`。

## 2. 编号及状态

- Feature：递增 `FEAT-001`，文件格式 `docs/features/FEAT-001-short-kebab-name.md`；编号不可复用，删除功能标为 `cancelled` 并保留记录，不能改号。
- ADR：`ADR-0001-short-kebab-name.md`，记录状态 `proposed/accepted/superseded` 与取舍。
- 文档元信息：标题后写 `文档编号/版本/更新日期/状态`；变化明显时提升版本。统一日期格式 `YYYY-MM-DD`。
- Feature 状态统一：`planned` / `in_progress` / `blocked` / `done` / `cancelled`。**只在 `docs/FEATURES.md` 维护真实状态**；单 Feature 文档不重复维护状态。
- 测试状态：`passed` / `failed` / `not_run` / `blocked`；不能混用状态。

## 3. Feature 文档固定结构

完整模板见 `docs/templates/FEATURE_TEMPLATE.md`，章节依次为：

1. 目标与用户故事
2. 玩法/交互与状态
3. 范围 / 非范围
4. 数据与依赖
5. 验收标准（可测，编号 AC-01…）
6. 验证方法（按 macOS CLI / Windows GUI / 微信真机区分）
7. 风险、待决事项和文档联动

不能只写几行愿景就标 `done`；未实现的未来功能需明确写「计划」。

## 4. 文档变更联动矩阵

| 变更情况 | 最少要同步修改 |
| --- | --- |
| 新增小游戏/新功能 | `FEATURES.md`、新增 Feature 文档、`PRODUCT.md`（若影响产品范围）、`PLAN.md`（若影响里程碑）、`CHANGELOG.md` |
| Feature 细节、验收变化 | 相应 `FEAT-*.md`、`FEATURES.md`（状态有变化时）、`CHANGELOG.md` |
| 跨游戏数据模型/接口变化 | `ARCHITECTURE.md`、相关 Feature、必要时新增 ADR、测试计划、`CHANGELOG.md` |
| macOS / Windows 执行策略调整 | **`AGENTS.md` 与 `DEV_ENVIRONMENT.md` 同时调整**，用户批准后生效，`CHANGELOG.md` |
| 引擎版本/依赖/构建命令变更 | `TECH_STACK.md`、真实验证后的 `README.md`、需要时 `AGENTS.md` / ADR、`CHANGELOG.md` |
| 新增/替换一二布布素材 | `ART_ASSETS.md`（规格变了时）、`ASSET_LICENSES.md`、相关 Feature、`CHANGELOG.md` |
| 新增联机玩法 | `MULTIPLAYER.md`、角色/该游戏 Feature、`ARCHITECTURE.md`、`TESTING.md`、`CHANGELOG.md` |
| 任务状态/里程碑改变 | `PLAN.md`、`FEATURES.md`（涉及 Feature 状态时）、任务报告、`CHANGELOG.md` |

## 5. 修改顺序

**先查**冲突 → **再改**唯一事实源 → 更新引用方和模板 → 校验相对链接、编号、状态、日期与真实证据 → 更新 Changelog → 执行 `python3 tools/check_docs.py`（Windows 可用 `python tools/check_docs.py`） → 在任务报告中附「文档同步清单」。

## 6. 变更记录格式

`docs/CHANGELOG.md` 按日期倒序追加：`日期 | 变更类型 | 影响文件 | 决策/原因 | 验证/待验证`。禁止用“已完成”描述仅拟定内容。

## 7. 新增任务报告命名

非平凡任务使用 `docs/reports/YYYY-MM-DD_issue-XX_short-slug.md`，以 `docs/templates/TASK_REPORT_TEMPLATE.md` 为格式；如果仓库任务编号不存在，使用 `task-<slug>`，不能编造 Issue 编号。报告是验证证据，不代替唯一状态文档。
