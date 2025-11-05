"use client"
import React, { useState, useEffect } from 'react';

const PixelAvatarGenerator = () => {
  const [uuid, setUuid] = useState('');
  const [avatar, setAvatar] = useState<number[][]>([]);
  const [colors, setColors] = useState({ bg: '', primary: '', secondary: '' });

  // Simple hash function to convert UUID to deterministic number
  const hashUUID = (str:string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Generate complementary bi-color scheme
  const generateColors = (str:string) => {
    const hash = hashUUID(str);
    const hue = hash % 360;
    
    // Primary color - vibrant
    const primary = `hsl(${hue}, 70%, 55%)`;
    
    // Secondary color - complementary, opposite on color wheel)
    const secondaryHue = (hue + 180) % 360;
    const secondary = `hsl(${secondaryHue}, 70%, 60%)`;
    
    // Background - light version of primary
    const bg = `hsl(${hue}, 30%, 95%)`;
    
    return { bg, primary, secondary };
  };

  // Generate 5x5 grid with vertical symmetry (GitHub style)
  const generateAvatar = (str: string) => {
    if (!str) return [];
    
    const hash = hashUUID(str);
    let grid: number[][] = [];
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      grid = [];
      let filledCount = 0;
      
      // Generate left 3 columns
      for (let row = 0; row < 5; row++) {
        grid[row] = [];
        for (let col = 0; col < 3; col++) {
          const seed = hash + row * 17 + col * 31 + attempts * 97;
          // 0 = empty, 1 = primary color, 2 = secondary color
          const rand = seed % 100;
          let cellValue;
          if (rand < 35) {
            cellValue = 0; // empty
          } else if (rand < 70) {
            cellValue = 1; // primary
            filledCount++;
          } else {
            cellValue = 2; // secondary
            filledCount++;
          }
          grid[row][col] = cellValue;
        }
      }
      
      // Mirror to create symmetry
      for (let row = 0; row < 5; row++) {
        grid[row][3] = grid[row][1];
        grid[row][4] = grid[row][0];
        if (grid[row][3] > 0) filledCount++;
        if (grid[row][4] > 0) filledCount++;
      }
      
      const fillPercentage = (filledCount / 25) * 100;
      
      // Ensure nice pattern (40-85% filled for bi-color)
      if (fillPercentage >= 40 && fillPercentage <= 85) {
        break;
      }
      
      attempts++;
    }
    
    return grid;
  };

  // Generate random UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  useEffect(() => {
    const newUuid = generateUUID();
    setUuid(newUuid);
  }, []);

  useEffect(() => {
    if (uuid) {
      setAvatar(generateAvatar(uuid));
      setColors(generateColors(uuid));
    }
  }, [uuid]);

  const handleGenerate = () => {
    const newUuid = generateUUID();
    setUuid(newUuid);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUuid(e.target.value);
  };

  const getCellColor = (value: number) => {
    if (value === 0) return colors.bg;
    if (value === 1) return colors.primary;
    return colors.secondary;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="flex gap-8 max-w-7xl mx-auto">
        <div className="flex-1 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Hash Pix
        </h1>
        <p className="text-gray-600 text-center mb-8">
          GitHub-style Pixel avatars with bi-color scheme
        </p>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-center mb-8">
            <div 
              className="inline-block p-8 rounded-xl shadow-inner"
              style={{ backgroundColor: colors.bg }}
            >
              <div className="grid grid-cols-5">
                {avatar.map((row, i) => (
                  row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      className="w-10 h-10 transition-all duration-300"
                      style={{
                        backgroundColor: getCellColor(cell)
                      }}
                    />
                  ))
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-lg shadow-md mb-2 mx-auto"
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-xs text-gray-600">Primary</p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-lg shadow-md mb-2 mx-auto"
                style={{ backgroundColor: colors.secondary }}
              />
              <p className="text-xs text-gray-600">Secondary</p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-lg shadow-md mb-2 mx-auto border border-gray-200"
                style={{ backgroundColor: colors.bg }}
              />
              <p className="text-xs text-gray-600">Background</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UUID Input
              </label>
              <input
                type="text"
                value={uuid}
                onChange={handleInputChange}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter UUID or any text"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Generate Random Identicon
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Features
          </h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start">
              <span>- GitHub-style 5x5 identicon with vertical symmetry</span>
            </li>
            <li className="flex items-start">
              <span>- Bi-color scheme with complementary colors automatically generated</span>
            </li>
            <li className="flex items-start">
              <span>- Guaranteed balanced patterns (40-85% filled) for visual appeal</span>
            </li>
            <li className="flex items-start">
              <span>- Deterministic - same UUID always produces identical identicon</span>
            </li>
            <li className="flex items-start">
              <span>- Primary and secondary colors are complementary (opposite on color wheel)</span>
            </li>

            <li className="flex items-start">
              <span>- Upcoming : export in different formats + api to get image directly</span>
            </li>
          </ul>
        </div>
        </div>
        
        {/* Right Sidebar */}
        <aside className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-10">
          <div className="bg-white rounded-l-xl shadow-lg px-4 py-8 flex flex-col items-center justify-center gap-6">
            <div className="writing-vertical-rl" style={{ transform: 'rotate(180deg)' }}>
              <p 
                className="text-gray-600 text-xs whitespace-nowrap"
                style={{ fontFamily: 'var(--font-press-start-2p)' }}
              >
                built with &lt;3 by <a href="https://vinitkeshri.com" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">vinit</a>
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <a 
                href="https://github.com/vinitkeshri/hash-pix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="View on GitHub"
              >
                <svg 
                  className="w-5 h-5 text-gray-700" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PixelAvatarGenerator;