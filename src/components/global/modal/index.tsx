import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
};

const Modal = ({
  children,
  description,
  title,
  trigger,
  className,
  isOpen,
  setIsOpen,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={className} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
