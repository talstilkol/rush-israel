/** G1-05: ref-counted dispose. Idempotent disposeAll. */
type Lease = { count: number; dispose: () => void };

export class ResourceRegistry {
  private items = new Map<string, Lease>();
  private dead = false;

  retain(id: string, dispose: () => void) {
    const cur = this.items.get(id);
    if (cur) {
      cur.count++;
      return;
    }
    this.items.set(id, { count: 1, dispose });
  }

  release(id: string) {
    const cur = this.items.get(id);
    if (!cur) return;
    cur.count--;
    if (cur.count > 0) return;
    this.items.delete(id);
    cur.dispose();
  }

  disposeAll() {
    if (this.dead) return;
    this.dead = true;
    for (const [id, cur] of this.items) {
      this.items.delete(id);
      cur.dispose();
    }
  }

  size() {
    return this.items.size;
  }
}
