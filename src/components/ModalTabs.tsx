export type OrderModalTab = 'Order Details' | 'Products' | 'Invoice'

interface ModalTabsProps {
  activeTab: OrderModalTab
  onChange: (tab: OrderModalTab) => void
}

const tabs: OrderModalTab[] = ['Order Details', 'Products', 'Invoice']

export default function ModalTabs({ activeTab, onChange }: ModalTabsProps) {
  return (
    <div role="tablist" aria-label="Order information" className="flex gap-5 border-b border-[#EDEDED] px-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          id={`order-tab-${tab.toLowerCase().replaceAll(' ', '-')}`}
          aria-selected={activeTab === tab}
          aria-controls={`order-panel-${tab.toLowerCase().replaceAll(' ', '-')}`}
          onClick={() => onChange(tab)}
          className={`h-12 border-b-2 px-0.5 pt-1 text-[11px] font-medium uppercase tracking-[0.03em] ${
            activeTab === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-[#333] hover:text-primary'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
