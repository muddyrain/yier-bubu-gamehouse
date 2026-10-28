# Feature 总表、编号与实施状态（唯一 Feature 状态源）

> DOC-FEATURES · v1.3 · 2026-10-27。状态按功能全部验收范围填写；P1-02 已获授权开发大厅，未通过完整图形/集成验收前不标 done。单项详见 `docs/features/`。

全项目首发界面统一横屏，以 1280×720 为设计基准，暂不做单游戏动态旋转，见 [ADR-0003](decisions/ADR-0003-landscape-first.md)。P1-02 仅推进 FEAT-001 大厅，未提前完成选角、生命周期、联机或发布质量功能。

| ID | 功能与详情 | 优先级 | 阶段 | 状态 | 依赖 |
| --- | --- | --- | --- | --- | --- |
| FEAT-001 | [游戏大厅与目录](features/FEAT-001-game-lobby.md) | P0 | P1 | `in_progress` | 无 |
| FEAT-002 | [一二/布布选角](features/FEAT-002-character-selection.md) | P0 | P1 | `planned` | 001 |
| FEAT-003 | [小游戏生命周期和注册](features/FEAT-003-game-module-lifecycle.md) | P0 | P1 | `planned` | 001 |
| FEAT-004 | [玩家进度和存档](features/FEAT-004-save-system.md) | P0 | P1 | `planned` | 002、003 |
| FEAT-005 | [一二布布守护小屋](features/FEAT-005-tower-defense.md) | P0 | P2/P4 | `planned` | 002–004 |
| FEAT-006 | [一二布布黄金矿工](features/FEAT-006-gold-miner.md) | P0 | P3/P4 | `planned` | 002–004 |
| FEAT-007 | [一二布布合成乐园](features/FEAT-007-merge-game.md) | P1 | P4 | `planned` | 002–004 |
| FEAT-008 | [一二布布贪吃蛇](features/FEAT-008-snake-game.md) | P1 | P4 | `planned` | 002–004 |
| FEAT-009 | [公共奖励与小屋](features/FEAT-009-shared-progression.md) | P1 | P4 | `planned` | 004 |
| FEAT-010 | [微信平台适配](features/FEAT-010-wechat-platform.md) | P0 | P1/P4 | `planned` | 001–004 |
| FEAT-011 | [好友房、选角与联机](features/FEAT-011-multiplayer-room.md) | P1 | P5 | `planned` | 002、003、006、010 |
| FEAT-012 | [素材与发布质量](features/FEAT-012-asset-and-quality.md) | P0 | P1–P4 | `in_progress` | 关联 001、002、010（分阶段） |

优先级说明：P0 = 建立可用骨架/核心玩法所必需；P1 = 首发完整内容或重要延伸；P2 = 后续探索。阶段整体状态唯一记录于 `PLAN.md`，这里仅记录**功能自身状态**。

## 关键规则

- 新 Feature 按下一个编号添加一行并创建符合 `docs/templates/FEATURE_TEMPLATE.md` 的文件；编号只增不减。
- 状态迁移通常为 `planned → in_progress → done`；阻塞为 `blocked`，取消为 `cancelled`，保留记录。
- 进入 `done` 必须满足该 Feature 全部验收项，并有按 OS 分类的真实测试报告；纯文档完成不代表功能 done。
- 本列表与 `docs/PLAN.md` 不相互复制；更新时遵循 `docs/DOC_RULES.md`。
