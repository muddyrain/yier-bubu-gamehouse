# 目标系统架构与依赖边界

> DOC-ARCH · v1.16 · 2026-10-29 · P1-03 本地选角与 F-02 真实键盘证据；真实游戏生命周期仍为计划，未实现。

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

## 2. 实际工程与目标目录

P1-01 当前实际存在：

```text
client/                              # 官方 3.8.8 Empty(2D) 模板派生工程
  assets/scenes/Startup.scene         # 官方 2D 预设，经实际引擎序列化保存
  assets/scripts/SmokeTest.ts         # Canvas 上的最小启动探针
  .creator/default-meta.json          # 官方模板的导入约定
  settings/                          # 真实模板派生配置，本轮调整为 1280×720
  tsconfig.json                      # 继承不提交的 temp/tsconfig.cocos.json
tools/validate.py                    # 固定 CLI 白名单、OS 记录、时限、退出码、日志
tools/check_docs.py                  # 仅扫描自有文档，排除依赖/缓存
tools/tests/test_validation.py       # 检查工具的纯逻辑与受控子进程回归测试
tools/tests/test_project_baseline.py # 无引擎的 meta/场景引用/版本/忽略边界回归
package.json / package-lock.json     # 外部 TypeScript 检查器；不是引擎运行依赖
```

`SmokeTest` 在运行时 `start()` 中创建六个文字节点和两个同规格矩形，一二白色、布布棕色。没有选角、目录、存档、导航、网络或后台服务。临时 Windows 编辑器扩展用于实际调用引擎序列化/反序列化，任务后已移入 `.local/` 证据目录，不随工程自动运行。

初始后台引擎探针在编辑器场景环境显式调用 `start()`，只证明数据与 API 可执行。后续独立进行的 [Windows 图形验收](reports/2026-10-26_issue-1_windows-gui-acceptance.md) 已在 Preview in Editor 中两次观察到运行时自动触发 `start()`、双角色几何占位和 720×1280 布局；没有改变场景或脚本，不扩展为正式游戏/微信运行结论。

上述为**修改前竖屏历史证据**。[横屏基线开发](reports/2026-10-26_issue-1_landscape-baseline.md) 按 [ADR-0003](decisions/ADR-0003-landscape-first.md) 调整 project 默认分辨率与现有 Startup：Canvas UITransform 1280×720、中心 (640, 360)、相机半高 360，Fit Width/Height 同时开启；保留所有对象 ID、Meta UUID、Canvas/Widget/相机/SmokeTest 引用。双矩形横向位置为 ±260、双方名称区域宽度为 320，继续由原 start 创建内容并记录原日志标记。本轮未修改这些文件，实际引擎加载、16:9/4:3/21:9 显示及两次自动启动/停止证据见 [横屏图形验收报告](reports/2026-10-26_issue-1_landscape-gui-acceptance.md)。

统一方向适用于后续 App Shell、选角、小游戏与房间；窄高玩法在横屏内使用独立玩法容器与外围 UI，不在游戏切换时旋转。此为布局约束，没有新增相关模块或接口。

### P1-02 独立大厅实现

实际新增 `assets/scenes/Lobby.scene`、`assets/scripts/LobbyModel.ts`、`LobbyView.ts` 及对应 Meta；没有迁移或改写 Startup、SmokeTest、原 Meta、共享 project/engine 设置。Lobby 源场景沿用现有真实 Scene/Canvas/Widget/Camera 结构，使用独立 UUID 和 LobbyView 组件引用。源码开发轮次未运行编辑器；后续真实 3.8.8 导入只将三份新 Meta 的 imported 改 true，UUID 不变。前次暂缓见 [导入报告](reports/2026-10-27_issue-2_windows-gui-import.md)；本轮明确恢复后完成运行与交互，见 [GUI 验收报告](reports/2026-10-27_issue-2_windows-gui-acceptance.md)。

- LobbyModel 不导入 cc：只读 GameCatalogEntry、角色身份、1280×720 中心参照布局、等比 fit、单面板导航和焦点索引。四款均 coming-soon，没有实现 GameModuleRegistry 或可玩入口。
- LobbyView 是 Canvas 上唯一大厅组件：onLoad 一次构建首页和一个提示面板；onEnable 配对订阅按钮、尺寸和键盘事件；onDisable 解除同一批订阅并复位；onDestroy 仅在 `isValid(root, true)` 时释放自建根节点，避免场景先销毁子节点后再次 destroy 的真实警告。打开/关闭提示只改可见性和文本，不创建新节点/回调。
- 提示激活时覆盖输入并禁用大厅按钮；返回/Escape 回到首页，Tab/方向键/Enter/Space 用于基础键盘导航。本轮真实鼠标、遮罩和运行时组件恢复已验证；独立可视本地预览在 GameCanvas 聚焦后验证键盘，编辑器外层焦点未响应的历史失败保留。触控/安全区仍未验证，没有为测试伪造引擎。
- 设计容器按 Canvas 尺寸整体等比缩放，保留双主角区域和 2×2 目录相对关系，接受留边；手机系统安全区适配未实现/验证。
- 后续 FEAT-002/003 应从稳定 GameId/CharacterId 和明确的导航动作接入。本轮不写入 selectedCharacter、不加载子游戏、不读写存档或联网；好友只显示未开放说明。

