import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';
import { ExampleApiService } from './services/example-api.service';
import { useEffect } from 'react';
import { useState } from 'react';

export function App() {
  const exampleApiService = new ExampleApiService();
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    exampleApiService
      .getNames()
      .then((response) => setNames(response.names || []));
  }, []);

  return (
    <div>
      <div>
        {names.map((name) => (
          <div className="text-2xl" key={name}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
