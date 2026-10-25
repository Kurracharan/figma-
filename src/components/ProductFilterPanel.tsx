import { useState } from 'react'
import Icon from './Icon'

interface ProductFilterPanelProps {
	categories: string[]
	selectedCategory: string
	onCategoryChange: (category: string) => void
}

function ProductFilterPanel({
	categories,
	selectedCategory,
	onCategoryChange,
}: ProductFilterPanelProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className="product-filter-wrapper">
			<button
				type="button"
				className="toolbar-actions-btn"
				aria-expanded={isOpen}
				aria-haspopup="true"
				onClick={() => setIsOpen((open) => !open)}
			>
				<Icon name="filter" size={15} /> Filter
			</button>
			{isOpen && (
				<div className="product-filter-popover">
					<label htmlFor="product-category-filter">Category</label>
					<select
						id="product-category-filter"
						value={selectedCategory}
						onChange={(event) => onCategoryChange(event.target.value)}
					>
						<option value="all">All categories</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	)
}

export default ProductFilterPanel
