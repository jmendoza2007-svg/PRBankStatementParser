// Minimal browser entry to render a lightweight UI when the project isn't built
// This file avoids React/JSX so it can be executed directly by the browser as an ESM module

const root = document.getElementById('root');
if (root) {
  root.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="max-w-3xl w-full bg-white rounded-xl shadow p-6">
        <div class="flex items-center gap-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a1 1 0 001 1h16a1 1 0 001-1V7"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 7l-9 6-9-6"/></svg>
          <h1 class="text-xl font-bold text-gray-900">PR Bank Statement Parser</h1>
        </div>

        <p class="text-gray-600 mb-4">This is a lightweight browser-friendly UI used when the app hasn't been built. To run the full app, build or run the development server from the repository.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <h2 class="font-semibold text-gray-800">Quick start (local)</h2>
            <ol class="text-sm text-gray-700 mt-2 list-decimal ml-5">
              <li>Install dependencies: <code>npm install</code></li>
              <li>Run dev server: <code>npm run dev</code></li>
              <li>Or build production: <code>npm run build</code></li>
            </ol>
          </div>

          <div class="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <h2 class="font-semibold text-gray-800">About</h2>
            <p class="text-sm text-gray-700 mt-2">This placeholder UI lets you inspect the project and download files without a bundler. Use the full app by building the project or running it with a compatible dev server.</p>
          </div>
        </div>

        <div class="mt-6 flex space-x-3">
          <a href="/" class="px-4 py-2 bg-white border rounded text-sm text-gray-700">Reload</a>
          <a href="https://github.com/jmendoza2007-svg/PRBankStatementParser" target="_blank" rel="noreferrer" class="px-4 py-2 bg-blue-600 text-white rounded text-sm">Open repository</a>
        </div>
      </div>
    </div>
  `;
} else {
  console.warn('Root element not found; cannot render fallback UI.');
}