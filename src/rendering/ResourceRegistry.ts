/** RSH-019: deterministic, ref-counted ownership ledger. */
export type ResourceKind =
  | "csm"
  | "post-stack"
  | "render-target"
  | "renderer"
  | "audio"
  | "input"
  | "world"
  | "scene-object"
  | "other";

export type ResourceLeaseMetadata = {
  owner: string;
  kind: ResourceKind;
  shared?: boolean;
};

type Lease = {
  count: number;
  dispose: () => void;
  metadata: ResourceLeaseMetadata;
  order: number;
};

export type ResourceRegistrySnapshot = {
  state: "active" | "disposed";
  leaseIds: number;
  retainedReferences: number;
  disposedIds: readonly string[];
  disposalErrors: readonly string[];
  outstanding: readonly {
    id: string;
    count: number;
    owner: string;
    kind: ResourceKind;
    shared: boolean;
    order: number;
  }[];
};

export type ResourceDisposalReport = {
  alreadyDisposed: boolean;
  disposed: number;
  errors: number;
  outstanding: number;
};

const DEFAULT_METADATA: ResourceLeaseMetadata = {
  owner: "race-engine",
  kind: "other",
  shared: false,
};

function sameMetadata(a: ResourceLeaseMetadata, b: ResourceLeaseMetadata) {
  return a.owner === b.owner && a.kind === b.kind && !!a.shared === !!b.shared;
}

export class ResourceRegistry {
  private items = new Map<string, Lease>();
  private dead = false;
  private sequence = 0;
  private disposedIds: string[] = [];
  private disposalErrors: string[] = [];

  retain(
    id: string,
    dispose: () => void,
    metadata: ResourceLeaseMetadata = DEFAULT_METADATA,
  ) {
    if (!id.trim()) throw new Error("resource id must not be empty");
    const normalized = { ...DEFAULT_METADATA, ...metadata };
    if (this.dead) {
      this.disposeOne(id, dispose);
      return false;
    }
    const current = this.items.get(id);
    if (current) {
      if (current.dispose !== dispose) {
        throw new Error(`resource ${id} retained with a different disposer`);
      }
      if (!sameMetadata(current.metadata, normalized)) {
        throw new Error(`resource ${id} retained with different ownership metadata`);
      }
      current.count += 1;
      return true;
    }
    this.items.set(id, {
      count: 1,
      dispose,
      metadata: normalized,
      order: this.sequence++,
    });
    return true;
  }

  release(id: string) {
    const current = this.items.get(id);
    if (!current) return false;
    current.count -= 1;
    if (current.count > 0) return false;
    this.items.delete(id);
    this.disposeOne(id, current.dispose);
    return true;
  }

  disposeAll(): ResourceDisposalReport {
    if (this.dead) {
      return {
        alreadyDisposed: true,
        disposed: 0,
        errors: this.disposalErrors.length,
        outstanding: 0,
      };
    }
    this.dead = true;
    const entries = [...this.items.entries()].sort((a, b) => b[1].order - a[1].order);
    this.items.clear();
    const before = this.disposedIds.length;
    for (const [id, lease] of entries) this.disposeOne(id, lease.dispose);
    return {
      alreadyDisposed: false,
      disposed: this.disposedIds.length - before,
      errors: this.disposalErrors.length,
      outstanding: this.items.size,
    };
  }

  snapshot(): ResourceRegistrySnapshot {
    const outstanding = [...this.items.entries()]
      .sort((a, b) => a[1].order - b[1].order)
      .map(([id, lease]) => ({
        id,
        count: lease.count,
        owner: lease.metadata.owner,
        kind: lease.metadata.kind,
        shared: !!lease.metadata.shared,
        order: lease.order,
      }));
    return {
      state: this.dead ? "disposed" : "active",
      leaseIds: outstanding.length,
      retainedReferences: outstanding.reduce((sum, lease) => sum + lease.count, 0),
      disposedIds: [...this.disposedIds],
      disposalErrors: [...this.disposalErrors],
      outstanding,
    };
  }

  size() {
    return this.items.size;
  }

  private disposeOne(id: string, dispose: () => void) {
    try {
      dispose();
    } catch (error) {
      this.disposalErrors.push(`${id}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.disposedIds.push(id);
    }
  }
}
