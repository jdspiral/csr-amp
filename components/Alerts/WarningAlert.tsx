interface WarningAlertProps {
  children?: React.ReactNode;
}

export default function WarningAlert({ children }: WarningAlertProps) {
  return (
    <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-3 rounded mb-4">
      {children ? (
        children
      ) : (
        <>
          <strong>This is a warning Alert.</strong>
        </>
      )}
    </div>
  );
}
