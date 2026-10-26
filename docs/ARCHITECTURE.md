# 目标系统架构与依赖边界

> DOC-ARCH · v1.0 · 2026-10-26 · **仅为计划架构，不代表已实现**。

## 1. 分层与模块图（目标）

```text
WeChat / Windows test runtime
       │
platform/        (微信 SDK / 本地 Stub)
       │
app-shell/       (大厅、导航、角色选择、游戏切换)
       │
shared-services/ (用户、存档、成就、饼干币、音频、活动)
       │
GameRegistry ── GameModule lifecycle contract
       ├── games/tower-defense/
       ├── games/gold-miner/
       ├── games/merge/
       └── games/snake/

multiplayer/     (预留抽象；P5 才接真实 WSS)
shared-protocols/(若 P5 需共用网络数据契约)
```

## 2. 计划工程目录（P1 时再落地）

```text
client/                  # Cocos Creator 项目
  assets/core/           # 大厅、生命周期、公共 UI
  assets/characters/     # 一二和布布的正式/临时素材
  assets/platform/       # 微信与本地适配
  assets/games/          # 各小游戏独立入口与资源
  assets/ui/             # 公共 UI
  settings/              # Cocos 工程配置（依实际模板）
server/                  # P5 才创建服务端代码
shared/                  # 只有出现真实共享类型时建立
scripts/                 # 检查/构建脚本，经安全审查才执行
```

**不得只为符合架构图而创建大量空文件。** 当前仅有本项目文档包，不存在 `client/` 等目录。

## 3. 关键契约（语义级，P1 再确定 TS 签名）

- `CharacterId = yier | bubu`：唯一稳定角色 ID，文案与头像独立；在联机中由服务端校验选角占用。
- `GameId`：稳定 ID，暂定 `tower-defense | gold-miner | merge | snake`；存档不能依赖屏幕标题。
- `GameMode = solo | coop | versus`：每个游戏声明支持模式；不能让单人逻辑强依赖在线服务。
- `GameModule`：`load / enter(sessionContext) / pause / resume / exit / dispose`（明确幂等与资源释放），由 App Shell 唯一管理游戏切换。
- `GameSession`：临时局内数据（角色、模式、种子或关卡号、结果），**不等同** `PlayerProfile` 或持久存档。
- `SaveRepository`：读写 `schemaVersion` + `player` + `games[gameId]`；不能序列化引擎节点、私密 token 或微信 sessionKey。
- `PlatformAdapter`：微信、Windows 开发桩实现等价的最小平台功能；客户端不得散布直接 `wx.*` 调用。
- `RoomService / NetworkAdapter`：P5 才实现，可在 P1 记录接口草图和单机 Mock，不搭空的联网大框架。

## 4. 状态所有权

| 数据 | Owner | 何时创建 / 销毁 |
| --- | --- | --- |
| 大厅导航、活动选择 | App Shell | 应用启动 / 退出 |
| 单次关卡、计时、碰撞对象 | 对应 GameModule | 进入游戏 / 退出释放 |
| 已选择的本地角色 | PlayerProfile 或临时局状态 | 会话期间 / 根据设计保存 |
| 各游戏长线进度 | 各游戏定义，由 SaveRepository 持久化 | 关卡结算或安全检查点 |
| 饼干币与全局收藏 | Shared Progression | 成功结算后原子更新 |
| 在线房间角色/准备/分数 | P5 Room Server | 建房 / 关闭房间 |

UI **展示状态与发出意图**，游戏规则模块决定得分、碰撞、通关、消耗；服务端在联机模式负责关键状态与防作弊校验。避免庞大的全局 GameManager 直接持有所有游戏规则。

## 5. 生命周期和异常

- 游戏切换必须清理定时器、物理对象、事件订阅、动态资源，避免返回大厅后仍更新。
- 异常退出有可恢复的安全存档；写盘采用避免半写入的策略，未来云端有冲突解决策略。
- 客户端前后台切换应暂停适当的单机计时，联机则遵守服务端房间状态并处理超时。
- 数据字段新增/删除需要版本迁移测试；不能删除用户旧存档“解决”兼容问题。

## 6. 网络扩展原则

先做确定性的单人玩法和模拟输入；接入 P5 时，黄金矿工协作优先采用服务端裁决目标归属/得分。后续塔防合作同步双方放置与资源，横版动作因高频同步须另立技术专项。详见 [MULTIPLAYER.md](MULTIPLAYER.md)。

## 7. 性能与资源

首屏仅加载大厅公共资源，子游戏按需加载；具体 Asset Bundle 分包与远端素材取决于微信包体、合规与实测。低端真机性能目标在 P2 测量后固定，不能把未测试的 60 FPS 当作承诺。
