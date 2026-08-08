const StatCard = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {data.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col gap-2"
          >
            {Icon && (
              <div
                className={`size-10 rounded-xl ${stat.color || ""} flex items-center justify-center`}
              >
                <Icon size={20} />
              </div>
            )}

            <div className="text-2xl font-display font-bold text-primary-950">
              {stat.value}
            </div>

            <div className="text-sm font-medium text-gray-600">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCard;