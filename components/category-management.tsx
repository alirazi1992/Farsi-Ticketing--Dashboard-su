"use client"

import type React from "react"
import { useState } from "react"

interface CategoryManagementProps {
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, onCategoryUpdate }) => {
  const [localCategories, setLocalCategories] = useState(categories)
  const [newCategory, setNewCategory] = useState("")
  const [newSubcategory, setNewSubcategory] = useState("")

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const updatedCategories = {
        ...localCategories,
        [newCategory.trim()]: [],
      }
      setLocalCategories(updatedCategories)
      onCategoryUpdate(updatedCategories)
      setNewCategory("")
    }
  }

  const handleDeleteCategory = (categoryKey: string) => {
    const updatedCategories = { ...localCategories }
    delete updatedCategories[categoryKey]
    setLocalCategories(updatedCategories)
    onCategoryUpdate(updatedCategories)
  }

  const handleAddSubcategory = (categoryKey: string) => {
    if (newSubcategory.trim()) {
      const updatedCategories = {
        ...localCategories,
        [categoryKey]: [...localCategories[categoryKey], newSubcategory.trim()],
      }
      setLocalCategories(updatedCategories)
      onCategoryUpdate(updatedCategories)
      setNewSubcategory("")
    }
  }

  const handleDeleteSubcategory = (categoryKey: string, subcategoryIndex: number) => {
    const updatedCategories = {
      ...localCategories,
      [categoryKey]: localCategories[categoryKey].filter((_: any, index: number) => index !== subcategoryIndex),
    }
    setLocalCategories(updatedCategories)
    onCategoryUpdate(updatedCategories)
  }

  return (
    <div>
      <h2>Category Management</h2>

      <div>
        <h3>Add Category</h3>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category"
        />
        <button onClick={handleAddCategory}>Add</button>
      </div>

      <div>
        <h3>Categories</h3>
        {Object.keys(localCategories).map((categoryKey) => (
          <div key={categoryKey}>
            <h4>{categoryKey}</h4>
            <button onClick={() => handleDeleteCategory(categoryKey)}>Delete Category</button>

            <div>
              <h5>Add Subcategory</h5>
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="New Subcategory"
              />
              <button onClick={() => handleAddSubcategory(categoryKey)}>Add Subcategory</button>
            </div>

            <div>
              <h5>Subcategories</h5>
              {localCategories[categoryKey].map((subcategory: string, index: number) => (
                <div key={index}>
                  {subcategory}
                  <button onClick={() => handleDeleteSubcategory(categoryKey, index)}>Delete Subcategory</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
