import { useEffect, useState } from "react";

function ClientOnlyComponent({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Runs only on the client
  }, []);

  return isClient ? children : null; // Render children only on the client
}

export default ClientOnlyComponent;
