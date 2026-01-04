// CategoryTabs Component
// Displays horizontal tabs for category navigation
// Used in Customer Order Screen and Kitchen Dashboard

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-hide w-full sm:w-fit mx-auto lg:mx-0">
      {categories.map(category => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              relative px-6 py-2.5 rounded-xl font-bold text-sm
              whitespace-nowrap transition-all duration-300
              ${isActive
                ? 'bg-white text-slate-900 shadow-md scale-100'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
