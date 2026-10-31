# 任务报告 — Issue #4 / P1-04 最终收尾准备

> 报告日期：2026-10-30 | 系统：Windows 11 / 10.0.26200 | 功能：FEAT-003 | 分支：master | 交付：最后修复及拟提交范围，停止等待人工复审

## 1. 本次授权范围

只核对停止预览修复、完整现有源码、四份 Meta、F-01 不变和完整拟提交范围，生成精简最终源码审查包。既有 Windows 真实演示与三比例/双方各三次/组件恢复/修复后两次预览启停沿用 [运行报告](2026-10-30_issue-4_visible-demo.md)，本轮不重跑 GUI、不美化操作场、不重构生命周期、不开始守护小屋实现。

开始 HEAD 为 `85dd82e7b6bc60065f0ce6ef333e8cde926e303a`，master，索引为空；用户未授权暂存、提交、推送或关闭 Issue #4。本轮不执行这些操作。GitNexus 工具不可用，使用原生 Git 只读命令；按 Karpathy 指南限制在最后差异，使用 encoding-guard 保护中文文档。

## 2. 实际交付与代码影响

本轮产品源码和 Meta **没有再修改**。只修改 `docs/PLAN.md`、`docs/INDEX.md`、`docs/CHANGELOG.md`，新增本报告，记录停点与导航。无删除；其余 109 个开始时文件，包括独立研究、规划、源码、测试和两份私有配置，保持原字节。完整开始快照有 112 文件；本机审查目录的 before.json / scope/preservation.json 记录比对，实际索引原字节也不变。

审查包位置：`.local/review/p1-04-final-source-review-2026-10-30/P1-04-final-source-review-2026-10-30.zip`，旁置 `.sha256`。按以下顺序审阅：

1. `START_HERE.md`，然后 `diffs/01-stop-preview.patch`：仅此次停止预览修复。
2. `current-source/client/assets/scripts/`：全部现有 TS 与 Meta 原字节；`before-import/` 和 `diffs/02-meta-import.patch` 给出四份导入增量。
3. `scope/proposed-files.txt`、`scope/file-scope.json`、`scope/projections.json` 与 `diffs/03-proposed-commit.patch`：29 路径完整拟提交内容及研究排除证据；`proposal/` 保存这些拟提交文件。
4. `scope/f01-unchanged.json`、`checks/`、`evidence/` 与 `SHA256SUMS.txt`：原已审修复不变、必要 CLI 与包内哈希。包不带依赖、引擎缓存、私有配置、研究报告、图片或录屏，不是构建产物。

### 停止预览修复：仅一个行为变化

基线为本轮 GUI 前的 DevelopmentModule 完整源码副本，非 HEAD（该文件尚未提交）。当前修复为：

```diff
 public dispose(): void {
     this.exit();
     if (this.root && isValid(this.root, true)) {
-        this.root.removeFromParent();
+        // Let deferred destruction detach it; its parent may be deactivating.
         this.root.destroy();
     }
```

逐字节验证当前文件等于原文件只替换上述一行；其余代码不变。最小 diff 不混入最初 P1-04 整文件新增，也不重做 F-01。

| 复核点 | 当前源码及引擎依据 | 结论 |
| --- | --- | --- |
| 父节点停用 | LobbyView.onDisable→GameFlow.exit→module.exit/dispose；3.8.8 Node.setParent 在旧父节点 Deactivating 时报告 3821 | 不再主动改父子层级；先隐藏并请求 destroy |
| 重复 dispose | exit 的 subscribed 开关先清零，CounterModel.dispose 幂等；首次 destroy 后 root/model=null、controls 清空 | 再次 dispose 无根节点可重复销毁；GameFlow 的 cleaned 仍限制一次 exit/dispose |
| 事件退订 | 同一 control.click/this、parent SIZE_CHANGED/fit/this、全局 KEY_DOWN/onKeyDown/this 配对 off；退订发生于 controls 清空前 | 全局事件不依赖延迟销毁才解除；已到达的键盘回调还检查 subscribed，点击还检查活动控件/model |
| 延迟 destroy | Node.destroy 调用 CCObject.destroy 标记 ToDestroy、入队并设 inactive；_deferredDestroy 跳过 Destroyed，Node._onPreDestroyBase 处理脱离/父销毁 | 不要求本帧立即从 children 数组消失；短暂存在的旧根已隐藏、退订且失去模块所有权，不声称做过长期堆审计 |
| F-01 | GameLifecycle.ts 和两个生命周期测试文件与已审 F01-file-manifest.json 的工作文件 SHA-256 完全一致 | LoadResources.cancel/retain/dispose、迟到取得回收与新会话隔离协议均未变；没有把异步登记资源移交给 Node.destroy |

引擎依据来自现有 3.8.8 安装的 `cocos/scene-graph/node.ts` 第 492、1367、1493 行及 `cocos/core/data/object.ts` 第 173、300、653 行。包内仅给出相关小段和文件哈希，不打包引擎。本次局部源码复核未发现新增阻断问题；最后差异仍交用户人工复审。

### 四份 Meta 差异

相对 GUI 前原字节基线，四份文件均只有 `"imported": false` → `true`；反转此标记可复现原 SHA-256，UUID/其余字段不变。相对 HEAD 则是整份新增，不能把它们伪装成已提交文件的单行 Git diff。

| Meta 文件 | UUID |
| --- | --- |
| CharacterVisual.ts.meta | 0ad66eaf-f0a3-4eb3-89ef-7ffec5d17aea |
| CounterModel.ts.meta | 0409ea18-76f1-4a2d-87a3-8437a59c4076 |
| DevelopmentModule.ts.meta | 541c03d4-12c2-45fa-b224-94893777c06d |
| GameLifecycle.ts.meta | 94ad7fee-cc05-49c5-99df-3cbcbc309f0d |

### 完整拟提交清单：29 路径（15 修改、14 新增）

以下是内容提案，没有暂存。`[投影]` 文件必须按包内 proposal 的内容复审，不能整文件暂存工作区混合内容。

| 类别 | 完整路径 |
| --- | --- |
| 修改源码（1） | `client/assets/scripts/LobbyView.ts` |
| 新源码/Meta（8） | `client/assets/scripts/CharacterVisual.ts`、`CharacterVisual.ts.meta`、`CounterModel.ts`、`CounterModel.ts.meta`、`DevelopmentModule.ts`、`DevelopmentModule.ts.meta`、`GameLifecycle.ts`、`GameLifecycle.ts.meta`（均位于相同 scripts 目录） |
| 新测试（2） | `tools/tests/game_lifecycle.test.cjs`、`tools/tests/test_game_lifecycle.py` |
| 修改文档（14） | `README.md` [投影]；`docs/ARCHITECTURE.md` [投影]；`docs/ART_ASSETS.md` [投影]；`docs/ASSET_LICENSES.md` [投影]；`docs/CHANGELOG.md` [投影]；`docs/FEATURES.md`；`docs/INDEX.md` [投影]；`docs/PLAN.md` [投影]；`docs/PRODUCT.md`；`docs/TESTING.md`；`docs/features/FEAT-001-game-lobby.md`；`docs/features/FEAT-002-character-selection.md` [投影]；`docs/features/FEAT-003-game-module-lifecycle.md`；`docs/features/FEAT-005-tower-defense.md` |
| 新报告（4） | `docs/reports/2026-10-29_issue-4_game-lifecycle.md`；`docs/reports/2026-10-30_issue-4_f01-load-cancellation.md`；`docs/reports/2026-10-30_issue-4_visible-demo.md` [投影]；`docs/reports/2026-10-30_issue-4_final-review-preparation.md` |

PRODUCT、FEAT-005 只包含用户已决定的精致单关路线，纳入本次路线交接，不包含下一阶段实现。Feature 与本机规划原文不被审查包反向覆盖。

### 精确排除与保护

