# FEAT-012 — 素材管线、质量验证与发布门槛

> FEAT-012 · v1.7 · 2026-10-26 · 所属阶段：P1–P4 · 负责人：待定。**实施状态只在 `docs/FEATURES.md` 维护。**

## 1. 目标与用户故事

作为开发团队与最终玩家，我希望所有小游戏的美术一致、资源可追溯、游戏稳定且不干扰开发机器。

## 2. 玩法 / 交互与状态

- P1 用占位图建立两角色的一致规格，并登记正式资源的作者、授权、文件路径。
- 每个 Feature 按 OS 分层记录真实验证、未执行项和日志。
- 全项目采用 [ADR-0003](../decisions/ADR-0003-landscape-first.md) 的横屏基准；项目默认配置、已存在的 Canvas 与不同宽高比画面需要分别验证，保留原 UUID 和历史证据。
- 发布前通过 Windows Cocos/微信真机检查，macOS 默认禁止 GUI。
- 资源、代码与文档的跨功能更改必须检查现有游戏受影响情况。

## 3. 范围与非范围

**包含：**

- 基础角色素材标准、命名/权属台账、静态校验、OS 测试分层、质量门槛
- P1-01 工程安全基线：真实引擎模板与启动场景、严格 TS、固定依赖、CLI 超时/失败码/日志及按 OS 区分的报告；不实现正式大厅和游戏。
- 必要的首发平台审核清单（具体法规另行核实）

**不包含：**

- 未授权商用原作素材
- 未经许可在 Mac 自动打开调试窗口
- 把静态单测当真机通过

## 4. 数据与依赖

- AssetId、LicenseEvidence、ValidationResult、TaskReport
- 项目下 `.local/validation` 日志约定

## 5. 验收标准

- [ ] **AC-01**：正式素材都有台账及核验状态，没有来源的资源被挡在发行范围之外。
- [ ] **AC-02**：一二和布布有同规格美术与基础动作，不偏向单角色。
- [ ] **AC-03**：任务报告清楚列出 macOS/Windows/真机执行与未执行项。
- [ ] **AC-04**：Mac 未授权情况下不存在本任务自动弹出的 Cocos/微信/浏览器窗口。
- [ ] **AC-05**：发布前所有必须的 GUI/真机验收均有真实记录或明确阻塞。
- [ ] **AC-06**：工程基线可由 3.8.8 识别；`tools/validate.py` 只执行已审阅的 CLI 白名单，缺少引擎声明时明确阻塞，日志与缓存不入库。

## 6. 验证方法

| 环境 | 具体验证 | 目前状态 |
| --- | --- | --- |
| macOS CLI（需事先审核无 GUI） | `python3 -B tools/validate.py docs/unit/typecheck`（三个单独子命令），检查副作用/预算；无生成声明时 typecheck 阻塞 | `not_run`，未在 Mac 实机执行 |
| Windows GUI：旧竖屏 Startup（历史） | 双几何占位、运行时自动 start、720×1280 布局、停止与重启 | `passed`，仅对应修改前的历史图形报告 |
| Windows GUI：当前横屏 Startup | 1280×720、4:3、21:9 布局、双占位、自动 start、停止/重启 | `passed`，本轮另获具体许可并保存新项目窗口证据，见横屏图形报告 |
| Windows GUI：正式产品 | 正式素材/动作、交互、性能与平台调试 | `not_run`，不由 Startup 结果推定 |
| 微信真机（需要时） | 多机型兼容、触屏与启动性能证据 | `not_run` |

**Mac 禁止擅自启动 Cocos、浏览器、微信开发者工具或 GUI 调试。** 未验证部分始终记 `not_run` 或 `blocked`，不能因写完本 Feature 就标通过。

## 7. 依赖、风险、文档联动

- 关键依赖：FEAT-001, FEAT-002, FEAT-010。
- 风险与待确认：授权不可得; GUI 误启动; 测试日志泄露敏感信息。
- P1-01 的后台引擎数据探针只验证反序列化及显式脚本调用，不验证运行时生命周期或像素；[报告](../reports/2026-10-26_issue-1_cocos-initialization.md) 记录实际结果。两个几何占位不是正式角色素材与动作，AC-02 不因此完成。
- [复审准备报告](../reports/2026-10-26_issue-1_review-preparation.md) 记录安全脚本前置条件、正式静态回归和外部审查包；不代表源码级 Code Review 或 Windows 预览验收完成。
- 外部静态源码复审后，F-01 的本机服务/权益配置忽略与回归修复见 [配置忽略修复报告](../reports/2026-10-26_issue-1_config-ignore-fix.md)；不因此完成本 Feature 或 Windows 运行验收。
- 本轮 [Windows 图形验收报告](../reports/2026-10-26_issue-1_windows-gui-acceptance.md) 补齐 Issue #1 AC-02 的真实运行证据，保留引擎诊断及清理记录。几何占位仍不满足本 Feature AC-02 的正式美术与动作要求，Feature 状态不变。
- 上述竖屏报告作为历史保留。后续 [横屏基线报告](../reports/2026-10-26_issue-1_landscape-baseline.md) 只记录本轮修改/CLI 与未执行项，新横屏 GUI 不由旧 AC-02 抵扣，正式素材/动作仍未完成。
- 用户确认横屏静态复审通过后，本轮 [横屏图形验收报告](../reports/2026-10-26_issue-1_landscape-gui-acceptance.md) 补齐实际运行与三种比例证据；正式产品/真机/性能仍未验证，本 Feature 状态及正式美术/动作 AC-02 不因此完成。
- P1-01 已经用户最终复审接受，收尾检查及获授权提交范围见 [收尾报告](../reports/2026-10-26_issue-1_closeout.md)。该子任务完成不等于本 Feature 全部验收完成，正式素材、动作、发布及真机门槛继续保留。
- 变更联动：`docs/DEV_ENVIRONMENT.md`, `docs/ART_ASSETS.md`, `docs/ASSET_LICENSES.md`, `docs/TESTING.md`、`docs/FEATURES.md`、`docs/PLAN.md`（阶段变化时）、`docs/CHANGELOG.md`、任务报告。
