import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./dialog"
import { Button } from "./button"

export interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  cancelText?: string
  confirmText?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "إلغاء",
  confirmText = "تأكيد",
  variant = "default",
  onConfirm
}: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mt-2 text-right">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end mt-6">
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="cursor-pointer"
          >
            {confirmText}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
