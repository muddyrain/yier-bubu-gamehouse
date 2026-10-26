# 任务报告 — Issue #1 / P1-01 横屏优先基线

> 报告日期：2026-10-26（Asia/Shanghai） | 系统：Windows 11 / NT 10.0.26200 | 功能：FEAT-012（基线），关联 FEAT-001/002/005–008/010/011 | 分支：master，未创建新分支

## 1. 本次授权范围

用户已确认全项目首发横屏优先。本轮通过 GitHub 连接器读取 Issue #1 正文及全部评论，最新且唯一评论为 [横屏优先基线](https://github.com/muddyrain/yier-bubu-gamehouse/issues/1#issuecomment-6418493257)。按该补充在现有本地成果上最小修改，不按远端旧正文的“待开始”重建工程；评论作为需求来源，本轮执行权限以用户当前明确要求为准。

目标：将项目默认 Canvas 与既有 Startup 分别调整到 1280×720，平等展示一二白熊和布布棕熊，保持 UUID/对象/脚本生命周期绑定；新增 ADR-0003、配置/场景回归和全部受影响文档，执行安全 CLI，停在 Code Review。

开始前阅读 AGENTS、README/PLAN、DEV_ENVIRONMENT、FEATURES/受影响 Feature、DOC_RULES、WORKFLOW、架构/技术/产品/验证文档、当前任务报告与 ADR/报告模板，并检查工作区。使用 GitNexus、简洁改动、编码保护技能；发现无 GitNexus 工具，退回只读原生 Git。Superpowers 目录无 SKILL.md 实体，本轮不声称执行其流程。现有 63 个非忽略文件及 2 份私有配置共 65 个文件已建立前置哈希与必要备份，未暂存。

明确不做：重装/重建、正式大厅/选角/游戏玩法、联机服务器、本机账号/云服务配置修改；Cocos 编辑器、浏览器、预览、截图或任何图形自动化；微信构建/伪造 game.json；Git add/commit/push/PR/merge、关闭 Issue 或推进下一 Issue。本轮没有新的 GUI 许可，旧竖屏调试许可不延续。

## 2. 实际交付与代码影响

### 工程与测试（修改 4 文件）

| 文件 | 修改及原因 |
| --- | --- |
| `client/settings/v2/packages/project.json` | designResolution 改为 1280×720，fitWidth=true、fitHeight=true；完整显示启动内容，允许留边 |
| `client/assets/scenes/Startup.scene` | 原 18 对象结构上仅改 Canvas 中心 x/y、UITransform 宽高和相机半高 5 个数值字段，不重建场景 |
| `client/assets/scripts/SmokeTest.ts` | 双占位横向位置改为 -260/+260；双方名称区宽 320，标题/状态默认宽 600；其余内容和创建流程不变 |
| `tools/tests/test_project_baseline.py` | 新增默认横屏/适配策略、现有 Canvas/相机两项独立回归；原引用测试补 scene UUID 对应 meta、唯一启用 SmokeTest 及 node 回指 |

当前序列化配置明确为：Canvas UITransform **1280×720**，锚点 (0.5, 0.5)，中心 **(640, 360, 0)**；其关联正交相机 `_orthoHeight=360`、启用，Canvas 仍 `_alignCanvasWithScreen=true`。Widget 与其关联不变。这是对已有真实引擎序列化数据的定点修改，不是伪造新引擎生成文件；本轮未用引擎重新导入验证。

所有 4 份 `.meta` 原字节保留，场景 UUID `99890e7e-5115-4375-a998-fb5a5ff257cc`、脚本 UUID `6f20324f-5196-4e6f-8ca8-11eea63a6b4f` 未变。场景对象数量仍 18，所有 `_id`、`__id__` 和脚本类型引用保持；Canvas 上仍恰有一个启用的 SmokeTest。脚本的 `start(): void`、六个文字/两个 140×140 矩形、双方颜色和 console 启动标记均保留，未增加显式 start 调用或改成其他生命周期。**以上为源码/配置结论，横屏运行时自动 start 尚未实测。**

按代码坐标检查，名称区域在各自 x 中心 ±160 内，双方名称框不交叠；标题/状态纵向范围也位于设计画布内。这不包含字体像素、引擎自适配或缺口屏测量，不能当作画面通过。

### 文档（修改 20 文件，新增 2 文件）

新增：

- `docs/decisions/ADR-0003-landscape-first.md`：按 ADR 模板记录已接受的全项目横屏方向、替代方案、1280×720 基准、窄高玩法布局、适配代价和回退条件。
- `docs/reports/2026-10-26_issue-1_landscape-baseline.md`：本轮实现与验证报告。

修改的通用文档（11 文件）：

