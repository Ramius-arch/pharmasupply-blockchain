const DashboardOverview = ({ totalOrders, revenue, users }) => {
  return (
    <div className="overview-grid">
      <div className="stat-card">
        <span className="stat-label">Total Shipments</span>
        <div className="stat-value">{totalOrders.toLocaleString()}</div>
      </div>
      <div className="stat-card">
        <span className="stat-label">Transaction Value</span>
        <div className="stat-value">${(revenue / 100).toLocaleString()}</div>
      </div>
      <div className="stat-card">
        <span className="stat-label">System Stakeholders</span>
        <div className="stat-value">{users.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default DashboardOverview;
