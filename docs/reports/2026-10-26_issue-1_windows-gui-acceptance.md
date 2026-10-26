# 任务报告 — Issue #1 / P1-01 AC-02 Windows 图形运行验收

> 报告日期：2026-10-26（Asia/Shanghai） | 系统：Windows NT 10.0.26200 | 功能：FEAT-012（工程质量基线） | 分支：master，未创建新分支

## 1. 本次授权范围

本轮只验收现有 Cocos Creator 3.8.8 工程中的 `Startup.scene`：实际显示、双角色几何占位、运行时自动 `SmokeTest.start()`、720×1280 竖屏、阻断性脚本错误、停止与再次启动，以及本轮进程清理。

用户在本轮确认：**“现在允许，并允许保存仅项目窗口截图”**。许可前只进行准备和只读检查；许可后使用 Windows 前台操作项目窗口，以 Preview in Editor 进行实际游戏运行。仅保存 Cocos 项目窗口证据，没有以隐藏窗口代替验收，也没有启动浏览器或采集无关桌面。

开始前检查 Git 状态并读取 AGENTS、README、PLAN、DEV_ENVIRONMENT、FEATURES/FEAT-012、WORKFLOW、DOC_RULES、TESTING、当前任务报告及模板。沿用 Computer Use 与编码保护技能。GitNexus 工具不可用，使用只读原生 Git；当前 Superpowers 目录没有可读取的 SKILL 实体。工作区已有前序成果，全部保留，不清理或覆盖。

明确不做：安装/升级 Cocos、重建工程、功能修复或新增玩法、微信构建/真机、Mac GUI、Git add/commit/push/PR/merge、关闭 Issue 或推进下一 Issue。P1-01 保持 `in_progress`，等待用户最终 Code Review。

## 2. 实际交付与代码影响

本轮新增：

- `docs/reports/2026-10-26_issue-1_windows-gui-acceptance.md`：本报告，记录实际 AC-02 验收与边界。
- `.local/validation/p1-01-ac02/`：许可记录、前后文件哈希、项目窗口截图、原始引擎日志及进程清理记录；已忽略，不纳入 Git。

本轮修改的既有文件（仅文档）：

- `docs/PLAN.md`：更新实际验收证据与待最终复审的停点，阶段和任务仍为 in_progress。
- `README.md`：真实预览方式、当前证据及交付边界。
- `docs/TESTING.md`：实际运行/停止/重启方法、证据范围和诊断说明。
- `docs/TECH_STACK.md`、`docs/ARCHITECTURE.md`：修正“实际运行尚未验证”的旧快照；技术选择、架构和功能均不改变。
- `docs/features/FEAT-012-asset-and-quality.md`：区分 Startup 图形通过与正式素材/动作/性能尚未验证。
- `docs/INDEX.md`、`docs/CHANGELOG.md`：报告导航和本轮记录。

删除：无。没有修改场景、脚本、meta、配置、依赖或测试代码。GUI 结束、文档编辑前比对起始 64 个文件的 SHA-256，全部字节相同，无缺失、无新增非忽略文件；包括两份本机配置 `cocos-service.json` 和 `information.json`。历史报告和原审查 ZIP 保留。既有行为受影响：否。

## 3. 实际验证（无验证则写 not_run）

环境：现有 Cocos Creator **3.8.8**（本机可执行文件 FileVersion/ProductVersion 核对一致）、Node **26.4.0**、npm **11.17.0**、Python **3.13.5**。没有安装依赖或修改系统设置。本轮 GUI 证据目录以下简写为 `E = .local/validation/p1-01-ac02/`，实际完整路径仅保留在本机，不复制账号或私人配置内容。

### AC-02 实际操作与结果

打开现有 `client/` 后，标题为 `Startup.scene - yier-bubu-gamehouse - Cocos Creator 3.8.8`，Canvas 上已有 SmokeTest 组件标识。选择 **Preview in Editor** 并点击运行；停止返回 Scene 后再次点击运行，第二次观察完毕后再次停止并关闭编辑器。未调用脚本 API 或手工执行 `start()`。

