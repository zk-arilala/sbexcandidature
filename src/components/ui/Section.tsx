export function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">
        {title}
      </h3>
      {children}
    </section>
  )
}
