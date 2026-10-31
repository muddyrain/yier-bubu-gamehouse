# 任务报告 — Issue #4 / P1-04 真实演示优先

> 报告日期：2026-10-30（Asia/Shanghai）| 系统：Windows NT 10.0.26200 | 功能：FEAT-001/002/003、FEAT-005 路线 | 分支：master | 交付：本地实现与真实运行验收完成，未提交/未关闭 Issue

## 1. 本次授权范围

继续 [Issue #4](https://github.com/muddyrain/yier-bubu-gamehouse/issues/4)，先给用户真实可操作的运行效果，再补验收矩阵。F-01 已外部源码复审通过，本轮未重构或重复修复。全部既有代码、素材研究、私有配置和历史证据保留。

用户明确回复「现在允许操作并保存项目截图」；前台切窗中断后停止输入/截图，用户随后回复「继续 操作 吧 我不打断了」才恢复。仅操作/采集项目窗口；未录屏，未暂存、提交、推送、建 PR 或关闭 Issue。

## 2. 实际交付与代码影响

- 修改 `client/assets/scripts/DevelopmentModule.ts`：真实停止预览时，父 Canvas 正在停用，dispose 主动 removeFromParent 触发层级错误。仅移除该调用并解释原因，保留立即退订/隐藏、严格有效性检查及 destroy，由引擎延迟销毁时脱离父节点。没有更改 F-01/GameLifecycle、玩法、选角或架构范围。
- 编辑器导入变更四份 `CharacterVisual.ts.meta`、`CounterModel.ts.meta`、`DevelopmentModule.ts.meta`、`GameLifecycle.ts.meta`：仅 imported=false→true，UUID 和其余内容不变，原哈希可由反转该标记复现。
- 修改十二份已有文档：`README.md`、`docs/PLAN.md`、`docs/FEATURES.md`、`docs/features/FEAT-001-game-lobby.md`、`docs/features/FEAT-002-character-selection.md`、`docs/features/FEAT-003-game-module-lifecycle.md`、`docs/features/FEAT-005-tower-defense.md`、`docs/PRODUCT.md`、`docs/TESTING.md`、`docs/ARCHITECTURE.md`、`docs/INDEX.md`、`docs/CHANGELOG.md`；新增本报告。无删除。
- 下一阶段先精致单关：一张完整森林小屋战斗地图、一个可通关关卡、两种防御单位、两种敌人/三波、攻击/生命/胜负/重试、统一高品质 2D UI 和操作反馈，再扩五关。存档/奖励扩建不作为第一关试玩前置。正式角色遵循原作者原稿及许可，不把新设计相似熊当最终角色。本轮未开始下一期代码。
- 场景、Startup/SmokeTest、LobbyView、GameLifecycle、测试、依赖、素材研究及两份本机私有配置保持本轮开始时原字节。完整核对见本机 scope-final.json；开始时 111 文件哈希见 before.json，私有内容不导出。

## 3. 实际验证（无验证则写 not_run）

本轮证据根目录为仓库本机忽略目录 `.local/validation/p1-04-visible-demo-2026-10-30/`。截图均为实际项目画面，没有设计模拟图或录屏帧。

| OS | 命令/步骤 | 结果 | 日志或证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows CLI | 阅读规则、计划、Feature、原报告及 Issue；原生只读 git status/diff | `passed` | before.json、scope-final.json | GitNexus 工具不可用，已说明并回退 Git；原有未提交改动保留 |
| Windows GUI | 现有 Cocos Creator 3.8.8 打开 client/Lobby | `passed` | launch.json、context/01-editor-first-run.jpg | 编辑器实际版本/项目场景，不是 CLI 模拟 |
| Windows GUI | 16:9：一二选择确认→进入→命中→暂停/继续→退出，再以布布重复 | `passed` | screenshots/00—14；input-log.jsonl；browser-console-first-demo.json | 1280×720 实际 Cocos 画布；目标换位、计数、暂停遮罩拦截、恢复、角色保留均实测 |
| Windows GUI | 4:3 / 21:9；双方各再往返一次 | `passed` | screenshots/17—32（18 排除）；viewport-observations.jsonl；浏览器分轮日志 | 实际画布 960×720 / 1680×720，完整显示并留边；连同首轮双方各三次、共六次，每局归零；跨重载 local session 编号重置 |
| Windows GUI | 四款介绍、帮助/设置/好友、遮罩、取消草稿及实际键盘 | `passed` | screenshots/33—41、输入日志、browser-console-final.json | 四卡仍开发中，取消布布草稿保留已确认一二；Tab/四方向/Enter/Space/Escape/P 已实际操作，不是调用模型方法 |
| Windows GUI | 活动模块中禁用/恢复 LobbyView；重进/单次命中 | `passed` | context/43—46；editor-input-log.jsonl；project-final.log | 禁用后旧模块退出且旧位置点击无效；恢复同一已确认一二大厅，再进 count=0、单击=1。中断期间用户自行操作的 count=4 不算 Agent 证据 |
| Windows GUI | 首次在活动模块中停止编辑器预览 | `failed` | context/47-first-stop-failure.jpg；project-before-stop-fix.log；editor-stderr-before-stop-fix.log | 真实父节点停用时主动移除子节点错误；保留完整堆栈，不抵扣两次成功启停 |
| Windows GUI | 修复重新导入后，布布 running 停止 / 一二 paused 停止 | `passed` | context/49—52；checkpoints.jsonl；project-fixed-runs.log；runtime-audit.json | 两次均在 Preview in Editor，分别 20:43:52 启动→20:47:42 停止、20:47:52 启动→20:49:19 停止；各一次 entered/running→exiting→idle，无 error，停止交界共 6 条 IPC 警告保留 |
| Windows GUI/CLI | File→退出；项目窗口、同路径进程及 7456 监听核对 | `passed` | exit-check.json；窗口列表为空 | 正常退出，不强杀；20:50:12 核对均为 0 |
| Windows CLI | 修复后 `python -B tools/validate.py typecheck` | `passed` | `.local/validation/p1-01/20261030T124102.149613Z/` | 真实 TS 5.8.2 / 引擎声明，退出 0 |
| Windows CLI | 修复后 `python -B tools/validate.py unit` | `passed` | `.local/validation/p1-01/20261030T124353.335881Z/` | 既有 21 unittest，含生命周期 23 组；无新伪引擎测试，不以单测代替实际销毁验收 |
| Windows CLI | tools/check_gui_evidence.py 的 audit，全部文件显式作为 distinct 集合 | `passed` | screenshots-image-index.json、context-image-index.json | 42 浏览器 + 12 编辑器原图均解码通过，文件/像素哈希无重复；53 条逐次收据哈希匹配，最初编辑器图由最终索引核对。哈希不代替内容检查 |
| Windows CLI | 最终 docs / encoding-guard / git diff --check / 索引与原字节核对 | `passed` | final-checks.json、scope-final.json | 仅在全部命令实际通过后定稿；未重复执行已通过的 unit/typecheck |
| Mac / 微信 / 跨正式游戏 / 正式素材替换 / 性能 / 录屏 | 未执行 | `not_run` | 当前范围与许可 | 不代表手机触控/安全区、长期泄漏、完整图像动画接口或正式游戏可玩 |

最小代码复核：对照本机 3.8.8 Node.setParent 的 Deactivating 检查，以及 Node/CCObject 的延迟销毁实现，确认退订和隐藏先发生，重复 dispose 不会再拥有根引用，新局不会接收旧输入。只复核此次销毁改动，未重新审查已通过的 F-01。[Cocos 官方销毁说明](https://docs.cocos.com/creator/3.8/manual/en/scripting/create-destroy.html) 亦说明 destroy 延迟处理。原源码副本在 DevelopmentModule-before-stop-fix.ts，修复专用差异在 stop-fix.patch。

证据排除：15 为改视口过渡帧，16 为 IAB 视口已变但预览容器仍旧宽导致的裁切，重载后 17 正常；18 文件名过早标为一二确认，实际为布布草稿，19 才是确认一二。48 的文件名同样过早，当时引擎仍缓存旧代码，只在中立大厅启停，不能证明修复通过。明确重新导入并核对生成代码后才开始 49—52 正式复验。全部失败/误标原图保留，见 observations.jsonl。

代表性实际画面：

- 一二命中 1 次：`../../.local/validation/p1-04-visible-demo-2026-10-30/screenshots/04-yier-target-hit-one.jpg`
- 布布继续后键盘命中 2 次：`../../.local/validation/p1-04-visible-demo-2026-10-30/screenshots/13-bubu-resumed-space-hit-two.jpg`
- 一二暂停：`../../.local/validation/p1-04-visible-demo-2026-10-30/screenshots/05-yier-paused.jpg`
- 修复后编辑器内布布实际运行：`../../.local/validation/p1-04-visible-demo-2026-10-30/context/49-fixed-run-a-active-bubu.jpg`

## 4. 运行环境保护核对

获许可前没有 GUI。获许可后启动现有 `D:/cocos/creator/3.8.8/CocosCreator.exe --project D:/my-code/yier-bubu-gamehouse/client`，初始 PID 21304。前台中断时停止全部输入/新截图，用户恢复后继续。IAB 项目页关闭且视口 override reset；编辑器经正常菜单退出，同安装路径进程和预览监听归零。未采集无关窗口、录屏、安装依赖、修改系统设置或结束无关进程。历史日志/报告不覆盖。

## 5. 文档同步清单

- PLAN：P1-04 本地验收 done，P1 整体保留 in_progress；未提交/未关闭 Issue。
- FEATURES、FEAT-001/002：按实际证据补齐 AC-03 / AC-02，现有验收项完成；正式四款未实现。
- FEAT-003：AC-01/02/05 有真实 GUI 证据，AC-03/非法 ID 部分为 CLI；AC-04/06 未完成，整体仍 in_progress。
- ARCHITECTURE：只纠正已实现 dispose 销毁时序，未增加架构。
- FEAT-005、PRODUCT、README：单关可玩与精致画面优先；正式角色原稿/许可标准不变。
- TESTING、INDEX、CHANGELOG、本报告：真实操作、失败/修复/复验和证据导航。
- 素材台账、联机、AGENTS、DEV_ENVIRONMENT：本轮不变，无新增素材或全局规则。

## 6. 未解决问题、风险和下一步

必须修复的功能缺陷：活动模块随父节点停用时，主动脱离引发引擎错误；已最小修复，并经两次活动模块预览启停通过。剩余 6 条停止交界 IPC 警告未阻断操作，原堆栈保留，不把项目日志整体称为零警告。

从真实截图得到的五项非阻断美术/体验问题：

| 问题 | 画面依据 | 改进方向 |
| --- | --- | --- |
| 大厅四卡以文字为主，缺少玩法内容预览 | 00 / 26 | 正式游戏接入时使用真实地图/玩法缩略图 |
| 操作场大面积空白，角色、计数、目标分散 | 04 / 13 / 31 | 下一关让地图、敌我和战斗信息形成清晰视觉中心 |
| 目标、暂停、退出的浅绿圆角样式近似 | 04 / 13 | 区分主操作、次操作和退出层级 |
| 米白/浅绿层次偏弱，白熊与底色区分弱 | 02 / 04 / 19 | 统一森林配色、明暗层次及角色衬底 |
| 命中主要依靠数字增加和目标跳位，反馈单薄 | 03→04、09→10 及实际操作 | 后续关卡加入受击动作、音效和适量特效 |

五项不阻断 P1-04，本轮不重做美术。正式一二/布布造型、角色原画及正式动画依赖原作者原稿与可用许可；现有自制几何只作开发占位，不以新设计相似熊或 AI 角色作为最终素材。截图不证明手机体验、完整无障碍或动效品质合格。

下一阶段按 FEAT-005 的森林小屋单地图、单关、两防御/两敌人/三波、胜负重试及高品质 2D UI 推进。本轮止于 P1-04 本地交付，Git 操作和 Issue 关闭均未执行。
