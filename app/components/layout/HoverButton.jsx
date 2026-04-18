export default function HoverButton({ name = "View All" }) {
  return (
    <>
      <span className="btn-wipe-text group-hover:text-black uppercase">
        {name}
      </span>

      <span className="btn-wipe-overlay group-hover:translate-x-0" />

      <span className="btn-wipe-border group-hover:opacity-100" />
    </>
  );
}