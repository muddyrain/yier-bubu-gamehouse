# 任务报告 — Issue #1 / P1-01 Windows 横屏图形复验

> 报告日期：2026-10-26（Asia/Shanghai） | 系统：Windows 11 / NT 10.0.26200 | 功能：FEAT-012（工程质量基线） | 分支：master，未创建新分支

## 1. 本次授权范围

用户确认 1280×720 横屏基线的外部静态 Code Review 已通过，没有阻塞性源码返工。本轮只验证现有 Startup 的真实 Windows 画面、16:9/4:3/超宽屏比例、运行时自动 start、运行/停止/再次运行/再次停止、日志及进程清理，随后执行安全 CLI 并同步验收文档。

本轮重新询问具体许可，用户答复：**“现在允许，并允许保存仅项目窗口截图”**。许可后才启动现有 Cocos Creator 3.8.8，所有输入针对选定的项目窗口；不把历史竖屏许可或截图作为本次授权/验收证据。

开始前阅读 AGENTS、README/PLAN、DEV_ENVIRONMENT、ADR-0003、横屏开发报告、FEATURES/FEAT-012、TESTING、DOC_RULES、WORKFLOW 和报告模板，检查 Git 状态。使用 Computer Use 和编码保护技能；GitNexus 工具不可用，采用只读原生 Git。现有 65 个非忽略文件与 2 份私有配置共 67 个文件建立起始 SHA-256，另核对 127 个历史本机证据文件。

明确不做：重新初始化/安装 Cocos、修改场景/脚本/配置/测试逻辑、正式大厅/选角或任何玩法、微信构建/真机、Mac GUI、系统设置/账号操作，以及 git add/commit/push/PR/merge、关闭 Issue 或开始下一 Issue。P1-01 保持 in_progress，完成后停止等待最终复审。

## 2. 实际交付与代码影响

新增：

- `docs/reports/2026-10-26_issue-1_landscape-gui-acceptance.md`：本报告，独立于旧竖屏和横屏开发轮次的记录。
- `.local/validation/p1-01-landscape-gui/`：本轮许可、窗口截图/可访问性文本、原始 stdout/stderr、进程及文件保留记录；已忽略，不入 Git。

修改（仅 9 份文档）：

- `docs/PLAN.md`：用户确认静态复审通过、本轮 Windows 复验结果及等待最终验收的停点，仍 in_progress。
- `docs/TESTING.md`：实际三种比例、运行/停止/重启、留边、诊断和设备验证边界。
- `docs/CHANGELOG.md`、`docs/INDEX.md`：本轮记录与报告导航。
- `README.md`：当前横屏证据、实际预览方式与剩余范围。
- `docs/TECH_STACK.md`、`docs/ARCHITECTURE.md`：修正横屏尚未运行的旧快照，不改技术选择/架构。
- `docs/features/FEAT-012-asset-and-quality.md`：当前 Startup 图形结果，不改变正式产品验收状态。
- `docs/REFERENCES.md`：移除技术资料中的临时“待本次复验”状态，将项目执行证据统一指向任务报告。

删除：无。既有行为受影响：否，本轮没有修改功能。GUI 关闭且文档编辑前，67 个起始文件全部字节相同、无缺失；127 个历史本机证据文件未变。原 Startup/SmokeTest/Meta UUID、project 配置、F-01 忽略规则、两私有配置、锁文件与历史报告保留；没有重建、重新序列化或保存源场景。预览设备/旋转操作只改变忽略的本机查看状态，结束前恢复为设计分辨率横向。

## 3. 实际验证（无验证则写 not_run）

环境：Windows 11 / NT 10.0.26200，现有 **Cocos Creator 3.8.8**（FileVersion/ProductVersion 均 3.8.8）；沿用 Python 3.13.5、Node 26.4.0、TypeScript 5.8.2 与真实生成声明，不安装工具。本轮证据目录简写 **E = `.local/validation/p1-01-landscape-gui/`**。

### 真实引擎操作与三种比例

使用现有可执行文件的 `--project <现有 client 路径>` 打开工程。编辑器初始显示 Untitled，随后在资源目录展开 scenes、双击**已有 Startup**；标题变为 `Startup.scene - yier-bubu-gamehouse - Cocos Creator 3.8.8`，Canvas 的脚本组件标识存在。选择 **Preview in Editor**，点击运行，未调用脚本 API 或显式执行 start。

第一轮运行中依次比较以下预设；后两项使用预览面板的旋转按钮，将预设的宽高交换为横向。它们是编辑器的画面尺寸预设，**没有连接 iPad 或 Sony 真机**。

