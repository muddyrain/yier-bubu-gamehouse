# FEAT-010 — 微信小游戏平台适配

> FEAT-010 · v1.1 · 2026-10-26 · 所属阶段：P1 / P4 · 负责人：待定。**实施状态以 `docs/FEATURES.md` 为准，当前为计划方案。**

## 1. 目标与用户故事

作为使用微信打开小游戏的玩家，我希望可以在微信环境正常启动、保存、退出，并为好友邀请预留入口。

## 2. 玩法 / 交互与状态

- 平台相关功能统一通过 adapter，对应 Windows 开发 Stub。
- 首发对齐微信小游戏生命周期、尺寸、安全区、真机网络与资源加载。
- 方向遵循 [ADR-0003](../decisions/ADR-0003-landscape-first.md)：后续真实微信构建设为 Landscape，核验输出 `game.json` 的实际方向，并在缺口屏/不同宽高比验证安全区与触控；P1-01 不构建或伪造输出。
- 微信登录/分享用于未来好友房，未实现时明确隐藏入口，不伪造好友数据。
- 遵守平台真机测试与隐私最小化原则。

## 3. 范围与非范围

**包含：**

- P1 适配层与安全的本地 Stub、P4 微信构建/真机验证
- API 错误与不支持能力的处理

**不包含：**

- P1 真实社交邀请与支付
- Mac 默认启动微信开发者工具

## 4. 数据与依赖

- PlatformCapabilities、PlatformLifecycleEvent
- WeChat 登录/分享入口由后续 Feature 使用

## 5. 验收标准

- [ ] **AC-01**：开发 Stub 与微信平台行为有明确边界，游戏逻辑不直接散落 SDK 调用。
- [ ] **AC-02**：真实微信构建和真机启动的证据只在 Windows 调试或授权环境收集。
- [ ] **AC-03**：未实现登录/分享时 UI 不误导玩家功能已经上线。
- [ ] **AC-04**：切后台、切前台、弱网等情况有正确的暂停/恢复或可解释提示。

## 6. 验证方法

| 环境 | 具体验证 | 目前状态 |
| --- | --- | --- |
| macOS CLI（需事先审核无 GUI） | 平台适配层的 Mock 测试（无 GUI） | `not_run` |
| Windows GUI | 微信开发者工具构建/预览/真机远程调试 | `not_run` |
| 微信真机（需要时） | 微信账号正常进入、安全区与启动检查 | `not_run` |

**Mac 禁止擅自启动 Cocos、浏览器、微信开发者工具或 GUI 调试。** 未验证部分始终记 `not_run` 或 `blocked`，不能因写完本 Feature 就标通过。

## 7. 依赖、风险、文档联动

- 关键依赖：FEAT-001, FEAT-003, FEAT-004。
- 风险与待确认：微信 API 版本变化; 包体/分包限制; 隐私合规。
- 变更联动：`docs/TECH_STACK.md`, `docs/DEV_ENVIRONMENT.md`, `docs/MULTIPLAYER.md`, `docs/REFERENCES.md`、`docs/FEATURES.md`、`docs/PLAN.md`（阶段变化时）、`docs/CHANGELOG.md`、任务报告。
