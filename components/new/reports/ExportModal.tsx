"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { X, Download, FileText, FileSpreadsheet, FileImage, Settings } from "lucide-react";
import { DisplayData } from "@/lib/hooks/useReport";
import { Faculty } from "@/lib/types";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DisplayData[];
  staffDetails: Faculty[] | null;
}

export default function ExportModal({
  isOpen,
  onClose,
  data,
  staffDetails
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState({
    faculty_id: true,
    faculty_name: true,
    entry_type: true,
    date: true,
    title: true,
    status: true
  });

  const exportFormats = [
    {
      key: 'csv' as const,
      label: 'CSV File',
      description: 'Comma-separated values for spreadsheet applications',
      icon: <FileText size={20} />,
      extension: '.csv'
    },
    {
      key: 'excel' as const,
      label: 'Excel Workbook',
      description: 'Microsoft Excel format with formatting',
      icon: <FileSpreadsheet size={20} />,
      extension: '.xlsx'
    },
    {
      key: 'pdf' as const,
      label: 'PDF Report',
      description: 'Formatted document for printing and sharing',
      icon: <FileImage size={20} />,
      extension: '.pdf'
    }
  ];

  const columnOptions = [
    { key: 'faculty_id', label: 'Faculty ID' },
    { key: 'faculty_name', label: 'Faculty Name' },
    { key: 'entry_type', label: 'Entry Type' },
    { key: 'date', label: 'Date' },
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' }
  ];

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey as keyof typeof prev]
    }));
  };

  const getfacultyname = (id: string) => {
    const faculty = staffDetails?.find((f: Faculty) => f.faculty_id === id);
    return faculty ? faculty.faculty_name : "Unknown Faculty";
  };

  const handleExport = () => {
    const filteredData = data.map(row => {
      const filteredRow: any = {};
      
      if (selectedColumns.faculty_id) filteredRow['Faculty ID'] = row.faculty_id;
      if (selectedColumns.faculty_name) filteredRow['Faculty Name'] = getfacultyname(row.faculty_id);
      if (selectedColumns.entry_type) filteredRow['Entry Type'] = row.entry_type;
      if (selectedColumns.date) filteredRow['Date'] = row.date;
      if (selectedColumns.title) filteredRow['Title'] = row.title;
      if (selectedColumns.status) filteredRow['Status'] = row.status;
      
      return filteredRow;
    });

    switch (selectedFormat) {
      case 'csv':
        exportToCSV(filteredData);
        break;
      case 'excel':
        exportToExcel(filteredData);
        break;
      case 'pdf':
        exportToPDF(filteredData);
        break;
    }

    onClose();
  };

  const exportToCSV = (exportData: any[]) => {
    if (exportData.length === 0) return;

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      includeHeaders ? headers.join(',') : '',
      ...exportData.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].filter(row => row).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reports_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (exportData: any[]) => {
    // For now, export as CSV with .xlsx extension
    // In a real implementation, you'd use a library like xlsx or exceljs
    console.log('Excel export would be implemented with xlsx library', exportData);
    exportToCSV(exportData);
  };

  const exportToPDF = (exportData: any[]) => {
    // For now, show an alert
    // In a real implementation, you'd use a library like jsPDF or Puppeteer
    console.log('PDF export would be implemented with jsPDF library', exportData);
    alert('PDF export feature coming soon!');
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Export Reports</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Section>
            <SectionTitle>
              <Download size={16} />
              Export Format
            </SectionTitle>
            <FormatGrid>
              {exportFormats.map((format) => (
                <FormatOption
                  key={format.key}
                  selected={selectedFormat === format.key}
                  onClick={() => setSelectedFormat(format.key)}
                >
                  <FormatIcon>{format.icon}</FormatIcon>
                  <FormatInfo>
                    <FormatLabel>{format.label}</FormatLabel>
                    <FormatDescription>{format.description}</FormatDescription>
                  </FormatInfo>
                </FormatOption>
              ))}
            </FormatGrid>
          </Section>

          <Section>
            <SectionTitle>
              <Settings size={16} />
              Export Options
            </SectionTitle>
            <OptionsGrid>
              <OptionRow>
                <Checkbox
                  type="checkbox"
                  id="includeHeaders"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                />
                <OptionLabel htmlFor="includeHeaders">Include column headers</OptionLabel>
              </OptionRow>
            </OptionsGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FileText size={16} />
              Columns to Include
            </SectionTitle>
            <ColumnsGrid>
              {columnOptions.map((column) => (
                <ColumnOption key={column.key}>
                  <Checkbox
                    type="checkbox"
                    id={column.key}
                    checked={selectedColumns[column.key as keyof typeof selectedColumns]}
                    onChange={() => handleColumnToggle(column.key)}
                  />
                  <OptionLabel htmlFor={column.key}>{column.label}</OptionLabel>
                </ColumnOption>
              ))}
            </ColumnsGrid>
          </Section>

          <ExportSummary>
            <SummaryText>
              Ready to export <strong>{data.length}</strong> records in <strong>{selectedFormat.toUpperCase()}</strong> format
            </SummaryText>
          </ExportSummary>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ExportButton onClick={handleExport}>
            <Download size={16} />
            Export {selectedFormat.toUpperCase()}
          </ExportButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: rgba(244, 253, 252, 0.95);
  backdrop-filter: blur(10px);
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(56, 68, 68, 0.1);
`;

const ModalTitle = styled.h2`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: rgba(239, 68, 68, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: rgba(239, 68, 68, 1);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 1rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const FormatGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const FormatOption = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? 'rgba(4, 103, 112, 0.5)' : 'rgba(56, 68, 68, 0.2)'};
  border-radius: 0.75rem;
  background: ${props => props.selected ? 'rgba(4, 103, 112, 0.1)' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(4, 103, 112, 0.4);
    background: rgba(4, 103, 112, 0.05);
  }
`;

const FormatIcon = styled.div`
  color: rgba(4, 103, 112, 0.8);
`;

const FormatInfo = styled.div`
  flex: 1;
`;

const FormatLabel = styled.div`
  font-family: ${bodyText.style.fontFamily};
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

const FormatDescription = styled.div`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(107, 114, 128, 0.8);
  font-size: 0.85rem;
  line-height: 1.4;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const ColumnsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ColumnOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  accent-color: rgba(4, 103, 112, 0.8);
  cursor: pointer;
`;

const OptionLabel = styled.label`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(31, 41, 55, 0.9);
  font-size: 0.9rem;
  cursor: pointer;
`;

const ExportSummary = styled.div`
  padding: 1rem;
  background: rgba(4, 103, 112, 0.1);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.75rem;
  margin-top: 1rem;
`;

const SummaryText = styled.p`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(4, 103, 112, 0.9);
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(56, 68, 68, 0.1);
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(107, 114, 128, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(107, 114, 128, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(107, 114, 128, 0.1);
    border-color: rgba(107, 114, 128, 0.5);
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.9), rgba(6, 95, 70, 0.9));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(4, 103, 112, 1), rgba(6, 95, 70, 1));
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;