# 阶段计划与当前事实（唯一阶段状态源）

> DOC-PLAN · v1.12 · 2026-10-28 · 本文只记录可证实的阶段状态。状态值：`planned` / `in_progress` / `blocked` / `done`。

## 0. 实际现状

- **当前成果**：P1-01 最终基线为 `0b4bf91`，包含真实 3.8.8 工程、Startup、安全 CLI、F-01 和 [ADR-0003](decisions/ADR-0003-landscape-first.md)。P1-02 完整外部源码复审已通过，用户正式验收本任务范围并授权收尾入库；Lobby 三比例、七入口各三次、鼠标/键盘/遮罩、组件恢复、节点销毁修复及真实启停证据均保留。
- **已确认**：用户外部最终复审确认上述基础工程、F-01、横屏基线和 Windows 三比例验收符合 Issue #1。真实 Windows 3.8.8 的 16:9、4:3、21:9、自动 start、停止/重启及清理见 [横屏图形验收报告](reports/2026-10-26_issue-1_landscape-gui-acceptance.md)。[横屏开发报告](reports/2026-10-26_issue-1_landscape-baseline.md) 与 [旧竖屏历史报告](reports/2026-10-26_issue-1_windows-gui-acceptance.md) 保留原文，分别记录各自轮次。
- **未完成**：FEAT-001 AC-03 真正游戏往返（待 FEAT-003）；Mac 实机 CLI、真选角、模块生命周期、存档、所有可玩游戏、微信真机、联机和正式角色授权。组件独立移除、正式构建启动场景、性能/长期泄漏未验证；编辑器退出时 IPC/WebContents 诊断保留，未宣称修复。
- **禁止误报**：不能因为写了接口说明就宣布已实现架构，不能因为计划了 24 关就写已完成 24 关。
- **当前停点**：P1-01/P1-02 为 `done`，P1 整体继续 `in_progress`，FEAT-001 状态仍由 FEATURES 维护为 `in_progress`。本次按用户授权执行最终安全检查、逐文件暂存、提交、普通推送 origin/master，远端核对一致后关闭 Issue #2；证据见 [收尾报告](reports/2026-10-28_issue-2_closeout.md)。[GUI 验收报告](reports/2026-10-27_issue-2_windows-gui-acceptance.md)、[审查包报告](reports/2026-10-27_issue-2_final-review-preparation.md) 和 [导入暂停报告](reports/2026-10-27_issue-2_windows-gui-import.md) 保留原轮次结果。本轮不运行 GUI，不自动创建或执行 P1-03。

## 1. 里程碑

| 阶段 | 状态 | 交付 | 退出门槛 |
| --- | --- | --- | --- |
| P0 产品与文档基线 | `done` | 文档基线 `043ae7f` 已入库；用户授权据此进入 P1-01 | 基线文件、素材待核验台账与风险登记可查 |
| P1 运行骨架 | `in_progress` | P1-01/P1-02 已验收；真选角、游戏生命周期和存档未实现，FEAT-001 AC-03 待集成 | Windows 图形运行 + macOS 安全 CLI 结果 + 报告 |
| P2 塔防垂直切片 | `planned` | 5 关、基础防御、敌人与结算 | 真机能完成连续 5 关，关卡配置可扩展 |
| P3 黄金矿工垂直切片 | `planned` | 10 关、抓钩、得分、升级 | 与塔防互相切换、保存正确 |
| P4 首发扩展与质量 | `planned` | 24 关塔防、30 关矿工、合成与贪吃蛇、基础成长 | 可用性/性能/合规提审清单过关 |
| P5 好友联机 | `planned` | 房间、微信分享、双人矿工、重连、结算 | 两台真机、两个账号通过完整联机流程 |
| P6 持续运营 | `planned` | 主游戏新章节、双人塔防、精品横版作品 | 基于实际数据决定排期 |

## 2. 本轮 Issue：P1-02

**P1-02：横屏大厅与双主角基础界面** — `done`。完整外部 Code Review 通过，用户接受 [Issue #2](https://github.com/muddyrain/yier-bubu-gamehouse/issues/2) 所界定的大厅范围并授权收尾；[收尾报告](reports/2026-10-28_issue-2_closeout.md) 记录审查包一致性及最终安全检查。源码历史见 [开发报告](reports/2026-10-27_issue-2_landscape-lobby.md)，图形证据见 [GUI 验收报告](reports/2026-10-27_issue-2_windows-gui-acceptance.md)。不将任务完成扩充为 FEAT-001 全功能完成。

- 入口：独立 `client/assets/scenes/Lobby.scene`，运行时 LobbyView 构建 UI；原 Startup/SmokeTest/Meta/settings/13 回归保持原字节。
- 本轮范围：双方同规格白/棕原创几何头像与名称；四卡稳定 ID/准确名字/全部开发中；帮助、设置说明、好友敬请期待及单提示返回流程，无继续游戏假进度。
- 设计：1280×720 中心参照容器，整体等比适配、允许留黑；只读目录/身份/导航模型与引擎视图分离，无联网/游戏生命周期框架。
- 新场景及 Meta 最初为独立源码派生；前一轮真实 3.8.8 导入后 imported=true、UUID 不变。本轮不改场景/Meta/P1-01 文件；仅为已复现的停止警告给 LobbyView 根节点销毁增加 `isValid(root, true)` 检查。
- 验证：16:9/4:3/21:9 画面、七入口各三次、遮罩、画布聚焦后的键盘、两次组件恢复及脚本刷新后两次运行/停止通过。嵌入预览外层焦点未响应按键、两次原销毁警告、输入保护、退出诊断均保留；独立可视本地预览验证键盘，没有隐藏窗口验收。安全 CLI/文件保留及退出核对见最新报告；不等于微信真机或性能验收。
- 不做：真选角、可玩小游戏、存档、房间/分享/微信登录、正式 IP 图片、未经授权的 Git 操作或下一 Issue。

### 已完成前置：P1-01

**P1-01：初始化项目与安全基线** — `done`，用户最终复审已接受基础工程、F-01、1280×720 横屏基线及 Windows 三比例图形证据。

- 当时输入：[Issue #1 横屏优先基线评论](https://github.com/muddyrain/yier-bubu-gamehouse/issues/1#issuecomment-6418493257)、本项目文档、图形证据及用户 P1-01 收尾时的验收、提交/推送/关闭 Issue 授权；该 Git 授权不延续至 P1-02。
- 已实现范围：`client/` 真实 2D 模板工程；`Startup.scene` 与 `SmokeTest`；严格 TypeScript 配置；固定依赖/锁文件；无 GUI 的有界验证入口；忽略规则及文档同步。
- P1-01 当时未实现范围：正式 FEAT-001/002/003/004 等产品功能；当前 Feature 状态仍以 FEATURES 为准，不能将 P1-01 验收扩充为这些功能完成。
- 当时收尾边界：未重跑 GUI；Mac 上未授权启动 Cocos CLI 或 GUI；后续工作需新的授权。
- 验收：Windows 有真实运行证据；Mac 安全 CLI 的源码/副作用已审阅，但 Mac 实机执行仍为 `not_run`，按 Issue AC-03 如实记录。最终提交前检查、范围清单与敏感配置边界见收尾报告。
- 收尾证据：[P1-01 最终报告](reports/2026-10-26_issue-1_closeout.md)，原始历史报告/失败/竖屏记录均保留，不改写为 P1-02 证据。
- 保留的未验证项：Mac CLI 实机、微信构建/真机、安全区/触控与性能均 `not_run`。桌面设备预设不等于真实手机验证；所有历史证据保留。

## 3. 状态更新规则

- `done` 要有对应 Issue/报告及复现实测证据；`blocked` 要明确原因和解除条件。
- 阶段本身状态只在这里更新，Feature 独立状态只在 `docs/FEATURES.md` 更新。
- 每次变更写 `docs/CHANGELOG.md`；如果用户只授权准备文档，**不能自动启动 P1**。
