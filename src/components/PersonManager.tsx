"use client";

import { useEffect, useState, FormEvent } from "react";

type Person = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  city: "",
  country: "",
  bio: "",
};

export default function PersonManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/persons", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load people");
      setPeople(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const url = editingId ? `/api/persons/${editingId}` : "/api/persons";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(p: Person) {
    setEditingId(p.id);
    setForm({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      age: p.age?.toString() ?? "",
      city: p.city ?? "",
      country: p.country ?? "",
      bio: p.bio ?? "",
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this person?")) return;
    const res = await fetch(`/api/persons/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-fit">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {editingId ? "Edit Person" : "Add New Person"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name *"
              value={form.firstName}
              onChange={(v) => setForm({ ...form, firstName: v })}
              required
            />
            <Input
              label="Last name *"
              value={form.lastName}
              onChange={(v) => setForm({ ...form, lastName: v })}
              required
            />
          </div>
          <Input
            label="Email *"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Age"
              type="number"
              value={form.age}
              onChange={(v) => setForm({ ...form, age: v })}
            />
            <Input
              label="City"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(v) => setForm({ ...form, country: v })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium px-4 py-2 rounded-md transition"
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Person"
                : "Create Person"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            People ({people.length})
          </h2>
          <button
            onClick={load}
            className="text-xs text-indigo-600 hover:underline"
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : people.length === 0 ? (
          <p className="text-sm text-slate-500">
            No people yet. Add your first one.
          </p>
        ) : (
          <ul className="space-y-3">
            {people.map((p) => (
              <li
                key={p.id}
                className="border border-slate-200 rounded-lg p-3 hover:border-indigo-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                      {p.firstName} {p.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{p.email}</p>
                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-3">
                      {p.age && <span>Age {p.age}</span>}
                      {(p.city || p.country) && (
                        <span>
                          {[p.city, p.country].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                    {p.bio && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {p.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
