
import React from 'react';

const AppContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-container">
      <div className="app-wallpaper" aria-hidden="true" />
      <main className="app-surface">{children}</main>
    </div>
  );
};

export default AppContainer;
