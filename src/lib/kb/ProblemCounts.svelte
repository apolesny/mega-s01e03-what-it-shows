<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  // Three problems: the one-day moves are not month flips, whatever tenant they came from.
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const rows = $derived.by(() => {
    const oneDay = merged.filter((r) => notes.oneDayMove.includes(r.id));
    const rest = merged.filter((r) => !notes.oneDayMove.includes(r.id));
    const n = (c: string) => rest.filter((r) => causeOf(r, tenantOf(r)) === c).length;
    return [
      { problem: 'parser reads dates month first', reports: n('parser') },
      { problem: 'booking-v3 form hint says MM/DD/YYYY', reports: n('hint') },
      { problem: 'invite lands one day off', reports: oneDay.length },
    ];
  });
  const total = $derived(rows.reduce((s, r) => s + r.reports, 0));
</script>

<table>
  <thead><tr><th>problem</th><th>reports</th></tr></thead>
  <tbody>
    {#each rows as r (r.problem)}<tr><td>{r.problem}</td><td>{r.reports}</td></tr>{/each}
    <tr><td><b>total (unique reports in #{ticket})</b></td><td><b>{total}</b></td></tr>
  </tbody>
</table>