- `README.md`：真实工程参数、预览前置许可、新旧证据边界和回归范围。
- `docs/PRODUCT.md`：确认横屏方向，移除竖屏方向待定项，保留其他待定事项。
- `docs/TECH_STACK.md`：横屏设计基准、Fit 策略及后续 Landscape 构建要求。
- `docs/ARCHITECTURE.md`：当前 Canvas/相机/布局、后续统一方向与历史证据范围。
- `docs/TESTING.md`：横屏静态回归、旧竖屏历史、待许可 GUI 复验与不同宽高比检查。
- `docs/PLAN.md`：P1-01 继续 in_progress，停在横屏 Code Review；新横屏 GUI 未执行。
- `docs/FEATURES.md`：引用全项目方向基线，不改变各 Feature 状态。
- `docs/MULTIPLAYER.md`：未来房间/选角保持横屏与双方平等布局，仍为 P5 计划。
- `docs/REFERENCES.md`：复核官方项目设置、多分辨率适配、微信方向输出资料。
- `docs/INDEX.md`：ADR 和报告导航。
- `docs/CHANGELOG.md`：本轮变更记录及未验证范围。

修改的 Feature 文档（9 文件，仅范围/交互约束与证据）：

- `docs/features/FEAT-001-game-lobby.md`
- `docs/features/FEAT-002-character-selection.md`
- `docs/features/FEAT-005-tower-defense.md`
- `docs/features/FEAT-006-gold-miner.md`
- `docs/features/FEAT-007-merge-game.md`
- `docs/features/FEAT-008-snake-game.md`
- `docs/features/FEAT-010-wechat-platform.md`
- `docs/features/FEAT-011-multiplayer-room.md`
- `docs/features/FEAT-012-asset-and-quality.md`

删除：无。本轮共修改 24 个既有文件，新增 ADR 和报告 2 个；本机日志/备份在忽略的 `.local/validation/p1-01-landscape/`，不纳入 Git。既有行为受影响：**启动场景的方向、适配与横向布局变化**；不涉及正式游戏、选角、存档或网络逻辑。引擎/TypeScript/Node/锁文件和 F-01 忽略规则不变。

## 3. 实际验证（无验证则写 not_run）

当前环境是 Windows 11 / NT 10.0.26200，Python 3.13.5；沿用现有 Node 26.4.0、TypeScript 5.8.2 与真实 3.8.8 生成声明，没有安装或生成替代类型。证据目录记作 `E = .local/validation/p1-01-landscape/`。前置输入在 `E/issue-comment.md`、`before.json`、`history-before.json`、`status-before.log`，变更补丁与最终清单均在 E。

副作用复核：`validate.py` 仍只执行固定 Python docs/unit、Node tsc --noEmit；shell=False，docs/unit 各 30 秒、typecheck 60 秒且串行。单测只读 JSON、临时目录及原有有界 Git 检查，不导入/模拟 Cocos，也不运行浏览器。类型检查依赖已存在的本地编译器、真实生成 tsconfig 和四份声明；缺失仍 blocked，不启动编辑器补齐。该源码审阅结论不能替代 Mac 实机结果。

| OS | 实际命令 / 检查 | 结果 | 日志 / 证据 | 覆盖范围 / 限制 |
| --- | --- | --- | --- | --- |
| Windows | `git status --short --branch --untracked-files=all`、OS/文件/依赖入口核对 | `passed` | `E/status-before.log`、工具输出、before.json | 保护原有未提交内容，无初始化或安装 |
| Windows | 编辑前 encoding-guard 检查现有文本文件 | `passed` | `E/encoding-before.log` | 无可疑乱码/文本丢失 |
| Windows | 新增回归后、修改工程前 `python -B tools/validate.py unit` | `failed`（预期红灯） | `.local/validation/p1-01/20261026T143518.990143Z/unit.log` | 13 项中新增 2 项失败，分别捕获旧默认 720×1280 和旧 Canvas 中心；其余通过 |
| Windows | 改为横屏后 `python -B tools/validate.py unit` | `passed` | `.local/validation/p1-01/20261026T143547.590874Z/unit.log` | 13 项通过，无 skip，不运行游戏 |
| Windows | 元数据/场景定点差异、私有配置和旧证据哈希核对 | `passed` | `E/source-preservation.json`、`E/source-diff.patch` | 18 对象、所有 ID/4 meta、两私有配置及 F-01 规则保留，原报告/旧图形证据/ZIP 不覆盖 |
| Windows | `git -c core.excludesFile= check-ignore -v -- <两私有配置>`、`git ls-files --stage -- <两路径>` | `passed` | 工具输出；最终记录在 `E/git-private-ignore.log`、`git-private-tracked.log` | 禁用全局忽略仍命中 client/.gitignore 14/15 行，两配置不在索引 |
| Windows | `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261026T144125.115973Z/summary.json` 与同目录日志 | docs/unit/typecheck 全部 exit 0；13 项测试无 skip；文档 41 份、Feature 12 份、相对链接 74 个 |
| Windows | encoding-guard、`git diff --check`、`git diff --cached --quiet`、HEAD/status/清单与哈希终检 | `passed` | `E/final-checks.json`、`encoding-final.log`、`diff-check.log`、`git-status-final.log` | 仅 24 个既有文件变更/2 新增，无缺失；所有 Meta、4 历史报告、43 个旧本机证据文件（含原 ZIP）不变，HEAD 不变、0 暂存，两配置原字节且未跟踪 |
| Windows GUI | 横屏重新导入/完整画面、自动 start、停止/重启、不同宽高比 | `not_run` | 无新增截图或引擎日志 | 本轮未获具体 GUI 许可，主动停止在 CLI 阶段 |
| macOS | CLI 实机执行 | `not_run` | - | 本轮在 Windows；Mac 安全红线未放宽 |
| 微信真机 | Landscape 构建/game.json/启动/安全区/触控/性能 | `not_run` | - | 本轮不构建、不生成 game.json，不声称平台通过 |

