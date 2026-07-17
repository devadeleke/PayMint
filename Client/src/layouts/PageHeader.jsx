const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-primary-950">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PageHeader;