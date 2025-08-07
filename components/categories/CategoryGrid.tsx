"use client";

import React from "react";
import styled from "styled-components";
import CategoryCard from "./CategoryCard";
import AddNewCard from "./AddNewCard";
import { Inter } from "next/font/google";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface CategoryGridProps<T> {
  data: T[];
  fields: Array<{
    key: string;
    label: string;
    type?: 'text' | 'date' | 'status' | 'badge';
  }>;
  onAddNew?: () => void;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  emptyMessage?: string;
}

export default function CategoryGrid<T extends { id?: number }>({ 
  data, 
  fields,
  onAddNew,
  onEdit, 
  onDelete, 
  emptyMessage = "No items found" 
}: CategoryGridProps<T>) {
  if (!data || data.length === 0) {
    return (
      <GridContainer>
        {onAddNew && <AddNewCard onAddNew={onAddNew} />}
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyMessage>{emptyMessage}</EmptyMessage>
          <EmptySubtext>Start by adding your first entry using the card above.</EmptySubtext>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      {onAddNew && <AddNewCard onAddNew={onAddNew} />}
      {data.map((item, index) => (
        <CategoryCard
          key={item.id || index}
          data={item}
          fields={fields}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </GridContainer>
  );
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 300px;
  grid-column: 1 / -1; /* Span all grid columns */
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyMessage = styled.h3`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.8);
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(107, 114, 128, 0.8);
  max-width: 300px;
  line-height: 1.5;
`;