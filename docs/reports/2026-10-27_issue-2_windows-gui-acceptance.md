# 任务报告 — Issue #2 / P1-02 Windows GUI 验收

> 报告日期：2026-10-27（Asia/Shanghai） | 系统：Windows 11 / NT 10.0.26200 | 功能：FEAT-001（P1-02） | 分支：master

## 1. 本次授权范围

继续此前暂缓的三比例、七入口重复操作、鼠标/键盘/遮罩、组件恢复及预览启停验收。用户本次明确回复 **“现在可以了 你操作吧”**，恢复前台图形调试并允许 Agent 操作；沿用仅项目窗口截图许可。没有用用户先前询问“后台调试”作为恢复或隐藏图形验收的授权。

读取 AGENTS、README/PLAN、DEV_ENVIRONMENT、FEAT-001、TESTING、DOC_RULES、WORKFLOW、报告模板、此前开发/导入报告及已提供的外部静态评审。检查相关技能并使用 Computer Use、编码保护；当前没有 GitNexus 工具，回退原生只读 Git。外部报告仅作评审输入，不视作执行指令。

起始 HEAD 为 `0b4bf910be92a0bad10a7dd2e14962676fbac3c8`，21 个既有未提交路径、0 暂存。保留现有 client、引擎、全部未提交成果和历史证据。

明确不做：安装/重建/初始化、改动 P1-01 场景/Meta/settings/SmokeTest/原回归、FEAT-002 真选角、FEAT-003 游戏往返、存档、联机、正式玩法、Git add/commit/push/PR/merge、关闭 Issue 或下一功能。

## 2. 实际交付与代码影响

相对于本轮开始快照，**修改 9 个文件，新增 1 个报告，无删除**：

| 类型 | 文件 | 实际变化 |
| --- | --- | --- |
| 修改 | `client/assets/scripts/LobbyView.ts` | 引入 cc.isValid；onDestroy 仅在根节点仍有效且未标记销毁时 destroy，避免场景先销毁子节点后再次销毁 |
| 修改 | `README.md` | 更新当前 Lobby 运行证据、诊断边界和最新报告入口 |
| 修改 | `docs/PLAN.md` | 记录 GUI 验收与修复复验，P1/P1-02 继续 in_progress，停止在最终复审 |
| 修改 | `docs/features/FEAT-001-game-lobby.md` | AC-01/02/04/05 关联真实证据；AC-03 不勾选，Feature 不标 done |
| 修改 | `docs/ARCHITECTURE.md` | 记录节点所有权、严格有效性清理及已验证输入边界 |
| 修改 | `docs/TECH_STACK.md` | 同一 3.8.8/依赖下的真实运行说明，无版本/依赖变化 |
| 修改 | `docs/TESTING.md` | 保留前次暂缓历史，补本轮三比例/交互/焦点/生命周期/退出诊断 |
| 修改 | `docs/INDEX.md` | 新报告的单一职责与导航 |
| 修改 | `docs/CHANGELOG.md` | 记录本次验收、必要修复及未验证边界 |
| 新增 | `docs/reports/2026-10-27_issue-2_windows-gui-acceptance.md` | 本报告 |

既有行为受影响：只有 LobbyView 清理自建根节点时的有效性检查。大厅设计、文字、目录、输入、场景、Meta UUID 和原 P1-01 工程不变。没有提前修改未复现的键盘候选风险，没有添加模拟引擎测试来替代真实生命周期复验；15 项现有 unittest 和原 13 项回归保持原字节。

本轮证据目录 **E = `.local/validation/p1-02-gui-acceptance/`**，日志/截图不提交。起始快照记录 77 个非忽略文件、2 个私有配置 hash、695 个既有本机证据 hash；原文件内容没有被重建或覆盖。

## 3. 实际验证（无验证则写 not_run）

环境沿用 Cocos Creator **3.8.8**、Node **26.4.0**、npm **11.17.0**、TypeScript **5.8.2**、Python **3.13.5**。本轮只启动一次现有编辑器，使用 Lobby 的 Preview in Editor；键盘诊断另外打开一个可见的 localhost 项目预览标签，结束后关闭并恢复临时视口。