| OS | 步骤 / 检查 | 结果 | 证据（相对 E） | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows | 打开已有 3.8.8 工程与 Startup 场景 | `passed` | `01-editor-startup.jpg`、`editor-stdout.log` | 引擎识别现有工程，无重建 |
| Windows | 第一次实际预览显示场景 | `passed` | `03-first-preview-fit.jpg`、`04-first-preview-console.jpg` | 标题、启动说明、两角色标签和状态说明均可见 |
| Windows | 一二白色、布布棕色几何占位 | `passed` | `03-first-preview-fit.jpg`、`06-second-preview-fit-console.jpg` | 同规格矩形、左右并列；不是正式美术或基础动作验收 |
| Windows | 运行时自动触发 SmokeTest.start() | `passed` | `automatic-start-markers.log`、`editor-stdout.log` | 两次实际运行各输出一次启动标记，总计 2 次；没有显式调用 |
| Windows | 720×1280 竖屏布局完整显示 | `passed` | `03-preview-accessibility.txt`、`06-second-preview-accessibility.txt` 及对应截图 | 预览控件明确显示 Design Resolution (720x1280)，Fit 缩放 67%；不代表其他设备适配 |
| Windows | 无阻断性脚本错误 | `passed` | `04-first-preview-console.jpg`、`06-second-preview-fit-console.jpg`、stdout/stderr | 两次画面正常，控制台错误计数 0；日志并非完全无诊断，详见下文 |
| Windows | 停止、再次运行，再次停止 | `passed` | `05-first-preview-stopped.jpg`、`06-second-preview-fit-console.jpg`、`07-second-preview-stopped.jpg` | 返回 Scene 后第二次自动启动成功；两次均可正常停止 |
| Windows | 正常关闭本轮编辑器并核对残留 | `passed` | `cleanup.json`、`processes-after.json`、`children-cleanup.json` | 主 PID 34436 已退出，同安装路径 Cocos 进程 0，已记录的 12 个直接子进程均退出 |

初始 1100×700 编辑器内的预览面板无法容纳 100% 的完整设计画布，最初截图存在黑区/裁切，保留在 `02-first-preview-unfitted.jpg`。最大化后以 Fit to current view 调整查看缩放，完整竖屏随即可见；没有改变设计分辨率或任何源码。预览栏的 FPS=60 为设置值，未作为实测帧率。

两次自动输出的原始标记均为：

```text
[PreviewInEditor] [P1-01] SmokeTest started: yier + bubu placeholders.
```

### 引擎诊断与操作异常

- 启动 stderr 出现 3 条 `interface_endpoint_client.cc(722)` 的 `blink.mojom.WidgetHost/Widget` 消息拒绝诊断。
- stdout 存在 14 条 `trackTimeEnd failed! Can not find the track time ... start`，涉及 asset-db、main-window 和 hierarchy 的计时项。
- 停止预览时出现两次 `[PreviewInEditor] IPC message has been lost.` 警告；第二次实际运行已在第一次警告后成功完成。第二次停止后警告计数为 2、错误计数仍为 0。
- 一次点击被工具的非目标窗口保护拦截，未向无关窗口发送点击；重新激活 Cocos 并刷新窗口状态后才继续，没有捕获无关应用画面。

这些诊断的原始 stdout/stderr 全部保留，汇总见 `runtime-summary.json`。实际没有阻断本次显示、自动生命周期或重启，但根因未进一步定位；没有把“脚本错误计数 0”写成“引擎日志无错误”，也没有修改功能去隐藏警告。

### CLI、文件保留与未执行项

