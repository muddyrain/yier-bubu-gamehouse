# 任务报告 — Issue #3 / P1-03 F-02 键盘证据修复

> 报告日期：2026-10-29 | 系统：Windows NT 10.0.26200 | 功能：FEAT-002（关联 FEAT-001）| 分支：master | 结论：采集流程静态修复，真实键盘补证待本次 GUI 许可

## 1. 本次授权范围

仅处理外部 GUI 证据复审的 F-02：先无 GUI 定位 40—54 重复归档及错误尺寸，保留历史，修复采集/索引校验并执行安全 CLI。只有取得本次明确 Windows 前台/项目截图许可后，才能补中立、Tab 聚焦、一二/布布选中、确认布布、Esc 返回、取消草稿、原游戏介绍键盘打开/关闭的实际证据。

不重做已获复审接受的源码、三比例、各角色三次往返、组件恢复、两次编辑器启停；不重装/重建、不改正式素材、不开发 FEAT-003、不执行 Git 暂存/提交/推送/关闭 Issue。P1-03、FEAT-002 继续 in_progress，AC-02 留待 FEAT-003。

## 2. 实际交付与代码影响

- 新增 `tools/capture_evidence.cjs`：接收当次捕获字节显式参数，复制字节、按签名选择 jpg/png、独占写入、拒绝重复文件 SHA-256；不包含任何 UI API。
- 新增 `tools/check_gui_evidence.py`：使用已有 Pillow 读取真实格式/宽高及 RGBA 像素哈希，对预期不同状态检查文件/像素重复、缺失、解码错误和扩展名错误；新索引独占创建。
- 新增 `tools/tests/test_gui_evidence.py`：4 项采集传输/解码回归，使用明确的合成单测夹具，不冒充真实游戏证据。
- 修改 README、PLAN、FEAT-001/002、ARCHITECTURE、TESTING、INDEX、CHANGELOG，撤回旧 40—54 图片对键盘通过结论的证明力；新增本报告。历史报告原文保留，通过本报告更正。
- 产品源码、场景、Meta、配置、原 16 项回归与两份私有 Cocos 配置均无本轮修改；无删除。新增校验测试不取代逻辑或 GUI 验收。

本机证据目录：`.local/validation/p1-03-f02/`。开始前 `before.json` 保存工作区及全部旧 completion 证据哈希；`repro-original.json` 记录原 15 图只有一个文件 SHA-256，均为 `1b6394c28ed99cb80d1554c5f71d47a47444ff6f81490175fec805e058200335`。`historical-index-audit.json` 为新建审计，不覆盖旧索引；历史 40—54 归档分类为 `invalid_capture`，不是判定功能代码失败。

### 根因与原结论更正

旧 `p3WebSave(name, note)` 没有图片参数，闭包直接读取定义时的 `p3WebImage`。无 GUI 跨调用探针中：A 调用定义变量 initial 和读它的函数；B 调用将外层变量改为 later，直接读取为 later、函数仍读 initial。已保存的旧函数源码及实际探针结果见 `repl-scope-diagnostic.json`。这解释了后续工具显示实时画面、落盘却反复写首张中立图的现象。导出 ZIP 与原落盘文件逐项对比另存审计，不能把重复归因于游戏按键失效。

图片头实际为 JPEG/JFIF（FFD8FF），后缀却为 .png；旧索引按 PNG 的固定 16—24 字节偏移读尺寸，得到 6291456×4292542531、65536×4292542531 的错误值。新解码审计读取到前 40 张 3440×1392、后 15 张 1280×720。旧 `48-keyboard-confirmed-bubu.png` 实际为“尚未选择角色”，不能证明确认布布。

此前未核对落盘图像内容，把操作声明和工具即时显示当作正确归档，是本次证据错误。原 `keyboard-log.json` 的 passed 仅为操作方声明，不能作为独立验收；原报告键盘通过结论在此撤回，等待真实补证。字节/像素不同也不自动证明 UI 目标正确，仍需逐图观察文字与焦点状态。

## 3. 实际验证（无验证则写 not_run）

| OS | 命令/GUI/真机步骤 | 结果 | 日志或证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows CLI | 原 15 图 distinct SHA-256 断言 | `failed` | `repro-original.json` | 成功复现 F-02：15 个名字只有一份字节，不代表键盘功能失败 |
| Windows / 纯 JS | 缓存保存函数源码及跨调用闭包探针 | `passed` | `repl-scope-diagnostic.json` | 无 GUI、无采集或键鼠调用，定位错误数据传输路径 |
| Windows CLI | 新解码器审计原 55 图及预期不同状态 | `failed` | `historical-index-audit.json` | 55 图全部误扩展名，指定旧状态重复；真实尺寸读取成功，历史保持失败 |
| Windows CLI | `python -B -m unittest discover -s tools/tests -p test_gui_evidence.py -v` | `passed` | 本轮工具输出 | 4 项新回归；Pillow 12.3.0 已有，未安装；不证明真实游戏画面 |
| Windows CLI | `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261028T161456.850283Z/summary.json` 及同目录 docs/unit/typecheck.log | 文档、20 项 unittest（原 16 项和 9+13 组 TS 断言保留）、真实 tsc；没有 GUI 子进程 |
| Windows CLI | ZIP/落盘逐项比对、CRC 与旧 SHA-256 | `passed` | `historical-zip-audit.json` | 15 个重复文件在 ZIP 前已存在；原 ZIP SHA 仍为 f2a5bcd3bb95278897945758179fbd76b98253e2bea47b7ec931984b74150229；CRC 不能证明状态语义 |
| Windows CLI | 编码扫描、严格 UTF-8、Git diff/忽略/索引及原字节保留 | `passed` | `static-checks.json` | 92 个文本严格解码；145 个旧 completion 文件无变化；产品源码/Meta/原测试/私有配置无变化，索引为空 |
| Windows GUI | 本次键盘关键状态重新采集 | `not_run` | - | 尚未收到本次明确 GUI 许可，没有启动编辑器/预览/浏览器/截图或控制键鼠 |
| macOS | 实机 CLI、GUI/引擎构建 | `not_run` | - | 当前为 Windows；新工具只读既有图片/保存显式字节，不放宽 Mac 红线 |
| 微信真机 / FEAT-003 | 触控、安全区、性能、真实游戏集成 | `not_run` | - | 本轮范围之外 |

环境为 Windows、Python 3.13.5、现有 Pillow 12.3.0、Node 26.4.0/锁定 TypeScript 5.8.2。完整 CLI 的 docs/unit/typecheck 均退出 0（约 0.125/1.563/0.685 秒）。校验保留 Git 的 LF→CRLF 提示，未转换文件或更改配置。忽略规则在禁用全局 excludes 后仍来自 client/.gitignore 第 14/15 行，`.local` 来自根规则；两私有配置未跟踪，HEAD 仍为 5ac74c5fbfef1e02505732577456f157e0c9277c。

本轮校验清单 `SHA256SUMS.txt` 只列新的审计/回归结果与报告/工具，不把旧重复图片重新打成通过包；新 GUI 截图数为 0。后续有许可才可新增键盘截图 ZIP，不能将静态修复说成 F-02 已完成。

## 4. 运行环境保护核对

当前只执行文件/Git/纯 JS/有界单测，没有本轮启动的图形进程或可清理的图形进程树；没有操作既有窗口，没有安装依赖或改系统设置。新工具只写忽略的本机证据目录；旧图片/日志/索引/ZIP 不覆盖。两份私有配置不读取内容、不导出，保留原字节。

## 5. 文档同步清单

- PLAN：P1、P1-03 保持 in_progress，更正键盘证据缺口，停在等待本次许可及最终验收。
- FEAT-002：暂取消 AC-05 勾选，说明只缺 F-02 键盘补证；AC-02 仍未完成。FEATURES 状态不变，无需改写。
- README、FEAT-001、ARCHITECTURE：更正旧键盘通过引用，不改变产品要求、结构或 P1-02 验收。
- TESTING：记录显式截图参数、真实解码/像素核对、依赖/预算与 4 项回归，区分操作声明与可复核的画面。
- INDEX、CHANGELOG：登记本报告及 F-02；ART_ASSETS、ASSET_LICENSES、ADR、AGENTS、DEV_ENVIRONMENT 无素材/决策/策略变化，不修改。

## 6. 未解决问题、风险和下一步

当前 F-02 的键盘关键状态重新采集尚为 not_run；没有新截图或新图形通过包。取得本次明确许可后仅补指定键盘状态，每步实时捕获、显式传入字节、观察画面并核对不同状态文件/像素哈希，再正常退出并核对本轮进程。若没有许可，停在准备阶段，不用旧图、隐藏窗口或合成夹具代替。

旧内嵌焦点失败、2 IPC/1 WebContents 退出警告、首次导出脱敏失败及所有历史失败继续保留。Mac 实机、微信真机、性能和 FEAT-002 AC-02 仍未验证；不推进下一 Feature 或 Git 操作。
