"use client";

interface Tab {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface ToggleTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function ToggleTabs({ tabs, activeTab, onTabChange }: ToggleTabsProps) {
  return (
    <div className="flex select-none items-center gap-1 md:gap-3 p-1 rounded-[44px] bg-white shadow-[0_0_11.1px_0_rgba(0,0,0,0.25)]">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`h-8 px-2 sm:px-3 md:px-4 rounded-[44px] font-poppins font-14 font-medium leading-none transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-[#222222] text-white"
                : "text-[#222222] hover:bg-[#F0F0F0]"
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
