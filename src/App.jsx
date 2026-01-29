import { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [length, setLength] = useState(12);
  const [number, setNumber] = useState(true);
  const [character, setCharacter] = useState(true);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' });
  const [history, setHistory] = useState([]);

  const passwordref = useRef(null);

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (pass.length >= 16) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 6) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const copytoclipboard = useCallback(() => {
    passwordref.current?.select();
    passwordref.current?.setSelectionRange(0, 100);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  const passwordGenerator = useCallback(() => {
    let pass = '';
    let string = '';
    
    if (uppercase) string += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) string += 'abcdefghijklmnopqrstuvwxyz';
    if (number) string += '0123456789';
    if (character) string += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (string === '') string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * string.length);
      pass += string.charAt(char);
    }
    setPassword(pass);
    setStrength(calculateStrength(pass));
  }, [length, number, character, uppercase, lowercase]);

  const saveToHistory = () => {
    if (password && !history.includes(password)) {
      setHistory(prev => [password, ...prev].slice(0, 5));
    }
  };

  useEffect(() => {
    passwordGenerator();
  }, [length, number, character, uppercase, lowercase, passwordGenerator]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <h1 className="text-3xl font-bold text-white text-center flex items-center justify-center gap-2">
            🔐 Password Generator
          </h1>
        </div>

        <div className="p-6 space-y-4">
          {/* Password Display */}
          <div className="relative">
            <input
              type="text"
              value={password}
              className="w-full py-3 px-4 pr-24 bg-slate-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500 font-mono text-lg"
              placeholder="Generated password"
              readOnly
              ref={passwordref}
            />
            <button
              onClick={copytoclipboard}
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-semibold transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          {/* Strength Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Strength:</span>
              <span className="font-semibold">{strength.label}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300`}
                style={{ width: `${(strength.score / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <label className="text-sm font-medium">Length</label>
              <span className="text-purple-400 font-bold">{length}</span>
            </div>
            <input
              type="range"
              min={6}
              max={32}
              value={length}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'uppercase', label: 'Uppercase (A-Z)', state: uppercase, setState: setUppercase },
              { id: 'lowercase', label: 'Lowercase (a-z)', state: lowercase, setState: setLowercase },
              { id: 'numbers', label: 'Numbers (0-9)', state: number, setState: setNumber },
              { id: 'symbols', label: 'Symbols (!@#)', state: character, setState: setCharacter },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                  option.state
                    ? 'bg-purple-600/20 border-2 border-purple-500'
                    : 'bg-slate-700 border-2 border-transparent hover:border-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={option.state}
                  onChange={() => option.setState((prev) => !prev)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <span className="text-sm text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={passwordGenerator}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              🔄 Generate New
            </button>
            <button
              onClick={saveToHistory}
              className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              title="Save to history"
            >
              💾
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Recent Passwords</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {history.map((pass, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setPassword(pass);
                      navigator.clipboard.writeText(pass);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-sm font-mono text-gray-400 bg-slate-700/50 p-2 rounded cursor-pointer hover:bg-slate-700 transition-all truncate"
                  >
                    {pass}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;