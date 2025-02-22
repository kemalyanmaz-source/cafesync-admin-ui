import * as React from "react";

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const Dialog = ({ open, onOpenChange, children, ...props }: DialogProps) => {
    return open ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md w-96" {...props}>
                {children}
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={() => onOpenChange?.(false)}
                >
                    ✕
                </button>
            </div>
        </div>
    ) : null;
};


export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
    ({ asChild, ...props }, ref) => {
        if (asChild) {
            return <span ref={ref} {...props} />;
        }
        return <button ref={ref} {...props} />;
    }
);

DialogTrigger.displayName = "DialogTrigger";

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
    return <div className={`border-b pb-2 mb-2 font-semibold text-lg ${className}`} {...props} />;
};

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
    return <div className={`border-t pt-2 mt-2 flex justify-end ${className}`} {...props} />;
};

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
    return <div className={`p-4 ${className}`} {...props} />;
};

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => {
    return <h2 className={`text-xl font-bold ${className}`} {...props} />;
  };