import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PaymentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  fromDate?: string;
  onFromDateChange?: (value: string) => void;
  toDate?: string;
  onToDateChange?: (value: string) => void;
}

export const PaymentsToolbar: React.FC<PaymentsToolbarProps> = ({
  search,
  onSearchChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6" dir="rtl">
      <div className="flex flex-1 w-full md:w-auto items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="البحث باسم المركز..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-3 text-right"
          />
        </div>

        {onFromDateChange && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">من:</span>
            <Input
              type="date"
              value={fromDate || ''}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-36 h-9 text-xs"
            />
          </div>
        )}

        {onToDateChange && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">إلى:</span>
            <Input
              type="date"
              value={toDate || ''}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-36 h-9 text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsToolbar;
