
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ReportResultsProps } from '../types';
import ChartVisualization from './visualizations/ChartVisualization';

const ReportResults: React.FC<ReportResultsProps> = ({ 
  reportResults, 
  columns, 
  availableFields,
  visualizationType = 'table' 
}) => {
  if (reportResults.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Report Results</h3>
      
      {visualizationType === 'table' ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col}>
                    {availableFields.find(f => f.value === col)?.label || col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportResults.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col) => (
                    <TableCell key={col}>
                      {String(row[col] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              {reportResults.length} records found
            </TableCaption>
          </Table>
        </div>
      ) : (
        <ChartVisualization 
          visualizationType={visualizationType}
          data={reportResults}
          columns={columns}
          availableFields={availableFields}
        />
      )}
    </div>
  );
};

export default ReportResults;
