export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🔐 Auth API
        </h1>
        <p className="text-gray-600 mb-2">
          Authentication API для Aelum Haus
        </p>
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">📡 API Endpoint</h2>
          <code className="bg-gray-100 p-2 rounded block">
            POST /api/auth
          </code>
        </div>
      </div>
    </div>
  )
}