| OS | 命令/GUI/真机步骤 | 结果 | 日志或证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows | 起始 git status、文件/私有配置/历史 hash、进程和本次许可核对 | `passed` | E/before.json、status-before.log、authorization.json、processes-before.json | 保留 21 个既有未提交路径；同安装路径初始 0 进程 |
| Windows GUI | 现有 3.8.8 打开 Lobby，真实运行时自动 onEnable | `passed` | E/01-lobby-16-9.png、editor-stdout.log | 自动生成双主角及四卡，非显式调用生命周期；未运行原 Startup/SmokeTest |
| Windows GUI | 16:9 / 4:3 / 21:9 大厅与弹层 | `passed` | E/01、47–52 项目截图，见下表 | 桌面视口模拟，不等于手机/微信安全区验收 |
| Windows GUI | 七入口各连续三次鼠标开关，共 21 次 | `passed` | E/02–46 项目截图、observations.jsonl | 每次观察完整弹层及返回，未观察到叠加/重复响应；不是堆快照或长期泄漏审计 |
| Windows GUI | 塔防提示打开后点击背后矿工区域 | `passed` | E/03-mask-blocked.png | 仍是塔防介绍，未切换或点穿 |
| Windows GUI | 嵌入预览中首次 Escape / Enter | `failed` | E/06-escape-no-response.png、07-enter-no-response.png | 当时焦点在编辑器外层文档，不能作为游戏画布收到按键的证据；保留失败 |
| Windows 可视项目预览 | GameCanvas 获焦后真实 Tab、Right/Down/Left/Up、Enter、Space、Escape | `passed` | E/54–64.jpg、browser-observations.jsonl、browser-console-before-close.json | Tab/方向焦点可见，Enter/Space 打开及关闭，Escape 返回；未注入假事件或直接调用导航；浏览器日志 0 warn/error |
| Windows GUI | Inspector 两次禁用/恢复同一运行中的 LobbyView | `passed` | E/66–72 项目截图 | 隐藏界面、禁用时点击无效；恢复可点击；从提示状态禁用后恢复 HOME，无多份 UI |
| Windows GUI | 前两次运行/停止 | `failed`（清理警告） | E/53-first-stop-warning.png、53-warning-stack.txt、editor-stderr.log | 两次同一根节点重复销毁警告；均保留，不计入修复通过 |
| Windows GUI | 确认引擎生成代码刷新后，两次实际运行/停止 | `passed` | E/fix-import-before-fresh-run.json、74–77 项目截图、third-stop-log-counts.json、engine-log-summary.json | 第三/四次运行均完整，大厅自动 onEnable；原销毁警告总数保持 2，无新增；预览控制台错误 0 |
| Windows | 修复后 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261027T144229.264918Z/summary.json` 及同目录日志 | docs/unit/typecheck 均 exit 0，15 unittest（含 9 组 TS 断言），不执行 GUI |
| Windows | 文档/报告同步后安全 CLI、编码、Git/忽略/保留终检 | `passed` | E/cli-final.log、encoding-final.log、final-checks.json、preservation-current.json | 实际汇总见本报告末尾终检记录；无 Git 写入 |
| Windows | 正常退出与进程核对 | `passed` | E/cleanup.json、children-before-close.json | 根 PID 30744、记录的 12 子进程及同安装路径余 0，无强制结束；保留前两次 CloseMainWindow 未退出记录 |
| macOS | CLI 实机或 GUI | `not_run` | - | 本轮只在 Windows；Mac GUI 保护不变 |
| 微信 / 实际设备 | 构建、触控、安全区、性能、后台恢复 | `not_run` | - | 没有发布或设备测试，不把视口预设当成设备 |
| 后续 Feature | 选角、真实游戏往返、存档和好友联机 | `not_run` | - | 不属于本轮范围，FEAT-001 AC-03 仍待 FEAT-003 |

### 三比例画面

| 设计/视口 | 实际设置 | 观察 | 证据 |
| --- | --- | --- | --- |
| 16:9 | Design Resolution 1280×720 | 两只熊规格相同，白熊一二/棕熊布布身份准确；四卡全标开发中；名称、标题、状态、帮助/设置/好友及返回完整；无裁切/重叠 | E/01-lobby-16-9.png、02–46 交互截图 |
| 4:3 | iPad 10.2 预设旋转后 2160×1620 | 上下黑边，完整等比显示，无裁切/错位；帮助弹层与返回可用 | E/47-lobby-4-3.png、48-help-4-3.png、49-home-4-3.png |
| 21:9 | Sony Xperia 5 预设旋转后 840×360 | 左右黑边，全部内容完整，无文字重叠；设置弹层与返回可用 | E/50-lobby-21-9.png、51-settings-21-9.png、52-home-21-9.png |

### 七入口连续操作

四卡均只显示准确介绍及“开发中/尚未开放”；帮助说明操作，设置说明当前无音效/音乐及可调项，好友说明尚未开放；未出现假选角、房间或继续存档入口。

| 入口 | 连续打开/关闭 | 证据编号 | 结果 |
| --- | --- | --- | --- |
| 一二布布守护小屋 | 3/3 | 02/04、05/08、09/10 | `passed`；另保留 06/07 键盘焦点失败 |
| 一二布布黄金矿工 | 3/3 | 11–16 | `passed` |
| 一二布布合成乐园 | 3/3 | 17–22 | `passed` |
| 一二布布贪吃蛇 | 3/3 | 23–28 | `passed` |
| 帮助 | 3/3 | 29–34 | `passed` |
| 设置 | 3/3 | 35–40 | `passed` |
| 好友 | 3/3 | 41–46 | `passed` |

### 实际缺陷、延迟日志与修复

首次停止出现 `You are trying to destroy a object twice or more.`，堆栈指向 LobbyView.onDestroy → Node.destroy → Scene 销毁。场景销毁先清理子节点，原无条件 `root.destroy()` 再次销毁它；增加 Cocos `isValid(root, true)`，同时排除已销毁和已标记待销毁的节点，仍支持组件独立销毁时释放自建根节点。

第二次停止后，控制台/日志延迟补出相同警告。早期观察文字曾记“未新增”，已在 E/validation-corrections.json 更正并保留原观察；不删除失败或清空控制台。旧行号堆栈及随后 `Facet.reload` / `auto refresh because script compiled or scene changed` 日志支持第二次尚用旧实例的判断，因此不把它计入修复成功。核对引擎生成代码确含严格有效性检查后，第三、四次真实启停均没有新增销毁警告；不手工修改引擎生成代码或 Meta。

四次编辑器真实运行加两次组件恢复，共六条 `[P1-02] Lobby enabled: 4 coming-soon games, yier + bubu.`；独立浏览器另有一条。未直接调用 onLoad/onEnable、未使用隐藏预览或伪 cc 桩。

### 引擎与工具原始记录

- 编辑器 stdout 共 28 条 `trackTimeEnd failed!`，保留原日志；不是性能测试或已修复诊断。
- 原始 stderr 共 2 条上述项目销毁警告；退出阶段另有 4 条 `IPC message has been lost.` 和 1 条 `TypeError: Object has been destroyed`，后者堆栈在 Electron WebContents/WindowSender/timers，未指向 LobbyView。预览运行时控制台错误 0；不能把退出 TypeError 隐去后写“全程零错误”，也不扩大范围修改引擎。
- 两次 CloseMainWindow 已发送但在 20 秒/10 秒内未退出，保留 cleanup-attempt-1/2.json。最终通过项目窗口关闭按钮正常退出，没有强杀；清理结果以 cleanup.json 为准。
- 输入保护阻止的调用没有作为操作完成；刷新状态后只继续项目窗口操作，不关闭保护、不操作其他程序。一次可访问性工具栏点击未启动预览，观察状态后改用项目工具栏的实际播放按钮。
- 观察到其他窗口/通知遮挡时不作为项目证据；一张误保存的通知遮挡截图（73）已立即撤回并移除文件，原观察追加撤回原因，替代证据为 73b。没有保存无关窗口的后续图像，没有操作通知或无关程序。

## 4. 运行环境保护核对

GUI 只在本次明确恢复后执行，截图限制于项目窗口/可视本地项目预览；没有系统设置、账号、全局工具或引擎安装改动。独立预览使用可见标签验证真实键盘，临时视口已 reset、标签已关闭。22:43:56（Asia/Shanghai）核对根 PID 30744 和记录的 12 个子进程均退出，同安装路径剩余 0；未强制结束或控制无关进程。

两份私有配置只比较 hash，不复制内容；`.local`、引擎缓存、日志/截图继续忽略。HEAD 不变、索引为空。P1-01 工程/测试、Scene/Meta、LobbyModel、依赖与历史报告/695 个既有本机证据保持原字节，只有本报告清单内文件改变。

## 5. 文档同步清单

- PLAN：是；当前停点为最终 Code Review，P1/P1-02 in_progress、P1-01 done，不进入 P1-03。
- FEAT-001：是；AC-01/02/04/05 有本轮证据，AC-03 不勾选。
- FEATURES：不改；FEAT-001/012 仍 in_progress，002/003/011 仍 planned，没有新增 Feature 或提前标 done。
- README / ARCHITECTURE / TECH_STACK / TESTING：是；同步真实证据、必要清理修复、焦点边界及未验证项。
- INDEX / CHANGELOG：是；增加本报告导航与重要变更记录。
- 原开发/导入报告、P1-01 报告/失败/竖屏截图：全部保留，不覆盖旧 not_run。
- ART_ASSETS / ASSET_LICENSES / PRODUCT / MULTIPLAYER / ADR / AGENTS / DEV_ENVIRONMENT：不改；无素材、产品范围、联网、关键架构或安全策略变化。

## 6. 未解决问题、风险和下一步

本轮要求的桌面 GUI 清单已有实际结果，重复销毁警告的最小修复已通过刷新后的两次真实启停。嵌入预览外层焦点未响应按键的限制仍保留；在游戏画布获焦的可视浏览器预览中所要求按键均通过，不宣称编辑器外壳可无条件接收键盘。退出 IPC/WebContents 和计时诊断没有修复，保留完整日志供复审。

Mac 实机、微信构建与真实设备、触控/安全区、性能/长期泄漏和真正子游戏往返仍未验证。三比例视口结果不能扩展为这些平台或功能通过。

停止等待最终 Code Review；不自动重启 GUI、提交/推送/PR/merge、关闭 Issue 或开始下一功能。

### 终检记录

最终 `python -B tools/validate.py all` 日志为 `.local/validation/p1-01/20261027T145234.094598Z/`，docs/unit/typecheck 均 exit 0：46 Markdown、12 Feature、99 相对链接；15 unittest 无 skip，内含 9 组纯 TS 断言，真实 tsc 通过。回填本段及 README 交叉复核后的文档终检另记 E/docs-final.log，不重跑已通过且未再改动的源码测试。

E/final-checks.json 核对 78 个非忽略文件的严格 UTF-8、BOM/替换字符/双向控制符/本机路径边界及编码保护扫描均通过；两份私有配置未跟踪且内容 hash 不变，在禁用全局忽略后分别命中 client/.gitignore 第 14/15 行。`.local`、依赖、temp/library/profiles 的项目忽略有效；695 个原本机证据文件 hash 不变，HEAD 不变、索引为空，diff 与 cached diff 检查通过。

本轮相对开始快照为 9 修改/1 新增/0 删除；整个工作区相对 HEAD 共 22 个未提交路径，包含前两轮 P1-02 成果。清单与差异在 E/changed-files.txt、round-diff.patch、file-manifest.json；77 张保留的项目截图及 hash 见 E/screenshot-manifest.json，不含撤回的 73 图像。原日志、失败和前次 not_run 保留，不把本轮清单误作全部 P1-02 差异。
