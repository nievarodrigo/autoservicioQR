export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bg:        #f7f4ef;
        --bg2:       #f0ece4;
        --card:      #ffffff;
        --border:    #e2ddd6;
        --black:     #1a1814;
        --dark:      #2e2b26;
        --muted:     #8a8070;
        --gold:      #c4913a;
        --green:     #2d6a4f;
        --green-bg:  #eaf4ee;
        --red:       #c0392b;
        --red-bg:    #fdf0ee;
        --blue:      #1a4a7a;
        --blue-bg:   #eef3fa;
        --orange:    #c4600a;
        --orange-bg: #fef3e8;
        --radius:    12px;
        --font-display: 'Syne', sans-serif;
        --font-mono:    'DM Mono', monospace;
      }

      html, body { height: 100%; }

      body {
        background: var(--bg);
        color: var(--black);
        font-family: var(--font-display);
        font-size: 14px;
        line-height: 1.5;
      }

      button { font-family: var(--font-display); cursor: pointer; }

      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
      @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      @keyframes spin    { to { transform: rotate(360deg); } }
      @keyframes bellShake {
        0%,100% { transform: rotate(0); }
        20%     { transform: rotate(-15deg); }
        40%     { transform: rotate(15deg); }
        60%     { transform: rotate(-10deg); }
        80%     { transform: rotate(10deg); }
      }
      @keyframes slideIn {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
      }

      .fade-up  { animation: fadeUp 0.3s ease both; }
      .fade-in  { animation: fadeIn 0.3s ease both; }

      @media print {
        .no-print    { display: none !important; }
        .print-only  { display: block !important; }
        body { background: white; }
      }
      .print-only { display: none; }
    `}</style>
  );
}
