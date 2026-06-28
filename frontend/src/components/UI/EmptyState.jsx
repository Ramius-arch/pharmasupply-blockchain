import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EmptyState = ({
  icon,
  title = 'No data available',
  description = 'There is nothing to display at the moment.',
  action,
}) => {
  return (
    <div className="empty-state card" role="status" aria-live="polite">
      {icon && (
        <div className="empty-state-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <div className="empty-state-title">{title}</div>
      <p>{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
