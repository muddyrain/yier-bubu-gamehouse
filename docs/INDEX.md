# 文档导航与单一职责

> DOC-INDEX · v1.7 · 2026-10-26 · 状态：维护中。**禁止新增多个文件维护同一事实**。

| 文件 | 唯一职责 | 更新触发条件 |
| --- | --- | --- |
| `README.md` | 外部入口、当前可执行命令（只列真的）与导航 | 安装/验证入口变化 |
| `AGENTS.md` | Agent 执行顺序与不可违背的保护规则 | 流程或安全规则调整 |
| `docs/PRODUCT.md` | 产品愿景、双主角、首发边界、玩家体验 | 产品决策变化 |
| `docs/PLAN.md` | **唯一阶段/里程碑状态**与下一任务 | 里程碑、阻塞或优先级变化 |
| `docs/FEATURES.md` | **唯一 Feature 状态与索引** | 每次 Feature 新增或状态变化 |
| `docs/features/FEAT-*.md` | 独立功能需求、规则、边界与验收 | 该功能行为或范围变化 |
| `docs/ARCHITECTURE.md` | 模块划分、依赖和数据边界 | 架构/接口变化 |
| `docs/TECH_STACK.md` | 引擎/语言/工具选择与锁版本原则 | 工具栈变化 |
| `docs/DEV_ENVIRONMENT.md` | macOS/Windows 允许/禁止行为 | 执行环境、安全策略变化 |
| `docs/WORKFLOW.md` | Issue、Git、代码评审、报告流程 | 协作方式变化 |
| `docs/DOC_RULES.md` | 文档模板、命名、变更检查表 | 文档协作格式变化 |
| `docs/ART_ASSETS.md` | 素材规格、命名、管线 | 美术规范或导入方式变化 |
| `docs/ASSET_LICENSES.md` | **唯一素材授权登记台账** | 新增、替换、删除正式素材 |
| `docs/MULTIPLAYER.md` | 房间流程、联机边界、协议与安全 | 联机方案变化 |
| `docs/TESTING.md` | 各 OS 测试分层、证据和发布门槛 | 质量门槛或工具变化 |
| `docs/RESOURCES.md` | 人力、账号、软件与主要风险 | 资源/授权约束变化 |
| `docs/CHANGELOG.md` | 关键文档/产品决策变更记录 | 每次重要文档变更 |
| `docs/REFERENCES.md` | 已查证的官方技术来源 | 来源过期或升级时 |
| `docs/decisions/ADR-*.md` | 已作出的关键技术决策和替代方案 | 关键决策产生或推翻时 |
| [ADR-0003 横屏优先](decisions/ADR-0003-landscape-first.md) | 全项目方向、1280×720 基准、窄高玩法布局与适配/回退条件 | 用户确认方向或真实适配证据要求重审 |
| `docs/templates/*` | 固定 Feature/ADR/任务报告格式 | 模板调整 |
| `tools/check_docs.py` | 只读校验文档编号、模板章节、链接与清单 | 文档修改后的本地静态验证 |
| `tools/validate.py`、`tools/tests/test_validation.py`、`tools/tests/test_project_baseline.py` | 安全 CLI 白名单、执行预算/日志及工具/工程静态回归测试 | 无界面检查入口变更 |
| [P1-01 任务报告](reports/2026-10-26_issue-1_cocos-initialization.md) | Issue #1 的实际变更、环境与验证证据 | 本轮交付或复审补充证据 |
| [P1-01 复审准备报告](reports/2026-10-26_issue-1_review-preparation.md) | 审查包范围、脚本安全复核和回归补强证据 | 外部 Code Review 准备与打包验证 |
| [P1-01 配置忽略修复报告](reports/2026-10-26_issue-1_config-ignore-fix.md) | 外部复审 F-01 的用途判定、Git 忽略/跟踪验证与原文件保留证据 | 本机 Cocos 服务配置忽略修复与复核 |
| [P1-01 Windows 图形验收报告](reports/2026-10-26_issue-1_windows-gui-acceptance.md) | Issue #1 AC-02 的实际 Startup 运行、截图、引擎诊断和退出证据 | 经本次许可进行 Windows 图形运行验收 |
| [P1-01 横屏基线报告](reports/2026-10-26_issue-1_landscape-baseline.md) | 本轮横屏配置/布局、UUID 保留、静态回归及 GUI 未执行边界 | Issue #1 横屏优先变更与后续复验 |
| [P1-01 横屏图形验收报告](reports/2026-10-26_issue-1_landscape-gui-acceptance.md) | 本轮许可下的三种横屏比例、自动生命周期、停止/重启、诊断与进程清理证据 | Issue #1 横屏图形复验与最终复审 |
| [P1-01 收尾报告](reports/2026-10-26_issue-1_closeout.md) | 用户最终复审结论、完整提交范围、最终安全 CLI 及敏感配置保护证据 | Issue #1 获授权提交/推送/关闭前的收尾检查 |

## 阅读流程

- 新任务：`AGENTS.md` → `docs/PLAN.md` → `docs/FEATURES.md` → 对应 Feature → 相关细则。
- 补功能：**先**在相关 Feature 中写用户场景、范围和验收，再改实现。
- 完成工作：记录实际测试证据，更新 Feature 状态及必要的阶段计划，不重复在 README 写多份进度。
- 新文档：先说明唯一职责并更新本索引；若内容与既有文档重叠，优先修改既有文件。
