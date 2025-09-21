import React, { useState } from "react";

const Collapsible = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = useState(open);
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
    onOpenChange && onOpenChange(!isOpen);
  };
  
  return children({ isOpen, handleToggle });
};
const CollapsibleTrigger = ({ asChild, children, onClick }) => {
  if (asChild) {
    return React.cloneElement(React.Children.only(children), { onClick });
  }
  
  return <div onClick={onClick}>{children}</div>;
};
const CollapsibleContent = ({ children, isOpen }) => {
  return isOpen ? children : null;
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };