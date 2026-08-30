import React from 'react';
import { Button } from '../ui/button';
import type { Meta } from '@/types/api.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTablePaginationProps {
  meta: Meta | undefined;
  onPageChange: (page: number) => void;
}

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  meta,
  onPageChange,
}) => {
  if (!meta) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-2" dir="rtl">
      <div className="text-sm text-muted-foreground">
        عرض الصفحة <span className="font-semibold">{meta.page}</span> من{' '}
        <span className="font-semibold">{meta.totalPages}</span> (إجمالي{' '}
        <span className="font-semibold">{meta.total}</span> نتيجة)
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={!meta.hasPrevPage}
          className="cursor-pointer"
        >
          <ChevronRight className="h-4 w-4 ml-1" />
          <span>السابق</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={!meta.hasNextPage}
          className="cursor-pointer"
        >
          <span>التالي</span>
          <ChevronLeft className="h-4 w-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};
