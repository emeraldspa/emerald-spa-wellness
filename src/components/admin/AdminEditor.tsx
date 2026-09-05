'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { compose, ComposeOutput } from '@/lib/cms/compose';
import { CollectionSchema, FieldDef } from '@/lib/cms/schema';

type Item = Record<string, unknown>;

export type AdminEditorProps = {
  schema: CollectionSchema;
  initialItems: Item[];
  categories?: { slug: string; name: string; count: number }[];
  initialCategory?: string;
  knownTreatments?: string[];
};

/**
 * The collection editor: one card per item, fields per schema, add, delete,
 * reorder, and a save that commits straight to the repository. The compose
 * helper on promotion collections turns pasted notes into structured,
 * editable suggestions using the house writing rules.
 */
export function AdminEditor({
  schema,
  initialItems,
  categories,
  initialCategory,
  knownTreatments,
}: AdminEditorProps) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(() => initialItems.map((i) => ({ ...i })));
  const [category, setCategory] = useState<string>(initialCategory ?? 'promotions');
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error' | 'busy'; text: string } | null>(
    null,
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [suggestion, setSuggestion] = useState<ComposeOutput | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const activeCategoryName = useMemo(
    () => categories?.find((c) => c.slug === category)?.name ?? schema.label,
    [categories, category, schema.label],
  );

  function touch() {
    setDirty(true);
    setStatus(null);
  }

  function setField(index: number, key: string, value: unknown) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
    touch();
  }

  function addItem() {
    const blank: Item = {};
    for (const f of schema.fields) {
      blank[f.key] = f.type === 'number' ? '' : f.type === 'boolean' ? false : '';
    }
    setItems((prev) => [...prev, blank]);
    setOpenIndex(items.length);
    touch();
  }

  function deleteItem(index: number) {
    const title = String(items[index]?.[schema.titleKey] ?? 'this item').slice(0, 60);
    if (!window.confirm(`Remove "${title}"? It disappears from the site after you save.`)) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
    touch();
  }

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    touch();
  }

  async function switchCategory(slug: string) {
    if (dirty && !window.confirm('Leave without saving? Unsaved changes are lost.')) return;
    setStatus({ kind: 'busy', text: 'Loading…' });
    const res = await fetch(`/api/cms/services?category=${encodeURIComponent(slug)}`);
    const body = (await res.json()) as { ok?: boolean; items?: Item[]; error?: string };
    if (body.ok && Array.isArray(body.items)) {
      setItems(body.items.map((i) => ({ ...i })));
      setCategory(slug);
      setDirty(false);
      setStatus(null);
    } else {
      setStatus({ kind: 'error', text: body.error ?? 'Could not load that category.' });
    }
  }

  async function save() {
    setStatus({ kind: 'busy', text: 'Saving and publishing…' });
    const endpoint = schema.slug === 'services' ? 'services' : schema.slug;
    const res = await fetch(`/api/cms/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, category }),
    });
    const body = (await res.json()) as { ok?: boolean; error?: string; message?: string };
    if (!res.ok || !body.ok) {
      setStatus({ kind: 'error', text: body.error ?? 'Save failed. Try again.' });
      return;
    }
    setDirty(false);
    setStatus({
      kind: 'ok',
      text: body.message ?? 'Saved. The live site picks this up within a few minutes.',
    });
    router.refresh();
  }

  function runComposer() {
    setSuggestion(compose({ notes, knownTreatments }));
  }

  function applySuggestion() {
    if (!suggestion) return;
    const blank: Item = {
      name: suggestion.name,
      price: suggestion.price ?? '',
      priceValue: suggestion.priceValue ?? '',
      duration: suggestion.duration ?? '',
      description: suggestion.description,
    };
    setItems((prev) => [...prev, blank]);
    setOpenIndex(items.length);
    setSuggestion(null);
    setNotes('');
    setComposerOpen(false);
    touch();
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-white">
            {schema.label}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/55">
            {schema.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/40 hover:text-white"
          >
            All collections
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || status?.kind === 'busy'}
            className="rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status?.kind === 'busy' ? 'Working…' : dirty ? 'Save and publish' : 'Saved'}
          </button>
        </div>
      </div>

      {/* Category rail (treatments) */}
      {schema.perCategory && categories ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => switchCategory(c.slug)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                c.slug === category
                  ? 'bg-white/90 text-emerald-950'
                  : 'border border-white/15 text-white/70 hover:border-white/40 hover:text-white'
              }`}
            >
              {c.name} <span className="opacity-60">({c.count})</span>
            </button>
          ))}
        </div>
      ) : null}

      {status ? (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${
            status.kind === 'ok'
              ? 'bg-emerald-500/15 text-emerald-200'
              : status.kind === 'error'
                ? 'bg-rose-500/15 text-rose-200'
                : 'bg-white/10 text-white/70'
          }`}
        >
          {status.text}
        </p>
      ) : null}

      {/* Compose from notes (promotions) */}
      {schema.composer ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <button
            type="button"
            onClick={() => setComposerOpen((v) => !v)}
            className="flex w-full items-center justify-between text-left"
            aria-expanded={composerOpen}
          >
            <span>
              <span className="font-medium text-white">Write it from a note</span>
              <span className="mt-1 block text-sm text-white/55">
                Paste what the client asked for, in plain words. The manager turns it into a
                structured, editable draft using the house writing rules. It never invents a
                price or a date that was not in the note.
              </span>
            </span>
            <span className="ml-4 shrink-0 text-white/50">{composerOpen ? '−' : '+'}</span>
          </button>
          {composerOpen ? (
            <div className="mt-5 space-y-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder={'e.g. Christmas special. Two people, Swedish massage, mini facial and hydrotherapy, N$1,500. Available 1-24 December.'}
                className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-400/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={runComposer}
                disabled={notes.trim().length < 8}
                className="rounded-full border border-emerald-400/40 px-5 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10 disabled:opacity-50"
              >
                Draft the copy
              </button>
              {suggestion ? (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-5 text-sm text-white/80">
                  <p className="font-medium text-white">{suggestion.name}</p>
                  {suggestion.alternates.length ? (
                    <p className="mt-1 text-xs text-white/50">
                      Other names: {suggestion.alternates.join(' · ')}
                    </p>
                  ) : null}
                  <p className="mt-3 leading-relaxed">{suggestion.description}</p>
                  <p className="mt-3 text-xs text-white/50">
                    Button: {suggestion.cta}
                    {suggestion.found.length ? ` · From your note: ${suggestion.found.join(', ')}` : ''}
                  </p>
                  {suggestion.found.length ? (
                    <p className="mt-1 text-xs text-white/40">
                      If something is missing here, add it yourself: the composer only uses what
                      it can see in the note.
                    </p>
                  ) : null}
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-emerald-950 hover:bg-emerald-400"
                    >
                      Add as new package
                    </button>
                    <button
                      type="button"
                      onClick={() => setSuggestion(null)}
                      className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 hover:border-white/40"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Items */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const title = String(item[schema.titleKey] ?? `Untitled ${index + 1}`).slice(0, 80);
          const open = openIndex === index;
          return (
            <div
              key={`${schema.slug}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex-1 truncate text-left text-sm font-medium text-white"
                  aria-expanded={open}
                >
                  <span className="mr-3 text-white/40">{String(index + 1).padStart(2, '0')}</span>
                  {title || 'Untitled'}
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${title} up`}
                    className="rounded-lg px-2 py-1 text-white/40 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move ${title} down`}
                    className="rounded-lg px-2 py-1 text-white/40 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    aria-label={`Remove ${title}`}
                    className="rounded-lg px-2 py-1 text-rose-300/70 transition hover:bg-rose-500/10 hover:text-rose-200"
                  >
                    ×
                  </button>
                </div>
              </div>
              {open ? (
                <div className="space-y-4 border-t border-white/10 px-5 py-5">
                  {schema.fields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={item[field.key]}
                      onChange={(v) => setField(index, field.key, v)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-white/15 px-5 py-4">
        <p className="text-sm text-white/50">
          Editing <span className="text-white/80">{activeCategoryName}</span>
          {dirty ? ' · unsaved changes' : ' · no changes yet'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addItem}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/80 transition hover:border-white/40"
          >
            + Add item
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || status?.kind === 'busy'}
            className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save and publish
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = (
    <label
      htmlFor={`f-${field.key}`}
      className="block text-xs font-medium uppercase tracking-wider text-white/50"
    >
      {field.label}
      {field.required ? <span className="ml-1 text-emerald-300/70">*</span> : null}
    </label>
  );
  const help = field.help ? <p className="mt-1 text-xs text-white/40">{field.help}</p> : null;
  const commonClass =
    'mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-400/60 focus:outline-none';

  if (field.type === 'boolean') {
    return (
      <div>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-black/30 accent-emerald-500"
          />
          {field.label}
        </label>
        {help}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        {label}
        <select
          id={`f-${field.key}`}
          value={String(value ?? field.options?.[0] ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={commonClass}
        >
          {(field.options ?? []).map((o) => (
            <option key={o} value={o} className="bg-emerald-950">
              {o}
            </option>
          ))}
        </select>
        {help}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        {label}
        <textarea
          id={`f-${field.key}`}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          rows={field.long ? 8 : 3}
          placeholder={field.placeholder}
          className={commonClass}
        />
        {help}
      </div>
    );
  }

  return (
    <div>
      {label}
      <input
        id={`f-${field.key}`}
        type={field.type === 'number' ? 'number' : 'text'}
        value={String(value ?? '')}
        onChange={(e) => onChange(field.type === 'number' ? e.target.value : e.target.value)}
        placeholder={field.placeholder}
        className={commonClass}
      />
      {help}
    </div>
  );
}
