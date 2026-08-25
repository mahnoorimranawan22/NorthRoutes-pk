export default function SidebarWidget() {
  return (
    <div
      className={`mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gradient-to-br from-green-50 to-orange-50 px-4 py-5 text-center dark:from-green-900/10 dark:to-orange-900/10`}
    >
      <div className="text-3xl mb-2">🏔️</div>
      <h3 className="mb-2 font-semibold font-heading text-gray-900 dark:text-white">
        NorthRoutes PK
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Discover Pakistan's majestic north. Manage tours, hotels, and bookings.
      </p>
      <a
        href="/"
        className="flex items-center justify-center p-3 font-medium font-heading text-white rounded-lg bg-gradient-to-r from-green-600 to-orange-500 text-theme-sm hover:from-green-700 hover:to-orange-600 shadow-sm transition-all"
      >
        View Customer Site
      </a>
    </div>
  );
}
