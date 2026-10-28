# 任务报告 — Issue #2 / P1-02 横屏大厅与双主角基础界面

> 报告日期：2026-10-27（Asia/Shanghai） | 系统：Windows 11 / NT 10.0.26200 | 功能：FEAT-001，关联 FEAT-002/003/011/012 的边界 | 分支：master，未创建新分支

## 1. 本次授权范围

用户本轮授权执行 [Issue #2 / P1-02](https://github.com/muddyrain/yier-bubu-gamehouse/issues/2)：使用现有 3.8.8 工程实现 1280×720 横屏大厅、同等权重的一二（小白熊）/布布（小棕熊）、四款准确标明开发中的入口、有限且可返回的提示流程，并完成安全 CLI、回归及文档，停在 Code Review。

开始前完整读取 AGENTS、README/PLAN、DEV_ENVIRONMENT、FEATURES/FEAT-001/002/003/011、DOC_RULES、WORKFLOW、ARCHITECTURE、ADR-0003、ART_ASSETS/ASSET_LICENSES、TECH_STACK/TESTING 和任务报告模板。通过 GitHub 连接器读取 Issue 正文及评论（0 条）。Issue 的计划说明不代替用户当前开发授权，也不扩大 GUI/Git 权限。

起始 master 与 origin/master 同步，HEAD 为 `0b4bf910be92a0bad10a7dd2e14962676fbac3c8`，工作区干净、无暂存。67 个原跟踪文件、2 份私有配置及 519 个既有本机证据建立 SHA-256 基线。使用 GitNexus、karpathy-guidelines、encoding-guard、game-ui-ux 技能；没有 GitNexus 工具，退回原生只读 Git。Superpowers 安装目录无 SKILL.md 实体，不宣称执行缺失流程，未安装或修改技能。

明确不做：重建工程/重装引擎、改 P1-01 场景/Meta/探针/设置/原 13 测试、真选角/会话透传、可玩游戏、存档/继续、房间/分享/微信登录/联网框架、外部角色图/音乐、Git add/commit/push/PR/merge/关闭 Issue，或执行 P1-03。没有本轮单独 GUI 许可，不启动任何编辑器/预览/浏览器/截图/图形自动化；不用隐藏引擎或 headless 替代。

## 2. 实际交付与代码影响

新增 9 文件：

- `client/assets/scenes/Lobby.scene`
- `client/assets/scenes/Lobby.scene.meta`
- `client/assets/scripts/LobbyModel.ts`
- `client/assets/scripts/LobbyModel.ts.meta`
- `client/assets/scripts/LobbyView.ts`
- `client/assets/scripts/LobbyView.ts.meta`
- `tools/tests/lobby_model.test.cjs`
- `tools/tests/test_lobby.py`
- `docs/reports/2026-10-27_issue-2_landscape-lobby.md`

修改 11 文档：

- `README.md`：独立 Lobby 入口、真实前置条件及旧 Startup 证据边界。
- `docs/PLAN.md`：P1-02 授权范围及 Code Review 停点，P1-01 继续 done，P1/P1-02 仍 in_progress。
- `docs/FEATURES.md`：仅 FEAT-001 由 planned 进入 in_progress，其他 Feature 不变。
- `docs/features/FEAT-001-game-lobby.md`：四卡准确数据、单提示行为、好友/设置/继续边界；实际游戏往返仍待 FEAT-003。
- `docs/ARCHITECTURE.md`：纯模型与视图的职责、输入/节点所有权及未来接入点。
- `docs/ART_ASSETS.md`：同规格程序几何占位的设计单位/缩放和字体边界。
- `docs/ASSET_LICENSES.md`：DEV-P1-02 开发占位来源；正式 IP/名称授权仍 unverified。
- `docs/TECH_STACK.md`：使用现有 Node/TypeScript 执行纯逻辑，没有新依赖。
- `docs/TESTING.md`：新增测试、10 秒子进程及待许可 GUI 清单。
- `docs/INDEX.md`、`docs/CHANGELOG.md`：导航与本轮记录。

删除：无。安装/依赖/锁文件、原安全入口、原两个测试文件、全局设置均不改。新增日志、基线、一次性场景派生脚本和审查差异位于被忽略的 **E = `.local/validation/p1-02/`**。

### 入口、布局与源码来源

采用独立 Lobby 而非继续堆叠 SmokeTest：保留 P1-01 的可重跑探针及全部 UUID/原文件，同时让大厅具有自己的组件和导航所有权。`Lobby.scene` 以已有真实 Startup 序列化结构派生：保留 Canvas/Widget/正交相机及对象索引关系，只使用新的 Scene 名称、独立资产/场景内对象 ID 与 LobbyView 组件类型引用。新三份 Meta 是参照既有 importer 格式**手工创建的源码元数据，imported=false**，不是本轮引擎生成/导入的证据；UUID 及派生方式记于 E/scene-source.json。**真实引擎导入仍 not_run**，未为取得生成结果启动后台引擎、伪造 SDK 声明或写入构建产物。

Lobby 沿用 1280×720、Fit Width/Height 和相机半高 360，不改共享设置。内部中心参照容器等比 fit；左侧双主角区域、右侧 2×2 卡片，头部帮助/设置，底部明确暂无可继续的存档。白/棕头像都使用同一 136×136 设计单位容器和绘制函数，名称/身份相同字号，无图片/字体/音频文件导入。这是原创通用几何占位，不冒充正式角色形象或美术授权。

目录稳定 ID / 显示名 / 状态：

| ID | 名称 | 状态 / 行为 |
| --- | --- | --- |
| tower-defense | 一二布布守护小屋 | coming-soon / 开发中，仅介绍 |
| gold-miner | 一二布布黄金矿工 | coming-soon / 开发中，仅介绍 |
| merge | 一二布布合成乐园 | coming-soon / 开发中，仅介绍 |
| snake | 一二布布贪吃蛇 | coming-soon / 开发中，仅介绍 |

没有继续按钮或假进度。好友入口标“敬请期待”，设置明确暂无可调整项，帮助说明真实交互。单个提示层在 onLoad 构建一次，打开/关闭只改文本/可见性；提示开启时禁用首页按钮并覆盖输入，关闭/Escape 返回，Tab/方向键/Enter 有基本焦点导航。onEnable 配对绑定，onDisable 用同一回调解除并复位，onDestroy 释放根节点；不使用 update 轮询、定时器或每次打开的新订阅。以上是源码设计，不等同于真实 UI/节点泄漏验收。

后续可在稳定 GameId、角色身份和导航动作上接入 FEAT-002/003；本轮没有 GameSession.selectedCharacter、GameRegistry、RoomService、服务器或空游戏目录。新大厅的构建启动场景设置留待实际构建，当前明确为编辑器中手动打开的独立 Lobby 入口。

既有行为受影响：原 Startup 行为不变；新增独立大厅供后续导入/预览。本轮没有将新的游戏入口发布为可玩内容。

## 3. 实际验证（无验证则写 not_run）

环境：Windows NT 10.0.26200、Python 3.13.5、Node 26.4.0、锁定 TypeScript 5.8.2；沿用现有 Cocos 3.8.8 真实生成的配置/声明，仅通过文件读取与 tsc 使用，不执行引擎。

| OS | 实际命令 / 步骤 | 结果 | 日志 / 证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows | 起始 Git 状态/HEAD/文件与依赖核对、基线哈希 | `passed` | E/status-before.log、before.json、工具输出 | 干净工作区；67 跟踪/2 私有/519 既有本机文件 |
| Windows | 编辑前 encoding-guard；原 `python -B tools/validate.py all` | `passed` | E/encoding-before.log；`.local/validation/p1-01/20261027T120639.899231Z/` | 原 docs/unit/typecheck 通过，13 回归通过 |
| Windows | 新测试先运行 `python -B tools/validate.py unit` | `failed`（预期红灯） | `.local/validation/p1-01/20261027T120924.752942Z/unit.log` | 新资源/模型尚不存在，两项捕获缺文件；原 13 项通过 |
| Windows | 无引擎场景/Meta 源码派生 | `passed`（文件操作） | E/scene-authoring.log、scene-source.json | 只证明源数据已写入；不代表编辑器已导入或场景已运行 |
| Windows | 首次实现后 `python -B tools/validate.py all` | `failed` | `.local/validation/p1-01/20261027T121126.797261Z/` | docs/15 unittest 通过；tsc 拒绝 ES2015 中不存在的 padStart/Array.includes，3 个 TS2550 |
| Windows | 改为 ES2015 字符串/indexOf 后 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261027T121208.290065Z/` | 15 unittest（含 9 组 Node 断言）及真实 tsc 通过；未改 target/lib 或 SDK |
| Windows | 最终文档/代码同步后 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261027T121935.070482Z/summary.json` 及同目录日志 | docs/unit/typecheck 均 exit 0；44 Markdown、12 Feature、86 相对链接；15 unittest 无 skip（含 9 组 Node 断言） |
| Windows | 全部 20 新增/修改文件编码/敏感内容，真实 Git status/diff/check-ignore/ls-files，原字节保留核对 | `passed` | E/final-checks.json、encoding-final.log、sensitive-scan.json、private-ignore.log、private-tracked.log、preservation.json | 仅 11 文档修改/9 新增/0 删除；原 client/、tools/、私有配置与 519 历史文件未变；禁用全局忽略仍命中项目规则；HEAD 不变/索引空 |
| Windows GUI | Lobby 导入、三比例实际画面、点击/键盘/遮罩、各入口三次进出、禁用/重启/退出 | `not_run` | 无本轮截图或引擎日志 | 本次没有单独许可，不开窗口，不采集屏幕；旧 Startup 证据不抵扣 |
| macOS | docs/unit/typecheck 实机运行 | `not_run` | - | 只有脚本副作用复核，没有 Mac 实机结果 |
| 微信 / 设备 | 构建、方向/game.json、触控、安全区、性能 | `not_run` | - | 没有实际构建或真机，本轮不适配系统缺口区 |
| 集成 | 真选角、真正子游戏场景往返、保存/继续、好友房 | `not_run` | - | 对应功能未实现，不制造空场景测试替代 |

新增 Node 测试只将无 cc 导入的真实 LobbyModel 在内存 transpile 后执行，使用 node:assert，不 mock 引擎/渲染器。9 组检查覆盖目录、身份及同尺寸、四卡介绍返回、说明入口真实性、7 个入口各 3 次单提示循环、非法 ID 可返回、主要区域边界/不交叠、16:9/4:3/21:9 数学等比容纳及留边、焦点环绕。Python 中新增 2 项（逻辑子进程及资源引用），原 13 项保留，共 15 unittest。逻辑循环通过**不能证明** Cocos 订阅/节点无泄漏、实际裁切或文字可读性。

安全性复核：原 validate 的 docs/unit 各 30 秒、typecheck 60 秒、串行和 shell=False 不变；新增 Node 子进程 10 秒，无子进程/网络/浏览器/引擎依赖，所有执行等待退出。新逻辑测试需要已有 Node/锁定 TypeScript，缺失时测试失败，不自动安装；typecheck 缺真实生成配置/声明仍 blocked。原日志目录前缀 p1-01 是沿用原工具行为，本轮用精确 UTC 目录及 E 的调用记录区分。

报告回填后再执行有界 `python -B tools/check_docs.py` 及全文件编码/Git/保留终检，记录 E/docs-final.log 与 final-checks.json。Code Review 材料为 E/changed-files.txt、review.patch（原生 Git 的既有文件 diff 加上未跟踪文件的文本统一差异，没有暂存），逐文件 SHA-256 清单为 E/file-manifest.json。所有证据留在本机，不自动打包、上传或提交。

## 4. 运行环境保护核对

无 GUI、浏览器、预览、截图、后台引擎或图形自动化；未检查/操作无关桌面或用户游戏，不使用旧 GUI 许可。没有安装依赖、改系统配置/权限/账号、修改私人配置、上传截图或结束无关进程。所有运行的 CLI 都是有界的短时进程，无本轮 GUI 子进程需清理。

原 Startup、SmokeTest、全部原 Meta/settings、原安全入口/13 测试和锁文件按哈希保留；两份私有配置只记录 hash，不复制内容。历史报告和 519 个既有本机文件不重写/删除，所有实际失败保留于上表原始日志。HEAD 不变且索引空；不沿用上一轮 Git 提交授权。

## 5. 文档同步清单

- FEAT-001：同步本轮交互/范围、有限数据/导航及验证边界，未勾选未经 GUI/集成验证的 AC；AC-03 仍待 FEAT-003。
- FEATURES：FEAT-001 in_progress；FEAT-002/003/011 仍 planned，FEAT-012 仍 in_progress。
- PLAN：P1-01 done、P1/P1-02 in_progress，当前停在 Code Review，GUI 未执行。
- ARCHITECTURE：独立场景、纯模型/视图分工、输入所有权与后续边界。
- ART_ASSETS / ASSET_LICENSES：几何设计单位、来源及正式角色授权未完成。
- README / TECH_STACK / TESTING：真实入口、Node/TS 逻辑前置条件、原回归与新增覆盖，不夸大图形结果。
- CHANGELOG / INDEX：记录和导航；新增本报告，不建立重复 TODO/CONTEXT。
- AGENTS / DEV_ENVIRONMENT / ADR-0003 / PRODUCT / MULTIPLAYER：不改，没有新产品/平台安全/方向/联机决策；历史 P1-01 报告均保留。

## 6. 未解决问题、风险和下一步

新大厅源码已交付，尚需 Code Review 和单独获许可的 Windows 3.8.8 导入/运行验收。新增 Meta 的实际导入、字体字形、图形裁切/触达、真实反复开关/组件禁用恢复及节点/订阅清理未验证。三比例数学测试只证明计算策略，不证明实际引擎画面通过。手机安全区/触控/性能、微信构建和真正游戏往返也未完成。

后续获本次具体 GUI 许可后，仅操作项目窗口：导入 Lobby、核对新 UUID 和日志；比较 1280×720、4:3、21:9；四卡/好友/帮助/设置各打开关闭至少 3 次，验证遮罩/返回/键盘、禁用/重启和退出，保留错误/警告和本轮进程清理。该清单不是当前授权，不提前执行。

FEAT-001 仍未全部完成，不能因源码/静态通过标 done。停止等待 Code Review；不暂存、不提交、不推送、不创建 PR/merge、不关闭 Issue，不开始下一项功能。
