import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageWrapper provides a consistent entry/exit animation 
 * for all top-level pages in the CareLink app.
 */
const PageWrapper = ({ children }) => {
  // Animation settings
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10, // Subtle lift effect on entry
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10, // Subtle slide up on exit
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{ width: '100%' }} // Ensures the wrapper doesn't break your layout
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;