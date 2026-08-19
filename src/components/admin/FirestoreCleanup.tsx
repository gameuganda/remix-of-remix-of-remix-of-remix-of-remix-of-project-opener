import { useState } from "react";
import { collection, getDocs, query, writeBatch, limit as qLimit } from "firebase/firestore";
import { toast } from "sonner";
import { firebase } from "@/lib/firebase";
import { Btn, Panel } from "./ui";

/** Collections that grow forever and are the usual cause of a full database. */
const TARGETS = [
  { name: "activities", label: "Activity log", safe: true },
  { name: "payment_sessions", label: "Payment sessions", safe: true },
  { name: "transactions", label: "Transactions (money ledger)", safe: false },
  { name: "bets", label: "Bets / tickets", safe: false },
  { name: "agents", label: "Agents", safe: false },
  { name: "partners", label: "Partners", safe: false },
  { name: "affiliates", label: "Affiliates", safe: false },
  { name: "users", label: "Users", safe: false },
] as const;

type Counts = Record<string, number | undefined>;

export function FirestoreCleanup() {
  const [counts, setCounts] = useState<Counts>({});
  const [busy, setBusy] = useState<string | null>(null);

  const measure = async (name: string) => {
    setBusy(name);
    try {
      const { db } = await firebase();
      const snap = await getDocs(collection(db, name));
      setCounts((c) => ({ ...c, [name]: snap.size }));
    } catch (e) {
      toast.error(`Could not read ${name}: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const purge = async (name: string, label: string) => {
    if (!window.confirm(`Delete EVERY document in "${label}"? This cannot be undone.`)) return;
    setBusy(name);
    let removed = 0;
    try {
      const { db } = await firebase();
      // Delete in chunks of 400 so we stay under the 500-write batch limit.
      for (;;) {
        const snap = await getDocs(query(collection(db, name), qLimit(400)));
        if (snap.empty) break;
        const batch = writeBatch(db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        removed += snap.size;
        if (snap.size < 400) break;
      }
      setCounts((c) => ({ ...c, [name]: 0 }));
      toast.success(`Deleted ${removed} document${removed === 1 ? "" : "s"} from ${label}`);
    } catch (e) {
      toast.error(`Cleanup failed: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Panel title="Database cleanup (free up storage / quota)">
      <p className="text-[11px] text-xb-text-muted">
        Count a collection first, then delete it if it is bloating the database. Deletions are
        permanent — start with the log collections marked safe.
      </p>
      <div className="mt-2 space-y-1">
        {TARGETS.map((t) => (
          <div
            key={t.name}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-xb-panel-alt px-2 py-1.5"
          >
            <div className="min-w-0">
              <div className="text-[11.5px] font-bold text-xb-text">
                {t.label}
                {t.safe && <span className="ml-1 text-[10px] font-black text-xb-green">SAFE</span>}
              </div>
              <div className="text-[10.5px] text-xb-text-muted">
                {counts[t.name] === undefined ? "not counted" : `${counts[t.name]} documents`}
              </div>
            </div>
            <div className="flex gap-1">
              <Btn tone="blue" onClick={() => measure(t.name)} disabled={busy === t.name}>
                {busy === t.name ? "…" : "Count"}
              </Btn>
              <Btn tone="red" onClick={() => purge(t.name, t.label)} disabled={busy === t.name}>
                Delete all
              </Btn>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}