| OS | 实际命令 / 检查 | 结果 | 日志 / 证据 | 覆盖范围 |
| --- | --- | --- | --- | --- |
| Windows | 起始及 GUI 后 `git status --short --branch --untracked-files=all` | `passed` | 本轮工具输出、`E/git-status-after-gui.txt` | 保留原有全部未提交成果，无暂存动作 |
| Windows | GUI 后起始 64 文件 SHA-256 / 文件清单比对 | `passed` | `E/before.json`、`E/preservation-after-gui.json` | 64 文件全部相同，未删除或覆盖本机配置 |
| Windows | `git check-ignore -v client/settings/v2/packages/cocos-service.json client/settings/v2/packages/information.json` | `passed` | `E/git-private-ignore.txt` | 命中 client/.gitignore 第 14/15 行，F-01 规则保留 |
| Windows | 文档编辑前 encoding-guard 静态扫描 | `passed` | `E/encoding-before.log` | 既有 8 份待更新文档无可疑乱码/文本丢失 |
| Windows | `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261026T141234.739539Z/summary.json` 及同目录日志 | docs / unit / typecheck 全部 exit 0；11 项测试无 skip |
| Windows | encoding-guard、`git diff --check`、`git diff --cached --quiet`、HEAD/status/ls-files 与文件哈希终检 | `passed` | `E/final-checks.json`、`E/preservation-final.json` 及同目录日志 | 仅 8 份既有文档变更、新增本报告；无缺失/意外文件变更；HEAD 不变、0 暂存，两配置未跟踪且原字节，原审查 ZIP 哈希不变 |
| macOS | CLI 实机执行 | `not_run` | - | 本轮无 Mac 实机，未启动 Mac GUI |
| Windows | 浏览器/模拟器预览、完整编辑器退出后再打开 | `not_run` | - | 本轮采用编辑器内两次预览；未额外覆盖其他运行方式 |
| 微信真机 | 构建、启动、触控、性能 | `not_run` | - | 不属于本次 Startup 验收 |
| Windows / 设备 | 性能、内存、正式玩法与存档 | `not_run` | - | 当前仅启动测试，无相应功能或测量 |

检查期间一次探索命令使用了 PowerShell 下未展开的 Feature 通配符，rg 返回路径错误；随后用 `rg --files docs/features` 找到并完整读取实际文件。它不计为文档或功能校验通过。

截图保留捕获原始字节；前六张工具返回 JPEG 而初始扩展名为 png，已只修正本轮证据文件的扩展名为 jpg，记录于 `evidence-extension-corrections.json`，未编辑图像内容。证据默认在忽略目录中，仅供本机复审，未上传。

初次写入的本机许可 JSON 存在编码损坏，已从用户本轮原话重新以 UTF-8 写入 `authorization.json`，原始记录另存 `authorization-original-encoding.json`；许可事实以用户消息为准，报告内原话也已核对。

完整 CLI 文档检查统计为 39 份 Markdown、12 份 Feature、49 个相对链接。报告回填后的文档、编码和 diff 复核记录在 `E/docs-final.log`、`E/encoding-final.log`、`E/diff-check.log`；文件摘要清单为 `E/evidence-manifest.json`。

## 4. 运行环境保护核对

本轮明确许可后启动现有 Cocos 一次；编辑器中两次实际预览，正常停止并通过 Alt+F4 关闭。使用选择后的项目窗口操作和窗口级截图，未采集全屏或无关桌面，未控制无关应用。没有安装工具、浏览器启动、系统设置修改或后台隐藏验收。

启动前该安装路径 Cocos 进程为 0；本轮根进程 PID 34436 及关闭前记录的 12 个直接子进程均已退出，关闭后同路径进程为 0。未使用强制终止；不结束用户其他进程。本轮文件保留与进程检查证据见 E。后续 CLI 均有时限并等待退出，不启动 GUI。

## 5. 文档同步清单

- `docs/FEATURES.md`：不改；FEAT-012 状态仍为 in_progress，其他 Feature 不变。
- `docs/features/FEAT-012-asset-and-quality.md`：已更新 Startup 图形证据；本 Feature AC-02 的正式美术/动作仍未完成，不能混淆 Issue #1 AC-02。
- `docs/PLAN.md`：已更新，P1-01 和 P1 保持 in_progress，停在最终复审。
- `docs/CHANGELOG.md`、`docs/INDEX.md`：已更新记录与导航。
- `README.md`、`docs/TESTING.md`：已更新真实预览方法和验证边界。
- `docs/TECH_STACK.md`、`docs/ARCHITECTURE.md`：已修正运行证据快照，未改变版本、依赖或设计。
- `AGENTS.md`、`docs/DEV_ENVIRONMENT.md`、素材台账、联机文档：不改；执行策略、素材和功能范围不变。
- 历史任务报告和原审查 ZIP：保留，不追写为历史已验证。

## 6. 未解决问题、风险和下一步

Issue #1 AC-02 的本轮 Windows Startup 运行检查已有实际通过证据。引擎 IPC/Widget/计时诊断仍保留，原因未定位，当前未观察到阻断；如后续复现为功能故障需另行追因。Mac CLI、微信真机及性能仍未验证，不能由本次结果推定。

P1-01 保持 in_progress，下一步仅等待用户最终 Code Review；不自动提交、不关闭 Issue、不开始正式游戏功能或下一 Issue。
