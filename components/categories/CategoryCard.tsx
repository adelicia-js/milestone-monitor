"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { Edit, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface CategoryCardProps<T> {
  data: T;
  fields: Array<{
    key: string;
    label: string;
    type?: 'text' | 'date' | 'status' | 'badge';
  }>;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
}

export default function CategoryCard<T extends Record<string, string | number | boolean | null | undefined>>({ data, fields, onEdit, onDelete }: CategoryCardProps<T>) {
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle size={16} color="#059669" />;
      case 'pending':
        return <Clock size={16} color="#d97706" />;
      case 'rejected':
        return <XCircle size={16} color="#dc2626" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '#059669';
      case 'pending':
        return '#d97706';
      case 'rejected':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const formatValue = (value: string | number | boolean | null | undefined, type?: string) => {
    if (!value) return 'N/A';
    
    let formattedValue: string;
    switch (type) {
      case 'date':
        if (typeof value === 'string' || typeof value === 'number') {
          formattedValue = new Date(value).toLocaleDateString();
        } else {
          formattedValue = 'N/A';
        }
        break;
      case 'status':
        formattedValue = String(value);
        break;
      default:
        formattedValue = String(value);
    }
    
    // Truncate text if it exceeds the specified length (only for strings, not dates/status)
    const maxLength = "Getting employed in a soul".length; // 25 characters
    if (type !== 'status' && type !== 'date' && typeof value === 'string' && formattedValue.length > maxLength) {
      return formattedValue.substring(0, maxLength - 3) + "...";
    }
    
    return formattedValue;
  };

  return (
    <Card>
      <CardContent>
        {fields.map((field, index) => (
          <FieldRow key={index}>
            <FieldLabel>{field.label}:</FieldLabel>
            {field.type === 'status' ? (
              <StatusWrapper>
                {getStatusIcon(String(data[field.key] || ''))}
                <StatusText color={getStatusColor(String(data[field.key] || ''))}>
                  {formatValue(data[field.key], field.type)}
                </StatusText>
              </StatusWrapper>
            ) : field.type === 'badge' ? (
              <Badge>{formatValue(data[field.key], field.type)}</Badge>
            ) : (
              <FieldValue>{formatValue(data[field.key], field.type)}</FieldValue>
            )}
          </FieldRow>
        ))}
      </CardContent>
      
      <ActionButtons>
        {onEdit && (
          <ActionButton onClick={() => onEdit(data)} variant="edit">
            <Edit size={16} />
          </ActionButton>
        )}
        {onDelete && (
          <ActionButton onClick={() => onDelete(data)} variant="delete">
            <Trash2 size={16} />
          </ActionButton>
        )}
      </ActionButtons>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.75);
  padding: 1.5rem;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.25rem;
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FieldLabel = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  font-size: 0.85rem;
  min-width: 120px;
  
  @media (min-width: 768px) {
    min-width: 140px;
  }
  
  @media (max-width: 1024px) {
    font-size: 0.8rem;
    min-width: 110px;
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    min-width: 100px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    min-width: 90px;
  }
`;

const FieldValue = styled.span`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(31, 41, 55, 0.9);
  font-size: 0.9rem;
  flex: 1;
  
  @media (max-width: 1024px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusText = styled.span<{ color: string }>`
  font-family: ${bodyText.style.fontFamily};
  color: ${props => props.color};
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: capitalize;
  
  @media (max-width: 1024px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.1), rgba(6, 95, 70, 0.1));
  color: rgba(4, 103, 112, 0.9);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.8rem;
  font-weight: 500;
  
  @media (max-width: 1024px) {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant: 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.7;
  
  ${props => props.variant === 'edit' && `
    background: linear-gradient(135deg, rgba(122, 194, 226, 0.8), rgba(37, 99, 235, 0.8));
    color: white;
    
    &:hover {
      opacity: 1;
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(96, 165, 250, 0.95), rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 1));
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  `}
  
  ${props => props.variant === 'delete' && `
    background: linear-gradient(135deg, rgba(228, 150, 148, 0.8), rgba(220, 38, 38, 0.8));
    color: white;
    
    &:hover {
      opacity: 1;
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(248, 113, 113, 0.95), rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 1));
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  `}
  
  &:active {
    transform: scale(0.95);
  }
`;