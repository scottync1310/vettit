 
export default function SiteTag({ name, fail }: { name: string; fail?: boolean }) {
  return (
    <span style={{ display: "inline-block", fontSize: "11px", padding: "2px 7px", border: fail ? "1px solid #ef9a9a" : "1px solid #d0d0d0", borderRadius: "2px", color: fail ? "#b71c1c" : "#444", background: fail ? "#ffebee" : "#fff", marginRight: "3px", marginBottom: "2px" }}>
      {name}
    </span>
  );
}
