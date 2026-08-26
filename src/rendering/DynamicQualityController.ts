/** 21.6: drop planar → bloom → CSM → pixelScale. Raise after 5s under 16ms. */
export class DynamicQualityController {
  step = 0;
  private over = 0;
  private cool = 0;

  note(p95: number, dt: number): "drop" | "raise" | null {
    if (p95 > 20) {
      this.over++;
      this.cool = 0;
      if (this.over >= 90 && this.step < 8) {
        this.step++;
        this.over = 0;
        return "drop";
      }
      return null;
    }
    this.over = 0;
    if (p95 < 16) {
      this.cool += dt;
      if (this.cool >= 5 && this.step > 0) {
        this.step--;
        this.cool = 0;
        return "raise";
      }
    } else this.cool = 0;
    return null;
  }

  reset() {
    this.step = 0;
    this.over = 0;
    this.cool = 0;
  }
}
