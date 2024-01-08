

const NotLoggedIn = async () => {
    return (
        <div className="flex items-center justify-center">
            <div className="bg-sky-700 text-slate-100 p-2 rounded shadow items-center justify-center mt-4">
                <p>You need to be clocked In to Edit info.</p>
            </div>
        </div>
    );
};

export default NotLoggedIn;