读取资料时曾探测一个不存在的旧 ADR 文件名，随后用 `rg --files docs/decisions` 找到并读取现有 ADR；针对引擎源码的 fitWidth/fitHeight 搜索有无匹配退出码 1。均为只读探索，不计为验证通过，也没有启动引擎。

报告回填后的文档、编码和 diff 检查另存 `E/docs-final.log`、`encoding-final.log`、`diff-check.log`。本轮完整文件清单为 `E/changed-files.txt`，相对本轮开始前的补丁为 `E/round-diff.patch`；源码专用补丁为 `E/source-diff.patch`。这些材料不混淆之前未提交的改动，默认留在本机忽略目录中。

### 历史与当前证据的区分

- `docs/reports/2026-10-26_issue-1_windows-gui-acceptance.md` 及其 `.local/validation/p1-01-ac02/` 原始内容保留，仍仅证明修改前 720×1280 竖屏两次运行。
- 初始工程、复审准备、F-01 修复报告保留原文；原外部审查 ZIP 不重打包、不覆盖，其内容不代表本轮横屏成果。
- 当前横屏仅有静态/CLI 记录。没有横屏截图、引擎重新加载日志或 GUI passed 项；本轮也未重新测试旧竖屏。

## 4. 运行环境保护核对

本轮只读 Git/GitHub、官方技术文本与已安装引擎源码，修改授权文件并运行已审阅的 CLI；没有启动 Cocos 可执行程序、浏览器、微信工具、截图或图形自动化，也没有使用隐藏窗口/无头模式规避要求。没有安装依赖、修改系统设置、操作账号、上传文件或结束其他进程。

运行的 CLI 均等待退出并保留日志，固定子进程有超时；不建立常驻服务。没有本轮 GUI 子进程需要关闭。两私有配置原文件保留，报告未复制其内容。原有未提交文件和历史证据以哈希核对，本轮只改清单内的 24 文件并新增 2 文件。

## 5. 文档同步清单

- `docs/FEATURES.md`：已加统一横屏基线引用，Feature 状态不变；FEAT-012 仍 in_progress，正式产品功能仍 planned。
- 受影响 9 份 Feature：已同步方向约束、合成窄高容器、微信后续方向与新旧验收范围，未勾选正式功能通过。
- `docs/PLAN.md`：P1/P1-01 保持 in_progress，横屏 GUI not_run，停在 Code Review。
- `docs/CHANGELOG.md`、`docs/INDEX.md`：已追加变更与新 ADR/报告导航。
- PRODUCT/TECH_STACK/ARCHITECTURE/TESTING/README/MULTIPLAYER/REFERENCES：已同步；官方资料仅证明配置含义，不代替本项目实际验证。
- `AGENTS.md`、`docs/DEV_ENVIRONMENT.md`：未改，OS 安全红线不变。
- 旧 ADR、历史报告/截图、素材台账：未改；没有新增正式素材，几何占位颜色/大小不变。

## 6. 未解决问题、风险和下一步

横屏未经过本次 Cocos 导入和运行，静态数值正确仍可能存在实际显示或设备适配问题；完整显示策略也可能留边。旧竖屏日志中的 IPC/Widget/计时诊断保留，本轮没有引擎运行，不能宣布这些诊断已消失或被修复。

停止等待 Code Review。用户针对本次操作明确许可后，才可安排 Windows 3.8.8 横屏复验：完整画面、双方展示、自动 start、停止/重启及 16:9/4:3/超宽屏对比。后续微信 Landscape 输出、安全区/触控与性能在正式构建/真机阶段验证。未自动暂存、提交、推送、创建 PR、关闭 Issue 或开始新功能。