原 13 项测试不改，新增资源引用检查及直接执行真实纯 TS 模型的逻辑回归；纯逻辑返回 HOME 不代表真实场景往返、UI 无泄漏或真实触控已验收。入口与证据见 [P1-02 报告](reports/2026-10-27_issue-2_landscape-lobby.md)。

### P1-03 本地选角实现

证据更正：2026-10-29 F-02 发现上一轮独立预览 40—54 键盘图片重复，旧键盘验收声明须补证，见 [F-02 报告](reports/2026-10-29_issue-3_f02-keyboard-evidence.md)。只修复采集/索引，本文描述的产品结构、源码和 Meta 不变；三比例/重复往返/组件/编辑器启停证据仍获外部复审接受。

随后本次明确许可的 [F-02 键盘补验](reports/2026-10-29_issue-3_f02-keyboard-acceptance.md) 取得 19 张独立真实预览图，分别验证焦点/选中/确认/取消及原介绍开关；只验证键盘，不替代或重做编辑器生命周期，源码/Meta 保持原字节。

在现有 LobbyModel/LobbyView 内扩展，没有新增场景、脚本资产、Meta、全局管理器或存档模块。P1-02 章节描述原验收时的行为；现在大厅有独立选角入口，原七入口仍可用，四款仍为 coming-soon。

- `CharacterId = 'yier' | 'bubu'` 与只读 CharacterEntry 复用唯一 CHARACTERS 目录；`isCharacterId(unknown)` 接受精确 ID。`CharacterChoice` 只含只读 characterId，确认时冻结，不允许调用方改写返回对象。
- 纯 `transitionLobby(LobbyState, AppAction)` 维护单一顶层 screen（home / notice / characters）和 choice。选角 screen 有 choosing/confirmed 阶段、draft 和可恢复 error；空草稿不能确认，未知 ID 不替换合法草稿/结果，确认阶段先「再次选择」才可修改。
- 返回和组件禁用都回 HOME，取消未确认草稿，保留上次 choice；重进以 choice 为草稿，重新创建 LobbyView 则从 null 开始。状态由实例持有，不使用本地存储、静态可变单例、网络或 GameSession。
- `LobbyView.getConfirmedCharacter(): CharacterChoice | null` 是未来 FEAT-003 的读取边界，没有消费者/游戏加载实现；真实游戏集成仍为 not_run。
- 一个遮罩下的提示/选角内容互斥，节点只在 onLoad 构造；onEnable/onDisable 继续配对订阅同一函数，关闭/渲染不增订阅。键盘和鼠标均只激活当前面板的可用控件，确认门槛影响按钮和焦点序列；初始面板焦点为返回。原严格销毁有效性检查保留。
- 同一几何绘制方法用于大厅和选角，角色容器均 136×136 设计单位；选角卡片对称，同字号/尺寸，颜色/名称来自目录。整体沿用 ADR-0003 的等比完整显示与留边策略。

原 15 项测试保持原字节，新增 13 组模型/视图 AST 契约断言，由一个 10 秒 CLI 子进程执行。静态订阅检查不证明引擎时序/无泄漏。本次真实编辑器完成三比例、各角色三次、七入口、遮罩/取消、组件恢复及两次启停；恢复保留确认/取消草稿，重启中立，正常退出无残留。独立可视预览只补键盘，未替代编辑器生命周期。最新见 [GUI 完成报告](reports/2026-10-28_issue-3_windows-gui-completion.md)，原 [GUI 失败及修复](reports/2026-10-28_issue-3_windows-gui-acceptance.md)、[补验暂停](reports/2026-10-28_issue-3_windows-gui-followup.md) 保留；本轮无源码修改。原开发见 [P1-03 报告](reports/2026-10-28_issue-3_character-selection.md)。下面目录仍为未来目标。

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

**不得只为符合架构图而创建大量空文件。** 当前没有上述 `core/characters/platform/games/ui`、`server/`、`shared/` 或 `scripts/` 产品模块；安全工具实际放在 `tools/`。

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
| 当前大厅已确认角色 | 当前 LobbyView 实例 | 首次确认 / 实例销毁；禁用恢复保留，重载清空；未来持久化另行设计 |
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
