const SUPABASE_URL  = 'https://cogmqybbyfvyfoxxzdcf.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZ21xeWJieWZ2eWZveHh6ZGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDI5MDQsImV4cCI6MjA5MjQ3ODkwNH0.Xv8og7esETcLNg1zHfei-bWLaBvdjRXyCJrzZ_tCnJo';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession:   true,
    autoRefreshToken: true,
  }
});

function showToast(message, type = 'info') {
  document.getElementById('toast')?.remove();

  const colors = {
    success: 'bg-emerald-600 border-emerald-500',
    error:   'bg-red-700 border-red-600',
    info:    'bg-slate-700 border-slate-600',
  };
  const icons = {
    success: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
    error:   `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
    info:    `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  };

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-white text-sm font-medium transition-all duration-300 translate-y-2 opacity-0 ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">${icons[type] || icons.info}</svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
