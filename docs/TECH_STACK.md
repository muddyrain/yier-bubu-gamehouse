# 技术选型与版本策略

> DOC-TECH · v1.5 · 2026-10-26 · P1-01 使用 1280×720 横屏基线，Windows Startup 三种比例与停止/重启已有图形证据；Mac 实机与微信真机尚未验证。

| 层 | 选择 | 理由 / 注意事项 |
| --- | --- | --- |
| 引擎 | **Cocos Creator 3.8.8** / 官方 Windows 包 `win-121518` | 安装包签名有效；工程 `creator.version` 由编辑器写入；只使用官方 2D 模板/场景预设 |
| 游戏语言 | TypeScript **5.8.2** | 与安装包内置编译器一致；源码 strict，锁文件固定外部检查器 |
| 客户端 | Cocos 2D，首发统一 Landscape 横屏、1280×720 设计基准 | 见 ADR-0003；无单游戏动态旋转，不锁定设备物理分辨率 |
| 日常开发 | Codex + 编辑器（Windows 可 GUI） | Mac 默认 CLI 文件编辑与审查 |
| 外部 CLI | Node.js **26.4.0** / npm **11.17.0** | 使用本机现有版本并实际验证 tsc；不是引擎内嵌 Node 的版本，也不推定其他 Node 版本已验证 |
| 工具逻辑测试 | Python **3.13.5** 标准库 unittest | 检查入口、失败码、缺依赖、超时终止和文档扫描边界；无额外测试库 |
| 版本管理 | Git / GitHub | 独立仓库、短分支、Issue 与评审 |
| 平台入口 | 微信小游戏 SDK，经 PlatformAdapter 隔离 | 分享、登录、生命周期由适配层处理 |
| 单机存档 | 可替换的 SaveRepository，最初本地持久化 | schemaVersion 与数据迁移 |
| 后续联机 | Node.js + WSS、服务端权威房间状态 | 先二人房，再按需扩展 |
| 后续后端数据 | 数据库由 P5 按规模评估 | 不在 P1 提前搭建云生产环境 |

## 固定版本约定

- 引擎固定为 3.8.8，本机路径仅记录在被忽略的 `.local/environment.json`；官方安装 API、包名和 hash 证据见任务报告。
- Node/npm 实测版本在根 `.node-version` / `package.json` 固定；TypeScript 5.8.2 在 `package-lock.json` 固定。编辑器与外部检查器分别验证，不据外部 Node 推断编辑器兼容性。
- Python 脚本语法需要 3.10 以上；只实测 Windows 3.13.5，其余版本/平台需要各自记录证据。
- 安装使用 `npm ci --ignore-scripts --no-audit --no-fund`；唯一直接依赖为 TypeScript，已审阅包信息，无安装生命周期脚本，项目 `.npmrc` 禁止依赖脚本。
- `client/tsconfig.json` 延续官方模板对真实 `temp/tsconfig.cocos.json` 的继承，strict/noEmit/noUnused 生效；`skipLibCheck` 排除引擎声明内部的私有 PAL/WebGPU 等类型依赖检查，不伪造 SDK 声明。生成文件带本机路径，不提交。
- 检查器无 GUI 分支，具体命令、预算、缺声明时的阻塞行为见 README 与 TESTING。Mac 不具备有效引擎声明时，不为执行 tsc 自行打开 Cocos。
- 类型检查预检本地 TypeScript 编译器、`temp/tsconfig.cocos.json` 及四份声明 `cc.d.ts`、`cc.env.d.ts`、`cc.custom-macro.d.ts`、`jsb.d.ts`；缺失为 blocked。文件内容与实际 SDK 路径是否有效仍由 tsc 判断；不因为预检文件存在便推定兼容性通过。外部 ZIP 排除全部 `temp/`，因此不自带该前置条件。
- 项目升级引擎须建立 ADR，注明影响、迁移与回退，不得无理由更新到新版本。

## 重要构建事实

屏幕决策见 [ADR-0003](decisions/ADR-0003-landscape-first.md)。Startup 基线同时启用 Fit Width/Height，优先完整显示设计区域，允许留边；项目默认配置与旧场景 Canvas/相机分别修改并静态检查。后续微信构建必须选择 Landscape 并核验实际输出 `game.json`，本轮不执行构建或生成该文件。具体安全区/触控适配不能由这些参数推定通过。

1. Cocos Creator 官方 3.8 文档明确：**命令行构建仍需要 GUI 环境**。Mac 终端执行 Cocos 构建**不符合默认保护规则**；优先 Windows。
2. 构建微信小游戏可产出 `game.json`、`project.config.json`，从 Cocos 点击“运行”可能唤起微信开发者工具。Mac 默认不得执行该操作。
3. Asset Bundle 与小游戏分包是**计划优化手段**，首个原型不必立刻实现复杂分包；真机测量启动/包体后再拆分。
4. 微信小游戏并非浏览器；不要把普通 H5 测试等同微信真机验证。

官方技术引用与检索日期见 [REFERENCES.md](REFERENCES.md)。
