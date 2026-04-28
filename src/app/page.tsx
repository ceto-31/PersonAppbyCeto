import PersonManager from "@/components/PersonManager";

export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-fg">
          Person Management
        </h1>
        <p className="text-sm text-fg-muted mt-1">
          Full CRUD for person records, backed by PostgreSQL via Prisma.
        </p>
      </div>
      <PersonManager />
    </div>
  );
}
