import * as React from "react";

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border rounded-md">
      <button
        className="w-full text-left px-4 py-2 bg-gray-100 font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title} {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};
