"use client"

import { useState } from "react"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons"

interface Category {
  id: number
  name: string
}

const initialCategoriesData: Category[] = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Home & Kitchen" },
]

interface CategoryManagementProps {
  categories?: any
  onCategoryUpdate?: (categories: any) => void
}

export function CategoryManagement({ categories, onCategoryUpdate }: CategoryManagementProps) {
  // Use categories from props if available, otherwise use initial state
  const [categoriesData, setCategoriesData] = useState<Category[]>(categories || initialCategoriesData)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [editedCategoryName, setEditedCategoryName] = useState("")

  // Update parent component when categories change
  const handleCategoryUpdate = (updatedCategories: any) => {
    setCategoriesData(updatedCategories)
    if (onCategoryUpdate) {
      onCategoryUpdate(updatedCategories)
    }
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== "") {
      const newCategory: Category = {
        id: categoriesData.length > 0 ? Math.max(...categoriesData.map((c) => c.id)) + 1 : 1,
        name: newCategoryName,
      }
      handleCategoryUpdate([...categoriesData, newCategory])
      setNewCategoryName("")
    }
  }

  const handleDeleteCategory = (id: number) => {
    handleCategoryUpdate(categoriesData.filter((category) => category.id !== id))
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id)
    setEditedCategoryName(category.name)
  }

  const handleUpdateCategory = () => {
    if (editingCategoryId !== null && editedCategoryName.trim() !== "") {
      const updatedCategories = categoriesData.map((category) =>
        category.id === editingCategoryId ? { ...category, name: editedCategoryName } : category,
      )
      handleCategoryUpdate(updatedCategories)
      setEditingCategoryId(null)
      setEditedCategoryName("")
    }
  }

  const handleCancelEdit = () => {
    setEditingCategoryId(null)
    setEditedCategoryName("")
  }

  return (
    <Card>
      <CardHeader>
        <Text fontSize="xl" fontWeight="bold">
          Category Management
        </Text>
      </CardHeader>
      <CardBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categoriesData.map((category) => (
              <Tr key={category.id}>
                <Td>{category.id}</Td>
                <Td>
                  {editingCategoryId === category.id ? (
                    <Input value={editedCategoryName} onChange={(e) => setEditedCategoryName(e.target.value)} />
                  ) : (
                    category.name
                  )}
                </Td>
                <Td>
                  {editingCategoryId === category.id ? (
                    <>
                      <Button size="sm" colorScheme="green" onClick={handleUpdateCategory}>
                        Update
                      </Button>
                      <Button size="sm" onClick={handleCancelEdit} ml={2}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" colorScheme="blue" onClick={() => handleEditCategory(category)}>
                        <EditIcon />
                      </Button>
                      <Button size="sm" colorScheme="red" onClick={() => handleDeleteCategory(category.id)} ml={2}>
                        <DeleteIcon />
                      </Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
      <CardFooter>
        <Input
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleAddCategory} ml={2}>
          <AddIcon /> Add Category
        </Button>
      </CardFooter>
    </Card>
  )
}
