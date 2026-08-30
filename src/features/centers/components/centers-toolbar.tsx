import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CentersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onActiveFilterChange: (value: string) => void;
}

export const CentersToolbar: React.FC<CentersToolbarProps> = ({
  search,
  onSearchChange,
  activeFilter,
  onActiveFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6" dir="rtl">
      <div className="flex flex-1 w-full md:w-auto items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="البحث في المراكز..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-3 text-right"
          />
        </div>
        
        <div className="w-40">
          <Select
            value={activeFilter}
            onChange={(e) => onActiveFilterChange(e.target.value)}
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشطة</option>
            <option value="inactive">معطلة</option>
          </Select>
        </div>
      </div>

      <Link to="/centers/new" className="w-full md:w-auto">
        <Button className="w-full md:w-auto cursor-pointer gap-2">
          <Plus className="h-4 w-4" />
          <span>إنشاء مركز جديد (Onboarding)</span>
        </Button>
      </Link>
    </div>
  );
};
