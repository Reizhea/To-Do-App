export const getDeadlineLabel = (deadlineDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineDate);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day(s)`;
    }
    if (diffDays === 0) {
      return `Due Today`;
    }
    if (diffDays === 1) {
      return `Due Tomorrow`;
    }
    return `Due in ${diffDays} days`;
  };
  