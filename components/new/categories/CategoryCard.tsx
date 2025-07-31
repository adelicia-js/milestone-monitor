"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { Edit, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface CategoryCardProps {
  data: any;
  fields: Array<{
    key: string;
    label: string;
    type?: 'text' | 'date' | 'status' | 'badge';
  }>;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

export default function CategoryCard({ data, fields, onEdit, onDelete }: CategoryCardProps) {
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

  const formatValue = (value: any, type?: string) => {
    if (!value) return 'N/A';
    
    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'status':
        return value;
      default:
        return value.toString();
    }
  };

  return (
    <Card>
      <CardContent>
        {fields.map((field, index) => (
          <FieldRow key={index}>
            <FieldLabel>{field.label}:</FieldLabel>
            {field.type === 'status' ? (
              <StatusWrapper>
                {getStatusIcon(data[field.key])}
                <StatusText color={getStatusColor(data[field.key])}>
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
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 4px 8px 12px -1px rgba(48, 55, 55, 0.4);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
`;

const FieldValue = styled.span`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(31, 41, 55, 0.9);
  font-size: 0.9rem;
  flex: 1;
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
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
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
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8));
    color: white;
    
    &:hover {
      opacity: 1;
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(59, 130, 246, 1), rgba(37, 99, 235, 1));
    }
  `}
  
  ${props => props.variant === 'delete' && `
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8));
    color: white;
    
    &:hover {
      opacity: 1;
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(239, 68, 68, 1), rgba(220, 38, 38, 1));
    }
  `}
  
  &:active {
    transform: scale(0.95);
  }
`;