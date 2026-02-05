export function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`p-4 border-t bg-gray-50 ${className}`}>{children}</div>;
}
