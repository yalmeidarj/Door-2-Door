const PageHeaderInfo = ({ route, children }: { route: string, children: React.ReactNode }) => {
    return (
        <div className="flex flex-row gap-4 justify-between items-center">
            <div className='flex flex-col'>
                <p className="text-gray-400 text-xs">Current</p>
                <h1 className='text-2xl md:text-2xl font-semibold text-slate-600'>{route}</h1>
            </div>
            {children}
        </div>
    );
};

export default PageHeaderInfo;