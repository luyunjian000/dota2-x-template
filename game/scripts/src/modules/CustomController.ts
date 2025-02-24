import { reloadable } from '../utils/tstl-utils';

// 调整网格参数（精确边界处理）
const GRID_SIZE = 64;
const HALF_GRID = GRID_SIZE / 2;
const MAX_X = 16384; // 地图实际最大坐标
const MAX_Y = 16384;

@reloadable
export class CustomController {
  private playerMoving: Map<PlayerID, boolean> = new Map();
  private moveParticles: Map<PlayerID, ParticleID> = new Map(); // 存储特效实例

  constructor() {
    CustomGameEventManager.RegisterListener<{ key: string }>(
      "custom_key",
      (_, event) => this.handleKeyPress(event)
    );
  }

  private handleKeyPress(event: { PlayerID: PlayerID; key: string }) {
    const playerID = event.PlayerID;
    const hero = PlayerResource.GetSelectedHeroEntity(playerID);

    if (!hero || this.playerMoving.get(playerID)) return;

    const direction = this.getDirectionFromKey(event.key);
    if (!direction) return;

    const currentPos = hero.GetAbsOrigin();
    const targetPos = this.calculateGridPosition(currentPos, direction);

    // 精确边界检测（使用实际坐标而非网格编号）
    if (
      targetPos.x < 0 || targetPos.x > MAX_X ||
      targetPos.y < 0 || targetPos.y > MAX_Y ||
      !GridNav.CanFindPath(currentPos, targetPos)
    ) {
      this.playDenyEffect(hero); // 播放禁止移动特效
      return;
    }

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

  // 修复坐标0点左移问题
  private calculateGridPosition(currentPos: Vector, direction: Vector): Vector {
    // 直接计算目标坐标（不使用网格编号约束）
    let targetX = currentPos.x + direction.x * GRID_SIZE;
    let targetY = currentPos.y + direction.y * GRID_SIZE;

    // 中心点对齐
    targetX = Math.floor(targetX / GRID_SIZE) * GRID_SIZE + HALF_GRID;
    targetY = Math.floor(targetY / GRID_SIZE) * GRID_SIZE + HALF_GRID;

    return Vector(targetX, targetY, currentPos.z);
  }

  private moveToGrid(playerID: PlayerID, hero: CDOTA_BaseNPC, targetPos: Vector) {
    this.playerMoving.set(playerID, true);

    // 播放移动特效（可选）
    const particle = ParticleManager.CreateParticle(
      "particles/units/heroes/hero_dark_seer/dark_seer_surge.vpcf",
      ParticleAttachment.ABSORIGIN_FOLLOW,
      hero
    );
    this.moveParticles.set(playerID, particle);

    // 创建移动命令
    const order: ExecuteOrderOptions = {
      UnitIndex: hero.entindex(),
      OrderType: UnitOrder.MOVE_TO_POSITION,
      Position: targetPos,
      Queue: false // 不排队其他命令
    };

    // 执行移动命令
    ExecuteOrderFromTable(order);

    // 监听移动完成（通过 Modifier 或计时器）
    this.monitorMovementCompletion(playerID, hero, targetPos);
  }

  private monitorMovementCompletion(
    playerID: PlayerID,
    hero: CDOTA_BaseNPC,
    targetPos: Vector
  ) {
    const checkInterval = 0.1;
    const tolerance = GRID_SIZE / 4; // 允许的位置误差

    Timers.CreateTimer(checkInterval, () => {
      if (!hero || !hero.IsAlive()) {
        this.cleanupMovement(playerID);
        return;
      }

      const currentPos = hero.GetAbsOrigin();
      const distance = (currentPos - targetPos as Vector).Length2D();

      if (distance <= tolerance) {
        // 精确对齐到网格中心
        hero.SetAbsOrigin(Vector(
          Math.round(currentPos.x / GRID_SIZE) * GRID_SIZE + HALF_GRID,
          Math.round(currentPos.y / GRID_SIZE) * GRID_SIZE + HALF_GRID,
          currentPos.z
        ));
        this.cleanupMovement(playerID);
      } else {
        return checkInterval; // 继续监控
      }
    });
  }

  private cleanupMovement(playerID: PlayerID) {
    // 移除特效
    const particle = this.moveParticles.get(playerID);
    if (particle) {
      ParticleManager.DestroyParticle(particle, false);
      this.moveParticles.delete(playerID);
    }
    
    this.playerMoving.set(playerID, false);
  }

  // 禁止移动特效
  private playDenyEffect(hero: CDOTA_BaseNPC) {
    ParticleManager.CreateParticle(
      "particles/ui/generic_deny.vpcf",
      ParticleAttachment.OVERHEAD_FOLLOW,
      hero
    );
    EmitSoundOn("General.Cancel", hero);
  }
}

