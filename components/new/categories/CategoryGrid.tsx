"use client";

import React from "react";
import styled from "styled-components";
import CategoryCard from "./CategoryCard";
import { Inter } from "next/font/google";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface CategoryGridProps {
  data: any[];
  fields: Array<{
    key: string;
    label: string;
    type?: 'text' | 'date' | 'status' | 'badge';
  }>;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
  emptyMessage?: string;
}

export default function CategoryGrid({ 
  data, 
  fields, 
  onEdit, 
  onDelete, 
  emptyMessage = "No items found" 
}: CategoryGridProps) {
  if (!data || data.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📋</EmptyIcon>
        <EmptyMessage>{emptyMessage}</EmptyMessage>
        <EmptySubtext>Start by adding your first entry using the &quot;Add New&quot; button above.</EmptySubtext>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
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