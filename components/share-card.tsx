export function ShareCard({
  kicker,
  title,
  detail,
}: {
  kicker: string;
  title: string;
  detail: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f3eee4",
        color: "#241c15",
        padding: "68px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#8d3b16" }}>What’s Next SK9</div>
        <div style={{ display: "flex", fontSize: 28, color: "#4e433a" }}>Every Friday</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 28, color: "#8d3b16", marginBottom: 18 }}>{kicker}</div>
        <div style={{ display: "flex", fontSize: 62, fontWeight: 650, lineHeight: 1.15, letterSpacing: -1 }}>
          {title}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: "#4e433a", maxWidth: 980 }}>{detail}</div>
    </div>
  );
}
