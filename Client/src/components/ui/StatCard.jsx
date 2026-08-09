const StatCard = ({ data = [] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {data.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.id}
                        className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col gap-3"
                    >
                        {/* ICON */}
                        {Icon && (
                            <div
                                className={`size-10 rounded-xl ${
                                    stat.color || "bg-gray-100 text-gray-600"
                                } flex items-center justify-center`}
                            >
                                <Icon size={20} strokeWidth={2} />
                            </div>
                        )}

                        {/* VALUE */}
                        <div className="text-xl sm:text-2xl font-display font-bold text-primary-950 truncate">
                            {stat.value}
                        </div>

                        {/* LABEL */}
                        <div className="text-sm font-medium text-gray-500">
                            {stat.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCard;