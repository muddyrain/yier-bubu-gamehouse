# 任务报告 — Issue #2 / P1-02 最终完整源码复审准备

> 报告日期：2026-10-27（Asia/Shanghai） | 系统：Windows 11 / NT 10.0.26200 | 功能：FEAT-001（P1-02） | 分支：master

## 1. 本次授权范围

整理 P1-02 全部未提交成果与必要上下文，形成最终源码 ZIP、完整 Git 差异、新增文件清单、SHA-256、实际测试结果和剩余问题，供正式验收及之后单独授权的提交使用。

开始前读取 AGENTS、README/PLAN、DEV_ENVIRONMENT、DOC_RULES、WORKFLOW、FEATURES/FEAT-001、任务模板以及 P1-02 开发、导入暂停、GUI 验收三份完整报告。检查 GitNexus 与编码保护技能；当前没有 GitNexus 工具，使用原生只读 Git。起始 master，HEAD `0b4bf910be92a0bad10a7dd2e14962676fbac3c8`，22 个未提交路径，索引为空。

明确不做：本轮启动 Cocos/浏览器/预览/截图/其他 GUI，安装依赖、重建工程、修改功能或测试实现、改写历史报告/失败记录、Git add/commit/push/PR/merge、关闭 Issue 或开始下一功能。准备提交材料不等于获得提交授权。

## 2. 实际交付与代码影响

相对于本轮开始，只修改 `docs/PLAN.md`、`docs/INDEX.md`、`docs/CHANGELOG.md`，新增本报告；无删除。原场景/Meta、LobbyModel/LobbyView（含已验收销毁检查）、全部测试和依赖保持原字节，P1-01 保持不变。

完整源码 ZIP：`.local/validation/p1-02-final-review/P1-02-final-source-review-2026-10-27.zip`。同目录的 `.zip.sha256` 为整个 ZIP 校验值；`complete-file-list.txt`、`package-result.json` 为最终清单和检查结果。包内根目录保持仓库相对路径，另加 `review/` 辅助材料；这些辅助文件不是新增产品模块或待提交目录。

- 仓库快照：全部新增/修改源码、Meta、共享工程配置、原测试、依赖锁定文件、文档和 P1-01 必要上下文；不是仅有补丁的残缺工程。
- `review/full.patch`：相对于上述 HEAD 的原生 Git 差异，加上每个未跟踪新增文件的原生 no-index 差异；不通过暂存构造补丁。普通 git diff 未显示新增文件的问题已显式处理。Git diff 的退出码 1 代表有差异，不是测试失败；行尾转换提醒另保留在本机记录，没有改 Git 配置或源码行尾。
- `review/changed-files.txt`、`added-files.txt`：完整修改/新增清单；`file-manifest.json` 标明新增、修改、上下文及逐文件 SHA-256。
- `review/gui-destroy-fix.patch`：GUI 轮次初始 LobbyView 到最终源码的精确最小修复；保留 `isValid(root, true)`，不改 Meta UUID。
- 测试：`tools/tests/test_lobby.py`、`lobby_model.test.cjs` 和原 13 项回归完整包含；`review/tests/lobby-lifecycle.md` 提供销毁问题的真实复现/回归步骤与覆盖边界；`validation/gui-lifecycle.json` 附历史真实复验字段和原证据 hash，不带原始截图/日志。
- `review/TEST_RESULTS.md`、`validation/`：本轮 CLI 和导出副本检查的脱敏输出，以及历史 GUI 结果。所有原始本机材料继续保留，不覆盖。
- `review/SHA256SUMS` 覆盖包内除自身之外的所有文件（含 manifest）；解压后 `python -B review/verify_package.py` 可只读验证清单及 hash。ZIP 整包 hash 放在外部 sidecar，避免自引用。

排除 `.git`、`.local`、node_modules、temp/library/profiles/local/build/dist/cache、引擎安装包、生成的本机 SDK 声明、账号/auth 数据、环境私密文件以及 cocos-service.json/information.json。原 GUI 报告中的 `.local` 证据路径是历史引用，包内不包含该目录；需要原始证据时应另行安排经过许可的材料提供，不能把摘要视为原始日志。

既有行为受影响：无。本轮没有修改产品源码或测试行为；没有新增模拟 cc 测试来冒充实际引擎验证。

## 3. 实际验证（无验证则写 not_run）

沿用 Windows、Python 3.13.5、Node 26.4.0、TypeScript 5.8.2；未安装或升级工具。证据目录 **E = `.local/validation/p1-02-final-review/`**。

| OS | 命令/步骤 | 结果 | 日志或证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows | 起始 status/HEAD/index、78 个非忽略文件、2 私有配置、907 个既有本机文件 hash 基线 | `passed` | E/before.json、status-before.txt | 不复制私有配置内容，不覆盖既有修改 |
| Windows | 编辑前 encoding-guard | `passed` | E/encoding-before-docs.log | 现有文本未发现编码/疑似文字丢失 |
| Windows | `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261027T155329.080727Z/`，E/source-cli.log | docs/unit/typecheck 全部 exit 0；15 unittest 无 skip，内含 9 组纯 TS 断言；真实现有引擎声明用于 tsc |
| Windows | 文档同步后 `python -B tools/check_docs.py` 与编码/Git/私有忽略/保留核对 | `passed` | E/docs-final.log、encoding-final.log、final-checks.json、preservation.json | 后续仅文档变化，不重复无变化的源码测试；两私有文件禁用全局忽略后仍命中项目规则且未跟踪 |
| Windows / 导出副本 | 文档检查、14 项工具/静态测试、9 组纯模型断言 | `passed`（注明 skip） | 包内 review/validation/portable-checks.json、portable-*.txt | 14 项中 13 passed、1 Git 忽略测试因无 .git skipped；模型用现有锁定 TypeScript，经仅对子进程生效的 NODE_PATH，未把依赖装入包 |
| Windows / 导出副本 | 原安全入口 typecheck | `blocked` / 2 | E/portable-typecheck.log、包内脱敏输出 | 包中有意排除依赖及真实生成的 Cocos 配置/声明；不伪造类型，不启动编辑器补齐 |
| Windows | ZIP CRC、条目安全、全文件清单/hash、源码原字节、完整补丁路径覆盖、敏感内容核对 | `passed` | E/package-result.json、complete-file-list.txt，包内 manifest/SHA256SUMS | 完整性和静态审查材料，不代表新增图形/设备结果 |
| Windows | 解压最终 ZIP 后只读 hash 验证 | `passed` | E/verify-extracted.log | 验证实际 ZIP 解压结果，不只验证打包前目录 |
| Windows GUI | Cocos/浏览器/预览/截图或生命周期再次执行 | `not_run` | 无本轮 GUI 证据 | 用户明确禁止；本轮没有调用图形工具 |
| macOS / 微信真机 | 实机 CLI、构建/触控/安全区/性能 | `not_run` | - | 不扩充先前平台验证结论 |

### 销毁修复的对应测试与限制

历史 [GUI 验收报告](2026-10-27_issue-2_windows-gui-acceptance.md) 完整保留：前两次停止产生相同销毁警告；第二次当时尚未完成脚本刷新，不能算作修复成功。确认引擎生成代码已经包含严格有效性检查后，第三/四次真实启停没有新增此警告；同实例两次禁用/恢复也已验证。包内对应步骤和结构化字段为这项修复的实际回归证据，本轮不重新执行 GUI。

现有 15 项 CLI 并不覆盖 Cocos 对象销毁时序；没有单独的无引擎销毁单测。根节点仍存活时单独移除组件的分支也未实测，已在审查用例中标 not_run；不得从场景停止或纯导航断言推定该分支通过。

### 包的复现前置条件

文档检查只需 Python。完整 unit 需要现有 Node 与锁定 TypeScript；typecheck 还需要真实 Creator 3.8.8 生成的 `client/temp/tsconfig.cocos.json` 及 `cc.d.ts`、`cc.env.d.ts`、`cc.custom-macro.d.ts`、`jsb.d.ts`。无 .git 时 Git 忽略测试 skip 是明确限制；不能以审查 ZIP 的 skip 替代真实仓库忽略检查。不得在 Mac 为补齐这些前置条件自动启动 Cocos。

## 4. 运行环境保护核对

没有启动 GUI、浏览器、引擎/预览、截图或常驻服务；未读取或操作无关桌面/游戏进程。检查只使用已审阅的固定 CLI 和标准库打包/hash；所有子进程有时限并等待退出。未改系统设置、PATH、账号、Git 配置，未安装依赖或上传材料。

基线 78 个非忽略文件中仅本轮三份文档改变，另增本报告；两私有配置、所有既有源码/测试/Meta/锁文件及 907 个本机历史文件保持 hash。HEAD/索引不变，未暂存/提交/推送。包内不包含私有配置 hash 或内容；历史 GUI 摘要仅选择非敏感结果字段。

## 5. 文档同步清单

- PLAN：是；新增完整源码审查包报告入口，P1/P1-02 继续 in_progress，停在最终复审。
- INDEX / CHANGELOG：是；新报告单一职责、材料组成、验证与未执行边界。
- FEATURES / FEAT-001：不改；验收/功能范围无变化，Feature 不提前 done，AC-03 仍待 FEAT-003。
- README / ARCHITECTURE / TESTING / TECH_STACK / 素材 / ADR：不改；现有说明继续适用，包的复现前置条件集中在本报告和包内 review/README.md。
- P1-02 既有三份报告、P1-01 报告/历史失败/竖屏记录：全部保留原字节，不追写旧结果。

## 6. 未解决问题、风险和下一步

等待最终外部 Code Review 与用户正式验收；本轮不标 done、不提交或关闭 Issue。历史退出时 4 条 IPC 警告、1 条 Electron WebContents 错误和 28 条计时诊断未修复；嵌入编辑器外层焦点的按键失败保留，只有画布获焦的可视预览验证通过。

Mac 实机、微信构建/真机、触控/安全区、性能/长期泄漏、根存活时单独移除组件、真正子游戏往返仍未验证。原始 GUI 证据留在本机，审查 ZIP 只提供既有报告及经筛选的结果/校验，不宣称包含原始引擎日志或图片。

完成材料后停止；任何提交、推送、关闭 Issue 或下一功能需另行明确授权。