- 完整排除：独立 `docs/reports/2026-10-29_task-character-source-research.md`、`docs/features/FEAT-012-asset-and-quality.md` 的独立改动、生成的 `client/.creator/asset-template/typescript/Custom Script Template Help Documentation.url`。
- 混合文档只在 proposal 副本中排除研究报告入口/状态/Changelog、完整来源/候选/联系表、素材转换流水线及先前独立视觉规划节；保留 P1-04 实现、占位登记和用户本轮再次明确的原稿/许可标准。具体差异与双边哈希见 projections.json；原研究和规划文档不删除、不回退、不改写。
- 运行报告副本的四条本机忽略目录截图链接改为文字路径，避免干净检出时文档校验引用不存在的本机图片；运行报告原文及原图不变。这是文档可移植性投影，未重新采集或修改 GUI 证据。
- 两份本机服务配置、所有 .local 证据/缓存/旧包、依赖和引擎生成目录均不进入拟提交补丁。工作区研究余量保留在本机 `excluded-working-remainder.patch`，不放入源码审查 ZIP。

## 3. 实际验证（无验证则写 not_run）

| OS | 命令/步骤 | 结果 | 日志或证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows CLI | HEAD、status、cached diff、实际 index 文件哈希；112 文件开始/结束 SHA-256 | `passed` | before.json、status-before.txt、scope/preservation.json | HEAD/index 不变；只有三份导航文档及新报告属于本轮修改 |
| Windows CLI | 源码单行等价、四 Meta 反转哈希、F-01 三文件已审哈希 | `passed` | 三份差异、scope/f01-unchanged.json | 最小修复及不影响 F-01 的静态证据；不重新声称 GUI |
| Windows CLI | `git apply --check --whitespace=error --directory=<忽略目录 HEAD 副本> <拟提交补丁>` | `passed` | checks/patch-check.log | 仅预检独立副本，未应用真实工作区/索引 |
| Windows CLI | `python -B tools/validate.py docs`；拟提交完整上下文中的 `tools/check_docs.py`；目标 encoding-guard；`git diff --check` | `passed` | checks/ 与 checks.json | 现有及拟提交文档结构/相对链接、中文与空白；无 GUI 副作用 |
| Windows CLI | ZIP CRC、成员清单/逐文件 SHA-256、源码与工作文件字节核对、路径排除 | `passed` | package-verification.json、SHA256SUMS.txt、旁置 ZIP .sha256 | 审查包完整性，不等于构建成功或发布许可 |
| Windows CLI（上一轮） | 真实 typecheck / 21 unittest（生命周期 23 组） | `passed` | 原 20261030T124102.149613Z / 20261030T124353.335881Z，包内引用与日志 | 本轮源码/测试未变，沿用实际已通过结果，本轮未重跑 |
| Windows GUI（本轮） | 未执行 | `not_run` | 用户要求不重跑 | 既有完成矩阵和 6 条 IPC 警告沿用运行报告，不扩大结论 |
| Mac / 微信 / 跨正式游戏 / 获权图像替换 | 未执行 | `not_run` | 对应 Feature 与运行报告 | 不以纯逻辑夹具或 PC 预览抵扣 |

## 4. 运行环境保护核对

只执行读取、文档导航/报告编辑、Python 标准库打包、有界只读 CLI 和忽略目录投影/校验；无 GUI、浏览器、截图、录屏、安装、常驻服务、系统设置或进程操作。索引按实际文件 SHA-256 比对，未创建替代索引或调用暂存命令。原代码/Meta、素材研究、规划、私有配置及历史证据保留。

## 5. 文档同步清单

- PLAN / INDEX / CHANGELOG：只补最终源码审查入口与等待人工复审停点；新增本报告。
- FEATURES / FEAT-003：本轮未改，FEAT-003 仍 `in_progress`。AC-04 跨正式游戏隔离、AC-06 获权图像/动画替换仍未完成。
- 微信真机：前后台、重复加载、触控/安全区与平台构建仍 `not_run`；P1-04 本地验收不等于整个 FEAT-003 完成。
- README / 架构 / 素材 / 联机 / PRODUCT / FEAT-005：真实工作文件本轮未改；投影仅处理提交边界，保留已决定的单关路线，不追加设计。

## 6. 未解决问题、风险和下一步

完成后停止，等待用户人工复审最后的停止预览修复、四份 Meta 和 29 路径内容提案。没有执行 add、commit、push、PR 或关闭 Issue #4。

既有 6 条停止交界 IPC 警告保留；本轮不重跑引擎或宣称修复它们。跨正式游戏隔离需至少第二个正式玩法接入后实测；微信与素材替换须独立实测。下一阶段路线为精致《守护小屋》单关，当前没有启动它或继续美化开发测试场。
