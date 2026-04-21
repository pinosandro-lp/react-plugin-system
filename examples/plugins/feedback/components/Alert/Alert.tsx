const ALERT_STYLE_BY_SEVERITY: Record<
  "info" | "warning" | "error",
  { backgroundColor: string; borderColor: string }
> = {
  info: {
    backgroundColor: "lightblue",
    borderColor: "blue",
  },
  warning: {
    backgroundColor: "yellow",
    borderColor: "orange",
  },
  error: {
    backgroundColor: "lightcoral",
    borderColor: "red",
  },
};

export interface AlertProps {
  message: string;
  severity: "info" | "warning" | "error";
}

export function Alert({ message, severity }: AlertProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        backgroundColor: ALERT_STYLE_BY_SEVERITY[severity].backgroundColor,
        border: `1px solid ${ALERT_STYLE_BY_SEVERITY[severity].borderColor}`,
        borderRadius: "5px",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}
