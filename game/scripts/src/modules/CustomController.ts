import { reloadable } from '../utils/tstl-utils';

// 定义网格参数（假设地图总大小为 15000x15000，分 50x50 格子）
const GRID_SIZE = 64; // 15000 / 50 = 300（每个格子边长 300 单位）
const HALF_GRID = GRID_SIZE / 2; // 格子中心点偏移
const MAX_GRID = 256; // 50x50 网格的范围是 0~49

@reloadable
export class CustomController {
  // 记录玩家移动状态（避免连续按键冲突）
  private playerMoving: Map<PlayerID, boolean> = new Map();

  constructor() {
    // 监听客户端发送的 WASD 按键事件
    CustomGameEventManager.RegisterListener<{ key: string }>(
      "custom_key",
      (_, event) => this.handleKeyPress(event)
    );
  }

  // 处理按键事件
  private handleKeyPress(event: { PlayerID: PlayerID; key: string }) {
    print(`PlayerID=${event.PlayerID}`);

    const playerID = event.PlayerID;
    const hero = PlayerResource.GetSelectedHeroEntity(playerID);

    // 1. 校验单位合法性
    if (!hero || this.playerMoving.get(playerID)) return;

    // 2. 根据按键计算移动方向
    const direction = this.getDirectionFromKey(event.key);
    if (!direction) return;

    // 3. 计算目标网格位置
    const currentPos = hero.GetAbsOrigin();
    const targetPos = this.calculateGridPosition(currentPos, direction);

    if (!GridNav.CanFindPath(currentPos, targetPos)) {
      // 提示无法移动 todo
      return;
    }

    // 4. 执行移动
    this.moveToGrid(playerID, hero, targetPos);
  }

  // 将按键映射为方向向量
  private getDirectionFromKey(key: string): Vector | null {
    switch (key.toUpperCase()) {
      case "W": return Vector(0, 1, 0);    // 上 (Y+)
      case "A": return Vector(-1, 0, 0);   // 左 (X-)
      case "S": return Vector(0, -1, 0);   // 下 (Y-)
      case "D": return Vector(1, 0, 0);    // 右 (X+)
      default: return null;
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  }

  // 计算目标网格中心坐标
  private calculateGridPosition(currentPos: Vector, direction: Vector): Vector {
    // 将当前位置转换为网格坐标
    const gridX = Math.floor(currentPos.x / GRID_SIZE);
    const gridY = Math.floor(currentPos.y / GRID_SIZE);

    // 计算目标网格坐标
    //const targetGridX = gridX + direction.x;
    //const targetGridY = gridY + direction.y;
    const targetGridX = this.clamp(gridX + direction.x, 0, MAX_GRID);
    const targetGridY = this.clamp(gridY + direction.y, 0, MAX_GRID);

    // 转换为世界坐标（取网格中心点）
    return Vector(
      targetGridX * GRID_SIZE + HALF_GRID,
      targetGridY * GRID_SIZE + HALF_GRID,
      currentPos.z // 保持高度不变
    );
  }

  // 执行网格移动（带防抖逻辑）
  private moveToGrid(playerID: PlayerID, hero: CDOTA_BaseNPC, targetPos: Vector) {
    // 标记为移动中
    this.playerMoving.set(playerID, true);

    // 强制设置单位朝向（可选）
    hero.SetForwardVector((targetPos - hero.GetAbsOrigin() as Vector).Normalized());

    // 使用平滑移动（可选：可替换为瞬间移动） 要抄一下另外一个项目的，附带走路效果之类的这种
    MoveUnitToPosition(hero, targetPos, () => {
      // 移动完成后解除锁定
      this.playerMoving.set(playerID, false);
    });
  }
}

// 修复后的移动函数
function MoveUnitToPosition(
  unit: CDOTA_BaseNPC,
  target: Vector,
  onComplete: () => void,
  speed: number = 600
) {
  const startPos = unit.GetAbsOrigin();
  const distance = (target - startPos as Vector).Length();
  const duration = distance / speed;
  const startTime = GameRules.GetGameTime();

  Timers.CreateTimer(0.03, () => {
    const currentTime = GameRules.GetGameTime();
    const elapsed = currentTime - startTime;
    const progress = elapsed / duration;

    if (progress < 1) {
      const currentPos = startPos + (target - startPos) * progress as Vector;
      unit.SetAbsOrigin(currentPos);
      return 0.03;
    } else {
      unit.SetAbsOrigin(target);
      onComplete();
    }
  });
}