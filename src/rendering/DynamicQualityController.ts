/** G1 / §15.2: drop one step when P95 is over budget. Hysteresis: drop fast. */
export class DynamicQualityController {
  dropped = false;
  private budgetMs: number;

  constructor(budgetMs = 22) {
    this.budgetMs = budgetMs;
  }

  note(p95: number, samples: number) {
    if (this.dropped) return false;
    if (samples < 45) return false;
    if (p95 <= this.budgetMs) return false;
    this.dropped = true;
    return true;
  }
}