| 比例 | 实际预览选择 / 横向目标尺寸 | 查看缩放 | 裁切 / 文字重叠 / 错位 | 黑边与留空观察 | 结果与证据（相对 E） |
| --- | --- | --- | --- | --- | --- |
| 16:9 | Design Resolution (1280×720)，不旋转 | 67% | 均未观察到 | 设计区域比例一致；显示原黑背景，没有额外宽高比留边 | `passed`，`02-run1-16x9.jpg/.txt` |
| 4:3 | Apple iPad 10.2 (1620×2160)，旋转为 **2160×1620** | 40% | 均未观察到 | 设计内容上下有额外黑色留空，主体保持比例、居中 | `passed`，`03-run1-4x3.jpg/.txt` |
| 21:9 超宽屏 | Sony Xperia 5 (360×840)，保持旋转为 **840×360** | 204% | 均未观察到 | 设计内容左右有额外黑色留空，主体保持比例、居中 | `passed`，`04-run1-21x9.jpg/.txt` |

三种比例均完整显示以下内容：标题“一二布布游戏屋”、启动测试说明、一二白色正方形及“小白熊占位”名称、布布棕色正方形及“小棕熊占位”名称、TypeScript 已启动状态、正式大厅/玩法尚未开发说明。始终一二在左、布布在右；方形比例及双方视觉规格一致，未观察到拉伸或单角色偏移。

黑色留边与场景原黑背景同色，本轮按可见留空位置记录，没有独立测量精确黑边像素。编辑器面板外的灰色空白属于查看区域，不算游戏内容裁切。查看缩放和 FPS=60 输入值都不是实测帧率或设备分辨率。

第二轮先在保持的 21:9 预设中启动，随后恢复 Design Resolution 及未旋转的 1280×720；恢复预设时旋转开关曾继续生效，切回后确认最终为横向。没有修改 project 分辨率来切换测试比例。

### 生命周期、重启与控制台

| 步骤 | 实际结果 | 证据（相对 E） |
| --- | --- | --- |
| 第一次运行 | `passed`，真实画面显示，自动产生一次 SmokeTest 启动标记；错误 0、警告 0 | `02-run1-16x9.jpg/.txt`、`editor-stdout.log` |
| 第一次停止 | `passed`，返回 Scene；累计警告 1、错误 0 | `05-run1-stopped.jpg/.txt` |
| 再次运行 | `passed`，画面正常，再自动产生一次启动标记；累计警告 1、错误 0 | `06-run2-21x9.jpg/.txt`、`07-run2-16x9.jpg/.txt` |
| 再次停止 | `passed`，返回 Scene；累计警告 **3**、错误 **0** | `08-run2-stopped.jpg/.txt` |
| 正常关闭与清理 | `passed`，Alt+F4 正常退出，未强制终止 | `cleanup.json`、`processes-after.json`、`editor-children-before-close.json` |

stdout 中以下原始标记共 **2** 次，分别来自两次游戏运行；切换比例没有产生额外启动。没有显式调用 start、后台引擎探针或扩展执行脚本。

```text
[PreviewInEditor] [P1-01] SmokeTest started: yier + bubu placeholders.
```

原始诊断保留：stderr 有 **3** 次 `[PreviewInEditor] IPC message has been lost.`，与最后控制台警告计数一致；stdout 有 **16** 条 `trackTimeEnd failed! Can not find the track time ... start` 计时诊断。本轮没有出现此前竖屏日志中的 Widget 原生诊断，但没有进行针对其根因的修复，不能宣布历史问题已解决。两次运行均未被这些信息阻断，脚本错误计数为 0，**不等于引擎日志完全无诊断**。

所有诊断与自动启动汇总在 `runtime-summary.json`、`automatic-start-markers.log`；三比例的人工观察记录在 `aspect-results.json`，不伪装为自动像素测试。

### 自动化操作中的中断记录

进入资源期间两次输入被工具的用户输入保护拦截；最大化后一次截图缓存失效报 `unknown screenshotId`，预设列表中一次不可见条目报 `no cached bounds`。每次均停止使用旧状态，重新观察后继续；不可见条目滚动到可见后再选择。它们不是脚本错误，没有据此修改源文件。

出现临时驱动提示浮层时，没有操作该浮层，也没有把含浮层的捕获写入证据文件；等待消失后才保存项目窗口图像。没有全屏截图、无关应用操作或浏览器启动。

### CLI、版本控制与文件保留

| OS | 实际命令 / 检查 | 结果 | 日志 / 证据 | 覆盖范围 / 限制 |
| --- | --- | --- | --- | --- |
| Windows | 起始 `git status --short --branch --untracked-files=all`、文件与进程基线 | `passed` | `E/status-before.log`、`before.json`、`environment.json`、`processes-before.json` | 保留原有工作区；启动前该安装路径引擎进程为 0 |
| Windows | GUI 后 67 文件及 127 历史证据 SHA-256 比对 | `passed` | `E/preservation-after-gui.json` | 全部字节相同，无缺失；覆盖场景/脚本/Meta/私有配置和旧证据 |
| Windows | 编辑文档前 encoding-guard 检查 | `passed` | `E/encoding-before.log` | 现有文本编码正常 |
| Windows | `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261026T151044.905518Z/summary.json` 及同目录日志 | docs/unit/typecheck 均 exit 0；13 项无 skip；42 份 Markdown、12 份 Feature、78 个相对链接 |
| Windows | Git diff/status/忽略/索引/文件保留及编码终检 | `passed` | `E/final-checks.json`、`diff-check.log`、`git-status-final.log`、`git-private-ignore.log`、`git-private-tracked.log`、`encoding-final.log` | 仅 9 既有文档修改/1 报告新增，无缺失；源码/配置和历史证据未变，两私有配置命中 client/.gitignore 14/15 行且索引为空，HEAD 不变、0 暂存 |
| macOS | CLI 实机执行 | `not_run` | - | 本轮在 Windows，不能推定 Mac 已通过 |
| 微信真机 | Landscape 构建/game.json/安全区/触控/性能 | `not_run` | - | 编辑器设备预设不等于真机；本轮不构建 |
| Windows / 设备 | 正式大厅/选角/玩法、性能、长期稳定性 | `not_run` | - | 不属于 P1-01 启动复验范围 |

沿用原有固定 CLI 白名单：docs/unit 各 30 秒、typecheck 60 秒，串行、shell=False、等待退出并记录日志，不运行 npm GUI/build/preview 脚本。类型检查继续使用现有真实生成声明，缺失仍应 blocked，不伪造 cc 类型。

Git diff --stat 包含所有历史未提交改动，不能当成本轮独有清单。本轮差异以起始文件哈希及文档备份为界，完整清单 `E/changed-files.txt`、仅本轮补丁 `E/round-diff.patch`。报告回填后再做文档/编码/diff 终检，日志为 `E/docs-final.log`、`encoding-final.log`、`diff-check.log`；证据摘要清单为 `E/evidence-manifest.json`。

## 4. 运行环境保护核对

本次明确许可后只启动既有 Cocos 一次，根 PID **20120**。实际完成两次运行和停止，最终恢复横向设计分辨率后正常关闭。退出核对：根进程已退出，同安装路径 Cocos 进程 **0**，关闭前记录的 **12** 个直接子进程也全部退出；未强制结束任何进程。检查时间为 2026-10-26 23:04（Asia/Shanghai），准确时间见 cleanup.json。

仅保存 8 张项目窗口 JPEG 原始捕获，未编辑图像；所有文件在 E、默认不提交，未上传。没有安装、重建、系统设置/账号修改、无关应用输入或私人配置内容复制。安全 CLI 不留下常驻服务；各检查实际等待退出。

## 5. 文档同步清单

- `docs/PLAN.md`：已更新真实结果及等待最终复审的停点；P1/P1-01 保持 in_progress。
- `docs/TESTING.md`：已补三比例、两次生命周期、诊断、清理及真机边界。
- `docs/CHANGELOG.md`、`docs/INDEX.md`：已更新本轮记录与导航。
- README、TECH_STACK、ARCHITECTURE、REFERENCES：已修正当前运行证据快照，不改方向/版本/架构。
- FEAT-012：已补横屏 Startup passed；正式素材/动作、产品和真机未完成。
- `docs/FEATURES.md`：不改；FEAT-012 仍 in_progress，正式功能仍 planned。
- ADR-0003、AGENTS、DEV_ENVIRONMENT：不改；技术决策与 OS 安全红线保持。
- 所有历史报告/截图、原审查 ZIP：不重写，历史“not_run”对应当时执行范围，本轮以新报告另记 passed。
- 素材/联机/产品需求：不改；没有新增资产或功能。

## 6. 未解决问题、风险和下一步

本轮完成 Issue #1 AC-02 的 Windows 横屏图形复验，三种比例、双方内容、自动 start、两次运行/停止均有新证据。允许的黑色留边存在；IPC 和计时诊断保留，根因未定位，本次未观察到阻断，不隐瞒也不扩展为源码修复。

用户确认的外部静态复审通过与本次图形结果共同提交最终复审。P1-01 保持 in_progress；Mac 实机 CLI、微信构建/真机、安全区、触控和性能仍 not_run。停止等待用户复审，不暂存、不提交、不推送、不创建 PR/merge、不关闭 Issue、不开始新功能。
